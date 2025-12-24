import React, { useEffect, useState } from "react";
import {
  Search,
  FileText,
  Download,
  Upload,
  X,
  BookOpen,
  Layers,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import {
  fetchBranches,
  fetchSubjects,
  fetchNotes,
  uploadNote,
  clearSubjects,
} from "../../redux/slices/userNotesSlice";
import { toast } from "react-toastify";

import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
const UserNotes: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

const {
  branches,
  subjects,
  notes,
  loadingNotes,
  uploading,
} = useSelector((state: RootState) => state.userNotes);


  /* ---------------- LOCAL STATE ---------------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [title, setTitle] = useState("");
  const [semester, setSemester] = useState<number | "">("");
  const [branchCode, setBranchCode] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    dispatch(fetchBranches());
    dispatch(fetchNotes());
  }, [dispatch]);

  useEffect(() => {
    if (!semester || !branchCode) {
      dispatch(clearSubjects());
      return;
    }
    dispatch(fetchSubjects({ semester, branchCode }));
  }, [semester, branchCode, dispatch]);

  /* ---------------- UPLOAD ---------------- */
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !semester || !branchCode || !subjectId || !file) {
      toast.error("All fields are required");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("semester", semester.toString());
    fd.append("subjectId", subjectId);
    fd.append("branchCodes", JSON.stringify([branchCode]));
    fd.append("file", file);

    dispatch(uploadNote(fd)).then(() => {
      toast.success("Note uploaded (pending approval)");
      dispatch(fetchNotes());
      setShowUpload(false);
      setTitle("");
      setSemester("");
      setBranchCode("");
      setSubjectId("");
      setFile(null);
    });
  };

  /* ---------------- FILTER NOTES ---------------- */
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------------- SKELETON ---------------- */
  const NoteSkeleton = () => (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-md animate-pulse">
      <div className="h-5 w-2/3 bg-slate-300/30 rounded mb-3" />
      <div className="h-4 w-1/2 bg-slate-300/20 rounded mb-2" />
      <div className="h-4 w-1/3 bg-slate-300/20 rounded" />
    </div>
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg- ">
      {/* Header */}
      <div className="bg-white/1 rounded-3xl p-8 shadow-xl mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-200">
              Study <span className="text-[#6dd1d3]">Notes</span>
            </h1>
            <p className="text-slate-300 mt-2">
              Browse and upload academic notes
            </p>
          </div>

          <button
            onClick={() => setShowUpload(true)}
            className="mt-6 lg:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white rounded-xl shadow-lg"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload Note
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/1 rounded-3xl p-6 shadow-xl mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent border border-[#dcebea]/60 rounded-xl text-slate-200 focus:ring-2 focus:ring-[#8dbbb9]"
          />
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loadingNotes ? (
  Array.from({ length: 16 }).map((_, i) => <NoteSkeleton key={i} />)
) : filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white/1 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-xl transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] flex items-center justify-center mr-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#669a9b]">
                    {note.title}
                  </h3>
                  <p className="text-sm text-slate-400 flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {note.subject.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#dcebea]/40">
                <span className="text-sm text-slate-400 flex items-center">
                  <Layers className="h-4 w-4 mr-1" />
                  Semester {note.semester}
                </span>

                <button
                  onClick={() => window.open(note.fileUrl, "_blank")}
                  className="inline-flex items-center px-4 py-2 bg-[#669a9b] text-white rounded-lg hover:shadow-lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
          ))
        ) : (
  <div className="col-span-full text-center text-[#669a9b] py-20">
    <FileText className="h-10 w-10 mx-auto mb-3 text-[#8dbbb9]" />
    <p>No notes found</p>
  </div>

        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/1 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white/1 rounded-3xl p-8 w-full max-w-xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-200">Upload Note</h2>
              <button onClick={() => setShowUpload(false)}>
                <X className="h-5 w-5 text-slate-300" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-transparent border border-[#dcebea]/60 rounded-xl text-slate-100"
              />

              <Select value={branchCode} onValueChange={setBranchCode}>
              <SelectTrigger className="w-full px-4 py-3 bg-transparent border border-[#dcebea]/60 rounded-xl text-slate-200">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>

              <SelectContent className="bg-black text-slate-200 max-h-60 overflow-y-auto">
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.code}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>


              <Select
                value={semester ? semester.toString() : ""}
                onValueChange={(value) => setSemester(Number(value))}
              >
                <SelectTrigger className="w-full px-4 py-3 bg-transparent border border-[#dcebea]/60 rounded-xl text-slate-200">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>

                <SelectContent className="bg-black text-slate-200 max-h-60 overflow-y-auto">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <SelectItem key={s} value={s.toString()}>
                      Semester {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>


              <Select
                value={subjectId || ""}
                onValueChange={(value) => setSubjectId(value)}
              >
                <SelectTrigger className="w-full px-4 py-3 bg-transparent border border-[#dcebea]/60 rounded-xl text-slate-200">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>

                <SelectContent className="bg-black text-slate-200 max-h-60 overflow-y-auto">
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>


              <label className="group flex items-center justify-between px-4 py-3 border border-[#dcebea]/60 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] rounded-lg flex items-center justify-center">
                    <Upload className="h-5 w-5 text-white" />
                  </div>

                  <div>
                    <p className="text-slate-200 font-medium">
                      {file ? file.name : "Choose a file"}
                    </p>
                    <p className="text-xs text-slate-400">
                      PDF, DOCX, PPT (max 10MB)
                    </p>
                  </div>
                </div>

                <span className="text-sm text-[#6dd1d3] group-hover:underline">
                  Browse
                </span>

                <input
                  type="file"
                  hidden
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>


              <button
                type="submit"
                disabled={uploading}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white rounded-xl"
              >
                {uploading ? <Loader2 className="animate-spin" /> : "Upload"}
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNotes;
