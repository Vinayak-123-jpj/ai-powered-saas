import prisma from "@/lib/prisma";
import { getCldVideoUrl } from "next-cloudinary";
import { Clock, Shield, Compass, FileVideo, Download, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { filesize } from "filesize";

export const dynamic = "force-dynamic";

interface SharePageProps {
  params: { id: string };
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = params;

  // Fetch asset details
  const video = await prisma.video.findUnique({
    where: { id },
  });

  if (!video) {
    notFound();
  }

  // Check access permissions
  const isExpired = video.shareExpiresAt && new Date(video.shareExpiresAt) < new Date();
  const isPublic = video.publicShare;

  if (!isPublic || isExpired) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-500 mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-white">Public Access Expired</h1>
        <p className="text-sm text-slate-400 max-w-sm mt-2 leading-relaxed">
          The owner has deactivated public sharing for this link, or the secure access window has expired.
        </p>
        <Link 
          href="/" 
          className="mt-8 px-6 py-2.5 bg-slate-900 border border-slate-800 text-sm font-semibold rounded-xl hover:bg-slate-800 text-white transition-colors"
        >
          Return to Landing Page
        </Link>
      </div>
    );
  }

  const getFullVideoUrl = (publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 1920,
      height: 1080,
    });
  };

  const compressionPercentage = video.originalSize && Number(video.originalSize) > 0
    ? Math.round((1 - Number(video.compressedSize) / Number(video.originalSize)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900/60 bg-slate-950/40 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow shadow-indigo-600/20">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">MediaPilot AI Share</span>
          </div>

          <Link 
            href="/" 
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
          >
            Create Your Account
          </Link>
        </div>
      </header>

      {/* Main player area */}
      <main className="max-w-4xl mx-auto w-full px-6 py-12 flex-grow space-y-8">
        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-sm overflow-hidden shadow-2xl">
          {/* Player */}
          <div className="aspect-video bg-black relative">
            <video 
              src={getFullVideoUrl(video.publicId)}
              controls
              className="w-full h-full object-contain"
              autoPlay
              muted
            />
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">{video.title}</h1>
                <span className="badge badge-primary text-[9px] font-extrabold uppercase py-2 px-2.5 rounded-lg tracking-wider mt-2.5">
                  {video.category || "General"}
                </span>
              </div>

              <a 
                href={getFullVideoUrl(video.publicId)}
                download={`${video.title}.mp4`}
                target="_blank"
                className="btn btn-primary btn-sm rounded-xl px-5 flex items-center space-x-1.5 shadow shadow-indigo-600/15"
              >
                <Download size={14} />
                <span className="text-xs font-bold">Download File</span>
              </a>
            </div>

            {/* AI Summary */}
            {video.summary && (
              <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/10 space-y-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Asset Summary</div>
                <p className="text-sm leading-relaxed text-slate-300 italic">
                  &ldquo;{video.summary}&rdquo;
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-900">
              {/* Specs */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">File Specifications</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Original Size</span>
                    <span className="font-bold text-white mt-0.5 block">{filesize(Number(video.originalSize))}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Optimized Size</span>
                    <span className="font-bold text-emerald-400 mt-0.5 block">
                      {filesize(Number(video.compressedSize))} ({compressionPercentage}% Saved)
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Indexed Tags</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {video.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/60 bg-slate-950 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-xs text-slate-500">
          Powered by MediaPilot AI Secure Link sharing. All optimized streams run over SSL.
        </div>
      </footer>
    </div>
  );
}
