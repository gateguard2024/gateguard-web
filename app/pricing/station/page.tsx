"use client";
import React, { useState } from 'react';
import Image from 'next/image';

type BuildingConfig = {
  id: string;
  buildingNumber: string;
  units: number;
  vehicleGates: number;
  vehicleGatesRepair: number;
  
  // Detailed Pedestrian Inputs
  totalPedDoors: number;
  doorsToRemoveHardware: number;
  doorsToInstallPushbar: number;
  doorsToInstallRimLock: number;
  callboxesToTest: number; // Includes main gate and ped callboxes
};

export default function PricingStationCalculator() {
  const [buildings, setBuildings] = useState<BuildingConfig[]>([
    { 
      id: '1', buildingNumber: '', units: 250, 
      vehicleGates: 2, vehicleGatesRepair: 0, 
      totalPedDoors: 2, doorsToRemoveHardware: 1, 
      doorsToInstallPushbar: 1, doorsToInstallRimLock: 1,
      callboxesToTest: 2
    }
  ]);
  
  // Base Hardware Pricing Assumptions (You can adjust these)
  const costRemoveHardware = 150;
  const costPushbarWithPlates = 500;
  const costRimLockWithCover = 350;
  const costCallBoxTest = 150;
  const doorkingMonthlyFee = 160;
  
  const costAccessControlUpgrade = 300; 
  const gateRepairCapEx = 250; 

  // --- CRUD HANDLERS ---
  const handleAddBuilding = () => {
    setBuildings([...buildings, { 
      id: Date.now().toString(), buildingNumber: '', units: 250, 
      vehicleGates: 2, vehicleGatesRepair: 0, 
      totalPedDoors: 2, doorsToRemoveHardware: 0, 
      doorsToInstallPushbar: 0, doorsToInstallRimLock: 0,
      callboxesToTest: 1
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
      
      // Safety checks for repairs
      if (field === 'vehicleGates' && updated.vehicleGatesRepair > updated.vehicleGates) updated.vehicleGatesRepair = updated.vehicleGates;
      if (field === 'vehicleGatesRepair' && updated.vehicleGatesRepair > updated.vehicleGates) updated.vehicleGatesRepair = updated.vehicleGates;

      return updated;
    }));
  };

  // --- AGGREGATE MATH FOR THE 4 OPTIONS ---
  let totalUnits = 0;
  
  // Legacy / Vehicle Shared Variables
  let legacyVehSetup = 0;
  let legacyVehMonthly = 0;
  
  // Option 1 Specifics
  let opt1PedCapEx = 0;
  let legacyCallboxSetup = 0;
  let legacyDoorkingMonthly = 0;

  // Option 2 & 3 Approximations (Using the detailed inputs to estimate the rest)
  let opt2PedCapEx = 0;
  let opt3PedCapEx = 0;

  // Option 4 Variables
  let opt4Setup = 0;
  let opt4Monthly = 0;

  buildings.forEach(b => {
    totalUnits += b.units;
    
    const vWorking = b.vehicleGates - b.vehicleGatesRepair;
    const vRepair = b.vehicleGatesRepair;

    // --- VEHICLE MATH ---
    legacyVehSetup += (vWorking * 500) + (vRepair * 6750);
    legacyVehMonthly += (b.vehicleGates * 150) + (vRepair * 250);

    // --- OPTION 1: GRANULAR LINE ITEMS ---
    const removeHardwareCost = b.doorsToRemoveHardware * costRemoveHardware;
    const pushbarCost = b.doorsToInstallPushbar * costPushbarWithPlates;
    const rimLockCost = b.doorsToInstallRimLock * costRimLockWithCover;
    
    legacyCallboxSetup += (b.callboxesToTest * costCallBoxTest);
    legacyDoorkingMonthly += (b.callboxesToTest * doorkingMonthlyFee);

    opt1PedCapEx += removeHardwareCost + pushbarCost + rimLockCost;

    // --- OPTION 2 & 3: ESTIMATED BASED ON TOTAL DOORS ---
    // Assuming base costs for keeping doors + strike protectors / full access
    opt2PedCapEx += (b.totalPedDoors * (costPushbarWithPlates + 150)); 
    opt3PedCapEx += (b.totalPedDoors * (costPushbarWithPlates + 150 + costAccessControlUpgrade));

    // --- GATE GUARD MATH (Option 4) ---
    // App based, no callbox fees. Standard setup per door/gate.
    opt4Setup += (vWorking * 500) + (vRepair * 6750) + (b.totalPedDoors * 500);
    opt4Monthly += (b.vehicleGates * 150) + (vRepair * 250) + (b.totalPedDoors * 125);
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Header - Corporate Columbia Residential Styling */}
      <header className="p-6 border-b border-slate-200 bg-white sticky top-0 z-50 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          {/* Replace with Columbia Logo in production */}
          <div className="w-12 h-12 bg-blue-900 text-white flex items-center justify-center font-bold text-xl rounded">
            CR
          </div>
          <div className="border-l border-slate-300 pl-6">
            <h1 className="text-xl font-bold uppercase tracking-tight text-blue-900 leading-none">Columbia Residential</h1>
            <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 mt-1">Access Control Estimator</h2>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row relative z-10">
        
        {/* LEFT PANEL: DATA INTAKE */}
        <div className="lg:w-1/2 p-8 lg:p-12 border-r border-slate-200 bg-white shadow-[10px_0_20px_rgba(0,0,0,0.02)] z-20">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-blue-950 mb-2">Building Intake</h2>
            <p className="text-slate-500 text-sm">Enter the physical gate and granular hardware requirements per building.</p>
          </div>

          <div className="space-y-8">
            {buildings.map((b, index) => {
              const isUnnamed = b.buildingNumber.trim() === '';
              
              return (
                <div key={b.id} className={`bg-slate-50 border rounded-2xl p-6 transition-all ${isUnnamed ? 'border-red-300' : 'border-slate-200'}`}>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-slate-200 pb-4 mb-6 gap-4">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-blue-900 text-white shrink-0">
                        {index + 1}
                      </div>
                      <input 
                        type="text" 
                        placeholder="Enter Building Number..."
                        value={b.buildingNumber} 
                        onChange={(e) => handleUpdateBuilding(b.id, 'buildingNumber', e.target.value)}
                        className="bg-transparent text-xl font-bold outline-none border-b-2 border-transparent focus:border-blue-900 pb-1 w-full transition-all placeholder:text-slate-400 text-slate-900"
                      />
                    </div>
                    {buildings.length > 1 && (
                      <button onClick={() => handleRemoveBuilding(b.id)} className="text-slate-500 hover:text-red-600 text-xs font-bold uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-slate-200 whitespace-nowrap shadow-sm">
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Units */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-slate-600 font-bold text-[10px] tracking-widest uppercase">Total Living Units</label>
                        <span className="text-blue-900 font-black text-sm">{b.units}</span>
                      </div>
                      <input type="range" min="10" max="1000" step="10" value={b.units} onChange={(e) => handleUpdateBuilding(b.id, 'units', Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900" />
                    </div>
                    
                    {/* Vehicle Gates */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <label className="text-blue-950 font-bold text-[11px] tracking-widest uppercase block mb-3 border-b border-slate-100 pb-2">Vehicle Gates</label>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1.5 block">Total Count</span>
                          <input type="number" min="0" value={b.vehicleGates} onChange={(e) => handleUpdateBuilding(b.id, 'vehicleGates', Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-bold outline-none focus:border-blue-900" />
                        </div>
                        <div className="flex-1">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1.5 block">Needs Repair</span>
                          <input type="number" min="0" max={b.vehicleGates} value={b.vehicleGatesRepair} onChange={(e) => handleUpdateBuilding(b.id, 'vehicleGatesRepair', Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-bold outline-none focus:border-blue-900" />
                        </div>
                      </div>
                    </div>

                    {/* Granular Pedestrian Inputs */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-end border-b border-slate-100 pb-2 mb-4">
                        <label className="text-blue-950 font-bold text-[11px] tracking-widest uppercase block">Pedestrian Hardware</label>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Total Doors:</span>
                          <input type="number" min="0" value={b.totalPedDoors} onChange={(e) => handleUpdateBuilding(b.id, 'totalPedDoors', Number(e.target.value))} className="w-12 bg-slate-50 border border-slate-200 rounded p-1 text-slate-900 font-bold outline-none text-xs text-center" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1 block">Remove Interior Hardware</span>
                          <input type="number" min="0" value={b.doorsToRemoveHardware} onChange={(e) => handleUpdateBuilding(b.id, 'doorsToRemoveHardware', Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-bold outline-none focus:border-blue-900" />
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1 block">Install Pushbar & Plate</span>
                          <input type="number" min="0" value={b.doorsToInstallPushbar} onChange={(e) => handleUpdateBuilding(b.id, 'doorsToInstallPushbar', Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-bold outline-none focus:border-blue-900" />
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1 block">Install Rim Lock & Cover</span>
                          <input type="number" min="0" value={b.doorsToInstallRimLock} onChange={(e) => handleUpdateBuilding(b.id, 'doorsToInstallRimLock', Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-bold outline-none focus:border-blue-900" />
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1 block">Callboxes to Test (Main+Ped)</span>
                          <input type="number" min="0" value={b.callboxesToTest} onChange={(e) => handleUpdateBuilding(b.id, 'callboxesToTest', Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-bold outline-none focus:border-blue-900" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={handleAddBuilding} className="mt-8 w-full py-4 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-blue-900 hover:bg-blue-50 rounded-xl text-slate-600 hover:text-blue-900 transition-all font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
            <span>+ Add Another Building</span>
          </button>
        </div>

        {/* RIGHT PANEL: 4-WAY COMPARISON MATRIX */}
        <div className="lg:w-1/2 bg-slate-100 p-8 lg:p-12">
          <div className="sticky top-[100px]">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-blue-950 mb-2">Comparison Matrix</h2>
              <p className="text-slate-500 text-sm">Review the 4 deployment strategies side-by-side.</p>
            </div>

            <div className="space-y-6">
              
              {/* Option 1 */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-slate-800 p-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white">Option 1: Remove Interior</h3>
                  <p className="text-[10px] text-slate-300 mt-1">Granular hardware replacement based on intake form.</p>
                </div>
                <div className="p-5 flex justify-between items-center gap-4 border-b border-slate-100">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Upfront CapEx</p>
                    <p className="text-xl font-mono font-black text-slate-900">${(legacyVehSetup + legacyCallboxSetup + opt1PedCapEx).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Monthly OpEx</p>
                    <p className="text-xl font-mono font-black text-slate-900">${(legacyVehMonthly + legacyDoorkingMonthly).toLocaleString()}</p>
                    <p className="text-[9px] text-slate-500 font-medium mt-1">Includes DoorKing fees</p>
                  </div>
                </div>
                <div className="bg-red-50 p-3 text-center border-t border-red-100">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-red-700">⚠️ Future Hardware Repairs Billed Individually</p>
                </div>
              </div>

              {/* Option 2 */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                <div className="bg-slate-700 p-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white">Option 2: Mixed Access</h3>
                  <p className="text-[10px] text-slate-300 mt-1">Keep existing doors, add strike protectors.</p>
                </div>
                <div className="p-5 flex justify-between items-center gap-4 border-b border-slate-100">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Upfront CapEx (Est)</p>
                    <p className="text-lg font-mono font-bold text-slate-900">${(legacyVehSetup + legacyCallboxSetup + opt2PedCapEx).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Monthly OpEx</p>
                    <p className="text-lg font-mono font-bold text-slate-900">${(legacyVehMonthly + legacyDoorkingMonthly).toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-red-50 p-3 text-center border-t border-red-100">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-red-700">⚠️ Future Hardware Repairs Billed Individually</p>
                </div>
              </div>

              {/* Option 3 */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                <div className="bg-slate-700 p-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white">Option 3: Full Access Control</h3>
                  <p className="text-[10px] text-slate-300 mt-1">Keep doors, upgrade all to full access.</p>
                </div>
                <div className="p-5 flex justify-between items-center gap-4 border-b border-slate-100">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Upfront CapEx (Est)</p>
                    <p className="text-lg font-mono font-bold text-slate-900">${(legacyVehSetup + legacyCallboxSetup + opt3PedCapEx).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Monthly OpEx</p>
                    <p className="text-lg font-mono font-bold text-slate-900">${(legacyVehMonthly + legacyDoorkingMonthly).toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-red-50 p-3 text-center border-t border-red-100">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-red-700">⚠️ Future Hardware Repairs Billed Individually</p>
                </div>
              </div>

              {/* Option 4 (Hero Option) */}
              <div className="bg-white border-2 border-blue-900 rounded-xl overflow-hidden shadow-xl relative">
                <div className="absolute top-0 right-0 bg-blue-900 text-white text-[9px] font-bold uppercase tracking-widest px-4 py-1 rounded-bl-lg">Recommended Model</div>
                <div className="bg-blue-50 p-5 border-b border-blue-100">
                  <h3 className="text-base font-black uppercase tracking-widest text-blue-950">Option 4: Gate Guard SaaS</h3>
                  <p className="text-[11px] text-blue-800 mt-1">Full app integration. Callboxes eliminated. Hardware included.</p>
                </div>
                <div className="p-6 flex justify-between items-center gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Upfront Setup</p>
                    <p className="text-2xl font-mono font-black text-blue-950">${opt4Setup.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Predictable Monthly</p>
                    <p className="text-2xl font-mono font-black text-blue-600">${opt4Monthly.toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-blue-900 text-white p-3 text-center">
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
