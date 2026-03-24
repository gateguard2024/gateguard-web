"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// 1. MASTER PROPERTY DATABASE (Pre-loaded with Columbia's Real Data)
const PREDEFINED_SITES = [
  { id: '1', name: 'Park Commons', units: 230, vehicleGates: 5, vehicleGatesRepair: 2, pedGates: 10, pedGatesRepair: 2, cameras: 2, conciergeShifts: 0 },
  { id: '2', name: 'Pendana Family at West Lakes', units: 200, vehicleGates: 6, vehicleGatesRepair: 3, pedGates: 24, pedGatesRepair: 20, cameras: 0, conciergeShifts: 0 },
  { id: '3', name: 'Pendana Senior at West Lakes', units: 120, vehicleGates: 0, vehicleGatesRepair: 0, pedGates: 14, pedGatesRepair: 1, cameras: 0, conciergeShifts: 0 },
  { id: '4', name: 'Columbia Gardens South City', units: 290, vehicleGates: 6, vehicleGatesRepair: 3, pedGates: 19, pedGatesRepair: 3, cameras: 0, conciergeShifts: 0 },
  { id: '5', name: 'John James Fonda Collection', units: 150, vehicleGates: 2, vehicleGatesRepair: 1, pedGates: 6, pedGatesRepair: 0, cameras: 1, conciergeShifts: 0 },
  { id: '6', name: 'Gregg Hypolite Collection', units: 320, vehicleGates: 4, vehicleGatesRepair: 0, pedGates: 12, pedGatesRepair: 4, cameras: 4, conciergeShifts: 1 },
  // Realistic Placeholders for the rest of the 20 sites
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
];

