"use client";

import Loader from "@/components/loader";
import { useLoaderStore } from "@/store/loader";

export default function GlobalLoaderPortal() {
  const isVisible = useLoaderStore((s) => s.isVisible);
  const leftOffsetPx = useLoaderStore((s) => s.leftOffsetPx);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999]"
      style={
        leftOffsetPx !== undefined
          ? { left: leftOffsetPx, width: `calc(100% - ${leftOffsetPx}px)` }
          : undefined
      }
    >
      {/* When offset is provided, confine the loader to this wrapper by using container mode */}
      <Loader mode={leftOffsetPx !== undefined ? "container" : "fullscreen"} />
    </div>
  );
}
