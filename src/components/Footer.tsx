import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-12 bg-[#edf6f2] border-t border-[#bccac1]/30 mt-auto">
      <div className="flex flex-col items-center gap-4 px-6 max-w-7xl mx-auto">
        <div className="text-xl font-bold text-[#00694c] tracking-tight">Shoreline</div>
        <div className="flex flex-wrap justify-center gap-6 font-semibold text-xs text-[#3d4943]">
          <Link href="/" className="hover:text-[#00694c] transition">
            Explore
          </Link>
          <Link href="/bookings" className="hover:text-[#00694c] transition">
            My Bookings
          </Link>
          <a href="#" className="hover:text-[#00694c] transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-[#00694c] transition">
            Terms of Service
          </a>
          <a href="#" className="hover:text-[#00694c] transition">
            Contact Us
          </a>
        </div>
        <p className="text-xs text-[#6d7a73] opacity-75 mt-8">
          © 2026 Shoreline. All rights reserved. Registered beach activities.
        </p>
      </div>
    </footer>
  );
}
