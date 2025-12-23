import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Shield,
  Edit,
  Save,
  X,
  Star,
  Award,
  Clock,
  CheckCircle,
  Key,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../my-project/src/redux/store";
import {
  updateProfile,
  clearProfileState,
} from "../../../../my-project/src/redux/slices/profileSlice";
import { toast } from "react-toastify";

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error, success } = useSelector(
    (state: RootState) => state.profile
  );

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* ---------------------- Redux Effects ---------------------- */
  useEffect(() => {
    if (success) {
      toast.success("Profile updated successfully!");
      dispatch(clearProfileState());
      setIsEditing(false);
      setShowPasswordForm(false);
    }
    if (error) {
      toast.error(error);
      dispatch(clearProfileState());
    }
  }, [success, error, dispatch]);

  /* ---------------------- Handlers ---------------------- */
  const handleSave = () => {
    dispatch(updateProfile({ name: formData.name, email: formData.email }));
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    dispatch(updateProfile({ password: passwordData.newPassword }));
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

  const handlePasswordCancel = () => {
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShowPasswordForm(false);
  };

  /* ---------------------- UI ---------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#dcebea] to-[#b9d6d5] relative">
      {/* Background Circles */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#8dbbb9]/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-[#b9d6d5]/50 rounded-full blur-2xl"></div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-[#dcebea]/60">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold text-slate-800">
                My <span className="text-[#669a9b]">Profile</span>
              </h1>
              <p className="text-lg text-slate-600 mt-2">
                Manage your account settings and personal information
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {!isEditing && !showPasswordForm && (
                <>
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    <Key className="h-5 w-5 mr-2" />
                    Change Password
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    <Edit className="h-5 w-5 mr-2" />
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-[#dcebea]/60">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8 mb-8">
            {/* Avatar */}
            <div className="relative mb-6 md:mb-0">
              <div className="w-24 h-24 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] rounded-full flex items-center justify-center shadow-2xl">
                <User className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#b9d6d5] rounded-full flex items-center justify-center border-4 border-white shadow-md">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-[#669a9b] mb-2">
                {user?.name}
              </h2>
              <p className="text-lg text-slate-600 mb-3">{user?.email}</p>

              <div className="flex flex-wrap gap-3">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${
                    user?.role === "ADMIN"
                      ? "bg-[#dcebea] text-[#669a9b] border-[#b9d6d5]"
                      : "bg-[#b9d6d5]/50 text-[#669a9b] border-[#dcebea]"
                  }`}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {user?.role === "ADMIN" ? "Administrator" : "Student"}
                </span>

                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#dcebea]/70 text-[#669a9b] border border-[#b9d6d5]">
                  <Star className="h-4 w-4 mr-2" />
                  Active Member
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 md:mt-0">
              <div className="bg-white/60 rounded-2xl p-4 text-center border border-[#dcebea]/70">
                <div className="w-10 h-10 bg-[#dcebea] rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Award className="h-5 w-5 text-[#669a9b]" />
                </div>
                <div className="text-2xl font-bold text-slate-800">12</div>
                <div className="text-sm text-slate-600">Contributions</div>
              </div>

              <div className="bg-white/60 rounded-2xl p-4 text-center border border-[#dcebea]/70">
                <div className="w-10 h-10 bg-[#b9d6d5]/60 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-5 w-5 text-[#669a9b]" />
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {user?.createdAt
                    ? Math.floor(
                        (Date.now() - new Date(user.createdAt).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    : 0}
                </div>
                <div className="text-sm text-slate-600">Days Active</div>
              </div>
            </div>
          </div>

          {/* Editable Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#dcebea]/70 rounded-xl focus:ring-2 focus:ring-[#8dbbb9]"
                />
              ) : (
                <div className="flex items-center space-x-4 p-4 bg-white/60 rounded-xl border border-[#dcebea]/60">
                  <User className="text-[#669a9b]" />
                  <span>{user?.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="flex items-center space-x-4 p-4 bg-white/60 rounded-xl border border-[#dcebea]/60">
                <Mail className="text-[#8dbbb9]" />
                <span>{user?.email}</span>
                <span className="text-xs text-slate-500 bg-[#dcebea]/70 px-2 py-1 rounded-full">
                  Read-only
                </span>
              </div>
            </div>
          </div>

          {/* Save / Cancel */}
          {isEditing && (
            <div className="flex justify-end space-x-4 pt-6 border-t border-[#dcebea]/60 mt-6">
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-[#dcebea]/70 text-[#669a9b] rounded-xl hover:shadow-md"
              >
                <X className="inline h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white rounded-xl hover:shadow-lg"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Password Form */}
        {showPasswordForm && (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-[#dcebea]/60">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#669a9b]">
                Change Password
              </h2>
              <button onClick={handlePasswordCancel}>
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-[#dcebea]/70 rounded-xl"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-[#dcebea]/70 rounded-xl"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-[#dcebea]/70 rounded-xl"
              />
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={handlePasswordCancel}
                  className="px-6 py-3 bg-[#dcebea]/70 text-[#669a9b] rounded-xl hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white rounded-xl hover:shadow-lg"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
