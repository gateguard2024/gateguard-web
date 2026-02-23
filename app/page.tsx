import React from 'react';

export default function Home() {
  return (
    <main className="bg-[#050505] text-white min-h-screen selection:bg-blue-600/30 font-sans">
      
      {/* 1. NAVIGATION BAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <img 
                src="/logo.svg" 
                alt="GateGuard Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-none text-white">GateGuard</span>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-500 mt-1">Security Ecosystem</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            <a href="#solutions" className="hover:text-blue-400 transition-colors uppercase">Solutions</a>
            <a href="#hardware" className="hover:text-blue-400 transition-colors uppercase">Hardware</a>
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black transition-all shadow-xl shadow-blue-900/40">GET A QUOTE</button>
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
                <span className="text-zinc-500 font-bold tracking-tighter italic text-zinc-500">The Solution is </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Intelligent.</span>
              </h1>
              <p className="text-zinc-400 text-lg lg:text-xl mb-12 max-w-xl leading-relaxed italic">
                "Replace outdated fobs and expensive guards with an AI-driven ecosystem."
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <button className="px-10 py-5 bg-blue-600 text-white font-black rounded-xl hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)] transition-all transform hover:-translate-y-1">BOOK A LIVE DEMO</button>
                <button className="px-10 py-5 bg-zinc-900/50 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all backdrop-blur-sm">ROI CALCULATOR</button>
              </div>
            </div>
            <div className="flex-1 w-full max-w-2xl relative group">
              <div className="absolute -inset-1 bg-blue-500 rounded-[2.5rem] blur opacity-10"></div>
              <div className="relative bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-4 shadow-2xl overflow-hidden">
                <div className="aspect-video bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5 relative">
                   <div className="text-center">
                      <div className="text-6xl mb-4 opacity-40 grayscale">🔒</div>
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
        <div className="container mx-auto px-6 text-center">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-12 italic">Protecting Premier Properties</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 grayscale opacity-40">
            {['HOA MANAGERS', 'MULTI-FAMILY', 'GATED ESTATES', 'COMMERCIAL HUB'].map((t) => (
              <span key={t} className="text-sm font-black tracking-tighter text-white uppercase italic">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ECOSYSTEM SECTION */}
      <section className="py-32 bg-[#080808]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 italic uppercase tracking-tighter">One Gate. <span className="text-blue-500">Two Powerhouse Apps.</span></h2>
            <p className="text-zinc-500 max-w-2xl mx-auto italic font-normal normal-case tracking-normal text-sm">"Residents use Brivo for access; Managers use GateGuard for intelligence."</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-zinc-900/30 border border-white/5 p-10 rounded-[2.5rem] hover:border-blue-500/20 transition-all">
               <h3 className="text-blue-500 font-bold mb-2 uppercase text-xs tracking-widest">Resident Access</h3>
               <h4 className="text-2xl font-bold mb-4">Brivo Mobile Pass</h4>
               <p className="text-zinc-400 italic">"Bluetooth & NFC entry for residents. Secure and seamless."</p>
            </div>
            <div className="bg-zinc-900/30 border border-white/5 p-10 rounded-[2.5rem] hover:border-blue-400/20 transition-all">
               <h3 className="text-blue-400 font-bold mb-2 uppercase text-xs tracking-widest">Admin Intelligence</h3>
               <h4 className="text-2xl font-bold mb-4 text-white">GateGuard Interactive</h4>
               <p className="text-zinc-400 italic">"Real-time AI video feeds and remote gate override."</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HARDWARE SECTION */}
      <section id="hardware" className="py-32 bg-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 relative">
              <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full opacity-30"></div>
              <div className="relative aspect-square bg-zinc-900 border border-white/10 rounded-3xl flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="w-48 h-64 bg-zinc-800 rounded-lg border-2 border-blue-500/50 shadow-[0_0_50px_-10px_rgba(59,130,246,0.5)] mb-6 mx-auto relative overflow-hidden">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                    <div className="mt-20 px-4 space-y-2">
                      <div className="h-1 w-full bg-blue-500/20"></div>
                      <div className="h-1 w-2/3 bg-blue-500/20"></div>
                    </div>
                  </div>
                  <p className="text-blue-400 font-mono text-[10px] tracking-widest uppercase italic">Edge Controller v2.0</p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-10 leading-tight italic uppercase tracking-tighter">Proprietary AI <br/><span className="text-blue-500 italic">Hardware Integration</span></h2>
              <div className="space-y-10">
                <div className="flex gap-6 group">
                  <div className="text-2xl text-blue-500 font-black italic tracking-tighter">01</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 italic uppercase tracking-tighter">AI Plate Recognition</h4>
                    <p className="text-zinc-500 leading-relaxed italic text-sm font-normal">"Edge-processing cameras identify authorized plates in under 400ms."</p>
                  </div>
                </div>
                <div className="flex gap-6 group">
                  <div className="text-2xl text-blue-500 font-black italic tracking-tighter">02</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-white italic uppercase tracking-tighter">Brivo Cloud Sync</h4>
                    <p className="text-zinc-500 leading-relaxed italic text-sm font-normal">"Seamlessly links your existing Brivo credentials with our AI brain."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section id="contact" className="py-32 bg-gradient-to-b from-black to-blue-900/20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto bg-zinc-900/50 border border-white/10 p-12 md:p-20 rounded-[3rem] backdrop-blur-xl">
            <h2 className="text-4xl md:text-6xl font-black mb-8 italic uppercase tracking-tighter">
              Secure Your <span className="text-blue-500 font-bold">Estate Today.</span>
            </h2>
            <p className="text-zinc-400 text-lg mb-12 max-w-xl mx-auto italic">
              "Join the elite communities already utilizing GateGuard's AI-driven ecosystem."
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="mailto:sales@gateguard.pro" className="px-12 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-900/50 transform hover:-translate-y-1 text-center">
                REQUEST A PROPOSAL
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-20 border-t border-white/5 bg-black">
        <div className="container mx-auto px-6 text-center text-zinc-600 font-bold italic uppercase">
          <p className="text-[10px] tracking-[0.5em]">
            &copy; {new Date().getFullYear()} GateGuard Tech Ecosystem. All Rights Reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
