import React, { useEffect, useState } from "react";
import { LoginForm } from "../sections/LoginForm";
import { CreateForm } from "../sections/CreateForm";
import { useLocation, useNavigate } from "react-router-dom";
import PixelSnow from "../ui/PixelSnow";

export const Auth: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">(
    location.pathname.includes("signup") ? "signup" : "login"
  );

  useEffect(() => {
    if (location.pathname.includes("signup")) setMode("signup");
    else if (location.pathname.includes("login")) setMode("login");
  }, [location.pathname]);

  const switchTo = (m: "login" | "signup") => {
    setMode(m);
    navigate(m === "login" ? "/login" : "/signup", { replace: true });
  };

  return (
    <div className="min-h-screen relative flex items-center bg-black pt-12  md:pt-4 justify-center">
      <div className="w-full h-screen relative bg-">
        {/* Background */}
        <PixelSnow
          className="absolute inset-0 z-0"
          color="rgb(94, 60, 215)"
          flakeSize={0.017}
          minFlakeSize={1.25}
          pixelResolution={500}
          speed={1.2}
          density={0.2}
          direction={125}
          brightness={1.0}
          variant="snowflake"
        />

        {/* Centered Content */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          
           
          <div className="max-w-md w-full space-y-6 pointer-events-auto">
            <div className="text-center mb-4">
              <h1 className="text-4xl font-bold text-white">
                Note<span className="text-[#64c2c4]">Nexus</span>
              </h1>
              
            </div>
            {/* Toggle */}
            <div className="flex bg-white/1 backdrop-blur-sm rounded-full p-1 border border-white/10">
              <button
                onClick={() => switchTo("login")}
                className={`w-1/2 py-2 rounded-full text-sm font-semibold transition-all
                  ${
                    mode === "login"
                      ? "bg-[#4e8c8d] text-white shadow-md"
                      : "text-white/70 hover:text-white"
                  }`}
              >
                Login
              </button>

              <button
                onClick={() => switchTo("signup")}
                className={`w-1/2 py-2 rounded-full text-sm font-semibold transition-all
                  ${
                    mode === "signup"
                      ? "bg-[#4e8c8d] to-purple-600 text-white shadow-md"
                      : "text-white/70 hover:text-white"
                  }`}
              >
                Sign Up
              </button>
            </div>

            {/* Auth Forms */}
            <div className="animate-fadeIn">
              {mode === "login" ? <LoginForm /> : <CreateForm />}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
