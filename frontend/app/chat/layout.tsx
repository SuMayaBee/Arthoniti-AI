"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ChatIcon from "@/components/icons/ChatIcon";
import PenNewSquare from "@/components/icons/PenNewSquare";
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
import { useProfile } from "@/hooks/use-profile";
import apiClient from "@/lib/api/client";
import { useAuthStore } from "@/store/auth";
import { useChatStore } from "@/store/chat";

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

function ChatSidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const { user, signout } = useAuthStore();
  const { profile } = useProfile();
  const router = useRouter();
  const pathname = usePathname();
  const {
    sessions,
    loading,
    loadSessions,
    updateSessionTitle,
    addSession,
    deleteSession: deleteSessionFromStore,
    clearAllSessions,
  } = useChatStore();
  const [isCreating, setIsCreating] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Load chat sessions only once when component mounts
  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      loadSessions(userId);
    }
  }, [loadSessions]);

  const createNewChat = async () => {
    if (isCreating) {
      return;
    }
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        return;
      }

      setIsCreating(true);

      // Create session using apiClient to backend
      const sessionResponse = await apiClient.post("/chat/sessions", {
        user_id: userId,
        title: "New Chat",
      });

      // Optimistically add to store so sidebar updates immediately
      if (sessionResponse?.data?.id) {
        const session = sessionResponse.data;
        addSession({ ...session, messages: session.messages ?? [] });
        router.push(`/chat/${session.id}`);
      } else {
        // Fallback just in case
        router.push("/chat");
      }
    } catch (error) {
      console.error("Error creating new chat:", error);
      // Fallback: navigate to chat page
      router.push("/chat");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditTitle = async (sessionId: number, newTitle: string) => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        return;
      }

      if (!newTitle.trim()) {
        return;
      }

      const response = await apiClient.put(
        `/chat/sessions/${sessionId}/title?user_id=${userId}&title=${encodeURIComponent(newTitle.trim())}`
      );

      if (response.data) {
        const data = response.data;
        // Update the session in the store
        updateSessionTitle(sessionId.toString(), data.title, data.updated_at);

        // Reset editing state
        setEditingSessionId(null);
        setEditingTitle("");
        setOpenMenuId(null);
      }
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };

  const handleDeleteSession = async (sessionId: number) => {
    try {
      await deleteSessionFromStore(sessionId.toString());

      // If deleting the currently open chat, navigate away
      if (pathname === `/chat/${sessionId}`) {
        // Prefer going to Recent list
        router.push("/chat/recent");
      }

      setOpenMenuId(null);
    } catch {
      // Handle error silently for now
    }
  };

  const startEditing = (sessionId: number, currentTitle: string) => {
    setEditingSessionId(sessionId);
    setEditingTitle(currentTitle);
    setOpenMenuId(null);
  };

  const cancelEditing = () => {
    setEditingSessionId(null);
    setEditingTitle("");
  };

  const handleClearAllChats = async () => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      setIsClearing(true);
      await clearAllSessions(userId);

      // Navigate to main chat page after clearing
      router.push("/chat");

      toast.success("All chats cleared successfully");
      setShowClearConfirm(false);
    } catch (error) {
      console.error("Error clearing chats:", error);
      toast.error("Failed to clear chats");
    } finally {
      setIsClearing(false);
    }
  };

  // Helper function to truncate chat title
  const truncateTitle = (title: string, maxLength = 25): string => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + "...";
  };

  // Separate sessions into today and older
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const todayChats = sessions.filter((session) => {
    const sessionDate = new Date(session.updated_at);
    return sessionDate >= todayStart;
  });

  const olderChats = sessions.filter((session) => {
    const sessionDate = new Date(session.updated_at);
    return sessionDate < todayStart;
  });

  return (
    <div className="flex h-full w-full max-w-80 flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
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

      {/* Navigation */}
      <div className="mt-8 mb-6 space-y-3">
        <div
          className="group flex h-10 w-full cursor-pointer items-center gap-3 rounded-[100px] px-3 py-2 text-gray-700 transition-all duration-200 hover:bg-primary-50 hover:text-primary-700"
          onClick={createNewChat}
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
            {isCreating ? "Creating…" : "New Chat"}
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
          onClick={() => setShowClearConfirm(true)}
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
        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500 text-sm">Loading chats...</div>
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
                      {editingSessionId === session.id ? (
                        // Edit mode
                        <div className="flex items-center gap-2 px-3 py-2">
                          <input
                            autoFocus
                            className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleEditTitle(session.id, editingTitle);
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
                              handleEditTitle(session.id, editingTitle)
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
                            pathname === `/chat/${session.id}`
                              ? "bg-primary-50 text-primary-700"
                              : "text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                          }`}
                          onClick={() => router.push(`/chat/${session.id}`)}
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
                                  openMenuId === session.id ? null : session.id
                                );
                              }}
                              type="button"
                            >
                              ⋯
                            </button>
                            {openMenuId === session.id && (
                              <div className="absolute top-8 right-0 z-10 min-w-[120px] rounded-lg border border-gray-200 bg-white shadow-lg">
                                <button
                                  className="w-full rounded-t-lg px-3 py-2 text-left text-gray-700 text-sm hover:bg-gray-100"
                                  onClick={() =>
                                    startEditing(session.id, session.title)
                                  }
                                  type="button"
                                >
                                  Edit Title
                                </button>
                                <button
                                  className="w-full rounded-b-lg px-3 py-2 text-left text-red-600 text-sm hover:bg-red-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSession(session.id);
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

            {/* Older Chats Section */}
            {olderChats.length > 0 && (
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
                      {editingSessionId === session.id ? (
                        // Edit mode
                        <div className="flex items-center gap-2 px-3 py-2">
                          <input
                            autoFocus
                            className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleEditTitle(session.id, editingTitle);
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
                              handleEditTitle(session.id, editingTitle)
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
                            pathname === `/chat/${session.id}`
                              ? "bg-primary-50 text-primary-700"
                              : "text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                          }`}
                          onClick={() => router.push(`/chat/${session.id}`)}
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
                                  openMenuId === session.id ? null : session.id
                                );
                              }}
                              type="button"
                            >
                              ⋯
                            </button>
                            {openMenuId === session.id && (
                              <div className="absolute top-8 right-0 z-10 min-w-[120px] rounded-lg border border-gray-200 bg-white shadow-lg">
                                <button
                                  className="w-full rounded-t-lg px-3 py-2 text-left text-gray-700 text-sm hover:bg-gray-100"
                                  onClick={() =>
                                    startEditing(session.id, session.title)
                                  }
                                  type="button"
                                >
                                  Edit Title
                                </button>
                                <button
                                  className="w-full rounded-b-lg px-3 py-2 text-left text-red-600 text-sm hover:bg-red-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSession(session.id);
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
            {sessions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-2 text-gray-500 text-sm">
                  No chat history yet
                </div>
                <div className="text-gray-400 text-xs">
                  Start a new conversation to see it here
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Clear All Chats Confirmation Modal */}
      <AlertDialog onOpenChange={setShowClearConfirm} open={showClearConfirm}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center font-semibold text-gray-900 text-lg">
              Clear All Chats?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600 text-sm">
              This will permanently delete all your chat history. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex w-full flex-col gap-3">
            <Button
              className="w-full bg-red-500 text-white hover:bg-red-600"
              disabled={isClearing}
              onClick={handleClearAllChats}
              type="button"
            >
              {isClearing ? "Clearing..." : "Yes, Clear All"}
            </Button>
            <Button
              className="w-full border-gray-300 text-gray-900 hover:bg-gray-50"
              onClick={() => setShowClearConfirm(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="w-full bg-white p-0 lg:px-5 lg:py-5">
      <div className="mx-auto grid w-full grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
        {/* Mobile Overlay */}
        {isMobileSidebarOpen && (
          <button
            aria-label="Close sidebar overlay"
            className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
            onClick={closeMobileSidebar}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                closeMobileSidebar();
              }
            }}
            type="button"
          />
        )}

        {/* Left Sidebar - Desktop */}
        <div className="sticky top-5 hidden self-start lg:block">
          <div className="h-auto w-full overflow-hidden border-[#CED5DE] border-[0.5px] p-2 shadow-lg lg:h-[calc(100vh-40px)] lg:rounded-[20px]">
            <ChatSidebar onCloseMobile={closeMobileSidebar} />
          </div>
        </div>

        {/* Left Sidebar - Mobile */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-80 max-w-[85vw] transform border-none bg-white p-5 shadow-lg transition-transform duration-300 ease-in-out lg:hidden ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <ChatSidebar onCloseMobile={closeMobileSidebar} />
        </div>

        {/* Main Content */}
        <div className="w-full bg-white shadow-lg lg:rounded-[20px]">
          {/* Mobile Menu Button - Integrated within main content */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <button
              aria-label={
                isMobileSidebarOpen ? "Close sidebar" : "Open sidebar"
              }
              className="flex items-center gap-2 rounded-full bg-primary-50 p-3 text-primary-600 transition-colors hover:bg-primary-100"
              onClick={toggleMobileSidebar}
              type="button"
            >
              <ChatIcon size={20} />
            </button>
          </div>

          {/* Content Container - matching dashboard structure */}
          <div className="h-[90.5vh] px-5 md:h-[calc(100vh-40px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
