package com.aibusiness.chat.service;
// ... (imports)
import com.aibusiness.chat.client.RagServiceClient;
import com.aibusiness.chat.dto.*;
import com.aibusiness.chat.entity.ChatMessage;
import com.aibusiness.chat.entity.ChatSession;
import com.aibusiness.chat.exception.SessionNotFoundException;
import com.aibusiness.chat.repository.ChatMessageRepository;
import com.aibusiness.chat.repository.ChatSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client. BirtChatClient;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.SystemPromptTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import reactor.core.publisher.Flux;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatSessionRepository sessionRepository;
    private final ChatMessageRepository messageRepository;
    private final RagServiceClient ragServiceClient;
    private final ChatClient chatClient;
    private final StreamingChatClient streamingChatClient;

    // ... (CRUD methods for sessions: create, get by user, get with messages, update title, delete)

    @Transactional
    public SendMessageResponse sendMessage(SendMessageRequest request) {
        ChatSession session = getOrCreateSession(request.getUserId(), request.getSessionId());
        saveUserMessage(request.getContent(), session);

        String ragContext = getRagContext(request.getContent());
        List<Message> history = getMessageHistory(session);

        Prompt prompt = createPromptWithHistoryAndContext(history, request.getContent(), ragContext);
        String aiResponseContent = chatClient.prompt(prompt).call().content();

        ChatMessage aiMessage = saveAssistantMessage(aiResponseContent, session);

        session.setUpdatedAt(ZonedDateTime.now());
        sessionRepository.save(session);
        
        return new SendMessageResponse(mapToMessageResponse(aiMessage), mapToSessionResponse(session));
    }

    public SseEmitter sendMessageStream(SendMessageRequest request) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        StringBuilder fullResponseContent = new StringBuilder();
        AtomicLong aiMessageId = new AtomicLong();

        // Run async to avoid blocking
        new Thread(() -> {
            try {
                ChatSession session = getOrCreateSession(request.getUserId(), request.getSessionId());
                ChatMessage userMessage = saveUserMessage(request.getContent(), session);
                
                emitter.send(new StreamEvent("session_info", session.getId(), userMessage.getId(), null, null, false));

                String ragContext = getRagContext(request.getContent());
                List<Message> history = getMessageHistory(session);
                Prompt prompt = createPromptWithHistoryAndContext(history, request.getContent(), ragContext);

                Flux<String> stream = streamingChatClient.prompt(prompt).stream().content();

                stream.doOnNext(chunk -> {
                    try {
                        fullResponseContent.append(chunk);
                        emitter.send(new StreamEvent("content", null, null, null, chunk, false));
                    } catch (Exception e) {
                        emitter.completeWithError(e);
                    }
                }).doOnComplete(() -> {
                    try {
                        ChatMessage aiMessage = saveAssistantMessage(fullResponseContent.toString(), session);
                        aiMessageId.set(aiMessage.getId());
                        session.setUpdatedAt(ZonedDateTime.now());
                        sessionRepository.save(session);
                        
                        emitter.send(new StreamEvent("complete", session.getId(), null, aiMessageId.get(), null, true));
                        emitter.send(SseEmitter.event().data("[DONE]"));
                        emitter.complete();
                    } catch (Exception e) {
                        emitter.completeWithError(e);
                    }
                }).subscribe();
            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        }).start();

        return emitter;
    }

    private String getRagContext(String query) {
        try {
            RagQueryResponse response = ragServiceClient.queryRag(new RagQueryRequest(query));
            return String.join("\n---\n", response.getContext());
        } catch (Exception e) {
            log.error("Failed to get RAG context: {}", e.getMessage());
            return "No additional context was available.";
        }
    }
    
    // ... (helper methods: getOrCreateSession, saveUserMessage, saveAssistantMessage, getMessageHistory, createPrompt, mappers)
}
