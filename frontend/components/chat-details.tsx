/** biome-ignore-all lint/nursery/useConsistentTypeDefinitions: <explanation> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import RightArrowMdIcon from "@/components/icons/RightArrowMdIcon";
import { Textarea } from "@/components/ui/textarea";
import { markdownToHtml } from "@/lib/markdown-utils";
import { Button } from "./ui/button";

interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
  avatar?: string;
}

interface ChatDetailsProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  userName?: string;
  userImage?: string;
}

export default function ChatDetails({
  messages,
  onSendMessage,
  userName,
  userImage,
}: ChatDetailsProps) {
  const [inputMessage, setInputMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to the last message by default and whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
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
                <div className="flex min-w-0 max-w-[95%] items-start gap-2">
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
                    <div className="max-w-full rounded-3xl border-none bg-primary-500 px-4 py-2 text-white">
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
                        className="h-12 w-12 rounded-full object-cover"
                        height={48}
                        src={userImage}
                        width={48}
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-300">
                        <span className="font-semibold text-gray-700 text-sm">
                          {(userName || "Y").charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex min-w-0 max-w-[95%] items-start gap-2">
                  {/* Avatar on left */}
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-50 p-2.5">
                    <Image
                      alt="Scalebuild.ai"
                      className="h-7 w-7 rounded-full object-contain"
                      height={28}
                      src="/logo.png"
                      width={28}
                    />
                  </div>
                  {/* Column: header and bubble aligned left */}
                  <div className="flex min-w-0 flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700 text-xs">
                        Hyperscaler
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {message.timestamp}
                      </span>
                    </div>
                    <div className="max-w-full rounded-3xl border-none bg-gray-100 px-4 py-2 text-gray-800 shadow-sm">
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
      <div className="flex-shrink-0 bg-white px-0 pt-2 pb-4">
        <div className="relative box-border w-full max-w-full">
          <div className="rainbow-gradient-border rotating-gradient-border block w-full max-w-full overflow-hidden rounded-[15px] p-[2px]">
            <Textarea
              className="scrollbar-hide h-[120px] resize-none overflow-y-auto rounded-[15px] border-0 bg-white py-4 text-gray-800 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-primary-500 focus-visible:outline-none"
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything"
              rows={3}
              value={inputMessage}
            />
          </div>
          <Button
            className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-xl bg-primary-500 px-4 py-3 text-white transition-all duration-300 hover:bg-primary-600"
            onClick={handleSendMessage}
          >
            <RightArrowMdIcon color="text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
