import { checkAdminExists, checkUserExists, clearAuthError, sendOtp, signUp, verifyOtp } from "../../redux/slices/authSlice";
import type { AppDispatch, RootState } from "../../redux/store";
import { ArrowRight, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CreateForm: React.FC = () => {
    const dispatch= useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const {
        loading,
        error,
        adminExists,
        user,
    }= useSelector((state: RootState) => state.auth);

      const [formData, setFormData] = useState({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            semester: 1,
            branchCode: "",
            role: "STUDENT",
        });
        const [showPassword, setShowPassword] = useState(false);
        const [showConfirmPassword, setShowConfirmPassword] = useState(false);
        const [step, setStep] = useState<"signup" | "otp">("signup");
        const [otp, setOtp] = useState("");
        const [resendCooldown, setResendCooldown] = useState(0);

        useEffect(() => {
            if(user) navigate("/user");
        }, [user, navigate]);

         useEffect(() => {
          let timer: NodeJS.Timeout;
          if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
          }
          return () => clearTimeout(timer);
        }, [resendCooldown]);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev,  [name]: name === "semester" ? Number(value) : value,}));
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
          semester: formData.semester,
          branchCode: formData.branchCode,
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

    if (step === "otp") {
    return (
      <div className="max-w-md w-full space-y-6 relative z-10 text-white">

          <form
            onSubmit={handleOtpVerification}
            className="bg-transparent p-8 rounded-2xl shadow-none border border-white/10 space-y-6 text-white"
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
                className="w-full text-center text-2xl tracking-widest border-2 border-white/20 rounded-xl py-3 bg-transparent text-white placeholder-white/60 focus:border-white focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-[rgba(26,65,158,1)] text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-[#669a9b]/25 hover:shadow-xl hover:-translate-y-0.5 transition disabled:opacity-60"
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
                className="text-white/80 hover:text-white font-semibold underline disabled:opacity-50"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend OTP"}
              </button>
              <div>
                <button
                  type="button"
                  onClick={() => setStep("signup")}
                  className="text-white/80 hover:text-white"
                >
                  ← Back to signup
                </button>
              </div>
            </div>
          </form>
        </div>
      
    );
  }
    return (
      <div className="max-w-md w-full space-y-6 relative z-10 text-white">
        <form
          onSubmit={handleSignup}
          className="bg-transparent p-8 rounded-2xl shadow-none border border-white/10 space-y-6 text-white"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border-2 border-white/20 rounded-xl bg-transparent text-white placeholder-white/60 focus:border-white focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border-2 border-white/20 rounded-xl bg-transparent text-white placeholder-white/60 focus:border-white focus:outline-none"
            />
          </div>

          {/* Role */}
          {/* <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Account Type
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              className="w-full px-4 py-3 border-2 border-white/20 rounded-xl bg-transparent text-white focus:border-white"
            >
              <option value="STUDENT">Student</option>
              <option value="ADMIN" disabled={adminExists}>
                Admin {adminExists ? "(Already exists)" : ""}
              </option>
            </select>
          </div> */}
          {/* Semester */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Semester
            </label>
            <input
              name="semester"
              type="number"
              required
              min={1}
              max={8}
              value={formData.semester}
              onChange={handleInputChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border-2 border-white/20 rounded-xl bg-transparent text-white placeholder-white/60 focus:border-white focus:outline-none"
            />
          </div>

          {/* Branch Code */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Branch Code
            </label>
            <input
              name="branchCode"
              type="text"
              required
              value={formData.branchCode}
              onChange={handleInputChange}
              placeholder="CSE, ECE, ME, etc."
              className="w-full px-4 py-3 border-2 border-white/20 rounded-xl bg-transparent text-white placeholder-white/60 focus:border-white focus:outline-none"
            />
          </div>
          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
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
                className="w-full px-4 py-3 border-2 border-white/20 rounded-xl bg-transparent text-white placeholder-white/60 focus:border-white focus:outline-none"
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
            <label className="block text-sm font-semibold text-white mb-2">
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
                className="w-full px-4 py-3 border-2 border-white/20 rounded-xl bg-transparent text-white placeholder-white/60 focus:border-white focus:outline-none"
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
            className="w-full bg-[rgba(26,65,158,1)] text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-[#669a9b]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60"
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
            <p className="text-sm text-red-100 bg-red-600/40 p-2 rounded-lg text-center">
              {error}
            </p>
          )}
        </form>

        <div className="text-center">
          <p className="text-sm text-white">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
        </div>
    )
}