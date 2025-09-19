package com.aibusiness.chat.dto;

import lombok.Data;
import java.util.List;

// This DTO must match the QueryResponse DTO in the RAG service
@Data
public class RagQueryResponse {
    private String answer;
    private List<String> sources;
}
