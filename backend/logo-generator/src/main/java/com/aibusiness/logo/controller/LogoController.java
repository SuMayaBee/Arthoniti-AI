package com.aibusiness.logo.controller;

import com.aibusiness.logo.dto.LogoGenerationRequest;
import com.aibusiness.logo.dto.LogoGenerationResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/v1/logos")
public class LogoController {

    private static final Logger log = LoggerFactory.getLogger(LogoController.class);

    @PostMapping("/generate")
    public LogoGenerationResponse generateLogo(@RequestBody LogoGenerationRequest request) {
        log.info("Received logo generation request for prompt: '{}' with style: '{}'",
                request.getPrompt(), request.getStyle());

        // --- AI Integration Point ---
        // Here you would use a WebClient or RestTemplate to call an external
        // image generation API (like DALL-E, Midjourney, or Stable Diffusion).
        // You would send the prompt and style, and the API would return a URL
        // to the generated image, which you would then pass into the response.
        // For example:
        // String generatedUrl = imageGenerationClient.generate(request.getPrompt(), request.getStyle());
        // return new LogoGenerationResponse(generatedUrl);
        // -----------------------------

        // For now, we return a URL to a placeholder image. This is a great way
        // to mock the response while building the frontend.
        String placeholderText = URLEncoder.encode(request.getPrompt(), StandardCharsets.UTF_8);
        String mockImageUrl = String.format("https://placehold.co/512x512/EEE/31343C?text=%s&font=montserrat", placeholderText);



        return new LogoGenerationResponse(mockImageUrl);
    }
}
