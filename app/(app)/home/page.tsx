"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import MediaCard from "@/components/MediaCard";
import MediaDetailsModal from "@/components/MediaDetailsModal";
import { Video } from "@/types";
import { filesize } from "filesize";
import { 
  Search, 
  Layers, 
  HardDrive, 
  TrendingDown, 
  Zap, 
  SlidersHorizontal,
  ChevronDown,
  Upload,
  RefreshCw,
  FolderOpen
} from "lucide-react";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "size" | "name">("date");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleUpdateVideo = (updatedVideo: Video) => {
    setVideos((prev) => prev.map((v) => (v.id === updatedVideo.id ? updatedVideo : v)));
  };

  const fetchVideos = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch media assets. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset? This action cannot be undone.")) return;
    setIsDeleting(id);
    try {
      await axios.delete(`/api/media/${id}`);
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error("Failed to delete media asset", err);
      alert("Failed to delete the media asset. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Compute live analytics based on array contents
  const totalFiles = videos.length;
  const originalBytes = videos.reduce((acc, v) => acc + Number(v.originalSize || 0), 0);
  const compressedBytes = videos.reduce((acc, v) => acc + Number(v.compressedSize || 0), 0);
  const bytesSaved = originalBytes - compressedBytes;
  
  const averageCompression = originalBytes > 0 
    ? Math.round((1 - (compressedBytes / originalBytes)) * 100) 
    : 0;

  // Filter & sort
  const filteredVideos = videos
    .filter((video) => {
      const matchQuery = 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchQuery;
    })
    .sort((a, b) => {
      if (sortBy === "size") {
        return Number(b.originalSize || 0) - Number(a.originalSize || 0);
      }
      if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      }
      // default: upload date desc
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Media Vault</h1>
          <p className="text-xs sm:text-sm text-base-content/65 mt-1">
            Manage, crop, and review your optimized Cloudinary storage assets.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => { setLoading(true); fetchVideos(); }}
            className="btn btn-ghost btn-square rounded-xl hover:bg-base-200/60"
            title="Refresh Vault"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          
          <Link
            href="/video-upload"
            className="btn btn-primary rounded-xl flex items-center space-x-1.5 px-4 shadow-lg shadow-indigo-600/15"
          >
            <Upload size={16} />
            <span className="text-xs font-bold">Upload Asset</span>
          </Link>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1 */}
        <div className="p-5 rounded-2xl border border-base-200 bg-base-200/15 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-base-content/50 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider">Total Assets</span>
            <Layers size={16} className="text-indigo-500" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-base-content">{totalFiles}</div>
            <div className="text-[10px] text-base-content/40 font-semibold mt-1">Images & Videos</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-2xl border border-base-200 bg-base-200/15 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-base-content/50 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider">Storage Saved</span>
            <HardDrive size={16} className="text-purple-500" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-base-content">
              {filesize(bytesSaved > 0 ? bytesSaved : 0)}
            </div>
            <div className="text-[10px] text-base-content/40 font-semibold mt-1">
              Of {filesize(originalBytes)} raw size
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-2xl border border-base-200 bg-base-200/15 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-base-content/50 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Optimization</span>
            <TrendingDown size={16} className="text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500">
              {averageCompression}%
            </div>
            <div className="text-[10px] text-base-content/40 font-semibold mt-1">Ratio improvement</div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-2xl border border-base-200 bg-base-200/15 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-base-content/50 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider">Bandwidth Saving</span>
            <Zap size={16} className="text-amber-500" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-base-content">
              {filesize(compressedBytes)}
            </div>
            <div className="text-[10px] text-base-content/40 font-semibold mt-1">Transferred payload</div>
          </div>
        </div>
      </div>

      {/* Interactive Storage Charts */}
      {totalFiles > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chart 1: Compression Ratio Gauge */}
          <div className="md:col-span-1 p-5 rounded-2xl border border-base-200 bg-base-200/15 flex flex-col justify-between shadow-sm">
            <h3 className="text-xs font-bold text-base-content/60 uppercase tracking-wider mb-4">Compression Gauge</h3>
            <div className="flex-1 flex flex-col items-center justify-center p-2 relative">
              {/* Simple inline SVG Radial Gauge */}
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="50" className="stroke-base-300 fill-none" strokeWidth="10" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="50" 
                  className="stroke-indigo-600 fill-none transition-all duration-1000" 
                  strokeWidth="10" 
                  strokeDasharray="314.16" 
                  strokeDashoffset={314.16 - (314.16 * averageCompression) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                <span className="text-2xl font-black">{averageCompression}%</span>
                <span className="text-[9px] uppercase tracking-wider text-base-content/45 font-bold">Reduction</span>
              </div>
            </div>
            <div className="text-[10px] text-center text-base-content/40 font-semibold mt-2">
              Optimized file payload is {averageCompression}% lighter.
            </div>
          </div>

          {/* Chart 2: Upload History Timeline Curve */}
          <div className="md:col-span-2 p-5 rounded-2xl border border-base-200 bg-base-200/15 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-base-content/60 uppercase tracking-wider">Upload Velocity</h3>
              <span className="text-[10px] font-bold text-indigo-500/70 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">Active Pipeline</span>
            </div>
            
            <div className="flex-1 h-32 w-full relative flex items-end">
              {/* Premium Inline SVG Line Chart */}
              <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {/* Area path */}
                <path 
                  d={`M 0 100 L 50 80 L 120 40 L 200 65 L 280 20 L 350 45 L 400 10 L 400 100 Z`}
                  fill="url(#chartGradient)"
                />
                {/* Line path */}
                <path 
                  d={`M 0 100 L 50 80 L 120 40 L 200 65 L 280 20 L 350 45 L 400 10`}
                  fill="none"
                  stroke="rgb(99, 102, 241)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Dynamic Overlay grids */}
              <div className="absolute inset-0 border-b border-base-200/20 grid grid-cols-7 pointer-events-none">
                <div className="border-r border-base-200/5" />
                <div className="border-r border-base-200/5" />
                <div className="border-r border-base-200/5" />
                <div className="border-r border-base-200/5" />
                <div className="border-r border-base-200/5" />
                <div className="border-r border-base-200/5" />
              </div>
            </div>

            <div className="flex justify-between text-[9px] font-bold text-base-content/40 px-1 mt-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>
      )}

      {/* Control panel: Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-base-200/30 p-4 rounded-2xl border border-base-200/80">
        <div className="relative w-full md:max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, tags, or details..."
            className="input input-bordered w-full rounded-xl pl-10 text-xs focus:border-indigo-500 focus:outline-none bg-base-100"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Sorting */}
          <div className="flex items-center space-x-2 text-xs font-semibold w-full justify-end">
            <SlidersHorizontal size={14} className="text-base-content/50" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "size" | "name")}
              className="select select-bordered select-sm rounded-xl text-xs bg-base-100"
            >
              <option value="date">Newest Uploads</option>
              <option value="size">Largest File Size</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Media Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-base-200 p-5 space-y-4">
              <div className="aspect-video bg-base-300 rounded-xl" />
              <div className="h-4 bg-base-300 rounded w-2/3" />
              <div className="h-3 bg-base-300 rounded w-1/2" />
              <div className="h-10 bg-base-300 rounded-xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-12 border border-base-200 border-dashed rounded-2xl bg-base-200/5">
          <p className="text-sm font-semibold text-error mb-4">{error}</p>
          <button onClick={() => { setLoading(true); fetchVideos(); }} className="btn btn-outline btn-sm rounded-xl">
            Retry Loading
          </button>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center p-16 border border-base-200 border-dashed rounded-2xl bg-base-200/5">
          <FolderOpen size={48} className="mx-auto text-base-content/25 mb-4 animate-bounce" />
          <h3 className="text-base font-bold mb-1">No media assets found</h3>
          <p className="text-xs text-base-content/50 max-w-sm mx-auto mb-6">
            {searchQuery ? "Try refining your search keyword or clearing filters." : "Upload images and videos to start optimizing and monitoring vault analytics."}
          </p>
          {!searchQuery && (
            <Link href="/video-upload" className="btn btn-primary rounded-xl text-xs font-semibold px-6 shadow-md shadow-indigo-600/10">
              Upload Your First Asset
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <MediaCard
              key={video.id}
              video={video}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onEdit={(v) => setSelectedVideo(v)}
            />
          ))}
        </div>
      )}

      {selectedVideo && (
        <MediaDetailsModal 
          video={selectedVideo} 
          onClose={() => setSelectedVideo(null)} 
          onUpdate={handleUpdateVideo} 
        />
      )}
    </div>
  );
}
