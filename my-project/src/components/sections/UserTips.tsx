import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Lightbulb,
  X,
  Send,
  User,
  CheckCircle,
  Calendar,
  Heart,
  BookmarkPlus,
  Eye,
  Award,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../my-project/src/redux/store";
import {
  getAllTips,
  createTip,
  clearMessages,
} from "../../../../my-project/src/redux/slices/tipSlice";

const UserTips: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { allTips, loading, error, successMessage } = useSelector(
    (state: RootState) => state.tips
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTip, setNewTip] = useState({ title: "", content: "" });

  useEffect(() => {
    dispatch(getAllTips());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
  }, [successMessage, error, dispatch]);

  const handleCreateTip = async (e: React.FormEvent) => {
    e.preventDefault();

    const title = newTip.title.trim();
    const content = newTip.content.trim();

    if (title.length < 10 || content.length < 10) {
      toast.error("Both title and content must be at least 10 characters long.");
      return;
    }

    try {
      await dispatch(createTip({ title, content })).unwrap();
      setNewTip({ title: "", content: "" });
      setShowCreateForm(false);
      dispatch(getAllTips());
    } catch {}
  };

  const approvedTips = allTips.filter((tip) => tip.status === "APPROVED");
  const filteredTips = approvedTips.filter(
    (tip) =>
      tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-transparent">
  //       <div className="bg-white/80 p-8 rounded-2xl shadow-xl border border-[#dcebea]/60">
  //         <div className="flex flex-col items-center space-y-4">
  //           <div className="animate-spin h-12 w-12 border-4 border-[#b9d6d5] border-t-[#669a9b] rounded-full"></div>
  //           <p className="text-[#669a9b] font-medium">Loading study tips...</p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
  const TipSkeleton: React.FC = () => {
  return (
    <div className="bg-white/1 backdrop-blur-sm p-6 rounded-2xl shadow-md animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-slate-300/30 rounded-2xl" />
          <div>
            <div className="h-4 w-24 bg-slate-300/30 rounded mb-2" />
            <div className="h-3 w-20 bg-slate-300/20 rounded" />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="h-5 w-3/4 bg-slate-300/40 rounded mb-3" />
      <div className="h-4 w-full bg-slate-300/30 rounded mb-2" />
      <div className="h-4 w-5/6 bg-slate-300/30 rounded mb-4" />

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#dcebea]/40">
        <div className="h-4 w-24 bg-slate-300/30 rounded" />
        <div className="flex space-x-2">
          <div className="h-8 w-8 bg-slate-300/30 rounded-lg" />
          <div className="h-8 w-8 bg-slate-300/30 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Floating shapes */}
      

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="bg-white/1 backdrop-blur-sm rounded-3xl p-8 shadow-xl ">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold text-slate-200">
                Study <span className="text-[#669a9b]">Tips</span>
              </h1>
              <p className="text-lg text-slate-200 mt-2">
                Share and discover effective study strategies with{" "}
                <span className="font-semibold text-slate-200">NoteNexus</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-[#dcebea] text-[#669a9b] px-4 py-2 rounded-xl">
                <Lightbulb className="h-5 w-5 mr-2" />
                {filteredTips.length} Tips
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="h-5 w-5 mr-2" /> Share a Tip
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white/1 backdrop-blur-sm rounded-3xl p-8 shadow-xl ">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] rounded-xl flex items-center justify-center">
              <Search className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">Find Study Tips</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-100 h-5 w-5" />
              <input
                type="text"
                placeholder="Search tips by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent border border-[#dcebea]/60 rounded-xl text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-[#8dbbb9] transition-all"
              />
            </div>
            <button
              onClick={() => setSearchTerm("")}
              className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white rounded-xl hover:shadow-lg transition-all"
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg- backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#dcebea]/60">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] rounded-2xl flex items-center justify-center shadow-lg">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#669a9b]">
                  Share Your Study Tip
                </h2>
              </div>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 text-slate-500 hover:text-[#669a9b] transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTip} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Tip Title
                </label>
                <input
                  type="text"
                  value={newTip.title}
                  onChange={(e) =>
                    setNewTip({ ...newTip, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#dcebea]/70 rounded-xl focus:ring-2 focus:ring-[#8dbbb9]"
                  placeholder="Enter a catchy title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Tip Content
                </label>
                <textarea
                  rows={5}
                  value={newTip.content}
                  onChange={(e) =>
                    setNewTip({ ...newTip, content: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#dcebea]/70 rounded-xl focus:ring-2 focus:ring-[#8dbbb9]"
                  placeholder="Describe your study strategy..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 text-[#669a9b] bg-[#dcebea] rounded-xl hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white rounded-xl hover:shadow-lg flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Tip</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tips List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading
    ? Array.from({ length: 6 }).map((_, idx) => (
        <TipSkeleton key={idx} />
      ))
    :filteredTips.map((tip) => (
            <div
              key={tip.id}
              onClick={() => navigate(`/user/tips/${tip.id}`)}
              className="bg-white/1 backdrop-blur-sm p-6 rounded-2xl shadow-md  hover:shadow-xl transition-all transform hover:-translate-y-2 hover:scale-105 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-[#669a9b] text-sm font-medium">
                      Study Tip
                    </span>
                    <div className="flex items-center space-x-2 text-slate-500 text-xs mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(tip.createdAt || "").toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* <div className="bg-green-100 border border-green-200 px-3 py-1 rounded-full flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-green-700">
                    Approved
                  </span>
                </div> */}
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-bold text-[#669a9b] mb-3 line-clamp-2 group-hover:text-[#8dbbb9] transition-colors">
                  {tip.title}
                </h3>
                <p className="text-slate-600 text-sm line-clamp-3">
                  {tip.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#dcebea]/60">
                <div className="flex items-center space-x-2 text-slate-500 text-sm">
                  <User className="h-4 w-4 text-[#8dbbb9]" />
                  <span>{tip.postedBy?.name || "Anonymous"}</span>
                </div>

                {/* <div className="flex items-center space-x-2">
                  <button className="p-2 text-slate-400 hover:text-[#669a9b] hover:bg-[#dcebea]/60 rounded-lg transition-all">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-[#669a9b] hover:bg-[#dcebea]/60 rounded-lg transition-all">
                    <BookmarkPlus className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-[#669a9b] hover:bg-[#dcebea]/60 rounded-lg transition-all">
                    <Eye className="h-4 w-4" />
                  </button>
                </div> */}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        {/* {filteredTips.length > 0 && (
          <div className="bg-gradient-to-r from-[#669a9b] via-[#8dbbb9] to-[#b9d6d5] rounded-3xl p-8 text-white mt-8 shadow-xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Community Impact</h3>
              <p className="text-[#dcebea]">
                See how NoteNexus tips are helping learners excel
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Lightbulb className="h-8 w-8 mx-auto mb-2 text-white" />
                <div className="text-3xl font-bold">{approvedTips.length}</div>
                <p className="text-[#dcebea] text-sm">Total Tips</p>
              </div>

              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-white" />
                <div className="text-3xl font-bold">95%</div>
                <p className="text-[#dcebea] text-sm">Success Rate</p>
              </div>

              <div className="text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-white" />
                <div className="text-3xl font-bold">1K+</div>
                <p className="text-[#dcebea] text-sm">Students Helped</p>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default UserTips;
