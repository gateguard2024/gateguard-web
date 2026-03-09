"use client";
import React, { useState } from 'react';
import Image from 'next/image';

type BuildingConfig = {
  id: string;
  buildingNumber: string;
  units: number;
  vehicleGates: number;
  vehicleGatesRepair: number;

  // Option 4 Scopes: Gate Guard App (Now First!)
  opt4_pedDoors: number; 
  opt4_convertCallbox: number;
  
  // Option 3 Scopes: Restructure Doors
  opt3_pushbars: number;
  opt3_rimLocks: number;
  opt3_setEgress: number;
  opt3_callboxes: number;

  // Option 2 Scopes: Keep Secure / Reduce
  opt2_pushbars: number;
  opt2_rimLocks: number;
  opt2_setEgress: number;
  opt2_callboxes: number;

  // Option 1 Scopes: Simplify & Remove
  opt1_removeHardware: number;
  opt1_pushbars: number;
  opt1_pushbarsWithRimLock: number; 
  opt1_maglockCovers: number;
  opt1_maglocksToReplace: number; 
  opt1_callboxes: number;
};

export default function PricingStationCalculator() {
  // Default to Opt 4 now
  const [activeScopeTab, setActiveScopeTab] = useState<'opt4' | 'opt3' | 'opt2' | 'opt1'>('opt4');

  const [buildings, setBuildings] = useState<BuildingConfig[]>([
    { 
      id: '1', buildingNumber: '', units: 150, 
      vehicleGates: 2, vehicleGatesRepair: 0, 
      
      opt4_pedDoors: 0, opt4_convertCallbox: 1,
      opt3_pushbars: 0, opt3_rimLocks: 0, opt3_setEgress: 0, opt3_callboxes: 1,
      opt2_pushbars: 0, opt2_rimLocks: 0, opt2_setEgress: 0, opt2_callboxes: 1,
      opt1_removeHardware: 0, opt1_pushbars: 0, opt1_pushbarsWithRimLock: 0, opt1_maglockCovers: 0, opt1_maglocksToReplace: 0, opt1_callboxes: 1,
    }
  ]);
  
  // --- OPTION 4 PRICING (GATE GUARD) ---
  const opt4_gateSetupWorking = 500;
  const opt4_gateSetupRepair = 750;
  const opt4_gateMonthly = 250;
  
  const opt4_pedSetup = 750;
  const opt4_pedMonthly = 180;
  
  const opt4_callboxConvertSetup = 350;

  // --- LEGACY HARDWARE PRICING CONSTANTS (Opt 1-3) ---
  const costGateTestLegacy = 200; 
  const costGateRepairLegacy = 1200; 
  
  const costRemoveHardware = 500;
  const costPushbar = 700;
  const costRimLock = 550;
  const costSetEgress = 150;
  const costMaglockCover = 350; 
  const costMaglockReplace = 550;
  
  const costCallBoxTest = 150;
  const doorkingMonthlyFee = 160;

  // --- CRUD HANDLERS ---
  const handleAddBuilding = () => {
    setBuildings([...buildings, { 
      id: Date.now().toString(), buildingNumber: '', units: 150, 
      vehicleGates: 2, vehicleGatesRepair: 0, 
      opt4_pedDoors: 0, opt4_convertCallbox: 1,
      opt3_pushbars: 0, opt3_rimLocks: 0, opt3_setEgress: 0, opt3_callboxes: 1,
      opt2_pushbars: 0, opt2_rimLocks: 0, opt2_setEgress: 0, opt2_callboxes: 1,
      opt1_removeHardware: 0, opt1_pushbars: 0, opt1_pushbarsWithRimLock: 0, opt1_maglockCovers: 0, opt1_maglocksToReplace: 0, opt1_callboxes: 1,
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
      
      // Safety Checks
      if (field === 'vehicleGates' && updated.vehicleGatesRepair > updated.vehicleGates) updated.vehicleGatesRepair = updated.vehicleGates;
      if (field === 'vehicleGatesRepair' && updated.vehicleGatesRepair > updated.vehicleGates) updated.vehicleGatesRepair = updated.vehicleGates;
      
      if (field === 'opt1_pushbars' && updated.opt1_pushbarsWithRimLock > updated.opt1_pushbars) updated.opt1_pushbarsWithRimLock = updated.opt1_pushbars;
      if (field === 'opt1_pushbarsWithRimLock' && updated.opt1_pushbarsWithRimLock > updated.opt1_pushbars) updated.opt1_pushbarsWithRimLock = updated.opt1_pushbars;

      if (field === 'opt1_maglockCovers' && updated.opt1_maglocksToReplace > updated.opt1_maglockCovers) updated.opt1_maglocksToReplace = updated.opt1_maglockCovers;
      if (field === 'opt1_maglocksToReplace' && updated.opt1_maglocksToReplace > updated.opt1_maglockCovers) updated.opt1_maglocksToReplace = updated.opt1_maglockCovers;

      return updated;
    }));
  };

  // --- AGGREGATE MATH FOR THE 4 OPTIONS ---
  let totalUnits = 0;
  
  let opt4CapEx = 0, opt4OpEx = 0;
  let opt3CapEx = 0, opt3OpEx = 0;
  let opt2CapEx = 0, opt2OpEx = 0;
  let opt1CapEx = 0, opt1OpEx = 0;

  buildings.forEach(b => {
    totalUnits += b.units;

    const vWorking = b.vehicleGates - b.vehicleGatesRepair;
    const vRepair = b.vehicleGatesRepair;

    // --- OPTION 4: GATE GUARD APP (Proactive) ---
    const opt4VehSetup = (vWorking * opt4_gateSetupWorking) + (vRepair * opt4_gateSetupRepair);
    const opt4VehMonthly = (b.vehicleGates * opt4_gateMonthly);

    opt4CapEx += opt4VehSetup + (b.opt4_pedDoors * opt4_pedSetup) + (b.opt4_convertCallbox * opt4_callboxConvertSetup);
    opt4OpEx += opt4VehMonthly + (b.opt4_pedDoors * opt4_pedMonthly);

    // --- LEGACY VEHICLE COSTS (Opt 3, 2, 1) ---
    const legacyVehSetup = (b.vehicleGates * costGateTestLegacy) + (vRepair * costGateRepairLegacy);
    const legacyVehMonthly = 0; // Legacy models don't have vehicle monthly OPEX

    // OPTION 3: Restructure Doors
    opt3CapEx += legacyVehSetup + 
                 (b.opt3_pushbars * costPushbar) + 
                 (b.opt3_rimLocks * costRimLock) + 
                 (b.opt3_setEgress * costSetEgress) + 
                 (b.opt3_callboxes * costCallBoxTest);
    opt3OpEx += legacyVehMonthly + (b.opt3_callboxes * doorkingMonthlyFee);

    // OPTION 2: Keep Secure / Reduce
    opt2CapEx += legacyVehSetup + 
                 (b.opt2_pushbars * costPushbar) + 
                 (b.opt2_rimLocks * costRimLock) + 
                 (b.opt2_setEgress * costSetEgress) + 
                 (b.opt2_callboxes * costCallBoxTest);
    opt2OpEx += legacyVehMonthly + (b.opt2_callboxes * doorkingMonthlyFee);

    // OPTION 1: Simplify & Remove
    opt1CapEx += legacyVehSetup + 
                 (b.opt1_removeHardware * costRemoveHardware) + 
                 (b.opt1_pushbars * costPushbar) + 
                 (b.opt1_pushbarsWithRimLock * costRimLock) + 
                 (b.opt1_maglockCovers * costMaglockCover) +
                 (b.opt1_maglocksToReplace * costMaglockReplace) +
                 (b.opt1_callboxes * costCallBoxTest);
    opt1OpEx += legacyVehMonthly + (b.opt1_callboxes * doorkingMonthlyFee);
  });

  const safeUnits = totalUnits > 0 ? totalUnits : 1;
  const opt4CPU = (opt4OpEx / safeUnits).toFixed(2);
  const opt3CPU = (opt3OpEx / safeUnits).toFixed(2);
  const opt2CPU = (opt2OpEx / safeUnits).toFixed(2);
  const opt1CPU = (opt1OpEx / safeUnits).toFixed(2);

  return (
    <main className="min-h-screen bg-[#0A0A0C] text-zinc-100 font-sans selection:bg-cyan-500/30">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Header */}
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
      </header>

      <div className="max-w-[1800px] mx-auto w-full flex flex-col lg:flex-row relative z-10">
        
        {/* LEFT PANEL: DATA INTAKE */}
        <div className="lg:w-1/2 p-8 lg:p-12 border-r border-white/5 bg-[#0D0D12]">
          <div className="mb-10">
            <h2 className="text-3xl font-black tracking-tight text-white mb-2">Building <span className="text-cyan-400">Intake</span></h2>
            <p className="text-zinc-500 text-sm">Configure physical gates and specific hardware scope per building.</p>
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
                      <button onClick={() => handleRemoveBuilding(b.id)} className="text-zinc-500 hover:text-red-500 text-xs font-bold uppercase tracking-widest bg-black/50 px-3 py-1.5 rounded-lg border border-white/5 shadow-sm">
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
                        <input type="range" min="1" max="300" step="1" value={b.units} onChange={(e) => handleUpdateBuilding(b.id, 'units', Number(e.target.value))} className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
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

                    {/* Scope Editor (Reordered) */}
                    <div className="bg-black/40 p-1 rounded-2xl border border-white/5 shadow-inner">
                      <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden border-b border-white/5 p-2 gap-2">
                        <button onClick={() => setActiveScopeTab('opt4')} className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all ${activeScopeTab === 'opt4' ? 'bg-cyan-900/30 text-cyan-400 shadow-sm border border-cyan-500/20' : 'text-zinc-500 hover:bg-white/5'}`}>Opt 4</button>
                        <button onClick={() => setActiveScopeTab('opt3')} className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all ${activeScopeTab === 'opt3' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:bg-white/5'}`}>Opt 3</button>
                        <button onClick={() => setActiveScopeTab('opt2')} className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all ${activeScopeTab === 'opt2' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:bg-white/5'}`}>Opt 2</button>
                        <button onClick={() => setActiveScopeTab('opt1')} className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all ${activeScopeTab === 'opt1' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:bg-white/5'}`}>Opt 1</button>
                      </div>

                      <div className="p-4">
                        
                        {/* OPTION 4 INPUTS (GATE GUARD - NOW FIRST) */}
                        {activeScopeTab === 'opt4' && (
                          <div className="animate-[fadeIn_0.2s_ease-out] space-y-4">
                            <div className="border-b border-white/5 pb-2 mb-4">
                              <span className="text-sm font-bold text-cyan-400 block">Option 4: Gate Guard Proactive</span>
                              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Full Hardware & App Management</span>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <span className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-widest mb-1.5 block">New Door Hardware & App (${opt4_pedSetup} Setup)</span>
                                <input type="number" min="0" value={b.opt4_pedDoors} onChange={(e) => handleUpdateBuilding(b.id, 'opt4_pedDoors', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-3 text-white font-bold outline-none focus:border-cyan-500" />
                              </div>
                              <div>
                                <span className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-widest mb-1.5 block">Convert Callbox to App (${opt4_callboxConvertSetup})</span>
                                <input type="number" min="0" value={b.opt4_convertCallbox} onChange={(e) => handleUpdateBuilding(b.id, 'opt4_convertCallbox', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-3 text-white font-bold outline-none focus:border-cyan-500" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* OPTION 3 INPUTS */}
                        {activeScopeTab === 'opt3' && (
                          <div className="animate-[fadeIn_0.2s_ease-out] space-y-4">
                            <div className="border-b border-white/5 pb-2 mb-4">
                              <span className="text-sm font-bold text-white block">Option 3: Restructure Doors</span>
                              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Full Access Control Strategy</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 block">New Pushbar & Plate (${costPushbar})</span>
                                <input type="number" min="0" value={b.opt3_pushbars} onChange={(e) => handleUpdateBuilding(b.id, 'opt3_pushbars', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                              </div>
                              <div>
                                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 block">Rim Lock & Steel Cover (${costRimLock})</span>
                                <input type="number" min="0" value={b.opt3_rimLocks} onChange={(e) => handleUpdateBuilding(b.id, 'opt3_rimLocks', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                              </div>
                              <div>
                                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 block">Set Door as Egress Only (${costSetEgress})</span>
                                <input type="number" min="0" value={b.opt3_setEgress} onChange={(e) => handleUpdateBuilding(b.id, 'opt3_setEgress', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                              </div>
                              <div>
                                <span className="text-[9px] text-blue-400/80 font-bold uppercase tracking-widest mb-1 block">Callboxes to Test (${costCallBoxTest})</span>
                                <input type="number" min="0" value={b.opt3_callboxes} onChange={(e) => handleUpdateBuilding(b.id, 'opt3_callboxes', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* OPTION 2 INPUTS */}
                        {activeScopeTab === 'opt2' && (
                          <div className="animate-[fadeIn_0.2s_ease-out] space-y-4">
                            <div className="border-b border-white/5 pb-2 mb-4">
                              <span className="text-sm font-bold text-white block">Option 2: Keep Secure / Reduce</span>
                              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Hardware Modification Strategy</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 block">New Pushbar & Plate (${costPushbar})</span>
                                <input type="number" min="0" value={b.opt2_pushbars} onChange={(e) => handleUpdateBuilding(b.id, 'opt2_pushbars', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                              </div>
                              <div>
                                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 block">Rim Lock & Steel Cover (${costRimLock})</span>
                                <input type="number" min="0" value={b.opt2_rimLocks} onChange={(e) => handleUpdateBuilding(b.id, 'opt2_rimLocks', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                              </div>
                              <div>
                                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 block">Set Door as Egress Only (${costSetEgress})</span>
                                <input type="number" min="0" value={b.opt2_setEgress} onChange={(e) => handleUpdateBuilding(b.id, 'opt2_setEgress', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                              </div>
                              <div>
                                <span className="text-[9px] text-blue-400/80 font-bold uppercase tracking-widest mb-1 block">Callboxes to Test (${costCallBoxTest})</span>
                                <input type="number" min="0" value={b.opt2_callboxes} onChange={(e) => handleUpdateBuilding(b.id, 'opt2_callboxes', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* OPTION 1 INPUTS */}
                        {activeScopeTab === 'opt1' && (
                          <div className="animate-[fadeIn_0.2s_ease-out] space-y-5">
                            <div className="border-b border-white/5 pb-2">
                              <span className="text-sm font-bold text-white block">Option 1: Simplify & Remove</span>
                              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">NFPA/ADA Compliance Strategy</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1.5 block">Remove Existing Hardware (${costRemoveHardware})</span>
                                  <input type="number" min="0" value={b.opt1_removeHardware} onChange={(e) => handleUpdateBuilding(b.id, 'opt1_removeHardware', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                                </div>
                                <div>
                                  <span className="text-[10px] text-blue-400/80 font-bold uppercase tracking-widest mb-1.5 block">Callboxes to Test (${costCallBoxTest})</span>
                                  <input type="number" min="0" value={b.opt1_callboxes} onChange={(e) => handleUpdateBuilding(b.id, 'opt1_callboxes', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                                </div>
                              </div>

                              <div className="space-y-4 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                <div>
                                  <span className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-widest mb-1.5 block">Add Pushbar & Plate (${costPushbar})</span>
                                  <input type="number" min="0" value={b.opt1_pushbars} onChange={(e) => handleUpdateBuilding(b.id, 'opt1_pushbars', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-emerald-500" />
                                </div>
                                <div className="pl-4 border-l-2 border-emerald-500/20">
                                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 block">↳ Add Rim Lock for App Access (${costRimLock})</span>
                                  <input type="number" min="0" max={b.opt1_pushbars} value={b.opt1_pushbarsWithRimLock} onChange={(e) => handleUpdateBuilding(b.id, 'opt1_pushbarsWithRimLock', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2 text-white font-bold outline-none focus:border-emerald-500" />
                                </div>
                              </div>

                              <div className="space-y-4 bg-white/[0.02] p-3 rounded-xl border border-white/5 md:col-span-2">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1.5 block">Keep Maglock + Add Cover (${costMaglockCover})</span>
                                    <input type="number" min="0" value={b.opt1_maglockCovers} onChange={(e) => handleUpdateBuilding(b.id, 'opt1_maglockCovers', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-red-400/80 font-bold uppercase tracking-widest mb-1.5 block">Needs Maglock Replace (+${costMaglockReplace})</span>
                                    <input type="number" min="0" max={b.opt1_maglockCovers} value={b.opt1_maglocksToReplace} onChange={(e) => handleUpdateBuilding(b.id, 'opt1_maglocksToReplace', Number(e.target.value))} className="w-full bg-red-900/10 border border-red-500/20 rounded-lg p-2.5 text-red-100 font-bold outline-none focus:border-red-500" />
                                  </div>
                                </div>
                              </div>
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

        {/* RIGHT PANEL: 4-WAY COMPARISON MATRIX & SOW */}
        <div className="lg:w-1/2 bg-[#050505] p-8 lg:p-12">
          <div className="sticky top-[100px] space-y-8">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-3xl font-black tracking-tight text-white mb-2">Comparison Matrix</h2>
              <p className="text-zinc-500 text-sm">Review the 4 deployment strategies mapped to your building inputs.</p>
            </div>

            {/* REORDERED GRID: OPTION 4 IS TOP HERO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Option 4 (Hero Option) Matrix Card - NOW TOP LEFT OR SPANNING */}
              <div className={`md:col-span-2 bg-[#0D0D12] border-2 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.1)] relative transition-all ${activeScopeTab === 'opt4' ? 'border-cyan-400 scale-[1.02] z-10' : 'border-cyan-900/40 opacity-90'}`}>
                <div className="absolute top-0 right-0 bg-cyan-500 text-[#0A0A0C] text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-lg shadow-sm">Recommended</div>
                <div className="bg-cyan-900/20 p-5 border-b border-cyan-500/20">
                  <h3 className="text-base font-black uppercase tracking-widest text-cyan-400">Opt 4: Gate Guard Proactive</h3>
                </div>
                <div className="p-6 flex justify-between items-center gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-cyan-500/70 font-bold">Setup</p>
                    <p className="text-2xl font-mono font-black text-white">${opt4CapEx.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-cyan-500/70 font-bold">Flat OpEx</p>
                    <p className="text-2xl font-mono font-black text-cyan-400">${opt4OpEx.toLocaleString()}</p>
                    <p className="text-[10px] text-cyan-500/70 font-medium mt-1">CPU: ${opt4CPU}</p>
                  </div>
                </div>
                <div className="bg-emerald-900/20 text-emerald-400 p-3 text-center border-t border-emerald-500/30">
                  <p className="text-[10px] uppercase tracking-widest font-bold">✓ Hardware Maintained & Primary Gate Camera Included</p>
                </div>
              </div>

              {/* Option 3 Matrix Card */}
              <div className={`bg-[#0A0A0C] border rounded-xl overflow-hidden shadow-lg transition-all ${activeScopeTab === 'opt3' ? 'border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.05)] scale-[1.02]' : 'border-white/5 opacity-70 hover:opacity-100'}`}>
                <div className="bg-zinc-900/50 p-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white">Opt 3: Restructure</h3>
                </div>
                <div className="p-4 border-b border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">CapEx</p>
                    <p className="text-sm font-mono font-black text-white">${opt3CapEx.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">OpEx</p>
                    <div className="text-right">
                      <p className="text-sm font-mono font-black text-white">${opt3OpEx.toLocaleString()}</p>
                      <p className="text-[8px] text-zinc-500 font-medium">CPU: ${opt3CPU}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Option 2 Matrix Card */}
              <div className={`bg-[#0A0A0C] border rounded-xl overflow-hidden shadow-lg transition-all ${activeScopeTab === 'opt2' ? 'border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.05)] scale-[1.02]' : 'border-white/5 opacity-70 hover:opacity-100'}`}>
                <div className="bg-zinc-900/50 p-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white">Opt 2: Keep / Reduce</h3>
                </div>
                <div className="p-4 border-b border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">CapEx</p>
                    <p className="text-sm font-mono font-black text-white">${opt2CapEx.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">OpEx</p>
                    <div className="text-right">
                      <p className="text-sm font-mono font-black text-white">${opt2OpEx.toLocaleString()}</p>
                      <p className="text-[8px] text-zinc-500 font-medium">CPU: ${opt2CPU}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Option 1 Matrix Card */}
              <div className={`bg-[#0A0A0C] border rounded-xl overflow-hidden shadow-lg transition-all ${activeScopeTab === 'opt1' ? 'border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.05)] scale-[1.02]' : 'border-white/5 opacity-70 hover:opacity-100'}`}>
                <div className="bg-zinc-900/50 p-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white">Opt 1: Simplify & Remove</h3>
                </div>
                <div className="p-4 border-b border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">CapEx</p>
                    <p className="text-sm font-mono font-black text-white">${opt1CapEx.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">OpEx</p>
                    <div className="text-right">
                      <p className="text-sm font-mono font-black text-white">${opt1OpEx.toLocaleString()}</p>
                      <p className="text-[8px] text-zinc-500 font-medium">CPU: ${opt1CPU}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="bg-red-900/10 p-3 rounded-lg text-center border border-red-900/30">
               <p className="text-[10px] uppercase tracking-widest font-bold text-red-500">⚠️ Legacy Options (3, 2, 1) Bill Future Repairs Individually</p>
            </div>

            {/* DYNAMIC SOW GLOSSARY SECTION */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 mt-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Strategy & Scope Notes
              </h3>
              
              {activeScopeTab === 'opt4' && (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                   <div>
                    <h4 className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1">Vision: Proactive OpEx</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">Option 4 completely eliminates legacy Callbox hardware (and associated DoorKing fees) by upgrading the community to a full app-based access control system. Furthermore, all physical hardware maintenance is absorbed into a predictable, flat-rate monthly SLA (along with a new primary gate camera), guaranteeing 99% uptime and removing random CapEx spikes from the balance sheet.</p>
                  </div>
                </div>
              )}

              {activeScopeTab === 'opt3' && (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">Vision: Keep Secure & Restructure Doors</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">Option 3 is a comprehensive security upgrade. We restructure the existing doors, outfitting key entry points with full access control hardware (new pushbars, rim locks, and covers) to ensure a highly secure, tenant-friendly perimeter, while keeping secondary doors strictly egress-only.</p>
                  </div>
                </div>
              )}

              {activeScopeTab === 'opt2' && (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">Vision: Keep Secure / Reduce Equipment</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">The objective of Option 2 is to maintain the current perimeter security while reducing the overall amount of active access control hardware. By converting non-essential pedestrian points to 'egress-only', we maintain safe exiting while funneling inbound traffic through secure, easily-monitored primary checkpoints.</p>
                  </div>
                </div>
              )}
              
              {activeScopeTab === 'opt1' && (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">Vision: Simplify & Remove</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">The objective of Option 1 is to actively reduce the number of potential hardware fail points across the property. By intentionally stripping unnecessary access doors and funneling traffic to primary entry points, we drastically lower long-term CapEx exposure on broken hardware.</p>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">Life-Safety Compliance</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">By retrofitting selected egress doors with compliant pushbars and strike plates (rather than relying on maglocks and motion sensors), the property aligns immediately with commercial ADA standards and NFPA fire safety codes—significantly reducing management liability.</p>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
