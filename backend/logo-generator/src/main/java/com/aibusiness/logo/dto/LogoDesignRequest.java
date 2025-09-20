package com.aibusiness.logo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class LogoDesignRequest {
    @JsonProperty("logo_title")
    private String logoTitle;
    
    @JsonProperty("logo_vision")
    private String logoVision;
    
    @JsonProperty("color_palette_name")
    private String colorPaletteName;
    
    @JsonProperty("logo_style")
    private String logoStyle;
    
    @JsonProperty("user_id")
    private Long userId;
}