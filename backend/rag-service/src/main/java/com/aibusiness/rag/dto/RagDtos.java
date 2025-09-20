package com.aibusiness.rag.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

// --- Request DTOs ---

@Data
public class IngestUrlRequest {
    private String url;
}

@Data
public class QueryRequest {
    private String query;
}

// --- Response DTOs ---

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IngestResponse {
    private String source;
    private int chunksIngested;
    private String message;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QueryResponse {
    private String answer;
    private List<String> sources;
    private List<String> context;
}
