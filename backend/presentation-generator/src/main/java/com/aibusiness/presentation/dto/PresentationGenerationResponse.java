package com.aibusiness.presentation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PresentationGenerationResponse {
    private String message;
    private String presentationId;
    private String downloadUrl;
}
