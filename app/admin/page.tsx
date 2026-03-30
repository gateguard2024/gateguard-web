"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

type LedgerItem = {
  id: string;
  date: string;
  description: string;
  amount: number | '';
  category: string;
  isRecurring: boolean;
};

export default function AdminPortal() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  // CHANGE THIS TO YOUR ACTUAL EMAIL
  const ADMIN_EMAILS = ['rfeldman@gateguard.co']; 

  // --- 1. CORE & AGING STATE ---
  const [baseCash, setBaseCash] = useState<number | ''>(42500);
  const [aging, setAging] = useState({ current: 18000, late30: 2500, late60: 1500, late90Plus: 500 });

  // --- 2. LEDGER STATE ---
  const [inflows, setInflows] = useState<LedgerItem[]>([
    { id: '1', date: '2026-04-15', description: 'Angel Oak Capitol', amount: 1500, category: 'Recurring Revenue', isRecurring: true },
    { id: '2', date: '2026-04-08', description: 'Radco', amount: 3400, category: 'General Income', isRecurring: false },
  ]);

  const [outflows, setOutflows] = useState<LedgerItem[]>([
    { id: '3', date: '2026-04-01', description: 'Zoho1', amount: 160, category: 'Bills', isRecurring: true },
    { id: '4', date: '2026-04-01', description: 'T-Insurance', amount: 1015, category: 'Bills', isRecurring: true },
    { id: '5', date: '2026-04-01', description: 'Russel Feldman', amount: 8000, category: 'Equip & Contractors', isRecurring: false },
  ]);

  if (!isLoaded) return <div className="min-h-screen bg-zinc-200 dark:bg-[#0A0A0A]"></div>;
  if (!isSignedIn) redirect('/login');
  
  const userEmail = user.primaryEmailAddress?.emailAddress || '';
  if (!ADMIN_EMAILS.includes(userEmail)) redirect('/portal');

  // --- HANDLERS ---
  const handleAgingChange = (field: keyof typeof aging, value: string) => {
    setAging(prev => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const addRow = (type: 'in' | 'out') => {
    const newItem: LedgerItem = { id: Date.now().toString(), date: '', description: '', amount: '', category: type === 'in' ? 'General Income' : 'Bills', isRecurring: false };
    if (type === 'in') setInflows([...inflows, newItem]);
    else setOutflows([...outflows, newItem]);
  };

  const removeRow = (type: 'in' | 'out', id: string) => {
    if (type === 'in') setInflows(inflows.filter(item => item.id !== id));
    else setOutflows(outflows.filter(item => item.id !== id));
  };

  const updateRow = (type: 'in' | 'out', id: string, field: keyof LedgerItem, value: any) => {
    const updater = (items: LedgerItem[]) => items.map(item => item.id === id ? { ...item, [field]: value } : item);
    if (type === 'in') setInflows(updater(inflows));
    else setOutflows(updater(outflows));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      // In the future, we send this JSON straight to Supabase!
      console.log("Publishing:", { baseCash, aging, inflows, outflows });
      await new Promise(resolve => setTimeout(resolve, 1000));
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
      <main className="bg-zinc-200 dark:bg-[#0A0A0A] text-zinc-900 dark:text-zinc-50 min-h-screen font-sans selection:bg-zinc-300 dark:selection:bg-zinc-700 flex flex-col transition-colors duration-500 relative pb-32">
        <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

        {/* HEADER */}
        <header className="h-24 border-b border-zinc-300/50 dark:border-white/5 bg-white/80 dark:bg-black/60 backdrop-blur-2xl flex items-center justify-between px-8 lg:px-16 z-50 shrink-0 sticky top-0 transition-colors shadow-sm">
          <div className="flex items-center gap-6">
            <Link href="/"><div className="w-12 h-12 bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-black font-serif text-xl tracking-tighter">GG</div></Link>
            <div className="w-px h-10 bg-zinc-300 dark:bg-white/10"></div>
            <div>
              <h1 className="text-2xl font-normal tracking-tight text-zinc-900 dark:text-white">Data Control Center</h1>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Admin Input Portal</p>
            </div>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-12 h-12 rounded-full border border-zinc-300/50 dark:border-white/10 bg-white hover:bg-zinc-50 dark:bg-black dark:hover:bg-white/5 transition-colors flex items-center justify-center text-lg shadow-sm">
              {isDarkMode ? '☀️' : '🌙'}
          </button>
        </header>

        <form onSubmit={handlePublish} className="max-w-[1200px] w-full mx-auto px-8 lg:px-16 pt-12 z-10 relative space-y-10">
          
          {/* ROW 1: CASH & AGING */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#121212] p-8 rounded-2xl border border-zinc-300/50 dark:border-white/5 shadow-md">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-zinc-800 dark:text-white mb-6 border-b border-zinc-100 dark:border-white/5 pb-4">1. Core Liquidity</h3>
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2 block">Current Bank Balance</label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400 font-normal text-xl border-r border-zinc-200 dark:border-zinc-700 pr-3">$</span>
                <input type="number" required value={baseCash} onChange={(e) => setBaseCash(e.target.value ? Number(e.target.value) : '')} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-xl font-normal text-zinc-900 dark:text-white focus:outline-none focus:border-[#8C7A54] transition-colors" />
              </div>
            </div>

            <div className="bg-white dark:bg-[#121212] p-8 rounded-2xl border border-zinc-300/50 dark:border-white/5 shadow-md">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-zinc-800 dark:text-white mb-6 border-b border-zinc-100 dark:border-white/5 pb-4">2. Outstanding Receivables</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(aging).map(([key, val]) => (
                  <div key={key}>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 block">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                    <input type="number" value={val} onChange={(e) => handleAgingChange(key as any, e.target.value)} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROW 2: INFLOWS LEDGER */}
          <div className="bg-white dark:bg-[#121212] p-8 rounded-2xl border border-zinc-300/50 dark:border-white/5 shadow-md">
            <div className="flex items-center justify-between mb-6 border-b border-zinc-100 dark:border-white/5 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-[#4A7C59]">3. Expected Inflows</h3>
              <button type="button" onClick={() => addRow('in')} className="text-[10px] font-bold text-[#4A7C59] uppercase tracking-widest hover:text-[#3B6347]">+ Add Row</button>
            </div>
            
            <div className="space-y-3">
              {inflows.map((item) => (
                <div key={item.id} className="flex flex-wrap md:flex-nowrap items-center gap-3 p-3 bg-zinc-50 dark:bg-[#1A1A1A] border border-zinc-200 dark:border-white/5 rounded-xl">
                  <input type="date" value={item.date} onChange={e => updateRow('in', item.id, 'date', e.target.value)} className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 text-xs focus:outline-none focus:border-[#4A7C59] w-32" />
                  <input type="text" placeholder="Description (e.g. Radco)" value={item.description} onChange={e => updateRow('in', item.id, 'description', e.target.value)} className="flex-1 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 text-xs focus:outline-none focus:border-[#4A7C59]" />
                  <div className="relative w-32">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                    <input type="number" placeholder="Amount" value={item.amount} onChange={e => updateRow('in', item.id, 'amount', e.target.value ? Number(e.target.value) : '')} className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 pl-6 text-xs focus:outline-none focus:border-[#4A7C59]" />
                  </div>
                  <select value={item.category} onChange={e => updateRow('in', item.id, 'category', e.target.value)} className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 text-xs focus:outline-none focus:border-[#4A7C59] w-40">
                    <option value="Recurring Revenue">Recurring Revenue</option>
                    <option value="General Income">General Income</option>
                  </select>
                  <label className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase tracking-wider cursor-pointer w-24">
                    <input type="checkbox" checked={item.isRecurring} onChange={e => updateRow('in', item.id, 'isRecurring', e.target.checked)} className="accent-[#4A7C59]" />
                    Recurring
                  </label>
                  <button type="button" onClick={() => removeRow('in', item.id)} className="text-red-500 hover:text-red-700 font-bold px-2">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* ROW 3: OUTFLOWS LEDGER */}
          <div className="bg-white dark:bg-[#121212] p-8 rounded-2xl border border-zinc-300/50 dark:border-white/5 shadow-md">
            <div className="flex items-center justify-between mb-6 border-b border-zinc-100 dark:border-white/5 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-zinc-800 dark:text-white">4. Expected Outflows</h3>
              <button type="button" onClick={() => addRow('out')} className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-widest hover:text-zinc-500">+ Add Row</button>
            </div>
            
            <div className="space-y-3">
              {outflows.map((item) => (
                <div key={item.id} className="flex flex-wrap md:flex-nowrap items-center gap-3 p-3 bg-zinc-50 dark:bg-[#1A1A1A] border border-zinc-200 dark:border-white/5 rounded-xl">
                  <input type="date" value={item.date} onChange={e => updateRow('out', item.id, 'date', e.target.value)} className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 text-xs focus:outline-none focus:border-zinc-400 w-32" />
                  <input type="text" placeholder="Description (e.g. T-Insurance)" value={item.description} onChange={e => updateRow('out', item.id, 'description', e.target.value)} className="flex-1 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 text-xs focus:outline-none focus:border-zinc-400" />
                  <div className="relative w-32">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                    <input type="number" placeholder="Amount" value={item.amount} onChange={e => updateRow('out', item.id, 'amount', e.target.value ? Number(e.target.value) : '')} className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 pl-6 text-xs focus:outline-none focus:border-zinc-400" />
                  </div>
                  <select value={item.category} onChange={e => updateRow('out', item.id, 'category', e.target.value)} className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 text-xs focus:outline-none focus:border-zinc-400 w-40">
                    <option value="Bills">Bills</option>
                    <option value="Equip & Contractors">Equip & Contractors</option>
                    <option value="Parts & Misc">Parts & Misc</option>
                    <option value="Payroll">Payroll</option>
                  </select>
                  <label className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase tracking-wider cursor-pointer w-24">
                    <input type="checkbox" checked={item.isRecurring} onChange={e => updateRow('out', item.id, 'isRecurring', e.target.checked)} className="accent-zinc-600" />
                    Recurring
                  </label>
                  <button type="button" onClick={() => removeRow('out', item.id)} className="text-red-500 hover:text-red-700 font-bold px-2">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-xl py-6 border-t border-zinc-300/50 dark:border-white/10 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <div className="max-w-[1200px] mx-auto px-8 lg:px-16 flex items-center justify-between">
              <div>
                {saveStatus === 'saved' && <p className="text-xs font-bold text-[#4A7C59] tracking-widest uppercase">✓ Saved to Database</p>}
                {saveStatus === 'error' && <p className="text-xs font-bold text-red-500 tracking-widest uppercase">⚠️ Error Saving Data</p>}
              </div>
              <button type="submit" disabled={isSaving} className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold uppercase tracking-[0.2em] text-xs px-10 py-4 rounded-none transition-all shadow-xl disabled:opacity-50">
                {isSaving ? 'Syncing...' : 'Publish Ledger Updates'}
              </button>
            </div>
          </div>

        </form>
      </main>
    </div>
  );
}
