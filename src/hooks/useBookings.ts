"use client";

import { useState, useEffect, useCallback } from "react";
import { Booking } from "@/types";

const LOCAL_STORAGE_KEY = "shoreline_bookings_v1";

const INITIAL_BOOKING: Booking = {
  id: "SL-0041",
  activityId: "beginner-surf",
  activityTitle: "Beginner Surf Lesson",
  activityCategory: "Surf",
  activityImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCNFNPVuWc2fATjy22zkKRWtgM6wSPHl8_NvS-gOQu0qdXvpUjbu3GU4jeughHG-dX6ZE5loQS35FkYVK-Yp4miMvTkE36ZZm-t-FbRtFgI6dIGLl0n80ibsebANUEW1BnAAjxM0sAhTVq6LI6F3omrdjtH4tO5jNIVkcIceH-isvyTMU82IsdJmJH-cMfH_wgtBruPxr4mokgCohOHPdLZ9HVunyv2vrGV7q7gtAVxZ2CX8hR-4evyb41mUnls4GFi_CjQHUck-dmt",
  date: "June 12",
  time: "10:00 AM - 12:00 PM",
  peopleCount: 2,
  totalPrice: 90,
  status: "Confirmed",
  preparationGuide: "Arrive 15 minutes early at the North Beach hut. Bring sunscreen and a towel!",
};

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch {
        setBookings([INITIAL_BOOKING]);
      }
    } else {
      setBookings([INITIAL_BOOKING]);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([INITIAL_BOOKING]));
    }
  }, []);

  const saveBookings = useCallback((updatedList: Booking[]) => {
    setBookings(updatedList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
  }, []);

  const addBooking = useCallback(
    (newBooking: Booking) => {
      setBookings((prev) => {
        const updated = [newBooking, ...prev];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const cancelBooking = useCallback(
    (bookingId: string) => {
      setBookings((prev) => {
        const updated = prev.map((b) =>
          b.id === bookingId ? { ...b, status: "Cancelled" as const } : b
        );
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  return { bookings, addBooking, cancelBooking, saveBookings };
}
