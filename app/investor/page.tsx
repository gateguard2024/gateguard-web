"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useUser, useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getSupabase } from '@/lib/supabaseClient';

export default function ExecutivePortfolio() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [simulatedInjection, setSimulatedInjection] = useState<number | ''>('');
  const [timeHorizon, setTimeHorizon] = useState<number>(4);
  const [isFetching, setIsFetching] = useState(true);

  const [dbBaseCash, setDbBaseCash] = useState<number>(0);
  const [dbReceivables, setDbReceivables] = useState<any[]>([]);
  const [dbLedger, setDbLedger] = useState<any[]>([]);

  const AUTHORIZED_EMAILS = ['rfeldman@gateguard.co', 'sprabhu@gateguard.co'];

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const token = await getToken({ template: 'supabase' });
        if (!token) return;
        const supabase = await getSupabase(token);

        const [cashRes, recRes, ledgerRes] = await Promise.all([
          supabase.from('core_metrics').select('base_cash').eq('id', 1).single(),
          supabase.from('receivables').select('*'),
          supabase.from('ledgers').select('*')
        ]);

        if (cashRes.data) setDbBaseCash(cashRes.data.base_cash);
        if (recRes.data) setDbReceivables(recRes.data);
        if (ledgerRes.data) setDbLedger(ledgerRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsFetching(false);
      }
    };

    if (isLoaded && isSignedIn) fetchFinancialData();
  }, [isLoaded, isSignedIn, getToken]);

  // CALC AGING REPORT
  const agingReport = useMemo(() => {
    const today = new Date().getTime();
    return dbReceivables.reduce((acc, rec) => {
      const invoiceDate = new Date(rec.invoice_date).getTime();
      const diffDays = Math.ceil((today - invoiceDate) / (1000 * 60 * 60 * 24));
      const amount = Number(rec.amount) || 0;
      
      if (diffDays <= 30 || invoiceDate > today) acc.current += amount;
      else if (diffDays <= 60) acc.late30 += amount;
      else if (diffDays <= 90) acc.late60 += amount;
      else acc.late90Plus += amount;
      return acc;
    }, { current: 0, late30: 0, late60: 0, late90Plus: 0 });
  }, [dbReceivables]);

