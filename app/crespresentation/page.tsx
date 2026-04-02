import React from 'react';
import Link from 'next/link';

export default function ColumbiaResPresentation() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      
      {/* 1. HERO SECTION */}
      <header className="bg-slate-900 text-white py-24 px-6 text-center border-b-[8px] border-blue-600">
        <div className="max-w-5xl mx-auto">
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

      {/* 2. THE VISUAL PAIN POINTS (Reworked to 'hit home') */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">The Reality of Reactive Access Control</h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-slate-600 leading-relaxed">
            We understand the daily challenges your on-site teams face. Brittle hardware, missing equipment, and unmonitored entries create a "Wild West" on your properties.
          </p>
        </div>
        
{/* Photo Gallery of Pain */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="overflow-hidden rounded-2xl shadow-lg group">
            <img src="/break-fix-1.jpg" alt="Missing gate hardware" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="bg-white p-4 text-center border border-t-0 border-slate-100">
              <p className="text-sm font-semibold text-slate-700">Missing hardware leading to wide-open entries.</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-lg group">
            <img src="/break-fix-2.jpg" alt="Damaged lock strike" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="bg-white p-4 text-center border border-t-0 border-slate-100">
              <p className="text-sm font-semibold text-slate-700">Vandalized strikes and locks requiring expensive repairs.</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-lg group">
            <img src="/break-fix-3.jpg" alt="Empty, useless callbox post" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="bg-white p-4 text-center border border-t-0 border-slate-100">
              <p className="text-sm font-semibold text-slate-700">Useless, empty posts and decommissioned equipment.</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-lg group">
            <img src="/break-fix-4.jpg" alt="Unmonitored pathway" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="bg-white p-4 text-center border border-t-0 border-slate-100">
              <p className="text-sm font-semibold text-slate-700">Unmonitored entries where incidents go unrecorded.</p>
            </div>
          </div>
        </div>

        {/* Traditional Reality vs GateGuard Summary Cards */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* The Current Reality Card */}
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 hover:border-red-200 transition-colors">
            <h3 className="text-2xl font-bold mb-8 text-slate-800 flex items-center gap-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 font-bold text-lg">✕</span>
              Moving From: The Current Bleed
            </h3>
            <ul className="space-y-5 text-slate-600 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-slate-400 mt-1">•</span>
                <strong>Fragmented Technology:</strong> DoorKing, Viking, and All-O-Matic systems that do not talk to each other, leading to staff confusion.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-400 mt-1">•</span>
                <strong>Redundant Telecom Waste:</strong> Multiple sites paying for up to 8 separate Comcast bills just to provide necessary network backhaul.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-400 mt-1">•</span>
                <strong>Manual Staff Labor:</strong> Managers spend hours adding or removing tenants across multiple softwares during move-in/out.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-400 mt-1">•</span>
                <strong>Reactive Repairs:</strong> Brittle aluminum hardware vandalized or abused, with no monitoring to assign accountability.
              </li>
            </ul>
          </div>

          {/* The GateGuard Elevation Card */}
          <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-10 rounded-2xl shadow-sm border border-blue-100 hover:border-blue-300 transition-colors">
            <h3 className="text-2xl font-bold mb-8 text-blue-900 flex items-center gap-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">✓</span>
              Moving To: The GateGuard Elevation
            </h3>
            <ul className="space-y-5 text-blue-800 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <strong>Network Consolidation:</strong> We install a network backhaul, requiring only one internet connection and eliminating thousands in monthly waste.
                <span className="bg-blue-200 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full ml-1">Big Savings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <strong>Total Automation:</strong> Direct API integration with your existing PMS completely eliminates physical fobs and manual data entry.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <strong>Proactive Security & Compliance:</strong> Steel hardware upgrades, mag covers, overnight camera monitoring, and strict EMS code compliance.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. CASE STUDIES SECTION */}
      <section className="bg-slate-900 text-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Proven Results in Multi-Family</h2>
            <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
            <p className="mt-6 text-slate-400 text-lg">Replacing unpredictable CapEx with stable, guaranteed lower monthly OpEx.</p>
          </div>
          
          <div className="space-y-12">
            
            {/* Case Study 1: Gardens at South City */}
            <div className="bg-slate-800 rounded-2xl p-8 lg:p-10 border border-slate-700">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-blue-400">Gardens at South City</h3>
                <p className="text-slate-400">290 Units | 6 Vehicle Gates | 19 Amenity & Pedestrian Gates</p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-slate-300">Before (The Bleed)</h4>
                  <p className="text-slate-400 mb-4 text-sm">7-8 redundant network bills, brittle aluminum hardware, unmonitored gates, and heavy resident friction.</p>
                  <table className="w-full text-left text-sm">
                    <tbody>
                      <tr className="border-b border-slate-700"><td className="py-2">ISP / Telecom</td><td className="py-2 text-right text-red-400">$1,200 - $2,400/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-2">DoorKing Costs</td><td className="py-2 text-right text-red-400">$250/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-2">Fob Replacements</td><td className="py-2 text-right text-red-400">$375/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-2">Average Repairs</td><td className="py-2 text-right text-red-400">$2,500/mo</td></tr>
                      <tr><td className="py-3 font-bold text-slate-300">Total Est. Cost</td><td className="py-3 text-right font-bold text-red-400">$4,325 - $5,525/mo</td></tr>
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-slate-300">After (The GateGuard Solution)</h4>
                  <p className="text-slate-400 mb-4 text-sm">Network backhaul, steel hardware upgrade, overnight monitoring, and hosted resident onboarding event.</p>
                  <table className="w-full text-left text-sm">
                    <tbody>
                      <tr className="border-b border-slate-700"><td className="py-2">ISP / Telecom</td><td className="py-2 text-right text-green-400">$400/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-2">DoorKing Costs</td><td className="py-2 text-right text-green-400">$0/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-2">Fob Replacements</td><td className="py-2 text-right text-green-400">$0/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-2">Average Repairs</td><td className="py-2 text-right text-green-400">$0/mo (Included)</td></tr>
                      <tr><td className="py-3 font-bold text-slate-300">GateGuard Package</td><td className="py-3 text-right font-bold text-green-400">$2,150 - $3,425/mo</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Case Study 2: Mechanicsville Crossing */}
            <div className="bg-slate-800 rounded-2xl p-8 lg:p-10 border border-slate-700 relative overflow-hidden">
              {/* Vandal Proof Icon Callout */}
              <div className="absolute top-0 right-0 bg-blue-600 text-white font-bold px-4 py-2 rounded-bl-xl text-xs flex items-center gap-1.5 shadow-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Focus on Vandal Proofing
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-blue-400">Mechanicsville Crossing</h3>
                <p className="text-slate-400">164 Units | 2 Vehicle Gates | 19 Amenity & Pedestrian Gates</p>
              </div>

              <div className="grid lg:grid-cols-[1fr,2fr] gap-12">
                
                {/* Before Table */}
                <div className="border-r lg:border-r-slate-700 pr-0 lg:pr-10">
                  <h4 className="text-lg font-semibold mb-4 text-slate-300">Before (The Bleed)</h4>
                  <p className="text-slate-400 mb-4 text-sm">High-traffic area with constant vandalism to callboxes and abused mag locks causing compliance failure.</p>
                  <table className="w-full text-left text-sm">
                    <tbody>
                      <tr className="border-b border-slate-700"><td className="py-2">ISP / Telecom</td><td className="py-2 text-right text-red-400">$800 - $1,200/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-2">DoorKing Costs</td><td className="py-2 text-right text-red-400">$400/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-2">Fob Replacements</td><td className="py-2 text-right text-red-400">$225/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-2">Average Repairs</td><td className="py-2 text-right text-red-400">$1,500/mo</td></tr>
                      <tr><td className="py-3 font-bold text-slate-300">Total Est. Cost</td><td className="py-3 text-right font-bold text-red-400">$2,925 - $3,325/mo</td></tr>
                    </tbody>
                  </table>
                </div>
                
                {/* GateGuard Solution & Hardware Quote */}
                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-slate-300">After (The GateGuard Solution)</h4>
                    <table className="w-full text-left text-sm">
                      <tbody>
                        <tr className="border-b border-slate-700"><td className="py-2">ISP / Telecom</td><td className="py-2 text-right text-green-400">$400/mo</td></tr>
                        <tr className="border-b border-slate-700"><td className="py-2">Average Repairs</td><td className="py-2 text-right text-green-400">$0/mo (Included)</td></tr>
                        <tr><td className="py-3 font-bold text-slate-300">GateGuard Package</td><td className="py-3 text-right font-bold text-green-400">$1,230 - $2,550/mo</td></tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Vandalism Solution Callout - The "Quotes on Mag Boxes" */}
                  <div className="bg-slate-900 border-l-4 border-blue-500 rounded-lg p-6 shadow-lg">
                    <h5 className="text-xl font-bold text-white mb-3">Targeted Hardware Upgrade: <span className="text-blue-400">Vandal-Proof Mag Covers</span></h5>
                    <p className="text-slate-400 text-base leading-relaxed mb-5">
                      We solve your "abused mag lock" problem. Installing custom metal MAG COVERS directly prevents vandalism and reduces long-term maintenance costs.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-slate-800 p-4 rounded-lg text-center border border-slate-700 shadow-inner">
                        <p className="text-sm text-slate-400">Single Install Cost</p>
                        <p className="text-2xl font-bold text-white">$700<span className="text-xs text-slate-500"> / ea</span></p>
                      </div>
                      <div className="bg-blue-950 p-4 rounded-lg text-center border border-blue-800 shadow-inner">
                        <p className="text-sm text-blue-300">Portfolio Bulk Offer (13+ Sites)</p>
                        <p className="text-2xl font-bold text-blue-100">$250<span className="text-xs text-blue-300"> / ea</span></p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION / HANDOFF */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-12 text-center shadow-xl border border-slate-100">
           <h3 className="text-3xl font-extrabold mb-6 text-slate-900 tracking-tight leading-tight">Ready to Secure <br/>The Columbia Residential Portfolio?</h3>
           <p className="text-slate-600 mb-10 text-lg max-w-2xl mx-auto leading-relaxed">
             Stop paying for redundant infrastructure and reactive, emergency repairs. See our complete, detailed pricing breakdown tailored specifically for the assets you manage.
           </p>
           
           <Link 
             href="gateguard.co/pricing/columbiares" 
             className="inline-block bg-blue-600 text-white font-bold py-5 px-12 rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg text-lg tracking-tight"
           >
             View Complete Columbia Residential Bulk Pricing
           </Link>
        </div>
      </section>

    </div>
  );
}
