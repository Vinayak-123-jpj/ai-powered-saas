"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Compass, RefreshCw, Layers, History, Shield, Cloud } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Activity } from "@/types";

dayjs.extend(relativeTime);

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/activity");
      if (Array.isArray(res.data)) {
        setActivities(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "UPLOAD":
        return <Cloud className="w-4 h-4 text-indigo-500" />;
      case "FAVORITE":
        return <Layers className="w-4 h-4 text-amber-500" />;
      case "CREATE_FOLDER":
        return <Compass className="w-4 h-4 text-emerald-500" />;
      default:
        return <History className="w-4 h-4 text-slate-500" />;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "UPLOAD":
        return <span className="badge badge-primary text-[9px] font-bold py-1.5 px-2.5 rounded-lg">Upload</span>;
      case "DELETE":
        return <span className="badge badge-error text-[9px] font-bold py-1.5 px-2.5 rounded-lg">Delete</span>;
      case "FAVORITE":
        return <span className="badge badge-warning text-[9px] font-bold py-1.5 px-2.5 rounded-lg">Star</span>;
      case "CREATE_FOLDER":
        return <span className="badge badge-success text-[9px] font-bold py-1.5 px-2.5 rounded-lg">Folder</span>;
      default:
        return <span className="badge badge-ghost text-[9px] font-bold py-1.5 px-2.5 rounded-lg">Edit</span>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in text-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Recent Activity</h1>
          <p className="text-xs sm:text-sm text-base-content/65 mt-1">
            Chronological audit log of uploads, edits, and library management actions.
          </p>
        </div>

        <button 
          onClick={fetchActivities}
          className="btn btn-ghost btn-square rounded-xl hover:bg-base-200/60"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-16 bg-base-200 rounded-2xl" />
          <div className="h-16 bg-base-200 rounded-2xl" />
          <div className="h-16 bg-base-200 rounded-2xl" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center p-16 border border-base-200 border-dashed rounded-2xl bg-base-200/5">
          <History size={40} className="mx-auto text-base-content/25 mb-3" />
          <h3 className="font-bold text-sm mb-1">No activities logged</h3>
          <p className="text-xs text-base-content/50 max-w-xs mx-auto">
            Upload files, star items, or customize collections to begin compiling audit logs here.
          </p>
        </div>
      ) : (
        <div className="relative border-l border-base-300 pl-6 ml-4 space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="relative group">
              {/* Dot Icon */}
              <div className="absolute -left-[38px] top-1.5 p-1.5 bg-base-100 border border-base-300 rounded-xl group-hover:border-indigo-500/55 transition-colors">
                {getActionIcon(activity.action)}
              </div>

              {/* Box */}
              <div className="p-4 rounded-2xl border border-base-200 bg-base-200/20 backdrop-blur-sm group-hover:border-base-300 transition-colors flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-bold text-xs sm:text-sm text-base-content leading-snug">
                    {activity.details}
                  </p>
                  <p className="text-[10px] text-base-content/45 font-bold">
                    {dayjs(activity.createdAt).format("MMM DD, YYYY [at] hh:mm A")} ({dayjs(activity.createdAt).fromNow()})
                  </p>
                </div>

                <div className="flex-shrink-0">
                  {getActionBadge(activity.action)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
