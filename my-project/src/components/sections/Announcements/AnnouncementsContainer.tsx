import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import {
  getAllAnnouncements,
  clearMessages,
} from "../../../redux/slices/announcementSlice";
import { toast } from "react-toastify";
import AnnouncementsHeader from "./AnnouncementsHeader";
import AnnouncementsSearchFilter from "./AnnouncementsSearchFilter";
import AnnouncementItem from "./AnnouncementItem";
import { AnnouncementSkeleton } from "./AnnouncementSkeleton";


const AnnouncementsContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { announcements, loading, error } = useSelector(
    (state: RootState) => state.announcement
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "recent" | "important">(
    "all"
  );

  useEffect(() => {
    dispatch(getAllAnnouncements());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
  }, [error, dispatch]);

  const filteredAnnouncements = (announcements || []).filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.message.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;

    if (filterType === "recent") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesFilter = new Date(a.createdAt!) > weekAgo;
    } else if (filterType === "important") {
      matchesFilter =
        a.title.toLowerCase().includes("important") ||
        a.title.toLowerCase().includes("urgent") ||
        a.title.toLowerCase().includes("exam") ||
        a.title.toLowerCase().includes("deadline");
    }

    return matchesSearch && matchesFilter;
  });

  const recentAnnouncements = (announcements || []).filter((a) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(a.createdAt!) > weekAgo;
  });


  return (
    <div className="min-h-screen   relative">
      {/* Floating Orbs */}
      
      

      <div className="relative z-10 space-y-8">
        <AnnouncementsHeader total={announcements.length} recent={recentAnnouncements.length} />

        <AnnouncementsSearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {/* Announcements List */}
        <div className="space-y-6 mx-6">
  {loading ? (
    Array.from({ length: 5 }).map((_, idx) => (
      <AnnouncementSkeleton key={idx} />
    ))
  ) : filteredAnnouncements.length > 0 ? (
    filteredAnnouncements.map((a, index) => (
      <AnnouncementItem key={a.id} a={a} index={index} />
    ))
  ) : (
    <div className="text-center text-[#669a9b] py-20">
      <div className="h-10 w-10 mx-auto mb-3 rounded-full bg-[#8dbbb9]" />
      <p>No announcements found</p>
    </div>
  )}
</div>

      </div>
    </div>
  );
};

export default AnnouncementsContainer;
