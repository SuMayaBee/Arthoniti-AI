"use client";

import { useSandpack } from "@codesandbox/sandpack-react";
import { useCallback, useEffect, useRef } from "react";
import apiClient from "@/lib/api/client";

// Hoisted regex constant
const LEADING_SLASH_RE = /^\/+/;
const AUTOSAVE_DELAY = 2000;

export function useAutoSave(projectId?: string | number) {
  const { sandpack } = useSandpack();
  const timeoutRef = useRef<number | null>(null);
  const lastSnapshotRef = useRef<string>("");

  const buildFilesObject = useCallback(() => {
    const out: Record<string, string> = {};
    const files = sandpack.files as Record<string, unknown>;
    for (const [path, file] of Object.entries(files)) {
      const name = path.replace(LEADING_SLASH_RE, "");
      const content =
        typeof file === "string"
          ? file
          : ((file as { code?: string })?.code ?? "");
      out[name] = content;
    }
    return out;
  }, [sandpack.files]);

  useEffect(() => {
    // Debounce on any file graph change
    if (!projectId) {
      return;
    }

    // Serialize only the minimal object (name->content) to detect real changes
    const snapshot = JSON.stringify(buildFilesObject());
    if (snapshot === lastSnapshotRef.current) {
      return; // no actual content change
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    // Schedule save after 2 seconds of inactivity
    timeoutRef.current = window.setTimeout(async () => {
      try {
        const files = buildFilesObject();
        lastSnapshotRef.current = JSON.stringify(files);
        await apiClient.put(`/website-builder/projects/${projectId}`, {
          files,
        });
      } catch {
        // best-effort autosave; ignore errors
      }
    }, AUTOSAVE_DELAY);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [projectId, buildFilesObject]);

  return null;
}
