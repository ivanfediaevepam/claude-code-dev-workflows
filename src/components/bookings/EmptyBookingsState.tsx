import React from "react";
import { motion } from "motion/react";

interface EmptyBookingsStateProps {
  onNavigateToExplore: () => void;
}

export default function EmptyBookingsState({ onNavigateToExplore }: EmptyBookingsStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center bg-[#edf6f2] rounded-2xl border border-dashed border-[#bccac1] p-8"
    >
      <span className="text-5xl mb-4">⛵</span>
      <h3 className="text-xl font-bold text-on-surface mb-2">No bookings yet</h3>
      <p className="text-sm text-on-surface-variant mb-6 max-w-sm">
        Your itinerary is a blank canvas. Start planning your coastal escape.
      </p>
      <button
        onClick={onNavigateToExplore}
        className="font-semibold text-white bg-[#00694c] px-8 py-3 rounded-full hover:scale-95 transition-transform duration-200 shadow-sm cursor-pointer"
      >
        Start your adventure
      </button>
    </motion.div>
  );
}
