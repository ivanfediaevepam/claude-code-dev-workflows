import React from "react";

export default function EmptyActivitiesState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-[#edf6f2] rounded-2xl border border-dashed border-[#bccac1] p-6">
      <span className="text-4xl mb-4">🌊</span>
      <h3 className="text-lg font-bold text-on-surface mb-2">No activities found</h3>
      <p className="text-sm text-on-surface-variant max-w-sm">
        We couldn't find matching slots for this day. Try checking another date or category!
      </p>
    </div>
  );
}
