import React from 'react';

export default function Home() {
  return (
    <main className="bg-[#050505] text-white min-h-screen selection:bg-cyan-500/30 font-sans overflow-x-hidden">
      
      {/* Custom CSS for the floating phone animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(-15px); }
          50% { transform: translateY(0px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 8s ease-in-out infinite; }
      `}} />

      {/* 1. NAVIGATION BAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-2xl">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="GateGuard" className="h-10 w-10 object-contain" />
              <div className="flex flex-col">
                 <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-none text-white">GateGuard</span>
                 <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-cyan-500 mt-1">Security Ecosystem</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            <a href="#services" className="hover:text-cyan-400 transition-colors">Services</a>
            <a href="#roi" className="hover:text-cyan-400 transition-colors">Compare</a>
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

      {/* 2. PREMIUM HERO SECTION (Dark Navy Silhouette & Sleek App UI) */}
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

            {/* Right: The Overlapping App Experiences (Ultra-Sleek) */}
            <div className="flex-1 w-full max-w-2xl relative mt-12 lg:mt-0 h-[550px]">
              
              {/* --- 1. VISITOR EXPERIENCE (GateGuard App) --- */}
              <div className="absolute left-4 lg:left-0 top-0 w-56 sm:w-64 z-30 animate-float">
                {/* Frosted Glass Experience Label */}
                <div className="absolute -left-6 sm:-left-12 top-16 bg-black/40 backdrop-blur-2xl border border-white/10 p-3 sm:p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-40">
                  <p className="text-cyan-400 text-[8px] font-black uppercase tracking-[0.3em] mb-1">Visitor Experience</p>
                  <p className="text-white text-xs sm:text-sm font-bold">Interactive Callbox</p>
                </div>
                {/* Sleek Phone Frame */}
                <div className="bg-gradient-to-b from-zinc-700 to-black p-[2px] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
                  <div className="bg-black p-1.5 rounded-[2.4rem]">
                    <div className="aspect-[9/19] rounded-[2rem] overflow-hidden relative border border-white/10 bg-[#050505]">
                      <img src="/app-callbox.png" alt="GateGuard Visitor Experience" className="w-full h-full object-cover" />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- 2. RESIDENT EXPERIENCE (Brivo App) --- */}
              <div className="absolute right-4 lg:right-0 bottom-10 w-48 sm:w-56 z-20 animate-float-reverse">
                {/* Frosted Glass Experience Label */}
                <div className="absolute -right-4 sm:-right-10 bottom-20 bg-black/40 backdrop-blur-2xl border border-white/10 p-3 sm:p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-40 text-right">
                  <p className="text-blue-500 text-[8px] font-black uppercase tracking-[0.3em] mb-1">Resident Experience</p>
                  <p className="text-white text-xs sm:text-sm font-bold">Brivo Mobile Pass</p>
                </div>
                 {/* Sleek Phone Frame */}
                 <div className="bg-gradient-to-b from-zinc-800 to-black p-[2px] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
                  <div className="bg-black p-1.5 rounded-[2.4rem]">
                    <div className="aspect-[9/19] rounded-[2rem] overflow-hidden relative border border-white/10 bg-[#0f1423]">
                      <img src
