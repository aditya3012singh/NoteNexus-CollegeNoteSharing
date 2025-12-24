import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftSideBar from '../sections/LeftSideBar';
import PixelSnow from '../ui/PixelSnow';

export const MainLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#010205] text-white overflow-hidden">
      {/* Pixel snow background */}
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

      {/* Layout */}
      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <LeftSideBar />

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 pt-20 md:pt-4 pb-28 md:pb-0">

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
