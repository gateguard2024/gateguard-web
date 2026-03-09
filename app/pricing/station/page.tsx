"use client";
import React, { useState } from 'react';
import Image from 'next/image';

type BuildingConfig = {
  id: string;
  buildingNumber: string;
  units: number;
  vehicleGates: number;
  vehicleGatesRepair: number;
  
  // Option 1 Scopes: Simplify & Remove
  opt1_removeHardware: number;
  opt1_pushbars: number;
  opt1_rimLocks: number;
  opt1_callboxes: number;

  // Option 2 Scopes: Keep Secure / Reduce
  opt2_pushbars: number;
  opt2_rimLocks: number;
  opt2_setEgress: number;
  opt2_callboxes: number;

  // Option 3 Scopes: Restructure Doors
  opt3_pushbars: number;
  opt3_rimLocks: number;
  opt3_setEgress: number;
  opt3_callboxes: number;

  // Option 4 Scopes: Gate Guard App
  opt4_pushbars: number;
  opt4_rimLocks: number;
  opt4_egressWithApp: number;
  opt4_convertCallbox: number;
};

export default function PricingStationCalculator() {
  const [activeScopeTab, setActiveScopeTab] = useState<'opt1' | 'opt2' | 'opt3' | 'opt4'>('opt1');

  const [buildings, setBuildings] = useState<BuildingConfig[]>([
    { 
      id: '1', buildingNumber: '', units: 250, 
      vehicleGates: 2, vehicleGatesRepair: 0, 
      
      opt1_removeHardware: 0, opt1_pushbars: 0, opt1_rimLocks: 0, opt1_callboxes: 1,
      opt2_pushbars: 0, opt2_rimLocks: 0, opt2_setEgress: 0, opt2_callboxes: 1,
      opt3_pushbars: 0, opt3_rimLocks: 0, opt3_setEgress: 0, opt3_callboxes: 1,
      opt4_pushbars: 0, opt4_rimLocks: 0, opt4_egressWithApp: 0, opt4_convertCallbox: 1,
    }
  ]);
  
  // Base Pricing Assumptions
  const costRemoveHardware = 150;
  const costPushbarWithPlates = 500;
  const costRimLockWithCover = 350;
  const costSetEgress = 150;
  const costSetEgressApp = 500; // Hardware for App Access Control
  const costConvertCallbox = 500; // Hardware/Labor to switch to app
  const costCallBoxTest = 150;
  const doorkingMonthlyFee = 160;

  // --- CRUD HANDLERS ---
  const handleAddBuilding = () => {
    setBuildings([...buildings, { 
      id: Date.now().toString(), buildingNumber: '', units: 250, 
      vehicleGates: 2, vehicleGatesRepair: 0, 
      opt1_removeHardware: 0, opt1_pushbars: 0, opt1_rimLocks: 0, opt1_callboxes: 1,
      opt2_pushbars: 0, opt2_rimLocks: 0, opt2_setEgress: 0, opt2_callboxes: 1,
      opt3_pushbars: 0, opt3_rimLocks: 0, opt3_setEgress: 0, opt3_callboxes: 1,
      opt4_pushbars: 0, opt4_rimLocks: 0, opt4_egressWithApp: 0, opt4_convertCallbox: 1,
    }]);
  };

  const handleRemoveBuilding = (idToRemove: string) => {
    if (buildings.length === 1) return; 
    setBuildings(buildings.filter(b => b.id !== idToRemove));
  };

  const handleUpdateBuilding = (id: string, field: keyof BuildingConfig, value: string | number) => {
    setBuildings(buildings.map(b => {
      if (b.id !== id) return b;
      const updated = { ...b, [field]: value } as BuildingConfig;
      if (field === 'vehicleGates' && updated.vehicleGatesRepair > updated.vehicleGates) updated.vehicleGatesRepair = updated.vehicleGates;
      if (field === 'vehicleGatesRepair' && updated.vehicleGatesRepair > updated.vehicleGates) updated.vehicleGatesRepair = updated.vehicleGates;
      return updated;
    }));
  };

  // --- AGGREGATE MATH FOR THE 4 OPTIONS ---
  let legacyVehSetup = 0;
  let legacyVehMonthly = 0;
  
  let opt1CapEx = 0, opt1OpEx = 0;
  let opt2CapEx = 0, opt2OpEx = 0;
  let opt3CapEx = 0, opt3OpEx = 0;
  let opt4CapEx = 0, opt4OpEx = 0;

  buildings.forEach(b => {
    const vWorking = b.vehicleGates - b.vehicleGatesRepair;
    const vRepair = b.vehicleGatesRepair;

    // Standard Vehicle Costs (Applies to all)
    const vehSetup = (vWorking * 500) + (vRepair * 6750);
    const vehMonthly = (b.vehicleGates * 150) + (vRepair * 250);
    legacyVehSetup += vehSetup;
    legacyVehMonthly += vehMonthly;

    // OPTION 1
    opt1CapEx += vehSetup + (b.opt1_removeHardware * costRemoveHardware) + (b.opt1_pushbars * costPushbarWithPlates) + (b.opt1_rimLocks * costRimLockWithCover) + (b.opt1_callboxes * costCallBoxTest);
    opt1OpEx += vehMonthly + (b.opt1_callboxes * doorkingMonthlyFee);

    // OPTION 2
    opt2CapEx += vehSetup + (b.opt2_pushbars * costPushbarWithPlates) + (b.opt2_rimLocks * costRimLockWithCover) + (b.opt2_setEgress * costSetEgress) + (b.opt2_callboxes * costCallBoxTest);
    opt2OpEx += vehMonthly + (b.opt2_callboxes * doorkingMonthlyFee);

    // OPTION 3
    opt3CapEx += vehSetup + (b.opt3_pushbars * costPushbarWithPlates) + (b.opt3_rimLocks * costRimLockWithCover) + (b.opt3_setEgress * costSetEgress) + (b.opt3_callboxes * costCallBoxTest);
    opt3OpEx += vehMonthly + (b.opt3_callboxes * doorkingMonthlyFee);

    // OPTION 4 (Gate Guard App)
    opt4CapEx += vehSetup + (b.opt4_pushbars * costPushbarWithPlates) + (b.opt4_rimLocks * costRimLockWithCover) + (b.opt4_egressWithApp * costSetEgressApp) + (b.opt4_convertCallbox * costConvertCallbox);
    opt4OpEx += vehMonthly + (b.opt4_egressWithApp * 125); // Gate Guard per-door OpEx
  });

  return (
    <main className="min-h-screen bg-[#0A0A0C] text-zinc-100 font-sans selection:bg-cyan-500/30">
      
      {/* Background styling */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Header - Dark Gate Guard Theme */}
      <header className="p-6 border-b border-white/5 bg-[#0A0A0C]/90 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <Image src="/logo.png" alt="Gate Guard" width={40} height={40} className="object-contain" />
          <div className="border-l border-white/10 pl-6 flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold uppercase tracking-tight text-white leading-none">Gate Guard</h1>
              <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-cyan-500 mt-1">Access Control Estimator</h2>
            </div>
          </div>
        </div>
        {/* Columbia Co-brand */}
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl hidden md:flex items-center gap-2">
           <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Prepared For</span>
           <span className="text-sm font-black text-white tracking-wider">Columbia Res</span>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row relative z-10">
        
        {/* LEFT PANEL: DATA INTAKE */}
        <div className="lg:w-1/2 p-8 lg:p-12 border-r border-white/5 bg-[#0D0D12]">
          <div className="mb-10">
            <h2 className="text-3xl font-black tracking-tight text-white mb-2">Building <span className="text-cyan-400">Intake</span></h2>
            <p className="text-zinc-500 text-sm">Enter the physical gate and granular hardware requirements per building.</p>
          </div>

          <div className="space-y-8">
            {buildings.map((b, index) => {
              const isUnnamed = b.buildingNumber.trim() === '';
              
              return (
                <div key={b.id} className={`bg-[#13131A] border rounded-2xl p-6 transition-all shadow-xl ${isUnnamed ? 'border-red-900/50' : 'border-white/5 hover:border-cyan-500/30'}`}>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-4 mb-6 gap-4">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                        {index + 1}
                      </div>
                      <input 
                        type="text" 
                        placeholder="Enter Building Number..."
                        value={b.buildingNumber} 
                        onChange={(e) => handleUpdateBuilding(b.id, 'buildingNumber', e.target.value)}
                        className="bg-transparent text-xl font-bold outline-none border-b-2 border-transparent focus:border-cyan-500 pb-1 w-full transition-all placeholder:text-zinc-600 text-white"
                      />
                    </div>
                    {buildings.length > 1 && (
                      <button onClick={() => handleRemoveBuilding(b.id)} className="text-zinc-500 hover:text-red-500 text-xs font-bold uppercase tracking-widest bg-black/50 px-3 py-1.5 rounded-lg border border-white/5 whitespace-nowrap shadow-sm">
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Units & Vehicle Gates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                        <div className="flex justify-between mb-4">
                          <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase">Total Units</label>
                          <span className="text-cyan-400 font-black text-sm">{b.units}</span>
                        </div>
                        <input type="range" min="10" max="1000" step="10" value={b.units} onChange={(e) => handleUpdateBuilding(b.id, 'units', Number(e.target.value))} className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                      </div>
                      
                      <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                        <label className="text-white font-bold text-[11px] tracking-widest uppercase block mb-3 border-b border-white/5 pb-2">Vehicle Gates</label>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 block">Total Count</span>
                            <input type="number" min="0" value={b.vehicleGates} onChange={(e) => handleUpdateBuilding(b.id, 'vehicleGates', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2 text-white font-bold outline-none focus:border-cyan-500" />
                          </div>
                          <div className="flex-1">
                            <span className="text-[9px] text-red-400/80 font-bold uppercase tracking-widest mb-1.5 block">Needs Repair</span>
                            <input type="number" min="0" max={b.vehicleGates} value={b.vehicleGatesRepair} onChange={(e) => handleUpdateBuilding(b.id, 'vehicleGatesRepair', Number(e.target.value))} className="w-full bg-red-900/10 border border-red-500/20 rounded-lg p-2 text-red-100 font-bold outline-none focus:border-red-500" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Scope Editor for Pedestrian Doors */}
                    <div className="bg-black/40 p-1 rounded-2xl border border-white/5 shadow-inner">
                      
                      {/* Tabs */}
                      <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden border-b border-white/5 p-2 gap-2">
                        <button onClick={() => setActiveScopeTab('opt1')} className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all ${activeScopeTab === 'opt1' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:bg-white/5'}`}>Opt 1 Scope</button>
                        <button onClick={() => setActiveScopeTab('opt2')} className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all ${activeScopeTab === 'opt2' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:bg-white/5'}`}>Opt 2 Scope</button>
                        <button onClick={() => setActiveScopeTab('opt3')} className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all ${activeScopeTab === 'opt3' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:bg-white/5'}`}>Opt 3 Scope</button>
                        <button onClick={() => setActiveScopeTab('opt4')} className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all ${activeScopeTab === 'opt4' ? 'bg-cyan-900/30 text-cyan-400 shadow-sm border border-cyan-500/20' : 'text-zinc-500 hover:bg-white/5'}`}>Opt 4 Scope</button>
                      </div>

                      <div className="p-4">
                        {/* Option 1 Inputs */}
                        {activeScopeTab === 'opt1' && (
                          <div className="grid grid-cols-2 gap-4 animate-[fadeIn_0.2s_ease-out]">
                            <div className="col-span-2 mb-2"><span className="text-xs text-zinc-400 font-medium">Option 1: Simplify and Remove</span></div>
                            <div>
                              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 block">Remove Existing Hardware</span>
                              <input type="number" min="0" value={b.opt1_removeHardware} onChange={(e) => handleUpdateBuilding(b.id, 'opt1_removeHardware', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                            </div>
                            <div>
                              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 block">New Pushbar & Plate</span>
                              <input type="number" min="0" value={b.opt1_pushbars} onChange={(e) => handleUpdateBuilding(b.id, 'opt1_pushbars', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                            </div>
                            <div>
                              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 block">Rim Lock & Steel Cover</span>
                              <input type="number" min="0" value={b.opt1_rimLocks} onChange={(e) => handleUpdateBuilding(b.id, 'opt1_rimLocks', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                            </div>
                            <div>
                              <span className="text-[9px] text-blue-400/80 font-bold uppercase tracking-widest mb-1 block">Confirm Callbox (Main/Ped)</span>
                              <input type="number" min="0" value={b.opt1_callboxes} onChange={(e) => handleUpdateBuilding(b.id, 'opt1_callboxes', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                            </div>
                          </div>
                        )}

                        {/* Option 2 Inputs */}
                        {activeScopeTab === 'opt2' && (
                          <div className="grid grid-cols-2 gap-4 animate-[fadeIn_0.2s_ease-out]">
                            <div className="col-span-2 mb-2"><span className="text-xs text-zinc-400 font-medium">Option 2: Keep Secure / Reduce Equipment</span></div>
                            <div>
                              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 block">New Pushbar & Plate</span>
                              <input type="number" min="0" value={b.opt2_pushbars} onChange={(e) => handleUpdateBuilding(b.id, 'opt2_pushbars', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                            </div>
                            <div>
                              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 block">Rim Lock & Steel Cover</span>
                              <input type="number" min="0" value={b.opt2_rimLocks} onChange={(e) => handleUpdateBuilding(b.id, 'opt2_rimLocks', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                            </div>
                            <div>
                              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 block">Set Door as Egress Only</span>
                              <input type="number" min="0" value={b.opt2_setEgress} onChange={(e) => handleUpdateBuilding(b.id, 'opt2_setEgress', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                            </div>
                            <div>
                              <span className="text-[9px] text-blue-400/80 font-bold uppercase tracking-widest mb-1 block">Confirm Callbox (Main/Ped)</span>
                              <input type="number" min="0" value={b.opt2_callboxes} onChange={(e) => handleUpdateBuilding(b.id, 'opt2_callboxes', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                            </div>
                          </div>
                        )}

                        {/* Option 3 Inputs */}
                        {activeScopeTab === 'opt3' && (
                          <div className="grid grid-cols-2 gap-4 animate-[fadeIn_0.2s_ease-out]">
                            <div className="col-span-2 mb-2"><span className="text-xs text-zinc-400 font-medium">Option 3: Keep Secure & Restructure Doors</span></div>
                            <div>
                              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 block">New Pushbar & Plate</span>
                              <input type="number" min="0" value={b.opt3_pushbars} onChange={(e) => handleUpdateBuilding(b.id, 'opt3_pushbars', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                            </div>
                            <div>
                              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 block">Rim Lock & Steel Cover</span>
                              <input type="number" min="0" value={b.opt3_rimLocks} onChange={(e) => handleUpdateBuilding(b.id, 'opt3_rimLocks', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                            </div>
                            <div>
                              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 block">Set Door as Egress Only</span>
                              <input type="number" min="0" value={b.opt3_setEgress} onChange={(e) => handleUpdateBuilding(b.id, 'opt3_setEgress', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                            </div>
                            <div>
                              <span className="text-[9px] text-blue-400/80 font-bold uppercase tracking-widest mb-1 block">Confirm Callbox (Main/Ped)</span>
                              <input type="number" min="0" value={b.opt3_callboxes} onChange={(e) => handleUpdateBuilding(b.id, 'opt3_callboxes', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                            </div>
                          </div>
                        )}

                        {/* Option 4 Inputs */}
                        {activeScopeTab === 'opt4' && (
                          <div className="grid grid-cols-2 gap-4 animate-[fadeIn_0.2s_ease-out]">
                            <div className="col-span-2 mb-2"><span className="text-xs text-cyan-400 font-medium">Option 4: Proactive Maintenance Program</span></div>
                            <div>
                              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 block">New Pushbar & Plate</span>
                              <input type="number" min="0" value={b.opt4_pushbars} onChange={(e) => handleUpdateBuilding(b.id, 'opt4_pushbars', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                            </div>
                            <div>
                              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 block">Rim Lock & Steel Cover</span>
                              <input type="number" min="0" value={b.opt4_rimLocks} onChange={(e) => handleUpdateBuilding(b.id, 'opt4_rimLocks', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                            </div>
                            <div>
                              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 block">Set Egress Only (With App)</span>
                              <input type="number" min="0" value={b.opt4_egressWithApp} onChange={(e) => handleUpdateBuilding(b.id, 'opt4_egressWithApp', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                            </div>
                            <div>
                              <span className="text-[9px] text-cyan-400/80 font-bold uppercase tracking-widest mb-1 block">Convert Callbox to App Based</span>
                              <input type="number" min="0" value={b.opt4_convertCallbox} onChange={(e) => handleUpdateBuilding(b.id, 'opt4_convertCallbox', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={handleAddBuilding} className="mt-8 w-full py-4 bg-white/[0.02] border-2 border-dashed border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 rounded-xl text-zinc-500 hover:text-cyan-400 transition-all font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
            <span>+ Add Another Building</span>
          </button>
        </div>

        {/* RIGHT PANEL: 4-WAY COMPARISON MATRIX */}
        <div className="lg:w-1/2 bg-[#050505] p-8 lg:p-12">
          <div className="sticky top-[100px]">
            <div className="mb-8 border-b border-white/5 pb-4">
              <h2 className="text-3xl font-black tracking-tight text-white mb-2">Comparison Matrix</h2>
              <p className="text-zinc-500 text-sm">Review the 4 deployment strategies mapped to your building inputs.</p>
            </div>

            <div className="space-y-6">
              
              {/* Option 1 */}
              <div className="bg-[#0A0A0C] border border-white/5 rounded-xl overflow-hidden shadow-lg hover:border-white/20 transition-all">
                <div className="bg-zinc-900/50 p-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white">Option 1: Simplify & Remove</h3>
                  <p className="text-[10px] text-zinc-400 mt-1">Remove existing hardware, test callboxes.</p>
                </div>
                <div className="p-5 flex justify-between items-center gap-4 border-b border-white/5">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Upfront CapEx</p>
                    <p className="text-xl font-mono font-black text-white">${opt1CapEx.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Monthly OpEx</p>
                    <p className="text-xl font-mono font-black text-white">${opt1OpEx.toLocaleString()}</p>
                    <p className="text-[9px] text-zinc-500 font-medium mt-1">Includes DoorKing fees</p>
                  </div>
                </div>
                <div className="bg-red-900/10 p-3 text-center border-t border-red-900/30">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-red-500">⚠️ Future Hardware Repairs Billed Individually</p>
                </div>
              </div>

              {/* Option 2 */}
              <div className="bg-[#0A0A0C] border border-white/5 rounded-xl overflow-hidden shadow-lg hover:border-white/20 transition-all">
                <div className="bg-zinc-900/50 p-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white">Option 2: Keep Secure / Reduce</h3>
                  <p className="text-[10px] text-zinc-400 mt-1">Keep existing doors, set egress only.</p>
                </div>
                <div className="p-5 flex justify-between items-center gap-4 border-b border-white/5">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Upfront CapEx</p>
                    <p className="text-xl font-mono font-black text-white">${opt2CapEx.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Monthly OpEx</p>
                    <p className="text-xl font-mono font-black text-white">${opt2OpEx.toLocaleString()}</p>
                    <p className="text-[9px] text-zinc-500 font-medium mt-1">Includes DoorKing fees</p>
                  </div>
                </div>
                <div className="bg-red-900/10 p-3 text-center border-t border-red-900/30">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-red-500">⚠️ Future Hardware Repairs Billed Individually</p>
                </div>
              </div>

              {/* Option 3 */}
              <div className="bg-[#0A0A0C] border border-white/5 rounded-xl overflow-hidden shadow-lg hover:border-white/20 transition-all">
                <div className="bg-zinc-900/50 p-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white">Option 3: Restructure Doors</h3>
                  <p className="text-[10px] text-zinc-400 mt-1">Keep existing doors, set egress only.</p>
                </div>
                <div className="p-5 flex justify-between items-center gap-4 border-b border-white/5">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Upfront CapEx</p>
                    <p className="text-xl font-mono font-black text-white">${opt3CapEx.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Monthly OpEx</p>
                    <p className="text-xl font-mono font-black text-white">${opt3OpEx.toLocaleString()}</p>
                    <p className="text-[9px] text-zinc-500 font-medium mt-1">Includes DoorKing fees</p>
                  </div>
                </div>
                <div className="bg-red-900/10 p-3 text-center border-t border-red-900/30">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-red-500">⚠️ Future Hardware Repairs Billed Individually</p>
                </div>
              </div>

              {/* Option 4 (Hero Option) */}
              <div className="bg-[#0D0D12] border-2 border-cyan-500/40 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)] relative transform scale-[1.02]">
                <div className="absolute top-0 right-0 bg-cyan-500 text-[#0A0A0C] text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-lg shadow-sm">Recommended</div>
                <div className="bg-cyan-900/20 p-5 border-b border-cyan-500/20">
                  <h3 className="text-base font-black uppercase tracking-widest text-cyan-400">Option 4: Proactive Maintenance</h3>
                  <p className="text-[11px] text-cyan-100/70 mt-1">Full app integration. Callboxes eliminated. Hardware included.</p>
                </div>
                <div className="p-6 flex justify-between items-center gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-cyan-500/70 font-bold">Upfront Setup</p>
                    <p className="text-2xl font-mono font-black text-white">${opt4CapEx.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-cyan-500/70 font-bold">Predictable Monthly</p>
                    <p className="text-2xl font-mono font-black text-cyan-400">${opt4OpEx.toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-emerald-900/20 text-emerald-400 p-3 text-center border-t border-emerald-500/30">
                  <p className="text-[10px] uppercase tracking-widest font-bold">✓ All Maintenance & 99% Uptime SLA Included</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
