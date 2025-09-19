package com.aibusiness.logo.dto;

import lombok.Data;

@Data
public class LogoGenerationRequest {
    private String prompt;
    private String style; // e.g., "minimalist", "vintage", "3d"
}
