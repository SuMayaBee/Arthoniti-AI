package com.aibusiness.rag.service;

import com.aibusiness.rag.dto.IngestResponse;
import com.aibusiness.rag.dto.QueryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RagPipelineService {
    private final IngestionService ingestionService;
    private final VectorStore vectorStore;
    private final ChatClient chatClient;

    public IngestResponse ingestFile(MultipartFile file) throws IOException {
        List<Document> documents = ingestionService.processFile(file);
        vectorStore.add(documents);
        return new IngestResponse(file.getOriginalFilename(), documents.size(), "File ingested successfully");
    }

    public IngestResponse ingestUrl(String url) {
        List<Document> documents = ingestionService.processUrl(url);
        vectorStore.add(documents);
        return new IngestResponse(url, documents.size(), "URL ingested successfully");
    }

    public QueryResponse query(String query) {
        // 1. Search the vector store for documents similar to the query
        List<Document> similarDocuments = vectorStore.similaritySearch(
                SearchRequest.query(query).withTopK(4) // Get top 4 most relevant chunks
        );

        // 2. Extract the content and sources from the retrieved documents
        List<String> context = similarDocuments.stream().map(Document::getContent).toList();
        List<String> sources = similarDocuments.stream()
                .map(doc -> doc.getMetadata().get("source").toString())
                .distinct()
                .toList();

        // 3. Create a prompt with the retrieved context for the chat model
        String promptTemplate = """
            You are a helpful AI assistant. Answer the user's query based on the
            following context. If the context does not contain the answer, state that
            you don't have enough information.
            
            CONTEXT:
            {context}
            
            QUERY:
            {query}
            
            ANSWER:
            """;
        
        PromptTemplate template = new PromptTemplate(promptTemplate, Map.of(
            "context", String.join("\n---\n", context),
            "query", query
        ));
        
        // 4. Call the chat model to generate a final, grounded answer
        String answer = chatClient.prompt(template.create()).call().content();
        
        return new QueryResponse(answer, sources, context);
    }
}
