"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import BookingsView from "@/components/BookingsView";
import { useBookings } from "@/hooks/useBookings";

export default function BookingsPage() {
  const router = useRouter();
  const { bookings, cancelBooking } = useBookings();

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="flex-grow flex flex-col"
    >
      <BookingsView
        bookings={bookings}
        onCancelBooking={cancelBooking}
        onSelectActivity={(id) => router.push(`/activities/${id}`)}
        onNavigateToExplore={() => router.push("/")}
      />
    </motion.div>
  );
}
