"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// MASTER PROPERTY DATABASE
const PREDEFINED_SITES = [
  { id: '1', name: 'Park Commons', units: 230, vehicleGates: 5, vehicleGatesRepair: 2, pedGates: 10, pedGatesRepair: 2, cameras: 2, conciergeShifts: 0 },
  { id: '2', name: 'Pendana Family at West Lakes', units: 200, vehicleGates: 6, vehicleGatesRepair: 3, pedGates: 24, pedGatesRepair: 20, cameras: 0, conciergeShifts: 0 },
  { id: '3', name: 'Pendana Senior at West Lakes', units: 120, vehicleGates: 0, vehicleGatesRepair: 0, pedGates: 14, pedGatesRepair: 1, cameras: 0, conciergeShifts: 0 },
  { id: '4', name: 'Columbia Gardens South City', units: 290, vehicleGates: 6, vehicleGatesRepair: 3, pedGates: 19, pedGatesRepair: 3, cameras: 0, conciergeShifts: 0 },
  { id: '5', name: 'John James Fonda Collection', units: 150, vehicleGates: 2, vehicleGatesRepair: 1, pedGates: 6, pedGatesRepair: 0, cameras: 1, conciergeShifts: 0 },
  { id: '6', name: 'Gregg Hypolite Collection', units: 320, vehicleGates: 4, vehicleGatesRepair: 0, pedGates: 12, pedGatesRepair: 4, cameras: 4, conciergeShifts: 1 },
  { id: '7', name: 'Columbia Brook Park', units: 210, vehicleGates: 2, vehicleGatesRepair: 0, pedGates: 8, pedGatesRepair: 1, cameras: 2, conciergeShifts: 0 },
  { id: '8', name: 'Columbia Mechanicsville', units: 180, vehicleGates: 2, vehicleGatesRepair: 1, pedGates: 6, pedGatesRepair: 2, cameras: 0, conciergeShifts: 0 },
  { id: '9', name: 'Columbia Blackshear', units: 250, vehicleGates: 3, vehicleGatesRepair: 0, pedGates: 10, pedGatesRepair: 0, cameras: 3, conciergeShifts: 0 },
  { id: '10', name: 'Columbia Canopy', units: 195, vehicleGates: 2, vehicleGatesRepair: 2, pedGates: 5, pedGatesRepair: 1, cameras: 1, conciergeShifts: 0 },
  { id: '11', name: 'Columbia Colony', units: 310, vehicleGates: 4, vehicleGatesRepair: 1, pedGates: 12, pedGatesRepair: 3, cameras: 4, conciergeShifts: 0 },
  { id: '12', name: 'Columbia Crest', units: 145, vehicleGates: 1, vehicleGatesRepair: 0, pedGates: 4, pedGatesRepair: 0, cameras: 0, conciergeShifts: 0 },
  { id: '13', name: 'Columbia Heritage', units: 275, vehicleGates: 4, vehicleGatesRepair: 2, pedGates: 8, pedGatesRepair: 4, cameras: 2, conciergeShifts: 0 },
  { id: '14', name: 'Columbia Oasis', units: 300, vehicleGates: 4, vehicleGatesRepair: 0, pedGates: 14, pedGatesRepair: 2, cameras: 5, conciergeShifts: 1 },
  { id: '15', name: 'Columbia Parc', units: 420, vehicleGates: 6, vehicleGatesRepair: 1, pedGates: 18, pedGatesRepair: 2, cameras: 6, conciergeShifts: 2 },
  { id: '16', name: 'Columbia Reserve', units: 160, vehicleGates: 2, vehicleGatesRepair: 1, pedGates: 6, pedGatesRepair: 1, cameras: 1, conciergeShifts: 0 },
  { id: '17', name: 'Columbia Sylvan', units: 220, vehicleGates: 3, vehicleGatesRepair: 0, pedGates: 8, pedGatesRepair: 0, cameras: 2, conciergeShifts: 0 },
  { id: '18', name: 'Columbia Tower', units: 350, vehicleGates: 2, vehicleGatesRepair: 0, pedGates: 4, pedGatesRepair: 0, cameras: 8, conciergeShifts: 3 },
  { id: '19', name: 'Columbia Village', units: 185, vehicleGates: 2, vehicleGatesRepair: 1, pedGates: 7, pedGatesRepair: 2, cameras: 2, conciergeShifts: 0 },
  { id: '20', name: 'Columbia Woods', units: 240, vehicleGates: 3, vehicleGatesRepair: 0, pedGates: 9, pedGatesRepair: 1, cameras: 3, conciergeShifts: 0 },
  { id: '21', name: 'Columbia Estates', units: 175, vehicleGates: 2, vehicleGatesRepair: 1, pedGates: 4, pedGatesRepair: 0, cameras: 2, conciergeShifts: 0 },
];

