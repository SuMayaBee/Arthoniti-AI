package com.aibusiness.presentation.service;

import com.aibusiness.presentation.dto.SlideGenerationRequest;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.image.ImageClient;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class PresentationAiService {
    private final ChatClient chatClient;
    private final ImageClient imageClient;
    
    public PresentationAiService(ChatClient.Builder chatClientBuilder, ImageClient imageClient) {
        this.chatClient = chatClientBuilder.build();
        this.imageClient = imageClient;
    }

    public String generateSlidesXml(String fullPrompt) {
        PromptTemplate promptTemplate = new PromptTemplate(fullPrompt);
        return chatClient.prompt(promptTemplate.create()).call().content();
    }
    
    public String generateImage(String prompt, String size, String quality) {
        ImageResponse response = imageClient.call(
            new ImagePrompt(prompt,
                org.springframework.ai.image.ImageOptionsBuilder.builder()
                        .withSize(size)
                        .withQuality(quality)
                        .build())
        );
        return response.getResult().getOutput().getB64Json();
    }
}
