"use client";

import React, { useState, useEffect, useRef } from "react";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { 
  Upload, 
  Image as ImageIcon, 
  Download, 
  Sliders, 
  Crop,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  X
} from "lucide-react";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file.");
      return;
    }
    // Max 10MB for images
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size exceeds the 10 MB limit.");
      return;
    }

    setIsUploading(true);
    setFileName(file.name);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (err) {
      console.error(err);
      setError("Failed to upload image. Please verify your credentials.");
      setUploadedImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!uploadedImage) return;

    const imageUrl = getCldImageUrl({
      src: uploadedImage,
      width: socialFormats[selectedFormat].width,
      height: socialFormats[selectedFormat].height,
      crop: "fill",
      aspectRatio: socialFormats[selectedFormat].aspectRatio,
      gravity: "auto",
    });

    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => console.error("Error downloading image:", err));
  };

  const removeImage = () => {
    setUploadedImage(null);
    setFileName("");
    setError(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-sm">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Social Share Studio</h1>
        <p className="text-xs sm:text-sm text-base-content/65 mt-1">
          Crop and resize your marketing images for social platforms automatically using Cloudinary AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: upload controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl border border-base-200 bg-base-200/20 backdrop-blur-sm space-y-6 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/60 flex items-center space-x-1.5">
              <Sliders size={14} className="text-indigo-500" />
              <span>Crops Settings</span>
            </h3>

            {/* Dropzone */}
            {!uploadedImage ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer min-h-[160px] flex flex-col items-center justify-center transition-all ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-500/5"
                    : "border-base-300 hover:border-indigo-500/40 hover:bg-base-200/20"
                } ${isUploading ? "pointer-events-none opacity-65" : ""}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  disabled={isUploading}
                />
                
                {isUploading ? (
                  <div className="space-y-2">
                    <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
                    <span className="text-xs font-bold text-base-content/65 block">Uploading source...</span>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <Upload className="w-6 h-6 text-base-content/40 mx-auto" />
                    <div>
                      <span className="font-bold text-xs text-indigo-500 block hover:text-indigo-400">Click to select</span>
                      <span className="text-[10px] text-base-content/50 font-semibold block mt-0.5">Or drag and drop</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-base-200 bg-base-200/40 flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <ImageIcon className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="font-bold text-xs truncate max-w-[120px]">{fileName}</span>
                </div>
                <button
                  onClick={removeImage}
                  className="p-1 hover:bg-base-300 rounded text-base-content/50 hover:text-base-content"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-xl border border-error/25 bg-error/5 text-error flex items-start space-x-2 text-xs font-semibold">
                <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Selector */}
            {uploadedImage && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-base-content/50">Target Layout</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
                  className="select select-bordered select-sm w-full rounded-xl text-xs bg-base-100"
                >
                  {Object.keys(socialFormats).map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>

                <div className="pt-4">
                  <button
                    onClick={handleDownload}
                    className="btn btn-primary w-full rounded-xl flex items-center justify-center space-x-1.5 font-bold shadow-lg shadow-indigo-600/15"
                  >
                    <Download size={14} />
                    <span>Download Crop</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: visual preview panel */}
        <div className="lg:col-span-2">
          {uploadedImage ? (
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/50 px-1 flex items-center space-x-1.5">
                <Crop size={14} />
                <span>Live Aspect Ratio Preview</span>
              </h3>

              <div className="relative rounded-2xl border border-base-200 bg-base-200/20 backdrop-blur-sm overflow-hidden flex items-center justify-center p-6 min-h-[300px]">
                {isTransforming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-base-100/60 backdrop-blur-xs z-10">
                    <Loader text="Rendering layout..." />
                  </div>
                )}
                
                <div className="max-w-full max-h-[400px] shadow-2xl rounded-xl overflow-hidden border border-base-300">
                  <CldImage
                    width={socialFormats[selectedFormat].width}
                    height={socialFormats[selectedFormat].height}
                    src={uploadedImage}
                    sizes="100vw"
                    alt="Transformed marketing crop"
                    crop="fill"
                    aspectRatio={socialFormats[selectedFormat].aspectRatio}
                    gravity="auto"
                    onLoad={() => setIsTransforming(false)}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-base-200 rounded-2xl bg-base-200/10 text-center p-8">
              <ImageIcon size={44} className="text-base-content/20 mb-3 animate-pulse" />
              <h3 className="font-bold text-sm mb-1">No source image uploaded</h3>
              <p className="text-xs text-base-content/50 max-w-xs">
                Select or drop a marketing banner image in the setup panel to preview the Cloudinary AI automatic crops.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple loader wrapper
function Loader({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <RefreshCw className="w-7 h-7 text-indigo-500 animate-spin" />
      <span className="text-xs font-bold text-base-content/75">{text}</span>
    </div>
  );
}
