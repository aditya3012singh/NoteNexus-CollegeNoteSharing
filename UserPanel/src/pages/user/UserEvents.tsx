import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Search,
  Eye,
  BookmarkPlus,
  Share2,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../my-project/src/redux/store";
import {
  getAllEvents,
  clearEventMessages,
} from "../../../../my-project/src/redux/slices/eventSlice";
import { toast } from "react-toastify";

const UserEvents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { events, loading, error } = useSelector(
    (state: RootState) => state.event
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "upcoming" | "past">(
    "all"
  );

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearEventMessages());
    }
  }, [error, dispatch]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    const eventDate = new Date(event.date);
    const now = new Date();

    let matchesFilter = true;
    if (filterType === "upcoming") matchesFilter = eventDate > now;
    else if (filterType === "past") matchesFilter = eventDate <= now;

    return matchesSearch && matchesFilter;
  });

  const upcomingEvents = events.filter((event) => new Date(event.date) > new Date());
  const pastEvents = events.filter((event) => new Date(event.date) <= new Date());

  const getEventStatus = (eventDate: string) => {
    const event = new Date(eventDate);
    const now = new Date();
    const diffTime = event.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      if (diffDays === 1) return { label: "Tomorrow", color: "#f0ad4e" };
      if (diffDays <= 7) return { label: `In ${diffDays} days`, color: "#669a9b" };
      return { label: "Upcoming", color: "#8dbbb9" };
    } else if (diffDays === 0) {
      return { label: "Today", color: "#d9534f" };
    } else {
      return { label: "Past", color: "#b9d6d5" };
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 via-[#dcebea] to-[#b9d6d5]">
        <div className="p-8 bg-white/80 rounded-2xl shadow-xl border border-[#dcebea]/60">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 border-4 border-[#b9d6d5] border-t-[#669a9b] rounded-full animate-spin" />
            <p className="text-[#669a9b] font-medium">Loading events...</p>
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
                Academic <span className="text-[#669a9b]">Events</span>
              </h1>
              <p className="text-lg text-slate-600 mt-2">
                Stay updated with upcoming academic events
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-[#dcebea] text-[#669a9b] px-4 py-2 rounded-xl">
                <Calendar className="h-5 w-5 mr-2" />
                {events.length} total
              </div>
              <div className="flex items-center bg-[#b9d6d5]/50 text-[#669a9b] px-4 py-2 rounded-xl">
                <Clock className="h-5 w-5 mr-2" />
                {upcomingEvents.length} upcoming
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-[#dcebea]/60">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] rounded-xl flex items-center justify-center shadow-lg">
              <Search className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Find Events</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-[#dcebea]/70 rounded-xl text-slate-800 focus:ring-2 focus:ring-[#8dbbb9] transition-all"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as "all" | "upcoming" | "past")
              }
              className="px-4 py-3 bg-white/50 border border-[#dcebea]/70 rounded-xl text-slate-800 focus:ring-2 focus:ring-[#8dbbb9] transition-all"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
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

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mx-6 mt-8">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => {
              const status = getEventStatus(event.date);
              const formattedDate = formatEventDate(event.date);

              return (
                <div
                  key={event.id}
                  className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-md border border-[#dcebea]/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${index * 100 + 300}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(to right, ${status.color}, #8dbbb9)`,
                        }}
                      >
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-[#669a9b]">
                          Academic Event
                        </span>
                        <div className="flex items-center space-x-2 text-slate-500 text-xs mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{formattedDate.date}</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="px-3 py-1 rounded-full text-xs font-medium border"
                      style={{
                        backgroundColor: `${status.color}20`,
                        color: status.color,
                        borderColor: `${status.color}50`,
                      }}
                    >
                      {status.color === "#d9534f" ? (
                        <AlertCircle className="h-3 w-3 mr-1 inline" />
                      ) : (
                        <CheckCircle className="h-3 w-3 mr-1 inline" />
                      )}
                      {status.label}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-[#669a9b] mb-2">
                      {event.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {event.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#dcebea]/60">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-[#669a9b] hover:text-[#8dbbb9]">
                        <BookmarkPlus className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-[#669a9b] hover:text-[#8dbbb9]">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                    <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white rounded-lg hover:shadow-lg">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-[#669a9b] py-20 col-span-full">
              <Calendar className="h-10 w-10 mx-auto mb-3 text-[#8dbbb9]" />
              <p>No events found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserEvents;
