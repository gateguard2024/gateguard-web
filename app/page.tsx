"use client";
import React, { useState } from 'react';

export default function Home() {
  // ROI Calculator State
  const [units, setUnits] = useState(250);
  const [vehicleGates, setVehicleGates] = useState(2);
  const [pedGates, setPedGates] = useState(2);
  const [cameras, setCameras] = useState(4);
  const [concierge, setConcierge] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Math Logic
  const gatesCost = vehicleGates * 150;
  const pedCost = pedGates * 125;
  const cameraCost = cameras * 85;
  const totalMonthly = gatesCost + pedCost + cameraCost + concierge;
  const perUnitMonthly = (totalMonthly / units).toFixed(2);

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
      {/* 1. NAVIGATION BAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-2xl">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Gate Guard" className="h-10 w-10 object-contain" />
              <div className="flex flex-col">
                 <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-none text-white">Gate Guard</span>
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

      {/* 2. PREMIUM HERO SECTION */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden border-b border-white/5">
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
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-[10px] font-bold tracking-[0.2em] uppercase bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-full text-cyan-400 shadow-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Proactive Multi-Family Security
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05] drop-shadow-2xl">
                Intelligent Access. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Unrivaled Security.</span>
              </h1>
              <div className="border-l-2 border-cyan-500/50 pl-5 mb-10 max-w-xl mx-auto lg:mx-0 text-left">
                <p className="text-zinc-400 text-lg lg:text-xl leading-relaxed font-light">
                  We don't just fix gates; we manage them. Enjoy proactive AI monitoring, seamless Brivo access, and our digital visitor callbox for <span className="text-white font-semibold">one nominal price per unit.</span>
                </p>
              </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#services" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-full hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.6)] transition-all transform hover:-translate-y-1 border border-cyan-400/50 tracking-wide text-sm text-center inline-block">
                  VIEW THE PLAN
                </a>
                <a href="#pricing" className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all text-sm tracking-wide text-center inline-block">
                  CALCULATE ROI
                </a>
              </div>
            </div>

            {/* Right: The Overlapping App Experiences */}
            <div className="flex-1 w-full max-w-2xl relative mt-12 lg:mt-0 h-[550px]">
              
              {/* VISITOR EXPERIENCE */}
              <div className="absolute left-4 lg:left-0 top-0 w-56 sm:w-64 z-30 animate-float">
                <div className="absolute -left-6 sm:-left-12 top-16 bg-black/40 backdrop-blur-2xl border border-white/10 p-3 sm:p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-40">
                  <p className="text-cyan-400 text-[8px] font-black uppercase tracking-[0.3em] mb-1">Visitor Experience</p>
                  <p className="text-white text-xs sm:text-sm font-bold">Interactive Callbox</p>
                </div>
                <div className="bg-gradient-to-b from-zinc-700 to-black p-[2px] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
                  <div className="bg-black p-1.5 rounded-[2.4rem]">
                    <div className="aspect-[9/19] rounded-[2rem] overflow-hidden relative border border-white/10 bg-[#050505]">
                      <img src="/app-callbox.png" alt="Gate Guard Visitor Experience" className="w-full h-full object-cover" />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RESIDENT EXPERIENCE */}
              <div className="absolute right-4 lg:right-0 bottom-10 w-48 sm:w-56 z-20 animate-float-reverse">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full z-40 flex items-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.2)] whitespace-nowrap">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping absolute"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full relative"></div>
                  <span className="text-white text-[9px] font-bold tracking-widest uppercase">Eagle Eye Monitored</span>
                </div>
                <div className="absolute -right-4 sm:-right-10 bottom-20 bg-black/40 backdrop-blur-2xl border border-white/10 p-3 sm:p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-40 text-right">
                  <p className="text-blue-500 text-[8px] font-black uppercase tracking-[0.3em] mb-1">Resident Experience</p>
                  <p className="text-white text-xs sm:text-sm font-bold">Brivo Mobile Pass</p>
                </div>
                 <div className="bg-gradient-to-b from-zinc-800 to-black p-[2px] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
                  <div className="bg-black p-1.5 rounded-[2.4rem]">
                    <div className="aspect-[9/19] rounded-[2rem] overflow-hidden relative border border-white/10 bg-[#0f1423]">
                      <img src="/app-brivo.png" alt="Brivo Resident Experience" className="w-full h-full object-cover" />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                </div>
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
              <span key={t} className="text-sm md:text-base font-black tracking-tighter text-white hover:text-cyan-400 transition-colors cursor-default">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE 5 PILLARS OF GATE GUARD */}
      <section id="services" className="py-32 bg-[#050505] relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              The Complete <span className="text-cyan-400 italic mr-2 md:mr-3">Gate Guard</span> Ecosystem.
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              Unlike traditional break-fix companies, we put community gates first. Get proactive service, hardware, and software rolled into one nominal per-unit operating expense.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Proactive Plans */}
            <div className="lg:col-span-2 relative border border-white/10 rounded-[2rem] hover:border-cyan-500/50 transition-colors group overflow-hidden shadow-lg">
               <div className="absolute inset-0 z-0 overflow-hidden">
                 <img src="/hero-bg.jpg" alt="Property Background" className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                 <div className="absolute inset-0 bg-[#0A192F] opacity-90 mix-blend-multiply"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
               </div>
               <div className="relative z-10 p-10 h-full flex flex-col justify-end">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full group-hover:bg-cyan-500/20 transition-all duration-700 pointer-events-none"></div>
                 <h3 className="text-cyan-400 font-bold mb-3 uppercase text-xs tracking-widest">Core Service</h3>
                 <h4 className="text-3xl font-bold mb-4 text-white">"Your Gate Guard" Proactive Plans</h4>
                 <p className="text-zinc-300 leading-relaxed max-w-xl text-lg font-light">
                   We cover the operators, technology, parts, and labor (excluding the physical steel gate). By monitoring entry cameras, we proactively dispatch technicians to resolve malfunctions before residents even notice.
                 </p>
               </div>
            </div>

            {/* 2. Eagle Eye Networks */}
            <div className="relative border border-white/10 rounded-[2rem] hover:border-blue-500/50 transition-colors group overflow-hidden">
               <div className="absolute inset-0 z-0 overflow-hidden">
                 <img src="/hero-bg.jpg" alt="Property Background" className="w-full h-full object-cover grayscale opacity-30 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                 <div className="absolute inset-0 bg-[#0A192F] opacity-90 mix-blend-multiply"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-[#0A192F]/50"></div>
               </div>
               <div className="relative z-10 p-10 h-full flex flex-col justify-end">
                 <h3 className="text-blue-500 font-bold mb-3 uppercase text-xs tracking-widest group-hover:text-blue-400 transition-colors">Surveillance</h3>
                 <h4 className="text-2xl font-bold mb-4 text-white">Eagle Eye Monitoring</h4>
                 <p className="text-zinc-400 text-sm leading-relaxed font-light">
                   Monitored camera systems at every entry point. We install brand new hardware or seamlessly take over your existing infrastructure to monitor gate health.
                 </p>
               </div>
            </div>

            {/* 3. PMS Smart Sync (Updated Brivo Card) */}
            <div className="relative border border-white/10 rounded-[2rem] hover:border-cyan-500/50 transition-colors group overflow-hidden">
               <div className="absolute inset-0 z-0 overflow-hidden">
                 <img src="/hero-bg.jpg" alt="Property Background" className="w-full h-full object-cover grayscale opacity-30 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                 <div className="absolute inset-0 bg-[#0A192F] opacity-90 mix-blend-multiply"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-[#0A192F]/50"></div>
               </div>
               <div className="relative z-10 p-10 h-full flex flex-col justify-end">
                 <h3 className="text-cyan-400 font-bold mb-3 uppercase text-xs tracking-widest group-hover:text-cyan-300 transition-colors">Access & Automation</h3>
                 <h4 className="text-2xl font-bold mb-4 text-white">Brivo & PMS Sync</h4>
                 <p className="text-zinc-400 text-sm leading-relaxed font-light">
                   Native API integrations with Yardi, Entrata, and RealPage. When a resident moves in, they automatically receive a pass. When they move out, access is instantly revoked. Zero double data entry.
                 </p>
               </div>
            </div>

            {/* 4. Call Box App */}
            <div className="relative border border-white/10 rounded-[2rem] hover:border-blue-500/50 transition-colors group overflow-hidden">
               <div className="absolute inset-0 z-0 overflow-hidden">
                 <img src="/hero-bg.jpg" alt="Property Background" className="w-full h-full object-cover grayscale opacity-30 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                 <div className="absolute inset-0 bg-[#0A192F] opacity-90 mix-blend-multiply"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-[#0A192F]/50"></div>
               </div>
               <div className="relative z-10 p-10 h-full flex flex-col justify-end">
                 <h3 className="text-blue-500 font-bold mb-3 uppercase text-xs tracking-widest group-hover:text-blue-400 transition-colors">Resident App</h3>
                 <h4 className="text-2xl font-bold mb-4 text-white">Digital Call Box</h4>
                 <p className="text-zinc-400 text-sm leading-relaxed font-light">
                   Remove expensive, dated physical telephone entry boxes. Our digital app lets residents grant visitor access directly from their smartphones.
                 </p>
               </div>
            </div>

            {/* 5. Live Concierge */}
            <div className="relative border border-white/10 rounded-[2rem] hover:border-cyan-500/50 transition-colors group overflow-hidden">
               <div className="absolute inset-0 z-0 overflow-hidden">
                 <img src="/hero-bg.jpg" alt="Property Background" className="w-full h-full object-cover grayscale opacity-30 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                 <div className="absolute inset-0 bg-[#0A192F] opacity-90 mix-blend-multiply"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-[#0A192F]/50"></div>
               </div>
               <div className="relative z-10 p-10 h-full flex flex-col justify-end">
                 <h3 className="text-cyan-400 font-bold mb-3 uppercase text-xs tracking-widest group-hover:text-cyan-300 transition-colors">Verification</h3>
                 <h4 className="text-2xl font-bold mb-4 text-white">2-Way Video Concierge</h4>
                 <p className="text-zinc-400 text-sm leading-relaxed font-light">
                   Virtual concierge service to check in visitors, document license plates, and verify IDs over real-time, 2-way video calling.
                 </p>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. THE ALL-IN-ONE COMPARISON SECTION */}
      <section id="roi" className="py-32 bg-black border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              The All-In-One <span className="text-cyan-400 italic">Revolution.</span>
            </h2>
            <p className="text-zinc-400 max-w-3xl mx-auto text-lg leading-relaxed">
              Other companies offer one-off services—they only fix your gate, install cameras, or manage access control. We are a unified solution revolutionizing community security and maintenance to maximize property safety and system uptime.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
            {/* The Old Way */}
            <div className="flex-1 bg-zinc-950 border border-red-900/30 rounded-[2rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-900/50"></div>
              <h3 className="text-red-400 font-bold mb-8 uppercase tracking-widest text-sm flex items-center gap-2">
                <span className="text-xl">✕</span> The Old Way
              </h3>
              <ul className="space-y-8">
                <li>
                  <h4 className="text-xl font-bold text-white mb-2">Vendor Fragmentation</h4>
                  <p className="text-zinc-500 text-sm">Juggling a separate gate repair company, camera installer, and access control provider.</p>
                </li>
                <li>
                  <h4 className="text-xl font-bold text-white mb-2">Manual Data Entry</h4>
                  <p className="text-zinc-500 text-sm">Property managers wasting hours manually adding and deleting residents from the gate directory.</p>
                </li>
                <li>
                  <h4 className="text-xl font-bold text-white mb-2">Reactive Maintenance</h4>
                  <p className="text-zinc-500 text-sm">You only know the gate is broken when a resident calls to complain they are locked out.</p>
                </li>
                <li>
                  <h4 className="text-xl font-bold text-white mb-2">Unpredictable CapEx</h4>
                  <p className="text-zinc-500 text-sm">Surprise $5,000+ repair bills when gate operators fail, requiring emergency board approvals.</p>
                </li>
                <li>
                  <h4 className="text-xl font-bold text-white mb-2">Expensive Physical Guards</h4>
                  <p className="text-zinc-500 text-sm">$150,000+ annual salaries for guards prone to human error, fatigue, and turnover.</p>
                </li>
              </ul>
            </div>

            {/* The Gate Guard Way */}
            <div className="flex-1 bg-gradient-to-br from-zinc-900 to-[#0A192F] border border-cyan-500/30 rounded-[2rem] p-8 md:p-12 relative shadow-[0_0_40px_rgba(6,182,212,0.1)] transform lg:-translate-y-4">
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
              <h3 className="text-cyan-400 font-bold mb-8 uppercase tracking-widest text-sm flex items-center gap-2">
                <span className="text-xl">✓</span> The Gate Guard Advantage
              </h3>
              <ul className="space-y-8">
                <li>
                  <h4 className="text-xl font-bold text-white mb-2">The All-In-One Solution</h4>
                  <p className="text-zinc-300 text-sm">One partner for gate maintenance, camera monitoring, and property-wide access control.</p>
                </li>
                <li>
                  <h4 className="text-xl font-bold text-white mb-2">Automated PMS Sync</h4>
                  <p className="text-zinc-300 text-sm">Direct API links to Yardi, Entrata, and RealPage. Move-ins get instant access; move-outs are instantly revoked.</p>
                </li>
                <li>
                  <h4 className="text-xl font-bold text-white mb-2">Proactive Zero-Downtime</h4>
                  <p className="text-zinc-300 text-sm">Our Eagle Eye cameras monitor operator health. We fix it *before* the residents even notice.</p>
                </li>
                <li>
                  <h4 className="text-xl font-bold text-white mb-2">Predictable Per-Unit OpEx</h4>
                  <p className="text-zinc-300 text-sm">One nominal monthly fee covers tech, operators, parts, and labor. Budgeting becomes effortless.</p>
                </li>
                <li>
                  <h4 className="text-xl font-bold text-white mb-2">24/7 AI & Video Concierge</h4>
                  <p className="text-zinc-300 text-sm">Flawless, unblinking oversight. Verify IDs and log every plate for a fraction of a guard's salary.</p>
                </li>
              </ul>
              <div className="mt-10 pt-8 border-t border-white/10">
                <p className="text-center text-sm font-bold text-cyan-400 uppercase tracking-widest">
                  Maximize Safety & System Uptime
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
{/* 6. INTERACTIVE ROI CALCULATOR */}
      <section id="pricing" className="py-32 bg-[#050505] relative border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Calculate Your <span className="text-cyan-400 italic mr-2 md:mr-3">Gate Guard</span> Savings.
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              Move from a reactive "Run-to-Fail" cycle to a proactive "Asset Management" model. 
              Input your property details below to see your predictable per-unit operating expense.
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-zinc-900/50 border border-white/10 rounded-[2rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl flex flex-col lg:flex-row gap-12">
            
            {/* Left: Interactive Controls */}
            <div className="flex-1 space-y-8">
              
              {/* Units Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-white font-bold text-sm tracking-wide uppercase">Total Units / Apartments</label>
                  <span className="text-cyan-400 font-black">{units}</span>
                </div>
                <input 
                  type="range" min="50" max="1000" step="10" 
                  value={units} onChange={(e) => setUnits(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Hardware Inputs */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-zinc-400 font-bold text-xs tracking-widest uppercase block mb-2">Vehicle Gates</label>
                  <p className="text-[10px] text-zinc-500 mb-2 leading-tight">Includes cameras & maintenance ($150/ea)</p>
                  <input 
                    type="number" min="0" value={vehicleGates} onChange={(e) => setVehicleGates(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-lg p-3 text-white font-bold focus:border-cyan-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 font-bold text-xs tracking-widest uppercase block mb-2">Pedestrian Doors</label>
                  <p className="text-[10px] text-zinc-500 mb-2 leading-tight">Amenities & walk-ins ($125/ea)</p>
                  <input 
                    type="number" min="0" value={pedGates} onChange={(e) => setPedGates(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-lg p-3 text-white font-bold focus:border-cyan-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Extra Cameras */}
              <div>
                <label className="text-zinc-400 font-bold text-xs tracking-widest uppercase block mb-2">Additional Video Monitoring</label>
                <p className="text-[10px] text-zinc-500 mb-2 leading-tight">Property-wide Eagle Eye cameras ($85/ea)</p>
                <input 
                  type="number" min="0" value={cameras} onChange={(e) => setCameras(Number(e.target.value))}
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white font-bold focus:border-cyan-500 outline-none transition-colors"
                />
              </div>

              {/* Virtual Concierge Dropdown */}
              <div>
                <label className="text-zinc-400 font-bold text-xs tracking-widest uppercase block mb-2">2-Way Video Concierge</label>
                <p className="text-[10px] text-zinc-500 mb-2 leading-tight">Live operators checking IDs and logging plates</p>
                <select 
                  value={concierge} onChange={(e) => setConcierge(Number(e.target.value))}
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white font-bold focus:border-cyan-500 outline-none transition-colors appearance-none"
                >
                  <option value="0">None (Self-Managed via App)</option>
                  <option value="900">Night Shift (11pm - 7am)</option>
                  <option value="1100">Morning Shift (7am - 3pm)</option>
                  <option value="1100">Evening Shift (3pm - 11pm)</option>
                  <option value="2900">24/7 Full Coverage</option>
                </select>
              </div>

            </div>

            {/* Right: The Live Results */}
            <div className="flex-1 bg-black border border-cyan-500/30 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee]"></div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>
              
              <h3 className="text-center text-zinc-400 text-sm font-bold uppercase tracking-widest mb-2">Estimated Predictable OpEx</h3>
              
              <div className="text-center mb-8">
                <span className="text-6xl font-black text-white">${perUnitMonthly}</span>
                <span className="text-zinc-500 font-bold"> / unit / mo</span>
              </div>

              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Total Monthly Subscription</span>
                  <span className="text-white font-bold">${totalMonthly.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">One-Time Setup Fee (Avg)</span>
                  <span className="text-white font-bold">${((vehicleGates + pedGates) * 500).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <span className="text-red-400 font-bold">Cost of 24/7 Physical Guards</span>
                  <span className="text-red-400 font-bold line-through">$12,500 / mo</span>
                </div>
              </div>

               <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-8 px-8 py-4 bg-cyan-500 text-black font-black rounded-full hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)] transition-all transform hover:-translate-y-1"
              >
                LOCK IN THIS RATE
              </button>
            </div>

          </div>
        </div>
      </section>
      {/* 6. CALL TO ACTION (LEAD CAPTURE) */}
      <section id="contact" className="py-32 bg-gradient-to-b from-[#050505] to-[#0A192F] relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img src="/hero-bg.jpg" alt="Property Background" className="w-full h-full object-cover grayscale opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#050505]/80 to-[#050505]"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto bg-zinc-900/60 border border-white/10 p-12 md:p-20 rounded-[3rem] backdrop-blur-2xl shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
              Secure Your <span className="text-cyan-400">Community</span> Today.
            </h2>
            <p className="text-zinc-300 text-lg mb-10 max-w-xl mx-auto font-light leading-relaxed">
              Join the elite Multi-Family and HOA communities already utilizing the Gate Guard ecosystem to increase safety and eliminate downtime.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <a href="mailto:sales@gateguard.pro" className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.6)] transition-all transform hover:-translate-y-1 text-center tracking-wide text-sm border border-cyan-400/50">
                REQUEST A PROPOSAL
              </a>
              <a href="tel:+15551234567" className="px-10 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all text-center tracking-wide text-sm">
                CALL AN EXPERT
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ENHANCED FOOTER */}
      <footer className="py-20 bg-black border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
               <div className="flex items-center gap-3 mb-6">
                  <img src="/logo.png" alt="Gate Guard" className="w-8 h-8 object-contain" />
                  <span className="text-xl font-black tracking-tighter italic uppercase">Gate Guard</span>
               </div>
               <p className="text-zinc-500 max-w-sm text-sm leading-relaxed">
                  Redefining multi-family access control through edge-computing, proactive monitoring, and intelligent integration.
               </p>
            </div>
            <div>
               <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Platform</h4>
               <ul className="space-y-4 text-sm text-zinc-500">
                  <li><a href="#services" className="hover:text-cyan-400 transition-colors">Core Services</a></li>
                  <li><a href="#roi" className="hover:text-cyan-400 transition-colors">ROI Comparison</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Brivo Integration</a></li>
               </ul>
            </div>
            <div>
               <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Support</h4>
               <ul className="space-y-4 text-sm text-zinc-500">
                  <li><a href="mailto:support@gateguard.pro" className="hover:text-cyan-400 transition-colors">Tech Support</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Resident Portal</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
               </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center flex flex-col items-center">
            <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-[0.5em]">
              &copy; {new Date().getFullYear()} Gate Guard Security Ecosystem. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
      {/* SALESFORCE LEAD CAPTURE MODAL (POP-UP) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Dark Blurred Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          {/* The Sleek Form Container */}
          <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 animate-[float_0.3s_ease-out]">
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
            
            <h3 className="text-3xl font-bold mb-2 text-white tracking-tight">Lock In Your Rate.</h3>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              Your estimate is <strong className="text-cyan-400">${perUnitMonthly} / unit</strong>. Enter your details and our team will securely log this build in our system.
            </p>

            {/* Salesforce Web-to-Lead Form */}
            <form action="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8" method="POST" className="space-y-5">
              
              {/* HIDDEN SALESFORCE ROUTING DATA */}
              <input type="hidden" name="oid" value="00Dam00001a4k0S" />
              <input type="hidden" name="retURL" value="https://gateguard.co" />
              
              {/* HIDDEN MAGIC: Passing the Calculator Data to Salesforce Notes */}
              <input type="hidden" name="description" value={`Calculated Quote: ${units} Units | ${vehicleGates} Vehicle Gates | ${pedGates} Ped Gates | ${cameras} Cameras | Concierge Shift: $${concierge} | Estimated Total: $${totalMonthly.toLocaleString()}/mo ($${perUnitMonthly}/unit)`} />

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">First Name</label>
                  <input id="first_name" maxLength={40} name="first_name" type="text" required className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors" />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Last Name</label>
                  <input id="last_name" maxLength={40} name="last_name" type="text" required className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors" />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Property / HOA Name</label>
                <input id="company" maxLength={40} name="company" type="text" required className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors" />
              </div>

              <div>
                <label htmlFor="email" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Email</label>
                <input id="email" maxLength={80} name="email" type="email" required className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors" />
              </div>

              <div>
                <label htmlFor="phone" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Phone</label>
                <input id="phone" maxLength={40} name="phone" type="tel" className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors" />
              </div>

              <button type="submit" className="w-full mt-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-full hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.6)] transition-all tracking-wide">
                SUBMIT TO SALESFORCE
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
