import React from 'react';

export default function Home() {
  return (
    <main className="bg-[#050505] text-white min-h-screen selection:bg-blue-500/30 font-sans">
      
      {/* 1. NAVIGATION BAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo Branding Colors from Logo copy2.jpg */}
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)]">
              <span className="text-white font-black text-xs tracking-tighter">GG</span>
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase italic">GateGuard</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <a href="#" className="hover:text-blue-400 transition-colors">Solutions</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Hardware</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-black hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20">
              DEMO
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-44 pb-32 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-[10px] font-bold tracking-[0.2em] uppercase bg-white/5 border border-white/10 rounded-full text-blue-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-40
