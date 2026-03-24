"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// 1. EXACT DATA EXTRACTED FROM COLUMBIA SURVEY (19 SITES)
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
  // Start with a few pre-selected to show the interactive math
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>(['1', '11', '17']);
  const [useAmortization, setUseAmortization] = useState(false);
  const [requestState, setRequestState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const toggleSite = (id: string) => {
    setSelectedSiteIds(prev => prev.includes(id) ? prev.filter(siteId => siteId !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedSiteIds.length === PREDEFINED_SITES.length) setSelectedSiteIds([]);
    else setSelectedSiteIds(PREDEFINED_SITES.map(s => s.id));
  };

  const selectedSites = PREDEFINED_SITES.filter(site => selectedSiteIds.includes(site.id));

  // --- RAW MATH LOGIC (What it SHOULD cost) ---
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

  // --- VOLUME TIER LOGIC (The Columbia Caps) ---
  let unitCap = Infinity;
  let setupCapActive = false;
  let currentTierName = "Standard Pricing";
  let nextTierSites: number | null = 8;
  
  if (numSites >= 16) {
    unitCap = 8.5;
    setupCapActive = true;
    currentTierName = "Maximum Scale ($8.50/Unit Cap)";
    nextTierSites = null;
  } else if (numSites >= 13) {
    unitCap = 9.5;
    setupCapActive = true;
    currentTierName = "Enterprise Tier ($9.50/Unit Cap)";
    nextTierSites = 16;
  } else if (numSites >= 8) {
    unitCap = 10.5;
    setupCapActive = true;
    currentTierName = "Regional Tier ($10.50/Unit Cap)";
    nextTierSites = 13;
  }

  // Monthly Calculations & Savings
  const isMonthlyCapped = rawAvgPerUnit > unitCap;
  const finalAvgPerUnitBeforeAmort = Math.min(rawAvgPerUnit, unitCap);
  const baseMonthlyTotal = finalAvgPerUnitBeforeAmort * totalUnits;
  const monthlySavings = totalRawMonthlyFee - baseMonthlyTotal;

  // Setup Calculations & Savings
  const cappedSetupFee = setupCapActive ? ((totalWorkingDoors + totalBrokenDoors) * 500) : rawSetupFee;
  const setupSavings = rawSetupFee - cappedSetupFee;

  // Amortization Logic (13+ Sites)
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

  const handleFormalizeRequest = async () => {
    if (selectedSites.length === 0) return; 
    setRequestState('submitting');
    setTimeout(() => setRequestState('success'), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      
      {/* LUXURY B2B TEXTURE - Faint Grid + Radial Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
      <div className="fixed top-0 left-0 w-full h-[300px] bg-gradient-to-b from-blue-50/50 to-transparent z-0 pointer-events-none"></div>

      {/* 1. FORTUNE 500 STICKY HEADER (Expanded & Visually Rich) */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-[1700px] mx-auto p-4 lg:px-8 lg:py-6">
          
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
             <div className="flex items-center gap-4">
                <div className="border border-slate-200 p-2 rounded-lg bg-white shadow-sm w-14 h-14 flex items-center justify-center">
                   <Image src="/Columbia_logo.png" alt="Columbia" width={48} height={48} className="object-contain" />
                </div>
                <div>
                   <h1 className="text-2xl font-black text-slate-900 tracking-tight">Columbia Residential</h1>
                   <p className="text-xs text-slate-500 font-medium tracking-wide">Enterprise Operations Dashboard</p>
                </div>
             </div>
             <button 
                onClick={handleFormalizeRequest}
                disabled={selectedSites.length === 0}
                className="bg-[#0B2447] hover:bg-blue-900 disabled:bg-slate-200 disabled:text-slate-400 text-white px-8 py-3.5 rounded-lg font-bold transition-all disabled:shadow-none shadow-md flex items-center gap-2 tracking-wide"
             >
                Request Contract <span>→</span>
             </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
             
             {/* Stat 1: Selection & Scale */}
             <div className="col-span-2 lg:col-span-3 flex items-center gap-8">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Portfolio</span>
                    <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900">{selectedSites.length}</span>
                    <span className="text-xs text-slate-500 font-medium">/ 19 Sites</span>
                    </div>
                </div>
                <div className="flex flex-col border-l border-slate-200 pl-8">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Scale</span>
                    <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900">{totalUnits.toLocaleString()}</span>
                    <span className="text-xs text-slate-500 font-medium">Units</span>
                    </div>
                </div>
             </div>

             {/* Stat 2: Monthly OpEx (SAVINGS VISUALIZED) */}
             <div className="col-span-2 lg:col-span-3 flex flex-col border-l border-slate-200 pl-8 relative">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1 flex justify-between">
                    Monthly OpEx 
                    {isMonthlyCapped && <span className="text-emerald-600 font-black animate-[fadeIn_0.5s_ease-out]">SAVING ${monthlySavings.toLocaleString()}/mo</span>}
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                    {isMonthlyCapped && (
                        <span className="text-xl font-medium text-slate-400 line-through decoration-red-400/50 decoration-2">${totalRawMonthlyFee.toLocaleString()}</span>
                    )}
                    <span className="text-3xl font-black text-slate-900 font-mono">${finalMonthlyTotal.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                </div>
                <span className={`text-[10px] font-bold tracking-widest uppercase mt-1.5 ${isMonthlyCapped ? 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded inline-block w-max' : 'text-slate-500'}`}>
                   Blended Rate: ${finalBlendedUnitAvg} / unit
                </span>
             </div>

             {/* Stat 3: Upfront Setup (SAVINGS VISUALIZED) */}
             <div className="col-span-2 lg:col-span-3 flex flex-col border-l border-slate-200 pl-8">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1 flex justify-between">
                    Turnkey Hardware Setup
                    {setupSavings > 0 && !useAmortization && <span className="text-emerald-600 font-black">SAVED ${setupSavings.toLocaleString()}</span>}
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                    {setupSavings > 0 && !useAmortization && (
                        <span className="text-xl font-medium text-slate-400 line-through decoration-red-400/50 decoration-2">${rawSetupFee.toLocaleString()}</span>
                    )}
                    <span className="text-3xl font-black text-slate-900 font-mono">${finalSetupFee.toLocaleString()}</span>
                </div>
                {setupCapActive && !useAmortization && (
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1.5 bg-emerald-50 px-2 py-0.5 rounded inline-block w-max">
                        $500 Flat Repair Rate Unlocked
                    </span>
                )}
             </div>

             {/* Stat 4: Amortization Toggle */}
             <div className="col-span-2 lg:col-span-3 flex flex-col border-l border-slate-200 pl-8 justify-center h-full">
                 {canActuallyAmortize ? (
                    <div className={`p-4 rounded-xl border transition-all flex justify-between items-center ${useAmortization ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-200'}`}>
                       <div>
                          <span className="block text-[11px] font-black text-slate-900 mb-1 tracking-wide">Enterprise Financing</span>
                          <span className="block text-[10px] text-slate-500 leading-tight">Cap setup at $2.5k/site. Balance amortized.</span>
                       </div>
                       <button onClick={() => setUseAmortization(!useAmortization)} className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 shadow-inner ${useAmortization ? 'bg-[#0B2447]' : 'bg-slate-300'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform absolute ${useAmortization ? 'translate-x-7' : 'translate-x-1'}`}></div>
                       </button>
                    </div>
                 ) : (
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center opacity-60">
                       <div>
                          <span className="block text-[11px] font-bold text-slate-500 mb-1">Financing Locked</span>
                          <span className="block text-[10px] text-slate-400 leading-tight">Select {Math.max(0, 13 - numSites)} more to unlock $2.5k CapEx cap.</span>
                       </div>
                    </div>
                 )}
             </div>

          </div>
          
          {/* Progress / Tier Tracker */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-2">
                 <span className="text-xs font-bold text-slate-800 tracking-wide">{currentTierName}</span>
             </div>
             <p className="text-xs text-slate-500">
                Unlock thresholds: 
                <strong className={`ml-2 ${numSites >= 8 ? 'text-emerald-600' : 'text-slate-900'}`}>8 sites ($10.50)</strong> • 
                <strong className={`ml-2 ${numSites >= 13 ? 'text-emerald-600' : 'text-slate-900'}`}>13 sites ($9.50)</strong> • 
                <strong className={`ml-2 ${numSites >= 16 ? 'text-emerald-600' : 'text-slate-900'}`}>16 sites ($8.50)</strong>
             </p>
          </div>

        </div>
      </div>

      {/* 2. PROPERTY GRID MENU */}
      <div className="max-w-[1700px] mx-auto p-4 lg:p-8 relative z-10">
         
         {/* Success State Overlay */}
         {requestState === 'success' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center mb-10 shadow-sm animate-[fadeIn_0.5s_ease-out]">
               <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
               <h2 className="text-2xl font-black text-emerald-900 mb-2">Addendum Requested Successfully</h2>
               <p className="text-emerald-700">We are drafting the paperwork for your {selectedSites.length} selected sites. Your account executive will be in touch shortly.</p>
            </div>
         )}

         <div className="flex justify-between items-end mb-6">
            <div>
               <h2 className="text-xl font-black text-slate-900 tracking-tight">Portfolio Roster</h2>
               <p className="text-slate-500 text-sm mt-1">Select properties below to bundle them into your Addendum quote.</p>
            </div>
            <button onClick={handleSelectAll} className="text-xs text-[#0B2447] hover:text-blue-700 font-bold tracking-widest uppercase transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
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
                     className={`cursor-pointer rounded-xl p-6 border transition-all duration-200 relative bg-white/80 backdrop-blur-sm flex flex-col justify-between
                        ${isSelected 
                           ? 'border-[#0B2447] shadow-[0_8px_30px_rgba(11,36,71,0.08)] ring-1 ring-[#0B2447]' 
                           : 'border-slate-200 hover:border-slate-300 hover:shadow-md hover:bg-white opacity-80 hover:opacity-100'
                        }
                     `}
                  >
                     {/* Card Header */}
                     <div className="flex justify-between items-start mb-6">
                        <div className="pr-10">
                           <h3 className="font-bold text-base text-slate-900 leading-tight mb-2 tracking-tight">{site.name}</h3>
                           <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest border border-slate-200">{site.units} Units</span>
                        </div>
                        {/* Custom Checkbox */}
                        <div className={`absolute top-6 right-6 w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-[#0B2447] border-[#0B2447] text-white shadow-sm' : 'border-slate-300 bg-slate-50'}`}>
                           {isSelected && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                     </div>

                     {/* Detailed Hardware Status */}
                     <div className="space-y-3 mt-auto">
                        {/* Vehicle Gates Row */}
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100/80">
                            <span className="text-[11px] font-bold text-slate-600">Veh. Gates ({site.vehicleGates})</span>
                            <div className="flex gap-2 text-[10px] font-medium text-right">
                                {vWorking > 0 ? <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">{vWorking} Working</span> : null}
                                {site.vehicleGatesRepair > 0 && <span className="text-red-700 bg-red-100/80 px-2 py-0.5 rounded border border-red-200">{site.vehicleGatesRepair} Broken</span>}
                                {site.vehicleGates === 0 && <span className="text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">0 Gates</span>}
                            </div>
                        </div>
                        
                        {/* Pedestrian Doors Row */}
                        <div className="flex justify-between items-center pb-1">
                            <span className="text-[11px] font-bold text-slate-600">Ped. Doors ({site.pedGates})</span>
                            <div className="flex gap-2 text-[10px] font-medium text-right">
                                {pWorking > 0 ? <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">{pWorking} Working</span> : null}
                                {site.pedGatesRepair > 0 && <span className="text-red-700 bg-red-100/80 px-2 py-0.5 rounded border border-red-200">{site.pedGatesRepair} Broken</span>}
                                {site.pedGates === 0 && <span className="text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">0 Doors</span>}
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
