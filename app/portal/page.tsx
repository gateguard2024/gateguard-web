"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@clerk/nextjs';

// ---------------------------------------------------------
// 🔌 SUPABASE CONNECTION
// ---------------------------------------------------------
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
  // 📋 THE MASTER JSON STATE (Maps directly to Eagle Eye PDF)
  // ---------------------------------------------------------
  const defaultRmsData = {
    // Customer Info
    businessName: '', customerName: '', serviceAddress: '', cityStateZip: '', phone: '', email: '',
    // Billing Info
    billingName: '', billingAddress: '', billingCityStateZip: '', billingPhone: '', billingEmail: '',
    // Hours
    normalHours: { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' },
    monitoringHours: { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' },
    // Site Background
    cameraCount: '', activityDescription: '', hasGuard: 'No', guardCompany: '', guardPhone: '',
    // Emergency & Janitorial Services
    policePhone: '', firePhone: '', janitorialCompany: '', janitorialPhone: '', janitorialSchedule: '',
    // Contact Tables
    emergencyContacts: [{ name: '', role: '', phone: '' }],
    reportingContacts: [{ name: '', role: '', phone: '' }],
    authorizedEmployees: [{ name: '', role: '', phone: '' }],
    // Holidays
    holidays: HOLIDAYS.reduce((acc, h) => ({ ...acc, [h.id]: { hours: '', monitoring247: 'No' } }), {}),
    // Procedures & Requirements
    otherRequirements: ''
  };

  const [rmsData, setRmsData] = useState(defaultRmsData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (!isClerkLoaded) return;
    if (!user || !user.id) {
      setIsLoading(false);
      return;
    }
    async function fetchProperties(userId: string) {
      try {
        const { data } = await supabase.from('properties').select('*').eq('manager_user_id', userId).order('name'); 
        if (data && data.length > 0) {
          setProperties(data);
          setSelectedPropertyId(data[0].id); 
        }
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

  const handleSaveRms = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    try {
      const { error } = await supabase.from('properties').update({ rms_data: rmsData }).eq('id', selectedPropertyId);
      if (error) throw error;
      setSaveMessage('Form saved securely.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage('Error saving. Please try again.');
    } finally { setIsSaving(false); }
  };

  // State Updaters for nested JSON
  const updateNested = (category: string, field: string, value: string) => {
    setRmsData(prev => ({ ...prev, [category]: { ...(prev as any)[category], [field]: value } }));
  };
  const updateHoliday = (holiday: string, field: string, value: string) => {
    setRmsData(prev => ({ ...prev, holidays: { ...(prev as any).holidays, [holiday]: { ...(prev as any).holidays[holiday], [field]: value } } }));
  };
  const updateArray = (arrayName: string, index: number, field: string, value: string) => {
    const newArray = [...(rmsData as any)[arrayName]];
    newArray[index] = { ...newArray[index], [field]: value };
    setRmsData({ ...rmsData, [arrayName]: newArray });
  };
  const addArrayRow = (arrayName: string) => {
    setRmsData({ ...rmsData, [arrayName]: [...(rmsData as any)[arrayName], { name: '', role: '', phone: '' }] });
  };
  const handleSimpleChange = (e: any) => setRmsData({ ...rmsData, [e.target.name]: e.target.value });

  if (!isClerkLoaded || isLoading) {
    return (
      <main className="bg-[#050505] text-white min-h-screen flex items-center justify-center flex-col">
        <Image src="/logo.png" alt="Gate Guard" width={60} height={60} className="animate-pulse mb-6" />
        <h1 className="text-cyan-500 font-black uppercase tracking-widest text-sm">Verifying Credentials...</h1>
      </main>
    );
  }

  const currentProperty = properties.find(p => p.id === selectedPropertyId) || null;
  const propertyName = currentProperty?.name || "Unassigned Property";
  const managerName = currentProperty?.manager_name || user?.firstName || "Client";
  const brivoUrl = currentProperty?.brivo_iframe_url || "";

  return (
    <main className="bg-[#050505] text-white min-h-screen font-sans selection:bg-cyan-500/30 flex flex-col overflow-hidden">
      
      {/* HEADER */}
      <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-xl flex items-center justify-between px-6 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all cursor-pointer">
            <Image src="/logo.png" alt="Gate Guard" width={32} height={32} className="object-contain" />
          </Link>
          <div className="w-[1px] h-6 bg-white/10"></div>
          <div>
            {properties.length > 1 ? (
              <select value={selectedPropertyId || ''} onChange={(e) => setSelectedPropertyId(e.target.value)} className="bg-transparent text-sm font-black tracking-widest uppercase text-white outline-none cursor-pointer hover:text-cyan-400 transition-colors">
                {properties.map(p => <option key={p.id} value={p.id} className="bg-[#111] text-white">{p.name}</option>)}
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
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT PORTION */}
        <div className="lg:w-2/3 flex flex-col bg-gradient-to-br from-[#050505] to-[#0a0f1a] overflow-hidden border-r border-white/5">
          <div className="flex overflow-x-auto scrollbar-hide border-b border-white/10 bg-[#0a0a0a] shrink-0 px-4 pt-4">
            {[
              { id: 'brivo', label: 'Access Control', icon: '🔑' },
              { id: 'rms', label: 'Service Order Form', icon: '📋' },
              { id: 'billing', label: 'Billing & Invoices', icon: '💳' },
              { id: 'support', label: 'Help & Support', icon: '🛠️' }
            ].map((tab) => (
              <button
                key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${ activeTab === tab.id ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5' }`}
              ><span>{tab.icon}</span> {tab.label}</button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 lg:p-10">
            
            {activeTab === 'brivo' && (
              <div className="h-full flex flex-col animate-[fadeIn_0.3s_ease-out]">
                <h2 className="text-2xl font-black mb-1">Brivo Access Engine</h2>
                <p className="text-xs text-zinc-500 font-medium mb-6">Manage credentials, cameras, and logs for {propertyName}.</p>
                {brivoUrl ? (
                  <iframe src={brivoUrl} className="flex-1 w-full rounded-2xl border border-zinc-800 bg-black"></iframe>
                ) : (
                  <div className="flex-1 bg-[#111] border border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 shadow-inner relative overflow-hidden">
                    <h3 className="text-lg font-black uppercase tracking-widest text-white mb-2">Secure Gateway Active</h3>
                    <p className="text-xs text-zinc-400 mt-2 max-w-md">Brivo app loading...</p>
                  </div>
                )}
              </div>
            )}

            {/* 📋 THE MASTER RMS FORM */}
            {activeTab === 'rms' && (
              <div className="animate-[fadeIn_0.3s_ease-out] max-w-4xl pb-10">
                 <h2 className="text-2xl font-black mb-1">Remote Monitoring Service Form</h2>
                 <p className="text-xs text-zinc-500 font-medium mb-8">Official Site Protocol based on Eagle Eye Networks framework.</p>
                 
                 <form onSubmit={handleSaveRms} className="space-y-8">
                    
                    {/* SECTION: CUSTOMER & BILLING */}
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/10 space-y-4">
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

                    {/* SECTION: HOURS OF OPERATION & MONITORING */}
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/10 space-y-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-cyan-500 border-b border-white/10 pb-2 mb-4">Site Schedules</h3>
                      <div className="grid grid-cols-3 gap-4 mb-2">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase">Day</div>
                        <div className="text-[10px] font-bold text-zinc-500 uppercase">Normal Operating Hours</div>
                        <div className="text-[10px] font-bold text-zinc-500 uppercase">Monitoring Hours Required</div>
                      </div>
                      {DAYS.map(day => (
                        <div key={day} className="grid grid-cols-3 gap-4 items-center">
                          <span className="text-xs font-medium capitalize">{day}</span>
                          <input type="text" placeholder="e.g. 9am - 5pm" value={(rmsData.normalHours as any)[day]} onChange={e => updateNested('normalHours', day, e.target.value)} className="bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                          <input type="text" placeholder="e.g. 5pm - 9am" value={(rmsData.monitoringHours as any)[day]} onChange={e => updateNested('monitoringHours', day, e.target.value)} className="bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                        </div>
                      ))}
                    </div>

                    {/* SECTION: SITE BACKGROUND & JANITORIAL */}
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/10 space-y-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-cyan-500 border-b border-white/10 pb-2 mb-4">Site Background & Services</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="number" name="cameraCount" value={rmsData.cameraCount} onChange={handleSimpleChange} placeholder="# of Cameras Monitored" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                        <select name="hasGuard" value={rmsData.hasGuard} onChange={handleSimpleChange} className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none">
                          <option value="No">No Guard Service</option>
                          <option value="Yes">Has Guard/Patrol Service</option>
                        </select>
                        {rmsData.hasGuard === 'Yes' && (
                          <>
                            <input name="guardCompany" value={rmsData.guardCompany} onChange={handleSimpleChange} placeholder="Guard Company Name" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                            <input name="guardPhone" value={rmsData.guardPhone} onChange={handleSimpleChange} placeholder="Guard Phone" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                          </>
                        )}
                        <input name="policePhone" value={rmsData.policePhone} onChange={handleSimpleChange} placeholder="Local Police Dept Phone" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                        <input name="firePhone" value={rmsData.firePhone} onChange={handleSimpleChange} placeholder="Local Fire Dept Phone" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                        <input name="janitorialCompany" value={rmsData.janitorialCompany} onChange={handleSimpleChange} placeholder="Janitorial Company Name" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                        <input name="janitorialSchedule" value={rmsData.janitorialSchedule} onChange={handleSimpleChange} placeholder="Janitorial Visit Days/Times" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                      </div>
                      <textarea name="activityDescription" value={rmsData.activityDescription} onChange={handleSimpleChange} placeholder="Describe typical amount and type of activity during monitoring hours..." rows={3} className="w-full mt-2 bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none resize-none"></textarea>
                    </div>

                    {/* SECTION: CONTACT TABLES */}
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/10 space-y-6">
                      <h3 className="text-sm font-black uppercase tracking-widest text-cyan-500 border-b border-white/10 pb-2 mb-4">Contacts Directories</h3>
                      
                      {[
                        { title: 'Emergency Contacts', key: 'emergencyContacts' },
                        { title: 'Reporting Contacts', key: 'reportingContacts' },
                        { title: 'Authorized After-hours Employees', key: 'authorizedEmployees' }
                      ].map(table => (
                        <div key={table.key}>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{table.title}</label>
                            <button type="button" onClick={() => addArrayRow(table.key)} className="text-[10px] font-bold text-cyan-500 hover:text-cyan-400">+ Add Row</button>
                          </div>
                          <div className="space-y-2">
                            {(rmsData as any)[table.key].map((contact: any, idx: number) => (
                              <div key={idx} className="grid grid-cols-3 gap-2">
                                <input placeholder="Name" value={contact.name} onChange={e => updateArray(table.key, idx, 'name', e.target.value)} className="bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                                <input placeholder="Role" value={contact.role} onChange={e => updateArray(table.key, idx, 'role', e.target.value)} className="bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                                <input placeholder="Phone" value={contact.phone} onChange={e => updateArray(table.key, idx, 'phone', e.target.value)} className="bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* SECTION: HOLIDAYS */}
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/10 space-y-4">
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
                          <select value={(rmsData.holidays as any)[h.id].monitoring247} onChange={e => updateHoliday(h.id, 'monitoring247', e.target.value)} className="bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none">
                            <option>No</option><option>Yes</option>
                          </select>
                        </div>
                      ))}
                    </div>

                    {/* SECTION: PROCEDURES */}
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/10 space-y-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-cyan-500 border-b border-white/10 pb-2 mb-4">Custom Procedures & Requirements</h3>
                      <textarea name="otherRequirements" value={rmsData.otherRequirements} onChange={handleSimpleChange} placeholder="List any specific procedures for Trespassing, Break-ins, Violence, or other requirements..." rows={5} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none resize-none"></textarea>
                    </div>

                    <div className="flex items-center justify-between sticky bottom-0 bg-[#050505] py-4 border-t border-white/10 z-10">
                      <span className="text-xs text-cyan-500 font-bold">{saveMessage}</span>
                      <button type="submit" disabled={isSaving} className="bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50">
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

            {activeTab === 'support' && (
               <div className="h-full animate-[fadeIn_0.3s_ease-out]">
                 <h2 className="text-2xl font-black mb-4">Help & Support</h2>
                 <p className="text-sm text-zinc-400">Dispatch is online 24/7.</p>
              </div>
            )}
          </div>
        </div>

        {/* 🚨 LIVE SOC ALERTS FEED 🚨 */}
        <div className="lg:w-1/3 bg-gradient-to-b from-[#0a1128] to-[#040812] border-l border-white/5 flex flex-col h-[600px] lg:h-auto z-10 relative">
          <div className="p-6 border-b border-blue-900/30 shrink-0 bg-[#0a1128] z-20">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]"></span> Live SOC Feed
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-20">
             {alerts.length === 0 ? (
                <div className="text-center text-blue-400/50 text-xs py-10 font-medium">Monitoring online. No recent alerts for {propertyName}.</div>
             ) : (
                alerts.map(alert => (
                  <div key={alert.id} className="p-4 rounded-xl border border-blue-500/20 bg-blue-900/30 text-blue-100 text-sm flex flex-col gap-2">
                    <p className="font-bold text-[10px] text-blue-300 uppercase tracking-wider">{alert.sender} • {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="leading-relaxed">{alert.message}</p>
                    {alert.image_url && (
                      <div className="mt-2 rounded-lg overflow-hidden border border-blue-500/40 shadow-lg bg-black/50">
                        <img src={alert.image_url} alt="Alert Evidence" className="w-full h-auto object-contain max-h-48" />
                      </div>
                    )}
                  </div>
                ))
             )}
          </div>
        </div>
      </div>
    </main>
  );
}
