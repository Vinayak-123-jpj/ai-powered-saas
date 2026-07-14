"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { 
  X, 
  Sparkles, 
  Share2, 
  Folder, 
  Star, 
  Calendar, 
  Copy, 
  Check, 
  Download, 
  Tags,
  QrCode,
  AlertTriangle
} from "lucide-react";
import { Video, Folder as FolderType } from "@/types";

interface MediaDetailsModalProps {
  video: Video;
  onClose: () => void;
  onUpdate: (updatedVideo: Video) => void;
}

export default function MediaDetailsModal({ video, onClose, onUpdate }: MediaDetailsModalProps) {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [copied, setCopied] = useState(false);

  // Editable fields
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description || "");
  const [summary, setSummary] = useState(video.summary || "");
  const [category, setCategory] = useState(video.category || "General");
  const [tags, setTags] = useState<string[]>(video.tags || []);
  const [newTag, setNewTag] = useState("");
  const [folderId, setFolderId] = useState<string>(video.folderId || "");
  const [isFavorite, setIsFavorite] = useState(video.isFavorite);
  const [publicShare, setPublicShare] = useState(video.publicShare);
  const [shareExpiresAt, setShareExpiresAt] = useState(
    video.shareExpiresAt ? new Date(video.shareExpiresAt).toISOString().split("T")[0] : ""
  );

  useEffect(() => {
    // Fetch folders
    axios.get("/api/folders").then((res) => {
      if (Array.isArray(res.data)) {
        setFolders(res.data);
      }
    }).catch(err => console.error("Error fetching folders", err));
  }, []);

  const handleSave = async () => {
    try {
      const response = await axios.patch(`/api/media/${video.id}`, {
        title,
        description,
        summary,
        category,
        tags,
        folderId: folderId || null,
        isFavorite,
        publicShare,
        shareExpiresAt: shareExpiresAt ? new Date(shareExpiresAt).toISOString() : null,
      });
      onUpdate(response.data);
      alert("Asset metadata saved successfully.");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleRegenerateAI = async () => {
    setLoadingAI(true);
    try {
      const response = await axios.post("/api/ai/generate", {
        title: video.title.replace(" (AI Opt)", ""),
        description: description,
      });
      const { title: aiTitle, summary: aiSummary, category: aiCategory, tags: aiTags } = response.data;
      setTitle(aiTitle);
      setSummary(aiSummary);
      setCategory(aiCategory);
      setTags(aiTags);
    } catch (err) {
      console.error(err);
      alert("Failed to generate metadata via AI. Please check server.");
    } finally {
      setLoadingAI(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Generate public sharing link
  const shareLink = typeof window !== "undefined" 
    ? `${window.location.origin}/share/${video.id}` 
    : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareLink)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-base-100 border border-base-200 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-base-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Folder className="w-5 h-5 text-indigo-500" />
            <h2 className="font-extrabold text-base sm:text-lg">Media Customization Panel</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-base-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-grow p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {/* Left Column: Properties & Editing */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1">Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="input input-bordered w-full rounded-xl text-xs bg-base-200/40 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1">Description</label>
              <textarea 
                rows={2} 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="textarea textarea-bordered w-full rounded-xl text-xs bg-base-200/40 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Folder Selection & Favorite */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1">Folder Collection</label>
                <select 
                  value={folderId} 
                  onChange={(e) => setFolderId(e.target.value)} 
                  className="select select-bordered select-sm w-full rounded-xl text-xs bg-base-200/40"
                >
                  <option value="">Unassigned</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1.5">Quick Actions</label>
                <button 
                  onClick={toggleFavorite}
                  className={`btn btn-sm w-full rounded-xl flex items-center justify-center space-x-1.5 ${
                    isFavorite 
                      ? "btn-accent text-accent-content border-none" 
                      : "btn-outline btn-base-content"
                  }`}
                >
                  <Star size={14} className={isFavorite ? "fill-current" : ""} />
                  <span>{isFavorite ? "Starred" : "Star Asset"}</span>
                </button>
              </div>
            </div>

            {/* AI Generator Panel */}
            <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-500 flex items-center space-x-1.5">
                  <Sparkles size={14} />
                  <span>MediaPilot AI Assistant</span>
                </span>
                <button
                  onClick={handleRegenerateAI}
                  className="btn btn-primary btn-xs rounded-lg"
                  disabled={loadingAI}
                >
                  {loadingAI ? "Optimizing..." : "Regenerate AI Details"}
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-base-content/40 uppercase">AI Category</div>
                <div className="text-xs font-semibold text-base-content">{category}</div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-base-content/40 uppercase">AI Summary</div>
                <p className="text-xs leading-relaxed text-base-content/70 italic">
                  {summary || "Generate metadata to review the AI summary timeline."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Tags & Public Sharing */}
          <div className="space-y-5">
            {/* Tags Box */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-base-content/50">Media Tags</label>
              
              <div className="flex flex-wrap gap-1.5 min-h-[48px] p-3 rounded-xl border border-base-200 bg-base-200/20">
                {tags.length === 0 ? (
                  <span className="text-xs text-base-content/40 italic">No tags associated.</span>
                ) : (
                  tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="badge badge-primary rounded-lg text-[10px] font-bold flex items-center space-x-1 py-2"
                    >
                      <span>{tag}</span>
                      <X size={10} className="cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                    </span>
                  ))
                )}
              </div>

              <form onSubmit={handleAddTag} className="flex gap-2">
                <input 
                  type="text" 
                  value={newTag} 
                  onChange={(e) => setNewTag(e.target.value)} 
                  placeholder="Add custom tag..."
                  className="input input-bordered input-sm flex-1 rounded-xl text-xs bg-base-200/40 focus:outline-none"
                />
                <button type="submit" className="btn btn-sm rounded-xl px-4">Add</button>
              </form>
            </div>

            {/* Public Sharing Panel */}
            <div className="p-4 rounded-xl border border-base-200 bg-base-200/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center space-x-1.5">
                  <Share2 size={14} className="text-indigo-500" />
                  <span>Public Link Config</span>
                </span>
                <input 
                  type="checkbox" 
                  checked={publicShare} 
                  onChange={(e) => setPublicShare(e.target.checked)} 
                  className="toggle toggle-primary toggle-sm"
                />
              </div>

              {publicShare && (
                <div className="space-y-4 animate-fade-in">
                  {/* Share Link */}
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={shareLink} 
                      className="input input-bordered input-sm flex-1 rounded-xl text-xs bg-base-300 font-mono"
                    />
                    <button 
                      onClick={copyToClipboard}
                      className="btn btn-square btn-sm rounded-xl"
                      title="Copy Public Link"
                    >
                      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>

                  {/* Expiration Date */}
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="text-xs text-base-content/60 flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>Link Expiration:</span>
                    </div>
                    <input 
                      type="date" 
                      value={shareExpiresAt} 
                      onChange={(e) => setShareExpiresAt(e.target.value)} 
                      className="input input-bordered input-sm rounded-xl text-xs bg-base-100"
                    />
                  </div>

                  {/* QR Code and warning */}
                  <div className="flex items-center space-x-4 p-3 rounded-xl bg-base-300/40 border border-base-300/30">
                    <Image 
                      src={qrCodeUrl} 
                      alt="Share QR Code" 
                      width={80}
                      height={80}
                      className="bg-white p-1 rounded-lg shadow border border-base-200" 
                    />
                    <div>
                      <div className="text-xs font-bold text-base-content flex items-center space-x-1">
                        <QrCode size={12} />
                        <span>Dynamic QR Scan</span>
                      </div>
                      <p className="text-[10px] text-base-content/55 mt-1 leading-relaxed">
                        Scanning redirectors will point scanner browsers directly to the custom shared player view.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-base-200 flex justify-end space-x-2.5">
          <button 
            onClick={onClose} 
            className="btn btn-outline btn-sm rounded-xl"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="btn btn-primary btn-sm rounded-xl px-6 shadow-md shadow-indigo-600/10"
          >
            Save Options
          </button>
        </div>
      </div>
    </div>
  );
}
