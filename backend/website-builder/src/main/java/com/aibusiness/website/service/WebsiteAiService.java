package com.aibusiness.website.service;

import com.aibusiness.website.dto.CodeGenerationResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WebsiteAiService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public String getChatResponse(String prompt) {
        String systemPrompt = "You are a helpful AI assistant specializing in web development. Provide concise, helpful answers.";
        return chatClient.prompt()
                .system(systemPrompt)
                .user(prompt)
                .call()
                .content();
    }

    public String enhancePrompt(String prompt) {
        String template = """
            You are an expert prompt engineer for a React code generation AI.
            Enhance the following user prompt to be highly detailed and specific for generating a complete, modern, and professional website.
            Include details about layout, components, styling (like Tailwind CSS), interactivity, and responsiveness.
            User Prompt: "{prompt}"
            Enhanced Prompt:
            """;
        PromptTemplate promptTemplate = new PromptTemplate(template, Map.of("prompt", prompt));
        return chatClient.prompt(promptTemplate.create()).call().content();
    }

    public CodeGenerationResponse generateCode(String prompt) {
        String systemPrompt = """
            You are a world-class AI developer that generates complete React projects.
            You must respond with a single, valid JSON object, and nothing else.
            The JSON object must have three keys: "projectTitle" (a string), "explanation" (a string), and "files" (an object).
            The "files" object should contain file paths as keys (e.g., "src/App.js") and the file content as a string value.
            Create a complete, runnable React project using Vite and Tailwind CSS. Include package.json, vite.config.js, tailwind.config.js, and all necessary source files.
            """;
        String responseString = chatClient.prompt()
                .system(systemPrompt)
                .user(prompt)
                .call()
                .content();

        try {
            return objectMapper.readValue(responseString, CodeGenerationResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI response into CodeGenerationResponse", e);
        }
    }
}
