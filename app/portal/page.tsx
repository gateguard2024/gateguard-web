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

export default function ClientPortal() {
  const { user, isLoaded: isClerkLoaded } = useUser(); 
  
  const [activeTab, setActiveTab] = useState<'brivo' | 'billing' | 'rms' | 'support'>('brivo');
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ---------------------------------------------------------
  // 📋 NEW: RMS FORM JSON STATE (Matches your Eagle Eye PDF)
  // ---------------------------------------------------------
  const [rmsData, setRmsData] = useState({
    businessName: '',
    cameraCount: '',
    activityDescription: '',
    hasGuard: 'No',
    guardCompany: '',
    guardPhone: '',
    policePhone: '',
    firePhone: '',
    emergencyContacts: [{ name: '', role: '', phone: '' }]
  });
  
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
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('manager_user_id', userId)
          .order('name'); 

        if (data && data.length > 0) {
          setProperties(data);
          setSelectedPropertyId(data[0].id); 
        }
      } catch (err) {
        console.error("Failed to fetch properties", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProperties(user.id);
  }, [isClerkLoaded, user]);

  useEffect(() => {
    if (!selectedPropertyId) return;

    // Load Alerts
    async function fetchAlerts() {
      try {
        const { data } = await supabase
          .from('soc_alerts')
          .select('*')
          .eq('property_id', selectedPropertyId)
          .order('created_at', { ascending: false }); 
        if (data) setAlerts(data);
      } catch (err) {
        console.error("Failed to fetch alerts", err);
      }
    }
    fetchAlerts();

    // Load the JSONB Form Data
    const currentProp = properties.find(p => p.id === selectedPropertyId);
    if (currentProp && currentProp.rms_data) {
      // Merge the database JSON with our default structure to prevent errors
      setRmsData(prev => ({ ...prev, ...currentProp.rms_data }));
    } else {
      // Reset if blank
      setRmsData({
        businessName: '', cameraCount: '', activityDescription: '', hasGuard: 'No',
        guardCompany: '', guardPhone: '', policePhone: '', firePhone: '',
        emergencyContacts: [{ name: '', role: '', phone: '' }]
      });
    }
  }, [selectedPropertyId, properties]);

  // ---------------------------------------------------------
  // 💾 SAVE JSON TO SUPABASE
  // ---------------------------------------------------------
  const handleSaveRms = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      const { error } = await supabase
        .from('properties')
        .update({ rms_data: rmsData }) // <-- ONE LINE SAVES THE ENTIRE FORM!
        .eq('id', selectedPropertyId);

      if (error) throw error;
      setSaveMessage('Order Form saved securely to SOC.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error("Error saving RMS form", err);
      setSaveMessage('Error saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to update dynamic contact rows
  const updateContact = (index: number, field: string, value: string) => {
    const newContacts = [...rmsData.emergencyContacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setRmsData({ ...rmsData, emergencyContacts: newContacts });
  };
  const addContactRow = () => {
    setRmsData({ ...rmsData, emergencyContacts: [...rmsData.emergencyContacts, { name: '', role: '', phone: '' }] });
  };

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
              <select 
                value={selectedPropertyId || ''} 
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="bg-transparent text-sm font-black tracking-widest uppercase text-white outline-none cursor-pointer hover:text-cyan-400 transition-colors"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id} className="bg-[#111] text-white">{p.name}</option>
                ))}
              </select>
            ) : (
              <h1 className="text-sm font-black tracking-widest uppercase text-white">{propertyName}</h1>
            )}
            <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mt-0.5">Property Command Center</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
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
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5' 
                    : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
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

            {/* 📋 THE NEW DIGITAL SOF FORM */}
            {activeTab === 'rms' && (
              <div className="animate-[fadeIn_0.3s_ease-out] max-w-3xl pb-10">
                 <h2 className="text-2xl font-black mb-1">Remote Monitoring Service Form</h2>
                 <p className="text-xs text-zinc-500 font-medium mb-8">Official Site Protocol. Data syncs directly to our Dispatch Center.</p>
                 
                 <form onSubmit={handleSaveRms} className="space-y-8">
                    
                    {/* SECTION 1: SITE BACKGROUND */}
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/10 space-y-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-cyan-500 border-b border-white/10 pb-2 mb-4">Site Background</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2"># of Cameras Monitored</label>
                          <input type="number" value={rmsData.cameraCount} onChange={e => setRmsData({...rmsData, cameraCount: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" placeholder="e.g. 12" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Guard/Patrol Service?</label>
                          <select value={rmsData.hasGuard} onChange={e => setRmsData({...rmsData, hasGuard: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500">
                            <option>No</option><option>Yes</option>
                          </select>
                        </div>
                      </div>
                      
                      {rmsData.hasGuard === 'Yes' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Guard Company Name</label>
                            <input type="text" value={rmsData.guardCompany} onChange={e => setRmsData({...rmsData, guardCompany: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Guard Phone</label>
                            <input type="text" value={rmsData.guardPhone} onChange={e => setRmsData({...rmsData, guardPhone: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Typical Amount/Type of Activity</label>
                        <textarea value={rmsData.activityDescription} onChange={e => setRmsData({...rmsData, activityDescription: e.target.value})} rows={3} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 resize-none" placeholder="Describe normal activity during monitoring hours..."></textarea>
                      </div>
                    </div>

                    {/* SECTION 2: EMERGENCY SERVICES */}
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/10 space-y-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-cyan-500 border-b border-white/10 pb-2 mb-4">Emergency Services</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Local Police Dept. Phone</label>
                          <input type="text" value={rmsData.policePhone} onChange={e => setRmsData({...rmsData, policePhone: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Local Fire Dept. Phone</label>
                          <input type="text" value={rmsData.firePhone} onChange={e => setRmsData({...rmsData, firePhone: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" />
                        </div>
                      </div>
                      
                      <div className="pt-4 mt-4 border-t border-white/5">
                        <div className="flex justify-between items-center mb-4">
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Emergency & Reporting Contacts</label>
                          <button type="button" onClick={addContactRow} className="text-[10px] font-bold text-cyan-500 hover:text-cyan-400">+ Add Contact</button>
                        </div>
                        
                        {/* DYNAMIC CONTACT TABLE */}
                        <div className="space-y-3">
                          {rmsData.emergencyContacts.map((contact, index) => (
                            <div key={index} className="grid grid-cols-3 gap-2">
                              <input type="text" placeholder="Name" value={contact.name} onChange={e => updateContact(index, 'name', e.target.value)} className="bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                              <input type="text" placeholder="Role (e.g. Manager)" value={contact.role} onChange={e => updateContact(index, 'role', e.target.value)} className="bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                              <input type="text" placeholder="Phone" value={contact.phone} onChange={e => updateContact(index, 'phone', e.target.value)} className="bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sticky bottom-0 bg-[#050505] py-4 border-t border-white/10 z-10">
                      <span className="text-xs text-cyan-500 font-bold">{saveMessage}</span>
                      <button type="submit" disabled={isSaving} className="bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50">
                        {isSaving ? 'Syncing...' : 'Save Service Order Form'}
                      </button>
                    </div>
                 </form>
              </div>
            )}

            {/* BILLING TAB */}
            {activeTab === 'billing' && (
              <div className="h-full animate-[fadeIn_0.3s_ease-out]">
                 <h2 className="text-2xl font-black mb-4">Financial Overview: {propertyName}</h2>
                 <div className="bg-[#111] border border-white/10 p-6 rounded-xl max-w-md">
                   <p className="text-sm text-zinc-400 mb-1">Current Balance</p>
                   <p className="text-4xl font-black text-white mb-6">
                     {currentProperty?.current_balance || "$0.00"}
                   </p>
                 </div>
              </div>
            )}

            {/* SUPPORT TAB */}
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
                <div className="text-center text-blue-400/50 text-xs py-10 font-medium">
                  Monitoring online. No recent alerts for {propertyName}.
                </div>
             ) : (
                alerts.map(alert => (
                  <div key={alert.id} className="p-4 rounded-xl border border-blue-500/20 bg-blue-900/30 text-blue-100 text-sm flex flex-col gap-2">
                    <p className="font-bold text-[10px] text-blue-300 uppercase tracking-wider">
                      {alert.sender} • {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
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
