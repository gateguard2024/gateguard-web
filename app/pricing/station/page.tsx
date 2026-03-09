"use client";
import React, { useState } from 'react';
import Image from 'next/image';

type BuildingConfig = {
  id: string;
  buildingNumber: string;
  units: number;
  vehicleGates: number;
  vehicleGatesRepair: number;
  
  // Option 1: Your Gate Guard (SaaS / Full Mgmt)
  opt1_pushbars: number;
  opt1_pushbarsWithRimLock: number;
  opt1_maglockCovers: number;
  opt1_maglocksToReplace: number;
  opt1_convertCallbox: number;

  // Option 2: Re-Structure
  opt2_pushbars: number;
  opt2_pushbarsWithRimLock: number;
  opt2_maglockCovers: number;
  opt2_maglocksToReplace: number;
  opt2_callboxes: number;

  // Option 3: Keep and Reduce
  opt3_pushbars: number;
  opt3_pushbarsWithRimLock: number;
  opt3_maglockCovers: number;
  opt3_maglocksToReplace: number;
  opt3_setEgress: number;
  opt3_callboxes: number;

  // Option 4: Simplify & Remove
  opt4_removeHardware: number;
  opt4_pushbars: number;
  opt4_pushbarsWithRimLock: number;
  opt4_maglockCovers: number;
  opt4_maglocksToReplace: number;
  opt4_callboxes: number;
};

