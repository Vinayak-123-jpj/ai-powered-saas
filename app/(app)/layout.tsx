"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { useTheme } from "@/components/ThemeProvider";
import axios from "axios";
import {
  LogOutIcon,
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  Compass,
  Sun,
  Moon,
  Database,
  Folder,
  Star,
  History,
  Settings
} from "lucide-react";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Media Vault" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Upload Pilot" },
  { href: "/collections", icon: Folder, label: "Collections" },
  { href: "/favorites", icon: Star, label: "Starred Items" },
  { href: "/activity", icon: History, label: "Activity Log" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (user) {
      axios.get("/api/folders").catch(err => console.error(err));
      axios.get("/api/activity").catch(err => console.error(err));
    }
  }, [user]);

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-100 text-base-content transition-colors duration-200">
      <input
        id="sidebar-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        onChange={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Main Content Pane */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="sticky top-0 z-30 w-full border-b border-base-200 bg-base-100/80 backdrop-blur-md">
          <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="sidebar-drawer"
                className="btn btn-square btn-ghost drawer-button rounded-xl"
              >
                <MenuIcon className="w-5 h-5" />
              </label>
            </div>
            
            {/* Title / Brand Link */}
            <div className="flex-1">
              <Link href="/" onClick={handleLogoClick} className="flex items-center space-x-2">
                <div className="lg:hidden p-1.5 rounded-lg bg-indigo-600 text-white">
                  <Compass className="w-5 h-5" />
                </div>
                <div className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 cursor-pointer">
                  MediaPilot AI
                </div>
              </Link>
            </div>

            {/* Navbar Controls */}
            <div className="flex-none flex items-center space-x-3">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme} 
                className="btn btn-ghost btn-circle rounded-xl"
                title="Toggle Theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700" />
                )}
              </button>

              {user && (
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="w-9 h-9 rounded-xl ring-2 ring-indigo-500/20 shadow-md">
                      <Image
                        src={user.imageUrl}
                        alt={user.username || user.emailAddresses[0]?.emailAddress || "Pilot User"}
                        width={36}
                        height={36}
                        className="rounded-xl object-cover"
                      />
                    </div>
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-base-content/80 max-w-xs truncate">
                    {user.username || user.emailAddresses[0]?.emailAddress || "Pilot User"}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="btn btn-ghost btn-circle rounded-xl text-error/80 hover:text-error hover:bg-error/10"
                    title="Sign Out"
                  >
                    <LogOutIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Area wrapper */}
        <main className="flex-grow flex flex-col">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-8 flex-grow">
            {children}
          </div>
        </main>
      </div>

      {/* Sidebar Drawer */}
      <div className="drawer-side z-40 border-r border-base-200">
        <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
        <aside className="bg-base-200/50 backdrop-blur-md w-64 h-full flex flex-col border-r border-base-200 justify-between">
          <div>
            {/* Sidebar Branding Header */}
            <div className="flex items-center space-x-3 px-6 py-6 border-b border-base-200 bg-base-200/20">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-base-content via-base-content/95 to-base-content/80">
                MediaPilot AI
              </span>
            </div>

            {/* Sidebar Navigation */}
            <ul className="menu p-4 w-full text-sm space-y-1.5">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3.5 px-4 py-3 rounded-xl transition-all duration-150 font-medium ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-[1.02]"
                          : "hover:bg-base-300/60 hover:text-base-content text-base-content/75"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Storage Gauge & User Footer */}
          <div className="p-4 border-t border-base-200 bg-base-200/10">
            {/* Storage Indicator */}
            <div className="p-4 rounded-2xl bg-base-300/40 border border-base-300/60 mb-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-base-content/60 mb-2">
                <Database className="w-4 h-4 text-indigo-500" />
                <span>Storage Vault</span>
              </div>
              <progress className="progress progress-primary w-full h-2 mb-1.5" value="28" max="100"></progress>
              <div className="flex items-center justify-between text-[10px] font-semibold text-base-content/50">
                <span>284 MB Used</span>
                <span>1 GB Limit</span>
              </div>
            </div>

            {user && (
              <button
                onClick={handleSignOut}
                className="btn btn-outline btn-error w-full rounded-xl border-dashed border-2 flex items-center justify-center space-x-2 text-xs py-2 h-auto min-h-0 font-bold"
              >
                <LogOutIcon className="h-4 w-4" />
                <span>Sign Out Pilot</span>
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
