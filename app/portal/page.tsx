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

const STATIC_FALLBACK = {
  cameras: [
    { id: "CAM-01", name: "Main Entry Gate", status: "online", image: "/gate-closed.png" },
    { id: "CAM-02", name: "Exit Gate", status: "online", image: "/gate-open.png" }, 
    { id: "CAM-03", name: "Leasing Office", status: "online", image: "/hero-bg.jpg" },
    { id: "CAM-04", name: "Package Room", status: "offline", image: "" } 
  ],
  billing: { balance: "$0.00", nextPayment: "Mar 1, 2026", cardSuffix: "4242" },
  socAlerts: [
    { id: 1, time: 'Just Now', type: 'alert', text: 'Tailgating event detected at Main Entry Gate. License plate captured.', sender: 'Gate Guard AI' },
    { id: 2, time: '10:42 AM', type: 'info', text: 'FedEx delivery verified via Callbox. Access granted.', sender: 'Live Dispatch' }
  ]
};

export default function ClientPortal() {
  const { user, isLoaded: isClerkLoaded } = useUser(); 
  
  const [activeTab, setActiveTab] = useState<'brivo' | 'eagleeye' | 'billing' | 'training' | 'support'>('brivo');
  
  // NEW: State for MULTI-PROPERTY support!
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
    if (!isClerkLoaded) return;
    
    // Prove to TypeScript that the user and their ID absolutely exist
    if (!user || !user.id) {
      setIsLoading(false);
      return;
    }

    // Pass the confirmed ID as a guaranteed string variable (userId)
    async function fetchProperties(userId: string) {
      try {
        // NEW: Notice there is NO .single() anymore! It pulls everything that matches your ID.
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('manager_user_id', userId) // <-- No more TypeScript panic!
          .order('name'); 

        if (data && data.length > 0) {
          console.log("Found properties for user:", data);
          setProperties(data);
          setSelectedPropertyId(data[0].id); // Auto-select the first property in the list
        } else {
          console.log("No properties linked to this user yet.");
        }
      } catch (err) {
        console.error("Failed to fetch database info", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    // Run the function and hand it the ID
    fetchProperties(user.id);
  }, [isClerkLoaded, user]);

  if (!isClerkLoaded || isLoading) {
    return (
      <main className="bg-[#050505] text-white min-h-screen flex items-center justify-center flex-col">
        <Image src="/logo.png" alt="Gate Guard" width={60} height={60} className="animate-pulse mb-6" />
        <h1 className="text-cyan-500 font-black uppercase tracking-widest text-sm">Verifying Credentials...</h1>
      </main>
    );
  }

  // Determine which property is currently selected
  const currentProperty = properties.find(p => p.id === selectedPropertyId) || null;
  const propertyName = currentProperty?.name || "Unassigned Property";
  const managerName = currentProperty?.manager_name || user?.firstName || "Client";
  const brivoUrl = currentProperty?.brivo_iframe_url || "";

  return (
    <main className="bg-[#050505] text-white min-h-screen font-sans selection:bg-cyan-500/30 flex flex-col overflow-hidden">
      
      {/* HEADER */}
      <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-xl flex items-center justify-between px-6 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all cursor-pointer" title="Return to Main Website">
            <Image src="/logo.png" alt="Gate Guard" width={32} height={32} className="object-contain" />
          </Link>
          <div className="w-[1px] h-6 bg-white/10"></div>
          <div>
            {/* NEW: MULTI-PROPERTY DROPDOWN MENU */}
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
              { id: 'eagleeye', label: 'Video Surveillance', icon: '📷' },
              { id: 'billing', label: 'Billing & Invoices', icon: '💳' },
              { id: 'training', label: 'How-To Videos', icon: '🎓' },
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
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Brivo Access Engine</h2>
                    <p className="text-xs text-zinc-500 font-medium">Manage credentials and logs for {propertyName}.</p>
                  </div>
                </div>
                
                {brivoUrl ? (
                  <iframe src={brivoUrl} className="flex-1 w-full rounded-2xl border border-zinc-800 bg-black"></iframe>
                ) : (
                  <div className="flex-1 bg-[#111] border border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('/app-brivo.png')] opacity-10 bg-cover bg-center blur-md"></div>
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/50 relative z-10 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                      <span className="text-2xl">🔑</span>
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-white relative z-10 mb-2">Secure Gateway Active</h3>
                    <p className="text-xs text-zinc-400 mt-2 max-w-md relative z-10 leading-relaxed">
                      {propertyName} managers can add users and manage fobs directly from this dashboard.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'eagleeye' && (
              <div className="h-full flex flex-col animate-[fadeIn_0.3s_ease-out]">
                <h2 className="text-2xl font-black mb-1">Eagle Eye Cloud VMS</h2>
                <p className="text-xs text-zinc-500 font-medium mb-6">Live camera feeds for {propertyName}.</p>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                   {STATIC_FALLBACK.cameras.map((cam, idx) => (
                     <div key={idx} className={`bg-black border rounded-xl relative overflow-hidden h-48 sm:h-auto ${cam.status === 'offline' ? 'border-red-900/50' : 'border-white/10'}`}>
                        {cam.status === 'online' ? (
                          <>
                            <Image src={cam.image} alt={cam.name} fill className="object-cover opacity-70 hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-md px-2 py-1.5 rounded shadow-lg text-[8px] font-bold uppercase tracking-widest">
                               <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                               {cam.id} • {cam.name}
                            </div>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a]">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">Camera Offline</p>
                          </div>
                        )}
                     </div>
                   ))}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="h-full animate-[fadeIn_0.3s_ease-out]">
                 <h2 className="text-2xl font-black mb-4">Financial Overview: {propertyName}</h2>
                 <p className="text-sm text-zinc-400">Current Balance: {STATIC_FALLBACK.billing.balance}</p>
                 <p className="text-sm text-zinc-400">Next Auto-Pay: {STATIC_FALLBACK.billing.nextPayment}</p>
              </div>
            )}
             {activeTab === 'training' && (
              <div className="h-full animate-[fadeIn_0.3s_ease-out]">
                 <h2 className="text-2xl font-black mb-4">Knowledge Base</h2>
                 <p className="text-sm text-zinc-400">Video tutorials loading...</p>
              </div>
            )}
             {activeTab === 'support' && (
              <div className="h-full animate-[fadeIn_0.3s_ease-out]">
                 <h2 className="text-2xl font-black mb-4">Create Support Ticket</h2>
                 <p className="text-sm text-zinc-400">Dispatch is online 24/7.</p>
              </div>
            )}
          </div>
        </div>

        {/* SOC ALERTS */}
        <div className="lg:w-1/3 bg-gradient-to-b from-[#0a1128] to-[#040812] border-l border-white/5 flex flex-col h-[600px] lg:h-auto z-10">
          <div className="p-6 border-b border-blue-900/30">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]"></span> Live SOC Feed
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
             {STATIC_FALLBACK.socAlerts.map(alert => (
               <div key={alert.id} className="p-4 rounded-xl border border-blue-500/20 bg-blue-900/30 text-blue-100 text-sm">
                 <p className="font-bold text-[10px] mb-1 text-blue-300">{alert.sender} • {alert.time}</p>
                 <p>{alert.text}</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    </main>
  );
}
