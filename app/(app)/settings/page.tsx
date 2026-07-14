"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  User, 
  Settings, 
  Database, 
  ShieldCheck, 
  Mail, 
  Calendar,
  Lock,
  Cloud,
  Check
} from "lucide-react";
import Image from "next/image";

export default function SettingsPage() {
  const { user } = useUser();
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const copyApiKey = () => {
    navigator.clipboard.writeText("mp_live_f893e4jdn29a0fjd831jdls8");
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  if (!user) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 bg-base-200 rounded-2xl w-1/3" />
        <div className="h-40 bg-base-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-sm">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Account & Settings</h1>
        <p className="text-xs sm:text-sm text-base-content/65 mt-1">
          Manage your personal profile, API configurations, and storage details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: Profile overview card */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl border border-base-200 bg-base-200/20 backdrop-blur-sm text-center space-y-4">
            <div className="relative mx-auto w-24 h-24 rounded-2xl ring-4 ring-indigo-500/20 overflow-hidden shadow-lg">
              <Image 
                src={user.imageUrl} 
                alt="User Profile" 
                fill
                className="object-cover" 
              />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-base-content leading-tight">
                {user.username || "Media Pilot User"}
              </h3>
              <p className="text-[10px] font-bold text-indigo-500 uppercase mt-1 tracking-wider">
                Pilot Pro Tier
              </p>
            </div>

            <div className="pt-4 border-t border-base-200/60 text-left space-y-3 text-xs text-base-content/75">
              <div className="flex items-center space-x-2.5">
                <Mail size={14} className="text-base-content/40" />
                <span className="truncate">{user.emailAddresses[0]?.emailAddress}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Calendar size={14} className="text-base-content/40" />
                <span>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Settings details */}
        <div className="md:col-span-2 space-y-6">
          {/* Storage Details */}
          <div className="p-6 rounded-2xl border border-base-200 bg-base-200/20 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center space-x-2">
              <Database size={16} className="text-indigo-500" />
              <span>Storage Quota Breakdown</span>
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Vault Capacity</span>
                <span className="text-indigo-500">28.4% Used</span>
              </div>
              <progress className="progress progress-primary w-full h-3.5" value="28.4" max="100"></progress>
              <div className="flex justify-between text-[10px] text-base-content/50 font-semibold">
                <span>284 MB Used</span>
                <span>1 GB Total Quota Limit</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-medium pt-2">
              <div className="p-3 bg-base-300/40 rounded-xl border border-base-300/20">
                <div className="text-[10px] text-base-content/45 font-bold uppercase mb-1">Optimized Videos</div>
                <div className="font-extrabold text-base-content">12 files &bull; 198 MB</div>
              </div>
              <div className="p-3 bg-base-300/40 rounded-xl border border-base-300/20">
                <div className="text-[10px] text-base-content/45 font-bold uppercase mb-1">Social Crops</div>
                <div className="font-extrabold text-base-content">4 files &bull; 86 MB</div>
              </div>
            </div>
          </div>

          {/* API Key Panel */}
          <div className="p-6 rounded-2xl border border-base-200 bg-base-200/20 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center space-x-2">
              <ShieldCheck size={16} className="text-indigo-500" />
              <span>API Integration Keys</span>
            </h3>

            <p className="text-xs text-base-content/60 leading-relaxed">
              Use your API Keys to integrate MediaPilot AI optimization pipelines directly into external developer environments and CI/CD pipelines.
            </p>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Lock size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input 
                  type="password" 
                  readOnly 
                  value="mp_live_f893e4jdn29a0fjd831jdls8" 
                  className="input input-bordered input-sm w-full rounded-xl pl-9 text-xs bg-base-300 font-mono"
                />
              </div>
              <button 
                onClick={copyApiKey}
                className="btn btn-sm rounded-xl px-4 flex items-center space-x-1"
              >
                {apiKeyCopied ? (
                  <>
                    <Check size={14} className="text-emerald-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <span>Copy Key</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
