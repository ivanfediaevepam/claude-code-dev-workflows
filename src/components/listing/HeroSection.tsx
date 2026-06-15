"use client";

import React from "react";
import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section className="w-full bg-[#1D9E75] text-[#ffffff] py-16 px-6 flex flex-col items-center justify-center text-center relative overflow-hidden rounded-b-3xl shadow-sm">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-4">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight"
        >
          Book your summer adventure
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto"
        >
          Discover and book the best beach activities effortlessly.
        </motion.p>
      </div>
    </section>
  );
}
