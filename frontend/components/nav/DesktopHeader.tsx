"use client";

import { BackButton } from "@/components/ui/back-button";
import { cn } from "@/lib/utils";

type DesktopHeaderProps = {
  className?: string;
  showBorder?: boolean;
  backButtonClassName?: string;
};

export default function DesktopHeader({
  className,
  showBorder = true,
  backButtonClassName,
}: DesktopHeaderProps) {
  return (
    <div className={cn("hidden lg:block", className)}>
        <BackButton inline className={cn("!w-10 !h-10", backButtonClassName)} />
      {showBorder ? <div className="h-px w-full bg-gray-200 mt-5" /> : null}
    </div>
  );
}
