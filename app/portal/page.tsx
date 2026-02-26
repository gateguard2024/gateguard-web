"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@clerk/nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const HOLIDAYS = [
  { id: 'newYears', label: "New Year's Day" }, { id: 'mlk', label: "MLK Day" },
  { id: 'presidents', label: "President's Day" }, { id: 'memorial', label: "Memorial Day" },
  { id: 'juneteenth', label: "Juneteenth" }, { id: 'independence', label: "Independence Day" },
  { id: 'labor', label: "Labor Day" }, { id: 'columbus', label: "Columbus Day" },
  { id: 'veterans', label: "Veteran's Day" }, { id: 'thanksgiving', label: "Thanksgiving" },
  { id: 'christmas', label: "Christmas Day" }
];

export default function ClientPortal() {
  const { user, isLoaded: isClerkLoaded } = useUser(); 
  const [activeTab, setActiveTab] = useState<'brivo' | 'billing' | 'rms' | 'support'>('brivo');
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ---------------------------------------------------------
  // 📋 THE MASTER JSON STATE (Upgraded to 3 Shifts)
  // ---------------------------------------------------------
  const defaultRmsData = {
    businessName: '', customerName: '', serviceAddress: '', cityStateZip: '', phone: '', email: '',
    billingName: '', billingAddress: '', billingCityStateZip: '', billingPhone: '', billingEmail: '',
    normalHours: { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' },
    monitoringHours1: { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' },
    monitoringHours2: { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' },
    monitoringHours3: { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' }, // NEW SHIFT 3
    cameraCount: '', activityDescription: '', hasGuard: 'No', guardCompany: '', guardPhone: '',
    policePhone: '', firePhone: '', janitorialCompany: '', janitorialPhone: '', janitorialSchedule: '',
    emergencyContacts: [{ name: '', role: '', phone: '' }],
    reportingContacts: [{ name: '', role: '', phone: '' }],
    authorizedEmployees: [{ name: '', role: '', phone: '' }],
    holidays: HOLIDAYS.reduce((acc, h) => ({ ...acc, [h.id]: { hours: '', monitoring247: 'No' } }), {}),
    customProcedures: [{ title: 'Procedure Example #1', details: '' }]
  };

  const [rmsData, setRmsData] = useState(defaultRmsData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (!isClerkLoaded) return;
    if (!user || !user.id) { setIsLoading(false); return; }
    async function fetchProperties() {
      try {
        const { data } = await supabase.from('properties').select('*').eq('manager_user_id', user?.id).order('name'); 
        if (data && data.length > 0) { setProperties(data); setSelectedPropertyId(data[0].id); }
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    }
    fetchProperties();
  }, [isClerkLoaded, user]);

  useEffect(() => {
    if (!selectedPropertyId) return;
    async function fetchAlerts() {
      try {
        const { data } = await supabase.from('soc_alerts').select('*').eq('property_id', selectedPropertyId).order('created_at', { ascending: false }); 
        if (data) setAlerts(data);
      } catch (err) { console.error(err); }
    }
    fetchAlerts();

    const currentProp = properties.find(p => p.id === selectedPropertyId);
    if (currentProp && currentProp.rms_data) {
      setRmsData(prev => ({ ...defaultRmsData, ...currentProp.rms_data }));
    } else {
      setRmsData(defaultRmsData);
    }
  }, [selectedPropertyId, properties]);

  const handleSaveRms = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true); setSaveMessage('');
    try {
      const { error } = await supabase.from('properties').update({ rms_data: rmsData }).eq('id', selectedPropertyId);
      if (error) throw error;
      setSaveMessage('Form saved securely.'); setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) { setSaveMessage('Error saving. Please try again.'); } finally { setIsSaving(false); }
  };

  const updateNested = (category: string, field: string, value: string) => { setRmsData(prev => ({ ...prev, [category]: { ...(prev as any)[category], [field]: value } })); };
  const updateHoliday = (holiday: string, field: string, value: string) => { setRmsData(prev => ({ ...prev, holidays: { ...(prev as any).holidays, [holiday]: { ...(prev as any).holidays[holiday], [field]: value } } })); };
  const updateArray = (arrayName: string, index: number, field: string, value: string) => {
    const newArray = [...(rmsData as any)[arrayName]]; newArray[index] = { ...newArray[index], [field]: value }; setRmsData({ ...rmsData, [arrayName]: newArray });
  };
  const addArrayRow = (arrayName: string, template: any) => { setRmsData({ ...rmsData, [arrayName]: [...(rmsData as any)[arrayName], template] }); };
  const handleSimpleChange = (e: any) => setRmsData({ ...rmsData, [e.target.name]: e.target.value });

  if (!isClerkLoaded || isLoading) return <main className="bg-[#050505] text-white min-h-screen flex items-center justify-center"><h1 className="text-cyan-500 font-black uppercase tracking-widest text-sm">Loading...</h1></main>;

  const currentProperty = properties.find(p => p.id === selectedPropertyId) || null;
  const propertyName = currentProperty?.name || "Unassigned Property";
  const managerName = currentProperty?.manager_name || user?.firstName || "Client";
  const brivoUrl = currentProperty?.brivo_iframe_url || "";

  return (
    <main className="bg-[#050505] text-white min-h-screen font-sans selection:bg-cyan-500/30 flex flex-col overflow-hidden">
      
      {/* HEADER */}
      <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-xl flex items-center justify-between px-6 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/"><Image src="/logo.png" alt="Gate Guard" width={32} height={32} /></Link>
          <div className="w-[1px] h-6 bg-white/10"></div>
          <div>
            {properties.length > 1 ? (
              <select value={selectedPropertyId || ''} onChange={(e) => setSelectedPropertyId(e.target.value)} className="bg-transparent text-sm font-black tracking-widest uppercase text-white outline-none cursor-pointer">
                {properties.map(p => <option key={p.id} value={p.id} className="bg-[#111]">{p.name}</option>)}
              </select>
            ) : <h1 className="text-sm font-black tracking-widest uppercase text-white">{propertyName}</h1>}
            <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mt-0.5">Property Command Center</p>
          </div>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT PORTION */}
        <div className="lg:w-2/3 flex flex-col bg-gradient-to-br from-[#050505] to-[#0a0f1a] overflow-hidden border-r border-white/5">
          <div className="flex overflow-x-auto border-b border-white/10 bg-[#0a0a0a] px-4 pt-4">
            {[{ id: 'brivo', label: 'Access Control', icon: '🔑' }, { id: 'rms', label: 'Service Order Form', icon: '📋' }, { id: 'billing', label: 'Billing & Invoices', icon: '💳' }].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${ activeTab === tab.id ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5' : 'border-transparent text-zinc-500' }`}>
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 lg:p-10">
            {activeTab === 'brivo' && ( <div className="h-full"><iframe src={brivoUrl} className="w-full h-full rounded-2xl border border-zinc-800 bg-black"></iframe></div> )}

            {/* 📋 RMS FORM */}
            {activeTab === 'rms' && (
              <div className="max-w-5xl pb-10">
                 <h2 className="text-2xl font-black mb-1">Remote Monitoring Service Form</h2>
                 <form onSubmit={handleSaveRms} className="space-y-8 mt-6">
                    
                    {/* SCHEDULES - UPDATED TO 5 COLUMNS (3 SHIFTS) */}
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/10 space-y-4 overflow-x-auto">
                      <h3 className="text-sm font-black uppercase tracking-widest text-cyan-500 border-b border-white/10 pb-2 mb-4">Site Schedules</h3>
                      <div className="min-w-[700px]">
                        <div className="grid grid-cols-5 gap-4 mb-2">
                          <div className="text-[10px] font-bold text-zinc-500 uppercase">Day</div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase">Operating Hours</div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase text-cyan-400">Monitoring Shift 1</div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase text-cyan-400">Monitoring Shift 2</div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase text-cyan-400">Monitoring Shift 3</div>
                        </div>
                        {DAYS.map(day => (
                          <div key={day} className="grid grid-cols-5 gap-4 items-center mb-2">
                            <span className="text-xs font-medium capitalize">{day}</span>
                            <input placeholder="e.g. 9am-5pm or N/A" value={(rmsData.normalHours as any)[day]} onChange={e => updateNested('normalHours', day, e.target.value)} className="bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                            <input placeholder="e.g. 5pm-10pm or N/A" value={(rmsData.monitoringHours1 as any)[day]} onChange={e => updateNested('monitoringHours1', day, e.target.value)} className="bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                            <input placeholder="e.g. 10pm-2am or N/A" value={(rmsData.monitoringHours2 as any)[day]} onChange={e => updateNested('monitoringHours2', day, e.target.value)} className="bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                            <input placeholder="e.g. 2am-6am or N/A" value={(rmsData.monitoringHours3 as any)[day]} onChange={e => updateNested('monitoringHours3', day, e.target.value)} className="bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PROCEDURES - DYNAMIC */}
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/10 space-y-6">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-cyan-500">Custom Procedures</h3>
                        <button type="button" onClick={() => addArrayRow('customProcedures', { title: `Procedure #${rmsData.customProcedures.length + 1}`, details: '' })} className="text-[10px] font-bold text-cyan-500 hover:text-cyan-400">+ Add Procedure</button>
                      </div>
                      
                      <div className="space-y-6">
                        {rmsData.customProcedures.map((proc: any, idx: number) => (
                          <div key={idx} className="space-y-2 border border-white/5 p-4 rounded-lg bg-black/50">
                            <input 
                              placeholder="Procedure Title (e.g. Trespassing Observed)" 
                              value={proc.title} 
                              onChange={e => updateArray('customProcedures', idx, 'title', e.target.value)} 
                              className="w-full bg-transparent text-sm font-bold text-white focus:outline-none border-b border-zinc-800 pb-2 mb-2" 
                            />
                            <textarea 
                              placeholder="1. Audio deterrent initiated...&#10;2. Local police informed..." 
                              value={proc.details} 
                              onChange={e => updateArray('customProcedures', idx, 'details', e.target.value)} 
                              rows={4} 
                              className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none resize-none"
                            ></textarea>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SAVE BUTTON */}
                    <div className="flex items-center justify-between sticky bottom-0 bg-[#050505] py-4 border-t border-white/10 z-10">
                      <span className="text-xs text-cyan-500 font-bold">{saveMessage}</span>
                      <button type="submit" disabled={isSaving} className="bg-cyan-600 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-500 transition-colors">
                        {isSaving ? 'Syncing...' : 'Save Order Form'}
                      </button>
                    </div>
                 </form>
              </div>
            )}
            
            {activeTab === 'billing' && (
              <div className="h-full animate-[fadeIn_0.3s_ease-out]">
                 <h2 className="text-2xl font-black mb-4">Financial Overview: {propertyName}</h2>
                 <div className="bg-[#111] border border-white/10 p-6 rounded-xl max-w-md">
                   <p className="text-sm text-zinc-400 mb-1">Current Balance</p>
                   <p className="text-4xl font-black text-white mb-6">{currentProperty?.current_balance || "$0.00"}</p>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* 🚨 RIGHT SIDEBAR */}
        <div className="lg:w-1/3 bg-gradient-to-b from-[#0a1128] to-[#040812] border-l border-white/5 flex flex-col h-[600px] lg:h-auto z-10 relative">
          <div className="p-6 border-b border-blue-900/30 shrink-0 bg-[#0a1128] z-20">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]"></span> Live SOC Feed
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-20">
             {alerts.length === 0 ? (
                <div className="text-center text-blue-400/50 text-xs py-10 font-medium">Monitoring online. No recent alerts.</div>
             ) : (
                alerts.map(alert => (
                  <div key={alert.id} className="p-4 rounded-xl border border-blue-500/20 bg-blue-900/30 text-blue-100 text-sm flex flex-col gap-2">
                    <p className="font-bold text-[10px] text-blue-300 uppercase tracking-wider">{alert.sender} • {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="leading-relaxed">{alert.message}</p>
                    {alert.image_url && <img src={alert.image_url} alt="Alert Evidence" className="mt-2 rounded-lg w-full h-auto object-contain max-h-48 border border-blue-500/40" />}
                  </div>
                ))
             )}
          </div>
        </div>
      </div>
    </main>
  );
}
