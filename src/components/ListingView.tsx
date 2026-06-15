import React, { useState } from "react";
import { ACTIVITIES } from "../data/activities";
import HeroSection from "./listing/HeroSection";
import FilterBar from "./listing/FilterBar";
import EmptyActivitiesState from "./listing/EmptyActivitiesState";
import ActivityCard from "./listing/ActivityCard";

interface ListingViewProps {
  onSelectActivity: (id: string) => void;
}

export default function ListingView({ onSelectActivity }: ListingViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filterDate, setFilterDate] = useState<string>("");

  const filteredActivities = ACTIVITIES.filter((activity) => {
    // Filter Category
    if (selectedCategory !== "All" && activity.category !== selectedCategory) {
      return false;
    }
    // Filter Date if specified
    if (filterDate) {
      const formattedInput = new Date(filterDate);
      const inputMonth = formattedInput.toLocaleString("en-US", { month: "long" });
      const inputDay = formattedInput.getDate();
      const seekerQuery = `${inputMonth} ${inputDay}`; // e.g. "June 12"

      const hasMatchingSlot = activity.slots.some(
        (slot) => slot.date.toLowerCase() === seekerQuery.toLowerCase() && !slot.full
      );
      if (!hasMatchingSlot) return false;
    }
    return true;
  });

  return (
    <div className="flex-grow flex flex-col w-full pb-12">
      <HeroSection />

      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        filterDate={filterDate}
        onFilterDateChange={setFilterDate}
      />

      {/* Activity Grid Catalog */}
      <section className="max-w-7xl mx-auto w-full px-6">
        {filteredActivities.length === 0 ? (
          <EmptyActivitiesState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredActivities.map((activity, idx) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                idx={idx}
                onSelect={onSelectActivity}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
