"use client";
import React, { useState, useEffect } from 'react';

// EXACT DATA EXTRACTED FROM COLUMBIA SURVEY (19 SITES)
const PREDEFINED_SITES = [
  { id: '1', name: 'Columbia Gardens of South City', units: 290, vehicleGates: 6, vehicleGatesRepair: 1, pedGates: 19, pedGatesRepair: 8, cameras: 0, conciergeShifts: 0 },
  { id: '2', name: 'Columbia Senior Residences', units: 154, vehicleGates: 0, vehicleGatesRepair: 0, pedGates: 8, pedGatesRepair: 2, cameras: 0, conciergeShifts: 0 },
  { id: '3', name: 'Columbia Mechanicsville', units: 173, vehicleGates: 3, vehicleGatesRepair: 0, pedGates: 15, pedGatesRepair: 7, cameras: 0, conciergeShifts: 0 },
  { id: '4', name: 'Parkside at Mechanicsville', units: 156, vehicleGates: 0, vehicleGatesRepair: 0, pedGates: 15, pedGatesRepair: 5, cameras: 0, conciergeShifts: 0 },
  { id: '5', name: 'Mechanicsville Station', units: 164, vehicleGates: 1, vehicleGatesRepair: 0, pedGates: 15, pedGatesRepair: 11, cameras: 0, conciergeShifts: 0 },
  { id: '6', name: 'Mechanicsville Crossing', units: 164, vehicleGates: 1, vehicleGatesRepair: 0, pedGates: 19, pedGatesRepair: 9, cameras: 0, conciergeShifts: 0 },
  { id: '7', name: 'Villages of East Lake', units: 542, vehicleGates: 11, vehicleGatesRepair: 0, pedGates: 16, pedGatesRepair: 0, cameras: 0, conciergeShifts: 0 },
  { id: '8', name: 'Gardenside', units: 108, vehicleGates: 3, vehicleGatesRepair: 0, pedGates: 11, pedGatesRepair: 0, cameras: 0, conciergeShifts: 0 },
  { id: '9', name: 'Columbia Crest', units: 158, vehicleGates: 1, vehicleGatesRepair: 1, pedGates: 5, pedGatesRepair: 2, cameras: 0, conciergeShifts: 0 },
  { id: '10', name: 'Columbia Commons', units: 158, vehicleGates: 2, vehicleGatesRepair: 1, pedGates: 3, pedGatesRepair: 1, cameras: 0, conciergeShifts: 0 },
  { id: '11', name: 'Columbia Park Commons', units: 332, vehicleGates: 6, vehicleGatesRepair: 2, pedGates: 10, pedGatesRepair: 2, cameras: 0, conciergeShifts: 0 },
  { id: '12', name: 'Columbia Renaissance Square', units: 140, vehicleGates: 3, vehicleGatesRepair: 3, pedGates: 23, pedGatesRepair: 4, cameras: 0, conciergeShifts: 0 },
  { id: '13', name: 'Columbia Renaissance Senior', units: 120, vehicleGates: 2, vehicleGatesRepair: 2, pedGates: 12, pedGatesRepair: 7, cameras: 0, conciergeShifts: 0 },
  { id: '14', name: 'Columbia Renaissance P2', units: 140, vehicleGates: 2, vehicleGatesRepair: 0, pedGates: 7, pedGatesRepair: 0, cameras: 0, conciergeShifts: 0 },
  { id: '15', name: 'Columbia South River Gardens', units: 124, vehicleGates: 3, vehicleGatesRepair: 2, pedGates: 6, pedGatesRepair: 2, cameras: 0, conciergeShifts: 0 },
  { id: '16', name: 'Columbia Village', units: 104, vehicleGates: 2, vehicleGatesRepair: 0, pedGates: 4, pedGatesRepair: 0, cameras: 0, conciergeShifts: 0 },
  { id: '17', name: 'Pendana at West Lakes', units: 200, vehicleGates: 6, vehicleGatesRepair: 3, pedGates: 24, pedGatesRepair: 20, cameras: 0, conciergeShifts: 0 },
  { id: '18', name: 'Pendana Senior', units: 120, vehicleGates: 0, vehicleGatesRepair: 0, pedGates: 14, pedGatesRepair: 1, cameras: 0, conciergeShifts: 0 },
  { id: '19', name: 'Columbia Sylvan Hills', units: 191, vehicleGates: 0, vehicleGatesRepair: 0, pedGates: 27, pedGatesRepair: 18, cameras: 0, conciergeShifts: 0 }
];

