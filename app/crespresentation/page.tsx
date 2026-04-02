import React from 'react';
import Link from 'next/link';

export default function ColumbiaResPresentation() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <header className="bg-slate-900 text-white py-24 px-6 text-center border-b-[8px] border-blue-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-10 -mr-10 -mt-10 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-900/50 border border-blue-700 text-blue-300 text-xs font-bold tracking-widest uppercase mb-6">
            Executive Briefing • Presented by Russell Feldman
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Elevating Access for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Columbia Residential</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
            A proactive "Your Gate Guard" roadmap to provide a superior tenant experience, preserve your assets, and transform unpredictable maintenance headaches into guaranteed monthly savings.
          </p>
        </div>
      </header>

      {/* 2. THE VISUAL PAIN POINTS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">The Reality of Reactive Access Control</h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-slate-600 leading-relaxed">
            We understand the daily challenges your on-site teams face. Brittle hardware, missing equipment, and unmonitored entries create a "Wild West" on your properties.
          </p>
        </div>
        
        {/* Photo Gallery of Pain */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          <div className="overflow-hidden rounded-2xl shadow-lg group border border-slate-100 bg-white">
            <img src="/break-fix-1.jpg" alt="Vandalized strike" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="p-4 text-center border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-700">Vandalized strikes and locks requiring expensive repairs.</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-lg group border border-slate-100 bg-white">
            <img src="/break-fix-2.jpg" alt="Missing hardware" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="p-4 text-center border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-700">Missing hardware leading to wide-open entries.</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-lg group border border-slate-100 bg-white">
            <img src="/break-fix-3.jpg" alt="Empty post" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="p-4 text-center border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-700">Useless, empty posts and decommissioned equipment.</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-lg group border border-slate-100 bg-white">
            <img src="/break-fix-4.jpg" alt="Unmonitored gate" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="p-4 text-center border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-700">Unmonitored entries where incidents go unrecorded.</p>
            </div>
          </div>
        </div>

        {/* Traditional Reality vs GateGuard Summary Cards */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* The Current Reality Card */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 p-8 flex items-center gap-5">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600 font-bold text-2xl shrink-0 shadow-inner">✕</div>
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Moving From:<br/><span className="text-slate-500 font-medium text-xl">The Current Bleed</span></h3>
            </div>
            
            <div className="p-8 space-y-8">
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Fragmented Technology</h4>
                <p className="text-slate-600 leading-relaxed">DoorKing, Viking, and All-O-Matic systems that do not talk to each other, leading to massive staff confusion and inconsistent security.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Redundant Telecom Waste</h4>
                <p className="text-slate-600 leading-relaxed">Multiple sites are paying for up to 8 separate Comcast bills simultaneously just to provide necessary network backhaul for isolated systems.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Manual Staff Labor</h4>
                <p className="text-slate-600 leading-relaxed">Property managers waste hours adding or removing tenants across multiple software platforms during every move-in and move-out.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Reactive Repairs</h4>
                <p className="text-slate-600 leading-relaxed">Brittle aluminum hardware is constantly vandalized or abused, with zero camera monitoring to assign accountability.</p>
              </div>
            </div>
          </div>

          {/* The GateGuard Elevation Card */}
          <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 pointer-events-none"></div>
            
            <div className="bg-blue-600/5 border-b border-blue-100 p-8 flex items-center gap-5 relative z-10">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white font-bold text-2xl shrink-0 shadow-md">✓</div>
              <h3 className="text-2xl font-bold text-blue-900 tracking-tight">Moving To:<br/><span className="text-blue-700 font-medium text-xl">The GateGuard Elevation</span></h3>
            </div>
            
            <div className="p-8 space-y-8 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-bold text-blue-900">Network Consolidation</h4>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Big Savings</span>
                </div>
                <p className="text-blue-800/80 leading-relaxed">We install a unified network backhaul requiring only one single internet connection per site, instantly eliminating thousands in monthly waste.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-blue-900 mb-2">Total Automation</h4>
                <p className="text-blue-800/80 leading-relaxed">Direct API integration with your existing PMS completely eliminates physical fobs and fully automates the tenant onboarding process.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-blue-900 mb-2">Proactive Security & Compliance</h4>
                <p className="text-blue-800/80 leading-relaxed">Upgraded steel hardware, custom mag covers, overnight camera monitoring, and strict EMS fire-code compliance built-in from day one.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CASE STUDIES SECTION */}
      <section className="bg-slate-900 text-white py-24 px-6 mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Proven Results in Multi-Family</h2>
            <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
            <p className="mt-6 text-slate-400 text-lg max-w-2xl mx-auto">Replacing unpredictable CapEx with stable, guaranteed lower monthly OpEx.</p>
          </div>
          
          <div className="space-y-12">
            
            {/* Case Study 1: Gardens at South City */}
            <div className="bg-slate-800 rounded-2xl p-8 lg:p-10 border border-slate-700">
              <div className="mb-6">
                <h3 className="text-3xl font-bold text-blue-400 mb-2 tracking-tight">Gardens at South City</h3>
                <p className="text-slate-400 font-medium tracking-wide text-sm uppercase">290 Units • 6 Vehicle Gates • 19 Amenity & Pedestrian Gates</p>
              </div>

              {/* Narrative Story Block */}
              <div className="bg-slate-900/50 p-6 lg:p-8 rounded-xl border border-slate-700/50 mb-10 shadow-inner">
                <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                  The Current Situation
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  This property is currently trapped in a chaotic, reactive break-fix loop. With 25 total gates, management is juggling up to 8 separate Comcast bills just to keep basic systems online. Brittle aluminum gate hardware is constantly snapping, and acts of vandalism go completely unrecorded. The staff is overwhelmed, and the property is bleeding money with no unified security plan in place.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-xl font-semibold mb-6 text-slate-200 border-b border-slate-700 pb-3">Current State (The Bleed)</h4>
                  <table className="w-full text-left text-base">
                    <tbody>
                      <tr className="border-b border-slate-700"><td className="py-3 text-slate-400">ISP / Telecom</td><td className="py-3 text-right font-medium text-red-400">$1,200 - $2,400/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-3 text-slate-400">DoorKing Costs</td><td className="py-3 text-right font-medium text-red-400">$250/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-3 text-slate-400">Fob Replacements</td><td className="py-3 text-right font-medium text-red-400">$375/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-3 text-slate-400">Average Repairs</td><td className="py-3 text-right font-medium text-red-400">$2,500/mo</td></tr>
                      <tr><td className="py-4 font-bold text-slate-200 text-lg">Total Est. Cost</td><td className="py-4 text-right font-bold text-red-400 text-lg">$4,325 - $5,525/mo</td></tr>
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold mb-6 text-slate-200 border-b border-slate-700 pb-3">Proposed State (The GateGuard Solution)</h4>
                  <table className="w-full text-left text-base">
                    <tbody>
                      <tr className="border-b border-slate-700"><td className="py-3 text-slate-400">ISP / Telecom</td><td className="py-3 text-right font-medium text-green-400">$400/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-3 text-slate-400">DoorKing Costs</td><td className="py-3 text-right font-medium text-green-400">$0/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-3 text-slate-400">Fob Replacements</td><td className="py-3 text-right font-medium text-green-400">$0/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-3 text-slate-400">Average Repairs</td><td className="py-3 text-right font-medium text-green-400">$0/mo (Included)</td></tr>
                      <tr><td className="py-4 font-bold text-slate-200 text-lg">GateGuard Package</td><td className="py-4 text-right font-bold text-green-400 text-lg">$2,150 - $3,425/mo</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Case Study 2: Mechanicsville Crossing */}
            <div className="bg-slate-800 rounded-2xl p-8 lg:p-10 border border-slate-700 relative overflow-hidden">
              {/* Vandal Proof Icon Callout */}
              <div className="absolute top-0 right-0 bg-blue-600 text-white font-bold px-4 py-2 rounded-bl-xl text-xs flex items-center gap-1.5 shadow-md z-10">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Focus on Vandal Proofing
              </div>

              <div className="mb-6">
                <h3 className="text-3xl font-bold text-blue-400 mb-2 tracking-tight">Mechanicsville Crossing</h3>
                <p className="text-slate-400 font-medium tracking-wide text-sm uppercase">164 Units • 2 Vehicle Gates • 19 Amenity & Pedestrian Gates</p>
              </div>

              {/* Narrative Story Block */}
              <div className="bg-slate-900/50 p-6 lg:p-8 rounded-xl border border-slate-700/50 mb-10 shadow-inner">
                <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                  The Current Situation
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Situated in a high-traffic area, this property faces relentless vandalism. The magnetic locks are continually abused, causing major safety concerns and code compliance failures. Furthermore, there are redundant callboxes stationed inside the already gated perimeter. Between the high telecom bills and constant repair tickets, the property's NOI is taking a massive, unnecessary hit.
                </p>
              </div>

              <div className="grid lg:grid-cols-[1fr,1.3fr] gap-12 relative z-10">
                
                {/* Before Table */}
                <div className="border-r lg:border-r-slate-700 pr-0 lg:pr-10">
                  <h4 className="text-xl font-semibold mb-6 text-slate-200 border-b border-slate-700 pb-3">Current State (The Bleed)</h4>
                  <table className="w-full text-left text-base">
                    <tbody>
                      <tr className="border-b border-slate-700"><td className="py-3 text-slate-400">ISP / Telecom</td><td className="py-3 text-right font-medium text-red-400">$800 - $1,200/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-3 text-slate-400">DoorKing Costs</td><td className="py-3 text-right font-medium text-red-400">$400/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-3 text-slate-400">Fob Replacements</td><td className="py-3 text-right font-medium text-red-400">$225/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-3 text-slate-400">Average Repairs</td><td className="py-3 text-right font-medium text-red-400">$1,500/mo</td></tr>
                      <tr><td className="py-4 font-bold text-slate-200 text-lg">Total Est. Cost</td><td className="py-4 text-right font-bold text-red-400 text-lg">$2,925 - $3,325/mo</td></tr>
                    </tbody>
                  </table>
                </div>
                
                {/* GateGuard Solution & Hardware Quote */}
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-6 text-slate-200 border-b border-slate-700 pb-3">Proposed State (The GateGuard Solution)</h4>
                    <table className="w-full text-left text-base">
                      <tbody>
                        <tr className="border-b border-slate-700"><td className="py-3 text-slate-400">ISP / Telecom</td><td className="py-3 text-right font-medium text-green-400">$400/mo</td></tr>
                        <tr className="border-b border-slate-700"><td className="py-3 text-slate-400">Average Repairs</td><td className="py-3 text-right font-medium text-green-400">$0/mo (Included)</td></tr>
                        <tr><td className="py-4 font-bold text-slate-200 text-lg">GateGuard Package</td><td className="py-4 text-right font-bold text-green-400 text-lg">$1,230 - $2,550/mo</td></tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Vandalism Solution Callout */}
                  <div className="bg-slate-900 border-l-4 border-blue-500 rounded-xl p-6 shadow-xl">
                    <h5 className="text-xl font-bold text-white mb-3">Targeted Hardware Upgrade: <span className="text-blue-400">Vandal-Proof Mag Covers</span></h5>
                    <p className="text-slate-400 text-sm leading-relaxed mb-5">
                      We solve the "abused mag lock" problem. Installing custom metal MAG COVERS directly prevents vandalism and drastically reduces long-term maintenance costs.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-slate-800 p-4 rounded-lg text-center border border-slate-700 shadow-inner">
                        <p className="text-sm text-slate-400 mb-1">Single Install Cost</p>
                        <p className="text-2xl font-bold text-white">$700<span className="text-sm font-normal text-slate-500"> / ea</span></p>
                      </div>
                      <div className="bg-blue-900/40 p-4 rounded-lg text-center border border-blue-800 shadow-inner">
                        <p className="text-sm text-blue-300 mb-1">Portfolio Bulk Offer (13+ Sites)</p>
                        <p className="text-2xl font-bold text-blue-100">$250<span className="text-sm font-normal text-blue-300"> / ea</span></p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* VISITOR WORKFLOW VISUALIZATION (Redesigned Fortune 500 Layout) */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-200 overflow-hidden">
        <div className="grid lg:grid-cols-[1.2fr,1.3fr] gap-12 items-center">
          
          <div className="z-30">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">Your Digital Gate Guard: <br className="hidden md:block" />Visitor Tracking Redefined</h2>
            <div className="w-16 h-1 bg-blue-600 rounded-full mb-8"></div>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              We turn physical access into actionable data. When a visitor scans the QR code on our vandal-proof sign, we automatically log their visit, verify their phone number, and record which staff member or resident granted entry. This information is instantly synced to a shared Google Sheet, giving Columbia Residential VP's and site managers a real-time, global ledger of property traffic.
            </p>
            
            <a 
              href="https://gateguard.co/sales-portal" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-slate-900 text-white font-bold py-4 px-8 rounded-xl hover:bg-slate-800 transition-all shadow-md hover:-translate-y-1"
            >
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 000 2v10a1 1 0 000 2h14a1 1 0 000-2V5a1 1 0 000-2H3zm3 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
              View Interactive Demo
            </a>
          </div>

          {/* CSS-Built UI Mockups - Absolutely Positioned for Perfect Layering */}
          <div className="relative w-full min-h-[500px] mt-10 lg:mt-0 flex items-center justify-center">
            
            {/* Mock Google Sheet (Background Layer) */}
            <div className="absolute right-0 top-32 w-11/12 max-w-2xl bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border border-slate-200 overflow-hidden transform rotate-2 hover:rotate-1 transition-transform duration-500 z-10">
              <div className="bg-[#f0fdf4] border-b border-[#bbf7d0] px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-[#16a34a] rounded flex items-center justify-center text-white shadow-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 4v3H4V4h1zm2 0v3h6V4H7zm8 0v3h1V4h-1zM4 9v2h1V9H4zm2 0v2h6V9H7zm8 0v2h1V9h-1zM4 13v3h1v-3H4zm2 0v3h6v-3H7zm8 0v3h1v-3h-1z" clipRule="evenodd"></path></svg>
                  </div>
                  <span className="text-sm font-bold text-slate-700">Mechanicsville_Visitor_Log</span>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-[#166534] font-bold bg-[#dcfce7] px-3 py-1 rounded-full border border-[#bbf7d0] shadow-sm">
                  <span className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse"></span> Live Sync
                </span>
              </div>
              
              <div className="p-0 overflow-x-auto bg-white">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="px-5 py-4 pl-12 sm:pl-5">Timestamp</th>
                      <th className="px-5 py-4">Visitor Name</th>
                      <th className="px-5 py-4">Visitor Number</th>
                      <th className="px-5 py-4">Granted By</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 text-slate-500 pl-12 sm:pl-5">Apr 1, 10:24 AM</td>
                      <td className="px-5 py-4 font-bold text-slate-900">John Doe</td>
                      <td className="px-5 py-4 font-mono text-slate-500">***-***-8492</td>
                      <td className="px-5 py-4"><span className="text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded font-semibold text-xs">Unit 402</span></td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 text-slate-500 pl-12 sm:pl-5">Apr 1, 10:15 AM</td>
                      <td className="px-5 py-4 font-bold text-slate-900">Amazon Delivery</td>
                      <td className="px-5 py-4 font-mono text-slate-500">***-***-1102</td>
                      <td className="px-5 py-4"><span className="text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded font-semibold text-xs">Leasing Office</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 text-slate-500 pl-12 sm:pl-5">Apr 1, 09:45 AM</td>
                      <td className="px-5 py-4 font-bold text-slate-900">Sarah Jenkins</td>
                      <td className="px-5 py-4 font-mono text-slate-500">***-***-5531</td>
                      <td className="px-5 py-4"><span className="text-red-700 bg-red-50 border border-red-100 px-2 py-1 rounded font-semibold text-xs">Denied - No Answer</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mock Physical Sign - Strict 4x5 Aspect Ratio & Fortune 500 Feel (Foreground Layer) */}
            <div className="absolute left-0 lg:left-8 top-0 w-72 h-[360px] bg-gradient-to-br from-white to-slate-200 rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-[12px] border-[#1e293b] flex flex-col items-center text-center transform -rotate-3 hover:-rotate-1 transition-transform duration-500 z-20 overflow-hidden ring-1 ring-white/50 inset-0">
              
              {/* Fake light reflection for physical hardware feel */}
              <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/70 to-transparent pointer-events-none"></div>

              <div className="p-6 flex flex-col h-full w-full justify-between items-center relative z-10">
                
                {/* Embedded Logo targeting the file you upload */}
                <div className="h-16 mb-2 w-full flex items-center justify-center">
                  <img src="/columbia-logo.png" alt="Columbia Residential" className="max-h-full max-w-full object-contain drop-shadow-sm" />
                </div>
                
                <div className="space-y-1 w-full">
                  <h3 className="text-[17px] font-extrabold text-slate-900 leading-tight tracking-tight uppercase">Welcome to <br/>Mechanicsville Crossing</h3>
                  <p className="text-slate-600 text-[9px] font-bold uppercase tracking-widest border-b border-slate-300 pb-3 mx-4 mt-2">Visitors scan code for access</p>
                </div>
                
                <div className="bg-white p-2.5 rounded-lg shadow-md border border-slate-200 my-2">
                  <svg className="w-20 h-20 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h-3v2h3v-2zm-3 4h3v2h-3v-2zm-2-2h-2v2h2v-2zm-2 4h-2v2h2v-2zm4 0h2v2h-2v-2zm2-6h2v2h-2v-2zm-4 4h2v2h-2v-2z" />
                  </svg>
                </div>
                
                <div className="w-full">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Or Call Office</p>
                  <p className="text-[#0f172a] font-black text-xl tracking-wide">(404) 221-0506</p>
                </div>
              </div>
            </div>
            
            {/* Background flair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 rounded-full blur-[100px] -z-10 opacity-30 pointer-events-none"></div>
          </div>
          
        </div>
      </section>

      {/* 4. CALL TO ACTION / HANDOFF */}
      <section className="py-24 px-6 max-w-4xl mx-auto border-t border-slate-200">
        <div className="bg-white rounded-3xl p-12 lg:p-16 text-center shadow-xl border border-slate-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>
           <h3 className="text-4xl font-extrabold mb-6 text-slate-900 tracking-tight leading-tight relative z-10">Ready to Secure <br className="hidden md:block" />The Columbia Residential Portfolio?</h3>
           <p className="text-slate-600 mb-10 text-xl max-w-2xl mx-auto leading-relaxed relative z-10">
             Stop paying for redundant infrastructure and reactive, emergency repairs. See our complete, detailed pricing breakdown tailored specifically for the assets you manage.
           </p>
           
           <Link 
             href="https://gateguard.co/pricing/columbiares" 
             target="_blank" 
             className="inline-block bg-blue-600 text-white font-bold py-5 px-12 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg tracking-wide relative z-10"
           >
             View Complete Columbia Residential Bulk Pricing
           </Link>
        </div>
      </section>

    </div>
  );
}
