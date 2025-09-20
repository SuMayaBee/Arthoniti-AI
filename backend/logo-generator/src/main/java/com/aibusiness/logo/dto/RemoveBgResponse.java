package com.aibusiness.logo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RemoveBgResponse {
    private boolean success;
    
    @JsonProperty("logo_id")
    private Long logoId;
    
    @JsonProperty("remove_bg_logo_image_url")
    private String removeBgLogoImageUrl;
    
    private String error;
}