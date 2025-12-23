import { clearAuthError, signIn } from "../../redux/slices/authSlice";
import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "@/redux/store";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";


export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const dispatch= useDispatch<AppDispatch>();
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
    }

    return (
        <div className="bg-transparent rounded-2xl p-8 shadow-xl border border-[#dcebea]/50">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-2"
              >
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aditya3012singh@gmail.com"
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-transparent focus:text-white focus:border-[#669a9b] transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-2"
              >
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="234567"
                  className="w-full pl-11 pr-12 py-3 border-2 border-slate-200 rounded-xl bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-transparent focus:text-white focus:border-[#8dbbb9] transition-all duration-200"
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
              className="w-full bg-[rgba(26,65,158,1)] text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-[#669a9b]/25 hover:shadow-xl hover:shadow-[#669a9b]/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
            className="block w-full text-center py-3 border-2 border-[#669a9b] text-[#669a9b] rounded-xl font-semibold hover:bg-[rgba(26,65,158,1)] hover:text-white transition-all duration-200"
          >
            Create an account
          </Link>
        </div>
    )
}