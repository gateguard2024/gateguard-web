import React from 'react';

export default function Home() {
  return (
    <main className="bg-[#050505] text-white min-h-screen selection:bg-cyan-500/30 font-sans">
      
      {/* 1. NAVIGATION BAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-xs">GG</span>
            </div>
            <span className="text-xl font-bold tracking-tighter">GateGuard</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-cyan-400 transition-colors">Solutions</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">App</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
            <button className="px-5 py-2 bg-white text-black rounded-full font-bold hover:bg-cyan-400 transition-all">
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* 2. PREMIUM HERO SECTION */}
      <section className="relative pt-44 pb-32 overflow-hidden">
        {/* Advanced Glow Backgrounds */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left: Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-[10px] font-bold tracking-[0.2em] uppercase bg-white/5 border border-white/10 rounded-full text-cyan-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Next-Gen Security
              </div>
              <h1 className="text-6xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[0.9]">
                Intelligent <br />
                Access. <span className="text-zinc-500">Unrivaled Security.</span>
              </h1>
              <p className="text-zinc-400 text-lg lg:text-xl mb-12 max-w-xl leading-relaxed">
                The world’s first AI-integrated gate ecosystem designed for high-end residential and commercial estates.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <button className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-black rounded-xl hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.4)] transition-all transform hover:-translate-y-1">
                  REQUEST ACCESS
                </button>
                <button className="px-10 py-5 bg-zinc-900/50 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all backdrop-blur-sm">
                  SYSTEM OVERVIEW
                </button>
              </div>
            </div>

            {/* Right: The "Dashboard" Mockup */}
            <div className="flex-1 w-full max-w-2xl relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-4 shadow-2xl overflow-hidden">
                {/* Simulated App Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">ENCRYPTED_FEED_01.LIVE</div>
                </div>
                {/* Simulated Hero Image (Dark Gate Area) */}
                <div className="aspect-video bg-zinc-900 rounded-2xl m-2 overflow-hidden relative">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 grayscale" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                   <div className="absolute bottom-6 left-6">
                      <p className="text-[10px] font-bold text-cyan-400 mb-1">MAIN ENTRANCE</p>
                      <p className="text-2xl font-black">Gate 01 Locked</p>
                   </div>
                   <div className="absolute top-6 right-6 px-3 py-1 bg-cyan-500 text-[10px] font-black text-black rounded uppercase">Live Feed</div>
                </div>
                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-2 p-2">
                   {[
                    { label: 'Uptime', val: '99.9%' },
                    { label: 'Latency', val: '0.4ms' },
                    { label: 'Auth', val: 'AI-Bio' }
                   ].map(stat => (
                     <div key={stat.label} className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                        <p className="text-[9px] text-zinc-500 font-bold uppercase mb-1">{stat.label}</p>
                        <p className="text-sm font-bold text-white">{stat.val}</p>
                     </div>
                   ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. INDUSTRY SECTORS (TRUST) */}
      <section className="py-20 bg-zinc-950 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-between items-center gap-12 text-zinc-600 font-black text-xs tracking-[0.4em]">
            <span className="hover:text-zinc-400 transition-colors cursor-default">HOA MANAGERS</span>
            <span className="hover:text-zinc-400 transition-colors cursor-default">MULTI-FAMILY</span>
            <span className="hover:text-zinc-400 transition-colors cursor-default">GATED ESTATES</span>
            <span className="hover:text-zinc-400 transition-colors cursor-default">COMMERCIAL HUB</span>
          </div>
        </div>
      </section>

      {/* 4. THE ECOSYSTEM: GateGuard + Brivo */}
<section className="py-32 bg-[#080808] relative overflow-hidden">
  <div className="container mx-auto px-6">
    <div className="text-center mb-20">
      <h2 className="text-4xl md:text-5xl font-bold mb-6">One Gate. <span className="text-cyan-400">Two Powerhouse Apps.</span></h2>
      <p className="text-zinc-500 max-w-2xl mx-auto italic">
        "We’ve streamlined the experience. Residents use Brivo for access; Managers use GateGuard for intelligence."
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Resident Side: Brivo */}
      <div className="relative group p-1 bg-gradient-to-b from-blue-500/20 to-transparent rounded-[2.5rem]">
        <div className="bg-zinc-950 rounded-[2.4rem] p-10 h-full border border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white">B</div>
            <div>
              <h4 className="text-blue-400 font-bold text-sm uppercase tracking-widest">Resident Access</h4>
              <h3 className="text-2xl font-bold">Brivo Mobile Pass</h3>
            </div>
          </div>
          <ul className="space-y-4 text-zinc-400">
            <li className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">✓</span>
              <span>Frictionless Bluetooth & NFC entry for residents.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">✓</span>
              <span>Military-grade credential encryption.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">✓</span>
              <span>Eliminates the need for physical fobs.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Admin Side: GateGuard */}
      <div className="relative group p-1 bg-gradient-to-b from-cyan-500/20 to-transparent rounded-[2.5rem]">
        <div className="bg-zinc-950 rounded-[2.4rem] p-10 h-full border border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center text-black font-black">GG</div>
            <div>
              <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-widest">Admin Intelligence</h4>
              <h3 className="text-2xl font-bold">GateGuard Interactive</h3>
            </div>
          </div>
          <ul className="space-y-4 text-zinc-400">
            <li className="flex items-start gap-3">
              <span className="text-cyan-500 mt-1">✓</span>
              <span>Real-time AI video feeds and plate recognition.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-500 mt-1">✓</span>
              <span>Remote gate override from any mobile device.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-500 mt-1">✓</span>
              <span>Automated guest pass generation and auditing.</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* 4. FOOTER */}
      <footer className="py-20 border-t border-white/5 bg-black">
        <div className="container mx-auto px-6 text-center">
          <p className="text-zinc-500 text-sm font-medium italic">
            &copy; {new Date().getFullYear()} GateGuard Tech Ecosystem. All Security Protocols Active.
          </p>
        </div>
      </footer>
    </main>
  );
}
