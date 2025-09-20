package com.aibusiness.namegenerator.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.ZonedDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusinessGenerationResponse {
    private Long id;
    
    @JsonProperty("generated_names")
    private List<String> generatedNames;
    
    @JsonProperty("user_id")
    private Long userId;
    
    @JsonProperty("name_tone")
    private String nameTone;
    
    private String industry;
    
    @JsonProperty("no_of_names")
    private Integer noOfNames;
    
    @JsonProperty("created_at")
    private ZonedDateTime createdAt;
}