package com.aibusiness.website.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.ZonedDateTime;
import java.util.List;

// --- Request DTOs ---

@Data
public class ProjectCreateRequest {
    @NotBlank @JsonProperty("user_id") private String userId;
    @NotBlank private String title;
    private String description;
    private String prompt;
    @NotNull private JsonNode files;
    private JsonNode messages;
    private String thumbnail;
    private String status;
}

@Data
public class ProjectUpdateRequest {
    private String title;
    private String description;
    private JsonNode files;
    private JsonNode messages;
    private String deployedUrl;
    private ZonedDateTime deployedAt;
    private String status;
}

@Data
public class AiChatRequest {
    @NotBlank private String prompt;
}

@Data
public class EnhancePromptRequest {
    @NotBlank private String prompt;
}

@Data
public class CodeGenerationRequest {
    @NotBlank private String prompt;
}


// --- Response DTOs ---

@Data
public class ProjectResponse {
    private String id;
    private String title;
    private String description;
    private String prompt;
    private JsonNode files;
    private JsonNode messages;
    @JsonProperty("created_at") private ZonedDateTime createdAt;
    @JsonProperty("updated_at") private ZonedDateTime updatedAt;
    private String thumbnail;
    private String deployedUrl;
    private ZonedDateTime deployedAt;
    @JsonProperty("user_id") private String userId;
    private String status;
}

@Data
public class CodeGenerationResponse {
    private String projectTitle;
    private String explanation;
    private JsonNode files;
    private List<String> generatedFiles;
}
