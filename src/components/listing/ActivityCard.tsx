"use client";

import React from "react";
import { ActivitySummary } from "@/types";
import { Clock, ArrowRight, Star } from "lucide-react";
import { motion } from "motion/react";

interface ActivityCardProps {
  key?: React.Key;
  activity: ActivitySummary;
  idx: number;
  onSelect: (id: string) => void;
}

export default function ActivityCard({ activity, idx, onSelect }: ActivityCardProps) {
  // Decide status dot color
  let dotColor = "bg-[#1D9E75]"; // Available
  if (activity.availability === "Limited") dotColor = "bg-amber-500";
  if (activity.availability === "Full") dotColor = "bg-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      onClick={() => onSelect(activity.id)}
      className="group block bg-white rounded-2xl border border-[#E1F5EE] ambient-shadow cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0px_12px_32px_rgba(29,158,117,0.12)] flex flex-col h-full overflow-hidden"
    >
      {/* Image Container */}
      <div className="w-full h-48 bg-[#e1eae6] overflow-hidden relative">
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
          <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></div>
          <span className="text-xs font-semibold text-on-surface">{activity.availability}</span>
        </div>

        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Card Content Row */}
      <div className="p-5 flex flex-col flex-grow gap-2">
        <div className="flex items-center justify-between gap-1">
          <h3 className="text-lg font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
            {activity.title}
          </h3>
          <div className="flex items-center gap-1 text-amber-500 text-xs shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span className="font-bold text-on-surface">{activity.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-on-surface-variant text-xs mt-0.5">
          <Clock className="w-4 h-4 text-secondary-fixed-dim" />
          <span>{activity.duration}</span>
          <span className="mx-1">•</span>
          <span>{activity.category}</span>
        </div>

        <div className="mt-4 pt-4 flex items-center justify-between border-t border-[#e7f0ec]">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#6d7a73] uppercase tracking-wider">Price</span>
            <span className="text-xl font-extrabold text-[#00694c]">€{activity.price}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#E1F5EE] group-hover:bg-[#00694c] flex items-center justify-center transition-all duration-300">
            <ArrowRight className="w-4 h-4 text-[#1D9E75] group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
