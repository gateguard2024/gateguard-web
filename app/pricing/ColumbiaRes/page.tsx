"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// 1. MASTER PROPERTY DATABASE (Exact data from Columbia's surveys)
const PREDEFINED_SITES = [
  { id: '1', name: 'Park Commons', units: 230, vehicleGates: 5, vehicleGatesRepair: 2, pedGates: 10, pedGatesRepair: 2, cameras: 2, conciergeShifts: 0 },
  { id: '2', name: 'Pendana Family at West Lakes', units: 200, vehicleGates: 6, vehicleGatesRepair: 3, pedGates: 24, pedGatesRepair: 20, cameras: 0, conciergeShifts: 0 },
  { id: '3', name: 'Pendana Senior at West Lakes', units: 120, vehicleGates: 0, vehicleGatesRepair: 0, pedGates: 14, pedGatesRepair: 1, cameras: 0, conciergeShifts: 0 },
  { id: '4', name: 'Columbia Gardens South City', units: 290, vehicleGates: 6, vehicleGatesRepair: 3, pedGates: 19, pedGatesRepair: 3, cameras: 0, conciergeShifts: 0 },
  { id: '5', name: 'John James Fonda Collection', units: 150, vehicleGates: 2, vehicleGatesRepair: 1, pedGates: 6, pedGatesRepair: 0, cameras: 1, conciergeShifts: 0 },
  { id: '6', name: 'Gregg Hypolite Collection', units: 320, vehicleGates: 4, vehicleGatesRepair: 0, pedGates: 12, pedGatesRepair: 4, cameras: 4, conciergeShifts: 1 },
  // Placeholders for full 20 sites for logic presentation
  { id: '7', name: 'Columbia Brook Park', units: 210, vehicleGates: 2, vehicleGatesRepair: 0, pedGates: 8, pedGatesRepair: 1, cameras: 2, conciergeShifts: 0 },
  { id: '8', name: 'Columbia Estates', units: 175, vehicleGates: 2, vehicleGatesRepair: 1, pedGates: 4, pedGatesRepair: 0, cameras: 2, conciergeShifts: 0 },
  { id: '9', name: 'The Avery at Columbia', units: 180, vehicleGates: 2, vehicleGatesRepair: 1, pedGates: 6, pedGatesRepair: 2, cameras: 0, conciergeShifts: 0 },
  { id: '10', name: 'Columbia View Apartments', units: 250, vehicleGates: 3, vehicleGatesRepair: 0, pedGates: 10, pedGatesRepair: 0, cameras: 3, conciergeShifts: 0 },
  { id: '11', name: 'Columbia Canopy', units: 195, vehicleGates: 2, vehicleGatesRepair: 2, pedGates: 5, pedGatesRepair: 1, cameras: 1, conciergeShifts: 0 },
  { id: '12', name: 'Columbia Crest', units: 145, vehicleGates: 1, vehicleGatesRepair: 0, pedGates: 4, pedGatesRepair: 0, cameras: 0, conciergeShifts: 0 },
  { id: '13', name: 'Columbia Colony', units: 310, vehicleGates: 4, vehicleGatesRepair: 1, pedGates: 12, pedGatesRepair: 3, cameras: 4, conciergeShifts: 0 },
  { id: '14', name: 'Columbia Heights', units: 275, vehicleGates: 4, vehicleGatesRepair: 2, pedGates: 8, pedGatesRepair: 4, cameras: 2, conciergeShifts: 0 },
  { id: '15', name: 'Columbia Mechanicsville', units: 180, vehicleGates: 2, vehicleGatesRepair: 1, pedGates: 6, pedGatesRepair: 2, cameras: 0, conciergeShifts: 0 },
  { id: '16', name: 'Columbia Heritage', units: 275, vehicleGates: 4, vehicleGatesRepair: 2, pedGates: 8, pedGatesRepair: 4, cameras: 2, conciergeShifts: 0 },
  { id: '17', name: 'Columbia Blackshear', units: 250, vehicleGates: 3, vehicleGatesRepair: 0, pedGates: 10, pedGatesRepair: 0, cameras: 3, conciergeShifts: 0 },
  { id: '18', name: 'Columbia Village', units: 185, vehicleGates: 2, vehicleGatesRepair: 1, pedGates: 7, pedGatesRepair: 2, cameras: 2, conciergeShifts: 0 },
  { id: '19', name: 'Columbia Oasis', units: 300, vehicleGates: 4, vehicleGatesRepair: 0, pedGates: 14, pedGatesRepair: 2, cameras: 5, conciergeShifts: 1 },
  { id: '20', name: 'Columbia Parc', units: 420, vehicleGates: 6, vehicleGatesRepair: 1, pedGates: 18, pedGatesRepair: 2, cameras: 6, conciergeShifts: 2 },
];

