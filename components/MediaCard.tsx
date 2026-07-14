"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { 
  Download, 
  Clock, 
  FileDown, 
  FileUp, 
  Sparkles, 
  Eye,
  Trash2,
  ExternalLink,
  SlidersHorizontal
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";
import { Video } from "@/types";

dayjs.extend(relativeTime);

interface MediaCardProps {
  video: Video;
  onDownload: (url: string, title: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (video: Video) => void;
}

export default function MediaCard({ video, onDownload, onDelete, onEdit }: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const getThumbnailUrl = useCallback((publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 400,
      height: 225,
      crop: "fill",
      gravity: "auto",
      format: "jpg",
      quality: "auto",
      assetType: "video",
    });
  }, []);

  const getFullVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 1920,
      height: 1080,
    });
  }, []);

  const getPreviewVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 400,
      height: 225,
      rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"],
    });
  }, []);

  const formatSize = useCallback((size: number) => {
    return filesize(size);
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const compressionPercentage = video.originalSize && Number(video.originalSize) > 0
    ? Math.round((1 - Number(video.compressedSize) / Number(video.originalSize)) * 100)
    : 0;

  useEffect(() => {
    setPreviewError(false);
  }, [isHovered]);

  return (
    <div
      className="group relative rounded-2xl border border-base-200 bg-base-200/20 backdrop-blur-sm overflow-hidden hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* Media Preview Container */}
        <figure className="aspect-video relative overflow-hidden bg-base-300">
          {isHovered ? (
            previewError ? (
              <div className="w-full h-full flex items-center justify-center bg-base-300 text-xs font-semibold text-error">
                Preview not available
              </div>
            ) : (
              <video
                src={getPreviewVideoUrl(video.publicId)}
                autoPlay
                muted
                loop
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={() => setPreviewError(true)}
              />
            )
          ) : (
            <Image
              src={getThumbnailUrl(video.publicId)}
              alt={video.title}
              width={400}
              height={225}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}

          {/* Badge: Duration */}
          <div className="absolute bottom-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center space-x-1">
            <Clock size={10} />
            <span>{formatDuration(video.duration)}</span>
          </div>

          {/* Badge: AI Metadata Status */}
          <div className="absolute top-2.5 left-2.5 bg-indigo-600/90 text-white px-2 py-0.5 rounded-lg text-[10px] font-extrabold tracking-wider uppercase flex items-center space-x-1 shadow-md">
            <Sparkles size={10} />
            <span>AI Opt</span>
          </div>
        </figure>

        {/* Media Details */}
        <div className="p-5">
          <h3 className="font-bold text-base text-base-content leading-snug truncate mb-1" title={video.title}>
            {video.title}
          </h3>
          <p className="text-xs text-base-content/60 line-clamp-2 min-h-[32px] mb-3 leading-relaxed">
            {video.description || "No description provided."}
          </p>

          <div className="flex items-center text-[10px] font-semibold text-base-content/40 mb-4">
            <span>Uploaded {dayjs(video.createdAt).fromNow()}</span>
          </div>

          {/* Storage Specs */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-base-300/40 border border-base-300/30 text-xs font-semibold">
            <div className="flex items-center space-x-2 text-base-content/75">
              <FileUp size={14} className="text-indigo-500" />
              <div>
                <div className="text-[9px] text-base-content/45 font-bold uppercase">Original</div>
                <div>{formatSize(Number(video.originalSize))}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-base-content/75">
              <FileDown size={14} className="text-purple-500" />
              <div>
                <div className="text-[9px] text-base-content/45 font-bold uppercase">Optimized</div>
                <div>{formatSize(Number(video.compressedSize))}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-base-200/50 bg-base-200/10">
        <div className="text-xs font-bold">
          <span className="text-base-content/50">Saved: </span>
          <span className="text-emerald-500">
            {compressionPercentage > 0 ? `${compressionPercentage}%` : "0%"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(video)}
              className="btn btn-ghost btn-square btn-sm rounded-lg text-base-content/80 hover:bg-base-300"
              title="Edit Details & Share"
            >
              <SlidersHorizontal size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(video.id)}
              className="btn btn-ghost btn-square btn-sm rounded-lg text-error/80 hover:text-error hover:bg-error/10"
              title="Delete Video"
            >
              <Trash2 size={15} />
            </button>
          )}
          <button
            className="btn btn-primary btn-sm rounded-xl flex items-center space-x-1 px-3"
            onClick={() =>
              onDownload(getFullVideoUrl(video.publicId), video.title)
            }
          >
            <Download size={14} />
            <span className="text-xs font-bold">Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}
