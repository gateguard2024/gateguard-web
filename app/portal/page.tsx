"use client";
import React, { useState } from 'react';
import Image from 'next/image';

// ---------------------------------------------------------
// 🛠️ DEMO CONTROL PANEL: EAGLES LANDING
// ---------------------------------------------------------
const PROPERTY_DATA = {
  propertyName: "Eagles Landing",
  propertyAddress: "4500 Eagles Way, Ball Ground, GA",
  managerName: "Sarah Jenkins",
  brivoIframeUrl: "", 
  cameras: [
    { id: "CAM-01", name: "Main Entry Gate", status: "online", image: "/gate-closed.png" },
    { id: "CAM-02", name: "Exit Gate", status: "online", image: "/gate-open.png" }, 
    { id: "CAM-03", name: "Leasing Office", status: "online", image: "/hero-bg.jpg" },
    { id: "CAM-04", name: "Package Room", status: "offline", image: "" } 
  ],
  billing: {
    balance: "$0.00",
    nextPayment: "Mar 1, 2026",
    cardSuffix: "4242",
    invoices: [
      { id: 'INV-2045', date: 'Feb 1, 2026', amount: '$3,500.00', status: 'Paid' },
      { id: 'INV-2044', date: 'Jan 1, 2026', amount: '$3,500.00', status: 'Paid' }
    ]
  },
  socAlerts: [
    { id: 1, time: 'Just Now', type: 'alert', text: 'Tailgating event detected at Main Entry Gate. License plate captured. Video clip saved.', sender: 'Gate Guard AI' },
    { id: 2, time: '10:42 AM', type: 'info', text: 'FedEx delivery verified via Callbox. Courier granted temporary access to package room.', sender: 'Live Dispatch' },
    { id: 3, time: 'Yesterday, 9:15 PM', type: 'action', text: 'Resident "S. Smith" requested a 24-hour guest pass. Approved and logged.', sender: 'System Automation' },
    { id: 4, time: 'Yesterday, 2:00 PM', type: 'info', text: 'Routine preventative maintenance completed on Pedestrian Gate B. Hardware healthy.', sender: 'Field Tech Team' },
  ]
};
// ---------------------------------------------------------

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState<'brivo' | 'eagleeye' | 'billing' | 'training' | 'support'>('brivo');

  return (
    <main className="bg-[#050505] text-white min-h-screen font-sans selection:bg-cyan-500/30 flex flex-col overflow-hidden">
      
      {/* Top Header - Client Branding */}
      <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-xl flex items-center justify-between px-6 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="Gate Guard" width={32} height={32} className="object-contain" />
          <div className="w-[1px] h-6 bg-white/10"></div>
          <div>
            <h1 className="text-sm font-black tracking-widest uppercase text-white">{PROPERTY_DATA.propertyName}</h1>
            <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">Property Command Center</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Logged in as</p>
            <p className="text-xs text-white font-bold">{PROPERTY_DATA.managerName}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-black text-zinc-400">
            {PROPERTY_DATA.managerName.charAt(0)}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT 2/3: THE WORKSPACE */}
        <div className="lg:w-2/3 flex flex-col bg-gradient-to-br from-[#050505] to-[#0a0f1a] overflow-hidden border-r border-white/5">
          
          {/* Custom Tab Navigation */}
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

          {/* Tab Content Area */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-10">
            
            {/* BRIVO EMBED TAB */}
            {activeTab === 'brivo' && (
              <div className="h-full flex flex-col animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Brivo Access Engine</h2>
                    <p className="text-xs text-zinc-500 font-medium">Manage credentials, unlock doors remotely, and view activity logs.</p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">Launch Full Brivo App ↗</button>
                </div>
                
                {PROPERTY_DATA.brivoIframeUrl ? (
                  <iframe src={PROPERTY_DATA.brivoIframeUrl} className="flex-1 w-full rounded-2xl border border-zinc-800 bg-black"></iframe>
                ) : (
                  <div className="flex-1 bg-[#111] border border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('/app-brivo.png')] opacity-10 bg-cover bg-center blur-md"></div>
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/50 relative z-10 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                      <span className="text-2xl">🔑</span>
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-white relative z-10 mb-2">Secure Gateway Active</h3>
                    <p className="text-xs text-zinc-400 mt-2 max-w-md relative z-10 leading-relaxed">
                      This space is reserved for the native Brivo Identity Management portal. {PROPERTY_DATA.propertyName} managers can add users and manage fobs directly from this dashboard.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* EAGLE EYE EMBED TAB */}
            {activeTab === 'eagleeye' && (
              <div className="h-full flex flex-col animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Eagle Eye Cloud VMS</h2>
                    <p className="text-xs text-zinc-500 font-medium">Live camera feeds, cloud playback, and LPR analytics.</p>
                  </div>
                  <button className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(217,119,6,0.3)]">Launch Video Matrix ↗</button>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                   {PROPERTY_DATA.cameras.map((cam, idx) => (
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
                            <svg className="w-8 h-8 text-red-900 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" /></svg>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">Camera Offline</p>
                            <p className="text-[8px] text-zinc-500 uppercase mt-1">Ticket #4928 Auto-Generated</p>
                          </div>
                        )}
                     </div>
                   ))}
                </div>
              </div>
            )}

            {/* BILLING / QUICKBOOKS TAB */}
            {activeTab === 'billing' && (
              <div className="h-full animate-[fadeIn_0.3s_ease-out]">
                 <h2 className="text-2xl font-black mb-1">Financial Overview</h2>
                 <p className="text-xs text-zinc-500 font-medium mb-8">Powered by secure QuickBooks Online integration.</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-xl">
                       <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Current Balance</p>
                       <p className="text-3xl font-black text-white">{PROPERTY_DATA.billing.balance}</p>
                    </div>
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-xl">
                       <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Next Auto-Pay</p>
                       <p className="text-xl font-bold text-white mb-1">{PROPERTY_DATA.billing.nextPayment}</p>
                       <p className="text-xs text-zinc-500">Visa ending in •••• {PROPERTY_DATA.billing.cardSuffix}</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-center items-start shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                       <button className="text-cyan-400 font-bold text-xs hover:text-cyan-300 transition-colors mb-3 flex items-center gap-2"><span>💳</span> Update Payment Method →</button>
                       <button className="text-cyan-400 font-bold text-xs hover:text-cyan-300 transition-colors flex items-center gap-2"><span>📄</span> Download W-9 Form →</button>
                    </div>
                 </div>

                 <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-4 border-b border-white/10 pb-2">Recent Invoices</h3>
                 <div className="space-y-3">
                    {PROPERTY_DATA.billing.invoices.map((inv) => (
                      <div key={inv.id} className="flex justify-between items-center bg-[#0a0
