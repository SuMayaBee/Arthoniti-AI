"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ChatIcon from "@/components/icons/ChatIcon";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";

type WebsiteEditorHeaderProps = {
  onBackClick?: () => void;
  onNewChatClick?: () => void;
};

export function WebsiteEditorHeader({
  onBackClick,
  onNewChatClick,
}: WebsiteEditorHeaderProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.push("/dashboard/website-builder");
    }
  };

  const handleNewChatClick = () => {
    if (onNewChatClick) {
      onNewChatClick();
    } else {
      router.push("/dashboard/website-builder");
    }
  };

  return (
    <div className="px-5 pt-5">
      <div className="flex items-center gap-3">
        <BackButton inline onClick={handleBackClick} />
        <Link
          className="flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2 text-white transition-colors hover:bg-primary-600"
          href="/dashboard"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/40">
            <Image
              alt=""
              className="rounded-full"
              height={12}
              src="/logo.png"
              width={12}
            />
          </span>
          <span>Dashboard</span>
        </Link>
        <Button
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-gray-800 transition-colors hover:bg-gray-50"
          onClick={handleNewChatClick}
        >
          <ChatIcon color="text-black" size={18} />
          <span>New Chat</span>
        </Button>
      </div>
      <div className="mt-2 h-px w-full bg-gray-200" />
    </div>
  );
}
