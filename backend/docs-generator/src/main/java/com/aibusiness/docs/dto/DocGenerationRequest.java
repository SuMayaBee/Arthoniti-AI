package com.aibusiness.docs.dto;

import lombok.Data;

@Data
public class DocGenerationRequest {
    private String businessName;
    private String businessType; // e.g., "Restaurant", "Tech Startup"
    private String logoPrompt;
    private String logoStyle;
}
