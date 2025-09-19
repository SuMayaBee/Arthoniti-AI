package com.aibusiness.video.dto;

import lombok.Data;

@Data
public class VideoGenerationRequest {
    private String script; // The text content or prompt for the video
    private String style;  // e.g., "animated explainer", "live action", "whiteboard"
    private int durationSeconds; // Desired length of the video
}