export default function ColumbiaEnterpriseDashboard() {
  // Start with exactly the same starting selection as the old builder
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>(['1', '2', '3', '4']);
  const [useAmortization, setUseAmortization] = useState(false);
  const [requestState, setRequestState] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Multi-Site Toggling Logic
  const toggleSite = (id: string) => {
    setSelectedSiteIds(prev => 
      prev.includes(id) ? prev.filter(siteId => siteId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedSiteIds.length === PREDEFINED_SITES.length) {
      setSelectedSiteIds([]);
    } else {
      setSelectedSiteIds(PREDEFINED_SITES.map(s => s.id));
    }
  };

  // Filter full site objects from the selection IDs
  const selectedSites = PREDEFINED_SITES.filter(site => selectedSiteIds.includes(site.id));

  // --- AGGREGATE MATH & TIERED DISCOUNT LOGIC ---
  const MINIMUM_PRICE_PER_SHIFT = 1000;
  
  let totalWorkingDoors = 0;
  let totalBrokenDoors = 0;
  let totalRawMonthlyFee = 0;
  let totalUnits = 0;
  let legacyTotal = 0; 

  selectedSites.forEach(site => {
    totalUnits += site.units;
    
    // Working vs Broken Door Math
    const vWorking = site.vehicleGates - site.vehicleGatesRepair;
    const vRepair = site.vehicleGatesRepair;
    const pWorking = site.pedGates - site.pedGatesRepair;
    const pRepair = site.pedGatesRepair;

    totalWorkingDoors += (vWorking + pWorking);
    totalBrokenDoors += (vRepair + pRepair);

    // Monthly Base Hardware + $250 surcharge for each item needing repair
    const siteHardwareMonthly = (site.vehicleGates * 150) + (site.pedGates * 125) + ((vRepair + pRepair) * 250);
    const siteCameraMonthly = (site.cameras * 85);
    
    let siteConciergeMonthly = 0;
    if (site.conciergeShifts > 0) {
      siteConciergeMonthly = Math.max(
        MINIMUM_PRICE_PER_SHIFT * site.conciergeShifts, 
        (site.units * 3) + (site.units * 1 * (site.conciergeShifts - 1))
      );
    }

    totalRawMonthlyFee += (siteHardwareMonthly + siteCameraMonthly + siteConciergeMonthly);
    legacyTotal += (site.vehicleGates * 400) + (site.pedGates * 150) + (site.cameras * 150) + (site.conciergeShifts > 0 ? 7200 * site.conciergeShifts : 2500);
  });

  // VOLUME DISCOUNT TIERS
  const numSitesQuoted = selectedSites.length;
  const numExistingSites = 0; // Columbia has a massive master portoflio
  const totalSitesOnPlatform = numSitesQuoted + numExistingSites;

  let volumeDiscountPercent = 0;
  let currentTierName = "Standard Pricing";
  let nextTierSites: number | null = 5;
  let progressPercent = 0;

  if (totalSitesOnPlatform >= 40) {
    volumeDiscountPercent = 0.30;
    currentTierName = "Strategic Partner";
    nextTierSites = null;
    progressPercent = 100;
  } else if (totalSitesOnPlatform >= 20) {
    volumeDiscountPercent = 0.20;
    currentTierName = "Enterprise Tier";
    nextTierSites = 40;
    progressPercent = (totalSitesOnPlatform / 40) * 100;
  } else if (totalSitesOnPlatform >= 10) {
    volumeDiscountPercent = 0.15;
    currentTierName = "Regional Tier";
    nextTierSites = 20;
    progressPercent = (totalSitesOnPlatform / 20) * 100;
  } else if (totalSitesOnPlatform >= 5) {
    volumeDiscountPercent = 0.1;
    currentTierName = "Portfolio Tier";
    nextTierSites = 10;
    progressPercent = (totalSitesOnPlatform / 10) * 100;
  } else {
    volumeDiscountPercent = 0;
    currentTierName = "Standard Pricing";
    nextTierSites = 5;
    progressPercent = (totalSitesOnPlatform / 5) * 100;
  }

  const baseMonthlyTotal = totalRawMonthlyFee;
  const monthlyDiscountAmount = baseMonthlyTotal * volumeDiscountPercent;
  const rawsetupFee = (totalWorkingDoors * 500) + (totalBrokenDoors * 750);

  // --- REVISED: AMORTIZATION LOGIC (15+ Sites triggers Cap) ---
  const isAmortizationEligible = numSitesQuoted >= 15;
  const amortizedUpfrontCapEx = numSitesQuoted * 2500;
  const canActuallyAmortize = isAmortizationEligible && (rawsetupFee > amortizedUpfrontCapEx);

  // If selection falls below 15, force the toggle off
  useEffect(() => {
    if (!canActuallyAmortize && useAmortization) {
      setUseAmortization(false);
    }
  }, [numSitesQuoted, canActuallyAmortize, useAmortization]);

  let finalSetupFee = rawsetupFee;
  let monthlyAmortizationFee = 0;

  if (canActuallyAmortize && useAmortization) {
    finalSetupFee = amortizedUpfrontCapEx;
    monthlyAmortizationFee = (rawsetupFee - amortizedUpfrontCapEx) / 60;
  }

  const finalMonthlyTotal = baseMonthlyTotal - monthlyDiscountAmount + monthlyAmortizationFee;
  const avgPerUnitMonthly = totalUnits > 0 ? (finalMonthlyTotal / totalUnits).toFixed(2) : "0.00";

  const handleFormalizeRequest = async () => {
    if (selectedSites.length === 0) return; 
    setRequestState('submitting');
    //Simulated webhook POST
    setTimeout(() => setRequestState('success'), 2000);
  };

  // Color Definitions derived from the Happy Medium B2B pallette
  const corporateBg = 'linear-gradient(to bottom, #001f5b, #121c38)'; // Columbia Blue
  const glassCard = 'bg-white/5 backdrop-blur-3xl border border-white/10 shadow-inner';
  const accentNeonBlue = 'text-blue-400';
  const progressBlue = 'bg-blue-500';

  return (
    <main className="min-h-screen font-sans selection:bg-blue-500/20" style={{ background: corporateBg }}>
      
      {/* BACKGROUND STYLING */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none"></div>
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[150px] rounded-full z-0 pointer-events-none"></div>

      {/* 1. HAPPY MEDIUM B2B COMMAND CENTER */}
      <div className="sticky top-0 z-50 bg-[#030d22]/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl">
        <div className="max-w-[1600px] mx-auto p-4 lg:px-8 lg:py-6">
          
          {/* Logos & Primary Action Row */}
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4 gap-6">
             <div className="flex items-center gap-4">
                <div className="bg-white/90 p-2 rounded-xl border border-white/10 w-14 h-14 flex items-center justify-center">
                   <Image src="/Columbia_logo.png" alt="Columbia" width={48} height={48} className="object-contain" />
                </div>
                <div>
                   <h1 className="text-2xl font-black text-white tracking-tight">Columbia Residential</h1>
                   <p className={`text-xs font-bold uppercase tracking-widest ${accentNeonBlue}`}>Portfolio Master Builder</p>
                </div>
             </div>
             <button 
                onClick={handleFormalizeRequest}
                disabled={selectedSites.length === 0}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-zinc-500 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:shadow-none flex items-center gap-2"
             >
                Generate Contract <span>→</span>
             </button>
          </div>

          {/* Clean Financial Dash Row - Expanded Amortization Area */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 items-center">
             
             {/* Stat 1: Site Count */}
             <div className="flex flex-col">
                <span className="text-[11px] text-zinc-400 uppercase tracking-widest font-bold mb-1">Total Properties Selected</span>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-white">{numSitesQuoted}</span>
                   <span className="text-sm text-zinc-500 font-medium">Sites</span>
                </div>
             </div>

             {/* Stat 2: Portfolio Scale */}
             <div className="flex flex-col border-l border-white/5 pl-8 hidden lg:flex">
                <span className="text-[11px] text-zinc-400 uppercase tracking-widest font-bold mb-1">Portfolio Scale</span>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-white">{totalUnits.toLocaleString()}</span>
                   <span className="text-sm text-zinc-500 font-medium">Units</span>
                </div>
             </div>

             {/* Stat 3: Total Monthly */}
             <div className="flex flex-col border-l border-white/5 pl-8 col-span-2 md:col-span-1 lg:col-span-1">
                <span className="text-[11px] text-zinc-400 uppercase tracking-widest font-bold mb-1">Monthly Portfolio OpEx</span>
                <span className="text-2xl font-black text-white font-mono">${finalMonthlyTotal.toLocaleString(undefined, {maximumFractionDigits: 0})} / mo</span>
                <span className={`text-[11px] font-bold tracking-widest uppercase mt-1 ${accentNeonBlue}`}>Blended: ${avgPerUnitMonthly} / unit</span>
             </div>

             {/* Stat 4: Upfront Setup */}
             <div className="flex flex-col border-l border-white/5 pl-8 col-span-2 md:col-span-1 lg:col-span-1">
                <span className="text-[11px] text-zinc-400 uppercase tracking-widest font-bold mb-1">One-Time Setup (CapEx)</span>
                <span className="text-2xl font-black text-white font-mono">${finalSetupFee.toLocaleString()}</span>
             </div>

             {/* Stat 5: Amortization Area - Now given massive priority space */}
             <div className="flex flex-col border-l border-white/5 pl-8 lg:border-l lg:pl-8 col-span-2 md:col-span-2 lg:col-span-2 h-full justify-center">
                 {canActuallyAmortize ? (
                    <div className={`p-4 lg:p-6 rounded-xl border transition-all ${glassCard} ${useAmortization ? 'border-amber-500/30 bg-amber-950/20' : 'border-white/5 bg-white/[0.02]'}`}>
                       <div className="flex justify-between items-start mb-2">
                          <div>
                             <span className="block text-sm font-black text-white tracking-tight flex items-center gap-1.5 mb-1">
                                <span className={`text-amber-400`}>$$</span> Enterprise Financing Unlocked
                             </span>
                             <p className="text-[11px] text-zinc-400 font-medium max-w-lg leading-relaxed pr-6">Cap your upfront CapEx at a flat $2,500 per site. Amortize the remaining setup balance over 60 months. 90%+ system uptime guaranteed.</p>
                          </div>
                          <button onClick={() => setUseAmortization(!useAmortization)} className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${useAmortization ? 'bg-amber-500' : 'bg-white/10'}`}>
                             <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute ${useAmortization ? 'translate-x-7' : 'translate-x-1'}`}></div>
                          </button>
                       </div>
                    </div>
                 ) : (
                    <div className="p-4 lg:p-6 rounded-xl border border-white/5 bg-white/[0.01] flex justify-between items-center opacity-70">
                       <div>
                          <span className="block text-sm font-black text-zinc-500 tracking-tight flex items-center gap-1.5 mb-1">
                             <span className={`text-zinc-600`}>$$</span> Enterprise Financing Locked
                          </span>
                          <p className="text-[11px] text-zinc-500 font-medium">Add {Math.max(0, 15 - numSitesQuoted)} more sites to unlock the setup CapEx cap of $2,500/site.</p>
                       </div>
                    </div>
                 )}
             </div>

          </div>
          
          {/* Progress / Tier Tracker Row - Moved out of the grid for visibility */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-6 justify-between">
             <div className="flex items-center gap-3">
                 <span className={`font-bold text-xs uppercase tracking-widest ${accentNeonBlue}`}>{currentTierName}</span>
                 {volumeDiscountPercent > 0 && <span className="bg-white/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{volumeDiscountPercent * 100}% Discount Applied</span>}
             </div>
             <p className="text-xs text-zinc-500">Activating <strong className="text-white">{numSitesQuoted} Sites</strong> on this quote.</p>
          </div>

        </div>
      </div>

      {/* 2. FROSTED GLASS PROPERTY MENU */}
      <div className="max-w-[1600px] mx-auto p-4 lg:p-8">
         
         {/* Success State Overlay */}
         {requestState === 'success' && (
            <div className={`border border-emerald-500/50 rounded-2xl p-10 text-center mb-10 backdrop-blur-sm animate-[fadeIn_0.5s_ease-out] ${glassCard}`}>
               <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
               <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Request Received</h2>
               <p className="text-xs text-emerald-100/70 font-light leading-relaxed mb-10">We are drafting the paperwork for your {selectedSites.length} selected sites. Your account executive will be in touch shortly to finalize.</p>
            </div>
         )}

         <div className="flex justify-between items-end mb-6">
            <div>
               <h2 className="text-2xl font-bold text-white tracking-tight">Columbia Portfolio Roster</h2>
               <p className="text-zinc-400 text-sm mt-1">Select properties below to include them in your Addendum quote.</p>
            </div>
            <button onClick={handleSelectAll} className={`text-xs ${accentNeonBlue} hover:text-white font-bold tracking-widest uppercase transition-colors`}>
               {selectedSiteIds.length === PREDEFINED_SITES.length ? 'Deselect All' : 'Select All Properties'}
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-32">
            {PREDEFINED_SITES.map((site) => {
               const isSelected = selectedSiteIds.includes(site.id);
               
               const vWorking = site.vehicleGates - site.vehicleGatesRepair;
               const pWorking = site.pedGates - site.pedGatesRepair;
               const hasBrokenAccess = site.vehicleGatesRepair > 0 || site.pedGatesRepair > 0;

               return (
                  <div 
                     key={site.id} 
                     onClick={() => toggleSite(site.id)}
                     className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-48
                        ${isSelected 
                           ? `bg-blue-950/20 border-blue-500 shadow-[0_4px_20px_rgba(37,99,235,0.15)] ring-1 ring-blue-500` 
                           : `${glassCard} border-white/[0.05] hover:border-white/10 hover:bg-white/[0.04] opacity-80 hover:opacity-100`
                        }
                     `}
                  >
                     {/* Card Header */}
                     <div className="flex justify-between items-start mb-4">
                        <div className="pr-10">
                           <h3 className="font-bold text-lg text-white leading-tight mb-1">{site.name}</h3>
                           <span className="inline-block bg-white/5 text-zinc-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">{site.units} Units</span>
                        </div>
                        {/* Custom Checkbox UI */}
                        <div className={`absolute top-5 right-5 w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-blue-500 border-blue-400 text-white' : 'border-white/10 bg-black/50'}`}>
                           {isSelected && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                     </div>

                     {/* Detailed Hardware Status */}
                     <div className="space-y-3">
                        {/* Vehicle Gates Row */}
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                            <span className="text-xs font-bold text-zinc-300">Veh. Gates ({site.vehicleGates})</span>
                            <div className="flex gap-2 text-[10px] font-medium text-right">
                                <span className="text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded">{vWorking} Working</span>
                                {site.vehicleGatesRepair > 0 && <span className="text-red-400 bg-red-950/20 px-2 py-0.5 rounded">{site.vehicleGatesRepair} Broken</span>}
                            </div>
                        </div>
                        
                        {/* Pedestrian Doors Row */}
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                            <span className="text-xs font-bold text-zinc-300">Ped. Doors ({site.pedGates})</span>
                            <div className="flex gap-2 text-[10px] font-medium text-right">
                                <span className="text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded">{pWorking} Working</span>
                                {site.pedGatesRepair > 0 && <span className="text-red-400 bg-red-950/20 px-2 py-0.5 rounded">{site.pedGatesRepair} Broken</span>}
                            </div>
                        </div>

                        {/* Cameras & Concierge */}
                        <div className="flex justify-center items-center gap-1 text-zinc-600 text-[9px] uppercase font-bold tracking-widest italic">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            {site.cameras} Cameras / {site.conciergeShifts === 0 ? 'SOC-2 Self-Managed' : `${site.conciergeShifts} Video Shifts`}
                        </div>
                     </div>

                  </div>
               );
            })}
         </div>

      </div>
    </main>
  );
}
