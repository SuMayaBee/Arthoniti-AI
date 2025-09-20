package com.aibusiness.chat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.ZonedDateTime;
import java.util.List;

// --- DTOs for RAG Service Communication ---
@Data
public class RagQueryRequest {
    private String query;
    public RagQueryRequest(String query) { this.query = query; }
}

@Data
public class RagQueryResponse {
    private String answer;
    private List<String> context;
}

// --- DTOs for Chat API ---
@Data
public class CreateSessionRequest {
    @NotNull @JsonProperty("user_id") private Long userId;
    @NotBlank private String title;
}

@Data
public class SessionResponse {
    private Long id;
    @JsonProperty("user_id") private Long userId;
    private String title;
    @JsonProperty("created_at") private ZonedDateTime createdAt;
    @JsonProperty("updated_at") private ZonedDateTime updatedAt;
    @JsonProperty("is_active") private boolean isActive;
    @JsonProperty("message_count") private int messageCount;
    @JsonProperty("last_message") private String lastMessage;
}

@Data
public class MessageResponse {
    private Long id;
    @JsonProperty("session_id") private Long sessionId;
    @JsonProperty("user_id") private Long userId;
    private String role;
    private String content;
    private ZonedDateTime timestamp;
    @JsonProperty("token_count") private int tokenCount;
}

@Data
public class SessionWithMessagesResponse {
    private Long id;
    @JsonProperty("user_id") private Long userId;
    private String title;
    @JsonProperty("created_at") private ZonedDateTime createdAt;
    @JsonProperty("updated_at") private ZonedDateTime updatedAt;
    @JsonProperty("is_active") private boolean isActive;
    private List<MessageResponse> messages;
}

@Data
public class SendMessageRequest {
    @NotNull @JsonProperty("user_id") private Long userId;
    @NotBlank private String content;
    @JsonProperty("session_id") private Long sessionId; // Optional
}

@Data
public class SendMessageResponse {
    private MessageResponse message;
    private SessionResponse session;
}

// --- DTO for Streaming ---
@Data
@AllArgsConstructor
public class StreamEvent {
    private String type; // "session_info", "content", "complete"
    @JsonProperty("session_id") private Long sessionId;
    @JsonProperty("user_message_id") private Long userMessageId;
    @JsonProperty("ai_message_id") private Long aiMessageId;
    private String content;
    @JsonProperty("is_complete") private boolean isComplete;
}
