package com.aibusiness.chat.controller;
// ... (imports)
import com.aibusiness.chat.dto.*;
import com.aibusiness.chat.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // --- Session Management ---
    @PostMapping("/sessions")
    public ResponseEntity<SessionResponse> createSession(@Valid @RequestBody CreateSessionRequest request) {
        return ResponseEntity.ok(chatService.createSession(request));
    }
    
    @GetMapping("/sessions/{userId}")
    public ResponseEntity<List<SessionResponse>> getUserSessions(@PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getSessionsByUserId(userId));
    }
    
    @GetMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<SessionWithMessagesResponse> getSessionWithMessages(@PathVariable Long sessionId, @RequestParam Long userId) {
        return ResponseEntity.ok(chatService.getSessionWithMessages(sessionId, userId));
    }

    @PutMapping("/sessions/{sessionId}/title")
    public ResponseEntity<SessionResponse> updateSessionTitle(@PathVariable Long sessionId, @RequestParam Long userId, @RequestParam String title) {
        return ResponseEntity.ok(chatService.updateSessionTitle(sessionId, userId, title));
    }

    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<Map<String, String>> deleteSession(@PathVariable Long sessionId, @RequestParam Long userId) {
        chatService.deleteSession(sessionId, userId);
        return ResponseEntity.ok(Map.of("message", "Session deleted successfully"));
    }

    // --- Messaging ---
    @PostMapping("/message")
    public ResponseEntity<SendMessageResponse> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        return ResponseEntity.ok(chatService.sendMessage(request));
    }

    @PostMapping("/message/stream")
    public SseEmitter sendMessageStream(@Valid @RequestBody SendMessageRequest request) {
        return chatService.sendMessageStream(request);
    }

    // --- Health ---
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "healthy",
            "service", "chat",
            "model", "gpt-4o-mini"
        ));
    }
}

