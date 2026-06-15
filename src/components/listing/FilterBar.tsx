import React from "react";
import { Calendar } from "lucide-react";

interface FilterBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  filterDate: string;
  onFilterDateChange: (date: string) => void;
}

export default function FilterBar({
  selectedCategory,
  onSelectCategory,
  filterDate,
  onFilterDateChange,
}: FilterBarProps) {
  return (
    <section className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
      {/* Category Pills */}
      <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 md:pb-0 w-full md:w-auto">
        {["All", "Surf", "Boat", "Tours"].map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-6 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 border ${
                isActive
                  ? "bg-[#00694c] text-white border-transparent shadow-sm"
                  : "bg-[#E1F5EE] text-[#1D9E75] hover:bg-[#cbeee5] border-[#1D9E75]/20"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Date Filter Pill Field */}
      <div className="relative w-full md:w-auto shrink-0">
        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6d7a73] w-5 h-5 pointer-events-none" />
        <input
          aria-label="Filter by Date"
          type="date"
          value={filterDate}
          onChange={(e) => onFilterDateChange(e.target.value)}
          className="w-full md:w-56 pl-12 pr-4 py-2 rounded-full border border-outline-variant bg-white focus:border-[#00694c] focus:ring-1 focus:ring-[#00694c] text-sm text-on-surface outline-none transition-all cursor-pointer"
        />
        {filterDate && (
          <button 
            onClick={() => onFilterDateChange("")} 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-red-600 hover:text-red-800 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
    </section>
  );
}
