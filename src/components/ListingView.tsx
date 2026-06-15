"use client";

import React, { useState, useEffect } from "react";
import { ActivitySummary } from "@/types";
import HeroSection from "./listing/HeroSection";
import FilterBar from "./listing/FilterBar";
import EmptyActivitiesState from "./listing/EmptyActivitiesState";
import ActivityCard from "./listing/ActivityCard";

interface ListingViewProps {
  onSelectActivity: (id: string) => void;
}

export default function ListingView({ onSelectActivity }: ListingViewProps) {
  const [activities, setActivities] = useState<ActivitySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filterDate, setFilterDate] = useState<string>("");

  // Fetch activities from the API, re-running whenever the category or date filter changes.
  // On initial mount, selectedCategory="All" and filterDate="" so all activities are fetched.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchFiltered() {
      try {
        setIsLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (selectedCategory !== "All") params.set("category", selectedCategory);
        if (filterDate) params.set("date", filterDate);

        const res = await fetch(`/api/activities?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Failed to load activities (${res.status})`);
        const json = await res.json();
        setActivities(json.data);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message ?? "Unknown error");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchFiltered();
    return () => controller.abort();
  }, [selectedCategory, filterDate]);


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
        {isLoading ? (
          // Skeleton loading grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#E1F5EE] overflow-hidden animate-pulse"
              >
                <div className="w-full h-48 bg-[#e1eae6]" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-5 bg-[#e1eae6] rounded w-3/4" />
                  <div className="h-4 bg-[#e1eae6] rounded w-1/2" />
                  <div className="mt-4 pt-4 border-t border-[#e7f0ec] flex justify-between">
                    <div className="h-7 bg-[#e1eae6] rounded w-16" />
                    <div className="w-8 h-8 rounded-full bg-[#e1eae6]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <p className="text-lg font-semibold text-red-500">Something went wrong</p>
            <p className="text-sm text-[#6d7a73]">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setIsLoading(true);
              }}
              className="mt-2 px-5 py-2 rounded-full bg-[#00694c] text-white text-sm font-semibold hover:bg-[#1D9E75] transition"
            >
              Retry
            </button>
          </div>
        ) : activities.length === 0 ? (
          <EmptyActivitiesState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {activities.map((activity, idx) => (
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
