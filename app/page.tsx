import React from 'react';

export default function Home() {
  return (
    <main className="bg-[#050505] text-white min-h-screen selection:bg-cyan-500/30 font-sans overflow-x-hidden">
      
      {/* 1. NAVIGATION BAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-2xl">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-40 sm:w-48 h-12 flex items-center">
               {/* Using the text-based logo matching your uploaded Screenshot 2026-02-23 at 8.20.19 AM.png */}
               <div className="flex items-center gap-3">
                 <img src="/logo.png" alt="GateGuard" className="h-10 w-10 object-contain" />
                 <div className="flex flex-col">
                    <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-none text-white">GateGuard</span>
                    <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-blue-500 mt-1">Security Ecosystem</span>
                 </div>
               </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            <a href="#services" className="hover:text-cyan-400 transition-colors">Services</a>
            <a href="#app" className="hover:text-cyan-400 transition-colors">App</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
            <button className="px-8 py-3 bg-transparent border border-white/20 hover:border-cyan-400 text-white rounded-full transition-all">
              Login
            </button>
            <button className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-full font-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              GET A QUOTE
            </button>
          </div>
        </div>
      </nav>

      {/* 2. PREMIUM HERO SECTION (Dark Navy Silhouette) */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden border-b border-white/5">
        
        {/* Background Image & Brivo-Style Navy Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Your Base Building Image */}
          <img 
            src="/hero-bg.jpg" 
            alt="Multi-Family Building" 
            className="w-full h-full object-cover grayscale"
          />
          {/* The Deep Navy Silhouette Filter (85% opaque blue = 15% visible building) */}
          <div className="absolute inset-0 bg-[#0A192F] opacity-85 mix-blend-multiply"></div>
          {/* Bottom fade to seamlessly blend into the next black section */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Left: Content & Messaging */}
            <div className="flex-1 text-center lg:text-left z-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[10px] font-bold tracking-[0.2em] uppercase bg-white/5 border border-white/10 rounded-full text-cyan-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Proactive Multi-Family Security
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]">
                GateGuard: Intelligent Access. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Unrivaled Security.</span>
              </h1>
              <p className="text-zinc-300 text-lg lg:text-xl mb-10 max-w-xl leading-relaxed mx-auto lg:mx-0 font-medium drop-shadow-lg">
                We don't just fix gates; we manage them. Enjoy proactive AI monitoring, seamless Brivo access, and 2-way video concierge for one nominal price per unit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="px-10 py-4 bg-cyan-500 text-black font-black rounded-full hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)] transition-all transform hover:-translate-y-1">
                  VIEW "YOUR GATE GUARD" PLAN
                </button>
              </div>
            </div>

            {/* Right: The Overlapping "Composite" Image Setup */}
            <div className="flex-1 w-full max-w-2xl relative mt-12 lg:mt-0">
              {/* Floating Element 1: Video Concierge App */}
              <div className="absolute -left-4 lg:-left-12 top-1/4 w-48 sm:w-56 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-3 shadow-2xl z-30 transform hover:scale-105 transition-transform duration-500">
                <div className="aspect-[9/16] rounded-2xl overflow-hidden relative border border-white/5">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" alt="Video Concierge" className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-0 w-full text-center">
                    <span className="px-4 py-1.5 bg-green-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                      LIVE CONCIERGE
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Element 2: Access Hardware / Callbox App */}
              <div className="absolute -right-4 lg:-right-8 bottom-10 w-40 sm:w-48 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl z-20 transform hover:scale-105 transition-transform duration-500 flex flex-col items-center">
                <div className="w-20 h-32 bg-black border border-white/20 rounded-xl mb-4 relative overflow-hidden flex flex-col items-center justify-center shadow-inner">
                   <div className="w-12 h-12 rounded-full border border-cyan-500/50 flex items-center justify-center mb-2">
                     <span className="text-cyan-400 text-xs font-bold">RFID</span>
                   </div>
                   <div className="w-10 h-1 bg-zinc-800 rounded-full"></div>
                </div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold text-center">Brivo Hardware Sync</p>
              </div>
              
              {/* Floating Status Pill */}
              <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full z-20 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-white text-[10px] font-bold tracking-widest uppercase">Eagle Eye Active</span>
              </div>
            </div>

          </div>
        </div>
      </section>
      
      {/* 3. TARGET AUDIENCE TRUST BAR */}
      <section className="py-12 bg-[#050505] border-y border-white/5 relative z-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-8">Built Exclusively For</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-60">
            {['MULTI-FAMILY APARTMENTS', 'HOA COMMUNITIES', 'COMMERCIAL ESTATES'].map((t) => (
              <span key={t} className="text-sm md:text-base font-black tracking-tighter text-white">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TEMPORARY FOOTER (To ensure clean build) */}
      <footer className="py-10 bg-black text-center text-zinc-600">
         <p className="text-[10px] font-bold uppercase tracking-[0.5em]">GateGuard Tech Ecosystem</p>
      </footer>
    </main>
  );
}
