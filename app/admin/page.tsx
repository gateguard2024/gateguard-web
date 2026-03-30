"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function AdminPortal() {
  // --- CLERK SECURITY (ADMIN ONLY) ---
  const { isLoaded, isSignedIn, user } = useUser();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  // ONLY YOUR EMAIL GOES HERE. The investor cannot access this page.
  const ADMIN_EMAILS = ['your_email@gateguard.co']; 

  // --- FORM STATE ---
  // 1. Core Liquidity
  const [baseCash, setBaseCash] = useState<number | ''>(42500);

  // 2. Outstanding Receivables (Aging)
  const [aging, setAging] = useState({
    current: 18000,
    late30: 2500,
    late60: 1500,
    late90Plus: 500
  });

  // 3. Weekly Forecast (4 Weeks for Data Entry)
  const [forecast, setForecast] = useState([
    { week: 1, note: 'Standard Payroll Disbursement', secureIn: 4000, unsureIn: 1000, payroll: 10500, equipLabor: 800, bills: 500, misc: 200 },
    { week: 2, note: 'Portfolio Invoices Clear', secureIn: 8000, unsureIn: 1000, payroll: 0, equipLabor: 1200, bills: 600, misc: 200 },
    { week: 3, note: 'Hardware & Vendor Payables', secureIn: 3000, unsureIn: 1000, payroll: 0, equipLabor: 900, bills: 2100, misc: 500 },
    { week: 4, note: 'Standard Operating Flow', secureIn: 4000, unsureIn: 500, payroll: 1500, equipLabor: 1200, bills: 700, misc: 200 },
  ]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-200 dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-white"></div>
      </div>
    );
  }

  if (!isSignedIn) redirect('/login');
  
  const userEmail = user.primaryEmailAddress?.emailAddress || '';
  if (!ADMIN_EMAILS.includes(userEmail)) {
    redirect('/portal'); // Bounce everyone else
  }

  // --- HANDLERS ---
  const handleAgingChange = (field: keyof typeof aging, value: string) => {
    setAging(prev => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const handleForecastChange = (index: number, field: string, value: string | number) => {
    const newForecast = [...forecast];
    newForecast[index] = { 
      ...newForecast[index], 
      [field]: field === 'note' ? value : (Number(value) || 0) 
    };
    setForecast(newForecast);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // In Step 5, we will connect this payload to Supabase.
      const payload = { baseCash, aging, forecast, updatedAt: new Date().toISOString() };
      console.log("Publishing to DB:", payload);
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 4000);
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <main className="bg-zinc-200 dark:bg-[#0A0A0A] text-zinc-900 dark:text-zinc-50 min-h-screen font-sans selection:bg-zinc-300 dark:selection:bg-zinc-700 flex flex-col transition-colors duration-500 relative pb-20">
        
        <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

        {/* HEADER */}
        <header className="h-24 border-b border-zinc-300/50 dark:border-white/5 bg-white/80 dark:bg-black/60 backdrop-blur-2xl flex items-center justify-between px-8 lg:px-16 z-50 shrink-0 sticky top-0 transition-colors shadow-sm">
          <div className="flex items-center gap-6">
            <Link href="/"><div className="w-12 h-12 bg-zinc-900 dark:bg-white rounded-none flex items-center justify-center text-white dark:text-black font-serif text-xl tracking-tighter">GG</div></Link>
            <div className="w-px h-10 bg-zinc-300 dark:bg-white/10"></div>
            <div>
              <h1 className="text-2xl font-normal tracking-tight text-zinc-900 dark:text-white">Data Control Center</h1>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Admin Input Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="w-12 h-12 rounded-full border border-zinc-300/50 dark:border-white/10 bg-white hover:bg-zinc-50 dark:bg-black dark:hover:bg-white/5 transition-colors flex items-center justify-center text-lg shadow-sm"
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Authorized</span>
              <span className="text-xs font-bold text-zinc-900 dark:text-white">Founder</span>
            </div>
          </div>
        </header>

        <form onSubmit={handlePublish} className="max-w-[1200px] w-full mx-auto px-8 lg:px-16 pt-12 z-10 relative space-y-12">
          
          {/* SECTION 1: CORE LIQUIDITY & AGING */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Cash on Hand */}
            <div className="bg-white dark:bg-[#121212] p-8 rounded-2xl border border-zinc-300/50 dark:border-white/5 shadow-md">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-zinc-800 dark:text-white mb-6 border-b border-zinc-100 dark:border-white/5 pb-4">
                1. Core Liquidity
              </h3>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2 block">Current Bank Balance</label>
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400 font-normal text-xl border-r border-zinc-200 dark:border-zinc-700 pr-3">$</span>
                  <input 
                    type="number" 
                    required
                    value={baseCash}
                    onChange={(e) => setBaseCash(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-xl font-normal text-zinc-900 dark:text-white focus:outline-none focus:border-[#8C7A54] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Outstanding Receivables */}
            <div className="bg-white dark:bg-[#121212] p-8 rounded-2xl border border-zinc-300/50 dark:border-white/5 shadow-md">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-zinc-800 dark:text-white mb-6 border-b border-zinc-100 dark:border-white/5 pb-4">
                2. Outstanding Receivables
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#4A7C59] mb-1 block">Current (0-30)</label>
                  <input type="number" value={aging.current} onChange={(e) => handleAgingChange('current', e.target.value)} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#4A7C59]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#C5B382] mb-1 block">Past Due (31-60)</label>
                  <input type="number" value={aging.late30} onChange={(e) => handleAgingChange('late30', e.target.value)} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#C5B382]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-1 block">Late (61-90)</label>
                  <input type="number" value={aging.late60} onChange={(e) => handleAgingChange('late60', e.target.value)} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-1 block">At Risk (90+)</label>
                  <input type="number" value={aging.late90Plus} onChange={(e) => handleAgingChange('late90Plus', e.target.value)} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-red-500" />
                </div>
              </div>
            </div>

          </div>

          {/* SECTION 3: WEEKLY FORECAST BUILDER */}
          <div className="bg-white dark:bg-[#121212] p-8 rounded-2xl border border-zinc-300/50 dark:border-white/5 shadow-md">
            <div className="flex items-center justify-between mb-8 border-b border-zinc-100 dark:border-white/5 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-zinc-800 dark:text-white">
                3. Weekly Forecast Builder
              </h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Next 4 Weeks</p>
            </div>

            <div className="space-y-8">
              {forecast.map((week, idx) => (
                <div key={idx} className="p-6 bg-zinc-50 dark:bg-[#1A1A1A] border border-zinc-200 dark:border-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-800 dark:text-white">Week {week.week}</h4>
                    <input 
                      type="text" 
                      placeholder="High-level narrative note..." 
                      value={week.note}
                      onChange={(e) => handleForecastChange(idx, 'note', e.target.value)}
                      className="w-2/3 bg-transparent border-b border-zinc-300 dark:border-zinc-700 pb-1 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* INFLOWS */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-[#4A7C59] uppercase tracking-widest border-b border-zinc-200 dark:border-white/10 pb-1">Expected Inflows</p>
                      <div className="flex items-center gap-4">
                        <label className="w-24 text-[10px] text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Secure</label>
                        <input type="number" value={week.secureIn} onChange={(e) => handleForecastChange(idx, 'secureIn', e.target.value)} className="flex-1 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 text-xs focus:outline-none focus:border-[#4A7C59]" />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="w-24 text-[10px] text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Unsure/At-Risk</label>
                        <input type="number" value={week.unsureIn} onChange={(e) => handleForecastChange(idx, 'unsureIn', e.target.value)} className="flex-1 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 text-xs focus:outline-none focus:border-[#C5B382]" />
                      </div>
                    </div>

                    {/* OUTFLOWS */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-300 uppercase tracking-widest border-b border-zinc-200 dark:border-white/10 pb-1">Expected Outflows</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <label className="w-16 text-[9px] text-zinc-500 uppercase tracking-wider">Payroll</label>
                          <input type="number" value={week.payroll} onChange={(e) => handleForecastChange(idx, 'payroll', e.target.value)} className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 text-xs focus:outline-none focus:border-zinc-500" />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="w-16 text-[9px] text-zinc-500 uppercase tracking-wider">Eqp/Labor</label>
                          <input type="number" value={week.equipLabor} onChange={(e) => handleForecastChange(idx, 'equipLabor', e.target.value)} className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 text-xs focus:outline-none focus:border-zinc-500" />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="w-16 text-[9px] text-zinc-500 uppercase tracking-wider">Bills</label>
                          <input type="number" value={week.bills} onChange={(e) => handleForecastChange(idx, 'bills', e.target.value)} className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 text-xs focus:outline-none focus:border-zinc-500" />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="w-16 text-[9px] text-zinc-500 uppercase tracking-wider">Misc</label>
                          <input type="number" value={week.misc} onChange={(e) => handleForecastChange(idx, 'misc', e.target.value)} className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 text-xs focus:outline-none focus:border-zinc-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="sticky bottom-0 bg-zinc-200/90 dark:bg-[#0A0A0A]/90 backdrop-blur-xl py-6 border-t border-zinc-300/50 dark:border-white/10 flex items-center justify-between z-40">
            <div>
              {saveStatus === 'saved' && <p className="text-xs font-bold text-[#4A7C59] tracking-widest uppercase">✓ Live on Investor Dashboard</p>}
              {saveStatus === 'error' && <p className="text-xs font-bold text-red-500 tracking-widest uppercase">⚠️ Error Saving Data</p>}
            </div>
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold uppercase tracking-[0.2em] text-xs px-10 py-4 rounded-none transition-all shadow-xl disabled:opacity-50"
            >
              {isSaving ? 'Syncing...' : 'Publish Friday Report'}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
