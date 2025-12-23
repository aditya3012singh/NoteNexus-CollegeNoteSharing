import React, { useEffect, useState } from "react";
import { LoginForm } from "../sections/LoginForm";
import { CreateForm } from "../sections/CreateForm";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthBar } from "../AuthBar";
import TextType from "../ui/TextType";
import { GridScan } from "../ui/GridScan";
import LeftSideBar from "../sections/LeftSideBar";

export const Auth: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [mode, setMode] = useState<'login' | 'signup'>(
        location.pathname.includes('signup') ? 'signup' : 'login'
    );

    useEffect(() => {
        if (location.pathname.includes('signup')) setMode('signup');
        else if (location.pathname.includes('login')) setMode('login');
    }, [location.pathname]);

    const switchTo = (m: 'login' | 'signup') => {
        setMode(m);
        navigate(m === 'login' ? '/login' : '/signup', { replace: true });
    };

    return (
        <div className="min-h-screen bg- relative flex items-center justify-center px- py-">
            <div className="absolute top-6 ">
              <AuthBar />
            </div>
            
            <div style={{ width: '100%', height: '100vh', position: 'relative' }} className="bg-black w-full">
                    <GridScan
                      className="pointer-events-none"
                      sensitivity={0.55}
                      lineThickness={1}
                      linesColor="rgba(9, 6, 15, 0.23)"
                      gridScale={0.06}
                      scanColor="rgba(26, 65, 158, 1)"
                      scanOpacity={0.6}
                      enablePost
                      bloomIntensity={0.6}
                      chromaticAberration={0.002}
                      noiseIntensity={0.01}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center'
                    }}>
                      <div className="max-w-md w-full space-y-6 relative z-10 pointer-events-auto">
                        {mode === 'login' ? <LoginForm /> : <CreateForm />}
                    </div>
                    </div>
                  </div>

        </div>
    );
};