import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { 
  Sparkles, 
  Layers, 
  Zap, 
  Share2, 
  Shield, 
  ArrowRight, 
  Video, 
  Image as ImageIcon,
  BarChart3, 
  Lock,
  Compass,
  CheckCircle2,
  ChevronDown
} from "lucide-react";

export default async function LandingPage() {
  const { userId } = auth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[30%] left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30">
              <Compass className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              MediaPilot AI
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          <div className="flex items-center space-x-4">
            {userId ? (
              <Link 
                href="/home" 
                className="inline-flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link 
                  href="/sign-in" 
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up" 
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-indigo-400 text-xs font-semibold tracking-wide mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Introducing MediaPilot AI 1.0</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto mb-6 leading-[1.1] text-white">
          The Intelligent Hub for <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Media Management & AI Insights
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload, compress, organize, and transform your image and video assets seamlessly. Auto-tag metadata, generate custom AI summaries, and share globally in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link 
            href={userId ? "/home" : "/sign-up"} 
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 active:scale-95 transition-all flex items-center justify-center space-x-2 group"
          >
            <span>Start Uploading Free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#features" 
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 text-slate-300 font-medium rounded-xl hover:bg-slate-800 hover:text-white active:scale-95 transition-all flex items-center justify-center"
          >
            Explore Features
          </a>
        </div>

        {/* Dashboard Mockup Preview */}
        <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-800/80 bg-slate-950 p-2 shadow-2xl shadow-indigo-500/10">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 rounded-2xl" />
          <div className="rounded-xl border border-slate-900 overflow-hidden bg-slate-900/40 aspect-[1.8/1] relative flex flex-col">
            {/* Header mockup */}
            <div className="h-10 border-b border-slate-900 bg-slate-950 px-4 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="ml-4 font-mono">dashboard.mediapilot.ai</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-900 font-mono text-[10px]">Production</span>
            </div>
            
            {/* Body Mockup */}
            <div className="flex-1 p-6 grid grid-cols-4 gap-6 text-left text-slate-400">
              {/* Sidebar Mockup */}
              <div className="col-span-1 border-r border-slate-900/60 pr-4 space-y-4 text-xs font-medium">
                <div className="h-8 rounded bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center px-3 space-x-2">
                  <Layers className="w-4 h-4" />
                  <span>Media Vault</span>
                </div>
                <div className="flex items-center px-3 py-2 space-x-2 hover:bg-slate-900 rounded transition-colors">
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span>Social Cropper</span>
                </div>
                <div className="flex items-center px-3 py-2 space-x-2 hover:bg-slate-900 rounded transition-colors">
                  <BarChart3 className="w-4 h-4 text-slate-500" />
                  <span>Analytics</span>
                </div>
              </div>

              {/* Main Content Mockup */}
              <div className="col-span-3 space-y-6">
                {/* Stats Mockup */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/40">
                    <div className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-1">Assets Optimized</div>
                    <div className="text-xl font-bold text-white">412</div>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/40">
                    <div className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-1">Compression Rate</div>
                    <div className="text-xl font-bold text-emerald-400">76.4%</div>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/40">
                    <div className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-1">Storage Saved</div>
                    <div className="text-xl font-bold text-white">1.84 GB</div>
                  </div>
                </div>

                {/* Grid Mockup */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950/40">
                    <div className="aspect-video bg-slate-900 relative flex items-center justify-center">
                      <Video className="w-8 h-8 text-indigo-500/40 animate-pulse" />
                    </div>
                    <div className="p-3 text-xs">
                      <div className="font-semibold text-white truncate">product_demo_compressed.mp4</div>
                      <div className="text-slate-500 text-[10px] mt-0.5">Auto AI tags: Demo, Product, SaaS</div>
                    </div>
                  </div>
                  <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950/40">
                    <div className="aspect-video bg-slate-900 relative flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-purple-500/40 animate-pulse" />
                    </div>
                    <div className="p-3 text-xs">
                      <div className="font-semibold text-white truncate">banner_instagram_square.png</div>
                      <div className="text-slate-500 text-[10px] mt-0.5">Auto AI tags: Instagram, Marketing</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-900/60 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Everything you need for media operations
          </h2>
          <p className="text-slate-400">
            A complete command center designed for modern web applications, social creators, and content managers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-2xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">AI-Powered Insights</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Auto-generate metadata (title, summary, tags) upon file upload. Instantly categorize your content for fast discovery.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="7.5 text-lg font-bold mb-2 text-white">Lossless Optimization</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automated image and video compression down to a fraction of the size without compromise, using advanced codecs.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Universal Social Cropper</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Resize and crop images on the fly with pre-defined layouts for Instagram, X (Twitter), Facebook, and LinkedIn.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-8 rounded-2xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-pink-600/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Smart Folders</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Organize your assets into custom directories. Tag, favorite, and filter to keep massive media libraries structured.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-8 rounded-2xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Secure Public Sharing</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Create sharing links and auto-generate download QR codes. Retain full access control, deleting or renaming at will.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-8 rounded-2xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-yellow-600/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Operational Analytics</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Monitor storage metrics, bandwidth saved, crop statistics, and track your upload velocity with visual dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-900/60 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Simple, transparent pricing</h2>
          <p className="text-slate-400">Choose the perfect plan for your personal projects or scaling production teams.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="p-8 rounded-2xl border border-slate-900 bg-slate-950/40 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Hobby</h3>
              <p className="text-sm text-slate-400 mb-6">Perfect for individual developers and creators.</p>
              <div className="flex items-baseline space-x-1 mb-8">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-slate-500 text-sm">/ month</span>
              </div>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                  <span>Up to 100 MB max file size</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                  <span>Basic Image Resizing & Crops</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                  <span>Public link generation</span>
                </li>
                <li className="flex items-center space-x-3 text-slate-500">
                  <Lock className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span>AI Autotags & Summaries</span>
                </li>
              </ul>
            </div>
            <Link 
              href={userId ? "/home" : "/sign-up"} 
              className="mt-8 w-full py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-xl text-sm font-semibold transition-all text-center block"
            >
              Get Started
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="p-8 rounded-2xl border-2 border-indigo-500 bg-slate-950 shadow-xl shadow-indigo-500/5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-bl-xl">
              Recommended
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Pro Pilot</h3>
              <p className="text-sm text-indigo-200/60 mb-6">Designed for professional content workflows.</p>
              <div className="flex items-baseline space-x-1 mb-8">
                <span className="text-4xl font-extrabold text-white">$19</span>
                <span className="text-slate-500 text-sm">/ month</span>
              </div>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <span>Up to 1 GB max file size</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <span>Automated AI metadata generation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <span>Unlimited folders & smart collections</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <span>Share QR codes & secure public access</span>
                </li>
              </ul>
            </div>
            <Link 
              href={userId ? "/home" : "/sign-up"} 
              className="mt-8 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all text-center block shadow-lg shadow-indigo-600/30"
            >
              Go Pro Now
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-24 border-t border-slate-900/60">
        <h2 className="text-3xl font-bold mb-12 text-center text-white">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-slate-900 bg-slate-950/40">
            <h3 className="text-base font-bold text-white mb-2">How does the AI metadata tagging work?</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              When you upload images or videos, our contextual analysis pipeline extracts parameters such as dimensions, duration, format, and filename tags. We then call an LLM helper to structure a readable title, complete summary, and a list of categorized searchable tags.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-900 bg-slate-950/40">
            <h3 className="text-base font-bold text-white mb-2">Can I delete files and remove sharing links permanently?</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Yes. When you delete a media file inside your dashboard, it is immediately deleted from both the database and the remote Cloudinary storage server. All generated public URLs and QR codes will instantly break and cease to resolve.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-900 bg-slate-950/40">
            <h3 className="text-base font-bold text-white mb-2">Are my uploads private by default?</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Absolutely. Everything you upload is private and securely tied to your Clerk credentials. Sharing is completely optional, and assets are only shared publicly when you explicitly click to generate sharing configurations.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-lg mx-auto px-6 py-24 border-t border-slate-900/60">
        <h2 className="text-3xl font-bold mb-4 text-center text-white">Get in Touch</h2>
        <p className="text-sm text-slate-400 text-center mb-8">Have questions, feedback, or custom integration needs? Let us know!</p>
        
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
              placeholder="Your Name"
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
              placeholder="you@domain.com"
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Message</label>
            <textarea 
              rows={4}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
              placeholder="How can we help?"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 active:scale-95"
            onClick={(e) => {
              e.preventDefault();
              alert("Thank you! Your message has been sent successfully.");
            }}
          >
            Send Message
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900/60 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <div>&copy; 2026 MediaPilot AI. All rights reserved. Built for production media workflows.</div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Security Details</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
