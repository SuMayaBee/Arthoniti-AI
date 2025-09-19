package com.aibusiness.docs.dto;

import lombok.Data;

// This DTO must exactly match the one in the logo-generator service
@Data
public class LogoGenerationResponse {
    private String imageUrl;
}
