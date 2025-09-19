"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import RightArrowMdIcon from "@/components/icons/RightArrowMdIcon";
import { Textarea } from "@/components/ui/textarea";
import { markdownToHtml } from "@/lib/markdown-utils";
import { Button } from "../ui/button";

type Message = {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
  avatar?: string;
};

type WebsiteChatDetailsProps = {
  messages: Message[];
  onSendMessage: (message: string) => void;
  userName?: string;
  userImage?: string;
  isGenerating?: boolean;
};

export default function WebsiteChatDetails({
  messages,
  onSendMessage,
  userName,
  userImage,
  isGenerating = false,
}: WebsiteChatDetailsProps) {
  const [inputMessage, setInputMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to the last message by default and whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && !isGenerating) {
      onSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-gray-200 border-b px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary-50 p-1.5">
          <Image
            alt="Website Builder"
            className="h-5 w-5 rounded-full object-contain"
            height={20}
            src="/logo.png"
            width={20}
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">
            Website Builder Assistant
          </h3>
          <p className="text-gray-500 text-xs">
            {isGenerating
              ? "Generating code..."
              : "Ready to help with your website"}
          </p>
        </div>
      </div>

      {/* Messages Container - Scrollable */}
      <div className="scrollbar-hide flex-1 overflow-y-auto px-4">
        <div className="w-full max-w-full space-y-4 py-4">
          {messages.map((message) => (
            <div
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
              key={message.id}
            >
              {message.sender === "user" ? (
                <div className="flex min-w-0 max-w-[85%] items-start gap-2">
                  {/* Column: header and bubble aligned right */}
                  <div className="flex min-w-0 flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">
                        {message.timestamp}
                      </span>
                      <span className="font-semibold text-gray-700 text-xs">
                        {userName || "You"}
                      </span>
                    </div>
                    <div className="max-w-full rounded-2xl border-none bg-primary-500 px-3 py-2 text-white">
                      <div
                        className="whitespace-pre-line break-words text-sm leading-normal"
                        style={{ overflowWrap: "break-word" }}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                  {/* Avatar on right */}
                  <div className="flex-shrink-0">
                    {userImage ? (
                      <Image
                        alt={userName || "You"}
                        className="h-8 w-8 rounded-full object-cover"
                        height={32}
                        src={userImage}
                        width={32}
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-300">
                        <span className="font-semibold text-gray-700 text-xs">
                          {(userName || "Y").charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex min-w-0 max-w-[85%] items-start gap-2">
                  {/* Avatar on left */}
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-50 p-1.5">
                    <Image
                      alt="Website Builder"
                      className="h-5 w-5 rounded-full object-contain"
                      height={20}
                      src="/logo.png"
                      width={20}
                    />
                  </div>
                  {/* Column: header and bubble aligned left */}
                  <div className="flex min-w-0 flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700 text-xs">
                        Website Builder
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {message.timestamp}
                      </span>
                    </div>
                    <div className="max-w-full rounded-2xl border-none bg-gray-100 px-3 py-2 text-gray-800 shadow-sm">
                      <div
                        className="markdown-content whitespace-pre-line break-words text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: markdownToHtml(message.content),
                        }}
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: Controlled markdown content from API
                        style={{ overflowWrap: "break-word" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {/* Anchor to ensure view sticks to the last message */}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 bg-white px-0 pt-2 pb-0">
        <div className="relative box-border w-full max-w-full">
          <div
            className={`rainbow-gradient-border ${isGenerating ? "opacity-50" : ""} rotating-gradient-border block w-full max-w-full overflow-hidden rounded-[12px] p-[2px]`}
          >
            <Textarea
              className="scrollbar-hide h-[100px] resize-none overflow-y-auto rounded-[12px] border-0 bg-white py-3 pr-12 text-gray-800 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-primary-500 focus-visible:outline-none"
              disabled={isGenerating}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                isGenerating
                  ? "Generating code, please wait..."
                  : "Describe changes to your website"
              }
              rows={3}
              value={inputMessage}
            />
            <Button
              className={`absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 px-2 py-2 text-white transition-all duration-300 hover:bg-primary-600 ${
                isGenerating || !inputMessage.trim()
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              disabled={isGenerating || !inputMessage.trim()}
              onClick={handleSendMessage}
            >
              {isGenerating ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <RightArrowMdIcon color="text-white" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
