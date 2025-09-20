package com.aibusiness.logo.service;

import com.aibusiness.logo.dto.LogoDesignRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.image.ImageClient;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class LogoAiService {

    private final ChatClient chatClient;
    private final ImageClient imageClient;
    private final ObjectMapper objectMapper;

    // Injecting the builders allows for more flexible client creation
    public LogoAiService(ChatClient.Builder chatClientBuilder, ImageClient imageClient, ObjectMapper objectMapper) {
        this.chatClient = chatClientBuilder.build();
        this.imageClient = imageClient;
        this.objectMapper = objectMapper;
    }

    public Map<String, Object> generateDesignSpecification(LogoDesignRequest request) {
        String promptText = """
                You are a professional logo designer. Create a detailed design specification in JSON format for a logo.
                The specification must follow the exact structure provided in the example.
                Do not include any text or markdown formatting outside of the JSON object.

                **Client Brief:**
                - Logo Title: {logo_title}
                - Vision: {logo_vision}
                - Color Palette: {color_palette_name}
                - Style: {logo_style}

                **JSON Structure Example:**
                {
                  "design_specification": { "logo_overview": { "title": "...", "concept": "...", ... }, ... },
                  "generation_type": "complete_logo_design",
                  "enhanced_prompt": "A highly detailed, descriptive prompt for an image generation model like DALL-E 3...",
                  "image_model": "dall-e-3"
                }

                Now, generate the complete JSON for the provided client brief.
                """;

        PromptTemplate promptTemplate = new PromptTemplate(promptText, Map.of(
                "logo_title", request.getLogoTitle(),
                "logo_vision", request.getLogoVision(),
                "color_palette_name", request.getColorPaletteName(),
                "logo_style", request.getLogoStyle()
        ));
        
        String jsonResponse = chatClient.prompt(promptTemplate.create()).call().content();

        try {
            // Remove markdown backticks if the AI includes them
            jsonResponse = jsonResponse.replace("```json", "").replace("```", "").trim();
            return objectMapper.readValue(jsonResponse, Map.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse AI-generated JSON specification", e);
        }
    }
    
    public String generateLogoImage(String enhancedPrompt) {
        ImageResponse response = imageClient.call(new ImagePrompt(enhancedPrompt));
        // Return the Base64 encoded image data
        return response.getResult().getOutput().getB64Json();
    }
}
