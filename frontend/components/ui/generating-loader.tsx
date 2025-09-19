"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/loader";

const GENERATING_MESSAGES = [
  "Generating. Hold tight please...",
  "Don't worry, it's working in the background...",
  "Great things take time...",
  "AI is crafting something amazing for you...",
  "Almost there! Your content is being prepared...",
  "Good things come to those who wait...",
  "The AI is working its magic...",
  "Just a few more moments...",
  "Creating something special for you...",
  "This will be worth the wait...",
];

export type GeneratingLoaderProps = {
  title?: string;
  isVisible?: boolean;
  variant?: "full" | "contained"; // full: 100svh (mobile overlay), contained: in-flow area (desktop)
};

// Compatibility wrapper for legacy imports
export function GeneratingLoader({
  isVisible = true,
  variant = "full",
}: GeneratingLoaderProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const MESSAGE_INTERVAL_MS = 10_000; // 5 seconds

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex === GENERATING_MESSAGES.length - 1 ? 0 : prevIndex + 1
      );
    }, MESSAGE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const isFull = variant === "full";

  return (
    <div
      className={
        isFull
          ? "flex h-screen min-h-screen w-full flex-col items-center justify-center bg-white"
          : "flex min-h-[70vh] w-full flex-col items-center justify-center bg-white"
      }
      style={isFull ? { height: "100svh", minHeight: "100svh" } : undefined}
    >
      <video
        autoPlay
        className="h-44 w-44"
        loop
        muted
        /* biome-ignore lint/nursery/useSortedClasses: Preserve this order for clarity */
        playsInline
      >
        <source src="/logo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p className="mt-6 max-w-md text-center text-gray-600">
        {GENERATING_MESSAGES[currentMessageIndex]}
      </p>
    </div>
  );
}

export default GeneratingLoader;
