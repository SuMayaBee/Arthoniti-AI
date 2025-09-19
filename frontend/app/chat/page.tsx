"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import UpperArrowMdIcon from "@/components/icons/UpperArrowMdIcon";
import Loader from "@/components/loader";
import PageHeader from "@/components/page-header";
import GeneratingLoader from "@/components/ui/generating-loader";
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/lib/api/client";
import { generateChatTitle } from "@/lib/utils";
import { useChatStore } from "@/store/chat";

// Types aligned with `store/chat.ts` to avoid any-casts
type ChatMessage = {
  id: number;
  session_id: number;
  user_id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  token_count: number;
};

type ChatSession = {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  messages: ChatMessage[];
};

// Utility to extract user_id from JWT in access_token cookie (consistent with other pages)
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

export default function ChatPage() {
  const router = useRouter();
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const { addSession } = useChatStore();

  const handleSendMessage = async (message: string) => {
    if (isCreatingSession) return; // Prevent multiple requests

    try {
      setIsCreatingSession(true);

      // Get user ID from token
      const userId = getUserIdFromToken();
      if (!userId) {
        return;
      }

      // Step 1: Create a new chat session with title from user message
      const sessionResponse = await apiClient.post("/chat/sessions", {
        user_id: userId,
        title: generateChatTitle(message),
      });

      // Optimistically add to sidebar store so it renders immediately
      if (sessionResponse?.data?.id) {
        const session = sessionResponse.data as ChatSession;
        addSession({ ...session, messages: session.messages ?? [] });
      }

      // Step 2: Send the initial message to start the chat
      await apiClient.post("/chat/message", {
        user_id: userId,
        content: message,
        session_id: sessionResponse.data.id,
      });

      // Step 3: Navigate to the chat details page
      // Navigate to the chat details page with the session ID
      router.push(`/chat/${sessionResponse.data.id}`);
    } catch {
      // Fallback: navigate with timestamp ID if process fails
      const fallbackId = Date.now().toString();
      router.push(`/chat/${fallbackId}`);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const suggestedQuestions = [
    "How do I start a new business?",
    "What are effective social media strategies?",
    "What is break-even analysis?",
    "How to create a marketing plan?",
    "What are the best pricing strategies?",
    "How to build a strong brand?",
  ];

  return (
    <div className="relative flex min-h-full w-full flex-col">
      {isCreatingSession ? (
        <GeneratingLoader />
      ) : (
        <>
          <PageHeader
            description="I'm here to assist with anything related to business. whether it's strategy, branding, marketing, documents, or launching your idea. Just ask your question, and I'll guide you with the best possible answer."
            title="What can I help with?"
          />
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="w-full">
              {/* Input Field */}
              <div className="relative my-8">
                <div className="rainbow-gradient-border rotating-gradient-border rounded-[42px] p-[2px]">
                  <div className="rounded-[40px] bg-white">
                    <div className="relative p-0">
                      <Textarea
                        className="h-[150px] flex-1 resize-none rounded-[40px] border-0 bg-transparent pr-28 pb-16 text-gray-800 text-lg placeholder-gray-500 focus:outline-none focus-visible:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            const target = e.target as HTMLTextAreaElement;
                            if (target.value.trim() && !isCreatingSession) {
                              handleSendMessage(target.value);
                              target.value = "";
                            }
                          }
                        }}
                        placeholder="Ask me anything"
                        rows={3}
                      />
                      <div className="absolute right-5 bottom-3 flex items-center gap-2">
                        <button
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={isCreatingSession}
                          onClick={() => {
                            const input = document.querySelector(
                              'textarea[placeholder="Ask me anything"]'
                            ) as HTMLTextAreaElement | null;
                            if (input?.value.trim()) {
                              handleSendMessage(input.value);
                              input.value = "";
                            }
                          }}
                          type="button"
                        >
                          {isCreatingSession ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <UpperArrowMdIcon color="text-white" size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Suggested Questions */}
            <div className="space-y-4">
              <div className="flex flex-wrap justify-center gap-3">
                {suggestedQuestions.map((question) => (
                  <button
                    className="rounded-full border border-gray-200 bg-white px-6 py-3 text-gray-700 shadow-[0_1px_0_rgba(0,0,0,0.02),0_8px_16px_rgba(0,0,0,0.06)] transition-colors hover:border-primary-300 hover:text-primary-600"
                    key={question}
                    onClick={() => handleSendMessage(question)}
                    type="button"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
