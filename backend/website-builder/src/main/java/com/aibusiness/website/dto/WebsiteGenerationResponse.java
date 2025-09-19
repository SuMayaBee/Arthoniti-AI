package com.aibusiness.website.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebsiteGenerationResponse {
    private String message;
    private String siteId;
    private String previewUrl;
}
