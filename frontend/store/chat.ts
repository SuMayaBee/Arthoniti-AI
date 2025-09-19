import React from "react";
import { create } from "zustand";
import apiClient from "@/lib/api/client";

interface ChatMessage {
  id: number;
  session_id: number;
  user_id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  token_count: number;
}

interface ChatSession {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  messages: ChatMessage[];
}

interface ChatState {
  sessions: ChatSession[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  loadSessions: (userId: number) => Promise<void>;
  updateSessionTitle: (
    sessionId: string,
    title: string,
    updatedAt: string
  ) => void;
  addSession: (session: ChatSession) => void;
  deleteSession: (sessionId: string) => Promise<void>;
  clearAllSessions: (userId: number) => Promise<void>;
  reset: () => void;
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

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  loading: false,
  loaded: false,
  error: null,

  loadSessions: async (userId: number) => {
    const { loaded, loading } = get();

    // Don't reload if already loaded or currently loading
    if (loaded || loading) return;

    set({ loading: true, error: null });

    try {
      console.log(`🚀 Loading chat sessions for user ${userId}`);

      const response = await apiClient.get<ChatSession[]>(
        `/chat/sessions/${userId}?limit=25`
      );

      console.log("✅ Chat sessions loaded:", response.data);

      set({
        sessions: response.data,
        loading: false,
        loaded: true,
        error: null,
      });
    } catch (error: any) {
      console.error("❌ Error loading chat sessions:", error);
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          error.message ||
          "Failed to load chat sessions",
      });
    }
  },

  updateSessionTitle: (sessionId: string, title: string, updatedAt: string) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id.toString() === sessionId
          ? { ...session, title, updated_at: updatedAt }
          : session
      ),
    }));
  },

  addSession: (session: ChatSession) => {
    set((state) => ({
      sessions: [session, ...state.sessions],
    }));
  },

  // Delete a chat session
  deleteSession: async (sessionId: string) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    await apiClient.delete(`/chat/sessions/${sessionId}?user_id=${userId}`);

    // Remove from local state
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id.toString() !== sessionId),
    }));
  },

  // Clear all chat sessions for a user
  clearAllSessions: async (userId: number) => {
    await apiClient.delete(`/chat/sessions/user/${userId}`);

    // Clear all sessions from local state
    set({
      sessions: [],
      loading: false,
      loaded: true,
      error: null,
    });
  },

  reset: () => {
    set({
      sessions: [],
      loading: false,
      loaded: false,
      error: null,
    });
  },
}));

// Hook to automatically load sessions when needed
export const useChatSessions = () => {
  const store = useChatStore();

  // Auto-load sessions if not loaded yet
  React.useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId && !store.loaded && !store.loading) {
      store.loadSessions(userId);
    }
  }, [store.loaded, store.loading]);

  return store;
};
