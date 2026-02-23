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
            
            {/* Left: Content & Messaging (POLISHED) */}
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
              
              {/* Refined Paragraph with Accent Border */}
              <div className="border-l-2 border-cyan-500/50 pl-5 mb-10 max-w-xl mx-auto lg:mx-0 text-left">
                <p className="text-zinc-400 text-lg lg:text-xl leading-relaxed font-light">
                  We don't just fix gates; we manage them. Enjoy proactive AI monitoring, seamless Brivo access, and our digital visitor callbox for <span className="text-white font-semibold">one nominal price per unit.</span>
                </p>
              </div>

              {/* Upgraded Dual Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-full hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.6)] transition-all transform hover:-translate-y-1 border border-cyan-400/50 tracking-wide text-sm">
                  VIEW THE PLAN
                </button>
                <button className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all text-sm tracking-wide">
                  CALCULATE ROI
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
                
                {/* NEW POSITION: Eagle Eye Pill perfectly centered above the Brivo phone */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full z-40 flex items-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.2)] whitespace-nowrap">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping absolute"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full relative"></div>
                  <span className="text-white text-[9px] font-bold tracking-widest uppercase">Eagle Eye Monitored</span>
                </div>

                {/* Frosted Glass Experience Label */}
                <div className="absolute -right-4 sm:-right-10 bottom-20 bg-black/40 backdrop-blur-2xl border border-white/10 p-3 sm:p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-40 text-right">
                  <p className="text-blue-500 text-[8px] font-black uppercase tracking-[0.3em] mb-1">Resident Experience</p>
                  <p className="text-white text-xs sm:text-sm font-bold">Brivo Mobile Pass</p>
                </div>
                 {/* Sleek Phone Frame */}
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
              <span key={t} className="text-sm md:text-base font-black tracking-tighter text-white">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE 5 PILLARS OF GATE GUARD */}
      <section id="services" className="py-32 bg-[#050505] relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">The Complete <span className="text-cyan-400 italic">GateGuard</span> Ecosystem.</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              Hardware, software, and proactive maintenance seamlessly integrated into a single, predictable operating expense.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Proactive Plans */}
            <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-10 rounded-[2rem] hover:border-cyan-500/30 transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full group-hover:bg-cyan-500/10 transition-all"></div>
               <h3 className="text-cyan-400 font-bold mb-3 uppercase text-xs tracking-widest">Core Service</h3>
               <h4 className="text-3xl font-bold mb-4">"Your Gate Guard" Proactive Plans</h4>
               <p className="text-zinc-400 leading-relaxed max-w-md">
                 We cover parts, labor, and the tech operators. By proactively monitoring entry cameras, we dispatch technicians before your residents even realize the gate is malfunctioning. 
               </p>
            </div>
            {/* 2. Eagle Eye Networks */}
            <div className="bg-zinc-900/50 border border-white/10 p-10 rounded-[2rem] hover:border-blue-500/30 transition-all">
               <h3 className="text-blue-500 font-bold mb-3 uppercase text-xs tracking-widest">Surveillance</h3>
               <h4 className="text-2xl font-bold mb-4 text-white">Eagle Eye Monitoring</h4>
               <p className="text-zinc-400 text-sm leading-relaxed">
                 Cloud-based camera systems at every entry point. We install new hardware or take over your existing infrastructure for seamless oversight.
               </p>
            </div>
            {/* 3. Brivo Access Control */}
            <div className="bg-zinc-900/50 border border-white/10 p-10 rounded-[2rem] hover:border-cyan-500/30 transition-all">
               <h3 className="text-cyan-400 font-bold mb-3 uppercase text-xs tracking-widest">Access</h3>
               <h4 className="text-2xl font-bold mb-4 text-white">Brivo Property Sync</h4>
               <p className="text-zinc-400 text-sm leading-relaxed">
                 Manage property-wide access from a single dashboard. Issue mobile credentials, track entry logs, and secure amenities effortlessly.
               </p>
            </div>
            {/* 4. Call Box App */}
            <div className="bg-zinc-900/50 border border-white/10 p-10 rounded-[2rem] hover:border-blue-500/30 transition-all">
               <h3 className="text-blue-500 font-bold mb-3 uppercase text-xs tracking-widest">Resident App</h3>
               <h4 className="text-2xl font-bold mb-4 text-white">Digital Call Box</h4>
               <p className="text-zinc-400 text-sm leading-relaxed">
                 Eliminate expensive, dated telephone entry systems. Residents grant access directly from their smartphones via a sleek, intuitive app.
               </p>
            </div>
            {/* 5. Live Concierge */}
            <div className="bg-zinc-900/50 border border-white/10 p-10 rounded-[2rem] hover:border-cyan-500/30 transition-all">
               <h3 className="text-cyan-400 font-bold mb-3 uppercase text-xs tracking-widest">Verification</h3>
               <h4 className="text-2xl font-bold mb-4 text-white">2-Way Video Concierge</h4>
               <p className="text-zinc-400 text-sm leading-relaxed">
                 Virtual guards check in visitors, document license plates, and verify ID through real-time, 2-way video communication.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE ROI & COMPARISON SECTION */}
      <section id="roi" className="py-32 bg-black border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">Stop Paying for <span className="text-red-400 italic">Vulnerability.</span></h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              Compare the traditional break-fix and physical guard model against GateGuard’s proactive, flat-rate ecosystem.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
            {/* The Old Way */}
            <div className="flex-1 bg-zinc-950 border border-red-900/30 rounded-[2rem] p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-900/50"></div>
              <h3 className="text-red-400 font-bold mb-8 uppercase tracking-widest text-sm flex items-center gap-2">
                <span className="text-xl">✕</span> The Old Way
              </h3>
              <ul className="space-y-8">
                <li>
                  <h4 className="text-xl font-bold text-white mb-2">Unpredictable CapEx</h4>
                  <p className="text-zinc-500 text-sm">Surprise $5,000+ repair bills when gate operators fail, requiring emergency board approvals.</p>
                </li>
                <li>
                  <h4 className="text-xl font-bold text-white mb-2">Expensive Physical Guards</h4>
                  <p className="text-zinc-500 text-sm">$150,000+ annual salaries for guards prone to human error, fatigue, and turnover.</p>
                </li>
                <li>
                  <h4 className="text-xl font-bold text-white mb-2">Fragmented Systems</h4>
                  <p className="text-zinc-500 text-sm">Residents juggling 3 different apps and fobs for the gate, the lobby, and the gym.</p>
                </li>
                <li>
                  <h4 className="text-xl font-bold text-white mb-2">Reactive Maintenance</h4>
                  <p className="text-zinc-500 text-sm">You only know the gate is broken when a resident calls to complain they are locked out.</p>
                </li>
              </ul>
            </div>

            {/* The GateGuard Way */}
            <div className="flex-1 bg-gradient-to-br from-zinc-900 to-[#0A192F] border border-cyan-500/30 rounded-[2rem] p-8 md:p-12 relative shadow-[0_0_40px_rgba(6,182,212,0.1)] transform lg:-translate-y-4">
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
              <h3 className="text-cyan-400 font-bold mb-8 uppercase tracking-widest text-sm flex items-center gap-2">
                <span className="text-xl">✓</span> The GateGuard Advantage
              </h3>
              <ul className="space-y-8">
                <li>
                  <h4 className="text-xl font-bold text-white mb-2">Predictable Per-Unit OpEx</h4>
                  <p className="text-zinc-300 text-sm">One nominal monthly fee covers tech, operators, parts, and labor. Budgeting becomes effortless.</p>
                </li>
                <li>
                  <h4 className="text-xl font-bold text-white mb-2">24/7 AI & Video Concierge</h4>
                  <p className="text-zinc-300 text-sm">Flawless, unblinking oversight. Verify IDs and log every plate for a fraction of a guard's salary.</p>
                </li>
                <li>
                  <h4 className="text-xl font-bold text-white mb-2">Unified Brivo Ecosystem</h4>
                  <p className="text-zinc-300 text-sm">One app for everything. Cloud-based property sync makes resident management seamless.</p>
                </li>
                <li>
                  <h4 className="text-xl font-bold text-white mb-2">Proactive Zero-Downtime</h4>
                  <p className="text-zinc-300 text-sm">Our Eagle Eye cameras monitor operator health. We fix it *before* the residents even notice.</p>
                </li>
              </ul>
              <div className="mt-10 pt-8 border-t border-white/10">
                <p className="text-center text-sm font-bold text-cyan-400 uppercase tracking-widest">
                  Average Client Savings: 40-60% Annually
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION (LEAD CAPTURE) */}
      <section id="contact" className="py-32 bg-gradient-to-b from-[#050505] to-[#0A192F]">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto bg-zinc-900/50 border border-white/10 p-12 md:p-20 rounded-[3rem] backdrop-blur-xl shadow-2xl">
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">
              Secure Your <span className="text-cyan-400 italic">Estate Today.</span>
            </h2>
            <p className="text-zinc-400 text-lg mb-12 max-w-xl mx-auto">
              Join the elite Multi-Family and HOA communities already utilizing the GateGuard SaaS ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="mailto:sales@gateguard.pro" className="px-12 py-5 bg-cyan-500 text-black font-black rounded-full hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] transform hover:-translate-y-1 text-center">
                REQUEST A PROPOSAL
              </a>
              <a href="tel:+15551234567" className="px-12 py-5 bg-transparent border border-white/20 text-white font-bold rounded-full hover:border-cyan-400 hover:text-cyan-400 transition-all text-center">
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
                  <img src="/logo.png" alt="GateGuard" className="w-8 h-8 object-contain" />
                  <span className="text-xl font-black tracking-tighter italic uppercase">GateGuard</span>
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
              &copy; {new Date().getFullYear()} GateGuard Security Ecosystem. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
