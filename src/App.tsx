import React, { useState, useEffect } from "react";
import { Booking } from "./types";
import { ACTIVITIES } from "./data/activities";
import ListingView from "./components/ListingView";
import BookingsView from "./components/BookingsView";
import DetailView from "./components/DetailView";
import { motion, AnimatePresence } from "motion/react";
import { Compass, BookOpen, User } from "lucide-react";

const LOCAL_STORAGE_KEY = "shoreline_bookings_v1";

const INITIAL_BOOKING: Booking = {
  id: "SL-0041",
  activityId: "beginner-surf",
  activityTitle: "Beginner Surf Lesson",
  activityCategory: "Surf",
  activityImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNFNPVuWc2fATjy22zkKRWtgM6wSPHl8_NvS-gOQu0qdXvpUjbu3GU4jeughHG-dX6ZE5loQS35FkYVK-Yp4miMvTkE36ZZm-t-FbRtFgI6dIGLl0n80ibsebANUEW1BnAAjxM0sAhTVq6LI6F3omrdjtH4tO5jNIVkcIceH-isvyTMU82IsdJmJH-cMfH_wgtBruPxr4mokgCohOHPdLZ9HVunyv2vrGV7q7gtAVxZ2CX8hR-4evyb41mUnls4GFi_CjQHUck-dmt",
  date: "June 12",
  time: "10:00 AM - 12:00 PM",
  peopleCount: 2,
  totalPrice: 90,
  status: "Confirmed",
  preparationGuide: "Arrive 15 minutes early at the North Beach hut. Bring sunscreen and a towel!"
};

export default function App() {
  const [screen, setScreen] = useState<"listing" | "bookings" | "detail">("listing");
  const [selectedActivityId, setSelectedActivityId] = useState<string>("beginner-surf");
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load initial bookings from localStorage or set initial mock booking
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (e) {
        setBookings([INITIAL_BOOKING]);
      }
    } else {
      setBookings([INITIAL_BOOKING]);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([INITIAL_BOOKING]));
    }
  }, []);

  const saveBookings = (updatedList: Booking[]) => {
    setBookings(updatedList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
  };

  const handleSelectActivity = (id: string) => {
    setSelectedActivityId(id);
    setScreen("detail");
  };

  const handleAddBooking = (newBooking: Booking) => {
    const updated = [newBooking, ...bookings];
    saveBookings(updated);
  };

  const handleCancelBooking = (bookingId: string) => {
    const updated = bookings.map((b) => 
      b.id === bookingId ? { ...b, status: "Cancelled" as const } : b
    );
    saveBookings(updated);
  };

  const currentActivity = ACTIVITIES.find(a => a.id === selectedActivityId) || ACTIVITIES[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#f3fbf7] text-[#151d1b]">
      {/* Dynamic Global Top Navigation Bar */}
      <nav className="w-full sticky top-0 z-50 bg-white shadow-[0px_4px_20px_rgba(29,158,117,0.06)] border-b border-[#e1eae6]">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          {/* Logo with shoreline custom waves icon */}
          <div 
            onClick={() => setScreen("listing")}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-opacity active:scale-95"
          >
            <div className="w-9 h-9 flex items-center justify-center bg-[#00694c]/10 text-[#00694c] rounded-xl">
              <svg viewBox="0 0 512 512" fill="currentColor" className="w-6.5 h-6.5">
                <path d="M480 341.3c0-30.8-21.7-56-51.2-61.9-29.5 5.9-51.2 31.1-51.2 61.9H480zM315.7 131.7c-29.5-5.9-51.2-31.1-51.2-61.9H213c0 30.8 21.7 56 51.2 61.9L315.7 131.7z" opacity=".2"/>
                <path d="M465.1 127.3c-23.7-23.7-57.1-23.7-80.8 0l-57 57c-23.7 23.7-57.1 23.7-80.8 0L127.3 65.1c-23.7-23.7-57.1-23.7-80.8 0l-19 19c-23.7 23.7-23.7 57.1 0 80.8l119.2 119.2c23.7 23.7 57.1 23.7 80.8 0l57-57c23.7-23.7 57.1-23.7 80.8 0l119.2 119.2c23.7 23.7 57.1 23.7 80.8 0l19-19c23.7-23.7 23.7-57.1 0-80.8L465.1 127.3z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#00694c]">Shoreline</span>
          </div>

          {/* Central navigation tabs */}
          <div className="flex items-center gap-8 font-semibold text-sm">
            <button
              onClick={() => setScreen("listing")}
              className={`flex items-center gap-1.5 pb-1 transition-all duration-200 border-b-2 cursor-pointer ${
                screen === "listing" || screen === "detail"
                  ? "text-[#00694c] border-[#00694c]"
                  : "text-[#3d4943] border-transparent hover:text-[#00694c]"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Activities</span>
            </button>

            <button
              onClick={() => setScreen("bookings")}
              className={`flex items-center gap-1.5 pb-1 transition-all duration-200 border-b-2 cursor-pointer relative ${
                screen === "bookings"
                  ? "text-[#00694c] border-[#00694c]"
                  : "text-[#3d4943] border-transparent hover:text-[#00694c]"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>My bookings</span>
              {bookings.filter(b => b.status === "Confirmed").length > 0 && (
                <span className="absolute -top-1.5 -right-3.5 bg-red-500 text-white rounded-full w-4.5 h-4.5 text-[9px] flex items-center justify-center font-bold">
                  {bookings.filter(b => b.status === "Confirmed").length}
                </span>
              )}
            </button>
          </div>

          {/* User profile action trigger */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setScreen("bookings")}
              className="w-9 h-9 rounded-full bg-[#f3fbf7] hover:bg-[#e7f0ec] text-[#00694c] border border-[#bccac1]/40 flex items-center justify-center transition cursor-pointer"
              title="View my account"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Screen Router Body Layout */}
      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          {screen === "listing" && (
            <motion.div
              key="listing"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex-grow flex flex-col"
            >
              <ListingView onSelectActivity={handleSelectActivity} />
            </motion.div>
          )}

          {screen === "detail" && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="flex-grow flex flex-col"
            >
              <DetailView
                activity={currentActivity}
                onGoBack={() => setScreen("listing")}
                onAddBooking={handleAddBooking}
              />
            </motion.div>
          )}

          {screen === "bookings" && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-grow flex flex-col"
            >
              <BookingsView
                bookings={bookings}
                onCancelBooking={handleCancelBooking}
                onSelectActivity={(id) => {
                  setSelectedActivityId(id);
                  setScreen("detail");
                }}
                onNavigateToExplore={() => setScreen("listing")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Footer component */}
      <footer className="w-full py-12 bg-[#edf6f2] border-t border-[#bccac1]/30 mt-auto">
        <div className="flex flex-col items-center gap-4 px-6 max-w-7xl mx-auto">
          <div className="text-xl font-bold text-[#00694c] tracking-tight">
            Shoreline
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-semibold text-xs text-on-surface-variant">
            <button onClick={() => setScreen("listing")} className="hover:text-primary cursor-pointer transition">Explore</button>
            <button onClick={() => setScreen("bookings")} className="hover:text-primary cursor-pointer transition">My Bookings</button>
            <a href="#" className="hover:text-primary transition">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition">Terms of Service</a>
            <a href="#" className="hover:text-primary transition">Contact Us</a>
          </div>
          <p className="text-xs text-outline opacity-75 mt-8">
            © 2026 Shoreline. All rights reserved. Registered beach activities.
          </p>
        </div>
      </footer>
    </div>
  );
}
