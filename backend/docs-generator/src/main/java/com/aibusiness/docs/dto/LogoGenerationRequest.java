package com.aibusiness.docs.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// This DTO must exactly match the one in the logo-generator service
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogoGenerationRequest {
    private String prompt;
    private String style;
}
