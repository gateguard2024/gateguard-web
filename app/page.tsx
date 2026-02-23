import React from 'react';

export default function Home() {
  return (
    <main className="relative bg-zinc-950 text-white min-h-screen flex items-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Text Content */}
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

          {/* Visual Mockup Placeholder */}
          <div className="flex-1 relative w-full lg:w-auto">
             <div className="w-full aspect-square bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-center backdrop-blur-3xl shadow-2xl">
                <div className="text-center">
                   <div className="text-cyan-400 text-6xl mb-4">🔒</div>
                   <p className="text-zinc-500 italic font-mono">GateGuard Systems Active</p>
                </div>
             </div>
          </div>

        </div>
      </div>
      {/* Trust Bar Section */}
<section className="py-12 bg-zinc-950 border-t border-zinc-900">
  <div className="container mx-auto px-6">
    <p className="text-center text-zinc-500 text-sm font-medium uppercase tracking-widest mb-8">
      Protecting Premier Properties
    </p>
    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:opacity-100 transition-opacity">
      <span className="text-xl font-bold text-white tracking-tighter">HOA MANAGERS</span>
      <span className="text-xl font-bold text-white tracking-tighter">MULTI-FAMILY</span>
      <span className="text-xl font-bold text-white tracking-tighter">GATED ESTATES</span>
      <span className="text-xl font-bold text-white tracking-tighter">COMMERCIAL HUB</span>
      <span className="text-xl font-bold text-white tracking-tighter">STORAGE DEPOT</span>
    </div>
  </div>
</section>
    </main>
  );
}
