"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser, useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getSupabase } from '@/lib/supabaseClient';

type LedgerItem = { id: string; date: string; description: string; amount: number | ''; category: string; isRecurring: boolean; };
type ReceivableItem = { id: string; invoiceDate: string; clientName: string; amount: number | ''; };

export default function AdminPortal() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [isLoadingData, setIsLoadingData] = useState(true);

  const ADMIN_EMAILS = ['rfeldman@gateguard.co', 'sprabhu@gateguard.co']; 

  const [baseCash, setBaseCash] = useState<number | ''>('');
  const [receivables, setReceivables] = useState<ReceivableItem[]>([]);
  const [inflows, setInflows] = useState<LedgerItem[]>([]);
  const [outflows, setOutflows] = useState<LedgerItem[]>([]);

  // FETCH INITIAL DATA FROM SUPABASE
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = await getToken({ template: 'supabase' });
        if (!token) return;
        const supabase = await getSupabase(token);

        const [cashRes, recRes, ledgerRes] = await Promise.all([
          supabase.from('core_metrics').select('base_cash').eq('id', 1).single(),
          supabase.from('receivables').select('*'),
          supabase.from('ledgers').select('*')
        ]);

        if (cashRes.data) setBaseCash(cashRes.data.base_cash);
        if (recRes.data) {
          setReceivables(recRes.data.map((r: any) => ({ id: r.id, invoiceDate: r.invoice_date, clientName: r.client_name, amount: r.amount })));
        }
        if (ledgerRes.data) {
          setInflows(ledgerRes.data.filter((l: any) => l.type === 'in').map((l: any) => ({ id: l.id, date: l.date, description: l.description, amount: l.amount, category: l.category, isRecurring: l.is_recurring })));
          setOutflows(ledgerRes.data.filter((l: any) => l.type === 'out').map((l: any) => ({ id: l.id, date: l.date, description: l.description, amount: l.amount, category: l.category, isRecurring: l.is_recurring })));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isLoaded && isSignedIn) fetchInitialData();
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded || isLoadingData) return <div className="min-h-screen bg-zinc-200 dark:bg-[#0A0A0A] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-white"></div></div>;
  if (!isSignedIn) redirect('/login');
  
  const userEmail = user.primaryEmailAddress?.emailAddress || '';
  if (!ADMIN_EMAILS.includes(userEmail)) redirect('/portal');

  const addReceivable = () => setReceivables([...receivables, { id: Date.now().toString(), invoiceDate: '', clientName: '', amount: '' }]);
  const removeReceivable = (id: string) => setReceivables(receivables.filter(item => item.id !== id));
  const updateReceivable = (id: string, field: keyof ReceivableItem, value: any) => setReceivables(receivables.map(item => item.id === id ? { ...item, [field]: value } : item));

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
      const token = await getToken({ template: 'supabase' });
      if (!token) throw new Error("No auth token");
      const supabase = await getSupabase(token);

      // We added .throwOnError() to all of these!
      await supabase.from('core_metrics').upsert({ id: 1, base_cash: Number(baseCash) }).throwOnError();

      await supabase.from('receivables').delete().neq('id', '00000000-0000-0000-0000-000000000000').throwOnError();
      if (receivables.length > 0) {
        await supabase.from('receivables').insert(receivables.map(r => ({ invoice_date: r.invoiceDate, client_name: r.clientName, amount: Number(r.amount) }))).throwOnError();
      }

      await supabase.from('ledgers').delete().neq('id', '00000000-0000-0000-0000-000000000000').throwOnError();
      const combinedLedger = [
        ...inflows.map(i => ({ type: 'in', date: i.date, description: i.description, amount: Number(i.amount), category: i.category, is_recurring: i.isRecurring })),
        ...outflows.map(o => ({ type: 'out', date: o.date, description: o.description, amount: Number(o.amount), category: o.category, is_recurring: o.isRecurring }))
      ];
      if (combinedLedger.length > 0) {
        await supabase.from('ledgers').insert(combinedLedger).throwOnError();
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 4000);
    } catch (err: any) {
      // THIS WILL PRINT THE EXACT REASON TO YOUR BROWSER
      console.error("🚨 PUBLISH BLOCKED BY SUPABASE:", err.message || err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const getAgingBadge = (dateString: string) => {
    if (!dateString) return null;
    const diffDays = Math.ceil((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24)); 
    if (diffDays <= 30 || new Date(dateString) > new Date()) return <span className="text-[9px] font-bold text-[#4A7C59] bg-[#4A7C59]/10 px-2 py-1 rounded">Current</span>;
    if (diffDays <= 60) return <span className="text-[9px] font-bold text-[#8C7A54] bg-[#C5B382]/20 px-2 py-1 rounded">31-60 Days</span>;
    if (diffDays <= 90) return <span className="text-[9px] font-bold text-orange-600 bg-orange-500/10 px-2 py-1 rounded">61-90 Days</span>;
    return <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded">90+ Days</span>;
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <main className="bg-zinc-200 dark:bg-[#0A0A0A] text-zinc-900 dark:text-zinc-50 min-h-screen font-sans selection:bg-zinc-300 dark:selection:bg-zinc-700 flex flex-col transition-colors duration-500 relative pb-32">
        <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

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
          
          <div className="bg-white dark:bg-[#121212] p-8 rounded-2xl border border-zinc-300/50 dark:border-white/5 shadow-md">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-zinc-800 dark:text-white mb-6 border-b border-zinc-100 dark:border-white/5 pb-4">1. Core Liquidity</h3>
            <div className="max-w-md">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2 block">Current Bank Balance</label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400 font-normal text-xl border-r border-zinc-200 dark:border-zinc-700 pr-3">$</span>
                <input type="number" required value={baseCash} onChange={(e) => setBaseCash(e.target.value ? Number(e.target.value) : '')} className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-xl font-normal text-zinc-900 dark:text-white focus:outline-none focus:border-[#8C7A54] transition-colors" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#121212] p-8 rounded-2xl border border-zinc-300/50 dark:border-white/5 shadow-md">
            <div className="flex items-center justify-between mb-6 border-b border-zinc-100 dark:border-white/5 pb-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-zinc-800 dark:text-white">2. Outstanding Receivables</h3>
                <p className="text-[10px] text-zinc-500 mt-1">Aging buckets are calculated automatically based on the invoice date.</p>
              </div>
              <button type="button" onClick={addReceivable} className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-widest hover:text-zinc-500">+ Add Invoice</button>
            </div>
            
            <div className="space-y-3">
              {receivables.map((item) => (
                <div key={item.id} className="flex flex-wrap md:flex-nowrap items-center gap-3 p-3 bg-zinc-50 dark:bg-[#1A1A1A] border border-zinc-200 dark:border-white/5 rounded-xl">
                  <input type="date" value={item.invoiceDate} onChange={e => updateReceivable(item.id, 'invoiceDate', e.target.value)} className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 text-xs focus:outline-none focus:border-zinc-400 w-32" />
                  <input type="text" placeholder="Client / Who Owes" value={item.clientName} onChange={e => updateReceivable(item.id, 'clientName', e.target.value)} className="flex-1 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 text-xs focus:outline-none focus:border-zinc-400" />
                  <div className="relative w-40">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                    <input type="number" placeholder="Amount" value={item.amount} onChange={e => updateReceivable(item.id, 'amount', e.target.value ? Number(e.target.value) : '')} className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 pl-6 text-xs focus:outline-none focus:border-zinc-400" />
                  </div>
                  <div className="w-24 flex justify-center">{getAgingBadge(item.invoiceDate)}</div>
                  <button type="button" onClick={() => removeReceivable(item.id)} className="text-red-500 hover:text-red-700 font-bold px-2">✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#121212] p-8 rounded-2xl border border-zinc-300/50 dark:border-white/5 shadow-md">
            <div className="flex items-center justify-between mb-6 border-b border-zinc-100 dark:border-white/5 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-[#4A7C59]">3. Expected Inflows</h3>
              <button type="button" onClick={() => addRow('in')} className="text-[10px] font-bold text-[#4A7C59] uppercase tracking-widest hover:text-[#3B6347]">+ Add Row</button>
            </div>
            
            <div className="space-y-3">
              {inflows.map((item) => (
                <div key={item.id} className="flex flex-wrap md:flex-nowrap items-center gap-3 p-3 bg-zinc-50 dark:bg-[#1A1A1A] border border-zinc-200 dark:border-white/5 rounded-xl">
                  <input type="date" value={item.date} onChange={e => updateRow('in', item.id, 'date', e.target.value)} className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 text-xs focus:outline-none focus:border-[#4A7C59] w-32" />
                  <input type="text" placeholder="Description" value={item.description} onChange={e => updateRow('in', item.id, 'description', e.target.value)} className="flex-1 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 text-xs focus:outline-none focus:border-[#4A7C59]" />
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

          <div className="bg-white dark:bg-[#121212] p-8 rounded-2xl border border-zinc-300/50 dark:border-white/5 shadow-md">
            <div className="flex items-center justify-between mb-6 border-b border-zinc-100 dark:border-white/5 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-zinc-800 dark:text-white">4. Expected Outflows</h3>
              <button type="button" onClick={() => addRow('out')} className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-widest hover:text-zinc-500">+ Add Row</button>
            </div>
            
            <div className="space-y-3">
              {outflows.map((item) => (
                <div key={item.id} className="flex flex-wrap md:flex-nowrap items-center gap-3 p-3 bg-zinc-50 dark:bg-[#1A1A1A] border border-zinc-200 dark:border-white/5 rounded-xl">
                  <input type="date" value={item.date} onChange={e => updateRow('out', item.id, 'date', e.target.value)} className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 text-xs focus:outline-none focus:border-zinc-400 w-32" />
                  <input type="text" placeholder="Description" value={item.description} onChange={e => updateRow('out', item.id, 'description', e.target.value)} className="flex-1 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded p-2 text-xs focus:outline-none focus:border-zinc-400" />
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
