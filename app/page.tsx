import React from 'react';

/**
 * GateGuard Master Landing Page
 * Features: Transparent Logo Integration, Brivo Ecosystem, and AI Hardware 
 */
export default function Home() {
  return (
    <main className="bg-[#050505] text-white min-h-screen selection:bg-blue-600/30 font-sans">
      
      {/* 1. NAVIGATION BAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="GateGuard Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-none text-white">
                GateGuard
              </span>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-500 mt-1">
                Security Ecosystem
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            <a href="#solutions" className="hover:text-blue-400 transition-colors">Solutions</a>
            <a href="#hardware" className="hover:text-blue-400 transition-colors">Hardware</a>
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black transition-all shadow-xl shadow-blue-900/40">
              GET A QUOTE
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section id="solutions" className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-[10px] font-bold tracking-[0.2em] uppercase bg-white/5 border border-white/10 rounded-full text-blue-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Intelligence at the Edge
              </div>
              <h1 className="text-6xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[0.9]">
                The Gate is Old. <br />
                <span className="text-zinc-500">The Solution is </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Intelligent.</span>
              </h1>
              <p className="text-zinc-400 text-lg lg:text-xl mb-12 max-w-xl leading-relaxed italic">
                "Replace outdated fobs and expensive guards with an AI-driven ecosystem."
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <button className="px-10 py-5 bg-blue-600 text-white font-black rounded-xl hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)] transition-all transform hover:-translate-y-1">
                  BOOK A LIVE DEMO
                </button>
                <button className="px-10 py-5 bg-zinc-900/50 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all backdrop-blur-sm">
                  ROI CALCULATOR
                </button>
              </div>
            </div>

            {/* Dashboard Visual Mockup */}
            <div className="flex-1 w-full max-w-2xl relative group">
              <div className="absolute -inset-1 bg-blue-500 rounded-[2.5rem] blur opacity-10"></div>
              <div className="relative bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-4 shadow-2xl overflow-hidden">
                <div className="aspect-video bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5 relative">
                   <div className="text-center">
                      <div className="text-6xl mb-4 grayscale opacity-40">🔒</div>
                      <p className="text-[10px] font-mono tracking-[0.3em] text-blue-500 uppercase">Gate Guard System Active</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INDUSTRY TRUST BAR */}
      <section className="py-16 bg-zinc-950/50 border-y border-white/5">
        <div className="container mx-auto px-6 text-center text-white font-bold italic uppercase tracking-tighter">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-12 italic font-normal">Protecting Premier Properties</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 grayscale opacity-40">
            {['HOA MANAGERS', 'MULTI-FAMILY', 'GATED ESTATES', 'COMMERCIAL HUB'].map((t) => (
              <span key={t} className="text-sm font-black tracking-tighter text-white">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ECOSYSTEM SECTION */}
      <section className="py-32 bg-[#080808] relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 italic uppercase tracking-tighter">One Gate. <span className="text-blue-500">Two Power
