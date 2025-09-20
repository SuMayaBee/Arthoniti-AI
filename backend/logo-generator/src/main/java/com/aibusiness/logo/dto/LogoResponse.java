package com.aibusiness.logo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.ZonedDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogoResponse {
    private Long id;
    
    @JsonProperty("user_id")
    private Long userId;
    
    @JsonProperty("logo_image_url")
    private String logoImageUrl;
    
    @JsonProperty("remove_bg_logo_image_url")
    private String removeBgLogoImageUrl;
    
    private Map<String, Object> content;
    
    @JsonProperty("logo_title")
    private String logoTitle;
    
    @JsonProperty("logo_vision")
    private String logoVision;
    
    @JsonProperty("color_palette_name")
    private String colorPaletteName;
    
    @JsonProperty("logo_style")
    private String logoStyle;
    
    @JsonProperty("created_at")
    private ZonedDateTime createdAt;
    
    @JsonProperty("updated_at")
    private ZonedDateTime updatedAt;
}