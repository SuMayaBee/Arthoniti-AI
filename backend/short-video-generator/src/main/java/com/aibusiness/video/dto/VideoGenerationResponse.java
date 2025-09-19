package com.aibusiness.video.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoGenerationResponse {
    private String message;
    private String videoUrl;
}
