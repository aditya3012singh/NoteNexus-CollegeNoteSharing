import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import type { AppDispatch, RootState } from "../../redux/store";
import { signIn, clearAuthError } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

/* ---------------------- Logo Component ---------------------- */
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

/* ---------------------- Login Form ---------------------- */
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  /* ✅ Redirect if user is already logged in */
  useEffect(() => {
    if (user) navigate("/user");
  }, [user, navigate]);

  /* ✅ Clear error when input changes */
  useEffect(() => {
    if (error) dispatch(clearAuthError());
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      const result = await dispatch(signIn({ email, password })).unwrap();
      if (result?.user) {
        navigate("/user");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#dcebea] to-[#b9d6d5] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-[#8dbbb9]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-20 w-40 h-40 bg-[#669a9b]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#b9d6d5]/20 rounded-full blur-2xl animate-pulse delay-2000"></div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Header */}
        <div
          onClick={() => navigate("/")}
          className="text-center cursor-pointer"
        >
          <div className="mb-6 inline-block">
            <NoteNexusLogo className="h-14 w-14" textSize="text-4xl" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome back
          </h2>
          <p className="text-slate-500">
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-[#dcebea]/50">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#669a9b]" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aditya3012singh@gmail.com"
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#669a9b] transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8dbbb9]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="234567"
                  className="w-full pl-11 pr-12 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#8dbbb9] transition-all duration-200"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#669a9b]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 bg-red-50 p-2 rounded-lg text-center">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-[#669a9b]/25 hover:shadow-xl hover:shadow-[#669a9b]/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">
                New to NoteNexus?
              </span>
            </div>
          </div>

          {/* Signup */}
          <Link
            to="/signup"
            className="block w-full text-center py-3 border-2 border-[#669a9b] text-[#669a9b] rounded-xl font-semibold hover:bg-[#669a9b] hover:text-white transition-all duration-200"
          >
            Create an account
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center space-x-2">
            <span className="w-1.5 h-1.5 bg-[#669a9b] rounded-full animate-pulse"></span>
            <span>Secured with 256-bit encryption</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
