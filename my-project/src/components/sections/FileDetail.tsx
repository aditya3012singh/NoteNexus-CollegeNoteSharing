import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  User,
  Clock,
  FileText,
  Calendar,
  Star,
  Share2,
  AlertCircle,
  File,
  Image,
  Video,
  Music,
  Archive,
  HardDrive,
  Folder,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../my-project/src/redux/store";
import { getFile, clearFileMessages } from "../../../../my-project/src/redux/slices/fileSlice";
import { toast } from "react-toastify";

const FileDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedFile: file, loading, error } = useSelector(
    (state: RootState) => state.file
  );

  // Fetch file details when component mounts
  useEffect(() => {
    if (id) {
      dispatch(getFile(id));
    }
  }, [id, dispatch]);

  // Handle toast notifications for error
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearFileMessages());
    }
  }, [error, dispatch]);

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type.startsWith("video/")) return Video;
    if (type.startsWith("audio/")) return Music;
    if (type.includes("pdf")) return FileText;
    if (type.includes("zip") || type.includes("rar")) return Archive;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDownload = () => {
    if (file?.url) {
      window.open(file.url, "_blank");
    } else {
      toast.warning("File URL not available.");
    }
  };

  const handleShare = async () => {
    if (navigator.share && file) {
      try {
        await navigator.share({
          title: file.name || "Shared File",
          text: `Check out this file: ${file.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled or failed");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info("File link copied to clipboard!");
    }
  };

  /* ---------------------- Loading State ---------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white/70 rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
            <p className="text-slate-600 font-medium">Loading file details...</p>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------- Not Found ---------------------- */
  if (!file) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white/70 rounded-2xl p-8 shadow-xl border border-white/20 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">File Not Found</h2>
          <p className="text-slate-600 mb-6">
            The file you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const Icon = getFileIcon(file.type || "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative">
      {/* Decorative Background */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors duration-200 group"
        >
          <div className="w-8 h-8 bg-white/70 rounded-lg flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <span className="font-medium">Back to Files</span>
        </button>

        {/* File Detail Card */}
        <div className="bg-white/70 rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-blue-900 p-8 text-white relative">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2 leading-tight">
                    {file.originalName || file.name}
                  </h1>
                  <div className="flex items-center space-x-6 text-slate-300">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {file.uploadedBy?.name || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        {new Date(file.createdAt || "").toLocaleDateString()}
                      </span>
                    </div>
                    {file.size && (
                      <div className="flex items-center space-x-2">
                        <HardDrive className="h-4 w-4" />
                        <span className="text-sm">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white/20 px-4 py-2 rounded-full flex items-center space-x-2">
                <Folder className="h-4 w-4 text-white" />
                <span className="text-sm font-medium">
                  {file.type?.split("/")[1]?.toUpperCase() || "FILE"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all transform hover:scale-105 border border-white/20"
              >
                <Download className="h-5 w-5 mr-2" />
                Download File
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

          {/* File Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* File Name */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center space-x-3 mb-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <p className="text-sm font-medium text-slate-600">File Name</p>
                </div>
                <p className="text-lg font-semibold text-slate-800 truncate">
                  {file.filename || file.name}
                </p>
              </div>

              {/* File Size */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center space-x-3 mb-3">
                  <HardDrive className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-medium text-slate-600">File Size</p>
                </div>
                <p className="text-lg font-semibold text-slate-800">
                  {file.size ? formatFileSize(file.size) : "N/A"}
                </p>
              </div>

              {/* File Type */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center space-x-3 mb-3">
                  <Icon className="h-5 w-5 text-purple-600" />
                  <p className="text-sm font-medium text-slate-600">File Type</p>
                </div>
                <p className="text-lg font-semibold text-slate-800">
                  {file.type || "Unknown"}
                </p>
              </div>
            </div>

            {/* File Preview */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-8 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="h-12 w-12 text-slate-400" />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-2">
                {file.originalName || file.name}
              </h4>
              <p className="text-slate-600 mb-4">
                {file.type?.startsWith("image/")
                  ? "Image File"
                  : file.type?.startsWith("video/")
                  ? "Video File"
                  : file.type?.includes("pdf")
                  ? "PDF Document"
                  : "Document File"}
              </p>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Download to View
              </button>
            </div>

            {/* File Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-amber-500" />
                File Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Uploaded By
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-slate-800">
                      {file.uploadedBy?.name || "Unknown User"}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Upload Date
                  </p>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-slate-600" />
                    <span className="font-medium text-slate-800">
                      {new Date(file.createdAt || "").toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800 mb-1">
                      Ready to download?
                    </p>
                    <p className="text-sm text-slate-600">
                      Click below to save this file to your device
                    </p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
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
    </div>
  );
};

export default FileDetail;
