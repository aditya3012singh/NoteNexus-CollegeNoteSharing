import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Lightbulb,
  Calendar,
  MessageSquare,
  Award,
  Clock,
  Star,
  ChevronRight,
  Activity,
  Zap,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../my-project/src/redux/store";
import { fetchRecentActivity } from "../../../../my-project/src/redux/slices/activitySlice";

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { activities, loading, error } = useSelector(
    (state: RootState) => state.activity
  );

  const [stats, setStats] = useState([
    {
      name: "My Notes",
      value: "0",
      icon: BookOpen,
      color: "from-[#669a9b] to-[#8dbbb9]",
    },
    {
      name: "Study Tips",
      value: "0",
      icon: Lightbulb,
      color: "from-[#669a9b] to-[#8dbbb9]",
    },
    {
      name: "Upcoming Events",
      value: "0",
      icon: Calendar,
      color: "from-[#669a9b] to-[#8dbbb9]",
    },
    {
      name: "Announcements",
      value: "0",
      icon: MessageSquare,
      color: "from-[#669a9b] to-[#8dbbb9]",
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/overview");
        const data = await res.json();
        setStats([
          {
            name: "Notes",
            value: data.notes || "0",
            icon: BookOpen,
            color: "from-[#669a9b] to-[#8dbbb9]",
          },
          {
            name: "Study Tips",
            value: data.tips || "0",
            icon: Lightbulb,
            color: "from-[#669a9b] to-[#8dbbb9]",
          },
          {
            name: "Upcoming Events",
            value: data.events || "0",
            icon: Calendar,
            color: "from-[#669a9b] to-[#8dbbb9]",
          },
          {
            name: "Announcements",
            value: data.announcements || "0",
            icon: MessageSquare,
            color: "from-[#669a9b] to-[#8dbbb9]",
          },
        ]);
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };

    dispatch(fetchRecentActivity());
    fetchStats();
  }, [dispatch]);

  const quickActions = [
    {
      name: "Share Notes",
      href: "/notes",
      icon: BookOpen,
      description: "Explore study materials",
    },
    {
      name: "Share Tip",
      href: "/tips",
      icon: Lightbulb,
      description: "Help fellow students",
    },
    // {
    //   name: "View Events",
    //   href: "/events",
    //   icon: Calendar,
    //   description: "Check upcoming activities",
    // },
    // {
    //   name: "Announcements",
    //   href: "/announcements",
    //   icon: MessageSquare,
    //   description: "Stay updated with news",
    // },
  ];

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Floating Background Shapes */}
      

      <div className="relative z-10 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white/1 backdrop-blur-sm rounded-3xl p-8 shadow-xl ">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Welcome back,{" "}
                <span className="text-[#669a9b]">{user?.name || "Learner"}</span> 👋
              </h1>
              <p className="text-lg text-slate-600">
                Continue your learning journey with{" "}
                <span className="font-semibold text-[#669a9b]">NoteNexus</span>.
              </p>
              <div className="flex items-center mt-4 space-x-2">
                <div className="w-3 h-3 bg-[#669a9b] rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-500 font-medium">
                  All systems ready for learning
                </span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-tr from-[#669a9b] to-[#8dbbb9] rounded-3xl p-8 shadow-2xl">
                <Award className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const handleClick = () => {
              if (stat.name.includes("Note")) navigate("/notes");
              else if (stat.name.includes("Tip")) navigate("/tips");
              else if (stat.name.includes("Announcement"))
                navigate("/announcements");
              else if (stat.name.includes("Event")) navigate("/events");
            };
            return (
              <div
                key={stat.name}
                onClick={handleClick}
                className="cursor-pointer bg-white/1 backdrop-blur-sm rounded-2xl p-6 shadow-md  hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-tr ${stat.color} shadow-md`}
                  >
                    <stat.icon className="h-7 w-7 text-white" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white/1 backdrop-blur-sm rounded-2xl p-8 shadow-md ">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-tr from-[#669a9b] to-[#8dbbb9] rounded-xl flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">
                Recent Activity
              </h2>
            </div>

            {loading ? (
              <p className="text-slate-500 text-center py-6">
                Loading recent activity...
              </p>
            ) : error ? (
              <p className="text-red-500 text-center py-6">{error}</p>
            ) : activities.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#dcebea] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-[#669a9b]" />
                </div>
                <p className="text-slate-600 font-medium mb-1">
                  No recent activity
                </p>
                <p className="text-slate-500 text-sm">
                  Start exploring to see your activity here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-4 rounded-xl hover:bg-[#dcebea]/40 border border-[#dcebea]/50 transition"
                  >
                    <div className="w-10 h-10 bg-gradient-to-tr from-[#669a9b] to-[#8dbbb9] rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">
                        {activity.action}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(activity.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
            
          {/* Sidebar: Quick Actions + Progress */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/1 backdrop-blur-sm rounded-2xl p-6 shadow-md ">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-tr from-[#669a9b] to-[#8dbbb9] rounded-xl flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Quick Actions
                </h3>
              </div>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    onClick={() => navigate(action.href)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-[#dcebea]/10 hover:bg-[#dcebea]/40 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#dcebea] rounded-lg flex items-center justify-center">
                        <action.icon className="h-4 w-4 text-[#669a9b]" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">
                          {action.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Progress */}
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
