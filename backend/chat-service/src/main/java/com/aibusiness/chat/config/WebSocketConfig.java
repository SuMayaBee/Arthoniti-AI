package com.aibusiness.chat.config;

import com.aibusiness.chat.controller.ChatController;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket // Enables WebSocket server-side support
public class WebSocketConfig implements WebSocketConfigurer {

    private final ChatController chatController;

    public WebSocketConfig(ChatController chatController) {
        this.chatController = chatController;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Registers the ChatController to handle messages on the /chat endpoint
        registry.addHandler(chatController, "/chat").setAllowedOrigins("*");
    }
}
