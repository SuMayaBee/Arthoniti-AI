"use client";

import { useAutoSave } from "@/hooks/use-auto-save";

type AutoSaveWrapperProps = {
  projectId?: string | number;
};

export function AutoSaveWrapper({ projectId }: AutoSaveWrapperProps) {
  useAutoSave(projectId);
  return null;
}
