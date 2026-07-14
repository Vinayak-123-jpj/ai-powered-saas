"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Star, Compass, FolderOpen } from "lucide-react";
import MediaCard from "@/components/MediaCard";
import MediaDetailsModal from "@/components/MediaDetailsModal";
import { Video } from "@/types";

export default function FavoritesPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;
    try {
      await axios.delete(`/api/media/${id}`);
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateVideo = (updatedVideo: Video) => {
    setVideos((prev) => prev.map((v) => (v.id === updatedVideo.id ? updatedVideo : v)));
  };

  const favoriteVideos = videos.filter((v) => v.isFavorite);

  return (
    <div className="space-y-8 animate-fade-in text-sm">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center space-x-2.5">
          <Star className="w-8 h-8 text-amber-400 fill-current" />
          <span>Favorites</span>
        </h1>
        <p className="text-xs sm:text-sm text-base-content/65 mt-1">
          Review, download, and share your starred media assets.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-base-200 p-5 space-y-4">
              <div className="aspect-video bg-base-300 rounded-xl" />
              <div className="h-4 bg-base-300 rounded w-2/3" />
              <div className="h-10 bg-base-300 rounded-xl" />
            </div>
          ))}
        </div>
      ) : favoriteVideos.length === 0 ? (
        <div className="text-center p-16 border border-base-200 border-dashed rounded-2xl bg-base-200/5">
          <Star size={44} className="mx-auto text-base-content/25 mb-4" />
          <h3 className="text-base font-bold mb-1">No starred items</h3>
          <p className="text-xs text-base-content/50 max-w-sm mx-auto">
            Click the Customize button (gear icon) on any media card to favorite and star items for quick lookup here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {favoriteVideos.map((video) => (
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
