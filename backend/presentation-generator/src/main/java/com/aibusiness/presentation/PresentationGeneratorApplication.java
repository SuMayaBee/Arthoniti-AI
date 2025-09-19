package com.aibusiness.presentation.dto;

import lombok.Data;

@Data
public class PresentationGenerationRequest {
    private String title;
    private String author;
    private int numberOfSlides; // How many content slides to generate
}
