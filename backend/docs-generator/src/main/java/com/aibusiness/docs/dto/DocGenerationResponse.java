package com.aibusiness.docs.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocGenerationResponse {
    private String message;
    private String documentId;
    private String downloadUrl;
}
