"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "../lib/utils";

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top- bg-invisible" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50 text-white  align-center", className)}
    >
      <Menu setActive={setActive}>
        <div className="pr-40 text-2xl font-bold ">NoteNexus</div>

        <a href="/home" className="">Home</a>
        <a href="/about" className="">About</a>
        <a href="/signup" className="">Get Started</a>
        
      </Menu>
    </div>
  );
}