export default function ColumbiaEnterpriseMenu() {
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>(['1', '2', '3', '4']);
  const [useAmortization, setUseAmortization] = useState(false);
  const [requestState, setRequestState] = useState<'idle' | 'submitting' | 'success'>('idle');

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

  const selectedSites = PREDEFINED_SITES.filter(site => selectedSiteIds.includes(site.id));

  // --- REVISED MATH LOGIC (HARD CAPS & $500 FLAT TIERS) ---
  let totalWorkingDoors = 0;
  let totalBrokenDoors = 0;
  let totalRawMonthlyFee = 0;
  let totalUnits = 0;

  selectedSites.forEach(site => {
    totalUnits += site.units;
    
    const vWorking = site.vehicleGates - site.vehicleGatesRepair;
    const vRepair = site.vehicleGatesRepair;
    const pWorking = site.pedGates - site.pedGatesRepair;
    const pRepair = site.pedGatesRepair;

    totalWorkingDoors += (vWorking + pWorking);
    totalBrokenDoors += (vRepair + pRepair);

    const siteHardwareMonthly = (site.vehicleGates * 150) + (site.pedGates * 125) + ((vRepair + pRepair) * 250);
    const siteCameraMonthly = (site.cameras * 85);
    
    let siteConciergeMonthly = 0;
    if (site.conciergeShifts > 0) {
      siteConciergeMonthly = Math.max(1000 * site.conciergeShifts, (site.units * 3) + (site.units * 1 * (site.conciergeShifts - 1)));
    }

    totalRawMonthlyFee += (siteHardwareMonthly + siteCameraMonthly + siteConciergeMonthly);
  });

  const numSites = selectedSites.length;

  // 1. Calculate Setup Fee
  let rawSetupFee = 0;
  let hasSetupDiscount = false;
  if (numSites >= 10) {
    // 10+ Sites: Everything is a flat $500 per door
    rawSetupFee = (totalWorkingDoors + totalBrokenDoors) * 500;
    hasSetupDiscount = true;
  } else {
    // Under 10 Sites: Standard Pricing
    rawSetupFee = (totalWorkingDoors * 500) + (totalBrokenDoors * 750);
  }

  // 2. Calculate Monthly OpEx with Per-Unit Caps
  let unitCap = Infinity;
  let currentTierName = "Standard Pricing";
  
  if (numSites >= 20) {
    unitCap = 9;
    currentTierName = "Portfolio Maximum ($9/Unit Cap)";
  } else if (numSites >= 15) {
    unitCap = 10;
    currentTierName = "Enterprise Tier ($10/Unit Cap)";
  } else if (numSites >= 10) {
    unitCap = 11;
    currentTierName = "Regional Tier ($11/Unit Cap)";
  }

  const rawAvgPerUnit = totalUnits > 0 ? (totalRawMonthlyFee / totalUnits) : 0;
  
  // If the calculated price is higher than the cap, apply the cap. Otherwise, they keep the lower price.
  const finalAvgPerUnitBeforeAmort = Math.min(rawAvgPerUnit, unitCap);
  const baseMonthlyTotal = finalAvgPerUnitBeforeAmort * totalUnits;
  const isCapped = rawAvgPerUnit > unitCap;

  // 3. Amortization Logic (Requires 15+ Sites)
  const isAmortizationEligible = numSites >= 15;
  const amortizedUpfrontCapEx = numSites * 2500;
  const canActuallyAmortize = isAmortizationEligible && (rawSetupFee > amortizedUpfrontCapEx);

  useEffect(() => {
    if (!canActuallyAmortize && useAmortization) {
      setUseAmortization(false);
    }
  }, [numSites, canActuallyAmortize, useAmortization]);

  let finalSetupFee = rawSetupFee;
  let monthlyAmortizationFee = 0;

  if (canActuallyAmortize && useAmortization) {
    finalSetupFee = amortizedUpfrontCapEx;
    monthlyAmortizationFee = (rawSetupFee - amortizedUpfrontCapEx) / 60;
  }

  const finalMonthlyTotal = baseMonthlyTotal + monthlyAmortizationFee;
  const finalBlendedUnitAvg = totalUnits > 0 ? (finalMonthlyTotal / totalUnits).toFixed(2) : "0.00";

  const handleFormalizeRequest = async () => {
    if (selectedSites.length === 0) return; 
    setRequestState('submitting');
    // Simulated API call for UI presentation
    setTimeout(() => setRequestState('success'), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-blue-900/20 text-slate-900">
      
      {/* 1. FORTUNE 500 STICKY HEADER */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto p-4 lg:px-8 lg:py-6">
          
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
             <div className="flex items-center gap-4">
                <div className="border border-slate-200 p-2 rounded-lg bg-white shadow-sm w-14 h-14 flex items-center justify-center">
                   <Image src="/Columbia_logo.png" alt="Columbia" width={48} height={48} className="object-contain" />
                </div>
                <div>
                   <h1 className="text-2xl font-black text-slate-900 tracking-tight">Columbia Residential</h1>
                   <p className="text-xs text-slate-500 font-medium">Enterprise Addendum Builder</p>
                </div>
             </div>
             <button 
                onClick={handleFormalizeRequest}
                disabled={selectedSites.length === 0}
                className="bg-[#0B2447] hover:bg-blue-900 disabled:bg-slate-300 disabled:text-slate-500 text-white px-8 py-3 rounded-lg font-bold transition-all disabled:shadow-none flex items-center gap-2"
             >
                Request Contract <span>→</span>
             </button>
          </div>

          {/* Clean Financial Dashboard Row */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 items-center">
             
             {/* Stat 1: Selection */}
             <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Portfolio</span>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-slate-900">{selectedSites.length}</span>
                   <span className="text-sm text-slate-500 font-medium">Sites</span>
                </div>
             </div>

             {/* Stat 2: Scale */}
             <div className="flex flex-col border-l border-slate-200 pl-8">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Scale</span>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-slate-900">{totalUnits.toLocaleString()}</span>
                   <span className="text-sm text-slate-500 font-medium">Units</span>
                </div>
             </div>

             {/* Stat 3: Monthly Total */}
             <div className="flex flex-col border-l border-slate-200 pl-8 col-span-2 lg:col-span-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Monthly OpEx</span>
                <span className="text-3xl font-black text-slate-900 font-mono">${finalMonthlyTotal.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                <span className={`text-[10px] font-bold tracking-widest uppercase mt-1 ${isCapped ? 'text-emerald-600' : 'text-slate-500'}`}>
                   Avg: ${finalBlendedUnitAvg} / unit
                </span>
             </div>

             {/* Stat 4: CapEx Total */}
             <div className="flex flex-col border-l border-slate-200 pl-8 col-span-2 lg:col-span-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Turnkey Hardware Setup</span>
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-slate-900 font-mono">${finalSetupFee.toLocaleString()}</span>
                </div>
                {hasSetupDiscount && !useAmortization && (
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">
                        $500 Flat Rate Unlocked
                    </span>
                )}
             </div>

             {/* Stat 5: Amortization Toggle (Needs wide space) */}
             <div className="flex flex-col border-l border-slate-200 pl-8 col-span-2 lg:col-span-2 justify-center">
                 {canActuallyAmortize ? (
                    <div className={`p-4 rounded-xl border transition-all flex justify-between items-center ${useAmortization ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                       <div>
                          <span className="block text-xs font-bold text-slate-900 mb-0.5">Enterprise Financing</span>
                          <span className="block text-[10px] text-slate-500">Cap setup at $2.5k/site. Balance amortized.</span>
                       </div>
                       <button onClick={() => setUseAmortization(!useAmortization)} className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 shadow-inner ${useAmortization ? 'bg-[#0B2447]' : 'bg-slate-300'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform absolute ${useAmortization ? 'translate-x-7' : 'translate-x-1'}`}></div>
                       </button>
                    </div>
                 ) : (
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex justify-between items-center opacity-60">
                       <div>
                          <span className="block text-xs font-bold text-slate-500 mb-0.5">Enterprise Financing Locked</span>
                          <span className="block text-[10px] text-slate-400">Select {Math.max(0, 15 - numSites)} more to unlock.</span>
                       </div>
                       <div className="w-12 h-6 rounded-full bg-slate-200 relative flex items-center shrink-0">
                          <div className="w-4 h-4 rounded-full bg-white absolute translate-x-1"></div>
                       </div>
                    </div>
                 )}
             </div>

          </div>
          
          {/* Progress / Tier Tracker below the grid */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-2">
                 <span className="text-xs font-bold text-slate-700">{currentTierName}</span>
                 {isCapped && <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Rate Locked</span>}
             </div>
             <p className="text-xs text-slate-500">Add <strong className="text-slate-900">10 sites</strong> to cap at $11/unit. Add <strong className="text-slate-900">15 sites</strong> to cap at $10/unit. Add <strong className="text-slate-900">20 sites</strong> to cap at $9/unit.</p>
          </div>

        </div>
      </div>

      {/* 2. PROPERTY GRID MENU */}
      <div className="max-w-[1600px] mx-auto p-4 lg:p-8">
         
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
               <p className="text-slate-500 text-sm mt-1">Select properties below to include them in your Addendum quote.</p>
            </div>
            <button onClick={handleSelectAll} className="text-xs text-[#0B2447] hover:text-blue-700 font-bold tracking-widest uppercase transition-colors">
               {selectedSiteIds.length === PREDEFINED_SITES.length ? 'Deselect All' : 'Select All Properties'}
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-32">
            {PREDEFINED_SITES.map((site) => {
               const isSelected = selectedSiteIds.includes(site.id);
               
               const vWorking = site.vehicleGates - site.vehicleGatesRepair;
               const pWorking = site.pedGates - site.pedGatesRepair;
               const hasBroken = site.vehicleGatesRepair > 0 || site.pedGatesRepair > 0;

               return (
                  <div 
                     key={site.id} 
                     onClick={() => toggleSite(site.id)}
                     className={`cursor-pointer rounded-xl p-6 border transition-all duration-200 relative bg-white
                        ${isSelected 
                           ? 'border-[#0B2447] shadow-[0_4px_20px_rgba(11,36,71,0.08)] ring-1 ring-[#0B2447]' 
                           : 'border-slate-200 hover:border-slate-300 hover:shadow-md opacity-80 hover:opacity-100'
                        }
                     `}
                  >
                     {/* Card Header */}
                     <div className="flex justify-between items-start mb-6">
                        <div className="pr-10">
                           <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">{site.name}</h3>
                           <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">{site.units} Units</span>
                        </div>
                        {/* Custom Checkbox */}
                        <div className={`absolute top-6 right-6 w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-[#0B2447] border-[#0B2447] text-white' : 'border-slate-300 bg-slate-50'}`}>
                           {isSelected && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                     </div>

                     {/* Detailed Hardware Status */}
                     <div className="space-y-3">
                        {/* Vehicle Gates Row */}
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                            <span className="text-xs font-bold text-slate-700">Vehicle Gates ({site.vehicleGates})</span>
                            <div className="flex gap-3 text-[10px] font-medium text-right">
                                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{vWorking} Working</span>
                                {site.vehicleGatesRepair > 0 && <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded">{site.vehicleGatesRepair} Broken</span>}
                            </div>
                        </div>
                        
                        {/* Pedestrian Doors Row */}
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                            <span className="text-xs font-bold text-slate-700">Pedestrian Doors ({site.pedGates})</span>
                            <div className="flex gap-3 text-[10px] font-medium text-right">
                                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{pWorking} Working</span>
                                {site.pedGatesRepair > 0 && <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded">{site.pedGatesRepair} Broken</span>}
                            </div>
                        </div>

                        {/* Cameras & Concierge Row */}
                        <div className="flex gap-4 pt-1">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                {site.cameras} Cameras
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                {site.conciergeShifts === 0 ? 'Self-Managed' : `${site.conciergeShifts} Shift(s)`}
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
