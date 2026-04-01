import React from 'react';
import Link from 'next/link';

export default function ColumbiaResPresentation() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      
      {/* 1. HERO SECTION */}
      <header className="bg-slate-900 text-white py-24 px-6 text-center border-b-[8px] border-blue-600">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-900/50 border border-blue-700 text-blue-300 text-xs font-bold tracking-widest uppercase mb-6">
            Executive Briefing
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Elevating Access for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Columbia Residential</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
            A specialized roadmap to reduce operational friction, eliminate hardware headaches, and increase Net Operating Income across your portfolio.
          </p>
        </div>
      </header>

      {/* 2. CURRENT ISSUES & ELEVATION */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Moving Beyond Traditional Pain Points</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* The Current Reality Card */}
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm">✕</span>
              The Current Reality
            </h3>
            <ul className="space-y-4 text-slate-600 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-slate-400 mt-1">•</span>
                Managing physical fobs, lost keys, and clunky callboxes.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-400 mt-1">•</span>
                Disconnected video systems sitting in dusty back rooms.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-400 mt-1">•</span>
                High telecom bills and endless, expensive repair tickets.
              </li>
            </ul>
          </div>

          {/* The GateGuard Elevation Card */}
          <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-10 rounded-2xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold mb-6 text-blue-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm">✓</span>
              The GateGuard Elevation
            </h3>
            <ul className="space-y-4 text-blue-800 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                Mobile-first access synced perfectly to your existing PMS.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                24/7 Live video monitoring direct to any desktop or phone.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                AI-powered incident reporting and automated management.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. CASE STUDIES PLACEHOLDER */}
      <section className="bg-slate-900 text-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Proven Results in Multi-Family</h2>
            <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
            <p className="mt-6 text-slate-400">Real-world data from properties mirroring the Columbia Residential portfolio.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-72 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
              <span className="text-slate-500 font-medium">Case Study 1 Data UI</span>
            </div>
            <div className="h-72 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
              <span className="text-slate-500 font-medium">Case Study 2 Data UI</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICING & ROI PLACEHOLDER */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Side-by-Side Value Comparison</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">See exactly how transitioning to GateGuard impacts both your CapEx and OpEx bottom lines.</p>
        </div>
        
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-slate-200">
           <h3 className="text-2xl font-semibold mb-4 text-slate-800">Financial Modeling Table UI</h3>
           <p className="text-slate-500 mb-8">This section will house the direct comparison of current telecom/repair spend vs. GateGuard fixed pricing.</p>
           
           {/* Link to the specific pricing page you already built */}
           <Link 
             href="/pricing/columbiares" 
             className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
           >
             View Detailed Columbia Residential Pricing
           </Link>
        </div>
      </section>

    </div>
  );
}
