package com.aibusiness.namegenerator.controller;

import com.aibusiness.namegenerator.dto.NameGenerationRequest;
import com.aibusiness.namegenerator.dto.NameGenerationResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/names")
public class NameController {

    private static final Logger log = LoggerFactory.getLogger(NameController.class);

    @PostMapping("/generate")
    public NameGenerationResponse generateNames(@RequestBody NameGenerationRequest request) {
        log.info("Received request to generate {} names for prompt: '{}'", request.getCount(), request.getPrompt());

        // --- AI Integration Point ---
        // Here, you would use a RestTemplate or WebClient to make a POST request
        // to your chosen Generative AI provider's API (e.g., Google Gemini, OpenAI).
        // You would send the prompt from the request and parse the response.
        // For example:
        // List<String> generatedNames = aiApiService.generate(request.getPrompt(), request.getCount());
        // return new NameGenerationResponse(generatedNames);
        // -----------------------------

        // For now, we will return mock data.
        List<String> mockNames = List.of(
                "The Daily Grind",
                "Bean Scene",
                "Aroma Mocha",
                "Page & Pour",
                "Novel Brews"
        );

        return new NameGenerationResponse(mockNames.subList(0, Math.min(request.getCount(), mockNames.size())));
    }
}
