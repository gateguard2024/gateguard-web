"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function ExecutivePortfolio() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [simulatedInjection, setSimulatedInjection] = useState<number | ''>('');

  // --- DEMO DATA ---
  const baseCash = 42500;
  const injectionAmount = Number(simulatedInjection) || 0;
  const effectiveCash = baseCash + injectionAmount;
  
  const moneyIn = { secure: 18000, unsure: 4500 };
  const totalIn = moneyIn.secure + moneyIn.unsure;

  const moneyOut = { payroll: 12000, partsLabor: 5100, bills: 3200, other: 800 };
  const totalOut = Object.values(moneyOut).reduce((a, b) => a + b, 0);

  const agingReport = { current: 18000, late30: 2500, late60: 1500, late90Plus: 500 };

  const baseWeeklyForecast = [
    { week: 1, date: 'Oct 1 - Oct 7', in: 5000, out: 12000, note: 'Standard Payroll Disbursement' },
    { week: 2, date: 'Oct 8 - Oct 14', in: 9000, out: 2000, note: 'Portfolio Invoices Clear' },
    { week: 3, date: 'Oct 15 - Oct 21', in: 4000, out: 3500, note: 'Hardware & Vendor Payables' },
    { week: 4, date: 'Oct 22 - Oct 28', in: 4500, out: 3600, note: 'Standard Operating Flow' },
  ];

  let runningBalance = effectiveCash;
  const projectedWeeks = baseWeeklyForecast.map(w => {
     const start = runningBalance;
     const end = start + w.in - w.out;
     runningBalance = end; 
     return { ...w, start, end };
  });

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <main className="bg-[#FAFAFA] dark:bg-[#0A0A0A] text-zinc-900 dark:text-zinc-50 min-h-screen font-sans selection:bg-zinc-300 dark:selection:bg-zinc-700 flex flex-col transition-colors duration-500 relative pb-20">
        
        {/* ULTRA-MODERN SUBTLE MESH BACKGROUND */}
        <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

        {/* HEADER: CLEAN, MINIMALIST */}
        <header className="h-24 border-b border-zinc-200 dark:border-white/5 bg-white/60 dark:bg-black/60 backdrop-blur-2xl flex items-center justify-between px-8 lg:px-16 z-50 shrink-0 transition-colors">
          <div className="flex items-center gap-6">
            <Link href="/"><div className="w-12 h-12 bg-zinc-900 dark:bg-white rounded-none flex items-center justify-center text-white dark:text-black font-serif text-xl tracking-tighter">GG</div></Link>
            <div className="w-px h-10 bg-zinc-300 dark:bg-white/10"></div>
            <div>
              <h1 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-white">Executive Portfolio</h1>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">30-Day Strategic Forecast</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="w-12 h-12 rounded-full border border-zinc-200 dark:border-white/10 bg-transparent hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center text-lg"
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <div className="max-w-[1600px] w-full mx-auto px-8 lg:px-16 pt-12 z-10 relative">
          
          {/* TOP ROW: THE BIG 3 & SIMULATOR */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* CARD 1 */}
            <div className="bg-white dark:bg-[#121212] p-8 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm flex flex-col justify-center relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400 mb-2">Liquid Assets</p>
              <h2 className="text-4xl font-light text-zinc-900 dark:text-white tracking-tight">${baseCash.toLocaleString()}</h2>
            </div>

            {/* CARD 2: INTERACTIVE SIMULATOR (Champagne / Gold accent) */}
            <div className="bg-[#FCFBF8] dark:bg-[#1A1814] p-8 rounded-2xl border border-[#E8E2D2] dark:border-[#332D21] shadow-sm flex flex-col justify-center relative transition-colors">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8C7A54] dark:text-[#C5B382] mb-3 flex items-center gap-2">
                Capital Deployment Simulator
              </p>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400 font-light text-2xl border-r border-zinc-300 dark:border-zinc-700 pr-3">$</span>
                <input 
                  type="number" 
                  placeholder="0"
                  value={simulatedInjection}
                  onChange={(e) => setSimulatedInjection(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-2 pl-10 pr-2 text-2xl font-light text-zinc-900 dark:text-white focus:outline-none focus:border-[#8C7A54] dark:focus:border-[#C5B382] transition-colors placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                />
              </div>
            </div>

            {/* CARD 3: EFFECTIVE CASH */}
            <div className={`p-8 rounded-2xl border shadow-sm flex flex-col justify-center transition-all duration-700 ${injectionAmount > 0 ? 'bg-zinc-900 dark:bg-zinc-100 border-transparent scale-105' : 'bg-white dark:bg-[#121212] border-zinc-200 dark:border-white/5'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-2 transition-colors ${injectionAmount > 0 ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
                {injectionAmount > 0 ? 'Simulated Operating Capital' : 'Operating Capital'}
              </p>
              <h2 className={`text-4xl font-light tracking-tight ${injectionAmount > 0 ? 'text-white dark:text-black' : 'text-zinc-900 dark:text-white'}`}>
                ${effectiveCash.toLocaleString()}
              </h2>
            </div>

            {/* CARD 4: HEALTH */}
            <div className="bg-white dark:bg-[#121212] p-8 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm flex flex-col justify-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400 mb-3">Portfolio Health</p>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#4A7C59] animate-pulse"></div>
                <div>
                  <h2 className="text-lg font-medium text-zinc-900 dark:text-white tracking-tight">Optimal</h2>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">Reserves fully cover liabilities</p>
                </div>
              </div>
            </div>

          </div>

          {/* MIDDLE SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            
            {/* COLUMN 1: MONEY IN VS OUT */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-[#121212] p-10 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
              
              {/* INFLOWS */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-zinc-900 dark:text-white mb-6 border-b border-zinc-100 dark:border-white/5 pb-4 flex items-center justify-between">
                  Capital Inflows
                  <span className="text-[#4A7C59] font-light text-xl">${totalIn.toLocaleString()}</span>
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-xs font-medium text-zinc-900 dark:text-white">Contracted Recurring</p>
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">${moneyIn.secure.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-100 dark:bg-white/5 rounded-none overflow-hidden">
                      <div className="h-full bg-[#4A7C59]" style={{ width: `${(moneyIn.secure / totalIn) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-xs font-medium text-zinc-900 dark:text-white">Pending / At Risk</p>
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">${moneyIn.unsure.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-100 dark:bg-white/5 rounded-none overflow-hidden">
                      <div className="h-full bg-[#C5B382]" style={{ width: `${(moneyIn.unsure / totalIn) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* OUTFLOWS */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-zinc-900 dark:text-white mb-6 border-b border-zinc-100 dark:border-white/5 pb-4 flex items-center justify-between">
                  Operating Outflows
                  <span className="text-zinc-500 font-light text-xl">${totalOut.toLocaleString()}</span>
                </h3>
                <div className="space-y-5">
                  {[
                    { label: 'Payroll', value: moneyOut.payroll },
                    { label: 'Parts & Labor', value: moneyOut.partsLabor },
                    { label: 'Overhead', value: moneyOut.bills }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-24 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.label}</div>
                      <div className="flex-1 h-1 bg-zinc-100 dark:bg-white/5 rounded-none overflow-hidden flex">
                        <div className="h-full bg-zinc-800 dark:bg-zinc-400" style={{ width: `${(item.value / totalOut) * 100}%` }}></div>
                      </div>
                      <span className="text-xs font-medium text-zinc-900 dark:text-white">${item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMN 2: AGING */}
            <div className="lg:col-span-1 bg-white dark:bg-[#121212] p-10 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm flex flex-col">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-zinc-900 dark:text-white mb-6 border-b border-zinc-100 dark:border-white/5 pb-4">
                Outstanding Receivables
              </h3>
              
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-white/5">
                   <span className="text-xs text-zinc-600 dark:text-zinc-400">Current (0-30 Days)</span>
                   <span className="text-sm font-medium text-zinc-900 dark:text-white">${agingReport.current.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-white/5">
                   <span className="text-xs text-zinc-600 dark:text-zinc-400">Past Due (31-60 Days)</span>
                   <span className="text-sm font-medium text-zinc-900 dark:text-white">${agingReport.late30.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-white/5">
                   <span className="text-xs text-zinc-600 dark:text-zinc-400">Late (61-90 Days)</span>
                   <span className="text-sm font-medium text-zinc-900 dark:text-white">${agingReport.late60.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                   <span className="text-xs font-bold text-[#8C7A54] dark:text-[#C5B382]">At Risk (90+ Days)</span>
                   <span className="text-sm font-medium text-[#8C7A54] dark:text-[#C5B382]">${agingReport.late90Plus.toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>

          {/* BOTTOM SECTION: FORECAST */}
          <div className="bg-white dark:bg-[#121212] p-10 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-zinc-900 dark:text-white flex items-center gap-4">
                  Trailing 4-Week Projection
                  {injectionAmount > 0 && <span className="text-[9px] bg-zinc-900 text-white dark:bg-white dark:text-black px-3 py-1 rounded-none uppercase tracking-[0.2em]">Scenario Active</span>}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200 dark:bg-white/10 border border-zinc-200 dark:border-white/10">
              {projectedWeeks.map((week, idx) => (
                <div key={idx} className="bg-white dark:bg-[#121212] p-8 flex flex-col">
                  
                  <div className="mb-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">Week {week.week}</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{week.date}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">{week.note}</p>
                  </div>

                  <div className="space-y-4 flex-1 relative z-10 mt-auto">
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-white/5">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Start</span>
                      <span className="text-xs font-medium text-zinc-900 dark:text-white transition-all duration-500">${week.start.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-[#4A7C59] uppercase tracking-widest">+ In</span>
                      <span className="text-xs font-medium text-[#4A7C59]">${week.in.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-white/5">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">- Out</span>
                      <span className="text-xs font-medium text-zinc-500">${week.out.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-widest">End</span>
                      <span className="text-base font-light text-zinc-900 dark:text-white transition-all duration-500">
                        ${week.end.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
