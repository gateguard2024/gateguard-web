"use client";
import React, { useState } from 'react';
import Image from 'next/image';

type BuildingConfig = {
  id: string;
  buildingNumber: string;
  units: number;
  vehicleGates: number;
  vehicleGatesRepair: number;
  pedGates: number;
  pedGatesRepair: number;
  callBoxes: number;
  useMagLockCover: boolean;
};

export default function PricingStationCalculator() {
  const [buildings, setBuildings] = useState<BuildingConfig[]>([
    { 
      id: '1', buildingNumber: '', units: 250, 
      vehicleGates: 2, vehicleGatesRepair: 0, 
      pedGates: 2, pedGatesRepair: 0, 
      callBoxes: 1, useMagLockCover: false
    }
  ]);
  
  // Base Hardware Pricing Assumptions
  const callBoxTestFee = 150;
  const doorkingMonthlyFee = 160;
  const costPushbarWithPlates = 500;
  const costMagLockCover = 200; 
  const costStrikeProtector = 150;
  const costAccessControlUpgrade = 300; 
  const gateRepairCapEx = 250; 

  // --- CRUD HANDLERS ---
  const handleAddBuilding = () => {
    setBuildings([...buildings, { 
      id: Date.now().toString(), buildingNumber: '', units: 250, 
      vehicleGates: 2, vehicleGatesRepair: 0, 
      pedGates: 2, pedGatesRepair: 0, 
      callBoxes: 1, useMagLockCover: false
    }]);
  };

  const handleRemoveBuilding = (idToRemove: string) => {
    if (buildings.length === 1) return; 
    setBuildings(buildings.filter(b => b.id !== idToRemove));
  };

  const handleUpdateBuilding = (id: string, field: keyof BuildingConfig, value: string | number | boolean) => {
    setBuildings(buildings.map(b => {
      if (b.id !== id) return b;
      const updated = { ...b, [field]: value } as BuildingConfig;
      
      // Safety checks for repairs
      if (field === 'vehicleGates' && updated.vehicleGatesRepair > updated.vehicleGates) updated.vehicleGatesRepair = updated.vehicleGates;
      if (field === 'vehicleGatesRepair' && updated.vehicleGatesRepair > updated.vehicleGates) updated.vehicleGatesRepair = updated.vehicleGates;
      if (field === 'pedGates' && updated.pedGatesRepair > updated.pedGates) updated.pedGatesRepair = updated.pedGates;
      if (field === 'pedGatesRepair' && updated.pedGatesRepair > updated.pedGates) updated.pedGatesRepair = updated.pedGates;

      return updated;
    }));
  };

  // --- AGGREGATE MATH FOR THE 4 OPTIONS ---
  let totalUnits = 0;
  
  // Option 1-3 Shared Variables
  let legacyVehSetup = 0;
  let legacyVehMonthly = 0;
  let legacyCallboxSetup = 0;
  let legacyDoorkingMonthly = 0;

  // Option Specific Pedestrian CapEx
  let opt1PedCapEx = 0;
  let opt2PedCapEx = 0;
  let opt3PedCapEx = 0;

  // Option 4 Variables
  let opt4Setup = 0;
  let opt4Monthly = 0;

  buildings.forEach(b => {
    totalUnits += b.units;
    
    const vWorking = b.vehicleGates - b.vehicleGatesRepair;
    const vRepair = b.vehicleGatesRepair;
    const pWorking = b.pedGates - b.pedGatesRepair;
    const pRepair = b.pedGatesRepair;

    // --- LEGACY MATH (Options 1, 2, 3) ---
    legacyVehSetup += (vWorking * 500) + (vRepair * 6750);
    legacyVehMonthly += (b.vehicleGates * 150) + (vRepair * 250);
    legacyCallboxSetup += (b.callBoxes * callBoxTestFee);
    legacyDoorkingMonthly += (b.callBoxes * doorkingMonthlyFee);

    const baseEgressCost = b.useMagLockCover ? costMagLockCover : costPushbarWithPlates;
    const repairCosts = (pRepair * gateRepairCapEx);

    opt1PedCapEx += (b.pedGates * baseEgressCost) + repairCosts;
    opt2PedCapEx += (b.pedGates * (baseEgressCost + costStrikeProtector)) + repairCosts;
    opt3PedCapEx += (b.pedGates * (baseEgressCost + costStrikeProtector + costAccessControlUpgrade)) + repairCosts;

    // --- GATE GUARD MATH (Option 4) ---
    opt4Setup += (vWorking * 500) + (vRepair * 6750) + (pWorking * 500) + (pRepair * 6750);
    opt4Monthly += (b.vehicleGates * 150) + (vRepair * 250) + (b.pedGates * 125) + (pRepair * 250);
  });

  const hasUnnamedBuildings = buildings.some(b => b.buildingNumber.trim() === '');

  return (
    <main className="min-h-screen bg-[#0A0A0C] text-white font-sans selection:bg-cyan-500/30">
      
      {/* Background styling */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-50"></div>
      
      {/* Header */}
      <header className="p-6 border-b border-white/5 bg-[#0A0A0C]/80 backdrop-blur-xl sticky top-0 z-50 flex items-center gap-6">
        <Image src="/logo.png" alt="Gate Guard" width={48} height={48} className="object-contain" />
        <div className="border-l border-white/10 pl-6">
          <h1 className="text-xl font-black uppercase italic tracking-tighter leading-none">Gate Guard</h1>
          <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-cyan-500">Access Control Estimator</h2>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row relative z-10">
        
        {/* LEFT PANEL: DATA INTAKE */}
        <div className="lg:w-1/2 p-8 lg:p-12 border-r border-white/5">
          <div className="mb-10">
            <h2 className="text-3xl font-black tracking-tight mb-2">Building <span className="text-cyan-400">Intake</span></h2>
            <p className="text-zinc-500 text-sm">Enter the physical gate and door data for each building.</p>
          </div>

          <div className="space-y-8">
            {buildings.map((b, index) => {
              const isUnnamed = b.buildingNumber.trim() === '';
              
              return (
                <div key={b.id} className={`bg-white/[0.02] backdrop-blur-md border rounded-3xl p-6 transition-all shadow-xl ${isUnnamed ? 'border-red-900/30' : 'border-white/10 hover:border-cyan-500/30'}`}>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-4 mb-6 gap-4">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
                        {index + 1}
                      </div>
                      <input 
                        type="text" 
                        placeholder="Enter Building Number..."
                        value={b.buildingNumber} 
                        onChange={(e) => handleUpdateBuilding(b.id, 'buildingNumber', e.target.value)}
                        className="bg-transparent text-xl font-bold outline-none border-b-2 pb-1 w-full transition-all border-transparent focus:border-cyan-500 placeholder:text-zinc-600"
                      />
                    </div>
                    {buildings.length > 1 && (
                      <button onClick={() => handleRemoveBuilding(b.id)} className="text-zinc-500 hover:text-red-500 text-xs font-bold uppercase tracking-widest bg-black/30 px-3 py-1.5 rounded-lg border border-white/5 whitespace-nowrap">
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Units */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase">Total Living Units</label>
                        <span className="text-cyan-400 font-black text-sm">{b.units}</span>
                      </div>
                      <input type="range" min="10" max="1000" step="10" value={b.units} onChange={(e) => handleUpdateBuilding(b.id, 'units', Number(e.target.value))} className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                    </div>
                    
                    {/* Vehicle Gates */}
                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                      <label className="text-zinc-300 font-bold text-[11px] tracking-widest uppercase block mb-3">Vehicle Gates</label>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 block">Total Count</span>
                          <input type="number" min="0" value={b.vehicleGates} onChange={(e) => handleUpdateBuilding(b.id, 'vehicleGates', Number(e.target.value))} className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                        </div>
                        <div className="flex-1">
                          <span className="text-[9px] text-red-400/80 font-bold uppercase tracking-widest mb-1.5 block">Needs Repair</span>
                          <input type="number" min="0" max={b.vehicleGates} value={b.vehicleGatesRepair} onChange={(e) => handleUpdateBuilding(b.id, 'vehicleGatesRepair', Number(e.target.value))} className="w-full bg-red-900/10 border border-red-500/20 rounded-lg p-2.5 text-red-100 font-bold outline-none focus:border-red-500" />
                        </div>
                      </div>
                    </div>

                    {/* Pedestrian Doors & Callboxes */}
                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                      <label className="text-zinc-300 font-bold text-[11px] tracking-widest uppercase block mb-3">Pedestrian Hardware & Access</label>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 block">Total Doors</span>
                          <input type="number" min="0" value={b.pedGates} onChange={(e) => handleUpdateBuilding(b.id, 'pedGates', Number(e.target.value))} className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white font-bold outline-none focus:border-cyan-500" />
                        </div>
                        <div>
                          <span className="text-[9px] text-red-400/80 font-bold uppercase tracking-widest mb-1.5 block">Needs Repair</span>
                          <input type="number" min="0" max={b.pedGates} value={b.pedGatesRepair} onChange={(e) => handleUpdateBuilding(b.id, 'pedGatesRepair', Number(e.target.value))} className="w-full bg-red-900/10 border border-red-500/20 rounded-lg p-2.5 text-red-100 font-bold outline-none focus:border-red-500" />
                        </div>
                        <div>
                          <span className="text-[9px] text-blue-400/80 font-bold uppercase tracking-widest mb-1.5 block">Call Boxes</span>
                          <input type="number" min="0" value={b.callBoxes} onChange={(e) => handleUpdateBuilding(b.id, 'callBoxes', Number(e.target.value))} className="w-full bg-blue-900/10 border border-blue-500/20 rounded-lg p-2.5 text-blue-100 font-bold outline-none focus:border-blue-500" />
                        </div>
                      </div>

                      {/* Mag Lock Toggle */}
                      <div className="flex items-center gap-3 pt-2 border-t border-white/5 mt-2">
                        <input 
                          type="checkbox" 
                          id={`maglock-${b.id}`}
                          checked={b.useMagLockCover}
                          onChange={(e) => handleUpdateBuilding(b.id, 'useMagLockCover', e.target.checked)}
                          className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                        />
                        <label htmlFor={`maglock-${b.id}`} className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                          Use Protective Mag Lock Covers Instead of Pushbars
                        </label>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={handleAddBuilding} className="mt-8 w-full py-4 bg-white/[0.02] border-2 border-dashed border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 rounded-2xl text-zinc-500 hover:text-cyan-400 transition-all font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
            <span>+ Add Another Building</span>
          </button>
        </div>

        {/* RIGHT PANEL: 4-WAY COMPARISON MATRIX */}
        <div className="lg:w-1/2 bg-[#050505] p-8 lg:p-12">
          <div className="sticky top-[100px]">
            <div className="mb-10">
              <h2 className="text-3xl font-black tracking-tight mb-2">Comparison <span className="text-cyan-400">Matrix</span></h2>
              <p className="text-zinc-500 text-sm">Review the 4 deployment strategies side-by-side.</p>
            </div>

            <div className="space-y-6">
              
              {/* Option 1 */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-zinc-900/50 p-4 border-b border-white/5">
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Option 1: Remove Interior</h3>
                  <p className="text-[10px] text-zinc-400 mt-1">Install new pushbars/plates, test callboxes.</p>
                </div>
                <div className="p-5 flex justify-between items-center gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Upfront CapEx</p>
                    <p className="text-lg font-mono font-bold">${(legacyVehSetup + legacyCallboxSetup + opt1PedCapEx).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Monthly OpEx</p>
                    <p className="text-lg font-mono font-bold">${(legacyVehMonthly + legacyDoorkingMonthly).toLocaleString()}</p>
                    <p className="text-[8px] text-zinc-500">Includes $160/mo DoorKing fee</p>
                  </div>
                </div>
                <div className="bg-red-900/10 border-t border-red-900/30 p-3 text-center">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-red-400">⚠️ Future Hardware Repairs Billed Individually</p>
                </div>
              </div>

              {/* Option 2 */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-zinc-900/50 p-4 border-b border-white/5">
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Option 2: Mixed Access</h3>
                  <p className="text-[10px] text-zinc-400 mt-1">Keep existing doors, add strike protectors.</p>
                </div>
                <div className="p-5 flex justify-between items-center gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Upfront CapEx</p>
                    <p className="text-lg font-mono font-bold">${(legacyVehSetup + legacyCallboxSetup + opt2PedCapEx).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Monthly OpEx</p>
                    <p className="text-lg font-mono font-bold">${(legacyVehMonthly + legacyDoorkingMonthly).toLocaleString()}</p>
                    <p className="text-[8px] text-zinc-500">Includes $160/mo DoorKing fee</p>
                  </div>
                </div>
                <div className="bg-red-900/10 border-t border-red-900/30 p-3 text-center">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-red-400">⚠️ Future Hardware Repairs Billed Individually</p>
                </div>
              </div>

              {/* Option 3 */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-zinc-900/50 p-4 border-b border-white/5">
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Option 3: Full Access Control</h3>
                  <p className="text-[10px] text-zinc-400 mt-1">Keep doors, upgrade all to full access.</p>
                </div>
                <div className="p-5 flex justify-between items-center gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Upfront CapEx</p>
                    <p className="text-lg font-mono font-bold">${(legacyVehSetup + legacyCallboxSetup + opt3PedCapEx).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Monthly OpEx</p>
                    <p className="text-lg font-mono font-bold">${(legacyVehMonthly + legacyDoorkingMonthly).toLocaleString()}</p>
                    <p className="text-[8px] text-zinc-500">Includes $160/mo DoorKing fee</p>
                  </div>
                </div>
                <div className="bg-red-900/10 border-t border-red-900/30 p-3 text-center">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-red-400">⚠️ Future Hardware Repairs Billed Individually</p>
                </div>
              </div>

              {/* Option 4 (Hero Option) */}
              <div className="bg-cyan-900/10 border border-cyan-500/40 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)] relative">
                <div className="absolute top-0 right-0 bg-cyan-500 text-black text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg">Recommended</div>
                <div className="bg-cyan-900/20 p-4 border-b border-cyan-500/20">
                  <h3 className="text-sm font-black uppercase tracking-widest text-cyan-400">Option 4: Gate Guard SaaS</h3>
                  <p className="text-[10px] text-cyan-100/70 mt-1">Full app integration. Callboxes eliminated.</p>
                </div>
                <div className="p-5 flex justify-between items-center gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-cyan-500/70 font-bold">Upfront Setup</p>
                    <p className="text-xl font-mono font-black text-white">${opt4Setup.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-cyan-500/70 font-bold">Monthly OpEx</p>
                    <p className="text-xl font-mono font-black text-cyan-400">${opt4Monthly.toLocaleString()}</p>
                    <p className="text-[8px] text-cyan-500/50">Predictable Flat Rate</p>
                  </div>
                </div>
                <div className="bg-emerald-900/20 border-t border-emerald-500/30 p-3 text-center">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-emerald-400">✓ All Hardware Maintenance & 99% Uptime SLA Included</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
