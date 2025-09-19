"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatLayout } from "@/components/chat-layout";
import HistoryLoader from "@/components/history-loader";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AutoSaveWrapper } from "@/components/website-builder/AutoSaveWrapper";
import { DeploymentDialog } from "@/components/website-builder/DeploymentDialog";
import { EditorToolbar } from "@/components/website-builder/EditorToolbar";
import { SandpackEditor } from "@/components/website-builder/SandpackEditor";
import WebsiteChatDetails from "@/components/website-builder/WebsiteChatDetails";
import { WebsiteEditorHeader } from "@/components/website-builder/WebsiteEditorHeader";
import { useProfile } from "@/hooks/use-profile";
import apiClient from "@/lib/api/client";
import {
  buildFilesPayload,
  CHAT_PROMPT,
  extractText,
  getSandpackActiveFile,
  getSandpackFiles,
  type Message,
  messagesToBackend,
  normalizeProjectMessages,
  SYS_PLACEHOLDER_RE,
  type WebsiteProject,
} from "@/lib/website-builder-utils";
import { useLoaderStore } from "@/store/loader";
import { useWebsiteBuilderStore } from "@/store/website-builder";

export default function WebsiteEditorPage() {
  const params = useParams();
  const router = useRouter();
  const websiteId = params.websiteId as string;
  const { userName, userImage } = useProfile();
  const showLoader = useLoaderStore((s) => s.show);
  const hideLoader = useLoaderStore((s) => s.hide);
  const {
    isRequestInProgress,
    generateRequestId,
    setAiChatLoading,
    setGenerateCodeLoading,
  } = useWebsiteBuilderStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<WebsiteProject | null>(null);
  // Force Sandpack to re-mount when files change significantly
  const [sandpackVersion, setSandpackVersion] = useState(0);

  // Deployment UI state
  const [deployOpen, setDeployOpen] = useState(false);
  const [deployLoading, setDeployLoading] = useState(false);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [deployData, setDeployData] = useState<{
    deployedUrl?: string;
    deploymentId?: string;
    projectName?: string;
    message?: string;
    s3Info?: {
      s3Folder: string;
      bucket: string;
      filesUploaded: number;
    };
  } | null>(null);

  const autoContinuedRef = useRef(false);
  const isGenerating = isRequestInProgress("generateCode");

  // Cleanup function to reset request states when component unmounts
  useEffect(() => {
    return () => {
      setAiChatLoading(false);
      setGenerateCodeLoading(false);
    };
  }, [setAiChatLoading, setGenerateCodeLoading]);

  useEffect(() => {
    let cancelled = false;
    async function fetchProject() {
      setLoading(true);
      // Show global loader during initial project load; offset to account for sidebar
      showLoader("Loading project", 400);
      try {
        const { data } = await apiClient.get<WebsiteProject>(
          `/website-builder/projects/${websiteId}`
        );
        if (!cancelled) {
          setProject(data);
          setMessages(normalizeProjectMessages(data?.messages));
        }
      } catch {
        // apiClient will toast errors; optionally navigate back on 404
      } finally {
        if (!cancelled) {
          setLoading(false);
          hideLoader();
        }
      }
    }
    fetchProject();
    return () => {
      cancelled = true;
    };
  }, [websiteId]);

  // Show global loader while code generation requests are in progress
  useEffect(() => {
    const anyGenerating = isRequestInProgress("generateCode");
    if (anyGenerating) {
      showLoader("Generating code", 400);
    } else {
      hideLoader();
    }
  }, [isRequestInProgress, showLoader, hideLoader]);

  // Simple Sandpack configuration - always use React template
  const sandpackFiles = useMemo(() => getSandpackFiles(project), [project]);
  const sandpackTemplate = "react" as const;
  // Prefer common entrypoints; fallback to first file or App.js
  const sandpackActiveFile = useMemo(() => {
    const candidates = ["/index.jsx", "/index.js", "/App.jsx", "/App.js"];
    for (const c of candidates) {
      if (sandpackFiles[c]) return c;
    }
    const first = Object.keys(sandpackFiles)[0];
    return first || "/App.js";
  }, [sandpackFiles]);

  // Memoized project title for use in generated index.html
  const projectTitle = useMemo(
    () => String((project?.title || project?.name || "Project") as string),
    [project?.title, project?.name]
  );

  const handleDeploy = useCallback(async () => {
    if (!project) return;
    setDeployOpen(true);
    setDeployLoading(true);
    setDeployError(null);
    setDeployData(null);

    try {
      const body = {
        projectId: String(project.id),
        projectName: (project.title ||
          project.name ||
          `website-${websiteId}`) as string,
        files: buildFilesPayload(sandpackFiles),
      };

      const res = await fetch("/api/website-builder/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setDeployData(data);
        // Persist deployment metadata to the project
        try {
          const deployedAt = new Date().toISOString();
          await apiClient.put(`/website-builder/projects/${project.id}`, {
            deployedUrl: data.deployedUrl,
            deployedAt,
          } as any);
          // Reflect locally
          setProject((prev) =>
            prev ? { ...prev, deployedUrl: data.deployedUrl, deployedAt } : prev
          );
        } catch {
          // swallow; deployment already succeeded, metadata update is best-effort
        }
      } else {
        setDeployError(data?.message || "Deployment failed");
      }
    } catch (err) {
      setDeployError("Network error during deployment");
    } finally {
      setDeployLoading(false);
    }
  }, [project, websiteId, sandpackFiles]);

  // Lazy-load JSZip from CDN for client-side zipping without adding a dependency
  const loadJSZip = useCallback(async (): Promise<any> => {
    if (typeof window === "undefined") return null;
    const w = window as any;
    if (w.JSZip) return w.JSZip;
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load JSZip"));
      document.body.appendChild(script);
    });
    return (window as any).JSZip;
  }, []);

  // Build and download a zip of the prepared files
  const handleDownload = useCallback(async () => {
    try {
      const JSZip = await loadJSZip();
      if (!JSZip) return;
      const zip = new JSZip();
      const files = buildFilesPayload(sandpackFiles);
      for (const f of files) {
        // f.name already normalized without leading slash
        zip.file((f as any).name ?? (f as any).path, f.content);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const sanitized = projectTitle
        .replace(/[^a-zA-Z0-9\s\-_]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();
      const filename = `${sanitized || "project"}.zip`;

      // Use native download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      // Best-effort: ignore, or integrate toast if desired
    }
  }, [sandpackFiles, loadJSZip, projectTitle]);

  // Auto-continue if we just arrived after creation and last message is from the user
  const continueFromLastUser = useCallback(async () => {
    if (autoContinuedRef.current) return;
    const projectId = project?.id;
    if (projectId == null) return;
    const persistedHistory = messages.filter(
      (m) => !SYS_PLACEHOLDER_RE.test(m.id)
    );
    if (persistedHistory.length === 0) return;
    const last = persistedHistory.at(-1);
    if (!last) return;
    if (last.sender !== "user") return;

    // Prevent duplicate auto-continue requests
    if (isRequestInProgress("aiChat") || isRequestInProgress("generateCode")) {
      return;
    }

    autoContinuedRef.current = true;

    const aiChatRequestId = generateRequestId();
    const generateCodeRequestId = generateRequestId();

    const thinkingMsg: Message = {
      id: `thinking-${Date.now()}`,
      sender: "ai",
      content: "Thinking…",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, thinkingMsg]);

    try {
      setAiChatLoading(true, aiChatRequestId);

      const chatHistory = messagesToBackend(persistedHistory);
      const PROMPT = JSON.stringify(chatHistory) + CHAT_PROMPT;
      const { data: aiData } = await apiClient.post(
        "/website-builder/ai-chat",
        { prompt: PROMPT }
      );
      const aiContent = extractText(aiData);
      const aiMsg: Message = {
        id: `${Date.now() + 1}`,
        sender: "ai",
        content: aiContent,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) =>
        prev.filter((m) => m.id !== thinkingMsg.id).concat(aiMsg)
      );

      const backendMessages = messagesToBackend([...persistedHistory, aiMsg]);
      await apiClient.put(`/website-builder/projects/${projectId}`, {
        messages: backendMessages,
      } as any);
      setProject((prev) =>
        prev ? { ...prev, messages: backendMessages as any } : prev
      );

      setAiChatLoading(false);

      const generatingMsg: Message = {
        id: `generating-${Date.now()}`,
        sender: "ai",
        content: "Generating…",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, generatingMsg]);

      // Build generate-code prompt from the full updated history, matching the sample approach
      const genPrompt = JSON.stringify(backendMessages) + CHAT_PROMPT;
      const generateCodeBody = { prompt: genPrompt };
      try {
        setGenerateCodeLoading(true, generateCodeRequestId);

        const genRes = await apiClient.post(
          "/website-builder/generate-code",
          generateCodeBody
        );
        const files = (genRes?.data as any)?.files ?? {};
        await apiClient.put(`/website-builder/projects/${projectId}`, {
          files,
        } as any);
        setProject((prev) => (prev ? { ...prev, files: files as any } : prev));
        setSandpackVersion((v) => v + 1);
      } finally {
        setGenerateCodeLoading(false);
        setMessages((prev) => prev.filter((m) => m.id !== generatingMsg.id));
      }
    } catch {
      setAiChatLoading(false);
      setGenerateCodeLoading(false);
      setMessages((prev) => prev.filter((m) => !SYS_PLACEHOLDER_RE.test(m.id)));
    }
  }, [
    project,
    messages,
    isRequestInProgress,
    generateRequestId,
    setAiChatLoading,
    setGenerateCodeLoading,
  ]);

  useEffect(() => {
    if (!autoContinuedRef.current && project && messages.length > 0) {
      // Add a small debounce to prevent rapid successive calls
      const timeoutId = setTimeout(() => {
        continueFromLastUser().catch(() => {
          /* ignored */
        });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [project, messages, continueFromLastUser]);

  const handleSendMessage = async (message: string) => {
    // Prevent duplicate requests
    if (isRequestInProgress("aiChat") || isRequestInProgress("generateCode")) {
      return;
    }

    const aiChatRequestId = generateRequestId();
    const generateCodeRequestId = generateRequestId();

    const userMsg: Message = {
      id: `${Date.now()}`,
      sender: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Optimistically add user message
    setMessages((prev) => [...prev, userMsg]);

    const projectId = project?.id;
    try {
      // 1) PUT user message into project history
      if (projectId != null) {
        const backendMessages = messagesToBackend([...messages, userMsg]);
        await apiClient.put(`/website-builder/projects/${projectId}`, {
          messages: backendMessages,
        } as any);
        // reflect locally so later steps can reuse
        setProject((prev) =>
          prev ? { ...prev, messages: backendMessages as any } : prev
        );
      }

      // 2) Show 'Thinking…' while ai-chat loads
      const thinkingMsg: Message = {
        id: `thinking-${Date.now()}`,
        sender: "ai",
        content: "Thinking…",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, thinkingMsg]);

      // 3) Call ai-chat with full history serialized + CHAT_PROMPT (sample style)
      setAiChatLoading(true, aiChatRequestId);

      const persistedHistory = messages.filter(
        (m) => !SYS_PLACEHOLDER_RE.test(m.id)
      );
      const chatHistory = messagesToBackend([...persistedHistory, userMsg]);
      const PROMPT = JSON.stringify(chatHistory) + CHAT_PROMPT;
      const { data: aiData } = await apiClient.post(
        "/website-builder/ai-chat",
        { prompt: PROMPT } as any
      );

      // Coerce AI content to string using existing helper
      const aiContent = extractText(aiData);
      const aiMsg: Message = {
        id: `${Date.now() + 1}`,
        sender: "ai",
        content: aiContent,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // 4) Replace 'Thinking…' with real AI message
      setMessages((prev) =>
        prev.filter((m) => m.id !== thinkingMsg.id).concat(aiMsg)
      );

      setAiChatLoading(false);

      // 5) PUT AI message into project history
      if (projectId != null) {
        const backendMessages = messagesToBackend([
          ...messages,
          userMsg,
          aiMsg,
        ]);
        await apiClient.put(`/website-builder/projects/${projectId}`, {
          messages: backendMessages,
        } as any);
        setProject((prev) =>
          prev ? { ...prev, messages: backendMessages as any } : prev
        );
      }

      // 6) Start code generation with 'Generating…' status
      const generatingMsg: Message = {
        id: `generating-${Date.now()}`,
        sender: "ai",
        content: "Generating…",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, generatingMsg]);

      // For generate-code, send only the user's current message as the prompt
      const promptMessage = userMsg.content;
      const generateCodeBody = { prompt: promptMessage };

      try {
        setGenerateCodeLoading(true, generateCodeRequestId);

        const genRes = await apiClient.post(
          "/website-builder/generate-code",
          generateCodeBody
        );
        const files = (genRes?.data as any)?.files ?? {};
        if (projectId != null) {
          await apiClient.put(`/website-builder/projects/${projectId}`, {
            files,
          } as any);
          // Update local project and bump version to refresh Sandpack
          setProject((prev) =>
            prev ? { ...prev, files: files as any } : prev
          );
          setSandpackVersion((v) => v + 1);
        }
      } finally {
        setGenerateCodeLoading(false);
        // Remove 'Generating…' bubble regardless of success
        setMessages((prev) => prev.filter((m) => m.id !== generatingMsg.id));
      }
    } catch (_err) {
      setAiChatLoading(false);
      setGenerateCodeLoading(false);
      // Remove system placeholders on error
      setMessages((prev) => prev.filter((m) => !SYS_PLACEHOLDER_RE.test(m.id)));
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col bg-white">
        <WebsiteEditorHeader />
        {/* Loading state: same behavior as other generator pages */}
        {/* Mobile/tablet: full height under header */}
        <div className="lg:hidden">
          <HistoryLoader />
        </div>
        {/* Desktop: contained loader */}
        <div className="hidden lg:block">
          <div className="px-8 py-10">
            <HistoryLoader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <WebsiteEditorHeader />
      <div className="min-h-0 flex-1">
        <ChatLayout
          fullHeight={false}
          sidebarContentOverride={
            <div className="h-full">
              <WebsiteChatDetails
                isGenerating={
                  isRequestInProgress("aiChat") ||
                  isRequestInProgress("generateCode")
                }
                messages={messages}
                onSendMessage={handleSendMessage}
                userImage={userImage}
                userName={userName}
              />
            </div>
          }
        >
          <div className="flex h-full w-full gap-4">
            <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              <Tabs className="flex h-full flex-col" defaultValue="code">
                <EditorToolbar
                  deployedUrl={project?.deployedUrl}
                  deployLoading={deployLoading}
                  onDeploy={handleDeploy}
                  onDownload={handleDownload}
                  projectTitle={projectTitle}
                />
                <div className="min-h-0 flex-1 p-3">
                  <div className="flex h-full min-h-0">
                    <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-[#011627]">
                      <div className="h-full">
                        <SandpackEditor
                          activeFile={sandpackActiveFile}
                          files={sandpackFiles}
                          isGenerating={isRequestInProgress("generateCode")}
                          version={sandpackVersion}
                        >
                          <AutoSaveWrapper projectId={project?.id} />
                        </SandpackEditor>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs>
            </div>
          </div>
        </ChatLayout>
      </div>
      <DeploymentDialog
        deployData={deployData}
        error={deployError}
        loading={deployLoading}
        onOpenChange={setDeployOpen}
        open={deployOpen}
      />
    </div>
  );
}
