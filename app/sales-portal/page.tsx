"use client";
import React, { useState } from 'react';
import Image from 'next/image';

export default function SalesPortal() {
  // 1. Calculator State
  const [units, setUnits] = useState(250);
  const [vehicleGates, setVehicleGates] = useState(2);
  const [pedGates, setPedGates] = useState(2);
  const [cameras, setCameras] = useState(4);
  const [conciergeShifts, setConciergeShifts] = useState(0);

  // 2. Interactive Phone & Gate State
  const [brivoStatus, setBrivoStatus] = useState('idle'); 
  
  // Advanced Visitor App State (Directory Flow)
  const [visitorView, setVisitorView] = useState<'home' | 'directory' | 'calling' | 'granted'>('home');
  const [callingName, setCallingName] = useState('');

  // Gate is open if either phone reaches the 'granted' state
  const isGateOpen = brivoStatus === 'granted' || visitorView === 'granted';

  // 3. Form & Simulation State
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [companyName, setCompanyName] = useState('');

  // Simulation Logic: Brivo Tap
  const handleBrivoTap = () => {
    if (brivoStatus !== 'idle') return;
    setBrivoStatus('loading');
    setTimeout(() => setBrivoStatus('granted'), 1200);
    setTimeout(() => setBrivoStatus('idle'), 5500); 
  };

  // Simulation Logic: Visitor App Navigation
  const handleResidentCall = (name: string) => {
    setCallingName(name);
    setVisitorView('calling');
    // Simulate resident answering and opening gate after 2.5s
    setTimeout(() => setVisitorView('granted'), 2500);
    // Reset back to home screen after gate closes
    setTimeout(() => {
      setVisitorView('home');
      setCallingName('');
    }, 6500);
  };

  // Math Logic 
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

                {/* Output Data */}
                <div className="bg-black/40 border border-cyan-500/30 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center">
                  <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee]"></div>
                  <h3 className="text-center text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-2">Estimated Predictable OpEx</h3>
                  
                  <div className="text-center mb-6">
                    <span className="text-5xl font-black text-white">${perUnitMonthly}</span>
                    <span className="text-zinc-500 font-bold text-sm"> / unit / mo</span>
                  </div>

                  <div className="space-y-4 border-t border-white/10 pt-6">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">Gate Guard Monthly</span>
                      <span className="text-white font-bold">${totalMonthly.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">One-Time Setup Fee (Avg)</span>
                      <span className="text-white font-bold">${((vehicleGates + pedGates) * 500).toLocaleString()}</span>
                    </div>
                    
                    {oldTotalMonthly > 0 && (
                      <div className="mt-4 p-4 bg-red-500/5 border border-red-500/20 rounded-xl space-y-3">
                        <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest border-b border-red-500/20 pb-2">Estimated Cost of the "Old Way"</p>
                        
                        {oldGuardCost > 0 && (
                          <div className="flex justify-between text-[10px]">
                            <span className="text-zinc-500">Physical Guard Contracts</span>
                            <span className="text-zinc-400 line-through">${oldGuardCost.toLocaleString()}</span>
                          </div>
                        )}
                        {oldCameraCost > 0 && (
                          <div className="flex justify-between text-[10px]">
                            <span className="text-zinc-500">3rd-Party Video Monitoring</span>
                            <span className="text-zinc-400 line-through">${oldCameraCost.toLocaleString()}</span>
                          </div>
                        )}
                        {(vehicleGates > 0 || pedGates > 0) && (
                          <div className="flex justify-between text-[10px]">
                            <span className="text-zinc-500">Reactive Repairs & Fobs</span>
                            <span className="text-zinc-400 line-through">${(oldRepairCost + oldFobCost).toLocaleString()}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between text-xs font-bold pt-2 border-t border-red-500/10">
                          <span className="text-red-400">Old Way Total</span>
                          <span className="text-red-400 line-through">${oldTotalMonthly.toLocaleString()} / mo</span>
                        </div>

                        {monthlySavings > 0 && (
                          <div className="mt-3 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex justify-between items-center transform transition-all hover:scale-105 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            <span className="text-cyan-400 font-bold text-[10px] uppercase tracking-wider">Your Monthly Savings</span>
                            <span className="text-cyan-300 font-black text-base">${monthlySavings.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Interactive App Demo Section */}
            <div className="pt-10 border-t border-white/10">
              <h2 className="text-2xl font-black mb-2 tracking-tight">Interactive <span className="text-cyan-400">Simulation</span></h2>
              <p className="text-zinc-500 text-sm mb-8">Tap the devices below to trigger a real-time gate event.</p>
              
              {/* LIVE GATE CAMERA FEED */}
              <div className="relative w-full h-64 sm:h-80 rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl group">
                <Image src="/gate-closed.png" alt="Main Gate Closed" fill className="object-cover" />
                <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isGateOpen ? 'opacity-100' : 'opacity-0'}`}>
                   <Image src="/gate-open.png" alt="Main Gate Open" fill className="object-cover" />
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
                 <div className="absolute bottom-4 right-4 opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all">
                    <Image src="/logo.png" alt="Eagle Eye" width={30} height={30} className="object-contain" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-items-center">
                
                {/* BRIVO SIMULATION */}
                <div className="flex flex-col items-center">
                  <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-4">Resident Mobile Pass</p>
                  <div 
                    onClick={handleBrivoTap} 
                    className="relative w-56 h-[480px] bg-black rounded-[2.5rem] border-[4px] border-zinc-800 shadow-xl overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02]"
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

                {/* CALLBOX DIRECTORY SIMULATION */}
                <div className="flex flex-col items-center">
                  <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-4">Visitor Callbox</p>
                  <div className="relative w-56 h-[480px] bg-black rounded-[2.5rem] border-[4px] border-zinc-800 shadow-xl overflow-hidden transform transition-transform hover:scale-[1.02]">
                    
                    {/* View 1: Home Screen */}
                    {visitorView === 'home' && (
                      <>
                        <Image src="/app-callbox.png" alt="Callbox" fill className="object-cover opacity-90" />
                        {/* Invisible clickable box mapped over the "Directory" button on the image */}
                        <div 
                          onClick={() => setVisitorView('directory')}
                          className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[80%] h-14 cursor-pointer z-10 hover:bg-white/10 rounded-xl transition-colors group"
                        >
                          <div className="absolute inset-0 border border-cyan-500/50 rounded-xl animate-pulse opacity-50 group-hover:opacity-100"></div>
                        </div>
                      </>
                    )}

                    {/* View 2: Directory Search Flow */}
                    {visitorView === 'directory' && (
                      <div className="absolute inset-0 bg-[#050505] flex flex-col pt-12 pb-6 px-4 z-20">
                        <h3 className="text-white font-bold mb-4 text-center">Resident Directory</h3>
                        
                        {/* Mock Search Bar */}
                        <div className="bg-white/10 rounded-lg p-2.5 mb-4 flex items-center gap-3">
                          <span className="text-zinc-400 text-xs">🔍</span>
                          <input type="text" placeholder="Search name..." className="bg-transparent outline-none text-white text-xs w-full placeholder:text-zinc-600" readOnly />
                        </div>
                        
                        {/* Mock Resident List */}
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
                          {['A. Anderson', 'B. Barnes', 'C. Carter', 'J. Doe', 'M. Miller', 'S. Smith'].map((name) => (
                            <div 
                              key={name} 
                              onClick={() => handleResidentCall(name)}
                              className="p-3 bg-white/5 rounded-lg border border-white/10 text-xs hover:bg-white/10 hover:border-cyan-500/50 cursor-pointer flex justify-between items-center transition-all"
                            >
                              <span className="text-white font-medium">{name}</span>
                              <span className="text-cyan-400 text-[9px] uppercase font-black tracking-wider bg-cyan-500/10 px-2 py-1 rounded">Call</span>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => setVisitorView('home')} className="mt-4 text-[9px] text-zinc-500 uppercase font-bold tracking-widest text-center w-full">Cancel</button>
                      </div>
                    )}

                    {/* View 3: Calling State */}
                    {visitorView === 'calling' && (
                      <div className="absolute inset-0 bg-[#0f1423]/90 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                        <div className="flex gap-2 mb-6">
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Calling</p>
                        <p className="text-white font-black text-lg">{callingName}</p>
                      </div>
                    )}

                    {/* View 4: Granted / Open State */}
                    {visitorView === 'granted' && (
                      <div className="absolute inset-0 bg-emerald-500/90 backdrop-blur-md flex flex-col items-center justify-center z-30 transition-all duration-300">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-xl">
                          <span className="text-emerald-500 text-2xl font-black">✓</span>
                        </div>
                        <p className="text-white text-base font-black uppercase tracking-wider">Gate Opened</p>
                        <p className="text-emerald-100 text-[10px] uppercase tracking-widest mt-1">Authorized by {callingName}</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

       {/* RIGHT 1/3: THE LEAD CAPTURE & AUTOMATION FORM */}
        <div className="lg:w-1/3 p-8 lg:p-12 bg-black border-l border-white/5 flex flex-col">
          <div className="max-w-sm mx-auto w-full sticky top-10">
            
            {/* STATE 1: THE INPUT FORM */}
            {formState === 'idle' && (
              <div className="animate-[fadeIn_0.5s_ease-out]">
                <h3 className="text-2xl font-bold mb-2">Generate Proposal</h3>
                <p className="text-zinc-500 text-xs mb-8 font-light leading-relaxed">Fill out this form to push lead data to Salesforce and instantly generate a personalized Qwilr proposal.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input name="first_name" placeholder="First Name" type="text" required className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-sm focus:border-cyan-500 outline-none transition-colors" />
                    <input name="last_name" placeholder="Last Name" type="text" required className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-sm focus:border-cyan-500 outline-none transition-colors" />
                  </div>
                  <input 
                    name="company" 
                    placeholder="Property / Group Name" 
                    type="text" 
                    required 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-sm focus:border-cyan-500 outline-none transition-colors" 
                  />
                  <input name="email" placeholder="Email Address" type="email" required className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-sm focus:border-cyan-500 outline-none transition-colors" />
                  
                  <button type="submit" className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all uppercase tracking-widest text-xs mt-4 flex items-center justify-center gap-2">
                    <span>Generate via Qwilr</span>
                    <span className="text-lg">→</span>
                  </button>
                </form>
              </div>
            )}

            {/* STATE 2: LOADING (ZAPIER SIMULATION) */}
            {formState === 'loading' && (
              <div className="flex flex-col items-center justify-center py-20 animate-[fadeIn_0.3s_ease-out]">
                <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-6"></div>
                <p className="text-cyan-400 font-bold uppercase tracking-widest text-xs mb-2 animate-pulse">Running Automations</p>
                <div className="space-y-2 text-center text-[10px] text-zinc-500 font-mono">
                   <p>✓ Calculating ROI Variables...</p>
                   <p>✓ Syncing to Salesforce CRM...</p>
                   <p className="text-zinc-300">⟳ Compiling Qwilr PDF Template...</p>
                </div>
              </div>
            )}

            {/* STATE 3: SUCCESS (MOCK QWILR PREVIEW) */}
            {formState === 'success' && (
              <div className="animate-[fadeIn_0.5s_ease-out]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-xl">✓</div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Proposal Sent!</h3>
                    <p className="text-zinc-500 text-xs">Check their inbox for the live link.</p>
                  </div>
                </div>

                {/* The Qwilr Document Mockup */}
                <div className="bg-white rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-transform hover:-translate-y-2 border border-zinc-200">
                  <div className="h-24 bg-gradient-to-br from-[#0A192F] to-[#050505] relative p-4 flex flex-col justify-end">
                    <div className="absolute top-4 right-4 text-cyan-400/50">
                      <Image src="/logo.png" alt="Logo" width={24} height={24} className="object-contain" />
                    </div>
                    <p className="text-cyan-400 text-[8px] font-black uppercase tracking-widest">Prepared For</p>
                    <p className="text-white font-bold text-lg truncate">{companyName || "Your Property"}</p>
                  </div>
                  <div className="p-6 bg-white text-zinc-900">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-4">Executive Summary</p>
                    <p className="text-sm font-light leading-relaxed mb-6">
                      By migrating to the Gate Guard ecosystem, <span className="font-bold">{companyName || "your property"}</span> will secure a predictable OpEx model, eliminating an estimated <strong>${monthlySavings > 0 ? monthlySavings.toLocaleString() : '0'}</strong> in reactive legacy costs every month.
                    </p>
                    <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100 flex justify-between items-center">
                      <span className="text-xs font-bold text-zinc-500">Proposed Rate</span>
                      <span className="text-xl font-black text-cyan-600">${perUnitMonthly} <span className="text-[10px] font-normal text-zinc-400">/ unit</span></span>
                    </div>
                    <button 
                      onClick={() => setFormState('idle')}
                      className="w-full mt-6 py-3 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition-colors"
                    >
                      Reset For Next Lead
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </main>
  );
}
