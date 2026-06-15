"use client";

import React from "react";
import { ChatMessage, BookingAttempt } from "@/types";
import { Bot, Loader2, Send } from "lucide-react";
import ChatMessageBubble from "./ChatMessageBubble";
import BookingConfirmCard from "./BookingConfirmCard";

interface AIAssistantPanelProps {
  messages: ChatMessage[];
  isTyping: boolean;
  bookingAttempt: BookingAttempt | null;
  activityTitle: string;
  activityPrice: number;
  inputValue: string;
  onInputValueChange: (value: string) => void;
  onSendMessage: () => void;
  onConfirmBooking: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function AIAssistantPanel({
  messages,
  isTyping,
  bookingAttempt,
  activityTitle,
  activityPrice,
  inputValue,
  onInputValueChange,
  onSendMessage,
  onConfirmBooking,
  messagesEndRef,
}: AIAssistantPanelProps) {
  return (
    <div className="bg-white rounded-3xl border border-[#E1F5EE] shadow-[0px_12px_32px_rgba(0,0,0,0.08)] flex flex-col h-[600px] overflow-hidden ai-float">
      
      {/* Header info */}
      <div className="bg-[#E1F5EE]/80 backdrop-blur-md p-4 border-b border-[#E1F5EE] flex items-center gap-3 shrink-0">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-[#00694c] flex items-center justify-center text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#1D9E75] border-2 border-white rounded-full"></div>
        </div>
        <div className="text-left">
          <h3 className="text-sm font-bold text-[#151d1b]">AI Booking Assistant</h3>
          <p className="text-[10px] text-[#3d4943] font-semibold flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1D9E75]"></span> 
            Online
          </p>
        </div>
      </div>

      {/* Chat Stream Bubble Messages */}
      <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-4 bg-gradient-to-b from-[#f3fbf7] to-white">
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} msg={msg} />
        ))}

        {/* Bot thinking placeholder */}
        {isTyping && (
          <div className="flex gap-2 justify-start items-center">
            <div className="w-7 h-7 rounded-full bg-[#E1F5EE] flex items-center justify-center text-[#00694c] shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#e7f0ec] p-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
              <Loader2 className="w-4 h-4 animate-spin text-[#1D9E75]" />
              <span className="text-xs text-[#6d7a73] font-semibold">Tuning availability...</span>
            </div>
          </div>
        )}

        {/* Dynamic confirm ticket panel */}
        {bookingAttempt && bookingAttempt.readyToConfirm && (
          <BookingConfirmCard
            activityTitle={activityTitle}
            activityPrice={activityPrice}
            bookingAttempt={bookingAttempt}
            onConfirm={onConfirmBooking}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form area */}
      <div className="p-4 bg-white border-t border-[#e1eae6] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputValueChange(e.target.value)}
            placeholder="E.g., June 12 at 10 AM for 2 people..."
            className="w-full bg-[#f3fbf7] py-3 pl-4 pr-12 rounded-full border border-[#bccac1] focus:border-[#00694c] focus:ring-1 focus:ring-[#00694c] text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-1.5 w-9 h-9 flex items-center justify-center bg-[#00694c] hover:bg-[#00513a] disabled:bg-[#bccac1] text-white rounded-full hover:scale-95 active:scale-90 transition-transform cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-2 text-center">
          <span className="text-[10px] text-[#6d7a73]">
            AI may produce inaccurate information about real-time availability.
          </span>
        </div>
      </div>

    </div>
  );
}
