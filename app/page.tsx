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

     {/* 2. PREMIUM HERO SECTION (Dark Navy Silhouette & App UI) */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden border-b border-white/5">
        
        {/* Background Image & Brivo-Style Navy Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.jpg" 
            alt="Multi-Family Building" 
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-[#0A192F] opacity-85 mix-blend-multiply"></div>
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
                We don't just fix gates; we manage them. Enjoy proactive AI monitoring, seamless Brivo access, and our digital visitor callbox for one nominal price per unit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="px-10 py-4 bg-cyan-500 text-black font-black rounded-full hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)] transition-all transform hover:-translate-y-1">
                  VIEW "YOUR GATE GUARD" PLAN
                </button>
              </div>
            </div>

            {/* Right: The Overlapping App Interfaces */}
            <div className="flex-1 w-full max-w-2xl relative mt-12 lg:mt-0 h-[450px]">
              
              {/* Floating Element 1: GateGuard Visitor Callbox App */}
              <div className="absolute left-0 lg:left-4 top-0 w-48 sm:w-56 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-30 transform hover:-translate-y-2 transition-transform duration-500">
                <div className="aspect-[9/16] rounded-2xl overflow-hidden relative border border-white/5 bg-[#111] flex flex-col p-3">
                  {/* Mock Video Feed */}
                  <div className="w-full h-3/5 bg-zinc-800 rounded-xl mb-4 overflow-hidden relative border border-white/10">
                    <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" alt="Gate Camera View"/>
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-md backdrop-blur-md">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-[8px] text-white font-bold tracking-widest uppercase">Live</span>
                    </div>
                  </div>
                  {/* Mock UI Text */}
                  <div className="text-center mb-4">
                    <p className="text-white text-sm font-bold">Visitor at Gate</p>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Delivery Driver</p>
                  </div>
                  {/* Mock Answer/Decline Buttons */}
                  <div className="flex gap-4 w-full justify-center mt-auto pb-2">
                     <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                       <span className="text-red-500 text-lg">✕</span>
                     </div>
                     <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                       <span className="text-green-500 text-lg">✓</span>
                     </div>
                  </div>
                </div>
                {/* Floating Label */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] text-center">
                  <span className="px-4 py-2 bg-blue-600 border border-blue-400/50 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg whitespace-nowrap">
                    Digital Callbox App
                  </span>
                </div>
              </div>

              {/* Floating Element 2: Brivo Resident App */}
              <div className="absolute right-0 lg:right-4 bottom-0 w-48 sm:w-56 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 transform hover:-translate-y-2 transition-transform duration-500 flex flex-col items-center">
                <div className="w-full aspect-square bg-[#111] border border-white/5 rounded-2xl mb-6 relative overflow-hidden flex flex-col items-center justify-center group shadow-inner">
                   {/* Mock Brivo Unlock Button */}
                   <div className="w-28 h-28 rounded-full border border-cyan-500/20 flex items-center justify-center group-hover:border-cyan-400/50 transition-colors bg-gradient-to-b from-cyan-500/5 to-transparent relative">
                     <div className="absolute inset-0 rounded-full border-t border-cyan-400 opacity-50"></div>
                     <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer">
                       <span className="text-white text-3xl font-black mb-1">🔓</span>
                     </div>
                   </div>
                   <p className="mt-6 text-[10px] font-bold text-zinc-300 tracking-[0.2em] uppercase">Tap to Unlock</p>
                </div>
                {/* Floating Label */}
                <div className="w-full text-center">
                  <span className="px-4 py-2 bg-zinc-800 border border-white/10 text-cyan-400 text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg block">
                    Brivo Mobile Pass
                  </span>
                </div>
              </div>
              
              {/* Floating Status Pill */}
              <div className="absolute top-10 right-10 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full z-40 flex items-center gap-2 shadow-xl">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping absolute"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full relative"></div>
                <span className="text-white text-[9px] font-bold tracking-widest uppercase">Eagle Eye Active</span>
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
