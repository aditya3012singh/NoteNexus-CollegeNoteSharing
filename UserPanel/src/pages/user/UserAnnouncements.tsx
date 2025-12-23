import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Clock,
  Search,
  Bell,
  X,
  AlertCircle,
  Calendar,
  User,
  Info,
  BookmarkPlus,
  Share2,
  Eye,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../../my-project/src/redux/store";
import {
  getAllAnnouncements,
  clearMessages,
} from "../../../../my-project/src/redux/slices/announcementSlice";
import { toast } from "react-toastify";

const UserAnnouncements: React.FC = () => {
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

  const getAnnouncementPriority = (title: string, content: string) => {
    const combined = (title + " " + content).toLowerCase();
    if (
      combined.includes("urgent") ||
      combined.includes("important") ||
      combined.includes("deadline")
    ) {
      return { level: "high", color: "#d9534f", icon: AlertCircle };
    } else if (
      combined.includes("exam") ||
      combined.includes("test") ||
      combined.includes("assignment")
    ) {
      return { level: "medium", color: "#f0ad4e", icon: Clock };
    } else {
      return { level: "normal", color: "#669a9b", icon: Info };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 via-[#dcebea] to-[#b9d6d5]">
        <div className="p-8 bg-white/80 rounded-2xl shadow-xl border border-[#dcebea]/60">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 border-4 border-[#b9d6d5] border-t-[#669a9b] rounded-full animate-spin" />
            <p className="text-[#669a9b] font-medium">Loading announcements...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#dcebea] to-[#b9d6d5] relative">
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#8dbbb9]/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-[#b9d6d5]/50 rounded-full blur-2xl"></div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-[#dcebea]/60">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold text-slate-800">
                Latest <span className="text-[#669a9b]">Announcements</span>
              </h1>
              <p className="text-lg text-slate-600 mt-2">
                Stay informed with the latest updates and notices
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-[#dcebea] text-[#669a9b] px-4 py-2 rounded-xl">
                <MessageSquare className="h-5 w-5 mr-2" />
                {announcements.length} total
              </div>
              <div className="flex items-center bg-[#b9d6d5]/50 text-[#669a9b] px-4 py-2 rounded-xl">
                <Bell className="h-5 w-5 mr-2" />
                {recentAnnouncements.length} new this week
              </div>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-[#dcebea]/60">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] rounded-xl flex items-center justify-center shadow-lg">
              <Search className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              Find Announcements
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-[#dcebea]/70 rounded-xl text-slate-800 focus:ring-2 focus:ring-[#8dbbb9] transition-all"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as "all" | "recent" | "important")
              }
              className="px-4 py-3 bg-white/50 border border-[#dcebea]/70 rounded-xl text-slate-800 focus:ring-2 focus:ring-[#8dbbb9] transition-all"
            >
              <option value="all">All Announcements</option>
              <option value="recent">Recent (This Week)</option>
              <option value="important">Important Only</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
              }}
              className="flex items-center justify-center px-4 py-3 bg-[#669a9b] text-white rounded-xl hover:shadow-lg transition-all"
            >
              <X className="h-4 w-4 mr-2" /> Clear
            </button>
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-6 mx-6">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((a, index) => {
              const priority = getAnnouncementPriority(a.title, a.content);
              const PriorityIcon = priority.icon;

              return (
                <div
                  key={a.id}
                  className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-[#dcebea]/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${index * 100 + 500}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center`}
                        style={{
                          background: `linear-gradient(to right, ${priority.color}, #8dbbb9)`,
                        }}
                      >
                        <PriorityIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-[#669a9b]">
                          {priority.level === "high"
                            ? "Important Notice"
                            : priority.level === "medium"
                            ? "Academic Update"
                            : "General Announcement"}
                        </span>
                        <div className="flex items-center space-x-2 text-slate-500 text-xs mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(a.createdAt || "")}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-[#669a9b] mb-2">
                      {a.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {a.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#dcebea]/60">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <User className="h-4 w-4 text-[#669a9b]" />
                      <span>Admin</span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>
                        {new Date(a.createdAt || "").toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-[#669a9b] hover:text-[#8dbbb9]">
                        <BookmarkPlus className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-[#669a9b] hover:text-[#8dbbb9]">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white rounded-lg hover:shadow-lg">
                        <Eye className="h-4 w-4 mr-1 inline" /> Read More
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-[#669a9b] py-20">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 text-[#8dbbb9]" />
              <p>No announcements found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAnnouncements;
