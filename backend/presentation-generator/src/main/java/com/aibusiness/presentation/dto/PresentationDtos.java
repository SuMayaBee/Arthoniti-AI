package com.aibusiness.presentation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

// DTO for the main /generate-unified endpoint
@Data
@Builder
public class UnifiedGenerationRequest {
    @NotNull @Min(3) @Max(20) private Integer slidesCount;
    @NotBlank @Size(min = 10) private String prompt;
    private String colorTheme;
    private String websiteUrls; // Comma-separated
    private String industrySector;
    private String oneLinePitch;
    private String problemSolving;
    private String uniqueSolution;
    private String targetAudience;
    private String businessModel;
    private String revenuePlan;
    private String competitors;
    private String vision;
    private String language;
    private String tone;
    private boolean generateImages;
    @NotNull private Long userId;
    private List<MultipartFile> contextFiles;
}

@Data
@Builder
public class UnifiedGenerationResponse {
    private boolean success;
    private String presentationXml;
    private Integer slidesCount;
    private double processingTime;
    private List<ImageGenerationResponse> generatedImages;
    private List<Map<String, Object>> contextSourcesUsed;
    private String error;
    private Long presentationId;
    private Long databaseId;
    private String databaseError;
    private String prompt;
    private String theme;
    private String language;
    private String tone;
}

// Other Request/Response DTOs
@Data
public class OutlineRequest {
    @NotBlank String prompt;
    @NotNull @Min(3) @Max(20) Integer numberOfCards;
    String language;
}

@Data
public class SlideGenerationRequest {
    @NotBlank String title;
    @NotEmpty List<String> outline;
    String language;
    String tone;
}

@Data
public class ImageGenerationRequest {
    @NotBlank String prompt;
    Long presentationId;
    String size;
    String quality;
    String context;
}

@Data
@Builder
public class ImageGenerationResponse {
    private boolean success;
    private String url;
    private String prompt;
    private String model;
    private String size;
    private String quality;
    private String filename;
    private String error;
}

@Data
public class PresentationCreateRequest {
    @NotBlank String title;
    @NotNull JsonNode content;
    String theme;
    String language;
    String tone;
    @NotNull Long userId;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PresentationResponse {
    private Long id;
    private String title;
    private JsonNode content;
    private String theme;
    private String language;
    private String tone;
    private Long userId;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private boolean isPublic;
    private String slug;
}

@Data
public class PresentationUpdateRequest {
    private String title;
    private JsonNode content;
    private String theme;
}
