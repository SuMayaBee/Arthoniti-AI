package com.aibusiness.presentation.service;

import com.aibusiness.presentation.dto.*;
import com.aibusiness.presentation.entity.Presentation;
import com.aibusiness.presentation.entity.PresentationImage;
import com.aibusiness.presentation.exception.PresentationNotFoundException;
import com.aibusiness.presentation.repository.PresentationImageRepository;
import com.aibusiness.presentation.repository.PresentationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PresentationService {
    private final PresentationRepository presentationRepository;
    private final PresentationImageRepository imageRepository;
    private final PresentationAiService aiService;
    private final RagContextService ragService;
    private final StorageService storageService;
    private final ObjectMapper objectMapper;

    @Transactional
    public UnifiedGenerationResponse generateUnifiedPresentation(UnifiedGenerationRequest request) {
        long startTime = System.currentTimeMillis();
        List<Map<String, Object>> contextSourcesUsed = new ArrayList<>();
        StringBuilder contextBuilder = new StringBuilder();

        // 1. Process RAG context
        if (request.getContextFiles() != null) {
            for (MultipartFile file : request.getContextFiles()) {
                try {
                    String text = ragService.extractTextFromFile(file);
                    contextBuilder.append("\n\n--- Document Content: ").append(file.getOriginalFilename()).append(" ---\n").append(text);
                    contextSourcesUsed.add(Map.of("type", "document", "filename", file.getOriginalFilename(), "content_length", text.length()));
                } catch (IOException e) { /* Log and continue */ }
            }
        }
        if (request.getWebsiteUrls() != null && !request.getWebsiteUrls().isBlank()) {
            for (String url : request.getWebsiteUrls().split(",")) {
                String content = ragService.fetchContentFromUrl(url.trim());
                contextBuilder.append("\n\n--- Website Content: ").append(url).append(" ---\n").append(content);
                contextSourcesUsed.add(Map.of("type", "website", "url", url.trim(), "content_length", content.length()));
            }
        }
        
        // 2. Build the full AI prompt
        String fullPrompt = buildUnifiedPrompt(request, contextBuilder.toString());
        
        // 3. Generate XML from AI
        String xmlResponse = aiService.generateSlidesXml(fullPrompt);
        
        // 4. Save presentation to DB
        Presentation presentation = Presentation.builder()
                .userId(request.getUserId())
                .title(request.getPrompt())
                .content(Map.of("xml", xmlResponse, "request", request))
                .theme(request.getColorTheme())
                .language(request.getLanguage())
                .tone(request.getTone())
                .createdAt(ZonedDateTime.now())
                .build();
        Presentation savedPresentation = presentationRepository.save(presentation);
        
        // 5. Generate images if requested
        List<ImageGenerationResponse> generatedImages = new ArrayList<>();
        if (request.isGenerateImages()) {
            List<String> imagePrompts = extractImagePromptsFromXml(xmlResponse);
            for (String imgPrompt : imagePrompts) {
                 generatedImages.add(generateAndSaveImage(imgPrompt, savedPresentation.getId()));
            }
        }
        
        double processingTime = (System.currentTimeMillis() - startTime) / 1000.0;
        
        return UnifiedGenerationResponse.builder()
                .success(true)
                .presentationXml(xmlResponse)
                .slidesCount(request.getSlidesCount())
                .processingTime(processingTime)
                .generatedImages(generatedImages)
                .contextSourcesUsed(contextSourcesUsed)
                .databaseId(savedPresentation.getId())
                .presentationId(savedPresentation.getId()) // alias
                .prompt(request.getPrompt())
                .theme(request.getColorTheme())
                .language(request.getLanguage())
                .tone(request.getTone())
                .build();
    }
    
    // --- Outline Generation ---
    public String generateOutline(String prompt, int numberOfCards, String language) {
        // Compose prompt for AI service (reuse generateSlidesXml for outline)
        String outlinePrompt = "Generate a structured outline for a presentation on: '" + prompt + "' with " + numberOfCards + " sections. Language: " + (language != null ? language : "English") + ". Return only the outline as plain text.";
        return aiService.generateSlidesXml(outlinePrompt);
    }

    // --- Slide Generation ---
    public String generateSlides(String title, List<String> outline, String language, String tone) {
        // Compose prompt for AI service
        String slidesPrompt = "Generate XML-formatted slides for presentation titled: '" + title + "' with outline: " + outline + ". Language: " + (language != null ? language : "English") + ", Tone: " + (tone != null ? tone : "Professional");
        return aiService.generateSlidesXml(slidesPrompt);
    }

    // --- CRUD Operations ---
    public Presentation createPresentation(Presentation presentation) {
        return presentationRepository.save(presentation);
    }

    public Presentation getPresentationById(Long id) {
        return presentationRepository.findById(id).orElseThrow(() -> new PresentationNotFoundException("Presentation not found"));
    }

    public Presentation updatePresentation(Long id, Presentation updated) {
        Presentation existing = getPresentationById(id);
        existing.setTitle(updated.getTitle());
        existing.setContent(updated.getContent());
        existing.setTheme(updated.getTheme());
        existing.setLanguage(updated.getLanguage());
        existing.setTone(updated.getTone());
        return presentationRepository.save(existing);
    }

    public void deletePresentation(Long id) {
        if (!presentationRepository.existsById(id)) throw new PresentationNotFoundException("Presentation not found");
        presentationRepository.deleteById(id);
    }

    public List<Presentation> getPresentationsByUserId(Long userId) {
        return presentationRepository.findByUserId(userId);
    }

    // No getPresentationsByUserEmail: not supported by entity/repo
    
    private String buildUnifiedPrompt(UnifiedGenerationRequest request, String context) {
         // This method would construct a very detailed prompt for the AI,
         // combining the user's form input and the RAG context.
        return "Generate a " + request.getSlidesCount() + " slide presentation in XML format on the topic: '" + request.getPrompt() + "'. Use the following context if provided:\n" + context + "\n\n" + "The XML must have a root <presentation> element and multiple <slide> children...";
    }

    private List<String> extractImagePromptsFromXml(String xml) {
        List<String> prompts = new ArrayList<>();
        try {
            Document doc = DocumentBuilderFactory.newInstance().newDocumentBuilder()
                    .parse(new ByteArrayInputStream(xml.getBytes(StandardCharsets.UTF_8)));
            NodeList nodes = doc.getElementsByTagName("image_prompt");
            for (int i = 0; i < nodes.getLength(); i++) {
                prompts.add(nodes.item(i).getTextContent());
            }
        } catch (Exception e) { /* Log error */ }
        return prompts;
    }
    
    private ImageGenerationResponse generateAndSaveImage(String prompt, Long presentationId) {
        String base64Image = aiService.generateImage(prompt, "1792x1024", "hd");
        String filename = prompt.replaceAll("[^a-zA-Z0-9]", "_").substring(0, Math.min(prompt.length(), 50));
        String imageUrl = storageService.uploadFromBase64(base64Image, filename);
        
        PresentationImage image = PresentationImage.builder()
                .presentationId(presentationId)
                .imageUrl(imageUrl)
                .prompt(prompt)
                .filename(filename + ".png")
                .model("dall-e-3")
                .size("1792x1024")
                .build();
        imageRepository.save(image);
        
        return ImageGenerationResponse.builder().success(true).url(imageUrl).prompt(prompt).model("dall-e-3").build();
    }
}