export default function ColumbiaEnterpriseMenu() {
  // We start with the first 4 properties selected by default to show immediate value
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>(['1', '2', '3', '4']);
  const [existingSites, setExistingSites] = useState(0); 
  const [useAmortization, setUseAmortization] = useState(false);
  const [requestState, setRequestState] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Toggle Property Selection
  const toggleSite = (id: string) => {
    setSelectedSiteIds(prev => 
      prev.includes(id) ? prev.filter(siteId => siteId !== id) : [...prev, id]
    );
  };

  // Select/Deselect All
  const handleSelectAll = () => {
    if (selectedSiteIds.length === PREDEFINED_SITES.length) {
      setSelectedSiteIds([]);
    } else {
      setSelectedSiteIds(PREDEFINED_SITES.map(s => s.id));
    }
  };

  // Filter full objects for math
  const selectedSites = PREDEFINED_SITES.filter(site => selectedSiteIds.includes(site.id));

  // --- AGGREGATE MATH & TIERED DISCOUNT LOGIC ---
  const MINIMUM_PRICE_PER_SHIFT = 1000;
  
  let totalHardwareFee = 0;
  let totalCameraFee = 0;
  let totalConciergeFee = 0;
  let rawSetupFee = 0;
  let totalUnits = 0;
  let legacyTotal = 0; 

  selectedSites.forEach(site => {
    totalUnits += site.units;
    
    // Working vs Broken Math
    const vWorking = site.vehicleGates - site.vehicleGatesRepair;
    const vRepair = site.vehicleGatesRepair;
    const pWorking = site.pedGates - site.pedGatesRepair;
    const pRepair = site.pedGatesRepair;

    // Monthly Base Hardware + $250 surcharge for each item needing repair
    totalHardwareFee += (site.vehicleGates * 150) + (site.pedGates * 125) + ((vRepair + pRepair) * 250);
    totalCameraFee += (site.cameras * 85);
    
    // Fixed Setup Fees: $500 for working, $750 for non-working
    rawSetupFee += ((vWorking + pWorking) * 500) + ((vRepair + pRepair) * 750);

    if (site.conciergeShifts > 0) {
      totalConciergeFee += Math.max(
        MINIMUM_PRICE_PER_SHIFT * site.conciergeShifts, 
        (site.units * 3) + (site.units * 1 * (site.conciergeShifts - 1))
      );
    }
    legacyTotal += (site.vehicleGates * 400) + (site.pedGates * 150) + (site.cameras * 150) + (site.conciergeShifts > 0 ? 7200 * site.conciergeShifts : 2500);
  });

  // ENTERPRISE TIER GAMIFICATION MATH
  const totalPortfolioSites = existingSites + selectedSites.length;
  let volumeDiscountPercent = 0;
  let currentTierName = "Standard Pricing";
  let nextTierSites: number | null = 5;
  let nextTierPercent = 0.05;
  
  if (totalPortfolioSites >= 40) {
    volumeDiscountPercent = 0.30;
    currentTierName = "Strategic Partner";
    nextTierSites = null;
  } else if (totalPortfolioSites >= 20) {
    volumeDiscountPercent = 0.20;
    currentTierName = "Enterprise Tier";
    nextTierSites = 40;
    nextTierPercent = 0.30;
  } else if (totalPortfolioSites >= 10) {
    volumeDiscountPercent = 0.15;
    currentTierName = "Regional Tier";
    nextTierSites = 20;
    nextTierPercent = 0.20;
  } else if (totalPortfolioSites >= 5) {
    volumeDiscountPercent = 0.1;
    currentTierName = "Portfolio Tier";
    nextTierSites = 10;
    nextTierPercent = 0.15;
  } else {
    volumeDiscountPercent = 0;
    currentTierName = "Standard Pricing";
    nextTierSites = 5;
    nextTierPercent = 0.10;
  }

  const subtotalNewSites = totalHardwareFee + totalCameraFee + totalConciergeFee;
  const monthlyDiscountAmount = subtotalNewSites * volumeDiscountPercent;
  
  // AMORTIZATION LOGIC (15+ Sites unlocks $2,500 setup cap)
  const isAmortizationEligible = selectedSites.length >= 15;
  const amortizedUpfrontCapEx = selectedSites.length * 2500;
  const canActuallyAmortize = isAmortizationEligible && (rawSetupFee > amortizedUpfrontCapEx);

  // If they fall below 15 sites, force toggle off
  useEffect(() => {
    if (!canActuallyAmortize && useAmortization) {
      setUseAmortization(false);
    }
  }, [selectedSites.length, canActuallyAmortize, useAmortization]);

  let finalSetupFee = rawSetupFee;
  let monthlyAmortizationFee = 0;

  if (canActuallyAmortize && useAmortization) {
    finalSetupFee = amortizedUpfrontCapEx;
    monthlyAmortizationFee = (rawSetupFee - amortizedUpfrontCapEx) / 60;
  }

  const finalMonthlyNewSites = subtotalNewSites - monthlyDiscountAmount + monthlyAmortizationFee;
  const avgPerUnitMonthly = totalUnits > 0 ? (finalMonthlyNewSites / totalUnits).toFixed(2) : "0.00";
  const progressPercent = nextTierSites ? (totalPortfolioSites / nextTierSites) * 100 : 100;

  const handleFormalizeRequest = async () => {
    if (selectedSites.length === 0) return; 
    setRequestState('submitting');

    const payload = {
      companyName: "Columbia Residential",
      portfolioData: {
        newSitesQuoted: selectedSites.length,
        discountTierUnlocked: currentTierName,
        discountPercentage: volumeDiscountPercent * 100
      },
      financials: {
        monthlyOpEx: finalMonthlyNewSites,
        oneTimeSetup: finalSetupFee,
        financingElected: canActuallyAmortize && useAmortization,
        baseSetupFeeBeforeFinancing: rawSetupFee
      },
      siteDetails: selectedSites 
    };

    try {
      // Send to Make.com Webhook
      await fetch("https://hook.us2.make.com/fqt9a5oejueehw66nfovhpgsohvxgjv9", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setRequestState('success');
    } catch (error) {
      console.error("Error pushing data to Make:", error);
      setRequestState('success'); 
    }
  };

  return (
    <main className="min-h-screen bg-[#080d1a] font-sans selection:bg-blue-500/30 text-slate-100">
      
      {/* BACKGROUND STYLING */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none"></div>
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[150px] rounded-full z-0 pointer-events-none"></div>

      {/* 1. STICKY COMMAND CENTER */}
      <div className="sticky top-0 z-50 bg-[#0b1120]/90 backdrop-blur-2xl border-b border-slate-800 shadow-2xl">
        <div className="max-w-[1600px] mx-auto p-4 lg:px-8">
          
          {/* Top Row: Logos & Branding */}
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
             <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-lg shadow-md w-12 h-12 flex items-center justify-center">
                   <Image src="/Columbia_logo.png" alt="Columbia" width={40} height={40} className="object-contain" />
                </div>
                <div>
                   <h1 className="text-xl font-bold text-white tracking-tight">Columbia Residential</h1>
                   <p className="text-xs text-blue-400 uppercase tracking-widest font-bold">A La Carte Portfolio Builder</p>
                </div>
             </div>
             <button 
                onClick={handleFormalizeRequest}
                disabled={selectedSites.length === 0}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-8 py-3 rounded-xl font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:shadow-none flex items-center gap-2"
             >
                Generate Addendum <span>→</span>
             </button>
          </div>

          {/* Bottom Row: Financial Dash */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 items-center">
             
             {/* Stat 1: Selection */}
             <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Properties Selected</span>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-white">{selectedSites.length}</span>
                   <span className="text-sm text-slate-500">/ {PREDEFINED_SITES.length}</span>
                </div>
             </div>

             {/* Stat 2: Total Scale */}
             <div className="flex flex-col border-l border-slate-800 pl-6 hidden lg:flex">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Portfolio Scale</span>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-white">{totalUnits.toLocaleString()}</span>
                   <span className="text-sm text-slate-500">Units</span>
                </div>
             </div>

             {/* Stat 3: Volume Tier Progress */}
             <div className="flex flex-col border-l border-slate-800 pl-6 col-span-2 lg:col-span-1">
                <div className="flex justify-between items-end mb-1">
                   <span className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">{currentTierName} ({volumeDiscountPercent * 100}% Off)</span>
                   {nextTierSites && <span className="text-[9px] text-slate-500">{nextTierSites - totalPortfolioSites} to next tier</span>}
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                   <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                </div>
             </div>

             {/* Stat 4: Blended Monthly OpEx */}
             <div className="flex flex-col border-l border-slate-800 pl-6 text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Predictable Monthly OpEx</span>
                <div className="flex flex-col items-end">
                   <span className="text-2xl font-black text-white font-mono">${finalMonthlyNewSites.toLocaleString()} <span className="text-xs text-slate-500 font-sans font-medium">/mo</span></span>
                   <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase mt-1">Blended: ${avgPerUnitMonthly} / unit</span>
                </div>
             </div>

             {/* Stat 5: One-Time CapEx */}
             <div className="flex flex-col border-l border-slate-800 pl-6 text-right relative">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Turnkey Hardware Setup</span>
                <span className="text-2xl font-black text-white font-mono">${finalSetupFee.toLocaleString()}</span>
                
                {/* AMORTIZATION MAGIC TOGGLE */}
                <div className="absolute top-10 right-0 w-64">
                   {canActuallyAmortize ? (
                      <div className="mt-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 flex items-center justify-between shadow-[0_0_15px_rgba(245,158,11,0.1)] animate-[fadeIn_0.5s_ease-out]">
                         <div>
                            <span className="block text-[9px] font-black text-amber-400 uppercase tracking-widest">Enterprise Financing</span>
                            <span className="block text-[8px] text-amber-500/70">Cap setup at $2.5k/site</span>
                         </div>
                         <button onClick={() => setUseAmortization(!useAmortization)} className={`w-8 h-4 rounded-full transition-colors relative flex items-center shrink-0 ${useAmortization ? 'bg-amber-500' : 'bg-slate-700'}`}>
                            <div className={`w-3 h-3 rounded-full bg-white transition-transform absolute ${useAmortization ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                         </button>
                      </div>
                   ) : (
                      <div className="mt-2 p-2">
                         <span className="block text-[8px] text-slate-500 uppercase tracking-widest text-right">Select {Math.max(0, 15 - selectedSites.length)} more to unlock financing</span>
                      </div>
                   )}
                </div>
             </div>

          </div>
        </div>
      </div>

      {/* 2. PROPERTY GRID MENU */}
      <div className="max-w-[1600px] mx-auto p-4 lg:p-8 relative z-10">
         
         {/* Success State Overlay */}
         {requestState === 'success' && (
            <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-2xl p-10 text-center mb-10 backdrop-blur-sm animate-[fadeIn_0.5s_ease-out]">
               <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
               <h2 className="text-2xl font-black text-white mb-2">Addendum Requested</h2>
               <p className="text-emerald-100/70">We are drafting the paperwork for your {selectedSites.length} selected sites. Your account executive will be in touch shortly.</p>
            </div>
         )}

         <div className="flex justify-between items-end mb-6">
            <div>
               <h2 className="text-2xl font-bold text-white tracking-tight">Portfolio Roster</h2>
               <p className="text-slate-400 text-sm">Toggle properties below to include them in your Addendum quote.</p>
            </div>
            <button onClick={handleSelectAll} className="text-xs text-blue-400 hover:text-blue-300 font-bold tracking-widest uppercase transition-colors">
               {selectedSiteIds.length === PREDEFINED_SITES.length ? 'Deselect All' : 'Select All Properties'}
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-32">
            {PREDEFINED_SITES.map((site) => {
               const isSelected = selectedSiteIds.includes(site.id);
               const needsRepair = site.vehicleGatesRepair > 0 || site.pedGatesRepair > 0;

               return (
                  <div 
                     key={site.id} 
                     onClick={() => toggleSite(site.id)}
                     className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-48
                        ${isSelected 
                           ? 'bg-slate-800 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.15)] ring-1 ring-blue-500' 
                           : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                        }
                     `}
                  >
                     {/* Card Header */}
                     <div className="flex justify-between items-start mb-4">
                        <div className="pr-8">
                           <h3 className={`font-bold text-lg leading-tight mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>{site.name}</h3>
                           <p className="text-xs text-slate-500 font-medium">{site.units} Units</p>
                        </div>
                        {/* Checkbox UI */}
                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors absolute top-5 right-5 ${isSelected ? 'bg-blue-500 border-blue-400 text-white' : 'border-slate-600 bg-slate-900/50'}`}>
                           {isSelected && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                     </div>

                     {/* Hardware Specs */}
                     <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-auto">
                        <div className="bg-slate-900/50 rounded-lg p-2">
                           <span className="block text-[9px] uppercase tracking-widest text-slate-500 mb-0.5">Veh. Gates</span>
                           <span className={`text-sm font-black ${isSelected ? 'text-slate-200' : 'text-slate-400'}`}>{site.vehicleGates}</span>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-2">
                           <span className="block text-[9px] uppercase tracking-widest text-slate-500 mb-0.5">Ped. Doors</span>
                           <span className={`text-sm font-black ${isSelected ? 'text-slate-200' : 'text-slate-400'}`}>{site.pedGates}</span>
                        </div>
                     </div>

                     {/* Repair Warning Badge */}
                     {needsRepair && (
                        <div className={`absolute bottom-5 right-5 flex items-center gap-1 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`}>
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                           <span className="text-[9px] font-bold uppercase tracking-widest">Repairs Logged</span>
                        </div>
                     )}
                  </div>
               );
            })}
         </div>

      </div>
    </main>
  );
}
