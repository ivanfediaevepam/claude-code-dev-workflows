"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import DetailView from "@/components/DetailView";
import { useBookings } from "@/hooks/useBookings";
import { Activity, Booking } from "@/types";

interface ActivityPageProps {
  params: Promise<{ id: string }>;
}

export default function ActivityPage({ params }: ActivityPageProps) {
  const router = useRouter();
  const { addBooking } = useBookings();

  const resolvedParams = params as unknown as { id: string };
  const { id } = resolvedParams;

  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchActivity() {
      try {
        setIsLoading(true);
        setNotFound(false);
        setError(null);

        const res = await fetch(`/api/activities/${id}`, {
          signal: controller.signal,
        });

        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error(`Failed to load activity (${res.status})`);

        const json = await res.json();
        setActivity(json.data);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message ?? "Unknown error");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivity();
    return () => controller.abort();
  }, [id]);

  const handleAddBooking = (newBooking: Booking) => {
    addBooking(newBooking);
    router.push("/bookings");
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-5 bg-[#e1eae6] rounded w-32" />
          <div className="w-9 h-9 rounded-full bg-[#e1eae6]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="w-full aspect-[4/3] rounded-2xl bg-[#e1eae6]" />
            <div className="flex flex-col gap-3">
              <div className="h-7 bg-[#e1eae6] rounded w-2/3" />
              <div className="h-4 bg-[#e1eae6] rounded w-full" />
              <div className="h-4 bg-[#e1eae6] rounded w-5/6" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="h-96 rounded-2xl bg-[#e1eae6]" />
          </div>
        </div>
      </div>
    );
  }

  // 404 state
  if (notFound) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-4xl font-extrabold text-[#00694c]">404</p>
        <p className="text-lg font-semibold text-on-surface">Activity not found</p>
        <p className="text-sm text-[#6d7a73]">
          The activity you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-2 px-6 py-2 rounded-full bg-[#00694c] text-white text-sm font-semibold hover:bg-[#1D9E75] transition"
        >
          Back to activities
        </button>
      </div>
    );
  }

  // Error state
  if (error || !activity) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-lg font-semibold text-red-500">Something went wrong</p>
        <p className="text-sm text-[#6d7a73]">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-2 px-6 py-2 rounded-full bg-[#00694c] text-white text-sm font-semibold hover:bg-[#1D9E75] transition"
        >
          Back to activities
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex-grow flex flex-col"
    >
      <DetailView
        activity={activity}
        onGoBack={() => router.push("/")}
        onAddBooking={handleAddBooking}
      />
    </motion.div>
  );
}
