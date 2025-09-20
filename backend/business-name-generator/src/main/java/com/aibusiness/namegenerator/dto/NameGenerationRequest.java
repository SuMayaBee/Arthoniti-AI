package com.aibusiness.namegenerator.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NameGenerationRequest {
    private String prompt;
    private int count; // e.g., how many names to generate
}