// DYNAMIC DATES & LEDGER MATCHING
  const activeWeeks = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    return Array.from({ length: timeHorizon }).map((_, i) => {
      const start = new Date(today);
      start.setDate(start.getDate() + (i * 7));
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23,59,59,999);
      
      const formatMsg = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Filter database ledger items falling within this specific week
      const weeklyLedger = dbLedger.filter(item => {
        if (!item.date) return false;
        
        // BULLETPROOF DATE PARSER: Strips timezones entirely
        const cleanDate = item.date.split('T')[0]; // Removes anything after 'T' if it's a timestamp
        const [year, month, day] = cleanDate.split('-');
        const itemDate = new Date(Number(year), Number(month) - 1, Number(day)).getTime();
        
        const isInWeek = itemDate >= start.getTime() && itemDate <= end.getTime();
        
        // This will print every transaction and where it gets placed to your console!
        if (isInWeek) {
          console.log(`Assigned to Week ${i + 1} (${formatMsg(start)}):`, item.description, item.amount);
        }
        
        return isInWeek;
      });

      // Sum Inflows
      const secureIn = weeklyLedger.filter(i => i.type === 'in' && i.category === 'Recurring Revenue').reduce((sum, i) => sum + Number(i.amount), 0);
      const unsureIn = weeklyLedger.filter(i => i.type === 'in' && i.category === 'General Income').reduce((sum, i) => sum + Number(i.amount), 0);
      
      // Sum Outflows
      const payroll = weeklyLedger.filter(i => i.type === 'out' && i.category === 'Payroll').reduce((sum, i) => sum + Number(i.amount), 0);
      const equipLabor = weeklyLedger.filter(i => i.type === 'out' && i.category === 'Equip & Contractors').reduce((sum, i) => sum + Number(i.amount), 0);
      const bills = weeklyLedger.filter(i => i.type === 'out' && i.category === 'Bills').reduce((sum, i) => sum + Number(i.amount), 0);
      const misc = weeklyLedger.filter(i => i.type === 'out' && i.category === 'Parts & Misc').reduce((sum, i) => sum + Number(i.amount), 0);

      const isActivity = secureIn > 0 || unsureIn > 0 || payroll > 0 || equipLabor > 0 || bills > 0 || misc > 0;

      return {
        weekNum: i + 1,
        dateStr: `${formatMsg(start)} - ${formatMsg(end)}`,
        note: isActivity ? 'Database Driven Flow' : 'No Scheduled Activity',
        secureIn, unsureIn,
        outflows: { payroll, equipLabor, bills, misc }
      };
    });
  }, [timeHorizon, dbLedger]);

  if (!isLoaded || isFetching) return <div className="min-h-screen bg-zinc-200 dark:bg-[#0A0A0A] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-white"></div></div>;
  if (!isSignedIn) redirect('/login');
  
  const userEmail = user.primaryEmailAddress?.emailAddress || '';
  if (!AUTHORIZED_EMAILS.includes(userEmail)) redirect('/portal');

  const injectionAmount = Number(simulatedInjection) || 0;
  const effectiveCash = dbBaseCash + injectionAmount;

  const periodInflows = activeWeeks.reduce((acc, w) => {
    acc.secure += w.secureIn; acc.unsure += w.unsureIn; acc.total += (w.secureIn + w.unsureIn);
    return acc;
  }, { secure: 0, unsure: 0, total: 0 });
  
  const periodOutflows = activeWeeks.reduce((acc, w) => {
    acc.payroll += w.outflows.payroll; acc.equipLabor += w.outflows.equipLabor; acc.bills += w.outflows.bills; acc.misc += w.outflows.misc;
    acc.total += (w.outflows.payroll + w.outflows.equipLabor + w.outflows.bills + w.outflows.misc);
    return acc;
  }, { payroll: 0, equipLabor: 0, bills: 0, misc: 0, total: 0 });

  let runningBalance = effectiveCash;
  const projectedWeeks = activeWeeks.map(w => {
     const start = runningBalance;
     const weekInTotal = w.secureIn + w.unsureIn;
     const weekOutTotal = w.outflows.payroll + w.outflows.equipLabor + w.outflows.bills + w.outflows.misc;
     const end = start + weekInTotal - weekOutTotal;
     runningBalance = end; 
     return { ...w, weekInTotal, weekOutTotal, start, end };
  });

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <main className="bg-zinc-200 dark:bg-[#0A0A0A] text-zinc-900 dark:text-zinc-50 min-h-screen font-sans selection:bg-zinc-300 dark:selection:bg-zinc-700 flex flex-col transition-colors duration-500 relative pb-20">
        <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <header className="h-24 border-b border-zinc-300/50 dark:border-white/5 bg-zinc-200 dark:bg-[#0A0A0A] flex items-center justify-between px-8 lg:px-16 z-50 shrink-0 transition-colors">
          <div className="flex items-center gap-6">
            <Link href="/"><div className="w-12 h-12 bg-zinc-900 dark:bg-white rounded-none flex items-center justify-center text-white dark:text-black font-serif text-xl tracking-tighter">GG</div></Link>
            <div className="w-px h-10 bg-zinc-300 dark:bg-white/10"></div>
            <div>
              <h1 className="text-2xl font-normal tracking-tight text-zinc-900 dark:text-white">Executive Portfolio</h1>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Strategic Cash Forecast</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-12 h-12 rounded-full border border-zinc-300/50 dark:border-white/10 bg-white hover:bg-zinc-50 dark:bg-black dark:hover:bg-white/5 transition-colors flex items-center justify-center text-lg shadow-sm">
                {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <div className="sticky top-0 z-40 bg-zinc-200/90 dark:bg-[#0A0A0A]/90 backdrop-blur-2xl border-b border-zinc-300/50 dark:border-white/10 pt-8 pb-8 px-8 lg:px-16 transition-colors shadow-sm">
          <div className="max-w-[1600px] w-full mx-auto">
            
            <div className="flex gap-8 mb-6">
              {[{ label: '1 Week', val: 1 }, { label: '2 Weeks', val: 2 }, { label: '1 Month', val: 4 }, { label: '2 Months', val: 8 }].map(h => (
                  <button key={h.val} onClick={() => setTimeHorizon(h.val)} className={`pb-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 ${timeHorizon === h.val ? 'border-b border-zinc-900 dark:border-white text-zinc-900 dark:text-white' : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}>
                    {h.label}
                  </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-zinc-300/50 dark:border-white/5 shadow-sm flex flex-col justify-center relative">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400 mb-1">Liquid Assets</p>
                <h2 className="text-3xl font-normal text-zinc-800 dark:text-white tracking-tight">${dbBaseCash.toLocaleString()}</h2>
              </div>

              <div className="bg-[#FCFBF8] dark:bg-[#1A1814] p-6 rounded-2xl border border-[#EBE5D8] dark:border-[#332D21] shadow-sm flex flex-col justify-center relative transition-colors">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8C7A54] dark:text-[#C5B382] mb-2 flex items-center gap-2">Capital Deployment Simulator</p>
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#8C7A54] font-normal text-xl border-r border-[#EBE5D8] dark:border-zinc-700 pr-3">$</span>
                  <input type="number" placeholder="0" value={simulatedInjection} onChange={(e) => setSimulatedInjection(e.target.value ? Number(e.target.value) : '')} className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-1 pl-10 pr-2 text-xl font-normal text-zinc-800 dark:text-white focus:outline-none focus:border-[#8C7A54] dark:focus:border-[#C5B382] transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600" />
                </div>
              </div>

              <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-center transition-all duration-700 ${injectionAmount > 0 ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 scale-105' : 'bg-white dark:bg-[#121212] border-zinc-300/50 dark:border-white/5'}`}>
                <p className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-1 transition-colors ${injectionAmount > 0 ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
                  {injectionAmount > 0 ? 'Simulated Operating Capital' : 'Operating Capital'}
                </p>
                <h2 className={`text-3xl font-normal tracking-tight ${injectionAmount > 0 ? 'text-white dark:text-black' : 'text-zinc-800 dark:text-white'}`}>
                  ${effectiveCash.toLocaleString()}
                </h2>
              </div>

              <div className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-zinc-300/50 dark:border-white/5 shadow-sm flex flex-col justify-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400 mb-2">Portfolio Health</p>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#4A7C59] animate-pulse shadow-[0_0_8px_rgba(74,124,89,0.6)]"></div>
                  <div>
                    <h2 className="text-base font-bold text-zinc-800 dark:text-white tracking-tight">Optimal</h2>
                    <p className="text-[9px] text-zinc-500 dark:text-zinc-400 mt-0.5 uppercase tracking-wider">Reserves fully cover liabilities</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="max-w-[1600px] w-full mx-auto px-8 lg:px-16 pt-12 z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-[#121212] p-10 rounded-2xl border border-zinc-300/50 dark:border-white/5 shadow-md">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-zinc-800 dark:text-white mb-6 border-b border-zinc-100 dark:border-white/5 pb-4 flex items-center justify-between">
                  Capital Inflows <span className="text-[#4A7C59] font-normal text-xl">${periodInflows.total.toLocaleString()}</span>
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-xs font-bold text-zinc-700 dark:text-white">Contracted Recurring</p>
                      <span className="text-sm font-bold text-zinc-800 dark:text-white">${periodInflows.secure.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#4A7C59] rounded-full transition-all duration-500" style={{ width: `${(periodInflows.secure / (periodInflows.total || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-xs font-bold text-zinc-700 dark:text-white">Pending / At Risk</p>
                      <span className="text-sm font-bold text-zinc-800 dark:text-white">${periodInflows.unsure.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#C5B382] rounded-full transition-all duration-500" style={{ width: `${(periodInflows.unsure / (periodInflows.total || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-zinc-800 dark:text-white mb-6 border-b border-zinc-100 dark:border-white/5 pb-4 flex items-center justify-between">
                  Operating Outflows <span className="text-zinc-600 font-normal text-xl">${periodOutflows.total.toLocaleString()}</span>
                </h3>
                <div className="space-y-5">
                  {[{ label: 'Payroll', value: periodOutflows.payroll }, { label: 'Equip & Labor', value: periodOutflows.equipLabor }, { label: 'Bills', value: periodOutflows.bills }, { label: 'Misc', value: periodOutflows.misc }].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-24 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.label}</div>
                      <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden flex">
                        <div className="h-full bg-zinc-700 dark:bg-zinc-400 rounded-full transition-all duration-500" style={{ width: `${(item.value / (periodOutflows.total || 1)) * 100}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-zinc-800 dark:text-white w-16 text-right">${item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 bg-white dark:bg-[#121212] p-10 rounded-2xl border border-zinc-300/50 dark:border-white/5 shadow-md flex flex-col">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-zinc-800 dark:text-white mb-6 border-b border-zinc-100 dark:border-white/5 pb-4">Outstanding Receivables</h3>
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F7F5] dark:bg-emerald-500/5 border border-[#E2EBE5] dark:border-emerald-500/20">
                   <span className="text-xs font-bold text-[#3B6347] dark:text-emerald-400">Current (0-30 Days)</span>
                   <span className="text-sm font-bold text-[#3B6347] dark:text-emerald-400">${agingReport.current.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FCFBF5] dark:bg-amber-500/5 border border-[#EBE5D8] dark:border-amber-500/20">
                   <span className="text-xs font-bold text-[#8C7A54] dark:text-[#C5B382]">Past Due (31-60 Days)</span>
                   <span className="text-sm font-bold text-[#8C7A54] dark:text-[#C5B382]">${agingReport.late30.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FCF7F5] dark:bg-orange-500/5 border border-[#EBE2D8] dark:border-orange-500/20">
                   <span className="text-xs font-bold text-[#9C5A43] dark:text-orange-400">Late (61-90 Days)</span>
                   <span className="text-sm font-bold text-[#9C5A43] dark:text-orange-400">${agingReport.late60.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FCF5F5] dark:bg-red-500/5 border border-[#EBE0D8] dark:border-red-500/20">
                   <span className="text-xs font-bold text-[#A84545] dark:text-red-400">At Risk (90+ Days)</span>
                   <span className="text-sm font-bold text-[#A84545] dark:text-red-400">${agingReport.late90Plus.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#121212] p-10 rounded-2xl border border-zinc-300/50 dark:border-white/5 shadow-md mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-zinc-800 dark:text-white flex items-center gap-4">
                  Periodic Projection ({timeHorizon} {timeHorizon === 1 ? 'Week' : 'Weeks'})
                  {injectionAmount > 0 && <span className="text-[9px] bg-zinc-900 text-white dark:bg-white dark:text-black px-3 py-1 rounded-md uppercase tracking-[0.2em]">Scenario Active</span>}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {projectedWeeks.map((week, idx) => (
                <div key={idx} className="bg-white dark:bg-[#121212] border border-zinc-200 dark:border-white/10 p-8 flex flex-col rounded-2xl shadow-sm">
                  <div className="mb-6 border-b border-zinc-100 dark:border-white/5 pb-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">Week {week.weekNum}</p>
                    <p className="text-sm font-bold text-zinc-800 dark:text-white">{week.dateStr}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-medium">{week.note}</p>
                  </div>

                  <div className="space-y-4 flex-1 relative z-10 mt-auto">
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-white/5">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Start</span>
                      <span className="text-xs font-bold text-zinc-800 dark:text-white transition-all duration-500">${week.start.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-[#4A7C59] uppercase tracking-widest">+ Inflows</span>
                      <span className="text-xs font-bold text-[#4A7C59]">${week.weekInTotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">- Outflows</span>
                      <span className="text-xs font-bold text-zinc-500">${week.weekOutTotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="bg-zinc-50 dark:bg-black/30 p-3 rounded-lg space-y-2 border border-zinc-200/60 dark:border-white/5 mt-2">
                       <div className="flex justify-between items-center text-[9px] text-zinc-500 uppercase tracking-wider font-bold">
                          <span>Payroll</span>
                          <span className="text-zinc-700 dark:text-zinc-300">${week.outflows.payroll.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center text-[9px] text-zinc-500 uppercase tracking-wider font-bold">
                          <span>Equip & Labor</span>
                          <span className="text-zinc-700 dark:text-zinc-300">${week.outflows.equipLabor.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center text-[9px] text-zinc-500 uppercase tracking-wider font-bold">
                          <span>Bills</span>
                          <span className="text-zinc-700 dark:text-zinc-300">${week.outflows.bills.toLocaleString()}</span>
                       </div>
                       {week.outflows.misc > 0 && (
                         <div className="flex justify-between items-center text-[9px] text-zinc-500 uppercase tracking-wider font-bold">
                            <span>Misc</span>
                            <span className="text-zinc-700 dark:text-zinc-300">${week.outflows.misc.toLocaleString()}</span>
                         </div>
                       )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-zinc-200 dark:border-white/10 mt-4">
                      <span className="text-[10px] font-bold text-zinc-800 dark:text-white uppercase tracking-widest">End Balance</span>
                      <span className={`text-base font-bold transition-all duration-500 ${week.end < 10000 ? 'text-red-500' : 'text-zinc-900 dark:text-white'}`}>
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
