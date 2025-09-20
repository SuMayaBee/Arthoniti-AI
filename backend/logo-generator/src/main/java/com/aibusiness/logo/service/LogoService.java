package com.aibusiness.logo.service;

import com.aibusiness.logo.dto.LogoDesignRequest;
import com.aibusiness.logo.dto.LogoResponse;
import com.aibusiness.logo.dto.RemoveBgRequest;
import com.aibusiness.logo.entity.Logo;
import com.aibusiness.logo.enums.ColorPalette;
import com.aibusiness.logo.enums.LogoStyle;
import com.aibusiness.logo.exception.LogoNotFoundException;
import com.aibusiness.logo.exception.ValidationException;
import com.aibusiness.logo.repository.LogoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LogoService {

    private final LogoRepository logoRepository;
    private final LogoAiService logoAiService;
    private final StorageService storageService;
    private final WebClient.Builder webClientBuilder;

    @Value("${removebg.api-key}")
    private String removeBgApiKey;

    @Transactional
    public LogoResponse createLogo(LogoDesignRequest request) throws IOException {
        validateRequest(request);

        // 1. Generate the JSON design specification from the AI
        Map<String, Object> content = logoAiService.generateDesignSpecification(request);

        // 2. Extract the enhanced prompt for image generation
        String enhancedPrompt = (String) content.get("enhanced_prompt");
        if (enhancedPrompt == null) {
            throw new RuntimeException("AI failed to generate an enhanced prompt for the image.");
        }

        // 3. Generate the logo image from the AI
        String base64Image = logoAiService.generateLogoImage(enhancedPrompt);

        // 4. Upload the generated image to GCS
        String imageUrl = storageService.uploadFromBase64(base64Image, request.getLogoTitle());

        // 5. Build and save the Logo entity to the database
        Logo logo = Logo.builder()
                .userId(request.getUserId())
                .logoTitle(request.getLogoTitle())
                .logoVision(request.getLogoVision())
                .colorPaletteName(request.getColorPaletteName())
                .logoStyle(request.getLogoStyle())
                .logoImageUrl(imageUrl)
                .content(content)
                .build();
        Logo savedLogo = logoRepository.save(logo);

        return mapToResponse(savedLogo);
    }

    @Transactional
    public Logo removeBackground(RemoveBgRequest request) throws IOException {
        Logo logo = logoRepository.findById(request.getLogoId())
                .orElseThrow(() -> new LogoNotFoundException("Logo not found"));

        // Use WebClient for the external API call
        WebClient webClient = webClientBuilder.baseUrl("https://api.remove.bg/v1.0").build();
        byte[] imageBytes = webClient.post()
            .uri("/removebg")
            .header("X-Api-Key", removeBgApiKey)
            .body(BodyInserters.fromFormData("image_url", logo.getLogoImageUrl()))
            .retrieve()
            .bodyToMono(byte[].class)
            .block(); // Block for simplicity, async is better in high-load scenarios

        if (imageBytes == null) {
            throw new RuntimeException("Failed to remove background: API returned no data.");
        }

        String bgRemovedFileName = logo.getLogoTitle() + "_nobg";
        String removedBgUrl = storageService.uploadFromBase64(java.util.Base64.getEncoder().encodeToString(imageBytes), bgRemovedFileName);

        logo.setRemoveBgLogoImageUrl(removedBgUrl);
        return logoRepository.save(logo);
    }
    
    public LogoResponse getLogoById(Long id) {
        return logoRepository.findById(id).map(this::mapToResponse)
                .orElseThrow(() -> new LogoNotFoundException("Logo not found"));
    }

    public List<LogoResponse> getLogosByUserId(Long userId) {
        return logoRepository.findByUserId(userId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public void deleteLogo(Long id) {
        if (!logoRepository.existsById(id)) {
            throw new LogoNotFoundException("Logo not found");
        }
        logoRepository.deleteById(id);
    }


    private void validateRequest(LogoDesignRequest request) {
        // Validate Color Palette
        Arrays.stream(ColorPalette.values())
                .filter(p -> p.getPaletteName().equalsIgnoreCase(request.getColorPaletteName()))
                .findFirst()
                .orElseThrow(() -> new ValidationException("color_palette_name", "Invalid color palette name. Available palettes: " +
                        Arrays.stream(ColorPalette.values()).map(ColorPalette::getPaletteName).collect(Collectors.joining(", "))));

        // Validate Logo Style
        Arrays.stream(LogoStyle.values())
                .filter(s -> s.getStyleName().equalsIgnoreCase(request.getLogoStyle()))
                .findFirst()
                .orElseThrow(() -> new ValidationException("logo_style", "Invalid logo style. Available styles: " +
                        Arrays.stream(LogoStyle.values()).map(LogoStyle::getStyleName).collect(Collectors.joining(", "))));
    }

    private LogoResponse mapToResponse(Logo logo) {
        return new LogoResponse(
                logo.getId(),
                logo.getUserId(),
                logo.getLogoImageUrl(),
                logo.getRemoveBgLogoImageUrl(),
                logo.getContent(),
                logo.getLogoTitle(),
                logo.getLogoVision(),
                logo.getColorPaletteName(),
                logo.getLogoStyle(),
                logo.getCreatedAt(),
                logo.getUpdatedAt()
        );
    }
}
