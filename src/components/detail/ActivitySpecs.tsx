import React from "react";
import { Clock, Tag, Users } from "lucide-react";

interface ActivitySpecsProps {
  tags: string[];
  title: string;
  description: string;
  duration: string;
  price: number;
  maxGroupSize: number;
}

export default function ActivitySpecs({
  tags,
  title,
  description,
  duration,
  price,
  maxGroupSize,
}: ActivitySpecsProps) {
  return (
    <>
      {/* Heading description panel */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-[#E1F5EE] text-[#00694c] font-bold text-[10px] tracking-wide uppercase"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-[#151d1b] tracking-tight leading-tight">
          {title}
        </h1>

        <p className="text-base text-on-surface-variant leading-relaxed max-w-prose">
          {description}
        </p>
      </div>

      {/* Quick Specifications list */}
      <div className="grid grid-cols-3 gap-4 py-6 border-y border-[#e1eae6]">
        <div className="flex flex-col gap-1 items-start text-left">
          <div className="flex items-center gap-1.5 text-[#00694c]">
            <Clock className="w-4 h-4 shrink-0 text-[#1D9E75]" />
            <span className="text-xs font-bold text-[#6d7a73]">Duration</span>
          </div>
          <span className="text-sm font-semibold text-[#151d1b] mt-1">{duration}</span>
        </div>

        <div className="flex flex-col gap-1 items-start text-left">
          <div className="flex items-center gap-1.5 text-[#00694c]">
            <Tag className="w-4 h-4 shrink-0 text-[#1D9E75]" />
            <span className="text-xs font-bold text-[#6d7a73]">Price</span>
          </div>
          <span className="text-sm font-semibold text-[#151d1b] mt-1">€{price} / person</span>
        </div>

        <div className="flex flex-col gap-1 items-start text-left">
          <div className="flex items-center gap-1.5 text-[#00694c]">
            <Users className="w-4 h-4 shrink-0 text-[#1D9E75]" />
            <span className="text-xs font-bold text-[#6d7a73]">Group Size</span>
          </div>
          <span className="text-sm font-semibold text-[#151d1b] mt-1">Max {maxGroupSize} people</span>
        </div>
      </div>
    </>
  );
}
