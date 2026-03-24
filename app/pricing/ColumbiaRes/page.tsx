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
  
  // Expanded Signature & Binding Form State
  const [formData, setFormData] = useState({ 
      ownerName: 'Columbia Residential', 
      portfolioName: 'Columbia Portfolio Group',
      address: '', 
      phone: '',
      email: '', 
      signerName: '', 
      signerTitle: '',
      signature: '' 
  });
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

  // --- NEW 5-TIER VOLUME LOGIC ---
  let unitCap = Infinity;
  let discountPercent = 0;
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
  } else if (numSites >= 4) {
    discountPercent = 0.15;
    currentTierName = "Multi-Site (15% Discount)";
  } else if (numSites >= 2) {
    discountPercent = 0.10;
    currentTierName = "Dual-Site (10% Discount)";
  }

  let finalSetupFee = rawSetupFee;
  let baseMonthlyTotal = totalRawMonthlyFee;
  let setupSavings = 0;
  let monthlySavings = 0;

  if (setupCapActive) {
      // 8+ Sites: Flat $500 setup & Unit Caps
      finalSetupFee = (totalWorkingDoors + totalBrokenDoors) * 500;
      setupSavings = rawSetupFee - finalSetupFee;

      const finalAvgPerUnitBeforeAmort = Math.min(rawAvgPerUnit, unitCap);
      baseMonthlyTotal = finalAvgPerUnitBeforeAmort * totalUnits;
      monthlySavings = totalRawMonthlyFee - baseMonthlyTotal;
  } else if (discountPercent > 0) {
      // 2-7 Sites: Flat % Discount off raw prices
      finalSetupFee = rawSetupFee * (1 - discountPercent);
      setupSavings = rawSetupFee - finalSetupFee;

      baseMonthlyTotal = totalRawMonthlyFee * (1 - discountPercent);
      monthlySavings = totalRawMonthlyFee - baseMonthlyTotal;
  }

  const isMonthlyDiscounted = monthlySavings > 0;

  // Amortization (Requires 13+ Sites)
  const isAmortizationEligible = numSites >= 13;
  const amortizedUpfrontCapEx = numSites * 2500;
  const canActuallyAmortize = isAmortizationEligible && (finalSetupFee > amortizedUpfrontCapEx);

  useEffect(() => {
    if (!canActuallyAmortize && useAmortization) setUseAmortization(false);
  }, [numSites, canActuallyAmortize, useAmortization]);

  let monthlyAmortizationFee = 0;
  if (canActuallyAmortize && useAmortization) {
    monthlyAmortizationFee = (finalSetupFee - amortizedUpfrontCapEx) / 60;
    finalSetupFee = amortizedUpfrontCapEx;
  }

  const finalMonthlyTotal = baseMonthlyTotal + monthlyAmortizationFee;
  const finalBlendedUnitAvg = totalUnits > 0 ? (finalMonthlyTotal / totalUnits).toFixed(2) : "0.00";

  // Progress Bar
  const maxTier = 16;
  const progressPercent = Math.min((numSites / maxTier) * 100, 100);

  // Formatting Today's Date
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleSignContract = () => {
    if (!formData.signerName || !formData.signature || !formData.email) return;
    setIsSigned(true);
  };

  // ==========================================
  // VIEW 1: THE PORTFOLIO BUILDER
  // ==========================================
  if (view === 'builder') {
    return (
      <main className="min-h-screen bg-[#020813] font-sans text-slate-100 relative selection:bg-blue-500/30">
        <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:20px_20px] opacity-70"></div>
        <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[150px] rounded-full z-0 pointer-events-none"></div>

        <div className="sticky top-0 z-50 bg-[#040d21]/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl transition-all">
          <div className="max-w-[1700px] mx-auto pt-6 px-4 lg:px-8 pb-4 relative">
            
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

            <div className="grid grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
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

               <div className="col-span-2 lg:col-span-3 flex flex-col border-l border-white/10 pl-8 relative">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1 flex justify-between">
                      Monthly OpEx 
                      {isMonthlyDiscounted && <span className="text-emerald-400 font-black animate-pulse">+ SAVING ${monthlySavings.toLocaleString(undefined, {maximumFractionDigits: 0})}/mo</span>}
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                      {isMonthlyDiscounted && (
                          <span className="text-xl font-medium text-slate-500 line-through decoration-red-500/70 decoration-2">${totalRawMonthlyFee.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                      )}
                      <span className="text-3xl font-black text-white font-mono">${finalMonthlyTotal.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>
                  <span className={`text-[10px] font-bold tracking-widest uppercase mt-1.5 ${isMonthlyDiscounted ? 'text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20 inline-block w-max' : 'text-slate-500'}`}>
                     Blended Rate: ${finalBlendedUnitAvg} / unit
                  </span>
               </div>

               <div className="col-span-2 lg:col-span-3 flex flex-col border-l border-white/10 pl-8">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1 flex justify-between">
                      Turnkey Hardware Setup
                      {setupSavings > 0 && !useAmortization && <span className="text-emerald-400 font-black">+ SAVED ${setupSavings.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>}
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                      {setupSavings > 0 && !useAmortization && (
                          <span className="text-xl font-medium text-slate-500 line-through decoration-red-500/70 decoration-2">${rawSetupFee.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                      )}
                      <span className="text-3xl font-black text-white font-mono">${finalSetupFee.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>
                  {setupCapActive && !useAmortization && (
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1.5 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20 inline-block w-max">
                          $500 Flat Rate Unlocked
                      </span>
                  )}
               </div>

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

            <div className="mt-8 mb-2 flex flex-col items-center w-full max-w-5xl mx-auto">
                <div className="flex justify-between w-full text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2 px-2">
                    <span>Base</span>
                    <span className={numSites >= 2 ? 'text-white' : ''}>2 Sites (10%)</span>
                    <span className={numSites >= 4 ? 'text-white' : ''}>4 Sites (15%)</span>
                    <span className={numSites >= 8 ? 'text-emerald-400' : ''}>8 Sites ($10.50)</span>
                    <span className={numSites >= 13 ? 'text-blue-400' : ''}>13 Sites ($9.50)</span>
                    <span className={numSites >= 16 ? 'text-purple-400' : ''}>16 Sites ($8.50)</span>
                </div>
                <div className="relative w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}></div>
                    <div className="absolute top-0 left-[12.5%] h-full w-px bg-white/20"></div> {/* 2 Sites */}
                    <div className="absolute top-0 left-[25%] h-full w-px bg-white/20"></div> {/* 4 Sites */}
                    <div className="absolute top-0 left-[50%] h-full w-px bg-white/20"></div> {/* 8 Sites */}
                    <div className="absolute top-0 left-[81.25%] h-full w-px bg-white/20"></div> {/* 13 Sites */}
                </div>
            </div>

          </div>
        </div>

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
  // VIEW 2: DYNAMIC DIGITAL SIGNATURE ROOM
  // ==========================================
  return (
    <main className="min-h-screen bg-[#020813] font-sans text-slate-100 p-4 lg:p-10 relative selection:bg-blue-500/30">
        <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:20px_20px] opacity-70"></div>
        
        <div className="max-w-[1500px] mx-auto relative z-10">
            <button onClick={() => setView('builder')} className="text-[10px] uppercase font-bold tracking-widest text-slate-400 hover:text-white flex items-center gap-2 mb-8 bg-white/5 px-4 py-2 rounded-lg w-max border border-white/10 transition-colors">
                ← Return to Deal Builder
            </button>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                
                {/* LEFT SIDE: DYNAMIC CONTRACT PREVIEW */}
                <div className="xl:col-span-8 bg-white text-slate-900 p-8 lg:p-12 rounded-2xl shadow-2xl h-[800px] overflow-y-auto">
                    
                    {/* Contract Header */}
                    <div className="border-b-2 border-slate-900 pb-6 mb-8">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">Your Gate Guard Service Agreement</h1>
                                <p className="text-slate-500 font-bold tracking-widest uppercase text-xs mt-2">Prepared Date: {today}</p>
                            </div>
                            <img src="/logo.png" alt="Gate Guard" className="h-12 w-auto object-contain" />
                        </div>
                        <p className="text-sm text-slate-700">This Agreement is entered into as of the Effective Date by and between <strong>Gate Guard, LLC</strong> and <strong>{formData.ownerName || "[Customer Name]"}</strong>.</p>
                    </div>

                    <div className="prose prose-sm prose-slate max-w-none">
                        
                        {/* Parties */}
                        <div className="grid grid-cols-2 gap-8 mb-8 bg-slate-50 p-6 rounded-lg border border-slate-200">
                            <div>
                                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-2 border-b border-slate-200 pb-2">Service Provider</h4>
                                <p className="leading-relaxed"><strong>Gate Guard, LLC</strong><br/>
                                980 Hammond Drive, Ste. 200<br/>
                                Atlanta, GA 30328<br/>
                                (844) 4MY-GATE<br/>
                                info@gateguard.co</p>
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-2 border-b border-slate-200 pb-2">Customer</h4>
                                <p className="leading-relaxed">
                                    <strong>{formData.ownerName || "[Customer Name]"}</strong><br/>
                                    Site: {formData.portfolioName || "[Portfolio Name]"}<br/>
                                    {formData.address ? <>{formData.address}<br/></> : <span className="text-red-400 italic">[Enter Address in form]</span>}
                                    Phone: {formData.phone || "[Phone]"}<br/>
                                    Email: {formData.email || "[Email]"}
                                </p>
                            </div>
                        </div>

                        {/* Standard Legal Language from Document */}
                        <h3 className="font-bold text-lg mt-8 border-b border-slate-200 pb-2">1. Definitions & Scope</h3>
                        <p>These Terms and Conditions govern the proactive gate monitoring, preventative maintenance, and reporting services (the "Service") provided by Gate Guard, LLC to the Customer. By signing this Agreement or utilizing the Service, Customer agrees to be bound by these terms, which establish a professional partnership aimed at maintaining site security and operational uptime.</p>

                        <h3 className="font-bold text-lg mt-6 border-b border-slate-200 pb-2">2. Services Provided</h3>
                        <p>Gate Guard agrees to provide continuous monitoring and maintenance for the following <strong>{numSites} properties</strong> selected by the Customer:</p>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                            {selectedSites.map(site => (
                                <li key={site.id}>• {site.name} ({site.units} Units)</li>
                            ))}
                        </ul>

                        <h3 className="font-bold text-lg mt-8 border-b border-slate-200 pb-2">3. Maintenance & Support Scope</h3>
                        <table className="w-full text-left text-xs border-collapse border border-slate-200 mb-6">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="border border-slate-200 p-2 w-1/4">Category</th>
                                    <th className="border border-slate-200 p-2">Included in Monthly Program</th>
                                    <th className="border border-slate-200 p-2">Excluded (Billable)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-slate-200 p-2 font-bold">GateGuard Hardware</td>
                                    <td className="border border-slate-200 p-2">Maintain, repair or replace Gate Guard supplied cameras, controllers, and readers due to failure.</td>
                                    <td className="border border-slate-200 p-2">Replacement of equipment damaged/removed by ownership.</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-200 p-2 font-bold">Veh. & Ped. Gates</td>
                                    <td className="border border-slate-200 p-2">Remote technical support, preventative maintenance visits, repairs/replacements due to failure.</td>
                                    <td className="border border-slate-200 p-2">We do not cover the physical gate or door, ONLY devices connected to ensure controlled access.</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3 className="font-bold text-lg mt-6 border-b border-slate-200 pb-2">4. Financial Quote & Payment Terms</h3>
                        <table className="w-full text-left mt-4 mb-6 text-sm border-collapse">
                            <tbody>
                                <tr className="border-b border-slate-200">
                                    <td className="py-2 font-bold">Total Properties Covered:</td>
                                    <td className="py-2 text-right">{numSites} Sites</td>
                                </tr>
                                <tr className="border-b border-slate-200">
                                    <td className="py-2 font-bold">Total Portfolio Scale:</td>
                                    <td className="py-2 text-right">{totalUnits} Units</td>
                                </tr>
                                <tr className="border-b border-slate-200">
                                    <td className="py-2 font-bold">One-Time Setup Fee (Due at Go-Live):</td>
                                    <td className="py-2 text-right">${finalSetupFee.toLocaleString()}</td>
                                </tr>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <td className="py-2 font-bold pl-2">Predictable Monthly Subscription:</td>
                                    <td className="py-2 text-right pr-2">${finalMonthlyTotal.toLocaleString()} / mo</td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="text-xs"><strong>Payment Terms:</strong> Deposit equal to 50% of the Total Due today. Remaining 50% of Setup and first month's Service due on Go Live date. Monthly fees begin on the 15th of the following calendar month.</p>

                        <h3 className="font-bold text-lg mt-8 border-b border-slate-200 pb-2">5. Term & Termination</h3>
                        {useAmortization ? (
                            <div className="bg-amber-50 p-4 border-l-4 border-amber-500 my-4 text-amber-900 text-xs">
                                <p className="mb-2"><strong>Enterprise Financing Election:</strong> Customer has elected to cap upfront setup costs at $2,500 per site, with the remaining balance amortized into the Monthly Subscription over a 60-month schedule.</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Initial Term:</strong> Sixty (60) months beginning on the Effective Date.</li>
                                    <li><strong>Early Termination for Convenience:</strong> If Customer terminates for convenience before the end of the Initial Term, the remaining unamortized hardware balance shall become due and payable immediately:
                                        <ul className="list-circle pl-5 mt-1 space-y-1">
                                            <li>Termination in Year 1: 30% of remaining contract value due.</li>
                                            <li>Termination in Year 2: 20% of remaining contract value due.</li>
                                            <li>Termination in Year 3: 10% of remaining contract value due.</li>
                                            <li>Termination after Year 4: 0% of remaining contract value due.</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div className="bg-slate-50 p-4 border-l-4 border-slate-400 my-4 text-slate-700 text-xs">
                                <p className="mb-2"><strong>Standard Terms Active:</strong> Customer has elected to pay setup CapEx upfront without financing.</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Initial Term:</strong> Sixty (60) months beginning on the Effective Date.</li>
                                    <li><strong>Termination for Convenience:</strong> Customer may terminate this agreement for convenience by providing Ninety (90) Days written notice to Gate Guard, LLC.</li>
                                    <li><strong>Automatic Renewal:</strong> Successive one (1) year terms unless either party provides written notice of non-renewal at least sixty (60) days prior to expiration.</li>
                                </ul>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-xs mt-8">
                            <div>
                                <p><strong>8. Intellectual Property</strong><br/>Software, platforms, analytics, and processes remain the intellectual property of Gate Guard, LLC.</p>
                            </div>
                            <div>
                                <p><strong>10. Limitation of Liability</strong><br/>Provider is not an insurer. Liability is capped at the total service fees paid by Customer for the six (6) months preceding the event.</p>
                            </div>
                        </div>

                        {/* Signature Block Rendering */}
                        <div className="mt-12 pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-12">
                            <div>
                                <p className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-6">Service Provider (Gate Guard, LLC)</p>
                                <div className="border-b border-slate-300 pb-1 mb-2">
                                    <span className="font-serif italic text-2xl text-slate-800 block -mb-2">Russel Feldman</span>
                                </div>
                                <p className="text-xs"><strong>Name:</strong> Russel Feldman</p>
                                <p className="text-xs"><strong>Title:</strong> Partner</p>
                                <p className="text-xs"><strong>Date:</strong> {today}</p>
                            </div>
                            <div>
                                <p className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-6">Customer ({formData.ownerName || "Entity"})</p>
                                <div className="border-b border-slate-300 pb-1 mb-2 h-[34px] overflow-hidden">
                                    {formData.signature && <span className="font-serif italic text-2xl text-blue-900 block -mb-2">{formData.signature}</span>}
                                </div>
                                <p className="text-xs"><strong>Name:</strong> {formData.signerName}</p>
                                <p className="text-xs"><strong>Title:</strong> {formData.signerTitle}</p>
                                <p className="text-xs"><strong>Date:</strong> {isSigned ? today : ''}</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* RIGHT SIDE: THE BINDING FORM */}
                <div className="xl:col-span-4">
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 lg:p-8 sticky top-10 shadow-2xl">
                        <h3 className="text-xl font-black text-white mb-2 tracking-tight">Contract Setup</h3>
                        <p className="text-xs text-slate-400 mb-6 leading-relaxed">Fill out the fields below. The Master Service Agreement will populate in real-time.</p>
                        
                        {isSigned ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8 text-center animate-[fadeIn_0.5s_ease-out]">
                                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">✓</div>
                                <h4 className="text-lg font-black text-white mb-2">Contract Executed</h4>
                                <p className="text-xs text-emerald-200/80 leading-relaxed">The final executed document has been emailed to <strong>{formData.email}</strong> and <strong>rfeldman@gateguard.co</strong>. We will contact you shortly to schedule implementation.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Owning Entity</label>
                                        <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-blue-500 outline-none transition-colors" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Portfolio/Site Name</label>
                                        <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-blue-500 outline-none transition-colors" value={formData.portfolioName} onChange={e => setFormData({...formData, portfolioName: e.target.value})} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Corporate Address</label>
                                        <input type="text" placeholder="123 Main St, Atlanta, GA" className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-blue-500 outline-none transition-colors placeholder:text-slate-600" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Billing Email</label>
                                        <input type="email" placeholder="ap@company.com" className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-blue-500 outline-none transition-colors placeholder:text-slate-600" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Phone</label>
                                        <input type="tel" placeholder="(555) 123-4567" className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-blue-500 outline-none transition-colors placeholder:text-slate-600" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                    </div>
                                </div>
                                
                                <div className="pt-4 border-t border-white/10 mt-6 space-y-4">
                                    <h4 className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">Authorized Signer</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-1">
                                            <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Signer Name</label>
                                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-blue-500 outline-none transition-colors" value={formData.signerName} onChange={e => setFormData({...formData, signerName: e.target.value})} />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Signer Title</label>
                                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-blue-500 outline-none transition-colors" value={formData.signerTitle} onChange={e => setFormData({...formData, signerTitle: e.target.value})} />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 mt-2">Digital Signature Binding</label>
                                        <div className="bg-white rounded-lg h-24 flex items-center justify-center border-2 border-dashed border-slate-400 relative overflow-hidden group hover:border-blue-500 transition-colors">
                                            <input type="text" placeholder="Type full name to sign electronically..." className="absolute inset-0 w-full h-full text-center text-3xl font-serif italic text-blue-900 outline-none bg-transparent placeholder:text-slate-300 placeholder:not-italic placeholder:text-xs" value={formData.signature} onChange={e => setFormData({...formData, signature: e.target.value})} />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleSignContract}
                                    disabled={!formData.signerName || !formData.signature || !formData.email || !formData.ownerName}
                                    className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-slate-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] disabled:shadow-none flex items-center justify-center gap-2"
                                >
                                    Accept & Execute Contract
                                </button>
                                <p className="text-[9px] text-slate-500 mt-2 text-center">By clicking above, you confirm you are an authorized representative and agree to execute this Master Service Agreement.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    </main>
  );
}