export default function PricingStationCalculator() {
  const [activeScopeTab, setActiveScopeTab] = useState<'opt1' | 'opt2' | 'opt3' | 'opt4'>('opt1');

  const [buildings, setBuildings] = useState<BuildingConfig[]>([
    { 
      id: '1', buildingNumber: '', units: 150, 
      vehicleGates: 2, vehicleGatesRepair: 0, 
      
      opt1_pushbars: 0, opt1_pushbarsWithRimLock: 0, opt1_maglockCovers: 0, opt1_maglocksToReplace: 0, opt1_convertCallbox: 1,
      opt2_pushbars: 0, opt2_pushbarsWithRimLock: 0, opt2_maglockCovers: 0, opt2_maglocksToReplace: 0, opt2_callboxes: 1,
      opt3_pushbars: 0, opt3_pushbarsWithRimLock: 0, opt3_maglockCovers: 0, opt3_maglocksToReplace: 0, opt3_setEgress: 0, opt3_callboxes: 1,
      opt4_removeHardware: 0, opt4_pushbars: 0, opt4_pushbarsWithRimLock: 0, opt4_maglockCovers: 0, opt4_maglocksToReplace: 0, opt4_callboxes: 1,
    }
  ]);
  
  // --- GENERAL HARDWARE PRICING CONSTANTS ---
  const costRemoveHardware = 500;
  const costPushbar = 700;
  const costRimLock = 550;
  const costMaglockCover = 350; 
  const costMaglockReplace = 550;
  const costSetEgress = 150;
  
  const costCallBoxTest = 150;
  const doorkingMonthlyFee = 160;

  // --- GATE GUARD (OPT 1) SPECIFIC PRICING ---
  const opt1_gateSetupWorking = 500;
  const opt1_gateSetupRepair = 750;
  const opt1_gateMonthly = 250;
  
  const opt1_pedMonthly = 315; // Per active app door
  const opt1_callboxConvertSetup = 350;

  // --- LEGACY VEHICLE PRICING (OPT 2-4) ---
  const costGateTestLegacy = 200; 
  const costGateRepairLegacy = 1200; 

  // --- CRUD HANDLERS ---
  const handleAddBuilding = () => {
    setBuildings([...buildings, { 
      id: Date.now().toString(), buildingNumber: '', units: 150, 
      vehicleGates: 2, vehicleGatesRepair: 0, 
      opt1_pushbars: 0, opt1_pushbarsWithRimLock: 0, opt1_maglockCovers: 0, opt1_maglocksToReplace: 0, opt1_convertCallbox: 1,
      opt2_pushbars: 0, opt2_pushbarsWithRimLock: 0, opt2_maglockCovers: 0, opt2_maglocksToReplace: 0, opt2_callboxes: 1,
      opt3_pushbars: 0, opt3_pushbarsWithRimLock: 0, opt3_maglockCovers: 0, opt3_maglocksToReplace: 0, opt3_setEgress: 0, opt3_callboxes: 1,
      opt4_removeHardware: 0, opt4_pushbars: 0, opt4_pushbarsWithRimLock: 0, opt4_maglockCovers: 0, opt4_maglocksToReplace: 0, opt4_callboxes: 1,
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
      
      // Safety Checks for Vehicle Gates
      if (field === 'vehicleGates' && updated.vehicleGatesRepair > updated.vehicleGates) updated.vehicleGatesRepair = updated.vehicleGates;
      if (field === 'vehicleGatesRepair' && updated.vehicleGatesRepair > updated.vehicleGates) updated.vehicleGatesRepair = updated.vehicleGates;
      
      // Safety Checks for Pedestrian Add-ons (Apply to all scopes dynamically based on field names)
      if (field.includes('pushbars') && !field.includes('RimLock')) {
        const scope = field.split('_')[0];
        // @ts-ignore
        if (updated[`${scope}_pushbarsWithRimLock`] > updated[field]) updated[`${scope}_pushbarsWithRimLock`] = updated[field];
      }
      if (field.includes('maglockCovers')) {
        const scope = field.split('_')[0];
        // @ts-ignore
        if (updated[`${scope}_maglocksToReplace`] > updated[field]) updated[`${scope}_maglocksToReplace`] = updated[field];
      }

      return updated;
    }));
  };

  // --- AGGREGATE MATH FOR THE 4 OPTIONS ---
  let totalUnits = 0;
  let opt1CapEx = 0, opt1OpEx = 0;
  let opt2CapEx = 0, opt2OpEx = 0;
  let opt3CapEx = 0, opt3OpEx = 0;
  let opt4CapEx = 0, opt4OpEx = 0;

  buildings.forEach(b => {
    totalUnits += b.units;

    const vWorking = b.vehicleGates - b.vehicleGatesRepair;
    const vRepair = b.vehicleGatesRepair;

    // --- OPTION 1: YOUR GATE GUARD (SaaS/Managed) ---
    const opt1VehSetup = (vWorking * opt1_gateSetupWorking) + (vRepair * opt1_gateSetupRepair);
    const opt1VehMonthly = (b.vehicleGates * opt1_gateMonthly);

    opt1CapEx += opt1VehSetup + 
                 (b.opt1_pushbars * costPushbar) + 
                 (b.opt1_pushbarsWithRimLock * costRimLock) + 
                 (b.opt1_maglockCovers * costMaglockCover) + 
                 (b.opt1_maglocksToReplace * costMaglockReplace) + 
                 (b.opt1_convertCallbox * opt1_callboxConvertSetup);
    
    // Monthly includes vehicle gates + app access per active door (Rim locks + maglocks)
    const activeAppDoors = b.opt1_pushbarsWithRimLock + b.opt1_maglockCovers;
    opt1OpEx += opt1VehMonthly + (activeAppDoors * opt1_pedMonthly);

    // --- LEGACY VEHICLE COSTS (Opt 2, 3, 4) ---
    const legacyVehSetup = (b.vehicleGates * costGateTestLegacy) + (vRepair * costGateRepairLegacy);
    const legacyVehMonthly = 0;

    // OPTION 2: Re-Structure
    opt2CapEx += legacyVehSetup + 
                 (b.opt2_pushbars * costPushbar) + 
                 (b.opt2_pushbarsWithRimLock * costRimLock) + 
                 (b.opt2_maglockCovers * costMaglockCover) + 
                 (b.opt2_maglocksToReplace * costMaglockReplace) + 
                 (b.opt2_callboxes * costCallBoxTest);
    opt2OpEx += legacyVehMonthly + (b.opt2_callboxes * doorkingMonthlyFee);

    // OPTION 3: Keep & Reduce
    opt3CapEx += legacyVehSetup + 
                 (b.opt3_pushbars * costPushbar) + 
                 (b.opt3_pushbarsWithRimLock * costRimLock) + 
                 (b.opt3_maglockCovers * costMaglockCover) + 
                 (b.opt3_maglocksToReplace * costMaglockReplace) + 
                 (b.opt3_setEgress * costSetEgress) +
                 (b.opt3_callboxes * costCallBoxTest);
    opt3OpEx += legacyVehMonthly + (b.opt3_callboxes * doorkingMonthlyFee);

    // OPTION 4: Simplify & Remove
    opt4CapEx += legacyVehSetup + 
                 (b.opt4_removeHardware * costRemoveHardware) +
                 (b.opt4_pushbars * costPushbar) + 
                 (b.opt4_pushbarsWithRimLock * costRimLock) + 
                 (b.opt4_maglockCovers * costMaglockCover) + 
                 (b.opt4_maglocksToReplace * costMaglockReplace) + 
                 (b.opt4_callboxes * costCallBoxTest);
    opt4OpEx += legacyVehMonthly + (b.opt4_callboxes * doorkingMonthlyFee);
  });

  const safeUnits = totalUnits > 0 ? totalUnits : 1;
  const opt1CPU = (opt1OpEx / safeUnits).toFixed(2);
  const opt2CPU = (opt2OpEx / safeUnits).toFixed(2);
  const opt3CPU = (opt3OpEx / safeUnits).toFixed(2);
  const opt4CPU = (opt4OpEx / safeUnits).toFixed(2);

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

                    {/* Scope Editor */}
                    <div className="bg-black/40 p-1 rounded-2xl border border-white/5 shadow-inner">
                      <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden border-b border-white/5 p-2 gap-2">
                        <button onClick={() => setActiveScopeTab('opt1')} className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all ${activeScopeTab === 'opt1' ? 'bg-cyan-900/30 text-cyan-400 shadow-sm border border-cyan-500/20' : 'text-zinc-500 hover:bg-white/5'}`}>Opt 1 (GG)</button>
                        <button onClick={() => setActiveScopeTab('opt2')} className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all ${activeScopeTab === 'opt2' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:bg-white/5'}`}>Opt 2</button>
                        <button onClick={() => setActiveScopeTab('opt3')} className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all ${activeScopeTab === 'opt3' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:bg-white/5'}`}>Opt 3</button>
                        <button onClick={() => setActiveScopeTab('opt4')} className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all ${activeScopeTab === 'opt4' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:bg-white/5'}`}>Opt 4</button>
                      </div>

                      <div className="p-4">
                        
                        {/* REUSABLE HARDWARE INPUTS (Rendered conditionally per tab) */}
                        <div className="animate-[fadeIn_0.2s_ease-out] space-y-5">
                          <div className="border-b border-white/5 pb-2">
                            <span className="text-sm font-bold text-white block">
                              {activeScopeTab === 'opt1' && "Option 1: Your Gate Guard"}
                              {activeScopeTab === 'opt2' && "Option 2: Re-Structure"}
                              {activeScopeTab === 'opt3' && "Option 3: Keep and Reduce"}
                              {activeScopeTab === 'opt4' && "Option 4: Simplify & Remove"}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* General Removals / Configurations */}
                            <div className="space-y-4">
                              {activeScopeTab === 'opt4' && (
                                <div>
                                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1.5 block">Remove Existing Hardware (${costRemoveHardware})</span>
                                  <input type="number" min="0" value={b.opt4_removeHardware} onChange={(e) => handleUpdateBuilding(b.id, 'opt4_removeHardware', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                                </div>
                              )}
                              
                              {activeScopeTab === 'opt3' && (
                                <div>
                                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1.5 block">Set Door as Egress Only (${costSetEgress})</span>
                                  <input type="number" min="0" value={b.opt3_setEgress} onChange={(e) => handleUpdateBuilding(b.id, 'opt3_setEgress', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                                </div>
                              )}

                              {activeScopeTab === 'opt1' ? (
                                <div>
                                  <span className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-widest mb-1.5 block">Convert Callbox to App (${opt1_callboxConvertSetup})</span>
                                  <input type="number" min="0" value={b.opt1_convertCallbox} onChange={(e) => handleUpdateBuilding(b.id, 'opt1_convertCallbox', Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                                </div>
                              ) : (
                                <div>
                                  <span className="text-[10px] text-blue-400/80 font-bold uppercase tracking-widest mb-1.5 block">Callboxes to Test (${costCallBoxTest})</span>
                                  <input type="number" min="0" value={b[`${activeScopeTab}_callboxes` as keyof BuildingConfig]} onChange={(e) => handleUpdateBuilding(b.id, `${activeScopeTab}_callboxes` as keyof BuildingConfig, Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                                </div>
                              )}
                            </div>

                            {/* Egress Strategy */}
                            <div className="space-y-4 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                              <div>
                                <span className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-widest mb-1.5 block">Add Pushbar & Plate (${costPushbar})</span>
                                <input type="number" min="0" value={b[`${activeScopeTab}_pushbars` as keyof BuildingConfig]} onChange={(e) => handleUpdateBuilding(b.id, `${activeScopeTab}_pushbars` as keyof BuildingConfig, Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-emerald-500" />
                              </div>
                              <div className="pl-4 border-l-2 border-emerald-500/20">
                                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 block">↳ Add Rim Lock for Access (${costRimLock})</span>
                                <input type="number" min="0" max={b[`${activeScopeTab}_pushbars` as keyof BuildingConfig]} value={b[`${activeScopeTab}_pushbarsWithRimLock` as keyof BuildingConfig]} onChange={(e) => handleUpdateBuilding(b.id, `${activeScopeTab}_pushbarsWithRimLock` as keyof BuildingConfig, Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2 text-white font-bold outline-none focus:border-emerald-500" />
                              </div>
                            </div>

                            {/* Maglock Strategy */}
                            <div className="space-y-4 bg-white/[0.02] p-3 rounded-xl border border-white/5 md:col-span-2">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1.5 block">Keep Maglock + Add Cover (${costMaglockCover})</span>
                                  <input type="number" min="0" value={b[`${activeScopeTab}_maglockCovers` as keyof BuildingConfig]} onChange={(e) => handleUpdateBuilding(b.id, `${activeScopeTab}_maglockCovers` as keyof BuildingConfig, Number(e.target.value))} className="w-full bg-[#1A1A24] border border-white/5 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                                </div>
                                <div>
                                  <span className="text-[10px] text-red-400/80 font-bold uppercase tracking-widest mb-1.5 block">Needs Maglock Replace (+${costMaglockReplace})</span>
                                  <input type="number" min="0" max={b[`${activeScopeTab}_maglockCovers` as keyof BuildingConfig]} value={b[`${activeScopeTab}_maglocksToReplace` as keyof BuildingConfig]} onChange={(e) => handleUpdateBuilding(b.id, `${activeScopeTab}_maglocksToReplace` as keyof BuildingConfig, Number(e.target.value))} className="w-full bg-red-900/10 border border-red-500/20 rounded-lg p-2.5 text-red-100 font-bold outline-none focus:border-red-500" />
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>

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

        {/* RIGHT PANEL: COMPARISON MATRIX & GLOSSARY */}
        <div className="lg:w-1/2 bg-[#050505] p-8 lg:p-12 relative">
          <div className="sticky top-[100px] space-y-8 max-h-[calc(100vh-120px)] overflow-y-auto [&::-webkit-scrollbar]:hidden pb-20">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-3xl font-black tracking-tight text-white mb-2">Comparison Matrix</h2>
              <p className="text-zinc-500 text-sm">Review the 4 deployment strategies mapped to your building inputs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Option 1 (Hero Option) Matrix Card */}
              <div className={`md:col-span-2 bg-[#0D0D12] border-2 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.1)] relative transition-all ${activeScopeTab === 'opt1' ? 'border-cyan-400 scale-[1.02] z-10' : 'border-cyan-900/40 opacity-90'}`}>
                <div className="absolute top-0 right-0 bg-cyan-500 text-[#0A0A0C] text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-lg shadow-sm">Recommended</div>
                <div className="bg-cyan-900/20 p-5 border-b border-cyan-500/20">
                  <h3 className="text-base font-black uppercase tracking-widest text-cyan-400">Opt 1: Your Gate Guard</h3>
                </div>
                <div className="p-6 flex justify-between items-center gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-cyan-500/70 font-bold">Setup</p>
                    <p className="text-2xl font-mono font-black text-white">${opt1CapEx.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-cyan-500/70 font-bold">Flat OpEx</p>
                    <p className="text-2xl font-mono font-black text-cyan-400">${opt1OpEx.toLocaleString()}</p>
                    <p className="text-[10px] text-cyan-500/70 font-medium mt-1">CPU: ${opt1CPU}</p>
                  </div>
                </div>
                <div className="bg-emerald-900/20 text-emerald-400 p-3 text-center border-t border-emerald-500/30">
                  <p className="text-[10px] uppercase tracking-widest font-bold">✓ Hardware Maintained & App Access Included</p>
                </div>
              </div>

              {/* Option 2 Matrix Card */}
              <div className={`bg-[#0A0A0C] border rounded-xl overflow-hidden shadow-lg transition-all ${activeScopeTab === 'opt2' ? 'border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.05)] scale-[1.02]' : 'border-white/5 opacity-70 hover:opacity-100'}`}>
                <div className="bg-zinc-900/50 p-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white">Opt 2: Re-Structure</h3>
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

              {/* Option 3 Matrix Card */}
              <div className={`bg-[#0A0A0C] border rounded-xl overflow-hidden shadow-lg transition-all ${activeScopeTab === 'opt3' ? 'border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.05)] scale-[1.02]' : 'border-white/5 opacity-70 hover:opacity-100'}`}>
                <div className="bg-zinc-900/50 p-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white">Opt 3: Keep & Reduce</h3>
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

              {/* Option 4 Matrix Card */}
              <div className={`bg-[#0A0A0C] border rounded-xl overflow-hidden shadow-lg transition-all ${activeScopeTab === 'opt4' ? 'border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.05)] scale-[1.02]' : 'border-white/5 opacity-70 hover:opacity-100'}`}>
                <div className="bg-zinc-900/50 p-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white">Opt 4: Simplify & Remove</h3>
                </div>
                <div className="p-4 border-b border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">CapEx</p>
                    <p className="text-sm font-mono font-black text-white">${opt4CapEx.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">OpEx</p>
                    <div className="text-right">
                      <p className="text-sm font-mono font-black text-white">${opt4OpEx.toLocaleString()}</p>
                      <p className="text-[8px] text-zinc-500 font-medium">CPU: ${opt4CPU}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="bg-red-900/10 p-3 rounded-lg text-center border border-red-900/30">
               <p className="text-[10px] uppercase tracking-widest font-bold text-red-500">⚠️ Legacy Options (2-4) Bill Future Repairs Individually</p>
            </div>

            {/* DYNAMIC SOW SECTION */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 mt-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Strategy & Scope Notes
              </h3>
              
              {activeScopeTab === 'opt1' && (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                  <div>
                    <h4 className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1">Option 1: Your Gate Guard</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">In this option, we will convert callboxes to App Only Interfaces with a keypad for emergency services, along with keeping the existing Knox box. All doors will be changed to either have a Steel cover over the existing mag lock structure to eliminate vandalism, or (preferred) we will add a steel plate and panic bar along with a protected strike plate to conform with ADA and NFPA safety guidelines for egress. In addition, all doors will be accessible by app for residents. We eliminate the need for Doorking Fees.</p>
                  </div>
                </div>
              )}

              {activeScopeTab === 'opt2' && (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">Option 2: Re-Structure</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">In this option, we will keep callboxes in their current configuration. All doors will be changed to either have a Steel cover over the existing mag lock structure to eliminate vandalism, or (preferred) we will add a steel plate and panic bar along with a protected strike plate to conform with ADA and NFPA safety guidelines for egress. Access Control for these areas will remain the same. Monthly fees will continue to be billed from Doorking at an estimated rate of $160 per callbox.</p>
                  </div>
                </div>
              )}

              {activeScopeTab === 'opt3' && (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">Option 3: Keep and Reduce</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">In this option, we will keep callboxes in their current configuration. All doors will be changed to either have a Steel cover over the existing mag lock structure to eliminate vandalism, or (preferred) we will add a steel plate and panic bar along with a protected strike plate to conform with ADA and NFPA safety guidelines for egress. Access Control will be reduced to only doors with callboxes and others will be egress only. Monthly fees will continue to be billed from Doorking at an estimated rate of $160 per callbox.</p>
                  </div>
                </div>
              )}

              {activeScopeTab === 'opt4' && (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">Option 4: Simplify & Remove</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">In this option, we will power down interior parking callboxes and only keep the street-facing callboxes in their current configuration. All parking lot facing doors will be removed along with any access control hardware. Only street-facing doors will be changed to either have a Steel cover over the existing mag lock structure to eliminate vandalism, or (preferred) we will add a steel plate and panic bar along with a protected strike plate to conform with ADA and NFPA safety guidelines for egress. Access Control will be reduced to only doors with callboxes that are street-facing, and others will be open entry/exit. Monthly fees will continue to be billed from Doorking at an estimated rate of $160 per working callbox.</p>
                  </div>
                </div>
              )}
            </div>

            {/* GLOSSARY & DEFINITIONS SECTION */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 mt-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-2">Glossary & Definitions</h3>
              
              <div className="space-y-8">
                {/* Pushbar */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-32 h-24 shrink-0 relative rounded-lg overflow-hidden border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://lockeyusa.com/wp-content/uploads/2022/07/Advantage-Fence-IMage-with-Strike-Bracket-rev.jpg" alt="Pushbar & Plate" className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-bold uppercase tracking-widest">New Pushbar & Plate</h4>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">A panic bar and protective mounting plate installed on pedestrian gates to allow free, compliant exiting without requiring prior knowledge or special effort, meeting NFPA and ADA standards.</p>
                  </div>
                </div>

                {/* Rimlock */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-32 h-24 shrink-0 relative rounded-lg overflow-hidden border border-white/10 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://www.tymetal.com/wp-content/uploads/2024/04/2150-style-b-banner_450x.jpg" alt="Rimlock & Cover" className="object-contain w-full h-full" />
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-bold uppercase tracking-widest">Rimlock & Steel Cover</h4>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">A surface-mounted lock mechanism protected by a heavy-duty steel shroud to prevent physical tampering or reaching through the gate bars to actuate the lock from the outside.</p>
                  </div>
                </div>

                {/* Keep Maglock */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-32 h-24 shrink-0 relative rounded-lg overflow-hidden border border-white/10 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://www.tymetal.com/wp-content/uploads/2024/04/2150-style-b-banner_450x.jpg" alt="Maglock Cover" className="object-contain w-full h-full" />
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-bold uppercase tracking-widest">Keep Mag Lock</h4>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">In this option, instead of adding a crash bar, you can keep existing gate hardware and put a heavy-duty steel cover over the mag locking device to prevent physical tampering.</p>
                  </div>
                </div>

                {/* Text Only Definitions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                  <div>
                    <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-1">Set Door as Egress Only</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">We remove access control for this entryway and make it a secured exit (egress) only.</p>
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-1">Callboxes to Test</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">We test the callboxes both for functionality but also for compliance with EMS, ensuring the office can seamlessly communicate with the system.</p>
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-1">CapEx (Capital Expenditure)</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">The upfront, one-time costs to purchase and install physical hardware, infrastructure, or major upgrades.</p>
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-1">OpEx (Operational Expenditure)</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">The ongoing, predictable monthly or annual costs for running the system (e.g., software subscriptions, active maintenance).</p>
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-1">Break-Fix</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">A reactive maintenance model where repairs are only performed after a component fails, resulting in unpredictable CapEx spikes and extended system downtime.</p>
                  </div>
                  <div>
                    <h4 className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">Your Gate Guard Service</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">A proactive, fully-managed access control service that absorbs physical hardware maintenance, provides modern app-based entry, and ensures high system uptime for a predictable flat monthly fee.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
