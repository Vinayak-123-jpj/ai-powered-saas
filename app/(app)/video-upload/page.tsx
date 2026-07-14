"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  Upload, 
  File, 
  CheckCircle, 
  AlertTriangle,
  X, 
  Sparkles,
  Loader2,
  Trash2
} from "lucide-react";

interface UploadQueueItem {
  file: File;
  progress: number;
  status: "queued" | "uploading" | "success" | "error";
  errorMsg?: string;
}

export default function VideoUpload() {
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Max size: 70MB
  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      addFilesToQueue(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFilesToQueue(Array.from(e.target.files));
    }
  };

  const addFilesToQueue = (newFiles: File[]) => {
    setGlobalError(null);
    const validItems: UploadQueueItem[] = [];

    newFiles.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        setGlobalError(`Some files were skipped because they exceed the 70MB limit.`);
        return;
      }
      if (!file.type.startsWith("video/")) {
        setGlobalError(`Some files were skipped because they are not video files.`);
        return;
      }
      // Avoid duplicate file names in same upload session
      if (queue.some((item) => item.file.name === file.name)) return;

      validItems.push({
        file,
        progress: 0,
        status: "queued"
      });
    });

    setQueue((prev) => [...prev, ...validItems]);
  };

  const removeQueueItem = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (queue.length === 0 || isUploading) return;

    setIsUploading(true);
    setGlobalError(null);

    // Upload items sequentially
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      if (item.status === "success") continue;

      // Set status to uploading
      setQueue((prev) => {
        const copy = [...prev];
        copy[i].status = "uploading";
        copy[i].progress = 10;
        return copy;
      });

      const formData = new FormData();
      formData.append("file", item.file);
      formData.append("title", item.file.name.split(".").slice(0, -1).join(".").replace(/[_-]/g, " "));
      formData.append("description", description || `Batch uploaded asset`);
      formData.append("originalSize", item.file.size.toString());

      try {
        // Mock ticking progress
        const interval = setInterval(() => {
          setQueue((prev) => {
            const copy = [...prev];
            if (copy[i].progress < 85) {
              copy[i].progress += 10;
            }
            return copy;
          });
        }, 200);

        await axios.post("/api/video-upload", formData);
        
        clearInterval(interval);
        setQueue((prev) => {
          const copy = [...prev];
          copy[i].status = "success";
          copy[i].progress = 100;
          return copy;
        });
      } catch (err) {
        console.error(err);
        setQueue((prev) => {
          const copy = [...prev];
          copy[i].status = "error";
          copy[i].progress = 0;
          copy[i].errorMsg = "Failed to upload to Cloudinary storage.";
          return copy;
        });
      }
    }

    setIsUploading(false);
    
    // Check if any error occurred. If not, redirect to vault
    const hasError = queue.some((item) => item.status === "error");
    if (!hasError) {
      setTimeout(() => {
        router.push("/home");
      }, 1000);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "uploading":
        return <span className="text-[10px] text-indigo-500 font-bold animate-pulse">Uploading...</span>;
      case "success":
        return <span className="text-[10px] text-emerald-500 font-bold">Completed</span>;
      case "error":
        return <span className="text-[10px] text-error font-bold">Failed</span>;
      default:
        return <span className="text-[10px] text-base-content/40 font-bold">Queued</span>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in text-sm">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Batch Upload Pilot</h1>
        <p className="text-xs sm:text-sm text-base-content/65 mt-1">
          Upload multiple video files simultaneously. Filenames will be parsed to construct searchable media titles automatically.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={isUploading ? undefined : triggerFileInput}
          className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[180px] ${
            dragActive 
              ? "border-indigo-500 bg-indigo-500/5" 
              : "border-base-300 hover:border-indigo-500/40 hover:bg-base-200/20"
          } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isUploading}
          />

          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 rounded-xl bg-base-300 flex items-center justify-center text-base-content/50">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-sm text-indigo-500 hover:text-indigo-400">Click to select files</span>
              <span className="text-sm text-base-content/60"> or drag and drop</span>
            </div>
            <p className="text-[10px] text-base-content/40 font-semibold uppercase tracking-wider">
              Multiple video files up to 70 MB each
            </p>
          </div>
        </div>

        {globalError && (
          <div className="p-4 rounded-xl border border-error/20 bg-error/5 text-error flex items-start space-x-3 text-xs font-semibold">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div>{globalError}</div>
          </div>
        )}

        {/* Upload Queue List */}
        {queue.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/50 px-1">Upload Queue ({queue.length})</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {queue.map((item, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl border border-base-200 bg-base-200/20 flex flex-col space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <File className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span className="font-bold text-xs truncate max-w-xs sm:max-w-md">{item.file.name}</span>
                      <span className="text-[10px] text-base-content/40 font-semibold">
                        ({(item.file.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      {getStatusBadge(item.status)}
                      {!isUploading && item.status !== "success" && (
                        <button
                          type="button"
                          onClick={() => removeQueueItem(index)}
                          className="text-error/70 hover:text-error"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  {item.status === "uploading" && (
                    <div className="w-full bg-base-300 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}

                  {item.errorMsg && (
                    <div className="text-[10px] font-bold text-error flex items-center space-x-1">
                      <AlertTriangle size={11} />
                      <span>{item.errorMsg}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global inputs */}
        {queue.length > 0 && (
          <div>
            <label className="label py-1">
              <span className="text-xs font-bold uppercase tracking-wider text-base-content/50">Shared Batch Description (Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full rounded-xl text-xs bg-base-200/40 focus:border-indigo-500 focus:outline-none min-h-[80px]"
              placeholder="Provide descriptions applied to all uploaded assets..."
              disabled={isUploading}
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary w-full rounded-xl flex items-center justify-center space-x-2 font-bold shadow-lg shadow-indigo-600/15"
          disabled={isUploading || queue.length === 0}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading Queue sequentially...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Pilot Upload Queue</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
