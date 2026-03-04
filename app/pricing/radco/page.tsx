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

  // 2. Portfolio & Multi-Site State
  const [existingSites, setExistingSites] = useState(3); // Assuming Radco already has 3 live sites
  const [newSites, setNewSites] = useState(1);
  
  // 3. Formalization State
  const [requestState, setRequestState] = useState<'idle' | 'submitting' | 'success'>('idle');

  // 4. Interactive Phone & Gate State
  const [brivoStatus, setBrivoStatus] = useState('idle'); 
  const [visitorView, setVisitorView] = useState<'home' | 'directory' | 'packages' | 'emergency' | 'calling' | 'granted'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [callingName, setCallingName] = useState('');

  // Mock Database for the Directory Search
  const mockDirectory = [
    'A. Anderson', 'B. Barnes', 'C. Carter', 'J. Doe', 'E. Edwards', 
    'F. Franklin', 'G. Garcia', 'M. Miller', 'S. Smith', 'T. Taylor'
  ];

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
          {/* Your Logo - Made much larger to match Radco */}
          <Image src="/logo.png" alt="Gate Guard" width={64} height={64} className="object-contain" />
          
          {/* Co-brand Divider */}
          <span className="text-zinc-600 text-xl font-light">✕</span>
          
          {/* Radco Logo */}
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
            
            {/* 1. Portfolio Scale Section */}
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

            {/* 2. Property Config Section (Restored Inputs!) */}
            <div>
              <h2 className="text-3xl font-black mb-8 tracking-tight">Standard <span className="text-cyan-400">Configuration</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* RESTORED INPUTS START HERE */}
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block">Property Scale (Units)</label>
                      <span className="text-cyan-400 font-black text-sm">{units}</span>
                    </div>
                    <input type="range" min="50" max="1000" step="10" value={units} onChange={(e) => setUnits(Number(e.target.value))} className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block mb-2">Vehicle Gates</label>
                      <input type="number" min="0" value={vehicleGates} onChange={(e) => setVehicleGates(Number(e.target.value))} className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500" />
                    </div>
                    <div>
                      <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block mb-2">Pedestrian Doors</label>
                      <input type="number" min="0" value={pedGates} onChange={(e) => setPedGates(Number(e.target.value))} className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500" />
                    </div>
                  </div>
                  <div>
                    <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block mb-2">Camera Monitoring</label>
                    <input type="number" min="0" value={cameras} onChange={(e) => setCameras(Number(e.target.value))} className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500" />
                  </div>
                  <div>
                    <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block mb-2">2-Way Video Concierge</label>
                    <select value={conciergeShifts} onChange={(e) => setConciergeShifts(Number(e.target.value))} className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500 appearance-none">
                      <option value="0">Self-Managed (App Only)</option>
                      <option value="1">Night Shift Only</option>
                      <option value="2">2 Shifts</option>
                      <option value="3">24/7 Full Coverage</option>
                    </select>
                  </div>
                </div>
                {/* RESTORED INPUTS END HERE */}

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

            {/* 3. Interactive App Demo Section */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-items-center">
                
                {/* BRIVO SIMULATION */}
                <div className="flex flex-col items-center">
                  <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-4">Resident Mobile Pass</p>
                  <div 
                    onClick={handleBrivoTap} 
                    className="relative w-64 h-[550px] bg-black rounded-[3rem] border-[6px] border-[#1a1a1c] shadow-2xl overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02]"
                  >
                    <Image src="/app-brivo.png" alt="Brivo" fill className="object-cover opacity-90" />
                    
                    {brivoStatus === 'idle' && (
                      <div className="absolute top-[68%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                        <div className="absolute w-28 h-28 border-[1px] border-blue-400/30 rounded-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                        <div className="absolute w-20 h-20 border-[2px] border-blue-400/50 rounded-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite_500ms]"></div>
                        <div className="w-14 h-14 bg-blue-500/10 rounded-full shadow-[0_0_40px_rgba(59,130,246,0.6)] cursor-pointer"></div>
                      </div>
                    )}

                    {brivoStatus === 'loading' && (
                      <div className="absolute inset-0 bg-[#0f1423]/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest animate-pulse">Authenticating...</p>
                      </div>
                    )}

                    {brivoStatus === 'granted' && (
                      <div className="absolute inset-0 bg-emerald-500/90 backdrop-blur-md flex flex-col items-center justify-center z-30 transition-all duration-300">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-xl">
                          <span className="text-emerald-500 text-2xl font-black">✓</span>
                        </div>
                        <p className="text-white text-base font-black uppercase tracking-wider shadow-sm">Access Granted</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* THE 100% CODE-DRIVEN VISITOR CALLBOX APP */}
                <div className="flex flex-col items-center">
                  <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-4">Visitor Callbox Intercom</p>
                  <div className="relative w-64 h-[550px] bg-[#050505] rounded-[3rem] border-[6px] border-[#1a1a1c] shadow-2xl overflow-hidden text-white font-sans">
                    
                    {/* View 1: Home Screen */}
                    {visitorView === 'home' && (
                      <div className="absolute inset-0 flex flex-col pt-10 px-4">
                        <div className="flex flex-col items-center mb-6">
                           <div className="w-16 h-16 bg-[#0a0a0a] rounded-xl flex items-center justify-center mb-4 border border-white/10 shadow-lg">
                             <Image src="/logo.png" alt="Logo" width={32} height={32} />
                           </div>
                           <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-1">Welcome To</p>
                           <h4 className="text-base font-black uppercase tracking-wider mb-1">Elevate Eagles</h4>
                           <p className="text-[8px] text-zinc-500 font-medium tracking-wider mb-4">123 MAIN ST, DALL ORDLHO, GA</p>
                           <div className="bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                             <span className="text-[7px] font-bold uppercase tracking-widest text-blue-400">System Active</span>
                           </div>
                        </div>

                        <div className="space-y-3 px-2">
                          <div onClick={() => setVisitorView('directory')} className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-3 flex items-center gap-4 cursor-pointer hover:border-blue-500/50 transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-wider flex-1">Directory</span>
                            <span className="text-zinc-600">›</span>
                          </div>
                          <div onClick={() => handleResidentCall('Leasing Office')} className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-3 flex items-center gap-4 cursor-pointer hover:border-zinc-500 transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-700 transition-colors">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-wider flex-1">Call Leasing</span>
                            <span className="text-zinc-600">›</span>
                          </div>
                          <div onClick={() => setVisitorView('packages')} className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-3 flex items-center gap-4 cursor-pointer hover:border-zinc-500 transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-700 transition-colors">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-wider flex-1">Packages</span>
                            <span className="text-zinc-600">›</span>
                          </div>
                          <div onClick={() => setVisitorView('emergency')} className="bg-[#0a0a0a] border border-red-900/50 rounded-2xl p-3 flex items-center gap-4 cursor-pointer hover:border-red-500/50 transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-wider flex-1">Emergency</span>
                            <span className="text-red-900">›</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* View 2: Directory Search Flow */}
                    {visitorView === 'directory' && (
                      <div className="absolute inset-0 bg-[#050505] flex flex-col pt-12 pb-6 px-4 z-20">
                        <div className="flex items-center mb-6 relative">
                          <button onClick={() => setVisitorView('home')} className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors absolute left-0">
                            <span className="text-zinc-400 text-sm">←</span>
                          </button>
                          <div className="flex-1 text-center">
                            <h3 className="text-blue-500 font-black text-[9px] uppercase tracking-widest italic leading-none">Directory</h3>
                            <span className="text-[7px] text-zinc-500 uppercase tracking-widest">Elevate Eagles</span>
                          </div>
                        </div>
                        
                        <div className="bg-[#111] border border-zinc-800 rounded-xl p-3 mb-2 flex items-center gap-3 shadow-inner focus-within:border-blue-500/50 transition-colors">
                          <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          <input 
                            type="text" 
                            placeholder="Search Residents..." 
                            className="bg-transparent outline-none text-white text-xs w-full placeholder:text-zinc-600" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <p className="text-center text-[7px] font-bold text-zinc-600 uppercase tracking-widest italic mb-6">Search by first or last name</p>
                        
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
                          {searchQuery.length < 3 ? (
                            <div className="text-center text-zinc-600 mt-10">
                              <p className="text-[10px] uppercase tracking-widest">Type 3 letters to search</p>
                            </div>
                          ) : (
                            mockDirectory.filter(n => n.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                              mockDirectory.filter(n => n.toLowerCase().includes(searchQuery.toLowerCase())).map((name) => (
                                <div 
                                  key={name} 
                                  onClick={() => handleResidentCall(name)}
                                  className="p-3 bg-[#0a0a0a] rounded-xl border border-zinc-800 hover:border-blue-500/50 cursor-pointer flex justify-between items-center transition-all group"
                                >
                                  <span className="text-white text-xs font-medium">{name}</span>
                                  <span className="text-blue-400 text-[8px] uppercase font-black tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-colors">Call</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-center text-zinc-600 text-[10px] mt-10 uppercase tracking-widest">No residents found.</p>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* View 3: Packages Flow */}
                    {visitorView === 'packages' && (
                      <div className="absolute inset-0 bg-[#050505] flex flex-col pt-12 px-4 z-20">
                        <div className="flex items-center mb-10 relative">
                          <button onClick={() => setVisitorView('home')} className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors absolute left-0">
                            <span className="text-zinc-400 text-sm">←</span>
                          </button>
                          <div className="flex-1 text-center">
                            <h3 className="text-blue-500 font-black text-[9px] uppercase tracking-widest italic leading-none">Packages</h3>
                            <span className="text-[7px] text-zinc-500 uppercase tracking-widest">Elevate Eagles</span>
                          </div>
                        </div>
                        
                        <div className="bg-[#0a0a0a] border border-blue-500/30 rounded-3xl p-6 flex flex-col items-center text-center shadow-[0_0_30px_rgba(59,130,246,0.05)] mb-4">
                           <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                           </div>
                           <h2 className="text-lg font-black uppercase italic tracking-wider text-white mb-2">Deliveries</h2>
                           <p className="text-[9px] text-zinc-400 leading-relaxed font-light">All couriers must log their details to request gate access. Packages cannot be left at the gate.</p>
                        </div>
                      </div>
                    )}

                    {/* View 4: Emergency Flow */}
                    {visitorView === 'emergency' && (
                      <div className="absolute inset-0 bg-[#050505] flex flex-col pt-12 px-4 z-20">
                        <div className="flex items-center mb-10 relative">
                          <button onClick={() => setVisitorView('home')} className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors absolute left-0">
                            <span className="text-zinc-400 text-sm">←</span>
                          </button>
                          <div className="flex-1 text-center">
                            <h3 className="text-red-500 font-black text-[9px] uppercase tracking-widest italic leading-none">Emergency</h3>
                            <span className="text-[7px] text-zinc-500 uppercase tracking-widest">Elevate Eagles</span>
                          </div>
                        </div>
                        
                        <div className="bg-[#0a0a0a] border border-red-900/50 rounded-3xl p-6 flex flex-col items-center text-center shadow-[0_0_30px_rgba(239,68,68,0.05)] mb-4">
                           <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                           </div>
                           <h2 className="text-lg font-black uppercase italic tracking-wider text-white mb-2">Dial 911</h2>
                           <p className="text-[9px] text-zinc-400 leading-relaxed font-light">If you are experiencing a medical emergency, fire, or an immediate threat to life or property safety, please call 911 immediately.</p>
                        </div>
                      </div>
                    )}

                    {/* View 5: Calling State */}
                    {visitorView === 'calling' && (
                      <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center z-30">
                        <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 relative">
                          <div className="absolute inset-0 border border-blue-500/30 rounded-full animate-ping"></div>
                          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </div>
                        <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 animate-pulse">Dialing Over Secure Network</p>
                        <p className="text-white font-black text-xl tracking-tight">{callingName}</p>
                      </div>
                    )}

                    {/* View 6: Granted State */}
                    {visitorView === 'granted' && (
                      <div className="absolute inset-0 bg-emerald-500 flex flex-col items-center justify-center z-40 transition-all duration-300">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl">
                          <span className="text-emerald-500 text-4xl font-black">✓</span>
                        </div>
                        <p className="text-white text-2xl font-black uppercase tracking-wider shadow-sm">Gate Opened</p>
                        <p className="text-emerald-100 text-[10px] uppercase font-bold tracking-[0.2em] mt-2">Authorized by {callingName}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT 1/3: PORTFOLIO QUOTE & FORMALIZATION */}
        <div className="lg:w-1/3 p-8 lg:p-12 bg-[#050505] border-l border-white/5 flex flex-col relative">
          <div className="max-w-sm mx-auto w-full sticky top-10">
            
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Addendum Quote</h3>
                <p className="text-zinc-500 text-xs font-light leading-relaxed">Quote for adding {newSites} new site(s) to the master agreement.</p>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/10 shrink-0 ml-4">
                {/* Radco Logo in Quote Box */}
                <Image src="/radco_logo.png" alt="Radco" width={48} height={48} className="object-contain opacity-80" />
              </div>
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
                    setExistingSites(existingSites + newSites);
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
