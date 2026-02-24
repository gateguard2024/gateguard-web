"use client";
import React, { useState } from 'react';
import Image from 'next/image';

export default function SalesPortal() {
  // 1. Calculator State (Synced with Main Page)
  const [units, setUnits] = useState(250);
  const [vehicleGates, setVehicleGates] = useState(2);
  const [pedGates, setPedGates] = useState(2);
  const [cameras, setCameras] = useState(4);
  const [conciergeShifts, setConciergeShifts] = useState(0);

  // 2. Interactive Phone & Gate State
  const [brivoStatus, setBrivoStatus] = useState('idle'); 
  const [visitorStatus, setVisitorStatus] = useState('idle');
  const isGateOpen = brivoStatus === 'granted' || visitorStatus === 'granted';

  // 3. Form & Simulation State
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [companyName, setCompanyName] = useState('');

  // Simulation Logic: Tap to Open Gate
  const handleBrivoTap = () => {
    if (brivoStatus !== 'idle') return;
    setBrivoStatus('loading');
    setTimeout(() => setBrivoStatus('granted'), 1200);
    setTimeout(() => setBrivoStatus('idle'), 5500); 
  };

  const handleVisitorTap = () => {
    if (visitorStatus !== 'idle') return;
    setVisitorStatus('loading');
    setTimeout(() => setVisitorStatus('granted'), 1500);
    setTimeout(() => setVisitorStatus('idle'), 5500);
  };

  // Math Logic (Perfectly Synced with Main Page)
  const MINIMUM_PRICE_PER_SHIFT = 1000;
  const FIRST_SHIFT_PER_UNIT = 3;
  const ADDITIONAL_SHIFT_PER_UNIT = 1; 

  let conciergeMonthly = 0;
  if (conciergeShifts > 0) {
    const floorPrice = MINIMUM_PRICE_PER_SHIFT * conciergeShifts;
    const scalablePrice = (units * FIRST_SHIFT_PER_UNIT) + 
                          (units * ADDITIONAL_SHIFT_PER_UNIT * (conciergeShifts - 1));
    conciergeMonthly = Math.max(floorPrice, scalablePrice);
  }

  const gatesCost = vehicleGates * 150;
  const pedCost = pedGates * 125;
  const cameraCost = cameras * 85;
  const totalMonthly = gatesCost + pedCost + cameraCost + conciergeMonthly;
  const perUnitMonthly = (totalMonthly / units).toFixed(2);

  const GUARD_MONTHLY_PER_SHIFT = 7200; 
  const oldGuardCost = conciergeShifts > 0 ? (GUARD_MONTHLY_PER_SHIFT * conciergeShifts) : 0;
  const oldRepairCost = (vehicleGates * 100) + (pedGates * 50); 
  const oldFobCost = units * 2; 
  const oldCameraCost = cameras * 150; 
  
  const oldTotalMonthly = oldGuardCost + oldRepairCost + oldFobCost + oldCameraCost;
  const monthlySavings = oldTotalMonthly > totalMonthly ? (oldTotalMonthly - totalMonthly) : 0;

  // Custom Form Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading'); 
    setTimeout(() => {
      setFormState('success'); 
    }, 2000);
  };

  return (
    <main className="bg-[#050505] text-white min-h-screen font-sans selection:bg-cyan-500/30 overflow-y-auto flex flex-col">
      
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Gate Guard" width={40} height={40} className="object-contain" />
          <div>
            <span className="text-lg font-black tracking-tighter uppercase italic block leading-none">Gate Guard</span>
            <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-cyan-500">Sales Proposal Portal</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* LEFT 2/3: THE CALCULATOR & LIVE DEMO */}
        <div className="lg:w-2/3 p-8 lg:p-12 overflow-y-auto border-r border-white/5 bg-gradient-to-br from-[#050505] to-[#0a0f1a]">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* 1. Calculator Section */}
            <div>
              <h2 className="text-3xl font-black mb-8 tracking-tight">Interactive <span className="text-cyan-400">ROI Builder</span></h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Inputs */}
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
                    <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase block mb-2">Additional Cameras</label>
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

                {/* Output
