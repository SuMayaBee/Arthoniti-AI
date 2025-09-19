"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ChatDetails from "@/components/chat-details";
import HistoryLoader from "@/components/history-loader";
import { useProfile } from "@/hooks/use-profile";
import apiClient from "@/lib/api/client";
import { generateChatTitle } from "@/lib/utils";
import { useChatStore } from "@/store/chat";

interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}

interface ApiMessage {
  id: number;
  session_id: number;
  user_id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  token_count: number;
}

interface SessionResponse {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  messages: ApiMessage[];
}

// Utility to extract user_id from JWT in access_token cookie
function getUserIdFromToken(): number | null {
  if (typeof document === "undefined") return null;
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id || null;
  } catch {
    return null;
  }
}

// Convert API message format to component format
function convertApiMessage(apiMessage: ApiMessage): Message {
  return {
    id: apiMessage.id.toString(),
    sender: apiMessage.role === "assistant" ? "ai" : "user",
    content: apiMessage.content,
    timestamp: new Date(apiMessage.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export default function ChatDetailsPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const { userName, userImage } = useProfile();
  const { updateSessionTitle } = useChatStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionResponse | null>(null);

  useEffect(() => {
    const loadChatData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = getUserIdFromToken();
        if (!userId) {
          setError("User not authenticated");
          return;
        }

        // Fetch session messages using the endpoint format you specified
        const response = await apiClient.get<SessionResponse>(
          `/chat/sessions/${chatId}/messages?user_id=${userId}`
        );

        // Store session data for title checks
        setSessionData(response.data);

        // Convert API messages to component format
        const convertedMessages = response.data.messages.map(convertApiMessage);
        setMessages(convertedMessages);
      } catch (requestError: unknown) {
        const errorMessage =
          (requestError as any)?.response?.data?.message ||
          (requestError as Error)?.message ||
          "Failed to load chat session";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadChatData();
  }, [chatId]);

  const handleSendMessage = async (message: string) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    // Check if this is a "New Chat" session with no messages (first message)
    const isNewChatFirstMessage =
      sessionData?.title === "New Chat" && messages.length === 0;

    // Optimistically add user message
    const userMessage: Message = {
      id: `${Date.now()}`,
      sender: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // If this is the first message in a "New Chat", update the title
      if (isNewChatFirstMessage) {
        const newTitle = generateChatTitle(message);

        // Update the session title in the backend
        await apiClient.put(
          `/chat/sessions/${chatId}/title?user_id=${userId}&title=${encodeURIComponent(newTitle)}`
        );

        // Update the session data locally
        setSessionData((prev) => (prev ? { ...prev, title: newTitle } : null));

        // Update the sidebar through the store
        updateSessionTitle(chatId, newTitle, new Date().toISOString());
      }

      // Add thinking message while waiting for AI response
      const thinkingMessage: Message = {
        id: `thinking-${Date.now()}`,
        sender: "ai",
        content: "Thinking...",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, thinkingMessage]);

      // Send message to API
      const response = await apiClient.post("/chat/message", {
        user_id: userId,
        content: message,
        session_id: Number.parseInt(chatId, 10),
      });

      // Log the response structure for debugging
      // Message sent successfully

      // Remove thinking message first
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== thinkingMessage.id)
      );

      // The API returns an array of messages, we need the last assistant message
      if (Array.isArray(response.data) && response.data.length > 0) {
        // Find the last assistant message from the response
        const lastAssistantMessage = response.data
          .filter((msg) => msg.role === "assistant")
          .pop();

        if (lastAssistantMessage?.content) {
          const aiMessage: Message = {
            id: lastAssistantMessage.id?.toString() || `ai-${Date.now()}`,
            sender: "ai",
            content: lastAssistantMessage.content,
            timestamp: new Date(
              lastAssistantMessage.timestamp
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };

          // Add AI response
          setMessages((prev) => [...prev, aiMessage]);
        } else {
          // Fallback if no assistant message found
          const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            sender: "ai",
            content:
              "I received your message but couldn't generate a proper response.",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setMessages((prev) => [...prev, aiMessage]);
        }
      } else {
        // Handle other response structures as fallback
        // Unexpected response structure
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          content:
            "I received your message but the response format was unexpected.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (sendError: unknown) {
      const errorMessage =
        (sendError as any)?.response?.data?.message ||
        (sendError as any)?.message ||
        "Failed to send message";
      toast.error(errorMessage);

      // Remove both the optimistic user message and any thinking message on error
      setMessages((prev) =>
        prev.filter(
          (msg) => msg.id !== userMessage.id && !msg.id.startsWith("thinking-")
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="flex h-full w-full">
        {/* Mobile layout */}
        <div className="flex h-full w-full flex-col lg:hidden">
          <HistoryLoader />
        </div>

        {/* Desktop layout */}
        <div className="hidden h-full w-full lg:flex">
          <HistoryLoader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-2 text-lg text-red-500">Error loading chat</div>
          <div className="text-gray-400 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <ChatDetails
      messages={messages}
      onSendMessage={handleSendMessage}
      userImage={userImage}
      userName={userName}
    />
  );
}
