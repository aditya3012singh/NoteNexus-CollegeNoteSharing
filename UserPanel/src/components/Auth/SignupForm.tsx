import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BookOpen,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  checkAdminExists,
  checkUserExists,
  sendOtp,
  verifyOtp,
  signUp,
  clearAuthError,
} from "../../redux/slices/authSlice";

/* ---------------------- Logo ---------------------- */
const NoteNexusLogo: React.FC<{ className?: string; textSize?: string }> = ({
  className = "h-8 w-8",
  textSize = "text-2xl",
}) => (
  <div className="flex items-center space-x-3">
    <div className="relative group">
      <div
        className={`bg-gradient-to-tr from-[#669a9b] to-[#8dbbb9] p-2.5 rounded-2xl ${className} flex items-center justify-center shadow-2xl transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110`}
      >
        <BookOpen className="h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
      <div className="absolute -top-1 -right-1">
        <Sparkles className="h-4 w-4 text-[#669a9b] animate-pulse" />
      </div>
    </div>
    <span className={`${textSize} font-bold text-slate-800`}>
      Note<span className="text-[#669a9b]">Nexus</span>
    </span>
  </div>
);

/* ---------------------- Signup Form ---------------------- */
const SignupForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    loading,
    error,
    adminExists,
    user,
  } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT" as "STUDENT" | "ADMIN",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  /* ---------------------- Redirect if already logged in ---------------------- */
  useEffect(() => {
    if (user) navigate("/user");
  }, [user, navigate]);

  /* ---------------------- Cooldown Timer ---------------------- */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  /* ---------------------- Handlers ---------------------- */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) dispatch(clearAuthError());
  };

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "STUDENT" | "ADMIN";
    setFormData((prev) => ({ ...prev, role: value }));
    if (value === "ADMIN") {
      const result = await dispatch(checkAdminExists()).unwrap().catch(() => null);
      if (result?.adminExists) {
        toast.error("An admin already exists. Only one admin is allowed.");
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (formData.role === "ADMIN" && adminExists) {
      toast.error("Cannot create admin. Admin already exists.");
      return;
    }

    try {
      const userCheck = await dispatch(checkUserExists(formData.email)).unwrap();
      if (userCheck.exists) {
        toast.info("User already exists. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      await dispatch(sendOtp({ email: formData.email })).unwrap();
      setStep("otp");
      setResendCooldown(60);
      toast.success("OTP sent successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP");
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        verifyOtp({ email: formData.email.toLowerCase(), code: otp.trim() })
      ).unwrap();

      const result = await dispatch(
        signUp({
          name: formData.name,
          email: formData.email.toLowerCase(),
          password: formData.password,
          role: formData.role,
        })
      ).unwrap();

      if (result?.token) {
        toast.success("Signup successful! Redirecting...");
        navigate("/user");
      }
    } catch (err: any) {
      toast.error(err.message || "OTP verification failed");
    }
  };

  const resendOtp = async () => {
    try {
      await dispatch(sendOtp({ email: formData.email })).unwrap();
      setResendCooldown(60);
      toast.success("OTP resent successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend OTP");
    }
  };

  /* ---------------------- OTP Screen ---------------------- */
  if (step === "otp") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#dcebea] to-[#b9d6d5] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-6 relative z-10">
          <div className="text-center cursor-pointer" onClick={() => navigate("/")}>
            <NoteNexusLogo className="h-14 w-14 mx-auto mb-4" textSize="text-4xl" />
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Verify your email</h2>
            <p className="text-slate-600">
              We sent a code to{" "}
              <span className="text-[#669a9b] font-semibold">{formData.email}</span>
            </p>
          </div>

          <form
            onSubmit={handleOtpVerification}
            className="bg-white/80 p-8 rounded-2xl shadow-xl border border-[#dcebea]/50 space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                className="w-full text-center text-2xl tracking-widest border-2 border-slate-200 rounded-xl py-3 focus:border-[#669a9b] focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Verify & Create Account</span>
                </>
              )}
            </button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={resendOtp}
                disabled={resendCooldown > 0}
                className="text-[#669a9b] hover:text-[#8dbbb9] font-semibold underline disabled:opacity-50"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend OTP"}
              </button>
              <div>
                <button
                  type="button"
                  onClick={() => setStep("signup")}
                  className="text-slate-500 hover:text-slate-700"
                >
                  ← Back to signup
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* ---------------------- Signup Screen ---------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#dcebea] to-[#b9d6d5] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6 relative z-10">
        <div
          onClick={() => navigate("/")}
          className="text-center cursor-pointer"
        >
          <NoteNexusLogo className="h-14 w-14 mx-auto mb-4" textSize="text-4xl" />
          
          <p className="text-slate-600">
            Create your account and start your learning journey
          </p>
        </div>

        <form
          onSubmit={handleSignup}
          className="bg-white/80 p-8 rounded-2xl shadow-xl border border-[#dcebea]/50 space-y-6"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-[#669a9b] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-[#8dbbb9] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Account Type
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-[#b9d6d5] focus:bg-white"
            >
              <option value="STUDENT">Student</option>
              <option value="ADMIN" disabled={adminExists}>
                Admin {adminExists ? "(Already exists)" : ""}
              </option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-[#669a9b] focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-[#669a9b]"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-[#8dbbb9] focus:bg-white"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-3 text-slate-500 hover:text-[#8dbbb9]"
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-[#669a9b]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-2 rounded-lg text-center">
              {error}
            </p>
          )}
        </form>

        <div className="text-center">
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#669a9b] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
