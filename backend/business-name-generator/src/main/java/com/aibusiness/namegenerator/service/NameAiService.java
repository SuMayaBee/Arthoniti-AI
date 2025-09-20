package com.aibusiness.namegenerator.service;

import com.aibusiness.namegenerator.dto.BusinessGenerationRequest;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NameAiService {

    private final ChatClient chatClient;

    public NameAiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public List<String> generateNames(BusinessGenerationRequest request) {
        String promptText = """
                You are an expert brand strategist. Generate a list of {no_of_names} creative and unique business names.
                The names should be separated by commas and nothing else. Do not number them or add any other text.

                **Business Details:**
                - **Industry:** {industry}
                - **Description:** {prompts}
                - **Desired Tone:** {name_tone}

                Generate the names now.
                """;
        PromptTemplate promptTemplate = new PromptTemplate(promptText, Map.of(
                "no_of_names", request.getNoOfNames(),
                "industry", request.getIndustry(),
                "prompts", request.getPrompts(),
                "name_tone", request.getNameTone()
        ));

        String rawResponse = chatClient.prompt(promptTemplate.create()).call().content();

        // The AI might return names on new lines or with extra spaces. Clean this up.
        return Arrays.stream(rawResponse.split(","))
                .map(String::trim)
                .filter(name -> !name.isEmpty())
                .collect(Collectors.toList());
    }
}
