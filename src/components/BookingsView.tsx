import React from "react";
import { Booking } from "../types";
import { AnimatePresence } from "motion/react";
import BookingCard from "./bookings/BookingCard";
import EmptyBookingsState from "./bookings/EmptyBookingsState";

interface BookingsViewProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
  onSelectActivity: (activityId: string) => void;
  onNavigateToExplore: () => void;
}

export default function BookingsView({
  bookings,
  onCancelBooking,
  onSelectActivity,
  onNavigateToExplore,
}: BookingsViewProps) {
  const activeBookings = bookings.filter((b) => b.status === "Confirmed");

  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-6 py-12">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#151d1b] tracking-tight">Upcoming Adventures</h1>
          <p className="text-lg text-on-surface-variant mt-1.5 font-medium">Manage your reserved beach experiences.</p>
        </div>
      </header>

      {/* Bookings List */}
      <div className="flex flex-col gap-8">
        {activeBookings.length === 0 ? (
          <EmptyBookingsState onNavigateToExplore={onNavigateToExplore} />
        ) : (
          <div className="flex flex-col gap-6">
            <AnimatePresence>
              {activeBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancelBooking={onCancelBooking}
                  onSelectActivity={onSelectActivity}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
