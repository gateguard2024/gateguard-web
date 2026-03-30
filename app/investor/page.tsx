"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function InvestorPulseDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode

  // --- DEMO DATA ---
  const currentCash = 42500;
  const net30Day = 1400; // Projected positive/negative cashflow
  
  const moneyIn = {
    secure: 18000, // Recurring expected
    unsure: 4500,  // Due but unsure
  };
  const totalIn = moneyIn.secure + moneyIn.unsure;

  const moneyOut = {
    payroll: 12000,
    partsLabor: 5100,
    bills: 3200,
    other: 800,
  };
  const totalOut = moneyOut.payroll + moneyOut.partsLabor + moneyOut.bills + moneyOut.other;

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <main className="bg-slate-100 dark:bg-[#020813] text-slate-900 dark:text-white min-h-screen font-sans selection:bg-cyan-500/30 flex flex-col transition-colors duration-300 relative pb-20">
        
        {/* FAINT DOT BACKGROUND */}
        <div className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:20px_20px]"></div>

        {/* HEADER */}
        <header className="h-20 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/50 backdrop-blur-xl flex items-center justify-between px-6 lg:px-12 z-50 shrink-0 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-center gap-4">
            <Link href="/"><div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center text-white font-black">GG</div></Link>
            <div className="w-[1px] h-8 bg-slate-300 dark:bg-white/10"></div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Investor Pulse</h1>
              <p className="text-[10px] text-cyan-600 dark:text-cyan-500 font-bold uppercase tracking-widest mt-0.5">30-Day Financial Weather Report</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm flex items-center justify-center text-lg"
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-800 border border-slate-300 dark:border-white/10 flex items-center justify-center text-sm font-black text-slate-600 dark:text-zinc-400 shadow-inner">
              IN
            </div>
          </div>
        </header>

        <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 pt-10 z-10 relative">
          
          {/* TOP ROW: THE BIG 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* CARD 1: CURRENT CASH */}
            <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-2">Today's Bank Balance</p>
              <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">${currentCash.toLocaleString()}</h2>
            </div>

            {/* CARD 2: 30 DAY FORECAST */}
            <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500"></div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-2">30-Day Trajectory</p>
              <div className="flex items-baseline gap-3">
                <h2 className="text-5xl font-black text-cyan-600 dark:text-cyan-400 tracking-tight">+{net30Day.toLocaleString()}</h2>
                <span className="text-sm font-bold text-slate-500 dark:text-zinc-400">Net Gain</span>
              </div>
            </div>

            {/* CARD 3: HEALTH STATUS */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-8 rounded-3xl border border-emerald-200 dark:border-emerald-500/20 shadow-sm dark:shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-500/70 mb-2">Company Health</p>
                <h2 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">Looking Good</h2>
                <p className="text-xs text-emerald-800/70 dark:text-emerald-200/50 mt-1 font-medium">Cash reserves are healthy to cover all upcoming payroll and bills.</p>
              </div>
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                <span className="text-3xl">👍</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* LEFT COLUMN: MONEY IN VS MONEY OUT */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* MONEY COMING IN */}
              <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-4 flex items-center justify-between">
                  Money Coming In
                  <span className="text-emerald-600 dark:text-emerald-400 text-2xl">${totalIn.toLocaleString()}</span>
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Secure Recurring Payments</p>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase tracking-widest font-bold">Highly likely to receive</p>
                      </div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">${moneyIn.secure.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-4 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(moneyIn.secure / totalIn) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">Due, But Unsure <span className="text-amber-500 text-xs">⚠️</span></p>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase tracking-widest font-bold">Late invoices or at-risk</p>
                      </div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">${moneyIn.unsure.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-4 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(moneyIn.unsure / totalIn) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MONEY GOING OUT */}
              <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-4 flex items-center justify-between">
                  Money Going Out (Expenses)
                  <span className="text-red-500 dark:text-red-400 text-2xl">${totalOut.toLocaleString()}</span>
                </h3>
                
                <div className="space-y-5">
                  {[
                    { label: 'Payroll', value: moneyOut.payroll, color: 'bg-indigo-500' },
                    { label: 'Parts & Labor', value: moneyOut.partsLabor, color: 'bg-blue-500' },
                    { label: 'Bills / Overhead', value: moneyOut.bills, color: 'bg-orange-500' },
                    { label: 'Other', value: moneyOut.other, color: 'bg-zinc-400 dark:bg-zinc-600' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-24 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest text-right">{item.label}</div>
                      <div className="flex-1 h-6 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/5 flex">
                        <div className={`h-full ${item.color} rounded-r-xl relative group`} style={{ width: `${(item.value / totalOut) * 100}%` }}>
                           <span className="absolute inset-0 flex items-center pl-3 text-[10px] font-black text-white mix-blend-overlay">${item.value.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: THE 30-DAY PATH */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl h-full">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-white/5 pb-4">The 30-Day Path</h3>
                
                <div className="relative pl-6 border-l-2 border-slate-200 dark:border-white/10 space-y-8 pb-4">
                  
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-cyan-500 border-4 border-white dark:border-[#0a0a0a]"></div>
                    <p className="text-[10px] text-cyan-600 dark:text-cyan-500 uppercase tracking-widest font-bold mb-1">Week 1</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Standard Payroll Run</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-500">Expected outflow of ~$6,000. Cash reserves easily cover this.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-[#0a0a0a]"></div>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-500 uppercase tracking-widest font-bold mb-1">Week 2</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Major Invoices Clear</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-500">Columbia property bulk checks should clear, injecting ~$9,000.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-white dark:border-[#0a0a0a]"></div>
                    <p className="text-[10px] text-amber-600 dark:text-amber-500 uppercase tracking-widest font-bold mb-1">Week 3</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Supplier Bills Due</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-500">Brivo and hardware vendor bills hit. Keeping an eye on unsure invoices to offset this.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-300 dark:bg-white/20 border-4 border-white dark:border-[#0a0a0a]"></div>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase tracking-widest font-bold mb-1">Week 4</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Month End Wrap-Up</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-500">Projected to end the month net positive by roughly $1,400.</p>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
