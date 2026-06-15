"use client";

import React from "react";
import { BookingAttempt } from "@/types";
import { calculateTotalPrice, formatGuestLabel } from "@/lib/pricing";
import { Sparkles, Check } from "lucide-react";
import { motion } from "motion/react";

interface BookingConfirmCardProps {
  activityTitle: string;
  activityPrice: number;
  bookingAttempt: BookingAttempt;
  onConfirm: () => void;
}

export default function BookingConfirmCard({
  activityTitle,
  activityPrice,
  bookingAttempt,
  onConfirm,
}: BookingConfirmCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#edf6f2] border-2 border-[#1D9E75]/30 rounded-2xl p-4 flex flex-col gap-3 shadow-md mt-2 relative overflow-hidden text-left"
    >
      <div className="absolute top-0 right-0 bg-[#1D9E75]/10 px-3 py-1 rounded-bl-xl flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-[#00694c]" />
        <span className="text-[10px] font-bold text-[#00694c] uppercase">Ready</span>
      </div>

      <h4 className="text-xs font-bold text-[#00694c] uppercase tracking-wider">Confirm Your Spots</h4>
      <div className="flex flex-col gap-1.5 text-xs text-[#3d4943] font-medium">
        <p className="flex justify-between gap-4">
          <span>Experience:</span>
          <strong className="text-[#151d1b] text-right">{activityTitle}</strong>
        </p>
        <p className="flex justify-between gap-4">
          <span>Date &amp; Time:</span>
          <strong className="text-[#151d1b] text-right">{bookingAttempt.date} • {bookingAttempt.time}</strong>
        </p>
        <p className="flex justify-between gap-4">
          <span>Guests Count:</span>
          <strong className="text-[#151d1b] text-right">{formatGuestLabel(bookingAttempt.people)}</strong>
        </p>
        <p className="flex justify-between border-t border-[#e1eae6] pt-1.5 mt-1 font-bold text-[#00694c]">
          <span>Total Price:</span>
          <span className="text-sm">€{calculateTotalPrice(activityPrice, bookingAttempt.people)}</span>
        </p>
      </div>

      <button
        onClick={onConfirm}
        className="w-full mt-2 bg-[#00694c] hover:bg-[#00513a] text-white py-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:scale-[0.98] transition cursor-pointer"
      >
        <Check className="w-4 h-4" />
        <span>Confirm Booking</span>
      </button>
    </motion.div>
  );
}
