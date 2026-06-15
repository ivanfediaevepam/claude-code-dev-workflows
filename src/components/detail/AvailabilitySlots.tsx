"use client";

import React from "react";

interface Slot {
  id: string;
  date: string;
  time: string;
  spotsLeft: number;
  full: boolean;
}

interface AvailabilitySlotsProps {
  slots: Slot[];
  onSlotClick: (slot: Slot) => void;
}

export default function AvailabilitySlots({ slots, onSlotClick }: AvailabilitySlotsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#151d1b]">Upcoming Availability</h2>
        <span className="text-xs text-on-surface-variant font-medium">Click a slot to book via AI chat</span>
      </div>
      <div className="flex flex-col gap-3">
        {slots.map((slot) => {
          return (
            <button
              key={slot.id}
              disabled={slot.full}
              onClick={() => onSlotClick(slot)}
              className={`text-left flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                slot.full
                  ? "border-[#ffdad6] bg-white opacity-70 cursor-not-allowed"
                  : "border-outline-variant/30 bg-white hover:bg-[#edf6f2]/40 hover:border-[#00694c] cursor-pointer"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-on-surface">{slot.date}</span>
                <span className="text-sm text-on-surface-variant">{slot.time}</span>
              </div>

              <div>
                {slot.full ? (
                  <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Full
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-primary">
                    {slot.spotsLeft} spots left
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
