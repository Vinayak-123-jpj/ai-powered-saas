"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  Folder, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  FolderOpen,
  FolderPlus,
  Compass,
  Download
} from "lucide-react";
import MediaCard from "@/components/MediaCard";
import MediaDetailsModal from "@/components/MediaDetailsModal";
import { Folder as FolderType, Video } from "@/types";

export default function CollectionsPage() {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFolderName, setNewFolderName] = useState("");
  const [activeFolder, setActiveFolder] = useState<FolderType | null>(null);
  
  // Modals editing
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");

  const fetchFolders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/folders");
      if (Array.isArray(res.data)) {
        setFolders(res.data);
        if (activeFolder) {
          const updatedActive = res.data.find((f: FolderType) => f.id === activeFolder.id);
          setActiveFolder(updatedActive || null);
        }
      }
    } catch (err) {
      console.error("Error fetching folders", err);
    } finally {
      setLoading(false);
    }
  }, [activeFolder]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const res = await axios.post("/api/folders", { name: newFolderName });
      setFolders((prev) => [...prev, { ...res.data, videos: [] }]);
      setNewFolderName("");
      alert(`Folder "${res.data.name}" created successfully.`);
    } catch (err) {
      console.error(err);
      alert("Failed to create folder.");
    }
  };

  const handleDeleteFolder = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete folder "${name}"? Files inside will be unassigned but NOT deleted.`)) return;

    try {
      await axios.delete(`/api/folders/${id}`);
      setFolders((prev) => prev.filter((f) => f.id !== id));
      if (activeFolder?.id === id) setActiveFolder(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete folder.");
    }
  };

  const handleStartRename = (folder: FolderType) => {
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
  };

  const handleRenameFolder = async (id: string) => {
    if (!editingFolderName.trim()) return;

    try {
      const res = await axios.patch(`/api/folders/${id}`, { name: editingFolderName });
      setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name: res.data.name } : f)));
      if (activeFolder?.id === id) {
        setActiveFolder((prev) => prev ? { ...prev, name: res.data.name } : null);
      }
      setEditingFolderId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to rename folder.");
    }
  };

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm("Delete this video permanently?")) return;
    try {
      await axios.delete(`/api/media/${videoId}`);
      fetchFolders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateVideo = () => {
    fetchFolders();
  };

  return (
    <div className="space-y-8 animate-fade-in text-sm">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Folders & Collections</h1>
        <p className="text-xs sm:text-sm text-base-content/65 mt-1">
          Group your optimized media files into custom directories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left pane: Folders list & creation */}
        <div className="lg:col-span-1 space-y-6">
          {/* Create Form */}
          <form onSubmit={handleCreateFolder} className="p-4 bg-base-200/20 border border-base-200 rounded-2xl space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center space-x-1.5">
              <FolderPlus size={14} className="text-indigo-500" />
              <span>Create Collection</span>
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g. Ad Campaigns"
                className="input input-bordered input-sm flex-1 rounded-xl text-xs bg-base-100 focus:outline-none"
              />
              <button type="submit" className="btn btn-primary btn-sm rounded-xl">
                <Plus size={16} />
              </button>
            </div>
          </form>

          {/* Folder List */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/50 px-2">Folders</h3>
            {loading && folders.length === 0 ? (
              <div className="space-y-2 p-2">
                <div className="h-10 bg-base-200 animate-pulse rounded-xl" />
                <div className="h-10 bg-base-200 animate-pulse rounded-xl" />
              </div>
            ) : folders.length === 0 ? (
              <div className="text-center p-6 text-xs text-base-content/40 italic">
                No custom folders created yet.
              </div>
            ) : (
              <div className="space-y-1.5">
                {folders.map((folder) => {
                  const isSelected = activeFolder?.id === folder.id;
                  const fileCount = folder.videos?.length || 0;

                  return (
                    <div 
                      key={folder.id}
                      onClick={() => setActiveFolder(folder)}
                      className={`group/item flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                        isSelected 
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                          : "bg-base-200/10 border-base-200 hover:bg-base-200/50"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                        <Folder className={`w-4.5 h-4.5 flex-shrink-0 ${isSelected ? "text-white" : "text-indigo-500"}`} />
                        {editingFolderId === folder.id ? (
                          <input 
                            type="text" 
                            value={editingFolderName}
                            onChange={(e) => setEditingFolderName(e.target.value)}
                            onBlur={() => handleRenameFolder(folder.id)}
                            onKeyDown={(e) => e.key === "Enter" && handleRenameFolder(folder.id)}
                            className="bg-base-300 text-xs rounded px-1.5 py-0.5 text-base-content focus:outline-none w-28"
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                          />
                        ) : (
                          <span className="font-bold text-xs truncate">{folder.name}</span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          isSelected ? "bg-white/20 text-white" : "bg-base-300/60 text-base-content/65"
                        }`}>
                          {fileCount}
                        </span>

                        {/* Inline controls */}
                        <div className="hidden group-hover/item:flex items-center space-x-0.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStartRename(folder); }}
                            className={`p-1 hover:bg-black/10 rounded ${isSelected ? "text-white" : "text-base-content/50"}`}
                          >
                            <Edit3 size={11} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id, folder.name); }}
                            className={`p-1 hover:bg-red-500/20 rounded ${isSelected ? "text-white" : "text-error/85"}`}
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right pane: Active Folder assets */}
        <div className="lg:col-span-3">
          {activeFolder ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-2.5 pb-4 border-b border-base-200">
                <FolderOpen className="w-6 h-6 text-indigo-500 animate-pulse" />
                <div>
                  <h2 className="text-xl font-extrabold">{activeFolder.name}</h2>
                  <p className="text-xs text-base-content/60 mt-0.5">
                    Viewing {activeFolder.videos?.length || 0} media assets in this collection.
                  </p>
                </div>
              </div>

              {activeFolder.videos && activeFolder.videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  {activeFolder.videos.map((video) => (
                    <MediaCard
                      key={video.id}
                      video={video}
                      onDownload={handleDownload}
                      onDelete={handleDeleteVideo}
                      onEdit={(v) => setSelectedVideo(v)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-base-200 border-dashed rounded-2xl bg-base-200/5">
                  <Compass size={40} className="mx-auto text-base-content/25 mb-3" />
                  <h3 className="font-bold text-sm mb-1">Folder is empty</h3>
                  <p className="text-xs text-base-content/50 max-w-xs mx-auto">
                    Open other vault items and click Customize (gear icon) to move them into the &ldquo;{activeFolder.name}&rdquo; folder.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-base-200 rounded-2xl bg-base-200/10 text-center p-8">
              <FolderOpen size={48} className="text-base-content/20 mb-3" />
              <h3 className="font-bold text-sm mb-1">No folder selected</h3>
              <p className="text-xs text-base-content/50 max-w-xs">
                Select an existing collection directory from the left sidebar panel or create a new collection to begin sorting.
              </p>
            </div>
          )}
        </div>
      </div>

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
