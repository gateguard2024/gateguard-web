"use client";
import React, { useState } from 'react';
import Image from 'next/image';

// Define what a "Site" looks like in our data
type SiteConfig = {
  id: string;
  name: string;
  units: number;
  vehicleGates: number;
  pedGates: number;
  cameras: number;
  conciergeShifts: number;
};

export default function RadcoPortfolioCalculator() {
  // 1. Portfolio State
  const [existingSites, setExistingSites] = useState(3);
  
  // 2. Multi-Site Configuration State (Array of Sites instead of single variables)
  const [sites, setSites] = useState<SiteConfig[]>([
    { id: '1', name: 'Site 1', units: 250, vehicleGates: 2, pedGates: 2, cameras: 4, conciergeShifts: 0 }
  ]);
  
  // 3. Formalization State
  const [requestState, setRequestState] = useState<'idle' | 'submitting' | 'success'>('idle');

  // 4. Interactive Phone & Gate State (Unchanged)
  const [brivoStatus, setBrivoStatus] = useState('idle'); 
  const [visitorView, setVisitorView] = useState<'home' | 'directory' | 'packages' | 'emergency' | 'calling' | 'granted'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [callingName, setCallingName] = useState('');

  const mockDirectory = [
    'A. Anderson', 'B. Barnes', 'C. Carter', 'J. Doe', 'E. Edwards', 
    'F. Franklin', 'G. Garcia', 'M. Miller', 'S. Smith', 'T. Taylor'
  ];

  const isGateOpen = brivoStatus === 'granted' || visitorView === 'granted';

  // --- MULTI-SITE CRUD HANDLERS ---
  const handleAddSite = () => {
    const newId = Date.now().toString();
    setSites([...sites, { 
      id: newId, 
      name: `Site ${sites.length + 1}`, 
      units: 250, vehicleGates: 2, pedGates: 2, cameras: 4, conciergeShifts: 0 
    }]);
  };

  const handleRemoveSite = (idToRemove: string) => {
    if (sites.length === 1) return; // Prevent deleting the very last site
    setSites(sites.filter(site => site.id !== idToRemove));
  };

  const handleUpdateSite = (id: string, field: keyof SiteConfig, value: string | number) => {
    setSites(sites.map(site => site.id === id ? { ...site, [field]: value } : site));
  };


  // --- AGGREGATE MATH & DISCOUNT LOGIC ---
  const MINIMUM_PRICE_PER_SHIFT = 1000;
  
  let totalHardwareFee = 0;
  let totalCameraFee = 0;
  let totalConciergeFee = 0;
  let totalSetupFee = 0;
  let totalUnits = 0;

  // Loop through every site to calculate the heavy math
  sites.forEach(site => {
    totalUnits += site.units;
    totalHardwareFee += (site.vehicleGates * 150) + (site.pedGates * 125);
    totalCameraFee += (site.cameras * 85);
    totalSetupFee += ((site.vehicleGates + site.pedGates) * 500);

    if (site.conciergeShifts > 0) {
      totalConciergeFee += Math.max(
        MINIMUM_PRICE_PER_SHIFT * site.conciergeShifts, 
        (site.units * 3) + (site.units * 1 * (site.conciergeShifts - 1))
      );
    }
  });

  // Calculate Volume Discounts
  const totalPortfolioSites = existingSites + sites.length;
  let volumeDiscountPercent = 0;
  
  if (totalPortfolioSites >= 21) volumeDiscountPercent = 0.15;
  else if (totalPortfolioSites >= 11) volumeDiscountPercent = 0.10;
  else if (totalPortfolioSites >= 6) volumeDiscountPercent = 0.05;

  // Final Subtotals
  const subtotalNewSites = totalHardwareFee + totalCameraFee + totalConciergeFee;
  const monthlyDiscountAmount = subtotalNewSites * volumeDiscountPercent;
  const finalMonthlyNewSites = subtotalNewSites - monthlyDiscountAmount;
  
  // Average Per Unit (across all quoted sites)
  const avgPerUnitMonthly = totalUnits > 0 ? (finalMonthlyNewSites / totalUnits).toFixed(2) : "0.00";

  // --- DEMO APP HANDLERS ---
  const handleBrivoTap = () => {
    if (brivoStatus !== 'idle') return;
    setBrivoStatus('loading');
    setTimeout(() => setBrivoStatus('granted'), 1200);
    setTimeout(() => setBrivoStatus('idle'), 5500); 
  };

  const handleResidentCall = (name: string) => {
    setCallingName(name);
    setVisitorView('calling');
    setTimeout(() => setVisitorView('granted'), 2500);
    setTimeout(() => {
      setVisitorView('home');
      setCallingName('');
      setSearchQuery('');
    }, 6500);
  };

  const handleFormalizeRequest = () => {
    setRequestState('submitting');
    setTimeout(() => {
      setRequestState('success');
    }, 2500);
  };

  return (
    <main className="bg-[#050505] text-white min-h-screen font-sans selection:bg-cyan-500/30 overflow-y-auto flex flex-col">
      
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Image src="/logo.png" alt="Gate Guard" width={64} height={64} className="object-contain" />
          <span className="text-zinc-600 text-xl font-light">✕</span>
          <Image src="/radco_logo.png" alt="Radco Properties" width={64} height={64} className="object-contain" />
          
          <div className="ml-4 border-l border-white/10 pl-6 hidden sm:block">
            <span className="text-xl font-black tracking-tighter uppercase italic block leading-none text-white">Gate Guard</span>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-cyan-500">Asset Manager Portal</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* LEFT 2/3: THE CALCULATOR & LIVE DEMO */}
        <div className="lg:w-2/3 p-8 lg:p-12 overflow-y-auto border-r border-white/5 bg-gradient-to-br from-[#050505] to-[#0a0f1a]">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* 1. Portfolio Scale Summary */}
            <div>
              <h2 className="text-3xl font-black mb-8 tracking-tight">Portfolio <span className="text-cyan-400">Scale</span></h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Active Sites Input */}
                <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
                  <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block mb-3">Active Sites on Gate Guard</label>
                  <div className="flex items-center gap-3">
                    <input type="number" min="0" value={existingSites} onChange={(e) => setExistingSites(Number(e.target.value))} className="w-20 bg-zinc-900 border border-white/10 rounded-xl p-2 text-white font-bold outline-none focus:border-cyan-500 text-center" />
                    <span className="text-xs font-bold text-zinc-500">Sites</span>
                  </div>
                </div>

                {/* Discount Tier Display */}
                <div className="bg-cyan-900/10 border border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee]"></div>
                  <h3 className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-1">Volume Discount Tier</h3>
                  <div className="flex items-center justify-center gap-1">
                     <span className="text-4xl font-black text-white">{volumeDiscountPercent * 100}%</span>
                     <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">OFF</span>
                  </div>
                  <p className="text-[9px] text-zinc-500 mt-2">Based on {totalPortfolioSites} total sites.</p>
                </div>

                {/* Blended Avg OpEx */}
                <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                  <h3 className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1">Blended Predictable OpEx</h3>
                  <div className="flex items-end justify-center gap-1">
                     <span className="text-4xl font-black text-white">${avgPerUnitMonthly}</span>
                  </div>
                  <p className="text-[9px] text-zinc-500 mt-2">Average per unit / month across {sites.length} quoted sites.</p>
                </div>
              </div>
            </div>

            {/* 2. Multi-Site Configuration List */}
            <div>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-black tracking-tight">Site <span className="text-cyan-400">Configurations</span></h2>
                <span className="text-zinc-500 text-sm font-bold bg-zinc-900 px-4 py-2 rounded-full border border-white/10">Quoting {sites.length} Sites</span>
              </div>

              <div className="space-y-8">
                {sites.map((site, index) => (
                  <div key={site.id} className="bg-black/40 border border-white/10 rounded-3xl p-8 relative group transition-all hover:border-cyan-500/30">
                    
                    {/* Site Header & Delete Button */}
                    <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-black text-sm">
                          {index + 1}
                        </div>
                        <input 
                          type="text" 
                          value={site.name} 
                          onChange={(e) => handleUpdateSite(site.id, 'name', e.target.value)}
                          className="bg-transparent text-xl font-bold text-white outline-none focus:border-b border-cyan-500 w-48 transition-all"
                        />
                      </div>
                      
                      {sites.length > 1 && (
                        <button 
                          onClick={() => handleRemoveSite(site.id)}
                          className="text-zinc-600 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-1"
                        >
                          <span>✕ Remove</span>
                        </button>
                      )}
                    </div>

                    {/* Site Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                      <div className="md:col-span-2">
                        <div className="flex justify-between mb-2">
                          <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block">Property Scale (Units)</label>
                          <span className="text-cyan-400 font-black text-sm">{site.units}</span>
                        </div>
                        <input type="range" min="50" max="1000" step="10" value={site.units} onChange={(e) => handleUpdateSite(site.id, 'units', Number(e.target.value))} className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                      </div>
                      
                      <div>
                        <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block mb-2">Vehicle Gates</label>
                        <input type="number" min="0" value={site.vehicleGates} onChange={(e) => handleUpdateSite(site.id, 'vehicleGates', Number(e.target.value))} className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500 transition-all" />
                      </div>
                      
                      <div>
                        <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block mb-2">Pedestrian Doors</label>
                        <input type="number" min="0" value={site.pedGates} onChange={(e) => handleUpdateSite(site.id, 'pedGates', Number(e.target.value))} className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500 transition-all" />
                      </div>
                      
                      <div>
                        <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block mb-2">Camera Monitoring</label>
                        <input type="number" min="0" value={site.cameras} onChange={(e) => handleUpdateSite(site.id, 'cameras', Number(e.target.value))} className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500 transition-all" />
                      </div>
                      
                      <div>
                        <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block mb-2">2-Way Video Concierge</label>
                        <select value={site.conciergeShifts} onChange={(e) => handleUpdateSite(site.id, 'conciergeShifts', Number(e.target.value))} className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500 appearance-none transition-all">
                          <option value="0">Self-Managed (App Only)</option>
                          <option value="1">Night Shift Only</option>
                          <option value="2">2 Shifts</option>
                          <option value="3">24/7 Full Coverage</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Site Button */}
              <button 
                onClick={handleAddSite}
                className="mt-8 w-full py-6 border-2 border-dashed border-zinc-800 hover:border-cyan-500/50 hover:bg-cyan-500/5 rounded-3xl text-zinc-500 hover:text-cyan-400 transition-all flex items-center justify-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-900 group-hover:bg-cyan-500/20 flex items-center justify-center text-xl font-light transition-all">+</div>
                <span className="font-bold uppercase tracking-widest text-xs">Add Another Site To Quote</span>
              </button>
            </div>

            {/* 3. Interactive App Demo Section (Truncated for brevity, but stays visually exactly identical to previous code!) */}
            <div className="pt-10 border-t border-white/10">
              <h2 className="text-2xl font-black mb-2 tracking-tight">Interactive <span className="text-cyan-400">Simulation</span></h2>
              <p className="text-zinc-500 text-sm mb-8">Test the resident and visitor experience in real-time.</p>
              
              {/* LIVE GATE CAMERA FEED */}
              <div className="relative w-full h-64 sm:h-80 rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl group">
                <Image src="/gate-closed.jpg" alt="Main Gate Closed" fill className="object-cover" />
                <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isGateOpen ? 'opacity-100' : 'opacity-0'}`}>
                   <Image src="/gate-open.jpg" alt="Main Gate Open" fill className="object-cover" />
                </div>
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                    <div className={`w-2 h-2 rounded-full ${isGateOpen ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-white">LIVE CAM 01 • MAIN ENTRY</p>
                </div>
                 <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
                    <p className="text-[8px] uppercase tracking-widest text-zinc-400 mb-1">System Status</p>
                    <p className={`text-lg font-black uppercase tracking-tight transition-colors duration-300 ${isGateOpen ? 'text-emerald-400' : 'text-white'}`}>
                        {isGateOpen ? '✓ GATE OPENING' : 'SECURE & CLOSED'}
                    </p>
                </div>
              </div>

              {/* ... (Keep the exact Brivo & Visitor Callbox blocks right here) ... */}
            </div>

          </div>
        </div>

        {/* RIGHT 1/3: PORTFOLIO QUOTE & FORMALIZATION */}
        <div className="lg:w-1/3 p-8 lg:p-12 bg-[#050505] border-l border-white/5 flex flex-col relative">
          <div className="max-w-sm mx-auto w-full sticky top-10">
            
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Addendum Quote</h3>
                <p className="text-zinc-500 text-xs font-light leading-relaxed">Quote for adding {sites.length} new site(s) to the master agreement.</p>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/10 shrink-0 ml-4">
                <Image src="/radco_logo.png" alt="Radco" width={48} height={48} className="object-contain opacity-80" />
              </div>
            </div>

            {/* Request Flow States */}
            {requestState === 'idle' && (
              <div className="animate-[fadeIn_0.5s_ease-out]">
                {/* Real-time Invoice Block */}
                <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800 p-6 shadow-2xl mb-6">
                  <div className="flex justify-between items-end border-b border-zinc-800 pb-4 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Aggregated Services</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Base Fee</span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-white">Hardware & App Infrastructure</p>
                      <span className="text-sm font-medium text-white">${totalHardwareFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-white">Camera Monitoring</p>
                      <span className="text-sm font-medium text-white">${totalCameraFee.toLocaleString()}</span>
                    </div>
                    {totalConciergeFee > 0 && (
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-white">Live Video Concierge</p>
                        <span className="text-sm font-medium text-white">${totalConciergeFee.toLocaleString()}</span>
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
                    <span className="text-[10px] text-zinc-500 font-medium">Estimated Hardware Setup Total</span>
                    <span className="text-[10px] font-bold text-zinc-300">${totalSetupFee.toLocaleString()}</span>
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
                  Your dedicated Gate Guard rep has been notified. We are drafting the addendum for the <strong>{sites.length} new site(s)</strong> at the <strong>{volumeDiscountPercent * 100}% volume tier</strong>.
                </p>
                <button 
                  onClick={() => {
                    setRequestState('idle');
                    setExistingSites(existingSites + sites.length);
                    // Reset back to 1 default site
                    setSites([{ id: Date.now().toString(), name: 'Site 1', units: 250, vehicleGates: 2, pedGates: 2, cameras: 4, conciergeShifts: 0 }]);
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
