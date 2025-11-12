import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  Lightbulb,
  Calendar,
  MessageSquare,
  User,
  Menu,
  X,
  LogOut,
  GraduationCap,
  Bell,
  Search,
  FolderOpen,
} from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { logout } from "../../redux/slices/authSlice";

/* ---------------------- Logo ---------------------- */
const NoteNexusLogo: React.FC<{ className?: string; textSize?: string }> = ({
  className = "h-8 w-8",
  textSize = "text-xl",
}) => (
  <div className="flex items-center space-x-3">
    <div className="relative group">
      <div
        className={`bg-gradient-to-tr from-[#669a9b] to-[#8dbbb9] p-2 rounded-xl ${className} flex items-center justify-center shadow-md group-hover:rotate-3 transition-transform duration-300`}
      >
        <BookOpen className="h-5 w-5 text-white" />
      </div>
    </div>
    <span className={`${textSize} font-bold text-slate-800`}>
      Note<span className="text-[#669a9b]">Nexus</span>
    </span>
  </div>
);

/* ---------------------- Layout ---------------------- */
const UserLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navigation = [
    { name: "Dashboard", href: "/user", icon: LayoutDashboard },
    { name: "Study Notes", href: "/user/notes", icon: FileText },
    { name: "Study Tips", href: "/user/tips", icon: Lightbulb },
    { name: "Events", href: "/user/events", icon: Calendar },
    { name: "Announcements", href: "/user/announcements", icon: MessageSquare },
    { name: "Files", href: "/user/files", icon: FolderOpen },
    { name: "Profile", href: "/user/profile", icon: User },
  ];

  const isActive = (href: string) =>
    href === "/user" ? location.pathname === "/user" : location.pathname.startsWith(href);

  /* ---------------------- Component ---------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#dcebea] to-[#b9d6d5]">
      {/* ---------- Mobile Sidebar Overlay ---------- */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden ${
          sidebarOpen ? "" : "pointer-events-none"
        }`}
      >
        <div
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-white/90 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-[#8dbbb9]/20 text-[#669a9b] hover:bg-[#669a9b]/30 transition-all duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <Link
              to="/user"
              className="flex items-center px-4 mb-8 transform hover:scale-105 transition-transform duration-200"
            >
              <NoteNexusLogo />
            </Link>

            <nav className="px-3 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-3 py-3 text-base font-medium rounded-xl transition-all duration-200 transform hover:scale-105 ${
                      active
                        ? "bg-white/70 shadow-lg text-[#669a9b] border border-[#dcebea]"
                        : "text-slate-600 hover:bg-white/60 hover:text-[#669a9b]"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 bg-gradient-to-tr from-[#669a9b] to-[#8dbbb9] shadow-md group-hover:rotate-6 transition-transform duration-300`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex-shrink-0 border-t border-[#dcebea]/60 p-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-tr from-[#669a9b] to-[#8dbbb9] rounded-full p-3 shadow-md">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-500">Student Account</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Desktop Sidebar ---------- */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-30">
        <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-md shadow-xl border-r border-[#dcebea]/50">
          <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
            <Link
              to="/user"
              className="flex items-center px-6 mb-8 transform hover:scale-105 transition-transform duration-200"
            >
              <NoteNexusLogo />
            </Link>

            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 ${
                      active
                        ? "bg-white/80 shadow-lg text-[#669a9b] border border-[#dcebea]"
                        : "text-slate-600 hover:bg-white/60 hover:text-[#669a9b]"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-gradient-to-tr from-[#669a9b] to-[#8dbbb9] shadow-md group-hover:rotate-6 transition-transform duration-300">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex-shrink-0 border-t border-[#dcebea]/60 p-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-tr from-[#669a9b] to-[#8dbbb9] rounded-full p-2 shadow-md">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-500">Student Account</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Main Content ---------- */}
      <div className="md:pl-72 flex flex-col flex-1">
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md shadow-sm border-b border-[#dcebea]/50">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Welcome back, {user?.name || "Learner"} 👋
              </h1>
              <p className="text-slate-600 text-sm">
                Continue your journey with organized learning.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 px-4 py-2 pl-10 bg-white/60 border border-[#dcebea]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#669a9b] focus:border-transparent transition"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              </div>

              
            </div>
          </div>
        </div>

        <main className="flex-1 relative">
          <div className="absolute top-10 left-10 w-20 h-20 bg-[#b9d6d5] rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-[#8dbbb9] rounded-full opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-[#669a9b] rounded-full opacity-30 animate-pulse delay-2000"></div>

          <div className="relative z-10 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
