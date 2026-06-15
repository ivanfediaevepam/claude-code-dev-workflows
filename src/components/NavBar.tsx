"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, BookOpen, User } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";

export default function NavBar() {
  const pathname = usePathname();
  const { bookings } = useBookings();
  const confirmedCount = bookings.filter((b) => b.status === "Confirmed").length;

  const isActivitiesActive = pathname === "/" || pathname.startsWith("/activities");
  const isBookingsActive = pathname === "/bookings";

  return (
    <nav className="w-full sticky top-0 z-50 bg-white shadow-[0px_4px_20px_rgba(29,158,117,0.06)] border-b border-[#e1eae6]">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-opacity active:scale-95"
        >
          <div className="w-9 h-9 flex items-center justify-center bg-[#00694c]/10 text-[#00694c] rounded-xl">
            <svg viewBox="0 0 512 512" fill="currentColor" className="w-6 h-6">
              <path
                d="M480 341.3c0-30.8-21.7-56-51.2-61.9-29.5 5.9-51.2 31.1-51.2 61.9H480zM315.7 131.7c-29.5-5.9-51.2-31.1-51.2-61.9H213c0 30.8 21.7 56 51.2 61.9L315.7 131.7z"
                opacity=".2"
              />
              <path d="M465.1 127.3c-23.7-23.7-57.1-23.7-80.8 0l-57 57c-23.7 23.7-57.1 23.7-80.8 0L127.3 65.1c-23.7-23.7-57.1-23.7-80.8 0l-19 19c-23.7 23.7-23.7 57.1 0 80.8l119.2 119.2c23.7 23.7 57.1 23.7 80.8 0l57-57c23.7-23.7 57.1-23.7 80.8 0l119.2 119.2c23.7 23.7 57.1 23.7 80.8 0l19-19c23.7-23.7 23.7-57.1 0-80.8L465.1 127.3z" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#00694c]">Shoreline</span>
        </Link>

        {/* Central navigation tabs */}
        <div className="flex items-center gap-8 font-semibold text-sm">
          <Link
            href="/"
            className={`flex items-center gap-1.5 pb-1 transition-all duration-200 border-b-2 ${
              isActivitiesActive
                ? "text-[#00694c] border-[#00694c]"
                : "text-[#3d4943] border-transparent hover:text-[#00694c]"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Activities</span>
          </Link>

          <Link
            href="/bookings"
            className={`flex items-center gap-1.5 pb-1 transition-all duration-200 border-b-2 relative ${
              isBookingsActive
                ? "text-[#00694c] border-[#00694c]"
                : "text-[#3d4943] border-transparent hover:text-[#00694c]"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My bookings</span>
            {confirmedCount > 0 && (
              <span className="absolute -top-1.5 -right-3.5 bg-red-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold">
                {confirmedCount}
              </span>
            )}
          </Link>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-3">
          <Link
            href="/bookings"
            className="w-9 h-9 rounded-full bg-[#f3fbf7] hover:bg-[#e7f0ec] text-[#00694c] border border-[#bccac1]/40 flex items-center justify-center transition cursor-pointer"
            title="View my account"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
