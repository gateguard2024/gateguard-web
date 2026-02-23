import React from 'react';

/**
 * GateGuard Main Landing Page
 * Clean, modular structure for Next.js 15+
 */
export default function Home() {
  return (
    <main className="bg-zinc-950 text-white min-h-screen selection:bg-cyan-500/30">
      
      {/* 1. HERO SECTION: The "Hook" */}
      <section className="relative pt-20 pb-32 flex items-center overflow-hidden">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left: Value Proposition */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider uppercase bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400">
                The New Standard in Access Control
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                The Gate is Old. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                  The Solution is Intelligent.
                </span>
              </h1>
              <p className="text-zinc-400 text-lg lg:text-xl mb-10 max-w-2xl">
                Replace outdated fobs and expensive guards with an AI-driven ecosystem. 
                Sub-second latency. Total community autonomy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-all transform hover:scale-105">
                  Book a Live Demo
                </button>
                <button className="px-8 py-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold rounded-lg transition-all">
                  View ROI Calculator
                </button>
              </div>
            </div>

            {/* Right: Visual Placeholder */}
            <div className="flex-1 relative w-full max-w-xl lg:max-w-none">
               <div className="w-full aspect-square bg-zinc-900/50 border border-zinc-800 rounded-3xl flex items-center justify-center backdrop-blur-3xl shadow-2xl relative">
                  {/* Internal Glow */}
                  <div className="absolute inset-0 bg-cyan-500/5 rounded-3xl" />
                  <div className="text-center relative z-10">
                     <div className="text-7xl mb-4 drop-shadow-2xl">🔒</div>
                     <p className="text-zinc-500 italic font-mono tracking-widest text-sm">GateGuard Systems Active</p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRUST BAR: Authority Building */}
      <section className="py-12 border-y border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <p className="text-center text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mb-10">
            Trusted by Modern Communities
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 hover:opacity-100 transition-opacity duration-700">
            {['HOA MANAGERS', 'MULTI-FAMILY', 'GATED ESTATES', 'COMMERCIAL HUB', 'STORAGE DEPOT'].map((industry) => (
              <span key={industry} className="text-sm md:text-lg font-black text-white tracking-tighter">
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURE GRID: How it Works */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* AI Recognition */}
            <div className="group p-10 rounded-3xl bg-zinc-900/30 border border-zinc-800 hover:border-cyan-500/30 transition-all duration-500">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">🤖</div>
              <h3 className="text-xl font-bold mb-4">AI Plate Recognition</h3>
              <p className="text-zinc-400 leading-relaxed italic">
                "Our edge-AI identifies residents and authorized guests instantly. No fobs required."
              </p>
            </div>

            {/* Mobile Control */}
            <div className="group p-10 rounded-3xl bg-zinc-900/30 border border-zinc-800 hover:border-emerald-500/30 transition-all duration-500">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">📱</div>
              <h3 className="text-xl font-bold mb-4">Mobile Command</h3>
              <p className="text-zinc-400 leading-relaxed italic">
                "Manage access from anywhere in the world. Grant temporary passes from your iPhone."
              </p>
            </div>

            {/* Cloud Logs */}
            <div className="group p-10 rounded-3xl bg-zinc-900/30 border border-zinc-800 hover:border-purple-500/30 transition-all duration-500">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-xl font-bold mb-4">Immutable Logs</h3>
              <p className="text-zinc-400 leading-relaxed italic">
                "Every entry is recorded with high-res imagery. Secure, searchable cloud logs."
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER: Basic Branding */}
      <footer className="py-12 border-t border-zinc-900 text-center">
        <p className="text-zinc-600 text-sm italic">
          &copy; {new Date().getFullYear()} GateGuard Technology. Built for the next 100 years.
        </p>
      </footer>
    </main>
  );
}
