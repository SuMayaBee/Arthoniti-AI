package com.aibusiness.namegenerator.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class BusinessGenerationRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Name tone is required")
    @Size(min = 1, max = 100, message = "Name tone must be between 1 and 100 characters")
    private String nameTone;

    @NotBlank(message = "Industry is required")
    @Size(min = 1, max = 200, message = "Industry must be between 1 and 200 characters")
    private String industry;

    @NotBlank(message = "Prompts are required")
    @Size(min = 10, message = "Prompts must be at least 10 characters long")
    private String prompts;

    @NotNull(message = "Number of names is required")
    @Min(value = 1, message = "You must generate at least 1 name")
    @Max(value = 50, message = "You can generate at most 50 names")
    private Integer noOfNames;
}