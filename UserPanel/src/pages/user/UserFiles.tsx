import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Download,
  X,
  Plus,
  HardDrive,
  Folder,
 
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../my-project/src/redux/store";
import {
  getAllFiles,
  uploadFile,
  deleteFile,
  clearFileMessages,
} from "../../../../my-project/src/redux/slices/fileSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserFiles: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { files, loading, error, successMessage } = useSelector(
    (state: RootState) => state.file
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "image" | "document" | "video" | "audio" | "other"
  >("all");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------------- Fetch Files ---------------------- */
  useEffect(() => {
    dispatch(getAllFiles());
  }, [dispatch]);

  /* ---------------------- Toasts ---------------------- */
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearFileMessages());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearFileMessages());
    }
  }, [error, successMessage, dispatch]);

  /* ---------------------- Handlers ---------------------- */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setShowUploadForm(true);
    }
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      await dispatch(uploadFile(formData));
    }
    setUploading(false);
    setSelectedFiles([]);
    setShowUploadForm(false);
  };

  const handleDeleteFile = async (fileId: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      await dispatch(deleteFile(fileId));
    }
  };

  const handleViewFile = (id: string) => navigate(`/user/files/${id}`);
  const handleDownloadFile = (url: string) => {
    if (url) window.open(url, "_blank");
  };

  const getFileTypeCategory = (
    type: string
  ): "image" | "document" | "video" | "audio" | "other" => {
    if (type.startsWith("image/")) return "image";
    if (type.startsWith("video/")) return "video";
    if (type.startsWith("audio/")) return "audio";
    if (type.includes("pdf") || type.includes("document") || type.includes("text"))
      return "document";
    return "other";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.originalName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" || getFileTypeCategory(file.type) === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);

  /* ---------------------- Loading ---------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 via-[#dcebea] to-[#b9d6d5]">
        <div className="p-8 bg-white/80 rounded-2xl shadow-xl border border-[#dcebea]/60">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 border-4 border-[#b9d6d5] border-t-[#669a9b] rounded-full animate-spin" />
            <p className="text-[#669a9b] font-medium">Loading files...</p>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------- UI ---------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#dcebea] to-[#b9d6d5] py-10 relative">
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#8dbbb9]/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-[#b9d6d5]/50 rounded-full blur-2xl"></div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-[#dcebea]/60 mx-6 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              My <span className="text-[#669a9b]">Files</span>
            </h1>
            <p className="text-slate-600 mt-2">
              Manage and organize your uploaded resources
            </p>
          </div>
          <div className="flex space-x-4 items-center">
            <div className="flex items-center bg-[#dcebea] text-[#669a9b] px-4 py-2 rounded-xl">
              <HardDrive className="h-5 w-5 mr-2" />
              {files.length} files
            </div>
            <div className="flex items-center bg-[#b9d6d5]/50 text-[#669a9b] px-4 py-2 rounded-xl">
              <Folder className="h-5 w-5 mr-2" />
              {formatFileSize(totalSize)}
            </div>
            <button
              onClick={() => setShowUploadForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white rounded-xl hover:shadow-lg flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" /> Upload Files
            </button>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-[#dcebea]/60 mx-6 my-6 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#669a9b]">Upload Files</h2>
            <button
              onClick={() => setShowUploadForm(false)}
              className="p-2 hover:text-red-600 text-slate-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              dragActive
                ? "border-[#8dbbb9] bg-[#dcebea]/40"
                : "border-[#dcebea]/70 hover:border-[#8dbbb9]"
            }`}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const dropped = Array.from(e.dataTransfer.files);
              setSelectedFiles(dropped);
            }}
          >
            <div className="flex flex-col items-center space-y-3">
              <Folder className="h-10 w-10 text-[#669a9b]" />
              <p className="text-slate-700 font-medium">
                Drag and drop or click to upload
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white rounded-lg hover:shadow-lg"
              >
                Choose Files
              </button>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-slate-700">
                Selected Files ({selectedFiles.length})
              </h3>
              <ul className="space-y-2">
                {selectedFiles.map((file, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center bg-white/60 p-3 rounded-xl border border-[#dcebea]/60"
                  >
                    <span>{file.name}</span>
                    <X
                      className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-700"
                      onClick={() =>
                        setSelectedFiles((prev) => prev.filter((_, idx) => idx !== i))
                      }
                    />
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedFiles([])}
                  className="px-5 py-2 bg-[#dcebea]/70 text-[#669a9b] rounded-lg hover:shadow-md"
                >
                  Clear
                </button>
                <button
                  onClick={handleFileUpload}
                  disabled={uploading}
                  className="px-6 py-3 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white rounded-lg hover:shadow-lg"
                >
                  {uploading ? "Uploading..." : "Upload Files"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* File Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-6 mt-10 relative z-10">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-md border border-[#dcebea]/60 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3
                    className="font-semibold text-[#669a9b] mb-1 cursor-pointer hover:text-[#8dbbb9]"
                    onClick={() => handleViewFile(file.id)}
                  >
                    {file.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {formatFileSize(file.size || 0)}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteFile(file.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 flex justify-between items-center text-sm text-slate-600 border-t border-[#dcebea]/60 pt-3">
                <span className="capitalize">
                  {getFileTypeCategory(file.type)}
                </span>
                <button
                  onClick={() => handleDownloadFile(file.url)}
                  className="text-[#669a9b] hover:text-[#8dbbb9]"
                >
                  <Download className="h-4 w-4 inline" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-[#669a9b]">
            <Folder className="h-10 w-10 mx-auto mb-3 text-[#8dbbb9]" />
            <p>No files found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserFiles;
