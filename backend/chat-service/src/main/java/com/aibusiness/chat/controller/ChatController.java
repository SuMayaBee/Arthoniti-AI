package com.aibusiness.chat.controller;

import com.aibusiness.chat.client.RagServiceClient;
import com.aibusiness.chat.dto.RagQueryRequest;
import com.aibusiness.chat.dto.RagQueryResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class ChatController extends TextWebSocketHandler {

    private static final Logger log = LoggerFactory.getLogger(ChatController.class);
    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private final RagServiceClient ragServiceClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ChatController(RagServiceClient ragServiceClient) {
        this.ragServiceClient = ragServiceClient;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        log.info("New WebSocket connection established: {}", session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String userQuery = message.getPayload();
        log.info("Received message from {}: {}", session.getId(), userQuery);

        // 1. Call the RAG Service to get relevant context
        log.info("Querying RAG service with: '{}'", userQuery);
        RagQueryResponse ragResponse = ragServiceClient.queryRag(new RagQueryRequest(userQuery));
        log.info("Received response from RAG service.");

        // --- AI Integration Point ---
        // 2. Combine user query and RAG context, then call a Generative AI model.
        // The prompt would be something like:
        // "Using the following context, answer the user's question.
        // Context: [ragResponse.getAnswer()]
        // Question: [userQuery]"
        // String finalAnswer = llmClient.generate(prompt);
        // -----------------------------

        // For now, we will use the response from the RAG service directly as the final answer.
        String finalAnswer = ragResponse.getAnswer();

        // 3. Send the final answer back to the user
        try {
            session.sendMessage(new TextMessage(finalAnswer));
            log.info("Sent response to {}: {}", session.getId(), finalAnswer);
        } catch (IOException e) {
            log.error("Error sending message to session {}: {}", session.getId(), e.getMessage());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        log.info("WebSocket connection closed: {} with status {}", session.getId(), status);
    }
}
