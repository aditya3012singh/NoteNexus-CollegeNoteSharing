import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Download,
  Eye,
  X,
  Plus,
  BookOpen,
  Award,
  ChevronDown,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../my-project/src/redux/store";
import { useNavigate } from "react-router-dom";
import {
  getAllNotes,
  uploadNote,
  clearNoteState,
} from "../../../../my-project/src/redux/slices/noteSlice";
import { toast } from "react-toastify";

const UserNotes: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { notes, loading, uploadSuccess, error } = useSelector(
    (state: RootState) => state.notes
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    branches: [] as string[],
    semester: "",
    subjectId: "",
    file: null as File | null,
  });

  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const branches = ["CSE", "ECE", "Mechanical", "EEE", "IT", "CSE-AI", "CSE-AIML"];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  /* ---------------------- Fetch Notes ---------------------- */
  useEffect(() => {
    dispatch(getAllNotes());
  }, [dispatch]);

  /* ---------------------- Toast Feedback ---------------------- */
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearNoteState());
    }
    if (uploadSuccess) {
      toast.success("Note uploaded successfully!");
      dispatch(clearNoteState());
      setShowUploadForm(false);
      setUploadData({
        title: "",
        branches: [],
        semester: "",
        subjectId: "",
        file: null,
      });
      dispatch(getAllNotes());
    }
  }, [error, uploadSuccess, dispatch]);

  /* ---------------------- Outside Click Close ---------------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------------- Upload Handler ---------------------- */
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { title, branches, semester, subjectId, file } = uploadData;
    if (!title || branches.length === 0 || !semester || !subjectId || !file) {
      toast.error("Please fill out all fields and select a file.");
      return;
    }
    const fd = new FormData();
    fd.append("title", title);
    fd.append("branches", JSON.stringify(branches));
    fd.append("semester", semester);
    fd.append("subjectId", subjectId);
    fd.append("file", file);
    dispatch(uploadNote(fd));
  };

  const toggleBranch = (branch: string) => {
    setUploadData((prev) => {
      const exists = prev.branches.includes(branch);
      const updated = exists
        ? prev.branches.filter((b) => b !== branch)
        : [...prev.branches, branch];
      return { ...prev, branches: updated };
    });
  };

  /* ---------------------- Filter Notes ---------------------- */
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = !selectedBranch || note.branch === selectedBranch;
    const matchesSemester = !selectedSemester || note.semester === selectedSemester;
    return matchesSearch && matchesBranch && matchesSemester && note.status === "APPROVED";
  });

  /* ---------------------- Loading ---------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-[#dcebea] to-[#b9d6d5]">
        <div className="p-6 bg-white/80 rounded-2xl shadow-xl">
          <div className="animate-spin h-10 w-10 border-4 border-[#b9d6d5] border-t-[#669a9b] rounded-full mx-auto mb-3"></div>
          <p className="text-[#669a9b] text-center font-medium">Loading notes...</p>
        </div>
      </div>
    );
  }

  /* ---------------------- Main UI ---------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#dcebea] to-[#b9d6d5] py-10 relative">
      {/* Floating Background */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#8dbbb9]/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-[#b9d6d5]/50 rounded-full blur-2xl"></div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl mx-6 border border-[#dcebea]/60 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Study <span className="text-[#669a9b]">Notes</span>
            </h1>
            <p className="text-slate-600 mt-2">
              Browse and download approved study materials
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-[#dcebea] text-[#669a9b] px-4 py-2 rounded-xl">
              <Award className="h-5 w-5 mr-2" />
              {filteredNotes.length} Notes
            </div>
            <button
              onClick={() => setShowUploadForm(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-5 w-5 mr-2" /> Upload Note
            </button>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl mx-6 my-6 border border-[#dcebea]/60 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#669a9b]">Upload a Note</h2>
            <button
              onClick={() => setShowUploadForm(false)}
              className="p-2 text-slate-500 hover:text-red-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Note title"
              value={uploadData.title}
              onChange={(e) =>
                setUploadData({ ...uploadData, title: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#dcebea]/70 rounded-xl focus:ring-2 focus:ring-[#8dbbb9]"
            />

            {/* Branch Dropdown */}
            <div ref={dropdownRef} className="relative">
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full px-4 py-3 border border-[#dcebea]/70 rounded-xl bg-white cursor-pointer flex justify-between items-center"
              >
                <span>
                  {uploadData.branches.length
                    ? `${uploadData.branches.length} selected`
                    : "Select branches"}
                </span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              {dropdownOpen && (
                <div className="absolute z-20 bg-white border border-[#dcebea]/60 rounded-xl mt-2 w-full max-h-48 overflow-y-auto shadow-md">
                  {branches.map((branch) => (
                    <label
                      key={branch}
                      className="flex items-center px-4 py-2 hover:bg-[#dcebea]/40 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={uploadData.branches.includes(branch)}
                        onChange={() => toggleBranch(branch)}
                      />
                      {branch}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Semester */}
            <select
              value={uploadData.semester}
              onChange={(e) =>
                setUploadData({ ...uploadData, semester: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#dcebea]/70 rounded-xl"
            >
              <option value="">Select semester</option>
              {semesters.map((s) => (
                <option key={s} value={s.toString()}>
                  Semester {s}
                </option>
              ))}
            </select>

            {/* Subject */}
            <select
              value={uploadData.subjectId}
              onChange={(e) =>
                setUploadData({ ...uploadData, subjectId: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#dcebea]/70 rounded-xl"
            >
              <option value="">Select subject</option>
              {subjects.map((subj) => (
                <option key={subj.id} value={subj.id}>
                  {subj.name}
                </option>
              ))}
            </select>

            {/* File */}
            <input
              type="file"
              onChange={(e) =>
                setUploadData({
                  ...uploadData,
                  file: e.target.files?.[0] || null,
                })
              }
              className="w-full px-4 py-3 border border-[#dcebea]/70 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-[#dcebea] file:text-[#669a9b]"
            />

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="px-6 py-3 bg-[#dcebea] text-[#669a9b] rounded-xl hover:shadow-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white rounded-xl hover:shadow-lg"
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-md p-8 mx-6 rounded-3xl shadow-md border border-[#dcebea]/60 my-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search notes or subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 border border-[#dcebea]/70 rounded-xl"
          />

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-4 py-3 border border-[#dcebea]/70 rounded-xl"
          >
            <option value="">All Branches</option>
            {branches.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-4 py-3 border border-[#dcebea]/70 rounded-xl"
          >
            <option value="">All Semesters</option>
            {semesters.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedBranch("");
              setSelectedSemester("");
            }}
            className="px-4 py-3 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white rounded-xl hover:shadow-lg flex items-center justify-center"
          >
            <X className="h-4 w-4 mr-2" /> Clear
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-6 relative z-10">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-md border border-[#dcebea]/60 hover:shadow-xl transition-all"
            >
              <h3 className="font-semibold text-lg text-[#669a9b] mb-2">
                {note.title}
              </h3>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-3 py-1 bg-[#dcebea] text-[#669a9b] rounded-full text-xs flex items-center">
                  <BookOpen className="h-3 w-3 mr-1" />{" "}
                  {note.subject || "Unknown"}
                </span>
                <span className="px-3 py-1 bg-[#b9d6d5]/60 text-[#669a9b] rounded-full text-xs">
                  Sem {note.semester}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-600 mt-4 border-t border-[#dcebea]/60 pt-3">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4 text-[#8dbbb9]" />{" "}
                  {note.uploaderName || "Unknown"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/user/notes/${note.id}`)}
                    className="p-2 text-[#669a9b] hover:bg-[#dcebea]/60 rounded-lg transition"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => window.open(note.fileUrl, "_blank")}
                    className="p-2 text-[#8dbbb9] hover:bg-[#dcebea]/60 rounded-lg transition"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-[#669a9b]">
            <Search className="h-10 w-10 mx-auto mb-3 text-[#8dbbb9]" />
            <p>No notes found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNotes;
