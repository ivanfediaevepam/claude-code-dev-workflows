"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import ListingView from "@/components/ListingView";

export default function HomePage() {
  const router = useRouter();

  const handleSelectActivity = (id: string) => {
    router.push(`/activities/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="flex-grow flex flex-col"
    >
      <ListingView onSelectActivity={handleSelectActivity} />
    </motion.div>
  );
}
