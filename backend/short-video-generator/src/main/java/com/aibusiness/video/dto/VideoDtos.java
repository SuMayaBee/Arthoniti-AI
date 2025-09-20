package com.aibusiness.video.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.Map;

// --- Request DTO ---
@Data
public class VideoGenerationRequest {
    @NotNull(message = "user_id is required")
    @JsonProperty("user_id")
    private Long userId;

    @NotBlank(message = "prompt is required")
    private String prompt;
}

// --- Response DTOs ---
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShortVideoResponse {
    private Long id;
    @JsonProperty("user_id")
    private Long userId;
    private String prompt;
    @JsonProperty("video_url")
    private String videoUrl;
    @JsonProperty("aspect_ratio")
    private String aspectRatio;
    private String duration; // API doc uses string, so we map integer to string
    @JsonProperty("audio_generation")
    private boolean audioGeneration;
    private boolean watermark;
    @JsonProperty("person_generation")
    private String personGeneration;
    @JsonProperty("created_at")
    private ZonedDateTime createdAt;
    @JsonProperty("updated_at")
    private ZonedDateTime updatedAt;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceStatusResponse {
    private String status;
    private String service;
    private String model;
    private String api;
    @JsonProperty("fixed_settings")
    private Map<String, String> fixedSettings;
    @JsonProperty("request_format")
    private Map<String, String> requestFormat;
    private String error;
}

@Data
@AllArgsConstructor
public class MessageResponse {
    private String message;
}
