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
          <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light">
            A proactive "Your Gate Guard" roadmap to provide a superior tenant experience, preserve your assets, and transform unpredictable maintenance costs into guaranteed monthly savings.
          </p>
        </div>
      </header>

      {/* 2. CURRENT ISSUES & ELEVATION */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Moving Beyond Traditional Pain Points</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* The Current Reality Card */}
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm">✕</span>
              The Current Reality
            </h3>
            <ul className="space-y-4 text-slate-600 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-slate-400 mt-1">•</span>
                <strong>Fragmented Systems:</strong> Managing DoorKing, Viking, and multiple access controllers with up to 8 redundant telecom bills per site.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-400 mt-1">•</span>
                <strong>Operational Drain:</strong> Staff wastes 20-30 minutes per tenant move-in/out manually updating multiple disconnected software platforms.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-400 mt-1">•</span>
                <strong>Vulnerability & Damage:</strong> Unmonitored gates lead to property damage, unauthorized access, and a reactive, costly break-fix cycle.
              </li>
            </ul>
          </div>

          {/* The GateGuard Elevation Card */}
          <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-10 rounded-2xl shadow-sm border border-blue-100">
            <h3 className="text-2xl font-bold mb-6 text-blue-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm">✓</span>
              The GateGuard Elevation
            </h3>
            <ul className="space-y-4 text-blue-800 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <strong>Network Consolidation:</strong> We install a network backhaul, requiring only one internet connection and eliminating thousands in telecom waste.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <strong>Total Automation:</strong> Direct API integration with your PMS and cloud-based mobile access completely eliminates physical fobs and manual data entry.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <strong>Proactive Security & Compliance:</strong> Upgraded steel hardware, mag covers, overnight camera monitoring, and strict EMS code compliance.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. CASE STUDIES SECTION */}
      <section className="bg-slate-900 text-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Proven Results: Case Studies</h2>
            <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
            <p className="mt-6 text-slate-400 text-lg">Replacing unpredictable CapEx with stable, lower monthly OpEx.</p>
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
            <div className="bg-slate-800 rounded-2xl p-8 lg:p-10 border border-slate-700">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-blue-400">Mechanicsville Crossing</h3>
                <p className="text-slate-400">164 Units | 2 Vehicle Gates | 19 Amenity & Pedestrian Gates</p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-slate-300">Before (The Bleed)</h4>
                  <p className="text-slate-400 mb-4 text-sm">High vandalism, abused mag locks, code compliance issues, and redundant callboxes inside the perimeter.</p>
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
                
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-slate-300">After (The GateGuard Solution)</h4>
                  <p className="text-slate-400 mb-4 text-sm">Custom mag covers, push-to-exit fire compliance, QR/Keypad callboxes, and total repair coverage.</p>
                  <table className="w-full text-left text-sm">
                    <tbody>
                      <tr className="border-b border-slate-700"><td className="py-2">ISP / Telecom</td><td className="py-2 text-right text-green-400">$400/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-2">DoorKing Costs</td><td className="py-2 text-right text-green-400">$0/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-2">Fob Replacements</td><td className="py-2 text-right text-green-400">$0/mo</td></tr>
                      <tr className="border-b border-slate-700"><td className="py-2">Average Repairs</td><td className="py-2 text-right text-green-400">$0/mo (Included)</td></tr>
                      <tr><td className="py-3 font-bold text-slate-300">GateGuard Package</td><td className="py-3 text-right font-bold text-green-400">$1,230 - $2,550/mo</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION / HANDOFF */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-slate-200">
           <h3 className="text-3xl font-bold mb-6 text-slate-800 tracking-tight">Ready to Secure the Portfolio?</h3>
           <p className="text-slate-600 mb-8 text-lg">
             Stop paying for redundant infrastructure and reactive repairs. See our detailed, custom pricing breakdown tailored specifically for the Columbia Residential portfolio.
           </p>
           
           <Link 
             href="/pricing/columbiares" 
             className="inline-block bg-blue-600 text-white font-bold py-4 px-10 rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
           >
             View Complete Columbia Residential Pricing
           </Link>
        </div>
      </section>

    </div>
  );
}
