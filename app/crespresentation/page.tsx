import React from 'react';
import Link from 'next/link';

export default function ColumbiaResPresentation() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      
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
          <div className="overflow-hidden rounded-2xl shadow-lg group border border-slate-100">
            <img src="/break-fix-1.jpg" alt="Vandalized strike" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="bg-white p-4 text-center border border-t-0 border-slate-100">
              <p className="text-sm font-semibold text-slate-700">Vandalized strikes and locks requiring expensive repairs.</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-lg group border border-slate-100">
            <img src="/break-fix-2.jpg" alt="Missing hardware" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="bg-white p-4 text-center border border-t-0 border-slate-100">
              <p className="text-sm font-semibold text-slate-700">Missing hardware leading to wide-open entries.</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-lg group border border-slate-100">
            <img src="/break-fix-3.jpg" alt="Empty post" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="bg-white p-4 text-center border border-t-0 border-slate-100">
              <p className="text-sm font-semibold text-slate-700">Useless, empty posts and decommissioned equipment.</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-lg group border border-slate-100">
            <img src="/break-fix-4.jpg" alt="Unmonitored gate" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="bg-white p-4 text-center border border-t-0 border-slate-100">
              <p className="text-sm font-semibold text-slate-700">Unmonitored entries where incidents go unrecorded.</p>
            </div>
          </div>
        </div>

        {/* Traditional Reality vs GateGuard Summary Cards */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* The Current Reality Card (Redesigned) */}
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

          {/* The GateGuard Elevation Card (Redesigned) */}
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

              {/* Narrrative Story Block */}
              <div className="bg-slate-900/50 p-6 lg:p-8 rounded-xl border border-slate-700/50 mb-10 shadow-inner">
                <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                  The Situation
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  This property was trapped in a chaotic, reactive break-fix loop. With 25 total gates, management was juggling up to 8 separate Comcast bills just to keep basic systems online. Brittle aluminum gate hardware was constantly snapping, and acts of vandalism went unrecorded. The staff was overwhelmed, and the property was bleeding money with no unified security plan in place.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-xl font-semibold mb-6 text-slate-200 border-b border-slate-700 pb-3">Before (The Bleed)</h4>
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
                  <h4 className="text-xl font-semibold mb-6 text-slate-200 border-b border-slate-700 pb-3">After (The GateGuard Solution)</h4>
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
                  The Situation
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Situated in a high-traffic area, this property faced relentless vandalism. The magnetic locks were continually abused, causing major safety concerns and code compliance failures. There were redundant callboxes stationed inside the already gated perimeter. Between the high telecom bills and constant repair tickets, the property's NOI was taking a massive, unnecessary hit.
                </p>
              </div>

              <div className="grid lg:grid-cols-[1fr,1.3fr] gap-12 relative z-10">
                
                {/* Before Table */}
                <div className="border-r lg:border-r-slate-700 pr-0 lg:pr-10">
                  <h4 className="text-xl font-semibold mb-6 text-slate-200 border-b border-slate-700 pb-3">Before (The Bleed)</h4>
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
                    <h4 className="text-xl font-semibold mb-6 text-slate-200 border-b border-slate-700 pb-3">After (The GateGuard Solution)</h4>
                    <table className="w-full text-left text-base">
                      <tbody>
                        <tr className="border-b border-slate-700"><td className="py-3 text-slate-400">ISP / Telecom</td><td className="py-3 text-right font-medium text-green-400">$400/mo</td></tr>
                        <tr className="border-b border-slate-700"><td className="py-3 text-slate-400">Average Repairs</td><td className="py-3 text-right font-medium text-green-400">$0/mo (Included)</td></tr>
                        <tr><td className="py-4 font-bold text-slate-200 text-lg">GateGuard Package</td><td className="py-4 text-right font-bold text-green-400 text-lg">$1,230 - $2,550/mo</td></tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Vandalism Solution Callout - The "Quotes on Mag Boxes" */}
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

      {/* NEW SECTION: VISITOR WORKFLOW VISUALIZATION */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-200">
        <div className="grid lg:grid-cols-[1.5fr,1fr] gap-16 items-center">
          
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">Your Digital Gate Guard: <br className="hidden md:block" />Visitor Tracking Redefined</h2>
            <div className="w-16 h-1 bg-blue-600 rounded-full mb-8"></div>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              We turn physical access into actionable data. When a visitor scans the QR code on our vandal-proof sign, we automatically log their visit, verify their phone number, and record which staff member or resident granted entry. This information is instantly synced to a shared Google Sheet, giving Columbia Residential VP's and site managers a real-time, global ledger of property traffic. No more manual entry, no more lost data.
            </p>
            
            <a 
              href="https://gateguard.co/sales-portal" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-slate-900 text-white font-bold py-4 px-8 rounded-xl hover:bg-slate-800 transition-all shadow-md hover:-translate-y-1"
            >
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 000 2v10a1 1 0 000 2h14a1 1 0 000-2V5a1 1 0 000-2H3zm3 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
              View live Interactive demo
            </a>
          </div>

          <div className="relative group">
            {/* Vercel image */}
            <img 
              src="/visitor-workflow-tiles.png" 
              alt="Visualization of the Gate Guard visitor workflow, sign, and Google Sheet sync." 
              className="w-full rounded-2xl shadow-2xl border-4 border-white group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Background flair */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-100 rounded-full blur-3xl -z-10 group-hover:opacity-75 transition-opacity pointer-events-none"></div>
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
