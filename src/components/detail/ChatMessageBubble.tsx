"use client";

import React from "react";
import { ChatMessage } from "@/types";
import { Bot } from "lucide-react";

interface ChatMessageBubbleProps {
  key?: React.Key;
  msg: ChatMessage;
}

export default function ChatMessageBubble({ msg }: ChatMessageBubbleProps) {
  const isAssistant = msg.sender === "assistant";
  
  return (
    <div className={`flex gap-2 ${isAssistant ? "justify-start" : "justify-end"}`}>
      {isAssistant && (
        <div className="w-7 h-7 rounded-full bg-[#E1F5EE] flex items-center justify-center text-[#00694c] shrink-0 mt-1">
          <Bot className="w-4 h-4" />
        </div>
      )}
      <div
        className={`p-3.5 rounded-2xl max-w-[85%] text-sm shadow-sm leading-relaxed ${
          isAssistant
            ? "bg-[#e7f0ec] rounded-tl-sm text-on-surface"
            : "bg-[#00694c] rounded-tr-sm text-white font-medium"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}
