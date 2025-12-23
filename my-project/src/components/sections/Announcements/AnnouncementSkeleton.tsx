import React from "react";
export const AnnouncementSkeleton: React.FC = () => {
  return (
    <div className="bg-white/1 backdrop-blur-md rounded-2xl p-6 shadow-lg animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-300/30" />
          <div>
            <div className="h-4 w-32 bg-slate-300/40 rounded mb-2" />
            <div className="h-3 w-24 bg-slate-300/30 rounded" />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="h-5 w-3/4 bg-slate-300/40 rounded mb-3" />

      {/* Message */}
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-slate-300/30 rounded" />
        <div className="h-4 w-5/6 bg-slate-300/30 rounded" />
        <div className="h-4 w-2/3 bg-slate-300/20 rounded" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#dcebea]/40">
        <div className="h-4 w-40 bg-slate-300/30 rounded" />
      </div>
    </div>
  );
};