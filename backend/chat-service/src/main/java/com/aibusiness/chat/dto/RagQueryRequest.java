package com.aibusiness.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// This DTO must match the QueryRequest DTO in the RAG service
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RagQueryRequest {
    private String query;
}
