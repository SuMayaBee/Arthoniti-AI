package com.aibusiness.presentation.service;

import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class RagContextService {

    private final Tika tika = new Tika();
    private final WebClient.Builder webClientBuilder;

    public String extractTextFromFile(MultipartFile file) throws IOException {
        try {
            return tika.parseToString(file.getInputStream());
        } catch (Exception e) {
            // Tika can throw various exceptions
            throw new IOException("Failed to parse file: " + file.getOriginalFilename(), e);
        }
    }

    public String fetchContentFromUrl(String url) {
        try {
            // A more robust implementation would handle different content types
            return webClientBuilder.build()
                    .get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(); // Block for simplicity in this workflow
        } catch (Exception e) {
            // Log the error but don't fail the entire presentation generation
            System.err.println("Failed to fetch URL content: " + url + " Error: " + e.getMessage());
            return ""; // Return empty string on failure
        }
    }
}
