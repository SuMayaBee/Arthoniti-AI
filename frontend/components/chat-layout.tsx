/** biome-ignore-all lint/nursery/useConsistentTypeDefinitions: <explanation> */
/** biome-ignore-all lint/style/useTemplate: <explanation> */
/** biome-ignore-all lint/style/useBlockStatements: <explanation> */
/** biome-ignore-all lint/nursery/useImageSize: <explanation> */
/** biome-ignore-all lint/performance/noImgElement: <explanation> */
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ANIMATION_DURATION = 500;

import ChatIcon from "@/components/icons/ChatIcon";
import DotsGridIcon from "@/components/icons/DotsGridIcon";
import PenNewSquare from "@/components/icons/PenNewSquare";
import ProjectIcon from "@/components/icons/ProjectIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api/client";
import { useChatStore } from "@/store/chat";

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

interface ChatLayoutProps {
  children: React.ReactNode;
  sidebarTop?: React.ReactNode;
  contentTop?: React.ReactNode;
  fullHeight?: boolean;
  sidebarContentOverride?: React.ReactNode;
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

// Helper function to format timestamp
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

// Helper function to truncate chat title
function truncateTitle(title: string, maxLength = 25): string {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + "...";
}

export function ChatLayout({
  children,
  sidebarTop,
  contentTop,
  fullHeight = true,
  sidebarContentOverride,
}: ChatLayoutProps) {
  const router = useRouter();
  const params = useParams();
  const currentChatId = params?.chatId as string;

  // Use the chat store instead of local state
  const {
    sessions: chatSessions,
    loading,
    loadSessions,
    updateSessionTitle,
    addSession,
    deleteSession,
  } = useChatStore();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [creatingSession, setCreatingSession] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileSidebarClosing, setMobileSidebarClosing] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  // Load chat sessions only once when component mounts
  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      loadSessions(userId);
    }
  }, [loadSessions]);

  // Handle edit title functionality
  const handleEditTitle = async (sessionId: string, newTitle: string) => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      if (!newTitle.trim()) {
        toast.error("Title cannot be empty");
        return;
      }

      console.log(
        `🚀 Updating title for session ${sessionId} to "${newTitle}"`
      );

      const response = await apiClient.put(
        `/chat/sessions/${sessionId}/title?user_id=${userId}&title=${encodeURIComponent(newTitle.trim())}`
      );

      console.log("✅ Title updated:", response.data);

      // Update the session in the store
      updateSessionTitle(
        sessionId,
        response.data.title,
        response.data.updated_at
      );

      // Reset editing state
      setEditingSessionId(null);
      setEditingTitle("");
      setOpenMenuId(null);

      toast.success("Title updated successfully");
    } catch (error: any) {
      console.error("❌ Error updating title:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Failed to update title";
      toast.error(errorMessage);
    }
  };

  // Create a brand new chat session and navigate to it
  const handleCreateNewChat = async () => {
    if (creatingSession) return;
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      setCreatingSession(true);
      // Create session
      const sessionResponse = await apiClient.post("/chat/sessions", {
        user_id: userId,
        title: "New Chat",
      });

      const session = sessionResponse.data as ChatSession;
      // Optimistically add to store so sidebar updates immediately
      if (session && session.id) {
        addSession(session);
        router.push(`/chat/${session.id}`);
      } else {
        // Fallback just in case
        router.push("/chat");
      }
    } catch (error: any) {
      console.error("❌ Error creating new chat session:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Failed to create chat session";
      toast.error(errorMessage);
    } finally {
      setCreatingSession(false);
    }
  };

  const startEditing = (sessionId: string, currentTitle: string) => {
    setEditingSessionId(sessionId);
    setEditingTitle(currentTitle);
    setOpenMenuId(null);
  };

  const cancelEditing = () => {
    setEditingSessionId(null);
    setEditingTitle("");
  };

  // Handle delete session functionality
  const handleDeleteSession = async (sessionId: string) => {
    try {
      setDeleting(true);
      await deleteSession(sessionId);

      // If deleting the currently open chat, navigate away
      if (currentChatId === sessionId) {
        // Prefer going to Recent list
        router.push("/chat/recent");
      }

      setOpenMenuId(null);
      toast.success("Chat deleted");
      setDeleteModalOpen(false);
      setSessionToDelete(null);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Failed to delete chat";
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  // Separate sessions into today and older
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const todayChats = chatSessions.filter((session) => {
    const sessionDate = new Date(session.updated_at);
    return sessionDate >= todayStart;
  });

  const olderChats = chatSessions.filter((session) => {
    const sessionDate = new Date(session.updated_at);
    return sessionDate < todayStart;
  });

  return (
    <div
      className={`flex ${fullHeight ? "h-screen" : "h-full"} w-screen gap-5 bg-white`}
    >
      {/* Left Sidebar - Hidden on mobile, visible from lg */}
      <div className="hidden rounded-[20px] border-none p-5 shadow-lg lg:block">
        <div className="flex h-full w-80 flex-col bg-white">
          {/* Optional custom top (e.g., Back section) */}
          {sidebarTop && (
            <div className="mb-3">
              {sidebarTop}
              <div className="mt-2 h-px w-full bg-gray-200" />
            </div>
          )}

          {sidebarContentOverride ? (
            <div className="min-h-0 flex-1">{sidebarContentOverride}</div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-start">
                <button
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 transition-colors hover:bg-primary-600"
                  onClick={() => router.push("/dashboard")}
                >
                  <img
                    alt="Scalebuild.ai Logo"
                    className="h-8 w-8 rounded-full object-contain"
                    src="/logo.png"
                  />
                </button>
              </div>

              {/* Search Input */}
              {/* <div className="relative mb-6">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <SearchIcon size={24} color="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-[100px] h-10 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              style={{
                fontSize: 16,
                fontFamily: "Open Sans, sans-serif",
                fontWeight: 400,
                lineHeight: "24px",
                color: "#515A65",
              }}
            />
          </div> */}

              {/* Navigation */}
              <div className="mt-8 mb-6 space-y-3">
                <div
                  className="group flex h-10 w-full cursor-pointer items-center gap-3 rounded-[100px] px-3 py-2 text-gray-700 transition-all duration-200 hover:bg-primary-50 hover:text-primary-700"
                  onClick={handleCreateNewChat}
                >
                  <div className="flex h-6 w-6 items-center justify-center drop-shadow-sm">
                    <PenNewSquare color="text-primary-500" size={24} />
                  </div>
                  <span
                    className="py-1"
                    style={{
                      fontSize: 16,
                      fontFamily: "Open Sans, sans-serif",
                      fontWeight: 500,
                      lineHeight: "24px",
                      color: "#515A65",
                    }}
                  >
                    {creatingSession ? "Creating…" : "New Chat"}
                  </span>
                </div>
                <div
                  className="group flex h-10 w-full cursor-pointer items-center gap-3 rounded-[100px] px-3 py-2 text-gray-700 transition-all duration-200 hover:bg-primary-50 hover:text-primary-700"
                  onClick={() => router.push("/chat/project")}
                >
                  <div className="flex h-6 w-6 items-center justify-center drop-shadow-sm">
                    <ProjectIcon color="text-primary-500" size={24} />
                  </div>
                  <span
                    className="py-1"
                    style={{
                      fontSize: 16,
                      fontFamily: "Open Sans, sans-serif",
                      fontWeight: 500,
                      lineHeight: "24px",
                      color: "#515A65",
                    }}
                  >
                    Project
                  </span>
                </div>
                <div
                  className="group flex h-10 w-full cursor-pointer items-center gap-3 rounded-[100px] px-3 py-2 text-gray-700 transition-all duration-200 hover:bg-primary-50 hover:text-primary-700"
                  onClick={() => router.push("/chat/recent")}
                >
                  <div className="flex h-6 w-6 items-center justify-center drop-shadow-sm">
                    <ChatIcon color="text-primary-500" size={24} />
                  </div>
                  <span
                    className="py-1"
                    style={{
                      fontSize: 16,
                      fontFamily: "Open Sans, sans-serif",
                      fontWeight: 500,
                      lineHeight: "24px",
                      color: "#515A65",
                    }}
                  >
                    Recent Chat
                  </span>
                </div>
                <div
                  className="group flex h-10 w-full cursor-pointer items-center gap-3 rounded-[100px] px-3 py-2 text-gray-700 transition-all duration-200 hover:bg-primary-50 hover:text-primary-700"
                  onClick={() => router.push("/chat/search")}
                >
                  <div className="flex h-6 w-6 items-center justify-center drop-shadow-sm">
                    <SearchIcon color="text-primary-500" size={24} />
                  </div>
                  <span
                    className="py-1"
                    style={{
                      fontSize: 16,
                      fontFamily: "Open Sans, sans-serif",
                      fontWeight: 500,
                      lineHeight: "24px",
                      color: "#515A65",
                    }}
                  >
                    Search Chat
                  </span>
                </div>
              </div>

              {/* Clear Chat Link */}
              <div className="mb-6 text-right">
                <span
                  className="cursor-pointer text-primary-500 hover:underline"
                  style={{
                    fontSize: 16,
                    fontFamily: "Open Sans, sans-serif",
                    fontWeight: 500,
                    lineHeight: "24px",
                  }}
                >
                  Clear Chat
                </span>
              </div>

              {/* Chat History Container */}
              <div className="min-h-0 flex-1 overflow-y-auto">
                {/* Loading State - only show when not on a specific chat page */}
                {loading && !currentChatId ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-500 text-sm">
                      Loading chats...
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Today Section */}
                    {todayChats.length > 0 && (
                      <div className="mb-4">
                        <h3
                          className="mb-3 font-medium text-gray-500 text-xs uppercase tracking-wider"
                          style={{
                            fontSize: 12,
                            fontFamily: "Open Sans, sans-serif",
                            fontWeight: 500,
                            lineHeight: "16px",
                          }}
                        >
                          Today
                        </h3>
                        <div className="space-y-1">
                          {todayChats.map((session) => (
                            <div key={session.id}>
                              {editingSessionId === session.id.toString() ? (
                                // Edit mode
                                <div className="flex items-center gap-2 px-3 py-2">
                                  <input
                                    autoFocus
                                    className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    onChange={(e) =>
                                      setEditingTitle(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleEditTitle(
                                          session.id.toString(),
                                          editingTitle
                                        );
                                      } else if (e.key === "Escape") {
                                        cancelEditing();
                                      }
                                    }}
                                    type="text"
                                    value={editingTitle}
                                  />
                                  <button
                                    className="text-green-600 text-sm hover:text-green-700"
                                    onClick={() =>
                                      handleEditTitle(
                                        session.id.toString(),
                                        editingTitle
                                      )
                                    }
                                  >
                                    ✓
                                  </button>
                                  <button
                                    className="text-gray-400 text-sm hover:text-gray-600"
                                    onClick={cancelEditing}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                // Normal mode
                                <div
                                  className={`group flex h-10 w-full cursor-pointer items-center justify-between rounded-[100px] px-3 transition-all duration-200 ${
                                    currentChatId === session.id.toString()
                                      ? "bg-primary-50 text-primary-700"
                                      : "text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                                  }`}
                                  onClick={() => {
                                    router.push(`/chat/${session.id}`);
                                  }}
                                  style={{
                                    fontSize: 16,
                                    fontFamily: "Open Sans, sans-serif",
                                    fontWeight: 500,
                                    lineHeight: "24px",
                                  }}
                                >
                                  <span>{truncateTitle(session.title)}</span>
                                  <div className="relative">
                                    <button
                                      className="text-gray-400 transition-colors hover:text-gray-600"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(
                                          openMenuId === session.id.toString()
                                            ? null
                                            : session.id.toString()
                                        );
                                      }}
                                      type="button"
                                    >
                                      ⋯
                                    </button>
                                    {openMenuId === session.id.toString() && (
                                      <div className="absolute top-8 right-0 z-10 min-w-[120px] rounded-lg border border-gray-200 bg-white shadow-lg">
                                        <button
                                          className="w-full rounded-t-lg px-3 py-2 text-left text-gray-700 text-sm hover:bg-gray-100"
                                          onClick={() =>
                                            startEditing(
                                              session.id.toString(),
                                              session.title
                                            )
                                          }
                                          type="button"
                                        >
                                          Edit Title
                                        </button>
                                        {/* Archive temporarily hidden */}
                                        <button
                                          className="w-full rounded-b-lg px-3 py-2 text-left text-red-600 text-sm hover:bg-red-50"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSessionToDelete(session);
                                            setDeleteModalOpen(true);
                                          }}
                                          type="button"
                                        >
                                          Delete Chat
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Older Chats Section */}
                {!loading && olderChats.length > 0 && (
                  <div className="mt-6">
                    <h3
                      className="mb-3 font-medium text-gray-500 text-xs uppercase tracking-wider"
                      style={{
                        fontSize: 12,
                        fontFamily: "Open Sans, sans-serif",
                        fontWeight: 500,
                        lineHeight: "16px",
                      }}
                    >
                      Older
                    </h3>
                    <div className="space-y-1">
                      {olderChats.map((session) => (
                        <div key={session.id}>
                          {editingSessionId === session.id.toString() ? (
                            // Edit mode
                            <div className="flex items-center gap-2 px-3 py-2">
                              <input
                                autoFocus
                                className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                onChange={(e) =>
                                  setEditingTitle(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleEditTitle(
                                      session.id.toString(),
                                      editingTitle
                                    );
                                  } else if (e.key === "Escape") {
                                    cancelEditing();
                                  }
                                }}
                                type="text"
                                value={editingTitle}
                              />
                              <button
                                className="text-green-600 text-sm hover:text-green-700"
                                onClick={() =>
                                  handleEditTitle(
                                    session.id.toString(),
                                    editingTitle
                                  )
                                }
                              >
                                ✓
                              </button>
                              <button
                                className="text-gray-400 text-sm hover:text-gray-600"
                                onClick={cancelEditing}
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            // Normal mode
                            <div
                              className={`group flex h-10 w-full cursor-pointer items-center justify-between rounded-[100px] px-3 transition-all duration-200 ${
                                currentChatId === session.id.toString()
                                  ? "bg-primary-50 text-primary-700"
                                  : "text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                              }`}
                              onClick={() => {
                                router.push(`/chat/${session.id}`);
                              }}
                              style={{
                                fontSize: 16,
                                fontFamily: "Open Sans, sans-serif",
                                fontWeight: 500,
                                lineHeight: "24px",
                              }}
                            >
                              <span>{truncateTitle(session.title)}</span>
                              <div className="relative">
                                <button
                                  className="text-gray-400 transition-colors hover:text-gray-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(
                                      openMenuId === session.id.toString()
                                        ? null
                                        : session.id.toString()
                                    );
                                  }}
                                  type="button"
                                >
                                  ⋯
                                </button>
                                {openMenuId === session.id.toString() && (
                                  <div className="absolute top-8 right-0 z-10 min-w-[120px] rounded-lg border border-gray-200 bg-white shadow-lg">
                                    <button
                                      className="w-full rounded-t-lg px-3 py-2 text-left text-gray-700 text-sm hover:bg-gray-100"
                                      onClick={() =>
                                        startEditing(
                                          session.id.toString(),
                                          session.title
                                        )
                                      }
                                      type="button"
                                    >
                                      Edit Title
                                    </button>
                                    {/* Archive temporarily hidden */}
                                    <button
                                      className="w-full rounded-b-lg px-3 py-2 text-left text-red-600 text-sm hover:bg-red-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSessionToDelete(session);
                                        setDeleteModalOpen(true);
                                      }}
                                      type="button"
                                    >
                                      Delete Chat
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!loading && chatSessions.length === 0 && !currentChatId && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="mb-2 text-gray-500 text-sm">
                      No chat history yet
                    </div>
                    <div className="text-gray-400 text-xs">
                      Start a new conversation to see it here
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-[20px] bg-white shadow-lg">
        {/* Optional content top (e.g., Back section) */}
        {contentTop && (
          <div className="px-5 pt-5">
            {contentTop}
            <div className="mt-2 h-px w-full bg-gray-200" />
          </div>
        )}
        {/* Content area */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog onOpenChange={setDeleteModalOpen} open={deleteModalOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center font-semibold text-gray-900 text-lg">
              Are you sure you want to delete this chat?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600 text-sm">
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex w-full flex-col gap-3">
            <Button
              className="w-full bg-red-500 text-white hover:bg-red-600"
              disabled={deleting || !sessionToDelete}
              onClick={() => {
                if (sessionToDelete) {
                  handleDeleteSession(sessionToDelete.id.toString());
                }
              }}
              type="button"
            >
              {deleting ? "Deleting..." : "Yes"}
            </Button>
            <Button
              className="w-full border-gray-300 text-gray-900 hover:bg-gray-50"
              onClick={() => {
                setDeleteModalOpen(false);
                setSessionToDelete(null);
              }}
              type="button"
              variant="outline"
            >
              No
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mobile Sidebar Overlay */}
      {(mobileSidebarOpen || mobileSidebarClosing) && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <button
            className={`absolute inset-0 bg-black/80 transition-all duration-500 ease-out ${
              mobileSidebarOpen && !mobileSidebarClosing
                ? "fade-in-0 animate-in"
                : "fade-out-0 animate-out"
            }`}
            onClick={() => {
              if (mobileSidebarOpen && !mobileSidebarClosing) {
                setMobileSidebarClosing(true);
                setTimeout(() => {
                  setMobileSidebarOpen(false);
                  setMobileSidebarClosing(false);
                }, ANIMATION_DURATION);
              }
            }}
            type="button"
          />
          {/* Sidebar */}
          <div
            className={`relative h-full w-80 bg-white p-5 shadow-lg transition-all duration-500 ease-out ${
              mobileSidebarOpen && !mobileSidebarClosing
                ? "slide-in-from-left animate-in"
                : "slide-out-to-left animate-out"
            }`}
          >
            <div className="flex h-full w-full flex-col bg-white">
              {/* Optional custom top (e.g., Back section) */}
              {sidebarTop && (
                <div className="mb-3">
                  {sidebarTop}
                  <div className="mt-2 h-px w-full bg-gray-200" />
                </div>
              )}

              {sidebarContentOverride ? (
                <div className="min-h-0 flex-1">{sidebarContentOverride}</div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-start">
                    <button
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 transition-colors hover:bg-primary-600"
                      onClick={() => router.push("/dashboard")}
                      type="button"
                    >
                      <img
                        alt="Scalebuild.ai Logo"
                        className="h-8 w-8 rounded-full object-contain"
                        src="/logo.png"
                      />
                    </button>
                  </div>

                  {/* Navigation */}
                  <div className="mt-8 mb-6 space-y-3">
                    <button
                      className="group flex h-10 w-full items-center gap-3 rounded-[100px] px-3 py-2 text-gray-700 transition-all duration-200 hover:bg-primary-50 hover:text-primary-700"
                      onClick={handleCreateNewChat}
                      type="button"
                    >
                      <div className="flex h-6 w-6 items-center justify-center drop-shadow-sm">
                        <PenNewSquare color="text-primary-500" size={24} />
                      </div>
                      <span
                        className="py-1"
                        style={{
                          fontSize: 16,
                          fontFamily: "Open Sans, sans-serif",
                          fontWeight: 500,
                          lineHeight: "24px",
                          color: "#515A65",
                        }}
                      >
                        {creatingSession ? "Creating…" : "New Chat"}
                      </span>
                    </button>
                    {/* Add other navigation items here - keeping it simple for now */}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Toggle Button - Bottom Right */}
      <button
        className="fixed right-5 bottom-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition-colors hover:bg-primary-600 lg:hidden"
        onClick={() => {
          if (mobileSidebarOpen) {
            setMobileSidebarClosing(true);
            setTimeout(() => {
              setMobileSidebarOpen(false);
              setMobileSidebarClosing(false);
            }, ANIMATION_DURATION);
          } else {
            setMobileSidebarOpen(true);
          }
        }}
        type="button"
      >
        <DotsGridIcon size={24} />
      </button>
    </div>
  );
}
