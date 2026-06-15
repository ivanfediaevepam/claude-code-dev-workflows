"use client";

import React, { useState } from "react";
import { Booking } from "@/types";
import { Calendar, Users, Sparkles, X, Check, Eye } from "lucide-react";
import { motion } from "motion/react";

interface BookingCardProps {
  key?: React.Key;
  booking: Booking;
  onCancelBooking: (id: string) => void;
  onSelectActivity: (activityId: string) => void;
}

export default function BookingCard({
  booking,
  onCancelBooking,
  onSelectActivity,
}: BookingCardProps) {
  const [confirmCancel, setConfirmCancel] = useState(false);

  const handleConfirmCancel = () => {
    onCancelBooking(booking.id);
    setConfirmCancel(false);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-white rounded-2xl border border-[#E1F5EE] shadow-[0px_4px_20px_rgba(29,158,117,0.06)] overflow-hidden flex flex-col md:flex-row hover:shadow-[0px_8px_30px_rgba(29,158,117,0.1)] transition-all duration-300"
    >
      {/* Image Section */}
      <div className="h-56 md:h-auto md:w-80 relative overflow-hidden bg-[#d3e7e0] flex-shrink-0">
        <img
          src={booking.activityImage}
          alt={booking.activityTitle}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Status Badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full border border-surface-variant flex items-center gap-1.5 shadow-sm">
          <Check className="w-4 h-4 text-[#1D9E75]" />
          <span className="text-xs font-semibold text-[#00694c]">Confirmed</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-8 flex flex-col flex-grow justify-between bg-white relative z-10">
        <div>
          {/* Header with Title and Booking ID */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-4">
            <h2 className="text-2xl font-bold text-[#151d1b] leading-tight group-hover:text-primary transition-colors">
              {booking.activityTitle}
            </h2>
            <span className="text-xs font-semibold text-secondary bg-[#e7f0ec] px-3 py-1 rounded-md self-start font-mono">
              {booking.id}
            </span>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-md">
            <div className="flex items-center gap-2 text-sm text-[#3d4943]">
              <Calendar className="text-secondary w-4 h-4" />
              <span>{booking.date}, {booking.time.split(" - ")[0]}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#3d4943]">
              <Users className="text-secondary w-4 h-4" />
              <span>{booking.peopleCount} {booking.peopleCount === 1 ? "Person" : "People"}</span>
            </div>
          </div>

          {/* AI Summary Box / Preparation Guide */}
          <div className="relative bg-[#edf6f2]/80 border border-[#68dbae]/20 rounded-xl p-4 flex items-start gap-3 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#86f8c9]/5 to-transparent rounded-xl pointer-events-none"></div>
            <Sparkles className="w-5 h-5 text-[#00694c] mt-0.5 shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-[#00694c] mb-1 uppercase tracking-wider">Preparation Guide</h3>
              <p className="text-sm text-[#3d4943] leading-relaxed">
                "{booking.preparationGuide || 'Arrive 15 minutes early. Bring sunscreen, a towel, and dry clothes!'}"
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-row items-center justify-between pt-4 border-t border-[#e1eae6] mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-outline">Total Price</span>
            <span className="text-2xl font-extrabold text-[#151d1b]">€{booking.totalPrice}</span>
          </div>

          <div className="flex items-center gap-2">
            {confirmCancel ? (
              <div className="flex items-center gap-1.5 bg-red-50 p-1.5 rounded-lg border border-red-200">
                <span className="text-xs font-bold text-red-600 px-1 hidden md:block">Confirm cancel?</span>
                <button
                  onClick={handleConfirmCancel}
                  className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition cursor-pointer"
                  title="Yes, cancel"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setConfirmCancel(false)}
                  className="bg-gray-100 text-[#3d4943] p-1.5 rounded-full hover:bg-gray-200 transition cursor-pointer"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmCancel(true)}
                className="text-xs font-semibold text-red-600 px-4 py-2 rounded-full border border-transparent hover:bg-red-50 active:scale-95 transition-all cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              onClick={() => onSelectActivity(booking.activityId)}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#00694c] hover:bg-[#00513a] px-5 py-2.5 rounded-full hover:scale-95 active:scale-90 transition-all shadow-sm cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
