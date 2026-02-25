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
                      <div key={inv.id} className="flex justify-between items-center bg-[#0a0a0a] border border-white/5 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-lg">✓</div>
                           <div>
                              <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{inv.id}</p>
                              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{inv.date}</p>
                           </div>
                        </div>
                        <div className="text-right flex items-center gap-6">
                           <span className="text-sm font-black text-white">{inv.amount}</span>
                           <button className="text-[10px] bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded uppercase font-bold tracking-widest hover:bg-zinc-700 transition-colors">PDF</button>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {/* TRAINING / VIDEOS TAB */}
            {activeTab === 'training' && (
              <div className="h-full animate-[fadeIn_0.3s_ease-out]">
                 <h2 className="text-2xl font-black mb-1">Knowledge Base</h2>
                 <p className="text-xs text-zinc-500 font-medium mb-8">On-demand video tutorials for property staff and management.</p>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { title: 'How to add a new resident to Brivo', dur: '2:45' },
                      { title: 'Pulling video clips for law enforcement', dur: '4:12' },
                      { title: 'Updating Callbox directory listings', dur: '1:30' },
                      { title: 'Ordering new physical key fobs', dur: '3:05' }
                    ].map((vid, idx) => (
                      <div key={idx} className="group cursor-pointer">
                        <div className="w-full aspect-video bg-[#0a0a0a] border border-white/10 rounded-xl mb-3 relative overflow-hidden flex items-center justify-center group-hover:border-cyan-500/50 transition-colors shadow-lg">
                           <div className="absolute inset-0 bg-gradient-to-br from-black to-zinc-900 opacity-50"></div>
                           <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform border border-cyan-500/30">
                              <span className="text-cyan-400 ml-1 text-lg">▶</span>
                           </div>
                           <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[9px] font-bold px-2.5 py-1 rounded tracking-wider">{vid.dur}</div>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{vid.title}</h4>
                      </div>
                    ))}
                 </div>
              </div>
            )}

             {/* SUPPORT TAB */}
             {activeTab === 'support' && (
              <div className="h-full animate-[fadeIn_0.3s_ease-out] max-w-xl">
                 <h2 className="text-2xl font-black mb-1">Create Support Ticket</h2>
                 <p className="text-xs text-zinc-500 font-medium mb-8">Our technicians monitor this queue 24/7 for hardware and software issues.</p>
                 
                 <form className="space-y-5 bg-[#0a0a0a] p-6 rounded-2xl border border-white/5 shadow-xl">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Issue Type</label>
                      <select className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-cyan-500 appearance-none shadow-inner">
                        <option>Gate Operator Malfunction</option>
                        <option>Visitor Callbox Offline</option>
                        <option>Camera Feed Down or Blurry</option>
                        <option>Brivo Sync Issue</option>
                        <option>Other / General Inquiry</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Description</label>
                      <textarea rows={5} className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-cyan-500 shadow-inner resize-none" placeholder="Please describe the issue in detail. Include gate names or camera numbers if possible..."></textarea>
                    </div>
                    <button type="button" className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-cyan-400 transition-colors uppercase tracking-widest text-xs shadow-lg mt-2">
                       Submit Ticket to Dispatch
                    </button>
                 </form>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT 1/3: THE SOC ALERTS FEED (Now with Dark Blue Tech Gradient) */}
        <div className="lg:w-1/3 bg-gradient-to-b from-[#0a1128] to-[#040812] border-l border-white/5 flex flex-col h-[600px] lg:h-auto border-t lg:border-t-0 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-10">
          
          <div className="p-6 border-b border-blue-900/30 bg-transparent shrink-0">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-100 flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]"></span>
              Live SOC Feed
            </h3>
            <p className="text-[10px] text-blue-300/60 font-medium">Real-time alerts via Gate Guard AI & Dispatch</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {PROPERTY_DATA.socAlerts.map((alert) => (
              <div key={alert.id} className="animate-[fadeIn_0.5s_ease-out]">
                <div className="flex justify-center mb-4">
                  <span className="text-[9px] text-blue-300/50 font-bold uppercase tracking-wider bg-blue-900/20 px-3 py-1 rounded-full border border-blue-500/10">{alert.time}</span>
                </div>
                
                <div className="flex flex-col items-start max-w-[95%]">
                   <span className="text-[9px] font-bold uppercase tracking-widest text-blue-300/50 mb-1.5 ml-1">{alert.sender}</span>
                   
                   <div className={`p-4 rounded-2xl rounded-tl-sm text-sm shadow-xl border backdrop-blur-sm ${
                     alert.type === 'alert' 
                       ? 'bg-red-950/40 border-red-500/30 text-red-100' 
                       : alert.type === 'info'
                       ? 'bg-blue-900/30 border-blue-500/20 text-blue-100'
                       : 'bg-cyan-900/30 border-cyan-500/30 text-cyan-50'
                   }`}>
                     <p className="leading-relaxed text-[13px]">{alert.text}</p>
                     
                     {alert.type === 'alert' && (
                       <div className="mt-3 relative h-24 bg-black rounded-xl overflow-hidden border border-red-500/30 flex items-center justify-center group cursor-pointer shadow-lg">
                          <Image src="/gate-closed.png" alt="Snapshot" fill className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                          <div className="relative z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-red-500/80 transition-colors">
                            <span className="text-white text-[12px] ml-0.5">▶</span>
                          </div>
                          <div className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded">Auto-Clip</div>
                       </div>
                     )}
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-blue-900/30 bg-black/20 backdrop-blur-md shrink-0">
             <div className="bg-blue-950/40 border border-blue-500/20 rounded-full p-1.5 pl-5 flex items-center gap-2 focus-within:border-cyan-500/50 transition-colors">
               <input type="text" placeholder="Message Dispatch Team..." className="bg-transparent outline-none text-xs text-blue-100 flex-1 placeholder:text-blue-300/40" />
               <button className="w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-400 flex items-center justify-center text-black transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <span className="text-sm transform rotate-45 -translate-y-[1px] -translate-x-[1px] font-black">✈</span>
               </button>
             </div>
          </div>

        </div>

      </div>
    </main>
  );
}
