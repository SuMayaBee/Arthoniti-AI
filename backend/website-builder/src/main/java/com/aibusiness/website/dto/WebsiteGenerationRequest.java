package com.aibusiness.website.dto;

import lombok.Data;

@Data
public class WebsiteGenerationRequest {
    private String businessName;
    private String businessDescription;
    private String colorTheme; // e.g., "dark", "light", "blue"
}
