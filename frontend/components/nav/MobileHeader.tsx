"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BackButton } from "@/components/ui/back-button";

export interface MobileHeaderProps {
  title?: string; // Optional explicit title override
  className?: string;
  showBorder?: boolean;
  rightSlot?: ReactNode; // optional right-side content (e.g., button)
  onBack?: () => void; // optional custom back action
}

function toTitleCase(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function deriveTitleFromPath(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "Home";
  // Prefer the last non-id-like segment
  const nonId = [...parts]
    .reverse()
    .find((p) => !/^\[.*\]$/.test(p) && !/^[0-9a-fA-F-]{8,}$/.test(p) && !/^\d+$/.test(p));
  return toTitleCase(nonId ?? parts[parts.length - 1]);
}

export default function MobileHeader({
  title,
  className = "",
  showBorder = true,
  rightSlot,
  onBack,
}: MobileHeaderProps) {
  const pathname = usePathname();
  const computedTitle = title ?? deriveTitleFromPath(pathname || "/");

  return (
    <div className={`${showBorder ? "border-b " : ""}lg:hidden mb-5 ${className}`}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Back button + Title */}
        <div className="flex min-w-0 items-center gap-3">
          <BackButton inline onClick={onBack} />
          <h1
            className="truncate text-base font-normal text-foreground sm:text-lg"
            aria-label={computedTitle}
          >
            {computedTitle}
          </h1>
        </div>

        {/* Right: Optional slot */}
        {rightSlot ? <div className="ml-3 flex shrink-0 items-center">{rightSlot}</div> : null}
      </div>
    </div>
  );
}
