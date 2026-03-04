"use client";
import React, { useState } from 'react';
import Image from 'next/image';

export default function RadcoPortfolioCalculator() {
  // 1. Property Config State
  const [units, setUnits] = useState(250);
  const [vehicleGates, setVehicleGates] = useState(2);
  const [pedGates, setPedGates] = useState(2);
  const [cameras, setCameras] = useState(4);
  const [conciergeShifts, setConciergeShifts] = useState(0);

  // 2. NEW: Portfolio & Multi-Site State
  const [existingSites, setExistingSites] = useState(3); // Assuming Radco already has 3 live sites
  const [newSites, setNewSites] = useState(1);
  
  // 3. NEW: Formalization State
  const [requestState, setRequestState] = useState<'idle' | 'submitting' | 'success'>('idle');

  // 4. Interactive Phone & Gate State (Kept exactly the same)
  const [brivoStatus, setBrivoStatus] = useState('idle'); 
  const [visitorView, setVisitorView] = useState<'home' | 'directory' | 'packages' | 'emergency' | 'calling' | 'granted'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [callingName, setCallingName] = useState('');

  const isGateOpen = brivoStatus === 'granted' || visitorView === 'granted';

  // --- MATH & DISCOUNT LOGIC ---

  // A. Discount Tiers based on TOTAL sites (Existing + New)
  const totalPortfolioSites = existingSites + newSites;
  let volumeDiscountPercent = 0;
  
  if (totalPortfolioSites >= 21) volumeDiscountPercent = 0.15;      // 15% off for 21+ sites
  else if (totalPortfolioSites >= 11) volumeDiscountPercent = 0.10; // 10% off for 11-20 sites
  else if (totalPortfolioSites >= 6) volumeDiscountPercent = 0.05;  // 5% off for 6-10 sites

  // B. Base Per-Site Calculations
  const MINIMUM_PRICE_PER_SHIFT = 1000;
  let conciergeMonthlyPerSite = 0;
  if (conciergeShifts > 0) {
    conciergeMonthlyPerSite = Math.max(MINIMUM_PRICE_PER_SHIFT * conciergeShifts, (units * 3) + (units * 1 * (conciergeShifts - 1)));
  }
  
  const cameraMonitoringFeePerSite = cameras * 85;
  const gateGuardFeePerSite = (vehicleGates * 150) + (pedGates * 125);
  const baseTotalPerSite = gateGuardFeePerSite + cameraMonitoringFeePerSite + conciergeMonthlyPerSite;
  
  // C. Multi-Site Aggregation & Discounts (Only applied to the NEW sites being quoted)
  const subtotalNewSites = baseTotalPerSite * newSites;
  const monthlyDiscountAmount = subtotalNewSites * volumeDiscountPercent;
  const finalMonthlyNewSites = subtotalNewSites - monthlyDiscountAmount;
  const perUnitMonthly = (finalMonthlyNewSites / (units * newSites)).toFixed(2);
  const setupFeeTotal = ((vehicleGates + pedGates) * 500) * newSites;

  // --- HANDLERS ---
  const handleBrivoTap = () => { /* Same as before */ };
  const handleResidentCall = (name: string) => { /* Same as before */ };

  const handleFormalizeRequest = () => {
    setRequestState('submitting');
    // Simulate API call to backend/CRM
    setTimeout(() => {
      setRequestState('success');
    }, 2500);
  };

  return (
    <main className="bg-[#050505] text-white min-h-screen font-sans selection:bg-cyan-500/30 overflow-y-auto flex flex-col">
      
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Gate Guard" width={40} height={40} className="object-contain" />
          <div>
            <span className="text-lg font-black tracking-tighter uppercase italic block leading-none">Gate Guard</span>
            <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-cyan-500">Radco Asset Manager Portal</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* LEFT 2/3: THE CALCULATOR & LIVE DEMO */}
        <div className="lg:w-2/3 p-8 lg:p-12 overflow-y-auto border-r border-white/5 bg-gradient-to-br from-[#050505] to-[#0a0f1a]">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* 1. NEW: Portfolio Scale Section */}
            <div>
              <h2 className="text-3xl font-black mb-8 tracking-tight">Portfolio <span className="text-cyan-400">Scale</span></h2>
              <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block mb-2">Active Sites on Gate Guard</label>
                  <p className="text-xs text-zinc-500 mb-4 font-light">Your existing footprint counts toward your volume discount.</p>
                  <div className="flex items-center gap-4">
                    <input type="number" min="0" value={existingSites} onChange={(e) => setExistingSites(Number(e.target.value))} className="w-24 bg-zinc-900 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500 text-center" />
                    <span className="text-sm font-bold text-zinc-300">Sites</span>
                  </div>
                </div>
                <div>
                  <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block mb-2">New Sites to Add</label>
                  <p className="text-xs text-zinc-500 mb-4 font-light">How many identical sites are you quoting right now?</p>
                  <div className="flex items-center gap-4">
                    <input type="number" min="1" value={newSites} onChange={(e) => setNewSites(Number(e.target.value))} className="w-24 bg-cyan-900/20 border border-cyan-500/50 rounded-xl p-3 text-cyan-400 font-black outline-none focus:border-cyan-400 text-center" />
                    <span className="text-sm font-bold text-cyan-400">Sites</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Property Config Section (Same inputs, adjusted UI layout) */}
            <div>
              <h2 className="text-3xl font-black mb-8 tracking-tight">Standard <span className="text-cyan-400">Configuration</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   {/* ... Keep the exact same inputs for Units, Vehicle Gates, Ped Gates, Cameras, and Concierge here ... */}
                   {/* I've omitted them here to save space, but paste the inputs from the previous step right here. */}
                </div>

                {/* Quick Stats updated for Volume */}
                <div className="bg-black/40 border border-cyan-500/30 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center">
                  <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee]"></div>
                  
                  <div className="mb-6">
                    <h3 className="text-center text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-2">Your Discount Tier</h3>
                    <div className="flex items-center justify-center gap-2">
                       <span className="text-3xl font-black text-cyan-400">{volumeDiscountPercent * 100}%</span>
                       <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">OFF</span>
                    </div>
                    <p className="text-center text-[10px] text-zinc-500 mt-2">Based on {totalPortfolioSites} total portfolio sites.</p>
                  </div>

                  <div className="border-t border-white/10 pt-6 text-center">
                    <h3 className="text-center text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-2">Effective Predictable OpEx</h3>
                    <span className="text-5xl font-black text-white">${perUnitMonthly}</span>
                    <span className="text-zinc-500 font-bold text-sm"> / unit / mo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Interactive App Demo Section (Unchanged) */}
            {/* ... Keep the Interactive Simulation exactly as it was ... */}

          </div>
        </div>

        {/* RIGHT 1/3: PORTFOLIO QUOTE & FORMALIZATION */}
        <div className="lg:w-1/3 p-8 lg:p-12 bg-[#050505] border-l border-white/5 flex flex-col relative">
          <div className="max-w-sm mx-auto w-full sticky top-10">
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Addendum Quote</h3>
              <p className="text-zinc-500 text-xs font-light leading-relaxed">Quote for adding {newSites} new site(s) to the Radco master agreement.</p>
            </div>

            {/* Request Flow States */}
            {requestState === 'idle' && (
              <div className="animate-[fadeIn_0.5s_ease-out]">
                {/* Real-time Invoice Block */}
                <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800 p-6 shadow-2xl mb-6">
                  <div className="flex justify-between items-end border-b border-zinc-800 pb-4 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Services ({newSites} Sites)</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Base Fee</span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-white">Hardware & App Infrastructure</p>
                      <span className="text-sm font-medium text-white">${(gateGuardFeePerSite * newSites).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-white">Camera Monitoring</p>
                      <span className="text-sm font-medium text-white">${(cameraMonitoringFeePerSite * newSites).toLocaleString()}</span>
                    </div>
                    {conciergeMonthlyPerSite > 0 && (
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-white">Live Video Concierge</p>
                        <span className="text-sm font-medium text-white">${(conciergeMonthlyPerSite * newSites).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Volume Discount Line Item */}
                  {volumeDiscountPercent > 0 && (
                    <div className="bg-cyan-500/10 rounded-xl p-3 border border-cyan-500/20 flex justify-between items-center mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Volume Discount ({volumeDiscountPercent * 100}%)</span>
                      <span className="text-sm font-black text-cyan-400">- ${monthlyDiscountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Total Block */}
                  <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex justify-between items-center mb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Added Monthly</span>
                    <span className="text-2xl font-black text-white">${finalMonthlyNewSites.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] text-zinc-500 font-medium">Estimated Hardware & Setup</span>
                    <span className="text-[10px] font-bold text-zinc-300">${setupFeeTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={handleFormalizeRequest} 
                  className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black rounded-xl transition-all uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
                >
                  <span>Request Contract Addendum</span>
                  <span>→</span>
                </button>
              </div>
            )}

            {/* Submitting State */}
            {requestState === 'submitting' && (
              <div className="flex flex-col items-center justify-center py-20 animate-[fadeIn_0.3s_ease-out]">
                <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-6"></div>
                <p className="text-cyan-400 font-bold uppercase tracking-widest text-xs mb-2 animate-pulse">Drafting Addendum...</p>
                <div className="space-y-2 text-center text-[10px] text-zinc-500 font-mono">
                   <p>✓ Locking in {volumeDiscountPercent * 100}% Discount...</p>
                   <p>✓ Updating Radco Master MSA...</p>
                   <p className="text-zinc-300">⟳ Routing to Account Exec...</p>
                </div>
              </div>
            )}

            {/* Success State */}
            {requestState === 'success' && (
              <div className="animate-[fadeIn_0.5s_ease-out] bg-emerald-900/20 border border-emerald-500/30 p-8 rounded-3xl text-center">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-4xl mx-auto mb-6">✓</div>
                <h3 className="text-xl font-black text-white mb-2">Request Received</h3>
                <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                  Your dedicated Gate Guard rep has been notified. We are drafting the addendum for the <strong>{newSites} new site(s)</strong> at the <strong>{volumeDiscountPercent * 100}% volume tier</strong>.
                </p>
                <button 
                  onClick={() => {
                    setRequestState('idle');
                    setExistingSites(existingSites + newSites); // Automatically updates their footprint!
                    setNewSites(1);
                  }} 
                  className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-black rounded-xl transition-all uppercase tracking-widest text-[10px]"
                >
                  Start Another Quote
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </main>
  );
}
