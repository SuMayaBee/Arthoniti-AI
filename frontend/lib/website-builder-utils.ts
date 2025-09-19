// Hoisted regex constants
export const LEADING_SLASH_RE = /^\/+/;
export const SYS_PLACEHOLDER_RE = /^(thinking-|generating-)/;

// Static suffix appended to the serialized chat history
export const CHAT_PROMPT = "";

// Minimal project shape expected from backend
export type WebsiteProject = {
  id: string | number;
  title?: string;
  name?: string;
  prompt?: string;
  preview_url?: string;
  created_at?: string;
  files?: Record<string, unknown>;
  // messages from backend; keep as loose unknown[] and normalize later
  messages?: unknown[];
  // optional deployment metadata
  deployedUrl?: string;
  deployedAt?: string;
};

export type Message = {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
};

// Extract readable text from various object-shaped AI responses
export function extractText(raw: unknown): string {
  if (raw == null) {
    return "";
  }
  if (typeof raw === "string") {
    return raw;
  }
  if (Array.isArray(raw)) {
    return raw
      .map((r) => extractText(r))
      .filter(Boolean)
      .join("\n");
  }
  if (typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    const choices = o.choices as
      | { message?: { content?: unknown }; text?: unknown }[]
      | undefined;
    const data = o.data as { content?: unknown } | undefined;

    // Common fields
    const candidates: unknown[] = [
      o.result,
      o.message,
      o.content,
      choices?.[0]?.message?.content,
      choices?.[0]?.text,
      data?.content,
      o.output,
    ];
    for (const c of candidates) {
      const text = extractText(c);
      if (text) {
        return text;
      }
    }
    try {
      return JSON.stringify(o, null, 2);
    } catch {
      return String(o);
    }
  }
  return String(raw);
}

// Normalize backend messages -> Message[]
export function normalizeProjectMessages(
  messages: unknown[] | undefined
): Message[] {
  if (!Array.isArray(messages)) {
    return [];
  }
  return messages.map((msg: unknown, idx: number): Message => {
    const m = msg as Record<string, unknown>;
    const role = String(m?.role ?? m?.sender ?? "");
    // Treat 'assistant' and 'system' as AI messages
    const sender: "user" | "ai" =
      role === "assistant" || role === "ai" || role === "system"
        ? "ai"
        : "user";
    const rawContent = m?.content ?? m?.message ?? m?.data ?? "";
    const content = extractText(rawContent);
    const created = m?.created_at ?? m?.timestamp;
    const timestamp =
      created && typeof created === "string"
        ? new Date(created).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
    const id = String(m?.id ?? idx + 1);
    return { id, sender, content, timestamp };
  });
}

// Simple function to get Sandpack files from project
export function getSandpackFiles(
  project?: WebsiteProject | null
): Record<string, string> {
  if (!project?.files) {
    return {};
  }

  const files: Record<string, string> = {};

  for (const [key, value] of Object.entries(project.files)) {
    const fileName = key.startsWith("/") ? key : `/${key}`;

    if (typeof value === "string") {
      files[fileName] = value;
    } else if (value && typeof value === "object" && "code" in value) {
      files[fileName] = String((value as { code: unknown }).code);
    } else if (value != null) {
      files[fileName] = String(value);
    }
  }

  return files;
}

// Get preferred active file for Sandpack
export function getSandpackActiveFile(files: Record<string, string>): string {
  const candidates = ["/index.jsx", "/index.js", "/App.jsx", "/App.js"];
  for (const c of candidates) {
    if (files[c]) {
      return c;
    }
  }
  const first = Object.keys(files)[0];
  return first || "/App.js";
}

// Build files payload for deployment: exclude public/index.html, send { name, content }
export function buildFilesPayload(
  sandpackFiles: Record<string, string>
): Array<{ name: string; content: string }> {
  return Object.entries(sandpackFiles)
    .filter(
      ([path]) => path.replace(LEADING_SLASH_RE, "") !== "public/index.html"
    )
    .map(([path, content]) => ({
      name: path.replace(LEADING_SLASH_RE, ""),
      content,
    }));
}

// Convert local Message[] to backend shape
export function messagesToBackend(messages: Message[]) {
  return messages.map((m) => ({
    role: m.sender === "ai" ? "assistant" : "user",
    content: m.content,
  }));
}
