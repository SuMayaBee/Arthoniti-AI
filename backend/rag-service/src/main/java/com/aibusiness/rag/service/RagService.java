package com.aibusiness.rag.service;

import com.aibusiness.rag.dto.QueryResponse;
import com.aibusiness.rag.entity.Document;
import com.aibusiness.rag.repository.DocumentRepository;
import com.pgvector.PGvector;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RagService {

    private static final Logger log = LoggerFactory.getLogger(RagService.class);
    private final DocumentRepository documentRepository;

    public void ingestDocument(String content) {
        // --- AI Integration Point 1: Create Embedding ---
        // Here, you would call an external service to turn the 'content' string
        // into a vector embedding. The model used must have the same dimension
        // as specified in the Document entity (e.g., 384).
        // For example:
        // float[] embeddingVector = embeddingClient.createEmbedding(content);
        // -------------------------------------------------

        // For now, we generate a random 384-dimensional vector for demonstration.
        float[] embeddingVector = new float[384];
        for (int i = 0; i < embeddingVector.length; i++) {
            embeddingVector[i] = (float) Math.random();
        }

        Document document = new Document();
        document.setContent(content);
        document.setEmbedding(new PGvector(embeddingVector));
        documentRepository.save(document);
        log.info("Successfully ingested document with ID: {}", document.getId());
    }

    public QueryResponse query(String userQuery) {
        // --- AI Integration Point 2: Create Embedding for Query ---
        // The user's query must also be converted into an embedding using the exact same model.
        // float[] queryVector = embeddingClient.createEmbedding(userQuery);
        // ------------------------------------------------------------

        // For now, generate another random vector.
        float[] queryVector = new float[384];
        for (int i = 0; i < queryVector.length; i++) {
            queryVector[i] = (float) Math.random();
        }

        // Find the 3 most similar documents in the database.
        List<Document> similarDocuments = documentRepository.findNearestNeighbors(new PGvector(queryVector), 3);

        if (similarDocuments.isEmpty()) {
            return new QueryResponse("I'm sorry, I don't have enough information to answer that.", List.of());
        }

        List<String> sources = similarDocuments.stream()
                .map(Document::getContent)
                .collect(Collectors.toList());

        // --- AI Integration Point 3: Generate Answer ---
        // Here, you would take the userQuery and the 'sources' (the content of similar documents)
        // and send them to a generative AI model (like Gemini or GPT).
        // The prompt would be something like:
        // "Given the following context, answer the user's question. Context: [sources]. Question: [userQuery]"
        // String finalAnswer = llmClient.generateAnswer(userQuery, sources);
        // -----------------------------------------------

        // For now, we will just combine the sources as a mock answer.
        String finalAnswer = "Based on the information I have: " + String.join("; ", sources);

        return new QueryResponse(finalAnswer, sources);
    }
}
