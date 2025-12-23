"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "../lib/utils";

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <AuthBar className="top- bg-invisible" />
    </div>
  );
}

export function AuthBar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-xl mx-auto z-50 text-white  align-center", className)}
    >
      <Menu setActive={setActive}>
        

        <a href="/login" className="font-sans font-semibold hover:text-blue-400">Signin</a>
        <a href="/signup" className="font-sans font-semibold hover:text-blue-400">Create Account</a>
        
        
      </Menu>
    </div>
  );
}