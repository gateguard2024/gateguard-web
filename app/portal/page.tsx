"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@clerk/nextjs';

import BillingTab from './BillingTab';

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
  const [activeTab, setActiveTab] = useState<'systems' | 'service' | 'rms' | 'billing'>('systems');
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- RMS FORM STATE ---
  const defaultRmsData = {
    businessName: '', customerName: '', serviceAddress: '', cityStateZip: '', phone: '', email: '',
    billingName: '', billingAddress: '', billingCityStateZip: '', billingPhone: '', billingEmail: '',
    normalHours: { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' },
    monitoringHours: DAYS.reduce((acc, day) => ({ 
      ...acc, [day]: { s1: '', c1: false, s2: '', c2: false, s3: '', c3: false } 
    }), {}),
    cameraCount: '',
    cameraList: [{ number: '', location: '', view: '', expectedActivity: '' }],
    activityDescription: '', hasGuard: 'No', guardCompany: '', guardPhone: '',
    policePhone: '', firePhone: '', 
    janitorialCompany: '', janitorialPhone: '', janitorialSchedule: '',
    emergencyContacts: [{ name: '', role: '', phone: '' }],
    reportingContacts: [{ name: '', role: '', phone: '' }],
    authorizedEmployees: [{ name: '', role: '', phone: '' }],
    holidays: HOLIDAYS.reduce((acc, h) => ({ ...acc, [h.id]: { hours: '', monitoring247: 'No' } }), {}),
    customProcedures: [{ title: 'Procedure #1', details: '' }, { title: 'Procedure #2', details: '' }],
    specialNotes: ''
  };

  const [rmsData, setRmsData] = useState(defaultRmsData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // --- EFFECTS ---
  useEffect(() => {
    if (!isClerkLoaded) return;
    if (!user || !user.id) { setIsLoading(false); return; }
    
    async function fetchProperties(userId: string) {
      try {
        const { data } = await supabase.from('properties').select('*').ilike('manager_user_id', `%${userId}%`).order('name'); 
        if (data && data.length > 0) { setProperties(data); setSelectedPropertyId(data[0].id); }
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    }
    fetchProperties(user.id);
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

  // --- RMS FORM HANDLERS ---
  const handleSaveRms = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true); setSaveMessage('');
    try {
      const { error } = await supabase.from('properties').update({ rms_data: rmsData }).eq('id', selectedPropertyId);
      if (error) throw error;
      setSaveMessage('Form saved securely.'); setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) { setSaveMessage('Error saving. Please try again.'); } finally { setIsSaving(false); }
  };

  const handleSimpleChange = (e: any) => setRmsData({ ...rmsData, [e.target.name]: e.target.value });
  const updateNested = (category: string, field: string, value: string) => { setRmsData(prev => ({ ...prev, [category]: { ...(prev as any)[category], [field]: value } })); };
  const updateHoliday = (holiday: string, field: string, value: string) => { setRmsData(prev => ({ ...prev, holidays: { ...(prev as any).holidays, [holiday]: { ...(prev as any).holidays[holiday], [field]: value } } })); };
  const updateMonitoring = (day: string, field: string, value: string | boolean) => {
    setRmsData(prev => ({ ...prev, monitoringHours: { ...(prev as any).monitoringHours, [day]: { ...(prev as any).monitoringHours[day], [field]: value } } }));
  };
  const updateArray = (arrayName: string, index: number, field: string, value: string) => {
    const newArray = [...(rmsData as any)[arrayName]]; newArray[index] = { ...newArray[index], [field]: value }; setRmsData({ ...rmsData, [arrayName]: newArray });
  };
  const addArrayRow = (arrayName: string, template: any) => { setRmsData({ ...rmsData, [arrayName]: [...(rmsData as any)[arrayName], template] }); };
  const removeArrayRow = (arrayName: string, index: number) => {
    const newArray = [...(rmsData as any)[arrayName]]; newArray.splice(index, 1); setRmsData({ ...rmsData, [arrayName]: newArray });
  };

  if (!isClerkLoaded || isLoading) return <main className="bg-[#050505] text-white min-h-screen flex items-center justify-center"><h1 className="text-cyan-500 font-black uppercase tracking-widest text-sm">Loading...</h1></main>;

  const currentProperty = properties.find(p => p.id === selectedPropertyId) || null;
  const propertyName = currentProperty?.name || "Unassigned Property";
  const managerName = user?.fullName || user?.firstName || "Property Manager"; 
  
  // Dynamic URLs from Supabase
  const brivoUrl = currentProperty?.brivo_iframe_url || "https://account.brivo.com/global/index.html?useGlobalLogin=true";
  const eagleEyeUrl = currentProperty?.eagleeye_url || "https://camera.auth.eagleeyenetworks.com/login";
  const maintainxUrl = currentProperty?.maintainx_url || ""; // <-- ✨ DYNAMIC MAINTAINX LINK ✨

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
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
             <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Logged in as</p>
             <p className="text-xs text-white font-bold">{managerName}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-black text-zinc-400">
            {managerName.charAt(0)}
          </div>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT PORTION WITH FAINT BACKGROUND */}
        <div className="lg:w-2/3 relative flex flex-col bg-gradient-to-br from-[#050505] to-[#0a0f1a] overflow-hidden border-r border-white/5">
          <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "url('/hero-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}></div>
          
          <div className="flex overflow-x-auto border-b border-white/10 bg-[#0a0a0a] px-4 pt-4 shrink-0 z-10 relative">
            {/* 4 TABS NAVIGATION */}
            {[
              { id: 'systems', label: 'Systems', icon: '🔐' }, 
              { id: 'service', label: 'Request Service', icon: '🛠️' }, 
              { id: 'rms', label: 'Monitoring Setup', icon: '📋' }, 
              { id: 'billing', label: 'Billing', icon: '💳' }
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${ activeTab === tab.id ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'border-transparent text-zinc-500 hover:text-white' }`}>
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 lg:p-10 z-10 relative">
            
            {/* 1. SYSTEMS DASHBOARD */}
            {activeTab === 'systems' && (
              <div className="animate-[fadeIn_0.3s_ease-out] w-full max-w-4xl">
                 <h2 className="text-2xl font-black mb-1">Systems Overview</h2>
                 <p className="text-xs text-zinc-500 font-medium mb-8">Live status and access gateways for {propertyName}.</p>

                 <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl shadow-lg flex items-center justify-between mb-8">
                   <div className="flex items-center gap-5">
                     <div className="relative flex h-4 w-4">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                     </div>
                     <div>
                       <h3 className="text-lg font-black text-white tracking-wide">All Systems Operational</h3>
                       <p className="text-zinc-400 text-xs mt-1">Cameras, gates, and access controls are online.</p>
                     </div>
                   </div>
                   <div className="hidden sm:block">
                     <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                       Live Status
                     </span>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="group relative bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all duration-500 shadow-2xl flex flex-col">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                     <div className="absolute -inset-24 bg-cyan-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                     <div className="relative z-10 flex flex-col h-full">
                       <div className="w-16 h-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                         <span className="text-3xl">🔑</span>
                       </div>
                       <h3 className="text-xl font-black text-white mb-2">Brivo Access</h3>
                       <p className="text-sm text-zinc-400 leading-relaxed mb-8 flex-1">
                         Manage credentials, remote doors, and facility access through the secure Brivo enterprise gateway.
                       </p>
                       <a href={brivoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-cyan-600/10 hover:bg-cyan-600 text-cyan-400 hover:text-white border border-cyan-500/30 hover:border-cyan-500 text-xs font-black uppercase tracking-widest py-4 rounded-xl transition-all duration-300">
                         Launch Brivo Gateway <span className="text-lg">→</span>
                       </a>
                     </div>
                   </div>

                   <div className="group relative bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all duration-500 shadow-2xl flex flex-col">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                     <div className="absolute -inset-24 bg-indigo-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                     <div className="relative z-10 flex flex-col h-full">
                       <div className="w-16 h-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                         <span className="text-3xl">📷</span>
                       </div>
                       <h3 className="text-xl font-black text-white mb-2">Eagle Eye Networks</h3>
                       <p className="text-sm text-zinc-400 leading-relaxed mb-8 flex-1">
                         View live camera feeds and historical surveillance footage via the cloud VMS portal.
                       </p>
                       <a href={eagleEyeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 hover:border-indigo-500 text-xs font-black uppercase tracking-widest py-4 rounded-xl transition-all duration-300">
                         Launch Video VMS <span className="text-lg">→</span>
                       </a>
                     </div>
                   </div>
                 </div>
              </div>
            )}

            {/* 2. MAINTAINX IFRAME PORTAL */}
            {activeTab === 'service' && (
              <div className="h-full animate-[fadeIn_0.3s_ease-out] flex flex-col">
                 <div className="mb-6">
                   <h2 className="text-2xl font-black mb-1">Request Service</h2>
                   <p className="text-xs text-zinc-500 font-medium">Submit and track maintenance requests via our dedicated support portal.</p>
                 </div>
                 
                 <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden min-h-[600px] relative shadow-2xl flex items-center justify-center">
                    {maintainxUrl ? (
                      <iframe 
                         src={maintainxUrl} 
                         className="w-full h-full absolute top-0 left-0 border-0"
                         title="MaintainX Service Portal"
                      />
                    ) : (
                      <div className="text-center p-8 bg-black/40 rounded-xl border border-white/5">
                        <span className="text-4xl mb-4 block">🚧</span>
                        <h3 className="text-white font-bold mb-2">Portal Not Linked</h3>
                        <p className="text-zinc-500 text-sm max-w-xs mx-auto">The MaintainX portal URL has not been added to Supabase for this property yet.</p>
                      </div>
                    )}
                 </div>
              </div>
            )}

            {/* 3. ORIGINAL RMS FORM */}
            {activeTab === 'rms' && (
              <div className="max-w-5xl pb-10">
                 <h2 className="text-2xl font-black mb-1">Monitoring Setup</h2>
                 <p className="text-xs text-zinc-500 font-medium mb-8">Complete all sections. Data syncs instantly to our live Dispatch Center.</p>
                 
                 <form onSubmit={handleSaveRms} className="space-y-8 mt-6 backdrop-blur-sm">
                   <div className="bg-black/60 p-6 rounded-2xl border border-white/10 space-y-4">
                     <h3 className="text-sm font-black uppercase tracking-widest text-cyan-500 border-b border-white/10 pb-2 mb-4">Customer & Billing Information</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <input name="businessName" value={rmsData.businessName} onChange={handleSimpleChange} placeholder="Business Name" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                       <input name="customerName" value={rmsData.customerName} onChange={handleSimpleChange} placeholder="Customer Name" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                       <input name="serviceAddress" value={rmsData.serviceAddress} onChange={handleSimpleChange} placeholder="Service Address" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                       <input name="cityStateZip" value={rmsData.cityStateZip} onChange={handleSimpleChange} placeholder="City, State, Zip" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                       <input name="phone" value={rmsData.phone} onChange={handleSimpleChange} placeholder="Phone" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                       <input name="email" value={rmsData.email} onChange={handleSimpleChange} placeholder="Email" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                     </div>
                     <p className="text-xs text-zinc-500 mt-4 font-bold uppercase">Billing Information (If Different)</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <input name="billingName" value={rmsData.billingName} onChange={handleSimpleChange} placeholder="Billing Name" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                       <input name="billingAddress" value={rmsData.billingAddress} onChange={handleSimpleChange} placeholder="Billing Address" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                     </div>
                   </div>

                   <div className="bg-black/60 p-6 rounded-2xl border border-white/10 space-y-4 overflow-x-auto">
                     <h3 className="text-sm font-black uppercase tracking-widest text-cyan-500 border-b border-white/10 pb-2 mb-4">Normal & Monitoring Hours</h3>
                     <div className="min-w-[850px]">
                       <div className="grid grid-cols-5 gap-4 mb-2">
                         <div className="text-[10px] font-bold text-zinc-500 uppercase">Day</div>
                         <div className="text-[10px] font-bold text-zinc-500 uppercase">Operating Hours</div>
                         <div className="text-[10px] font-bold text-cyan-400 uppercase">Shift 1 (Hours & Concierge)</div>
                         <div className="text-[10px] font-bold text-cyan-400 uppercase">Shift 2 (Hours & Concierge)</div>
                         <div className="text-[10px] font-bold text-cyan-400 uppercase">Shift 3 (Hours & Concierge)</div>
                       </div>
                       {DAYS.map(day => (
                         <div key={day} className="grid grid-cols-5 gap-4 items-center mb-3">
                           <span className="text-xs font-medium capitalize">{day}</span>
                           <input placeholder="e.g. 9am-5pm" value={(rmsData.normalHours as any)[day]} onChange={e => updateNested('normalHours', day, e.target.value)} className="bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                           <div className="flex items-center gap-2">
                             <input placeholder="e.g. 5pm-10pm" value={(rmsData.monitoringHours as any)[day].s1} onChange={e => updateMonitoring(day, 's1', e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg px-2 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                             <label className="flex flex-col items-center justify-center text-[8px] text-zinc-500 uppercase font-bold cursor-pointer"><input type="checkbox" checked={(rmsData.monitoringHours as any)[day].c1} onChange={e => updateMonitoring(day, 'c1', e.target.checked)} className="mb-1 accent-cyan-500" /> Concierge</label>
                           </div>
                           <div className="flex items-center gap-2">
                             <input placeholder="e.g. 10pm-2am" value={(rmsData.monitoringHours as any)[day].s2} onChange={e => updateMonitoring(day, 's2', e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg px-2 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                             <label className="flex flex-col items-center justify-center text-[8px] text-zinc-500 uppercase font-bold cursor-pointer"><input type="checkbox" checked={(rmsData.monitoringHours as any)[day].c2} onChange={e => updateMonitoring(day, 'c2', e.target.checked)} className="mb-1 accent-cyan-500" /> Concierge</label>
                           </div>
                           <div className="flex items-center gap-2">
                             <input placeholder="e.g. 2am-6am" value={(rmsData.monitoringHours as any)[day].s3} onChange={e => updateMonitoring(day, 's3', e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg px-2 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                             <label className="flex flex-col items-center justify-center text-[8px] text-zinc-500 uppercase font-bold cursor-pointer"><input type="checkbox" checked={(rmsData.monitoringHours as any)[day].c3} onChange={e => updateMonitoring(day, 'c3', e.target.checked)} className="mb-1 accent-cyan-500" /> Concierge</label>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>

                   <div className="bg-black/60 p-6 rounded-2xl border border-white/10 space-y-6">
                     <h3 className="text-sm font-black uppercase tracking-widest text-cyan-500 border-b border-white/10 pb-2">Site Background & Camera Layout</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <input type="number" name="cameraCount" value={rmsData.cameraCount} onChange={handleSimpleChange} placeholder="Total # of Cameras" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                       <select name="hasGuard" value={rmsData.hasGuard} onChange={handleSimpleChange} className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none"><option value="No">No Guard Service</option><option value="Yes">Has Guard/Patrol Service</option></select>
                       {rmsData.hasGuard === 'Yes' && <input name="guardCompany" value={rmsData.guardCompany} onChange={handleSimpleChange} placeholder="Guard Company Name & Phone" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />}
                     </div>
                     <div className="space-y-2 mt-4">
                       <div className="flex justify-between items-center mb-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Camera Directory</label>
                         <button type="button" onClick={() => addArrayRow('cameraList', { number: '', location: '', view: '', expectedActivity: '' })} className="text-[10px] font-bold text-cyan-500 hover:text-cyan-400">+ Add Camera</button>
                       </div>
                       {rmsData.cameraList.map((cam: any, idx: number) => (
                         <div key={idx} className="flex gap-2 items-center">
                           <input placeholder="Cam #" value={cam.number} onChange={e => updateArray('cameraList', idx, 'number', e.target.value)} className="w-20 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                           <input placeholder="Location" value={cam.location} onChange={e => updateArray('cameraList', idx, 'location', e.target.value)} className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                           <input placeholder="View" value={cam.view} onChange={e => updateArray('cameraList', idx, 'view', e.target.value)} className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                           <input placeholder="Expected Activity" value={cam.expectedActivity} onChange={e => updateArray('cameraList', idx, 'expectedActivity', e.target.value)} className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                           <button type="button" onClick={() => removeArrayRow('cameraList', idx)} className="text-red-500 hover:text-red-400 text-xs font-bold px-2">X</button>
                         </div>
                       ))}
                     </div>
                     <textarea name="activityDescription" value={rmsData.activityDescription} onChange={handleSimpleChange} placeholder="Describe typical activity across the site..." rows={3} className="w-full mt-2 bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none resize-none"></textarea>
                   </div>

                   <div className="bg-black/60 p-6 rounded-2xl border border-white/10 space-y-4">
                     <h3 className="text-sm font-black uppercase tracking-widest text-cyan-500 border-b border-white/10 pb-2 mb-4">Additional Contacts: EMS & Staff</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <input name="policePhone" value={rmsData.policePhone} onChange={handleSimpleChange} placeholder="Local Police Dept Phone" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                       <input name="firePhone" value={rmsData.firePhone} onChange={handleSimpleChange} placeholder="Local Fire Dept Phone" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                       <input name="janitorialCompany" value={rmsData.janitorialCompany} onChange={handleSimpleChange} placeholder="Janitorial/Maintenance Company" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                       <input name="janitorialSchedule" value={rmsData.janitorialSchedule} onChange={handleSimpleChange} placeholder="Maintenance Visit Schedule" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                     </div>
                   </div>

                   <div className="bg-black/60 p-6 rounded-2xl border border-white/10 space-y-6">
                     <h3 className="text-sm font-black uppercase tracking-widest text-cyan-500 border-b border-white/10 pb-2 mb-4">Personnel Directories</h3>
                     {[
                       { title: 'Emergency Contacts', key: 'emergencyContacts' },
                       { title: 'Reporting Contacts', key: 'reportingContacts' },
                       { title: 'Authorized After-hours Employees', key: 'authorizedEmployees' }
                     ].map(table => (
                       <div key={table.key}>
                         <div className="flex justify-between items-center mb-2">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{table.title}</label>
                           <button type="button" onClick={() => addArrayRow(table.key, { name: '', role: '', phone: '' })} className="text-[10px] font-bold text-cyan-500 hover:text-cyan-400">+ Add Row</button>
                         </div>
                         <div className="space-y-2">
                           {(rmsData as any)[table.key].map((contact: any, idx: number) => (
                             <div key={idx} className="flex gap-2 items-center">
                               <input placeholder="Name" value={contact.name} onChange={e => updateArray(table.key, idx, 'name', e.target.value)} className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                               <input placeholder="Role" value={contact.role} onChange={e => updateArray(table.key, idx, 'role', e.target.value)} className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                               <input placeholder="Phone" value={contact.phone} onChange={e => updateArray(table.key, idx, 'phone', e.target.value)} className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                               <button type="button" onClick={() => removeArrayRow(table.key, idx)} className="text-red-500 hover:text-red-400 text-xs font-bold px-2">X</button>
                             </div>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>

                   <div className="bg-black/60 p-6 rounded-2xl border border-white/10 space-y-4">
                     <h3 className="text-sm font-black uppercase tracking-widest text-cyan-500 border-b border-white/10 pb-2 mb-4">Holidays & Special Hours</h3>
                     <div className="grid grid-cols-3 gap-4 mb-2">
                       <div className="text-[10px] font-bold text-zinc-500 uppercase">Holiday</div>
                       <div className="text-[10px] font-bold text-zinc-500 uppercase">Special Hours (if any)</div>
                       <div className="text-[10px] font-bold text-zinc-500 uppercase">24/7 Monitoring?</div>
                     </div>
                     {HOLIDAYS.map(h => (
                       <div key={h.id} className="grid grid-cols-3 gap-4 items-center">
                         <span className="text-xs font-medium">{h.label}</span>
                         <input type="text" placeholder="e.g. Closed" value={(rmsData.holidays as any)[h.id].hours} onChange={e => updateHoliday(h.id, 'hours', e.target.value)} className="bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                         <select value={(rmsData.holidays as any)[h.id].monitoring247} onChange={e => updateHoliday(h.id, 'monitoring247', e.target.value)} className="bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none"><option>No</option><option>Yes</option></select>
                       </div>
                     ))}
                   </div>

                   <div className="bg-black/60 p-6 rounded-2xl border border-white/10 space-y-6">
                     <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
                       <h3 className="text-sm font-black uppercase tracking-widest text-cyan-500">Custom Procedures</h3>
                       <button type="button" onClick={() => addArrayRow('customProcedures', { title: `Procedure #${rmsData.customProcedures.length + 1}`, details: '' })} className="text-[10px] font-bold text-cyan-500 hover:text-cyan-400">+ Add Procedure</button>
                     </div>
                     <div className="space-y-6">
                       {rmsData.customProcedures.map((proc: any, idx: number) => (
                         <div key={idx} className="space-y-2 border border-white/5 p-4 rounded-lg bg-black/40 relative">
                           <button type="button" onClick={() => removeArrayRow('customProcedures', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-xs font-bold">Delete</button>
                           <input placeholder="Procedure Title" value={proc.title} onChange={e => updateArray('customProcedures', idx, 'title', e.target.value)} className="w-5/6 bg-transparent text-sm font-bold text-white focus:outline-none border-b border-zinc-800 pb-2 mb-2" />
                           <textarea placeholder="List steps..." value={proc.details} onChange={e => updateArray('customProcedures', idx, 'details', e.target.value)} rows={4} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none resize-none"></textarea>
                         </div>
                       ))}
                     </div>
                   </div>

                   <div className="bg-black/60 p-6 rounded-2xl border border-white/10 space-y-4">
                     <h3 className="text-sm font-black uppercase tracking-widest text-cyan-500 border-b border-white/10 pb-2 mb-4">Special Notes</h3>
                     <textarea name="specialNotes" value={rmsData.specialNotes} onChange={handleSimpleChange} placeholder="Enter any overarching site rules or specific warnings here..." rows={6} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none resize-none"></textarea>
                   </div>

                   <div className="flex items-center justify-between sticky bottom-0 bg-[#050505]/90 backdrop-blur-md py-4 border-t border-white/10 z-10">
                     <span className="text-xs text-cyan-500 font-bold">{saveMessage}</span>
                     <button type="submit" disabled={isSaving} className="bg-cyan-600 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-500 transition-colors">
                       {isSaving ? 'Syncing...' : 'Save Service Order Form'}
                     </button>
                   </div>
                 </form>
              </div>
            )}
            
            {/* 4. BILLING DASHBOARD */}
            {activeTab === 'billing' && (
              <div className="h-full animate-[fadeIn_0.3s_ease-out]">
                 <h2 className="text-2xl font-black mb-4">Financial Overview: {propertyName}</h2>
                 <BillingTab qboCustomerId={currentProperty?.qbo_customer_id} />
              </div>
            )}

          </div>
        </div>

        {/* RIGHT SIDEBAR SOC FEED */}
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
