"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

type SiteConfig = {
  id: string;
  name: string;
  units: number;
  workingVehicleGates: number;
  nonWorkingVehicleGates: number;
  workingPedGates: number;
  nonWorkingPedGates: number;
  cameras: number;
  conciergeShifts: number;
};

export default function RadcoPortfolioCalculator() {
  const [existingSites, setExistingSites] = useState(3);
  
  const [sites, setSites] = useState<SiteConfig[]>([
    { id: '1', name: '', units: 250, workingVehicleGates: 2, nonWorkingVehicleGates: 0, workingPedGates: 2, nonWorkingPedGates: 0, cameras: 4, conciergeShifts: 0 }
  ]);
  
  const [requestState, setRequestState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [linkCopied, setLinkCopied] = useState(false);

  // 4. Interactive Phone & Gate State
  const [brivoStatus, setBrivoStatus] = useState('idle'); 
  const [visitorView, setVisitorView] = useState<'home' | 'directory' | 'packages' | 'emergency' | 'calling' | 'granted'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [callingName, setCallingName] = useState('');

  const mockDirectory = [
    'A. Anderson', 'B. Barnes', 'C. Carter', 'J. Doe', 'E. Edwards', 
    'F. Franklin', 'G. Garcia', 'M. Miller', 'S. Smith', 'T. Taylor'
  ];

  const isGateOpen = brivoStatus === 'granted' || visitorView === 'granted';

  // --- SAVE & SHARE LOGIC (URL ENCODING) ---
  useEffect(() => {
    // On load, check if there is a "?quote=" in the URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const quoteStr = params.get('quote');
      if (quoteStr) {
        try {
          const decoded = JSON.parse(atob(quoteStr));
          if (decoded.existingSites !== undefined) setExistingSites(decoded.existingSites);
          if (decoded.sites && Array.isArray(decoded.sites)) setSites(decoded.sites);
        } catch (e) {
          console.error('Failed to parse quote from URL', e);
        }
      }
    }
  }, []);

  const handleCopyLink = () => {
    const data = { existingSites, sites };
    const encoded = btoa(JSON.stringify(data));
    const url = `${window.location.origin}${window.location.pathname}?quote=${encoded}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleStartOver = () => {
    setExistingSites(3);
    setSites([{ id: Date.now().toString(), name: '', units: 250, workingVehicleGates: 2, nonWorkingVehicleGates: 0, workingPedGates: 2, nonWorkingPedGates: 0, cameras: 4, conciergeShifts: 0 }]);
    // Strip the quote parameter from the URL to truly start fresh
    window.history.replaceState(null, '', window.location.pathname);
  };


  // --- MULTI-SITE CRUD HANDLERS ---
  const handleAddSite = () => {
    const newId = Date.now().toString();
    setSites([...sites, { 
      id: newId, 
      name: '', 
      units: 250, workingVehicleGates: 2, nonWorkingVehicleGates: 0, workingPedGates: 2, nonWorkingPedGates: 0, cameras: 4, conciergeShifts: 0 
    }]);
  };

  const handleRemoveSite = (idToRemove: string) => {
    if (sites.length === 1) return; 
    setSites(sites.filter(site => site.id !== idToRemove));
  };

  const handleUpdateSite = (id: string, field: keyof SiteConfig, value: string | number) => {
    setSites(sites.map(site => site.id === id ? { ...site, [field]: value } : site));
  };

  const hasUnnamedSites = sites.some(site => site.name.trim() === '');

  // --- AGGREGATE MATH & TIERED DISCOUNT LOGIC ---
  const MINIMUM_PRICE_PER_SHIFT = 1000;
  
  let totalHardwareFee = 0;
  let totalCameraFee = 0;
  let totalConciergeFee = 0;
  let totalSetupFee = 0;
  let totalUnits = 0;
  let legacyTotal = 0; 

  sites.forEach(site => {
    totalUnits += site.units;
    
    // Monthly Maintenance & Infra Fees (Applies to both working and non-working once active)
    const totalVehicles = site.workingVehicleGates + site.nonWorkingVehicleGates;
    const totalPeds = site.workingPedGates + site.nonWorkingPedGates;
    
    totalHardwareFee += (totalVehicles * 150) + (totalPeds * 125);
    totalCameraFee += (site.cameras * 85);
    
    // Differentiated Setup Fees
    totalSetupFee += ((site.workingVehicleGates + site.workingPedGates) * 500) + ((site.nonWorkingVehicleGates + site.nonWorkingPedGates) * 6750);

    if (site.conciergeShifts > 0) {
      totalConciergeFee += Math.max(
        MINIMUM_PRICE_PER_SHIFT * site.conciergeShifts, 
        (site.units * 3) + (site.units * 1 * (site.conciergeShifts - 1))
      );
    }

    legacyTotal += (totalVehicles * 400) + (totalPeds * 150) + (site.cameras * 150) + (site.conciergeShifts > 0 ? 7200 * site.conciergeShifts : 2500);
  });

  // ENTERPRISE TIER GAMIFICATION MATH
  const totalPortfolioSites = existingSites + sites.length;
  let volumeDiscountPercent = 0;
  let currentTierName = "Standard Pricing";
  let nextTierSites: number | null = 5;
  let nextTierPercent = 0.05;
  let nextTierName = "Portfolio Tier";
  let progressBase = 0; 
  
  if (totalPortfolioSites >= 40) {
    volumeDiscountPercent = 0.20;
    currentTierName = "Strategic Partner";
    nextTierSites = null;
  } else if (totalPortfolioSites >= 20) {
    volumeDiscountPercent = 0.15;
    currentTierName = "Enterprise Tier";
    nextTierSites = 40;
    nextTierPercent = 0.20;
    nextTierName = "Strategic Partner";
    progressBase = 20;
  } else if (totalPortfolioSites >= 10) {
    volumeDiscountPercent = 0.10;
    currentTierName = "Regional Tier";
    nextTierSites = 20;
    nextTierPercent = 0.15;
    nextTierName = "Enterprise Tier";
    progressBase = 10;
  } else if (totalPortfolioSites >= 5) {
    volumeDiscountPercent = 0.05;
    currentTierName = "Portfolio Tier";
    nextTierSites = 10;
    nextTierPercent = 0.10;
    nextTierName = "Regional Tier";
    progressBase = 5;
  } else {
    volumeDiscountPercent = 0;
    currentTierName = "Standard Pricing";
    nextTierSites = 5;
    nextTierPercent = 0.05;
    nextTierName = "Portfolio Tier";
    progressBase = 0;
  }

  const sitesNeeded = nextTierSites ? nextTierSites - totalPortfolioSites : 0;
  const progressPercent = nextTierSites ? ((totalPortfolioSites - progressBase) / (nextTierSites - progressBase)) * 100 : 100;

  const subtotalNewSites = totalHardwareFee + totalCameraFee + totalConciergeFee;
  const monthlyDiscountAmount = subtotalNewSites * volumeDiscountPercent;
  const finalMonthlyNewSites = subtotalNewSites - monthlyDiscountAmount;
  const avgPerUnitMonthly = totalUnits > 0 ? (finalMonthlyNewSites / totalUnits).toFixed(2) : "0.00";

  const maxChartValue = Math.max(legacyTotal, finalMonthlyNewSites);
  const legacyBarHeight = maxChartValue > 0 ? (legacyTotal / maxChartValue) * 100 : 0;
  const newOpExBarHeight = maxChartValue > 0 ? (finalMonthlyNewSites / maxChartValue) * 100 : 0;

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
    if (hasUnnamedSites) return; 
    setRequestState('submitting');
    setTimeout(() => {
      setRequestState('success');
    }, 2500);
  };

  return (
    <main className="relative text-white min-h-screen font-sans selection:bg-cyan-500/30 overflow-y-auto flex flex-col scroll-smooth">
      
      {/* 1. ENTERPRISE BACKGROUND */}
      <div className="fixed inset-0 z-[-2] bg-[#0A0A0C]"></div>
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/10 blur-[150px] rounded-full z-[-1] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full z-[-1] pointer-events-none"></div>

      {/* Header */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0A0A0C]/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Image src="/logo.png" alt="Gate Guard" width={56} height={56} className="object-contain" />
          <span className="text-zinc-600 text-xl font-light">✕</span>
          <div className="bg-white/5 p-2 rounded-xl border border-white/10">
            <Image src="/radco_logo.png" alt="Radco Properties" width={56} height={56} className="object-contain opacity-90" />
          </div>
          <div className="ml-4 border-l border-white/10 pl-6 hidden sm:block">
            <span className="text-xl font-black tracking-tighter uppercase italic block leading-none text-white">Gate Guard</span>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-cyan-500">Asset Manager Portal</span>
          </div>
        </div>
      </div>

      {/* Sticky Navigation Tabs */}
      <div className="bg-white/[0.02] border-b border-white/5 backdrop-blur-md sticky top-[105px] z-40 hidden md:flex px-8 py-4 gap-10 text-[10px] font-bold uppercase tracking-widest text-zinc-500 shadow-xl">
         <a href="#portfolio" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><span>01.</span> Portfolio Builder</a>
         <a href="#simulation" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><span>02.</span> Live Simulation</a>
         <a href="#slas" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><span>03.</span> Service SLAs</a>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-[1800px] mx-auto w-full relative">
        
        {/* LEFT 2/3: MAIN CONTENT AREA */}
        <div className="lg:w-2/3 p-8 lg:p-12 pb-32">
          <div className="max-w-4xl mx-auto space-y-20">
            
            {/* 01. PORTFOLIO SCALE & CONFIG BUILDER */}
            <div id="portfolio" className="scroll-mt-40">
              <h2 className="text-3xl font-black mb-8 tracking-tight">Portfolio <span className="text-cyan-400">Builder</span></h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-stretch">
                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-full shadow-2xl">
                  <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block mb-4">Active Sites on Platform</label>
                  <div className="flex items-center gap-3">
                    <input type="number" min="0" value={existingSites} onChange={(e) => setExistingSites(Number(e.target.value))} className="w-20 bg-black/50 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500 text-center" />
                    <span className="text-xs font-bold text-zinc-500">Sites</span>
                  </div>
                </div>

                <div className="bg-cyan-900/10 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-between items-center text-center h-full relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee]"></div>
                  <h3 className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-2 mt-1">Volume Discount Tier</h3>
                  <div className="flex items-center justify-center gap-1 my-2">
                     <span className="text-4xl font-black text-white">{volumeDiscountPercent * 100}%</span>
                     <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">OFF</span>
                  </div>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest bg-black/30 px-3 py-1 rounded-full border border-cyan-500/20">{currentTierName}</p>
                </div>

                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between items-center text-center h-full shadow-2xl">
                  <h3 className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-2">Blended Predictable OpEx</h3>
                  <div className="flex items-end justify-center gap-1 my-2">
                     <span className="text-4xl font-black text-white">${avgPerUnitMonthly}</span>
                  </div>
                  <p className="text-[9px] text-zinc-500">Avg per unit / month across quoted sites.</p>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <h3 className="text-xl font-bold tracking-tight text-white/90">Site Configurations</h3>
                <span className="text-zinc-500 text-xs font-bold bg-black/50 px-4 py-2 rounded-full border border-white/10">Quoting {sites.length} Sites</span>
              </div>

              <div className="space-y-8">
                {sites.map((site, index) => {
                  const isUnnamed = site.name.trim() === '';
                  
                  return (
                    <div key={site.id} className={`bg-white/[0.02] backdrop-blur-xl border rounded-3xl p-8 relative group transition-all shadow-2xl ${isUnnamed ? 'border-red-900/30' : 'border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.04]'}`}>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-4 mb-8 gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${isUnnamed ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'}`}>
                            {index + 1}
                          </div>
                          <input 
                            type="text" 
                            placeholder="Enter Property Name..."
                            value={site.name} 
                            onChange={(e) => handleUpdateSite(site.id, 'name', e.target.value)}
                            className={`bg-transparent text-xl font-bold outline-none border-b-2 pb-1 w-56 sm:w-72 transition-all ${
                              isUnnamed 
                                ? 'border-red-500/30 text-white placeholder:text-zinc-600' 
                                : 'border-transparent text-white focus:border-cyan-500'
                            }`}
                          />
                        </div>
                        
                        {sites.length > 1 && (
                          <button 
                            onClick={() => handleRemoveSite(site.id)}
                            className="text-zinc-500 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-1 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5 hover:border-red-500/30"
                          >
                            <span>✕ Remove</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        <div className="md:col-span-2">
                          <div className="flex justify-between mb-2">
                            <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block">Property Scale (Units)</label>
                            <span className="text-cyan-400 font-black text-sm">{site.units}</span>
                          </div>
                          <input type="range" min="50" max="1000" step="10" value={site.units} onChange={(e) => handleUpdateSite(site.id, 'units', Number(e.target.value))} className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                        </div>
                        
                        {/* UPDATED: Working vs Non-Working Vehicle Gates */}
                        <div>
                          <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block mb-3">Vehicle Gates</label>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <span className="text-[8px] text-emerald-400/80 font-bold uppercase tracking-widest mb-1.5 block">Working</span>
                              <input type="number" min="0" value={site.workingVehicleGates} onChange={(e) => handleUpdateSite(site.id, 'workingVehicleGates', Number(e.target.value))} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500 transition-all focus:bg-white/[0.05]" />
                            </div>
                            <div className="flex-1">
                              <span className="text-[8px] text-red-400/80 font-bold uppercase tracking-widest mb-1.5 block flex items-center gap-1">Repair Needed</span>
                              <input type="number" min="0" value={site.nonWorkingVehicleGates} onChange={(e) => handleUpdateSite(site.id, 'nonWorkingVehicleGates', Number(e.target.value))} className="w-full bg-red-900/10 border border-red-500/20 rounded-xl p-3 text-red-100 font-bold outline-none focus:border-red-500 transition-all focus:bg-red-900/20" />
                            </div>
                          </div>
                        </div>
                        
                        {/* UPDATED: Working vs Non-Working Pedestrian Doors */}
                        <div>
                          <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block mb-3">Pedestrian Doors</label>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <span className="text-[8px] text-emerald-400/80 font-bold uppercase tracking-widest mb-1.5 block">Working</span>
                              <input type="number" min="0" value={site.workingPedGates} onChange={(e) => handleUpdateSite(site.id, 'workingPedGates', Number(e.target.value))} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500 transition-all focus:bg-white/[0.05]" />
                            </div>
                            <div className="flex-1">
                              <span className="text-[8px] text-red-400/80 font-bold uppercase tracking-widest mb-1.5 block">Repair Needed</span>
                              <input type="number" min="0" value={site.nonWorkingPedGates} onChange={(e) => handleUpdateSite(site.id, 'nonWorkingPedGates', Number(e.target.value))} className="w-full bg-red-900/10 border border-red-500/20 rounded-xl p-3 text-red-100 font-bold outline-none focus:border-red-500 transition-all focus:bg-red-900/20" />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block mb-2">Camera Monitoring</label>
                          <input type="number" min="0" value={site.cameras} onChange={(e) => handleUpdateSite(site.id, 'cameras', Number(e.target.value))} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500 transition-all focus:bg-white/[0.05]" />
                        </div>
                        
                        <div>
                          <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block mb-2">Live Video Concierge</label>
                          <select value={site.conciergeShifts} onChange={(e) => handleUpdateSite(site.id, 'conciergeShifts', Number(e.target.value))} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500 appearance-none transition-all focus:bg-white/[0.05]">
                            <option value="0">Self-Managed (App Only)</option>
                            <option value="1">Night Shift Only</option>
                            <option value="2">2 Shifts</option>
                            <option value="3">24/7 Full Coverage</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={handleAddSite}
                className="mt-8 w-full py-6 bg-white/[0.01] border-2 border-dashed border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 rounded-3xl text-zinc-500 hover:text-cyan-400 transition-all flex items-center justify-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-full bg-black/50 group-hover:bg-cyan-500/20 flex items-center justify-center text-xl font-light transition-all border border-white/5">+</div>
                <span className="font-bold uppercase tracking-widest text-xs">Add Another Site To Quote</span>
              </button>
            </div>

            {/* 02. INTERACTIVE DEMO */}
            <div id="simulation" className="pt-20 border-t border-white/10 scroll-mt-20">
              <h2 className="text-3xl font-black mb-2 tracking-tight">Live <span className="text-cyan-400">Simulation</span></h2>
              <p className="text-zinc-500 text-sm mb-12">Test the resident and visitor experience in real-time.</p>
              
              <div className="relative w-full h-64 sm:h-80 rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] group">
                <Image src="/gate-closed.jpg" alt="Main Gate Closed" fill className="object-cover" />
                <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isGateOpen ? 'opacity-100' : 'opacity-0'}`}>
                   <Image src="/gate-open.jpg" alt="Main Gate Open" fill className="object-cover" />
                </div>
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    <div className={`w-2 h-2 rounded-full ${isGateOpen ? 'bg-red-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`}></div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white">LIVE CAM 01 • MAIN ENTRY</p>
                </div>
                 <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10">
                    <p className="text-[9px] uppercase tracking-widest text-zinc-400 mb-1">System Status</p>
                    <p className={`text-xl font-black uppercase tracking-tight transition-colors duration-300 ${isGateOpen ? 'text-emerald-400 shadow-emerald-400/50' : 'text-white'}`}>
                        {isGateOpen ? '✓ GATE OPENING' : 'SECURE & CLOSED'}
                    </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-items-center">
                {/* BRIVO SIMULATION */}
                <div className="flex flex-col items-center">
                  <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-4">Resident Mobile Pass</p>
                  <div 
                    onClick={handleBrivoTap} 
                    className="relative w-64 h-[550px] bg-black rounded-[3rem] border-[6px] border-[#1a1a1c] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden cursor-pointer transform transition-transform hover:-translate-y-2"
                  >
                    <Image src="/app-brivo.png" alt="Brivo" fill className="object-cover opacity-90" />
                    {brivoStatus === 'idle' && (
                      <div className="absolute top-[68%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                        <div className="absolute w-28 h-28 border-[1px] border-blue-400/30 rounded-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                        <div className="absolute w-20 h-20 border-[2px] border-blue-400/50 rounded-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite_500ms]"></div>
                        <div className="w-14 h-14 bg-blue-500/20 rounded-full shadow-[0_0_40px_rgba(59,130,246,0.6)] backdrop-blur-sm cursor-pointer border border-blue-400/30"></div>
                      </div>
                    )}
                    {brivoStatus === 'loading' && (
                      <div className="absolute inset-0 bg-[#0A0A0C]/90 backdrop-blur-md flex flex-col items-center justify-center z-20">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest animate-pulse">Authenticating...</p>
                      </div>
                    )}
                    {brivoStatus === 'granted' && (
                      <div className="absolute inset-0 bg-emerald-500/95 backdrop-blur-md flex flex-col items-center justify-center z-30 transition-all duration-300">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-2xl">
                          <span className="text-emerald-500 text-3xl font-black">✓</span>
                        </div>
                        <p className="text-white text-base font-black uppercase tracking-wider shadow-sm">Access Granted</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* VISITOR CALLBOX APP */}
                <div className="flex flex-col items-center">
                  <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-4">Visitor Callbox Intercom</p>
                  <div className="relative w-64 h-[550px] bg-[#050505] rounded-[3rem] border-[6px] border-[#1a1a1c] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden text-white font-sans">
                    {visitorView === 'home' && (
                      <div className="absolute inset-0 flex flex-col pt-10 px-4">
                        <div className="flex flex-col items-center mb-6">
                           <div className="w-16 h-16 bg-[#0a0a0a] rounded-2xl flex items-center justify-center mb-4 border border-white/10 shadow-lg">
                             <Image src="/logo.png" alt="Logo" width={32} height={32} />
                           </div>
                           <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-1">Welcome To</p>
                           <h4 className="text-base font-black uppercase tracking-wider mb-1">Elevate Eagles</h4>
                           <p className="text-[8px] text-zinc-500 font-medium tracking-wider mb-4">123 MAIN ST, DALL ORDLHO, GA</p>
                           <div className="bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
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
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1 [&::-webkit-scrollbar]:hidden">
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
                    {visitorView === 'calling' && (
                      <div className="absolute inset-0 bg-[#0A0A0C] flex flex-col items-center justify-center z-30">
                        <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 relative">
                          <div className="absolute inset-0 border border-blue-500/30 rounded-full animate-ping"></div>
                          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </div>
                        <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 animate-pulse">Dialing Secure Network</p>
                        <p className="text-white font-black text-xl tracking-tight">{callingName}</p>
                      </div>
                    )}
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

            {/* 03. SERVICE SLA GLOSSARY */}
            <div id="slas" className="pt-20 pb-20 border-t border-white/10 scroll-mt-20">
               <h2 className="text-3xl font-black mb-10 tracking-tight">Service <span className="text-cyan-400">SLAs</span></h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-colors shadow-xl">
                   <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
                   </div>
                   <h3 className="text-white font-bold mb-2 uppercase tracking-wide text-sm">Hardware & App Infrastructure</h3>
                   <p className="text-xs text-zinc-400 font-light leading-relaxed">End-to-end access control infrastructure powered by cloud-native controllers. Includes full resident mobile app provisioning (Bluetooth/NFC credentialing) and secure visitor callbox integration. Covers ongoing firmware maintenance, over-the-air (OTA) updates, and 99.99% guaranteed system uptime.</p>
                 </div>
                 <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-colors shadow-xl">
                   <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                   </div>
                   <h3 className="text-white font-bold mb-2 uppercase tracking-wide text-sm">Proactive Camera Monitoring</h3>
                   <p className="text-xs text-zinc-400 font-light leading-relaxed">Active, real-time surveillance utilizing your property's existing camera infrastructure, with optional LPR (License Plate Recognition) enhancements available. Incidents are identified and reported in real-time, with comprehensive, time-stamped incident reports immediately logged and dispatched to your on-site staff.</p>
                 </div>
                 <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-colors shadow-xl">
                   <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                   </div>
                   <h3 className="text-white font-bold mb-2 uppercase tracking-wide text-sm">Live Video Concierge</h3>
                   <p className="text-xs text-zinc-400 font-light leading-relaxed">Highly trained remote security professionals intercept visitor and courier calls via 2-way HD video in under 15 seconds. Guards verify credentials against the live property directory and visual feeds before granting or denying access, effectively replacing costly on-site legacy guard forces.</p>
                 </div>
                 <div className="bg-white/[0.02] border border-cyan-500/20 rounded-3xl p-8 hover:bg-white/[0.04] transition-colors relative overflow-hidden shadow-xl">
                   <div className="absolute top-0 right-0 p-4"><div className="bg-cyan-500/20 text-cyan-400 text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm border border-cyan-500/30">High ROI</div></div>
                   <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                   </div>
                   <h3 className="text-white font-bold mb-2 uppercase tracking-wide text-sm">"Your Gate Guard" (Maintenance & Uptime)</h3>
                   <p className="text-xs text-zinc-400 font-light leading-relaxed">A comprehensive, proactive repair and maintenance program for your property gates and access hardware. Billed at a predictable monthly rate, covering all ongoing labor and parts to maintain over 90% system uptime—eliminating random CapEx spikes. Consistent gate operation delivers cascading portfolio benefits: reduced crime, decreased illegal dumping, improved resident accountability, and the strategic ability to secure the perimeter to turn over problematic tenancies and attract high-value residents.</p>
                 </div>
               </div>
            </div>

          </div>
        </div>

        {/* RIGHT 1/3: PORTFOLIO QUOTE & FORMALIZATION */}
        <div className="lg:w-1/3 border-l border-white/5 relative bg-[#0A0A0C]/50 backdrop-blur-3xl shadow-2xl">
          <div className="sticky top-[160px] max-h-[calc(100vh-180px)] overflow-y-auto [&::-webkit-scrollbar]:hidden p-6 lg:p-10 w-full">
            
            <div className="mb-8 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-2xl font-bold tracking-tight">Addendum Quote</h3>
                  {/* START OVER BUTTON */}
                  <button 
                    onClick={handleStartOver} 
                    className="text-[8px] uppercase tracking-widest text-zinc-500 hover:text-red-400 transition-colors bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/10 flex items-center gap-1"
                  >
                    <span>⟲</span> Clear
                  </button>
                </div>
                <p className="text-zinc-500 text-[11px] font-light leading-relaxed">Quote for adding {sites.length} new site(s) to the master agreement.</p>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/10 shrink-0 ml-4 shadow-xl hidden lg:block">
                <Image src="/radco_logo.png" alt="Radco" width={40} height={40} className="object-contain opacity-90" />
              </div>
            </div>

            {requestState === 'idle' && (
              <div className="animate-[fadeIn_0.5s_ease-out]">
                
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-6">
                  <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Aggregated Services</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Base Fee</span>
                  </div>

                  <div className="space-y-5 mb-6">
                    <div className="relative group flex justify-between items-start cursor-default py-1">
                      <p className="text-sm font-bold text-white/90 hover:text-cyan-400 transition-colors flex items-center pr-2">
                        "Your Gate Guard" Infra & Maintenance
                        <span className="text-zinc-500 text-[9px] hover:text-white bg-white/5 rounded-full w-4 h-4 flex items-center justify-center border border-white/10 ml-2 transition-colors">i</span>
                      </p>
                      <span className="text-sm font-medium text-white/90 font-mono">${totalHardwareFee.toLocaleString()}</span>
                      <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 bg-[#111] p-3 rounded-xl text-[10px] text-zinc-400 z-50 shadow-2xl border border-white/10 font-light leading-relaxed">
                        Covers all hardware, app provisioning, and proactive gate/hardware repairs to guarantee 90%+ uptime and eliminate CapEx spikes.
                      </div>
                    </div>

                    <div className="relative group flex justify-between items-start cursor-default py-1">
                      <p className="text-sm font-bold text-white/90 hover:text-cyan-400 transition-colors flex items-center pr-2">
                        Proactive Camera Monitoring
                        <span className="text-zinc-500 text-[9px] hover:text-white bg-white/5 rounded-full w-4 h-4 flex items-center justify-center border border-white/10 ml-2 transition-colors">i</span>
                      </p>
                      <span className="text-sm font-medium text-white/90 font-mono">${totalCameraFee.toLocaleString()}</span>
                      <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 bg-[#111] p-3 rounded-xl text-[10px] text-zinc-400 z-50 shadow-2xl border border-white/10 font-light leading-relaxed">
                        Active surveillance via existing infrastructure with real-time incident reporting directly to your staff.
                      </div>
                    </div>

                    {totalConciergeFee > 0 && (
                      <div className="relative group flex justify-between items-start cursor-default py-1">
                        <p className="text-sm font-bold text-white/90 hover:text-cyan-400 transition-colors flex items-center pr-2">
                          Live Video Concierge
                          <span className="text-zinc-500 text-[9px] hover:text-white bg-white/5 rounded-full w-4 h-4 flex items-center justify-center border border-white/10 ml-2 transition-colors">i</span>
                        </p>
                        <span className="text-sm font-medium text-white/90 font-mono">${totalConciergeFee.toLocaleString()}</span>
                        <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 bg-[#111] p-3 rounded-xl text-[10px] text-zinc-400 z-50 shadow-2xl border border-white/10 font-light leading-relaxed">
                          Trained remote guards processing visitors in under 15 seconds via 2-way HD video.
                        </div>
                      </div>
                    )}
                  </div>

                  {nextTierSites !== null ? (
                    <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-xl p-4 mb-6 shadow-inner relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full w-1 bg-cyan-500 shadow-[0_0_10px_#22d3ee]"></div>
                      <div className="flex justify-between items-end mb-2">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          Unlock <span className="text-cyan-400">{nextTierPercent * 100}% {nextTierName}</span>
                        </p>
                        <span className="text-[10px] text-zinc-500 font-mono">{totalPortfolioSites} / {nextTierSites} Sites</span>
                      </div>
                      
                      <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden mb-2 border border-white/5">
                        <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                      </div>
                      
                      <p className="text-[9px] text-zinc-500">
                        Add <strong className="text-white">{sitesNeeded} more site{sitesNeeded > 1 ? 's' : ''}</strong> to unlock this tier.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-xl p-4 mb-6 shadow-inner flex items-center justify-between">
                       <div>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 block mb-1">Max Discount Unlocked</span>
                         <span className="text-xs font-black text-white">{currentTierName} ({volumeDiscountPercent * 100}%)</span>
                       </div>
                       <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">✓</div>
                    </div>
                  )}

                  {volumeDiscountPercent > 0 && (
                    <div className="flex justify-between items-center mb-6 px-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Current Discount ({volumeDiscountPercent * 100}%)</span>
                      <span className="text-sm font-black text-cyan-400 font-mono">- ${monthlyDiscountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="bg-white/[0.05] rounded-xl p-4 border border-white/10 flex justify-between items-center mb-3 shadow-inner">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Predictable OpEx</span>
                    <span className="text-2xl font-black text-white font-mono">${finalMonthlyNewSites.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center px-2 mb-8">
                    <span className="text-[9px] text-zinc-500 font-medium">Est. Turnkey Hardware Setup (One-Time)</span>
                    <span className="text-[10px] font-bold text-zinc-400 font-mono">${totalSetupFee.toLocaleString()}</span>
                  </div>

                  <div className="border-t border-white/5 pt-6 mt-2">
                     <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-4 text-center">Estimated OpEx Comparison</p>
                     <div className="flex items-end justify-center gap-6 h-32 px-4">
                        <div className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full group">
                          <span className="text-[9px] text-zinc-400 font-bold font-mono transition-colors group-hover:text-zinc-200">~${legacyTotal.toLocaleString()}</span>
                          <div className="w-full bg-red-900/30 border border-red-500/20 rounded-t-md transition-all group-hover:bg-red-900/50" style={{height: `${legacyBarHeight}%`}}></div>
                          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Legacy</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
                          <span className="text-[11px] text-cyan-400 font-black font-mono">${finalMonthlyNewSites.toLocaleString()}</span>
                          <div className="w-full bg-cyan-500 rounded-t-md shadow-[0_0_15px_rgba(6,182,212,0.4)]" style={{height: `${newOpExBarHeight}%`}}></div>
                          <span className="text-[8px] font-bold text-cyan-400 uppercase tracking-widest mt-2">Gate Guard</span>
                        </div>
                     </div>
                  </div>

                </div>

                <button 
                  onClick={handleFormalizeRequest} 
                  disabled={hasUnnamedSites}
                  className={`w-full py-4 font-black rounded-xl transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 mb-4 ${
                    hasUnnamedSites 
                      ? 'bg-white/5 text-zinc-500 cursor-not-allowed border border-white/10' 
                      : 'bg-white text-[#0A0A0C] hover:bg-zinc-200 shadow-[0_0_30px_rgba(255,255,255,0.2)]'
                  }`}
                >
                  {hasUnnamedSites ? (
                    <span>Please Name All Sites Above</span>
                  ) : (
                    <>
                      <span>Request Contract Addendum</span>
                      <span>→</span>
                    </>
                  )}
                </button>

                {/* COPY LINK / EXPORT ACTIONS */}
                <div className="flex gap-4 mb-8">
                   <button onClick={() => window.print()} className="flex-1 py-3 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 text-zinc-300 font-bold rounded-xl transition-all uppercase tracking-widest text-[8px] flex justify-center items-center gap-2">
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                     Export PDF
                   </button>
                   
                   <button 
                     onClick={handleCopyLink} 
                     className={`flex-1 py-3 font-bold rounded-xl transition-all uppercase tracking-widest text-[8px] flex justify-center items-center gap-2 border ${linkCopied ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/[0.03] hover:bg-white/[0.05] border-white/10 text-zinc-300'}`}
                   >
                     {linkCopied ? (
                       <>
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                         Copied!
                       </>
                     ) : (
                       <>
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                         Copy Link
                       </>
                     )}
                   </button>
                </div>

                <div className="flex justify-center items-center gap-4 text-zinc-500">
                   <span className="flex items-center gap-1 text-[8px] uppercase font-bold tracking-widest"><svg className="w-3 h-3 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> SOC-2 Type II</span>
                   <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                   <span className="flex items-center gap-1 text-[8px] uppercase font-bold tracking-widest">99.99% Uptime SLA</span>
                </div>

              </div>
            )}

            {requestState === 'submitting' && (
              <div className="flex flex-col items-center justify-center py-20 animate-[fadeIn_0.3s_ease-out] bg-white/[0.02] border border-white/5 rounded-3xl">
                <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-6"></div>
                <p className="text-cyan-400 font-bold uppercase tracking-widest text-[10px] mb-2 animate-pulse">Drafting Addendum...</p>
                <div className="space-y-2 text-center text-[9px] text-zinc-500 font-mono">
                   <p>✓ Locking in {volumeDiscountPercent * 100}% Discount...</p>
                   <p>✓ Updating Radco Master MSA...</p>
                   <p className="text-zinc-400">⟳ Routing to Account Exec...</p>
                </div>
              </div>
            )}

            {requestState === 'success' && (
              <div className="animate-[fadeIn_0.5s_ease-out] bg-emerald-900/20 backdrop-blur-xl border border-emerald-500/30 p-8 rounded-3xl text-center shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-3xl mx-auto mb-6 shadow-inner">✓</div>
                <h3 className="text-xl font-black text-white mb-2 tracking-tight">Request Received</h3>
                <p className="text-xs text-emerald-100/70 font-light leading-relaxed mb-8">
                  Your dedicated Gate Guard rep has been notified. We are drafting the addendum for the <strong>{sites.length} new site(s)</strong> at the <strong>{volumeDiscountPercent * 100}% volume tier</strong>.
                </p>
                <button 
                  onClick={() => {
                    setRequestState('idle');
                    setExistingSites(existingSites + sites.length);
                    setSites([{ id: Date.now().toString(), name: '', units: 250, workingVehicleGates: 2, nonWorkingVehicleGates: 0, workingPedGates: 2, nonWorkingPedGates: 0, cameras: 4, conciergeShifts: 0 }]);
                  }} 
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-[#0A0A0C] font-black rounded-xl transition-all uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(16,185,129,0.3)]"
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
