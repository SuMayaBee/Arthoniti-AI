package com.aibusiness.rag.service;

import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.ai.transformer.splitter.TextSplitter;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class IngestionService {

    private final WebClient.Builder webClientBuilder;

    /**
     * Processes an uploaded file, chunks it, and returns a list of Documents.
     */
    public List<Document> processFile(MultipartFile file) throws IOException {
        Resource resource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };

        // Use Tika to read and parse the document content
        TikaDocumentReader reader = new TikaDocumentReader(resource);
        List<Document> documents = reader.get();

        // Split the document into smaller chunks for effective embedding
        TextSplitter textSplitter = new TokenTextSplitter();
        return textSplitter.apply(documents);
    }

    /**
     * Processes a web URL, scrapes its content, chunks it, and returns a list of Documents.
     */
    public List<Document> processUrl(String url) {
        // A more advanced scraper would be needed for JS-heavy sites (e.g., using Playwright)
        String content = webClientBuilder.build()
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .block(); // Block for simplicity in this flow

        Document document = new Document(content, Map.of("source", url));
        TextSplitter textSplitter = new TokenTextSplitter();
        return textSplitter.apply(List.of(document));
    }
}
