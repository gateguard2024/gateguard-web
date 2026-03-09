"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

type PedestrianStrategy = 'opt1_remove_interior' | 'opt2_mixed' | 'opt3_all_access' | 'opt4_gate_guard';

type SiteConfig = {
  id: string;
  name: string;
  units: number;
  vehicleGates: number;
  vehicleGatesRepair: number;
  pedGates: number;
  pedGatesRepair: number;
  cameras: number;
  conciergeShifts: number;
  // --- NEW FIELDS ---
  pedGateStrategy: PedestrianStrategy;
  callBoxes: number;
  useMagLockCover: boolean;
};

export default function PricingStationCalculator() {
  const [existingSites, setExistingSites] = useState(3);
  
  // Added Global Callbox Test Fee
  const [callBoxTestFee, setCallBoxTestFee] = useState(150);
  
  const [sites, setSites] = useState<SiteConfig[]>([
    { 
      id: '1', name: '', units: 250, vehicleGates: 2, vehicleGatesRepair: 0, 
      pedGates: 2, pedGatesRepair: 0, cameras: 4, conciergeShifts: 0,
      pedGateStrategy: 'opt4_gate_guard', callBoxes: 1, useMagLockCover: false
    }
  ]);
  
  const [requestState, setRequestState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [linkCopied, setLinkCopied] = useState(false);

  const [brivoStatus, setBrivoStatus] = useState('idle'); 
  const [visitorView, setVisitorView] = useState<'home' | 'directory' | 'packages' | 'emergency' | 'calling' | 'granted'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [callingName, setCallingName] = useState('');

  const mockDirectory = [
    'A. Anderson', 'B. Barnes', 'C. Carter', 'J. Doe', 'E. Edwards', 
    'F. Franklin', 'G. Garcia', 'M. Miller', 'S. Smith', 'T. Taylor'
  ];

  const isGateOpen = brivoStatus === 'granted' || visitorView === 'granted';
  
  const clientName = "Columbia Properties";

  // --- SAVE & SHARE LOGIC (URL ENCODING) ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const quoteStr = params.get('quote');
      if (quoteStr) {
        try {
          const decoded = JSON.parse(atob(quoteStr));
          if (decoded.existingSites !== undefined) setExistingSites(decoded.existingSites);
          if (decoded.sites && Array.isArray(decoded.sites)) setSites(decoded.sites);
          if (decoded.callBoxTestFee !== undefined) setCallBoxTestFee(decoded.callBoxTestFee);
        } catch (e) {
          console.error('Failed to parse quote from URL', e);
        }
      }
    }
  }, []);

  const handleCopyLink = () => {
    const data = { existingSites, sites, callBoxTestFee };
    const encoded = btoa(JSON.stringify(data));
    const url = `${window.location.origin}${window.location.pathname}?quote=${encoded}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleStartOver = () => {
    setExistingSites(3);
    setCallBoxTestFee(150);
    setSites([{ 
      id: Date.now().toString(), name: '', units: 250, vehicleGates: 2, vehicleGatesRepair: 0, 
      pedGates: 2, pedGatesRepair: 0, cameras: 4, conciergeShifts: 0,
      pedGateStrategy: 'opt4_gate_guard', callBoxes: 1, useMagLockCover: false 
    }]);
    window.history.replaceState(null, '', window.location.pathname);
  };

  // --- MULTI-SITE CRUD HANDLERS ---
  const handleAddSite = () => {
    const newId = Date.now().toString();
    setSites([...sites, { 
      id: newId, name: '', units: 250, vehicleGates: 2, vehicleGatesRepair: 0, 
      pedGates: 2, pedGatesRepair: 0, cameras: 4, conciergeShifts: 0,
      pedGateStrategy: 'opt4_gate_guard', callBoxes: 1, useMagLockCover: false
    }]);
  };

  const handleRemoveSite = (idToRemove: string) => {
    if (sites.length === 1) return; 
    setSites(sites.filter(site => site.id !== idToRemove));
  };

  const handleUpdateSite = (id: string, field: keyof SiteConfig, value: string | number | boolean) => {
    setSites(sites.map(site => {
      if (site.id !== id) return site;
      
      const updatedSite = { ...site, [field]: value } as SiteConfig;
      
      // Safety checks: You can't have more "Repair Needed" than "Total Needed"
      if (field === 'vehicleGates' && updatedSite.vehicleGatesRepair > updatedSite.vehicleGates) {
        updatedSite.vehicleGatesRepair = updatedSite.vehicleGates;
      }
      if (field === 'vehicleGatesRepair' && updatedSite.vehicleGatesRepair > updatedSite.vehicleGates) {
         updatedSite.vehicleGatesRepair = updatedSite.vehicleGates;
      }
      if (field === 'pedGates' && updatedSite.pedGatesRepair > updatedSite.pedGates) {
        updatedSite.pedGatesRepair = updatedSite.pedGates;
      }
      if (field === 'pedGatesRepair' && updatedSite.pedGatesRepair > updatedSite.pedGates) {
         updatedSite.pedGatesRepair = updatedSite.pedGates;
      }

      return updatedSite;
    }));
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

  // Hardcoded Base Costs for the Legacy CapEx Options
  const costPushbarWithPlates = 500;
  const costMagLockCover = 200; 
  const costStrikeProtector = 150;
  const costAccessControlUpgrade = 300; 
  const gateRepairCapEx = 250; 

  sites.forEach(site => {
    totalUnits += site.units;
    
    const vWorking = site.vehicleGates - site.vehicleGatesRepair;
    const vRepair = site.vehicleGatesRepair;
    const pWorking = site.pedGates - site.pedGatesRepair;
    const pRepair = site.pedGatesRepair;

    // --- VEHICLE MATH (Standard OpEx/CapEx across all options) ---
    totalHardwareFee += (site.vehicleGates * 150);
    totalSetupFee += (vWorking * 500) + (vRepair * 6750);
    
    // --- PEDESTRIAN ROUTING MATH (OpEx vs CapEx Strategies) ---
    if (site.pedGateStrategy === 'opt4_gate_guard') {
      // OPTION 4: Gate Guard (OpEx Model - No Callbox, uses App)
      totalHardwareFee += (site.pedGates * 125) + ((vRepair + pRepair) * 250); // Adds repair surcharges
      totalSetupFee += (pWorking * 500) + (pRepair * 6750); // Turnkey SaaS setup
    } else {
      // OPTIONS 1-3: Legacy Hardware CapEx Strategies
      totalHardwareFee += (vRepair * 250); // Only charge hardware repair surcharge for vehicles in OpEx
      
      const baseEgressCost = site.useMagLockCover ? costMagLockCover : costPushbarWithPlates;
      let perPedDoorCost = 0;

      if (site.pedGateStrategy === 'opt1_remove_interior') {
        perPedDoorCost = baseEgressCost;
      } 
      else if (site.pedGateStrategy === 'opt2_mixed') {
        perPedDoorCost = baseEgressCost + costStrikeProtector;
      } 
      else if (site.pedGateStrategy === 'opt3_all_access') {
        perPedDoorCost = baseEgressCost + costStrikeProtector + costAccessControlUpgrade;
      }

      // Add Heavy Hardware CapEx + Call Box Test Fees
      const pedStrategyCapEx = (site.pedGates * perPedDoorCost) + (pRepair * gateRepairCapEx);
      const callBoxCost = site.callBoxes * callBoxTestFee;
      
      totalSetupFee += pedStrategyCapEx + callBoxCost; 
    }

    // --- CAMERA & CONCIERGE MATH ---
    totalCameraFee += (site.cameras * 85);
    if (site.conciergeShifts > 0) {
      totalConciergeFee += Math.max(
        MINIMUM_PRICE_PER_SHIFT * site.conciergeShifts, 
        (site.units * 3) + (site.units * 1 * (site.conciergeShifts - 1))
      );
    }

    // Legacy Benchmark calculation
    legacyTotal += (site.vehicleGates * 400) + (site.pedGates * 150) + (site.cameras * 150) + (site.conciergeShifts > 0 ? 7200 * site.conciergeShifts : 2500);
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
    volumeDiscountPercent = 0.30;
    currentTierName = "Strategic Partner";
    nextTierSites = null;
  } else if (totalPortfolioSites >= 20) {
    volumeDiscountPercent = 0.20;
    currentTierName = "Enterprise Tier";
    nextTierSites = 40;
    nextTierPercent = 0.20;
    nextTierName = "Strategic Partner";
    progressBase = 20;
  } else if (totalPortfolioSites >= 10) {
    volumeDiscountPercent = 0.15;
    currentTierName = "Regional Tier";
    nextTierSites = 20;
    nextTierPercent = 0.15;
    nextTierName = "Enterprise Tier";
    progressBase = 10;
  } else if (totalPortfolioSites >= 5) {
    volumeDiscountPercent = 0.1;
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

  const handleFormalizeRequest = async () => {
    if (hasUnnamedSites) return; 
    setRequestState('submitting');

    const payload = {
      companyName: "Columbia Residential", 
      portfolioData: {
        existingSites: existingSites,
        newSitesQuoted: sites.length,
        totalPortfolioSites: totalPortfolioSites,
        discountTierUnlocked: currentTierName,
        discountPercentage: volumeDiscountPercent * 100
      },
      financials: {
        monthlyOpEx: finalMonthlyNewSites,
        oneTimeSetup: totalSetupFee,
        monthlySavingsVsLegacy: legacyTotal - finalMonthlyNewSites
      },
      // This includes the new pedGateStrategy, callBoxes, and useMagLockCover variables!
      siteDetails: sites 
    };

    try {
      const makeWebhookUrl = "https://hook.us2.make.com/fqt9a5oejueehw66nfovhpgsohvxgjv9";
      await fetch(makeWebhookUrl, {
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
    <>
      {/* 1. PRINT ONLY VIEW (HIDDEN ON WEB, VISIBLE ON PDF EXPORT) */}
      <div className="hidden print:block bg-white text-black min-h-screen p-8 font-sans w-full max-w-[8.5in] mx-auto">
        <div className="flex justify-between items-end border-b-2 border-zinc-200 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900 leading-none mb-2">Gate Guard</h1>
            <h2 className="text-lg font-bold text-zinc-500 uppercase tracking-widest">Master Agreement Addendum</h2>
            <p className="text-sm text-zinc-400 mt-2">Generated: {new Date().toLocaleDateString()} for {clientName}</p>
          </div>
        </div>

        <div className="flex gap-8 mb-10">
          <div className="flex-1 bg-zinc-50 rounded-xl p-6 border border-zinc-200">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">New Sites To Add</p>
            <p className="text-3xl font-black text-zinc-900">{sites.length}</p>
          </div>
          <div className="flex-1 bg-zinc-50 rounded-xl p-6 border border-zinc-200">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Total Scale</p>
            <p className="text-3xl font-black text-zinc-900">{totalUnits} <span className="text-lg font-medium text-zinc-400">Units</span></p>
          </div>
          <div className="flex-1 bg-blue-50 rounded-xl p-6 border border-blue-200">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">Volume Tier Unlocked</p>
            <p className="text-3xl font-black text-blue-700">{volumeDiscountPercent * 100}% <span className="text-lg font-medium text-blue-500">OFF</span></p>
          </div>
        </div>

        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Property Breakdown</h3>
        <table className="w-full text-left mb-10 border-collapse">
          <thead>
            <tr className="border-b-2 border-zinc-800 text-xs uppercase tracking-widest text-zinc-500">
              <th className="pb-3 font-bold">Property Name</th>
              <th className="pb-3 font-bold">Units</th>
              <th className="pb-3 font-bold">Veh. Gates</th>
              <th className="pb-3 font-bold">Ped. Strategy</th>
              <th className="pb-3 font-bold">Cameras</th>
              <th className="pb-3 font-bold">Concierge</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {sites.map((site, index) => (
              <tr key={index} className="border-b border-zinc-200">
                <td className="py-4 font-bold text-zinc-900">{site.name || `Unnamed Site ${index + 1}`}</td>
                <td className="py-4 text-zinc-600">{site.units}</td>
                <td className="py-4 text-zinc-600">{site.vehicleGates} <span className="text-[10px] text-red-500 ml-1">{site.vehicleGatesRepair > 0 ? `(${site.vehicleGatesRepair} broken)` : ''}</span></td>
                <td className="py-4 text-zinc-600">
                  <span className="block">{site.pedGates} Doors</span>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-400 block mt-1">{site.pedGateStrategy.replace(/_/g, ' ')}</span>
                </td>
                <td className="py-4 text-zinc-600">{site.cameras}</td>
                <td className="py-4 text-zinc-600">{site.conciergeShifts === 0 ? 'Self-Managed' : `${site.conciergeShifts} Shift(s)`}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-4 border-b border-zinc-200 pb-2 print:break-inside-avoid">Financial Addendum Quote</h3>
        <div className="bg-white border-2 border-zinc-900 rounded-2xl p-8 print:break-inside-avoid">
          <div className="space-y-4 mb-6">
            <div className="flex justify-between border-b border-zinc-100 pb-4">
              <span className="font-bold text-zinc-700">Infrastructure & Maintenance SLA</span>
              <span className="font-mono text-zinc-900">${totalHardwareFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-100 pb-4">
              <span className="font-bold text-zinc-700">Proactive Camera Monitoring</span>
              <span className="font-mono text-zinc-900">${totalCameraFee.toLocaleString()}</span>
            </div>
            {totalConciergeFee > 0 && (
              <div className="flex justify-between border-b border-zinc-100 pb-4">
                <span className="font-bold text-zinc-700">Live Video Concierge Labor</span>
                <span className="font-mono text-zinc-900">${totalConciergeFee.toLocaleString()}</span>
              </div>
            )}
            {volumeDiscountPercent > 0 && (
              <div className="flex justify-between text-blue-600 pb-4">
                <span className="font-bold uppercase tracking-widest text-xs">{currentTierName} Discount ({volumeDiscountPercent * 100}%)</span>
                <span className="font-mono font-bold">- ${monthlyDiscountAmount.toLocaleString()}</span>
              </div>
            )}
          </div>
          
          <div className="bg-zinc-50 p-6 rounded-xl flex justify-between items-center mb-4">
            <span className="font-black uppercase tracking-widest text-zinc-900">Total Predictable Monthly OpEx</span>
            <span className="text-3xl font-black font-mono text-zinc-900">${finalMonthlyNewSites.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center px-4 text-sm text-zinc-500">
            <span>Estimated Turnkey Hardware Setup (One-Time CapEx)</span>
            <span className="font-mono font-bold">${totalSetupFee.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 2. WEB APP VIEW */}
      <main className="relative text-white min-h-screen font-sans selection:bg-cyan-500/30 overflow-y-auto flex flex-col scroll-smooth print:hidden">
        
        {/* Background */}
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
              <Image src="/Columbia_logo.png" alt="Columbia Properties" width={56} height={56} className="object-contain opacity-90" />
            </div>
            <div className="ml-4 border-l border-white/10 pl-6 hidden sm:block">
              <span className="text-xl font-black tracking-tighter uppercase italic block leading-none text-white">Gate Guard</span>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-cyan-500">Asset Manager Portal</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row max-w-[1800px] mx-auto w-full relative">
          
          {/* LEFT 2/3: MAIN CONTENT AREA */}
          <div className="lg:w-2/3 p-8 lg:p-12 pb-32">
            <div className="max-w-4xl mx-auto space-y-20">
              
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
                          
                          {/* VEHICLE GATES */}
                          <div>
                            <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block mb-3">Vehicle Gates</label>
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest mb-1.5 block">Total Needed</span>
                                <input type="number" min="0" value={site.vehicleGates} onChange={(e) => handleUpdateSite(site.id, 'vehicleGates', Number(e.target.value))} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500 transition-all focus:bg-white/[0.05]" />
                              </div>
                              <div className="flex-1">
                                <span className="text-[8px] text-red-400/80 font-bold uppercase tracking-widest mb-1.5 block flex items-center gap-1">Needs Repairs</span>
                                <input type="number" min="0" max={site.vehicleGates} value={site.vehicleGatesRepair} onChange={(e) => handleUpdateSite(site.id, 'vehicleGatesRepair', Number(e.target.value))} className="w-full bg-red-900/10 border border-red-500/20 rounded-xl p-3 text-red-100 font-bold outline-none focus:border-red-500 transition-all focus:bg-red-900/20" />
                              </div>
                            </div>
                          </div>

                          {/* CAMERAS & CONCIERGE (Moved up to make room for full width Pedestrian block) */}
                          <div className="flex flex-col gap-4">
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

                          {/* REFINED PEDESTRIAN DOORS & STRATEGY */}
                          <div className="md:col-span-2 bg-black/30 p-5 rounded-2xl border border-white/5 mt-2">
                            <div className="flex justify-between items-end mb-4 border-b border-white/5 pb-3">
                              <label className="text-zinc-300 font-bold text-[12px] tracking-widest uppercase block">Pedestrian Gate Strategy</label>
                              
                              {site.pedGateStrategy !== 'opt4_gate_guard' && (
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] uppercase text-zinc-500 font-bold tracking-widest">DoorKing Test Fee:</span>
                                  <span className="text-zinc-400 text-xs">$</span>
                                  <input 
                                    type="number" 
                                    value={callBoxTestFee} 
                                    onChange={(e) => setCallBoxTestFee(Number(e.target.value))}
                                    className="w-16 bg-transparent border-b border-white/20 text-white outline-none text-xs font-mono pb-1 focus:border-cyan-500 transition-colors"
                                  />
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                              <div className="flex gap-4">
                                <div className="flex-1">
                                  <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest mb-1.5 block">Total Doors</span>
                                  <input type="number" min="0" value={site.pedGates} onChange={(e) => handleUpdateSite(site.id, 'pedGates', Number(e.target.value))} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500 transition-all focus:bg-white/[0.05]" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-[8px] text-red-400/80 font-bold uppercase tracking-widest mb-1.5 block">Needs Repair</span>
                                  <input type="number" min="0" max={site.pedGates} value={site.pedGatesRepair} onChange={(e) => handleUpdateSite(site.id, 'pedGatesRepair', Number(e.target.value))} className="w-full bg-red-900/10 border border-red-500/20 rounded-xl p-3 text-red-100 font-bold outline-none focus:border-red-500 transition-all focus:bg-red-900/20" />
                                </div>
                                {site.pedGateStrategy !== 'opt4_gate_guard' && (
                                  <div className="flex-1">
                                    <span className="text-[8px] text-blue-400/80 font-bold uppercase tracking-widest mb-1.5 block">Call Boxes</span>
                                    <input type="number" min="0" value={site.callBoxes} onChange={(e) => handleUpdateSite(site.id, 'callBoxes', Number(e.target.value))} className="w-full bg-blue-900/10 border border-blue-500/20 rounded-xl p-3 text-blue-100 font-bold outline-none focus:border-blue-500 transition-all focus:bg-blue-900/20" />
                                  </div>
                                )}
                              </div>

                              <div>
                                <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest mb-1.5 block">Implementation Plan</span>
                                <select 
                                  value={site.pedGateStrategy} 
                                  onChange={(e) => handleUpdateSite(site.id, 'pedGateStrategy', e.target.value)} 
                                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-[11px] font-bold outline-none focus:border-cyan-500 appearance-none transition-all focus:bg-white/[0.05]"
                                >
                                  <option value="opt1_remove_interior">Opt 1: Remove Interior + Pushbar/Strike + Test Callbox</option>
                                  <option value="opt2_mixed">Opt 2: Keep All + Mixed Egress/Access + Test Callbox</option>
                                  <option value="opt3_all_access">Opt 3: Keep All + Full Access Control + Test Callbox</option>
                                  <option value="opt4_gate_guard">Opt 4: Gate Guard SaaS (App Only, No Callbox)</option>
                                </select>
                              </div>
                            </div>

                            {/* Optional Mag Lock Toggle */}
                            {site.pedGateStrategy !== 'opt4_gate_guard' && (
                              <div className="flex items-center gap-3 mt-4 border-t border-white/5 pt-4">
                                <input 
                                  type="checkbox" 
                                  id={`maglock-${site.id}`}
                                  checked={site.useMagLockCover}
                                  onChange={(e) => handleUpdateSite(site.id, 'useMagLockCover', e.target.checked)}
                                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                                />
                                <label htmlFor={`maglock-${site.id}`} className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                                  Use Mag Lock Protective Cover Instead of Pushbar
                                </label>
                              </div>
                            )}
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

            </div>
          </div>

          {/* RIGHT 1/3: PORTFOLIO QUOTE & FORMALIZATION */}
          <div className="lg:w-1/3 border-l border-white/5 relative bg-[#0A0A0C]/50 backdrop-blur-3xl shadow-2xl">
            <div className="sticky top-[100px] max-h-[calc(100vh-100px)] overflow-y-auto [&::-webkit-scrollbar]:hidden p-6 lg:p-10 w-full">
              
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-2xl font-bold tracking-tight">Addendum Quote</h3>
                    <button 
                      onClick={handleStartOver} 
                      className="text-[8px] uppercase tracking-widest text-zinc-500 hover:text-red-400 transition-colors bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/10 flex items-center gap-1"
                    >
                      <span>⟲</span> Clear
                    </button>
                  </div>
                  <p className="text-zinc-500 text-[11px] font-light leading-relaxed">Quote for adding {sites.length} new site(s) to the master agreement.</p>
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
                        </p>
                        <span className="text-sm font-medium text-white/90 font-mono">${totalHardwareFee.toLocaleString()}</span>
                      </div>

                      <div className="relative group flex justify-between items-start cursor-default py-1">
                        <p className="text-sm font-bold text-white/90 hover:text-cyan-400 transition-colors flex items-center pr-2">
                          Proactive Camera Monitoring
                        </p>
                        <span className="text-sm font-medium text-white/90 font-mono">${totalCameraFee.toLocaleString()}</span>
                      </div>

                      {totalConciergeFee > 0 && (
                        <div className="relative group flex justify-between items-start cursor-default py-1">
                          <p className="text-sm font-bold text-white/90 hover:text-cyan-400 transition-colors flex items-center pr-2">
                            Live Video Concierge
                          </p>
                          <span className="text-sm font-medium text-white/90 font-mono">${totalConciergeFee.toLocaleString()}</span>
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

                </div>
              )}

              {requestState === 'submitting' && (
                <div className="flex flex-col items-center justify-center py-20 animate-[fadeIn_0.3s_ease-out] bg-white/[0.02] border border-white/5 rounded-3xl">
                  <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-6"></div>
                  <p className="text-cyan-400 font-bold uppercase tracking-widest text-[10px] mb-2 animate-pulse">Drafting Addendum...</p>
                </div>
              )}

              {requestState === 'success' && (
                <div className="animate-[fadeIn_0.5s_ease-out] bg-emerald-900/20 backdrop-blur-xl border border-emerald-500/30 p-8 rounded-3xl text-center shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-3xl mx-auto mb-6 shadow-inner">✓</div>
                  <h3 className="text-xl font-black text-white mb-2 tracking-tight">Request Received</h3>
                  <button 
                    onClick={() => {
                      setRequestState('idle');
                      setExistingSites(existingSites + sites.length);
                      setSites([{ id: Date.now().toString(), name: '', units: 250, vehicleGates: 2, vehicleGatesRepair: 0, pedGates: 2, pedGatesRepair: 0, cameras: 4, conciergeShifts: 0, pedGateStrategy: 'opt4_gate_guard', callBoxes: 1, useMagLockCover: false }]);
                    }} 
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-[#0A0A0C] font-black rounded-xl transition-all uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(16,185,129,0.3)] mt-8"
                  >
                    Start Another Quote
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>
    </>
  );
}
