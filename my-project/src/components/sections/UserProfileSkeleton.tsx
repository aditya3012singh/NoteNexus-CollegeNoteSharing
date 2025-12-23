import React from "react";

const UserProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="bg-white/1 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
        <div className="h-8 w-48 bg-slate-300/40 rounded mb-3" />
        <div className="h-5 w-80 bg-slate-300/30 rounded" />
      </div>

      {/* Profile Card */}
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8 mb-8">
          {/* Avatar */}
          <div className="w-24 h-24 bg-slate-300/40 rounded-full mb-6 md:mb-0" />

          {/* User Info */}
          <div className="flex-1 space-y-4">
            <div className="h-7 w-48 bg-slate-300/40 rounded" />
            <div className="h-4 w-64 bg-slate-300/30 rounded" />
            <div className="h-4 w-40 bg-slate-300/30 rounded" />
            <div className="h-4 w-32 bg-slate-300/30 rounded" />
            <div className="h-4 w-36 bg-slate-300/30 rounded" />

            <div className="flex gap-3 mt-3">
              <div className="h-8 w-32 bg-slate-300/30 rounded-full" />
              <div className="h-8 w-28 bg-slate-300/20 rounded-full" />
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="h-4 w-32 bg-slate-300/30 rounded" />
            <div className="h-12 w-full bg-slate-300/20 rounded-xl" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-32 bg-slate-300/30 rounded" />
            <div className="h-12 w-full bg-slate-300/20 rounded-xl" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <div className="h-12 w-32 bg-slate-300/30 rounded-xl" />
          <div className="h-12 w-36 bg-slate-300/40 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default UserProfileSkeleton;
