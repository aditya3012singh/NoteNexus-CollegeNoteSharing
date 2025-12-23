import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { AppDispatch, RootState } from "../../../../my-project/src/redux/store";
import { getNote, clearNoteState } from "../../../../my-project/src/redux/slices/noteSlice";
import {
  ArrowLeft,
  Download,
  User,
  Clock,
  Book,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  GraduationCap,
  Building,
  Star,
  Share2,
} from "lucide-react";

const NoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedNote: note, loading, error } = useSelector(
    (state: RootState) => state.notes
  );

  useEffect(() => {
    if (id) dispatch(getNote(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearNoteState());
    }
  }, [error, dispatch]);

  const handleDownload = () => {
    if (note?.fileUrl) window.open(note.fileUrl, "_blank");
    else toast.warning("File URL not available.");
  };

  const handleShare = async () => {
    if (!note) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: `Check out this study note: ${note.title}`,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Note link copied to clipboard!");
    }
  };

  /* ---------------------- Loading ---------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#dcebea] to-[#b9d6d5] flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-[#dcebea]/60">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#b9d6d5] border-t-[#669a9b]"></div>
            <p className="text-[#669a9b] font-medium">Loading note details...</p>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------- Not Found ---------------------- */
  if (!note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#dcebea] to-[#b9d6d5] flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-[#dcebea]/60 text-center max-w-md">
          <div className="w-16 h-16 bg-[#8dbbb9]/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-[#669a9b]" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Note Not Found
          </h2>
          <p className="text-slate-600 mb-6">
            The note you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------- Main UI ---------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#dcebea] to-[#b9d6d5] relative">
      {/* Floating Circles */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#8dbbb9]/40 rounded-full opacity-40 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-16 h-16 bg-[#b9d6d5]/50 rounded-full opacity-40 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-[#669a9b]/40 rounded-full opacity-30 animate-pulse delay-2000"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center text-[#669a9b] hover:text-[#8dbbb9] transition-colors duration-200 group"
        >
          <div className="w-8 h-8 bg-white/70 rounded-lg flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow duration-200">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <span className="font-medium">Back to Notes</span>
        </button>

        {/* Note Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-[#dcebea]/60 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] p-8 text-white">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-3">{note.title}</h1>
                <div className="flex items-center space-x-6 text-white/80">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {note.uploadedBy?.name ||
                        note.uploaderName ||
                        "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date(note.createdAt || "").toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
                  note.status === "APPROVED"
                    ? "bg-white/20 text-white border border-white/30"
                    : "bg-white/10 text-white/80 border border-white/20"
                }`}
              >
                {note.status === "APPROVED" ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Approved</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    <span>{note.status}</span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all transform hover:scale-105 border border-white/20"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Note
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all transform hover:scale-105 border border-white/20"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <InfoCard icon={Book} label="Subject" value={note.subject || "N/A"} />
              <InfoCard icon={Building} label="Branch" value={note.branch || "N/A"} />
              <InfoCard icon={GraduationCap} label="Semester" value={note.semester || "N/A"} />
              <InfoCard
                icon={FileText}
                label="File Type"
                value={note.fileUrl?.split(".").pop()?.toUpperCase() || "PDF"}
              />
            </div>

            <div className="bg-white/80 rounded-2xl p-6 border border-[#dcebea]/60">
              <h3 className="text-lg font-semibold text-[#669a9b] mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-[#8dbbb9]" />
                Note Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Uploaded By
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-slate-800">
                      {note.uploadedBy?.name ||
                        note.uploaderName ||
                        "Unknown"}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Upload Date
                  </p>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-[#669a9b]" />
                    <span className="font-medium text-slate-800">
                      {new Date(note.createdAt || "").toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#dcebea]/60 flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-800 mb-1">
                    Ready to study?
                  </p>
                  <p className="text-sm text-slate-600">
                    Download this note to access the full content
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white rounded-xl hover:shadow-md transition-all transform hover:scale-105"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------- InfoCard ---------------------- */
interface InfoCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, label, value }) => (
  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-md border border-[#dcebea]/60">
    <div className="flex items-center space-x-3 mb-3">
      <div className="w-10 h-10 bg-gradient-to-tr from-[#669a9b] to-[#8dbbb9] rounded-xl flex items-center justify-center">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <p className="text-lg font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  </div>
);

export default NoteDetail;
