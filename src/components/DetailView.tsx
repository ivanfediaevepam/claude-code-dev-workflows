"use client";

import React, { useState, useEffect, useRef } from "react";
import { Activity, Booking, ChatMessage, BookingAttempt } from "@/types";
import { ArrowLeft, Heart, Star } from "lucide-react";
import ActivitySpecs from "./detail/ActivitySpecs";
import AvailabilitySlots from "./detail/AvailabilitySlots";
import AIAssistantPanel from "./detail/AIAssistantPanel";

interface DetailViewProps {
  activity: Activity;
  onGoBack: () => void;
  onAddBooking: (booking: Booking) => void;
}

export default function DetailView({ activity, onGoBack, onAddBooking }: DetailViewProps) {
  const [liked, setLiked] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-initial",
      sender: "assistant",
      text: `Hi! I'm your Shoreline assistant. I can help you secure your spot for the ${activity.title}. Which date and time would you like to book, and for how many people?`,
      timestamp: "09:41 AM",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [bookingAttempt, setBookingAttempt] = useState<BookingAttempt | null>(null);
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages to the bottom when history changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputVal.trim();
    if (!textToSend) return;

    if (!customText) {
      setInputVal("");
    }

    const newMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          activityContext: activity,
          systemTime: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        }),
      });

      if (!response.ok) {
        throw new Error("Backend response error");
      }

      const data = await response.json();
      
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-a-${Date.now()}`,
          sender: "assistant",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        },
      ]);

      if (data.bookingAttempt) {
        setBookingAttempt(data.bookingAttempt);
      }
    } catch (err) {
      console.error("AI Assistant service call error, using local fallback parser", err);
      // Local fallback
      setTimeout(() => {
        setIsTyping(false);
        const lowerInput = textToSend.toLowerCase();
        let reply = "";
        let attempt: BookingAttempt | null = null;

        if (lowerInput.includes("june 12") || lowerInput.includes("12")) {
          reply = "Perfect! June 12 is an excellent choice. I am ready to set up this slot for you. How many people are attending?";
          attempt = {
            date: "June 12",
            time: "10:00 AM - 12:00 PM",
            people: 2,
            readyToConfirm: false
          };
        } else if (lowerInput.includes("june 13") || lowerInput.includes("13")) {
          reply = "Wonderful, June 13 it is. I can reserve this slot for you. How many people are in your group?";
          attempt = {
            date: "June 13",
            time: "10:00 AM - 12:00 PM",
            people: 2,
            readyToConfirm: false
          };
        } else if (lowerInput.includes("person") || lowerInput.includes("people") || /\b[1-6]\b/.test(lowerInput)) {
          const match = lowerInput.match(/\b([1-6])\b/);
          const count = match ? parseInt(match[1]) : 2;
          reply = `Of course! I have noted ${count} guests. Let's confirm by choosing an option below! Please click the confirmation banner to finalize.`;
          attempt = {
            date: "June 12",
            time: "10:00 AM - 12:00 PM",
            people: count,
            readyToConfirm: true
          };
        } else {
          reply = `I would love to help you book the ${activity.title}! We have spots available on June 12 at 10:00 AM and June 13 at 10:00 AM. In how many people, and what date would you like?`;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `msg-a-fb-${Date.now()}`,
            sender: "assistant",
            text: reply,
            timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          },
        ]);

        if (attempt) {
          setBookingAttempt(attempt);
        }
      }, 1000);
    }
  };

  const handleSlotClick = (slot: { date: string; time: string }) => {
    const promptText = `I'd like to book for ${slot.date} at ${slot.time}`;
    handleSendMessage(promptText);
  };

  const executeConfirmBooking = () => {
    if (!bookingAttempt) return;

    const newBooking: Booking = {
      id: `SL-${Math.floor(1000 + Math.random() * 9000)}`,
      activityId: activity.id,
      activityTitle: activity.title,
      activityCategory: activity.category,
      activityImage: activity.image,
      date: bookingAttempt.date,
      time: bookingAttempt.time,
      peopleCount: bookingAttempt.people,
      totalPrice: activity.price * bookingAttempt.people,
      status: "Confirmed",
      preparationGuide: activity.id === "beginner-surf" 
        ? "Arrive 15 minutes early at the North Beach hut. Bring sunscreen and a towel!" 
        : "Check weather forecast before arrival. Gear and life vests are provided at the dock."
    };

    onAddBooking(newBooking);
    setIsBookedSuccess(true);
    setBookingAttempt(null);

    // Show success chat message
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-sys-success-${Date.now()}`,
        sender: "assistant",
        text: `🎉 Congratulations! Your reservation for June 12 was successfully registered under Booking ID ${newBooking.id}! You are fully set up for the beach. Feel free to view your bookings in the header tab.`,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      }
    ]);
  };

  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-6 py-6 md:py-12">
      {/* Header Context Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onGoBack}
          className="flex items-center gap-1.5 text-[#3d4943] hover:text-[#00694c] font-semibold text-sm transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to activities</span>
        </button>

        <button
          onClick={() => setLiked(!liked)}
          className={`w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant/30 hover:bg-[#E1F5EE]/40 transition active:scale-95 cursor-pointer ${
            liked ? "text-red-500 fill-red-500 border-red-100 bg-red-50" : "text-[#3d4943]"
          }`}
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Detailed Display card */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Main Visual Cover */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#e1eae6] shadow-[0px_4px_20px_rgba(29,158,117,0.06)] border border-[#E1F5EE]">
            <img
              src={activity.image}
              alt={activity.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Overlay Rating badge */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-md">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-on-surface">{activity.rating} ({activity.reviewsCount})</span>
            </div>
          </div>

          <ActivitySpecs
            tags={activity.tags}
            title={activity.title}
            description={activity.description}
            duration={activity.duration}
            price={activity.price}
            maxGroupSize={activity.maxGroupSize}
          />

          <AvailabilitySlots
            slots={activity.slots}
            onSlotClick={handleSlotClick}
          />
        </div>

        {/* Right Column: AI Booking Assistant Side-Panel container */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 z-10 w-full">
          <AIAssistantPanel
            messages={messages}
            isTyping={isTyping}
            bookingAttempt={bookingAttempt}
            activityTitle={activity.title}
            activityPrice={activity.price}
            inputValue={inputVal}
            onInputValueChange={setInputVal}
            onSendMessage={() => handleSendMessage()}
            onConfirmBooking={executeConfirmBooking}
            messagesEndRef={messagesEndRef}
          />
        </div>
      </div>
    </div>
  );
}
