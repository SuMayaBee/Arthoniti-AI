package com.aibusiness.logo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DesignOnlyResponse {
    @JsonProperty("design_specification")
    private JsonNode designSpecification;
    
    @JsonProperty("raw_specification")
    private String rawSpecification;
    
    @JsonProperty("logo_title")
    private String logoTitle;
    
    @JsonProperty("generation_type")
    private String generationType = "design_specification_only";
}