export default function ColumbiaEnterpriseDashboard() {
  const [view, setView] = useState<'builder' | 'contract'>('builder');
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>(['1', '11', '17']);
  const [useAmortization, setUseAmortization] = useState(false);
  
  // Signature Form State
  const [formData, setFormData] = useState({ name: '', title: '', email: '', signature: '' });
  const [isSigned, setIsSigned] = useState(false);

  const toggleSite = (id: string) => {
    setSelectedSiteIds(prev => prev.includes(id) ? prev.filter(siteId => siteId !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedSiteIds.length === PREDEFINED_SITES.length) setSelectedSiteIds([]);
    else setSelectedSiteIds(PREDEFINED_SITES.map(s => s.id));
  };

  const selectedSites = PREDEFINED_SITES.filter(site => selectedSiteIds.includes(site.id));

  // --- RAW MATH LOGIC ---
  let totalWorkingDoors = 0;
  let totalBrokenDoors = 0;
  let totalRawMonthlyFee = 0;
  let totalUnits = 0;

  selectedSites.forEach(site => {
    totalUnits += site.units;
    const vRepair = site.vehicleGatesRepair;
    const vWorking = site.vehicleGates - vRepair;
    const pRepair = site.pedGatesRepair;
    const pWorking = site.pedGates - pRepair;

    totalWorkingDoors += (vWorking + pWorking);
    totalBrokenDoors += (vRepair + pRepair);

    const siteHardwareMonthly = (site.vehicleGates * 150) + (site.pedGates * 125) + ((vRepair + pRepair) * 250);
    totalRawMonthlyFee += siteHardwareMonthly;
  });

  const numSites = selectedSites.length;
  const rawSetupFee = (totalWorkingDoors * 500) + (totalBrokenDoors * 750);
  const rawAvgPerUnit = totalUnits > 0 ? (totalRawMonthlyFee / totalUnits) : 0;

  // --- VOLUME TIER LOGIC ---
  let unitCap = Infinity;
  let setupCapActive = false;
  let currentTierName = "Standard Pricing";
  
  if (numSites >= 16) {
    unitCap = 8.5;
    setupCapActive = true;
    currentTierName = "Maximum Scale ($8.50/Unit Cap)";
  } else if (numSites >= 13) {
    unitCap = 9.5;
    setupCapActive = true;
    currentTierName = "Enterprise Tier ($9.50/Unit Cap)";
  } else if (numSites >= 8) {
    unitCap = 10.5;
    setupCapActive = true;
    currentTierName = "Regional Tier ($10.50/Unit Cap)";
  }

  const isMonthlyCapped = rawAvgPerUnit > unitCap;
  const finalAvgPerUnitBeforeAmort = Math.min(rawAvgPerUnit, unitCap);
  const baseMonthlyTotal = finalAvgPerUnitBeforeAmort * totalUnits;
  const monthlySavings = totalRawMonthlyFee - baseMonthlyTotal;

  const cappedSetupFee = setupCapActive ? ((totalWorkingDoors + totalBrokenDoors) * 500) : rawSetupFee;
  const setupSavings = rawSetupFee - cappedSetupFee;

  const isAmortizationEligible = numSites >= 13;
  const amortizedUpfrontCapEx = numSites * 2500;
  const canActuallyAmortize = isAmortizationEligible && (cappedSetupFee > amortizedUpfrontCapEx);

  useEffect(() => {
    if (!canActuallyAmortize && useAmortization) setUseAmortization(false);
  }, [numSites, canActuallyAmortize, useAmortization]);

  let finalSetupFee = cappedSetupFee;
  let monthlyAmortizationFee = 0;

  if (canActuallyAmortize && useAmortization) {
    finalSetupFee = amortizedUpfrontCapEx;
    monthlyAmortizationFee = (cappedSetupFee - amortizedUpfrontCapEx) / 60;
  }

  const finalMonthlyTotal = baseMonthlyTotal + monthlyAmortizationFee;
  const finalBlendedUnitAvg = totalUnits > 0 ? (finalMonthlyTotal / totalUnits).toFixed(2) : "0.00";

  // Progress Bar Calculation
  const maxTier = 16;
  const progressPercent = Math.min((numSites / maxTier) * 100, 100);

  const handleSignContract = () => {
    if (!formData.name || !formData.signature) return;
    setIsSigned(true);
  };

  // ==========================================
  // VIEW 1: THE PORTFOLIO BUILDER
  // ==========================================
  if (view === 'builder') {
    return (
      <main className="min-h-screen bg-[#020813] font-sans text-slate-100 relative selection:bg-blue-500/30">
        
        {/* PREMIUM EXECUTIVE TEXTURE */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:20px_20px] opacity-70"></div>
        <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[150px] rounded-full z-0 pointer-events-none"></div>

        {/* STICKY COMMAND CENTER */}
        <div className="sticky top-0 z-50 bg-[#040d21]/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl transition-all">
          <div className="max-w-[1700px] mx-auto pt-6 px-4 lg:px-8 pb-4 relative">
            
            {/* Header / Actions */}
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
               <div className="flex items-center gap-4">
                  <div className="bg-white/5 p-2 rounded-xl border border-white/10 w-14 h-14 flex items-center justify-center backdrop-blur-md shadow-inner">
                     <span className="text-xl font-black text-white">CR</span>
                  </div>
                  <div>
                     <h1 className="text-2xl font-black text-white tracking-tight">Columbia Residential</h1>
                     <p className="text-xs text-blue-400 uppercase tracking-widest font-bold">Enterprise Deal Room</p>
                  </div>
               </div>
               <button 
                  onClick={() => setView('contract')}
                  disabled={selectedSites.length === 0}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-slate-500 text-white px-8 py-3.5 rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:shadow-none flex items-center gap-2 uppercase tracking-widest text-[11px]"
               >
                  Generate Contract <span>→</span>
               </button>
            </div>

            {/* Financial Dashboard Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
               
               {/* Stat 1: Scale */}
               <div className="col-span-2 lg:col-span-3 flex items-center gap-8">
                  <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Portfolio</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white">{selectedSites.length}</span>
                        <span className="text-xs text-slate-500 font-medium">/ 19 Sites</span>
                      </div>
                  </div>
                  <div className="flex flex-col border-l border-white/10 pl-8">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Scale</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white">{totalUnits.toLocaleString()}</span>
                        <span className="text-xs text-slate-500 font-medium">Units</span>
                      </div>
                  </div>
               </div>

               {/* Stat 2: Monthly OpEx */}
               <div className="col-span-2 lg:col-span-3 flex flex-col border-l border-white/10 pl-8 relative">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1 flex justify-between">
                      Monthly OpEx 
                      {isMonthlyCapped && <span className="text-emerald-400 font-black animate-pulse">+ SAVING ${monthlySavings.toLocaleString()}/mo</span>}
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                      {isMonthlyCapped && (
                          <span className="text-xl font-medium text-slate-500 line-through decoration-red-500/70 decoration-2">${totalRawMonthlyFee.toLocaleString()}</span>
                      )}
                      <span className="text-3xl font-black text-white font-mono">${finalMonthlyTotal.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>
                  <span className={`text-[10px] font-bold tracking-widest uppercase mt-1.5 ${isMonthlyCapped ? 'text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20 inline-block w-max' : 'text-slate-500'}`}>
                     Blended Rate: ${finalBlendedUnitAvg} / unit
                  </span>
               </div>

               {/* Stat 3: Upfront CapEx */}
               <div className="col-span-2 lg:col-span-3 flex flex-col border-l border-white/10 pl-8">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1 flex justify-between">
                      Turnkey Hardware Setup
                      {setupSavings > 0 && !useAmortization && <span className="text-emerald-400 font-black">+ SAVED ${setupSavings.toLocaleString()}</span>}
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                      {setupSavings > 0 && !useAmortization && (
                          <span className="text-xl font-medium text-slate-500 line-through decoration-red-500/70 decoration-2">${rawSetupFee.toLocaleString()}</span>
                      )}
                      <span className="text-3xl font-black text-white font-mono">${finalSetupFee.toLocaleString()}</span>
                  </div>
                  {setupCapActive && !useAmortization && (
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1.5 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20 inline-block w-max">
                          $500 Flat Rate Unlocked
                      </span>
                  )}
               </div>

               {/* Stat 4: Financing Toggle */}
               <div className="col-span-2 lg:col-span-3 flex flex-col border-l border-white/10 pl-8 justify-center h-full">
                   {canActuallyAmortize ? (
                      <div className={`p-4 rounded-xl border transition-all flex justify-between items-center shadow-2xl ${useAmortization ? 'bg-blue-900/20 border-blue-500/50' : 'bg-white/5 border-white/10'}`}>
                         <div>
                            <span className="block text-[11px] font-black text-white mb-1 tracking-wide">Enterprise Financing</span>
                            <span className="block text-[10px] text-slate-400 leading-tight">Cap setup at $2.5k/site. Balance amortized.</span>
                         </div>
                         <button onClick={() => setUseAmortization(!useAmortization)} className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 border border-white/10 ${useAmortization ? 'bg-blue-500' : 'bg-white/10'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform absolute ${useAmortization ? 'translate-x-7' : 'translate-x-1'}`}></div>
                         </button>
                      </div>
                   ) : (
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex justify-between items-center opacity-60">
                         <div>
                            <span className="block text-[11px] font-bold text-slate-500 mb-1">Financing Locked</span>
                            <span className="block text-[10px] text-slate-500 leading-tight">Select {Math.max(0, 13 - numSites)} more to unlock $2.5k CapEx cap.</span>
                         </div>
                      </div>
                   )}
               </div>
            </div>

            {/* VISUAL PROGRESS BAR (Center Bottom) */}
            <div className="mt-8 mb-2 flex flex-col items-center w-full max-w-4xl mx-auto">
                <div className="flex justify-between w-full text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2 px-2">
                    <span>Standard</span>
                    <span className={numSites >= 8 ? 'text-emerald-400' : ''}>8 Sites ($10.50)</span>
                    <span className={numSites >= 13 ? 'text-blue-400' : ''}>13 Sites ($9.50 + Finance)</span>
                    <span className={numSites >= 16 ? 'text-purple-400' : ''}>16 Sites ($8.50)</span>
                </div>
                <div className="relative w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}></div>
                    {/* Markers */}
                    <div className="absolute top-0 left-[50%] h-full w-px bg-white/20"></div> {/* 8 / 16 = 50% */}
                    <div className="absolute top-0 left-[81.25%] h-full w-px bg-white/20"></div> {/* 13 / 16 = 81.25% */}
                </div>
            </div>

          </div>
        </div>

        {/* PROPERTY GRID MENU */}
        <div className="max-w-[1700px] mx-auto p-4 lg:p-8 relative z-10">
           <div className="flex justify-between items-end mb-6">
              <div>
                 <h2 className="text-xl font-black text-white tracking-tight">Portfolio Roster</h2>
                 <p className="text-slate-400 text-sm mt-1">Select properties below to bundle them into your Addendum quote.</p>
              </div>
              <button onClick={handleSelectAll} className="text-[10px] text-blue-400 hover:text-white font-bold tracking-widest uppercase transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
                 {selectedSiteIds.length === PREDEFINED_SITES.length ? 'Deselect All' : 'Select All 19 Properties'}
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-32">
              {PREDEFINED_SITES.map((site) => {
                 const isSelected = selectedSiteIds.includes(site.id);
                 const vWorking = site.vehicleGates - site.vehicleGatesRepair;
                 const pWorking = site.pedGates - site.pedGatesRepair;

                 return (
                    <div 
                       key={site.id} 
                       onClick={() => toggleSite(site.id)}
                       className={`cursor-pointer rounded-xl p-6 border transition-all duration-200 relative backdrop-blur-xl flex flex-col justify-between
                          ${isSelected 
                             ? 'bg-blue-900/10 border-blue-500 shadow-[0_8px_30px_rgba(37,99,235,0.15)] ring-1 ring-blue-500/50' 
                             : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05] opacity-80 hover:opacity-100'
                          }
                       `}
                    >
                       <div className="flex justify-between items-start mb-6">
                          <div className="pr-10">
                             <h3 className="font-bold text-base text-white leading-tight mb-2 tracking-tight">{site.name}</h3>
                             <span className="inline-block bg-white/5 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest border border-white/10">{site.units} Units</span>
                          </div>
                          <div className={`absolute top-6 right-6 w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-blue-500 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'border-white/20 bg-black/50'}`}>
                             {isSelected && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                       </div>

                       <div className="space-y-3 mt-auto">
                          <div className="flex justify-between items-center pb-3 border-b border-white/5">
                              <span className="text-[11px] font-bold text-slate-400">Veh. Gates ({site.vehicleGates})</span>
                              <div className="flex gap-2 text-[10px] font-medium text-right">
                                  {vWorking > 0 ? <span className="text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20">{vWorking} Working</span> : null}
                                  {site.vehicleGatesRepair > 0 && <span className="text-red-400 bg-red-950/30 px-2 py-0.5 rounded border border-red-500/20">{site.vehicleGatesRepair} Broken</span>}
                                  {site.vehicleGates === 0 && <span className="text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/10">0 Gates</span>}
                              </div>
                          </div>
                          <div className="flex justify-between items-center pb-1">
                              <span className="text-[11px] font-bold text-slate-400">Ped. Doors ({site.pedGates})</span>
                              <div className="flex gap-2 text-[10px] font-medium text-right">
                                  {pWorking > 0 ? <span className="text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20">{pWorking} Working</span> : null}
                                  {site.pedGatesRepair > 0 && <span className="text-red-400 bg-red-950/30 px-2 py-0.5 rounded border border-red-500/20">{site.pedGatesRepair} Broken</span>}
                                  {site.pedGates === 0 && <span className="text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/10">0 Doors</span>}
                              </div>
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

  // ==========================================
  // VIEW 2: THE DIGITAL SIGNATURE ROOM
  // ==========================================
  return (
    <main className="min-h-screen bg-[#020813] font-sans text-slate-100 p-4 lg:p-10 relative">
        <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:20px_20px] opacity-70"></div>
        
        <div className="max-w-[1400px] mx-auto relative z-10">
            <button onClick={() => setView('builder')} className="text-[10px] uppercase font-bold tracking-widest text-slate-400 hover:text-white flex items-center gap-2 mb-8 bg-white/5 px-4 py-2 rounded-lg w-max border border-white/10">
                ← Back to Builder
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                
                {/* LEFT: THE CONTRACT PREVIEW */}
                <div className="lg:col-span-3 bg-white text-slate-900 p-8 lg:p-12 rounded-2xl shadow-2xl h-[800px] overflow-y-auto">
                    <div className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-end">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tight">Master Service Agreement</h2>
                            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs mt-2">Gate Guard, LLC & Columbia Residential</p>
                        </div>
                        <img src="/Columbia_logo.png" alt="Columbia Logo" className="w-[50px] h-[50px] object-contain" />
                    </div>

                    <div className="prose prose-sm prose-slate max-w-none">
                        <p><strong>1. Definitions & Scope</strong><br/>
                        These Terms and Conditions govern the proactive gate monitoring, preventative maintenance, and reporting services provided by Gate Guard, LLC to the Customer.</p>

                        <p><strong>2. Services Provided</strong><br/>
                        Gate Guard agrees to provide continuous monitoring and maintenance for the <strong>{numSites} properties</strong> selected in Addendum A.</p>

                        <h3 className="font-bold text-lg mt-6 border-b border-slate-200 pb-2">3. Financial Terms</h3>
                        <table className="w-full text-left mt-4 mb-6 text-sm border-collapse">
                            <tbody>
                                <tr className="border-b border-slate-200">
                                    <td className="py-2 font-bold">Total Properties:</td>
                                    <td className="py-2 text-right">{numSites} Sites</td>
                                </tr>
                                <tr className="border-b border-slate-200">
                                    <td className="py-2 font-bold">Total Scale:</td>
                                    <td className="py-2 text-right">{totalUnits} Units</td>
                                </tr>
                                <tr className="border-b border-slate-200">
                                    <td className="py-2 font-bold">One-Time Setup Fee:</td>
                                    <td className="py-2 text-right">${finalSetupFee.toLocaleString()}</td>
                                </tr>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <td className="py-2 font-bold pl-2">Monthly Subscription:</td>
                                    <td className="py-2 text-right pr-2">${finalMonthlyTotal.toLocaleString()} / mo</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3 className="font-bold text-lg mt-6 border-b border-slate-200 pb-2">4. Term & Termination</h3>
                        {useAmortization ? (
                            <div className="bg-amber-50 p-4 border-l-4 border-amber-500 my-4 text-amber-900 text-xs">
                                <p className="mb-2"><strong>Enterprise Financing Active:</strong> Setup costs have been capped at $2,500 per site, with the remaining balance amortized into the Monthly Subscription.</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li><strong>Initial Term:</strong> Sixty (60) months beginning on the Effective Date.</li>
                                    <li><strong>Early Termination Fees:</strong> If Customer terminates for convenience before the end of the Initial Term, the following percentages of the remaining contract value shall be due immediately:
                                        <ul className="list-circle pl-5 mt-1">
                                            <li>Termination in Year 1: 30% of remaining contract value.</li>
                                            <li>Termination in Year 2: 20% of remaining contract value.</li>
                                            <li>Termination in Year 3: 10% of remaining contract value.</li>
                                            <li>Termination after Year 4: 0% of remaining contract value.</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div className="bg-slate-50 p-4 border-l-4 border-slate-400 my-4 text-slate-700 text-xs">
                                <p className="mb-2"><strong>Standard Terms Active:</strong> Customer has paid setup CapEx upfront.</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li><strong>Termination for Convenience:</strong> Customer may terminate for convenience with Ninety (90) Days written notice.</li>
                                    <li><strong>Automatic Renewal:</strong> Successive one (1) year terms unless either party provides written notice of non-renewal at least sixty (60) days prior to expiration.</li>
                                </ul>
                            </div>
                        )}

                        <p><strong>5. Intellectual Property & Accounts</strong><br/>
                        Customer is responsible for maintaining the confidentiality of login credentials. Software, platforms, analytics, and processes remain the intellectual property of Gate Guard, LLC.</p>

                        <p><strong>6. Governing Law</strong><br/>
                        This Agreement shall be governed by, and construed in accordance with, the laws of the State of Georgia, without regard to its conflict of law principles.</p>
                    </div>
                </div>

                {/* RIGHT: THE SIGNATURE BLOCK */}
                <div className="lg:col-span-2">
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 sticky top-10">
                        <h3 className="text-xl font-black text-white mb-6 tracking-tight">Sign & Formalize</h3>
                        
                        {isSigned ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8 text-center">
                                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
                                <h4 className="text-lg font-black text-white mb-2">Contract Executed</h4>
                                <p className="text-xs text-emerald-200/70">A copy of this agreement has been sent to {formData.email}. Gate Guard operations will contact you shortly to schedule implementation.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Full Legal Name</label>
                                    <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Official Title</label>
                                    <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Corporate Email</label>
                                    <input type="email" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                </div>
                                
                                <div className="pt-4 border-t border-white/10 mt-6">
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Digital Signature Acknowledgement</label>
                                    <div className="bg-white rounded-lg h-24 flex items-center justify-center border-2 border-dashed border-slate-300 relative overflow-hidden">
                                        <input type="text" placeholder="Type name to sign..." className="absolute inset-0 w-full h-full text-center text-3xl font-serif italic text-slate-800 outline-none bg-transparent placeholder:text-slate-300 placeholder:not-italic placeholder:text-sm" value={formData.signature} onChange={e => setFormData({...formData, signature: e.target.value})} />
                                    </div>
                                    <p className="text-[9px] text-slate-500 mt-2 leading-relaxed">By signing above, you confirm you are an authorized representative of Columbia Residential and agree to the terms generated in the Master Service Agreement.</p>
                                </div>

                                <button 
                                    onClick={handleSignContract}
                                    disabled={!formData.name || !formData.signature}
                                    className="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-slate-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] disabled:shadow-none"
                                >
                                    Accept & Execute Contract
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    </main>
  );
}
