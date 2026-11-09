"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DealerLocator from './components/DealerLocator';

// ─────────────────────────────────────────────────────────────────────────────
// gateguard.co — public homepage.
// Message (Nov 2026): the whole security program, installed, monitored and
// maintained by one partner — and it pays for itself. Two ways to run it:
// the self-funding program (amenity fee in the lease, property earns a share)
// or the bulk rate (one flat per-unit rate, custom proposal).
//
// No prices, rates, payouts or cost math appear on this page on purpose.
// Every number a prospect sees comes from a custom proposal.
// ─────────────────────────────────────────────────────────────────────────────

const PHONE_DISPLAY = '844-4MY-GATE';
const PHONE_TEL = 'tel:+18444694283';
const SUPPORT_EMAIL = 'support@gateguard.pro';
const PORTAL_URL = 'https://portal.gateguard.co';
const SCHEDULE_URL = 'https://portal.gateguard.co/schedule';

type LeadKind = 'proposal' | 'dealer' | 'contact';
type Program = 'self-funding' | 'bulk' | 'unsure';

// Tap-friendly stepper (− value +).
function Stepper({
  label, value, onChange, accent = 'cyan',
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  accent?: 'cyan' | 'amber';
}) {
  const ring = accent === 'amber' ? 'focus-within:border-amber-500/60' : 'focus-within:border-cyan-500/60';
  const tone = accent === 'amber' ? 'text-amber-400' : 'text-cyan-400';
  return (
    <div>
      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${tone}`}>{label}</p>
      <div className={`flex items-center bg-black border border-white/10 rounded-lg transition-colors ${ring}`}>
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(0, value - 1))}
          className="px-3 sm:px-4 py-3 text-zinc-500 hover:text-white transition-colors text-lg leading-none"
        >
          −
        </button>
        <input
          type="number" min="0" value={value} aria-label={label}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="w-full min-w-0 bg-transparent text-center text-white font-bold outline-none py-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(value + 1)}
          className="px-3 sm:px-4 py-3 text-zinc-500 hover:text-white transition-colors text-lg leading-none"
        >
          +
        </button>
      </div>
    </div>
  );
}

const SOLUTIONS = [
  { key: 'access', label: 'Gates & access control' },
  { key: 'video', label: 'Monitored cameras' },
  { key: 'callbox', label: 'Digital callbox' },
  { key: 'packages', label: 'Package room' },
  { key: 'locks', label: 'Smart unit locks' },
  { key: 'lpr', label: 'Plate reading (LPR)' },
] as const;
type SolutionKey = (typeof SOLUTIONS)[number]['key'];

const PROGRAM_LABEL: Record<Program, string> = {
  'self-funding': 'Self-funding program',
  bulk: 'Bulk rate',
  unsure: 'Not sure yet',
};

const COMPARE_OLD: [string, string][] = [
  ['Vendor juggling', 'A gate company, a camera installer, an access provider, a callbox and a locker vendor, all pointing at each other.'],
  ['Run-to-fail gates', 'You find out the gate is broken when a resident calls to say they’re locked out.'],
  ['Surprise repair bills', 'Operator failures turn into emergency capital requests and board approvals.'],
  ['Manual move-ins and move-outs', 'Staff add and delete residents from the gate directory by hand, and former residents keep their fobs.'],
  ['Unwatched package rooms', 'Once someone is inside, anyone can take anything, and nobody can prove who did.'],
];

const COMPARE_NEW: [string, string][] = [
  ['One partner for everything', 'We bring every opening to full working condition, then maintain, monitor and support it for the full term.'],
  ['Every repair covered', 'Parts, labor, trip charges and monthly preventative maintenance, with no surprise invoices. Only the steel gate and its hinges are excluded, and you can cover those too.'],
  ['Problems handled remotely first', 'Proactive monitoring and remote reset, so your team isn’t dispatched for every bump.'],
  ['Your PMS runs the gate', 'Residents enter by phone, synced with Yardi, Entrata or RealPage. Move-ins get access and move-outs lose it automatically.'],
  ['Damage gets charged back', 'Monitored cameras at the gate show who hit it, so the repair can be billed to the driver.'],
];

const SOLUTION_TILES = [
  {
    tag: 'Access & Gates', title: 'Gates that stay working',
    body: 'Vehicle gates, pedestrian gates and amenity doors brought to full working condition, then maintained and repaired for the full term. Residents enter by phone: no fobs or cards to buy, issue or replace.',
    img: '/gate-open.jpg', alt: 'Automatic vehicle gate at a multifamily entrance', wide: true, tone: 'cyan',
  },
  {
    tag: 'Monitored Cameras', title: 'Cameras that pay for themselves',
    body: 'Monitored cameras at the entries, included in the program. When a gate is struck, the footage shows who did it so the damage can be charged back. Plate-reading cameras available.',
    img: '/gate-closed.jpg', alt: 'Camera view of a closed community gate', wide: false, tone: 'blue',
  },
  {
    tag: 'Digital Callbox', title: 'Retire the DoorKing line',
    body: 'Visitors find a resident from the directory and are let in from the resident’s phone. The old phone line and its fees go away.',
    img: '/hero-bg.jpg', alt: 'Digital visitor callbox at a gated entry', wide: false, tone: 'cyan',
  },
  {
    tag: 'Package Room', title: 'Packages on the same key',
    body: 'Add the package room to the same phone credential as the gates, so access never depends on a code that gets passed around.',
    img: '/hero-bg.jpg', alt: 'Secure package room entrance', wide: false, tone: 'blue',
  },
  {
    tag: 'Smart Locks', title: 'Smart locks, one unit at a time',
    body: 'Smart locks go on each apartment door as the unit turns, so no resident is disturbed mid-lease. Key boxes, rekeys and lockout calls go away.',
    img: '/hero-bg.jpg', alt: 'Resident using a phone to unlock their apartment', wide: false, tone: 'cyan',
  },
];

export default function Home() {
  // Proposal builder — collects the property's facts for a custom proposal.
  const [units, setUnits] = useState(250);
  const [workingVehGates, setWorkingVehGates] = useState(2);
  const [nonWorkingVehGates, setNonWorkingVehGates] = useState(1);
  const [workingPedGates, setWorkingPedGates] = useState(2);
  const [nonWorkingPedGates, setNonWorkingPedGates] = useState(0);
  const [workingAccessDoors, setWorkingAccessDoors] = useState(2);
  const [nonWorkingAccessDoors, setNonWorkingAccessDoors] = useState(0);
  const [solutions, setSolutions] = useState<Record<SolutionKey, boolean>>({
    access: true, video: true, callbox: true, packages: false, locks: false, lpr: false,
  });
  const [program, setProgram] = useState<Program>('self-funding');

  const [modal, setModalRaw] = useState<LeadKind | null>(null);
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [sendError, setSendError] = useState('');
  const setModal = (k: LeadKind | null) => { setModalRaw(k); setSendState('idle'); setSendError(''); };

  const openings =
    workingVehGates + nonWorkingVehGates +
    workingPedGates + nonWorkingPedGates +
    workingAccessDoors + nonWorkingAccessDoors;
  const needsRepair = nonWorkingVehGates + nonWorkingPedGates + nonWorkingAccessDoors;
  const chosen = SOLUTIONS.filter((s) => solutions[s.key]);

  const lead = {
    proposal: {
      title: 'Get your custom proposal.',
      blurb: 'Tell us who to send it to. Your local dealer walks the site and confirms everything in writing.',
      companyLabel: 'Property / HOA',
      submit: 'SEND MY PROPOSAL REQUEST',
      thanks: 'Your request is in. We’ll call you to set up the site walk.',
    },
    dealer: {
      title: 'Become a Gate Guard dealer.',
      blurb: 'Install, service and grow recurring revenue on the Nexus platform. Tell us about your company and we’ll reach out.',
      companyLabel: 'Company',
      submit: 'APPLY TO THE NETWORK',
      thanks: 'Thanks for applying. Our channel team will reach out.',
    },
    contact: {
      title: 'Talk to Gate Guard.',
      blurb: 'Leave your details and the right person will call you back.',
      companyLabel: 'Property / Company',
      submit: 'SEND',
      thanks: 'Got it. The right person will be in touch.',
    },
  } as const;

  // Every form lands in Nexus → Leads (via /api/lead → portal /api/public/website-lead).
  async function submitLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!modal) return;
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? '').trim();
    setSendState('sending');
    setSendError('');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: modal,
          first_name: v('first_name'),
          last_name: v('last_name'),
          company: v('company'),
          title: v('title'),
          email: v('email'),
          phone: v('phone'),
          website: v('website'), // honeypot
          ...(modal === 'proposal' ? {
            units,
            program: PROGRAM_LABEL[program],
            solutions: chosen.map((s) => s.label),
            openings: {
              vehicle_working: workingVehGates, vehicle_repair: nonWorkingVehGates,
              ped_working: workingPedGates, ped_repair: nonWorkingPedGates,
              door_working: workingAccessDoors, door_repair: nonWorkingAccessDoors,
            },
          } : {}),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok !== true) throw new Error(data.error || 'Something went wrong.');
      setSendState('sent');
    } catch (err) {
      setSendError((err as Error).message || 'Something went wrong.');
      setSendState('error');
    }
  }

  return (
    <main className="bg-[#050505] text-white min-h-screen selection:bg-cyan-500/30 font-sans overflow-x-hidden">

      {/* Floating phone animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(-15px); }
          50% { transform: translateY(0px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-float, .animate-float-reverse { animation: none; }
        }
        html { scroll-behavior: smooth; }
        section[id] { scroll-margin-top: 6rem; }
      `}} />

      {/* 1. NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-2xl">
        <div className="container mx-auto px-4 sm:px-6 h-20 md:h-24 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-3 min-w-0">
            <Image src="/logo.png" alt="Gate Guard logo" width={56} height={56} className="object-contain w-11 h-11 md:w-14 md:h-14" />
            <div className="flex flex-col min-w-0">
              <span className="text-lg md:text-2xl font-black tracking-tighter uppercase italic leading-none text-white">Gate Guard</span>
              <span className="text-[8px] md:text-[9px] font-bold tracking-[0.3em] uppercase text-cyan-500 mt-1">Security Ecosystem</span>
            </div>
          </a>
          <div className="hidden lg:flex items-center gap-7 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            <a href="#solutions" className="hover:text-cyan-400 transition-colors">Solutions</a>
            <a href="#funding" className="hover:text-cyan-400 transition-colors">How It&apos;s Funded</a>
            <a href="#covered" className="hover:text-cyan-400 transition-colors">What&apos;s Covered</a>
            <a href="#dealers" className="hover:text-cyan-400 transition-colors">Managers &amp; Dealers</a>
            <a
              href={PORTAL_URL}
              className="px-7 py-3 border border-white/20 hover:border-cyan-400 text-white rounded-full transition-all"
            >
              Login
            </a>
            <a
              href="#proposal"
              className="px-7 py-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-full font-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:-translate-y-0.5"
            >
              Get a Proposal
            </a>
          </div>
          <div className="flex lg:hidden items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em]">
            <a href={PORTAL_URL} className="px-4 py-2.5 border border-white/20 text-white rounded-full">Login</a>
            <a href="#proposal" className="px-4 py-2.5 bg-cyan-500 text-black rounded-full font-black">Proposal</a>
          </div>
        </div>
      </nav>

      {/* 2. HERO */}
      <section id="top" className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden border-b border-white/5 bg-[#050505]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="Multifamily community with a secure gated entry"
            fill
            className="object-cover grayscale"
            priority
          />
          <div className="absolute inset-0 bg-[#0A192F] opacity-85 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

            {/* Left: message */}
            <div className="w-full lg:flex-[1.15] text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-[10px] font-bold tracking-[0.2em] uppercase bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-full text-cyan-400 shadow-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                One partner · Every entry
              </div>
              <h1 className="text-[2.6rem] sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05] drop-shadow-2xl">
                Security that <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">pays for itself.</span>
              </h1>
              <div className="border-l-2 border-cyan-500/50 pl-5 mb-8 max-w-xl mx-auto lg:mx-0 text-left">
                <p className="text-zinc-300 text-base lg:text-xl leading-relaxed font-light">
                  One set-up fee brings every gate and door to full working condition. After that, your property pays
                  nothing: residents fund the program, and{' '}
                  <span className="text-white font-semibold">every repair is covered for the full five-year term.</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#proposal" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-full hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.6)] transition-all hover:-translate-y-1 border border-cyan-400/50 tracking-wide text-sm text-center">
                  BUILD MY PROPOSAL
                </a>
                <a href="#funding" className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all text-sm tracking-wide text-center">
                  HOW IT&apos;S FUNDED
                </a>
              </div>
              <p className="mt-5 text-sm text-zinc-400">
                Can’t charge resident fees? <a href="#funding" className="text-cyan-400 font-semibold hover:text-cyan-300">Ask for our bulk rate →</a>
              </p>
              <ul className="mt-6 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-zinc-400">
                {['No fobs', 'No repair invoices', 'No trip charges', 'No DoorKing fees'].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>{t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: the two experiences */}
            <div className="w-full lg:flex-1 relative mt-12 lg:mt-0 h-[460px] sm:h-[560px] lg:h-[600px] max-w-lg mx-auto">

              {/* Visitor: digital callbox */}
              <div className="absolute left-0 top-0 w-[58%] sm:w-64 z-30 animate-float">
                <div className="absolute -left-1 sm:-left-12 top-10 bg-black/60 backdrop-blur-2xl border border-white/10 p-2 sm:p-4 rounded-xl z-40 whitespace-nowrap">
                  <p className="text-cyan-400 text-[7px] sm:text-[8px] font-black uppercase tracking-[0.3em] mb-1">Visitor Experience</p>
                  <p className="text-white text-[11px] sm:text-sm font-bold">Digital Callbox</p>
                </div>
                <div className="bg-gradient-to-b from-zinc-700 to-black p-[2px] rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl">
                  <div className="bg-black p-1 rounded-[1.9rem] sm:rounded-[2.4rem]">
                    <div className="aspect-[9/19] rounded-[1.7rem] sm:rounded-[2rem] overflow-hidden relative border border-white/10">
                      <Image src="/app-callbox.png" alt="Gate Guard digital callbox screen for visitors" fill className="object-cover" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Resident: Nexus Resident phone key (drawn in code) */}
              <div className="absolute right-0 top-32 sm:top-40 lg:top-auto lg:bottom-0 w-[54%] sm:w-56 z-20 animate-float-reverse">
                <div className="absolute -right-1 sm:-right-8 bottom-[15%] bg-black/70 backdrop-blur-2xl border border-white/10 p-2 sm:p-4 rounded-xl z-40 text-right whitespace-nowrap">
                  <p className="text-blue-400 text-[7px] sm:text-[8px] font-black uppercase tracking-[0.3em] mb-1">Resident Experience</p>
                  <p className="text-white text-[11px] sm:text-sm font-bold">One phone key</p>
                </div>
                <div className="bg-gradient-to-b from-zinc-800 to-black p-[2px] rounded-[1.8rem] sm:rounded-[2.5rem] shadow-2xl">
                  <div className="bg-black p-1 rounded-[1.7rem] sm:rounded-[2.4rem]">
                    <div className="aspect-[9/19] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden relative border border-white/10 bg-gradient-to-b from-[#0b1426] via-[#070b14] to-black flex flex-col px-3 sm:px-4 pt-4 sm:pt-5 pb-3" role="img" aria-label="Nexus Resident app: hold to open the main gate, one package waiting on shelf B">
                      <div className="flex justify-between text-[7px] sm:text-[8px] text-zinc-400 font-semibold">
                        <span>9:41</span><span>●●● ▮</span>
                      </div>
                      <p className="mt-3 sm:mt-4 text-right sm:text-left text-[7px] sm:text-[8px] font-black uppercase tracking-[0.25em] text-cyan-400">Nexus Resident</p>
                      <p className="text-right sm:text-left text-white text-[11px] sm:text-sm font-bold leading-tight mt-1">Welcome home, Jordan</p>
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.35)]">
                          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <rect x="5" y="11" width="14" height="10" rx="2" />
                              <path d="M8 11V7a4 4 0 0 1 7.5-2" />
                            </svg>
                          </div>
                        </div>
                        <p className="mt-2 sm:mt-3 text-[8px] sm:text-[10px] text-zinc-300 font-semibold">Hold to open</p>
                        <p className="text-[9px] sm:text-xs text-white font-bold">Main Gate</p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-2 py-1.5">
                          <span className="text-[7px] sm:text-[9px] text-white font-semibold">1 package · Shelf B</span>
                          <span className="text-[7px] sm:text-[9px] text-cyan-400">›</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 text-center text-[6px] sm:text-[8px] text-zinc-300">
                          <span className="bg-white/5 border border-white/10 rounded-md py-1">Pool</span>
                          <span className="bg-white/5 border border-white/10 rounded-md py-1">Gym</span>
                          <span className="bg-white/5 border border-white/10 rounded-md py-1">Guests</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. WHO IT'S FOR */}
      <section className="py-12 bg-[#050505] border-b border-white/5 relative z-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-8">Built For</p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 md:gap-x-16 opacity-70">
            {['MULTIFAMILY', 'HOA COMMUNITIES', 'STUDENT & SENIOR HOUSING', 'COMMERCIAL SITES'].map((t) => (
              <span key={t} className="text-sm md:text-base font-black tracking-tighter text-white">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OLD WAY vs GATE GUARD */}
      <section id="compare" className="py-24 md:py-32 bg-black border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-14 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Five vendors. Five bills. <span className="text-cyan-400 italic">Or one partner.</span>
            </h2>
            <p className="text-zinc-400 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
              Gate repair, cameras, access control, callboxes and package lockers usually mean separate companies,
              separate apps and separate bills. Gate Guard runs all of it on one platform, and we answer for all of it.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
            <div className="flex-1 bg-zinc-950 border border-red-900/30 rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-900/50"></div>
              <h3 className="text-red-400 font-bold mb-8 uppercase tracking-widest text-sm flex items-center gap-2">
                <span className="text-xl">✕</span> The Old Way
              </h3>
              <ul className="space-y-7">
                {COMPARE_OLD.map(([h, p]) => (
                  <li key={h}>
                    <h4 className="text-lg md:text-xl font-bold text-white mb-1.5">{h}</h4>
                    <p className="text-zinc-500 text-sm leading-relaxed">{p}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 bg-gradient-to-br from-zinc-900 to-[#0A192F] border border-cyan-500/30 rounded-[2rem] p-8 md:p-12 relative shadow-[0_0_40px_rgba(6,182,212,0.1)] lg:-translate-y-4">
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
              <h3 className="text-cyan-400 font-bold mb-8 uppercase tracking-widest text-sm flex items-center gap-2">
                <span className="text-xl">✓</span> The Gate Guard Way
              </h3>
              <ul className="space-y-7">
                {COMPARE_NEW.map(([h, p]) => (
                  <li key={h}>
                    <h4 className="text-lg md:text-xl font-bold text-white mb-1.5">{h}</h4>
                    <p className="text-zinc-300 text-sm leading-relaxed">{p}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SOLUTIONS — ONE PLATFORM */}
      <section id="solutions" className="py-24 md:py-32 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
        <div className="absolute top-20 left-[-10%] w-[40%] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-20 right-[-10%] w-[40%] h-[500px] bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Powered by Nexus</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              One platform. <span className="text-cyan-400 italic">Every entry.</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg">
              Nexus is the Gate Guard platform behind every site: one app for residents, one portal for your team,
              and one place where we watch over every gate, door and camera.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLUTION_TILES.map((s) => (
              <div
                key={s.tag}
                className={`relative border border-white/10 rounded-[2rem] min-h-[300px] ${s.tone === 'cyan' ? 'hover:border-cyan-500/50' : 'hover:border-blue-500/50'} transition-colors group overflow-hidden shadow-lg ${s.wide ? 'md:col-span-2' : ''}`}
              >
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <Image src={s.img} alt={s.alt} fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover grayscale opacity-40 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                  <div className="absolute inset-0 bg-[#0A192F] opacity-90 mix-blend-multiply"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                </div>
                <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-end">
                  <h3 className={`${s.tone === 'cyan' ? 'text-cyan-400' : 'text-blue-400'} font-bold mb-3 uppercase text-xs tracking-widest`}>{s.tag}</h3>
                  <h4 className={`${s.wide ? 'text-2xl md:text-3xl' : 'text-2xl'} font-bold mb-4 text-white`}>{s.title}</h4>
                  <p className={`${s.wide ? 'text-zinc-300 text-base md:text-lg max-w-xl' : 'text-zinc-400 text-sm'} leading-relaxed font-light`}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW IT'S FUNDED — TWO PROGRAMS */}
      <section id="funding" className="py-24 md:py-32 bg-black border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] max-w-full h-[600px] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-14 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Two ways to pay. <span className="text-cyan-400 italic">Both make sense.</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg">
              Most communities choose the self-funding program. If you can’t charge resident fees, our bulk rate puts
              everything on one flat bill. Either way, you get the full program, and the repair, fob and capital costs
              you stop paying go straight to NOI.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Self-funding */}
            <div className="relative bg-gradient-to-br from-zinc-900 to-[#0A192F] border border-cyan-500/40 rounded-[2rem] p-8 md:p-12 shadow-[0_0_40px_rgba(6,182,212,0.12)] overflow-hidden flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
              <p className="self-start text-[10px] font-black uppercase tracking-[0.25em] text-black bg-cyan-400 rounded-full px-3 py-1 mb-6">Most popular</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Self-Funding Program</h3>
              <p className="text-zinc-300 leading-relaxed mb-8">
                Pay a one-time set-up. After that, the property pays Gate Guard nothing. A parking and amenity fee
                funds the program.
              </p>
              <ul className="space-y-4 text-sm">
                {[
                  '$0 ongoing to the property: no monthly fee, no service calls, no parts or labor',
                  'Gate Guard bills and collects the fee at lease signing and renewal, never through your office',
                  'Every repair, trip charge and monthly maintenance visit covered for the full term',
                  'Resident access questions handled by Gate Guard, so your office isn’t the help desk',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-0.5">✓</span>
                    <span className="text-zinc-200">{t}</span>
                  </li>
                ))}
              </ul>
              <a href="#proposal" onClick={() => setProgram('self-funding')} className="mt-auto pt-10 block">
                <span className="block w-full text-center px-8 py-4 bg-cyan-500 text-black font-black rounded-full hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)] transition-all hover:-translate-y-1 text-sm tracking-wide">
                  SEE MY SELF-FUNDING PROPOSAL
                </span>
              </a>
            </div>

            {/* Bulk */}
            <div className="relative bg-zinc-950 border border-white/15 rounded-[2rem] p-8 md:p-12 flex flex-col">
              <p className="self-start text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300 border border-cyan-500/40 rounded-full px-3 py-1 mb-6">No resident fees</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Bulk Rate</h3>
              <p className="text-zinc-300 leading-relaxed mb-8">
                <span className="text-white font-semibold">Don’t or can’t charge your residents fees? No problem.</span>{' '}
                The property covers the program at one flat monthly rate, set in a custom proposal for your community.
              </p>
              <ul className="space-y-4 text-sm">
                {[
                  'Residents are never billed individually',
                  'One flat monthly rate that won’t increase during the initial term',
                  'The same full program: every repair, monitored cameras, phone access and PMS sync',
                  'Priced for your property in a custom proposal',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-0.5">✓</span>
                    <span className="text-zinc-300">{t}</span>
                  </li>
                ))}
              </ul>
              <a href="#proposal" onClick={() => setProgram('bulk')} className="mt-auto pt-10 block">
                <span className="block w-full text-center px-8 py-4 bg-white/5 border border-white/15 text-white font-bold rounded-full hover:bg-white/10 transition-all text-sm tracking-wide">
                  GET A BULK RATE PROPOSAL
                </span>
              </a>
            </div>
          </div>

          <p className="text-center text-[11px] text-zinc-500 mt-10 max-w-2xl mx-auto leading-relaxed">
            Both programs start with a one-time set-up, half at signing and half at go-live, with no change orders for
            the scope in your proposal. Five-year term. Agreements are per property and transfer with the property if it sells.
          </p>
        </div>
      </section>

      {/* 7. WHAT'S COVERED — mirrors the Gate Protection & Access Control Service Agreement */}
      <section id="covered" className="py-24 md:py-32 bg-[#050505] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-14 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Covered. <span className="text-cyan-400 italic">All of it.</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg">
              One repair quote elsewhere runs $5,000 to $10,000 and fixes one gate, once. With Gate Guard you never buy
              the same repair twice.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {[
              ['Every repair', 'Motors, operators, controllers, readers and callboxes: parts, labor and trip charges for the full term.'],
              ['Monthly maintenance', 'Scheduled preventative maintenance at every gate and door, plus remote support and unscheduled repairs.'],
              ['Software & platform', 'Phone access, PMS sync, user management, updates and video retrieval. Gate Guard pays the platform fees.'],
              ['Resident support', 'Access questions and credential help go to Gate Guard, not your leasing office.'],
            ].map(([h, p]) => (
              <div key={h} className="bg-zinc-900/50 border border-white/10 rounded-[1.75rem] p-7 backdrop-blur-xl">
                <p className="text-cyan-400 text-lg mb-3">✓</p>
                <h3 className="text-white font-bold text-lg mb-2">{h}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{p}</p>
              </div>
            ))}
          </div>

          <div className="max-w-6xl mx-auto mt-6 bg-gradient-to-r from-zinc-900 to-[#0A192F] border border-cyan-500/20 rounded-[1.75rem] p-7 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400 md:w-48 shrink-0">The one thing not covered</p>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              The steel gate itself: panel, frame, posts, hinges and welds. You can add coverage for that too. You provide
              power and internet at each gate.
            </p>
          </div>
        </div>
      </section>

      {/* 8. PROPOSAL BUILDER */}
      <section id="proposal" className="py-24 md:py-32 relative border-t border-white/5 overflow-hidden bg-gradient-to-b from-[#050505] via-[#0a0f1a] to-[#050505]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] max-w-full h-[600px] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-14 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Build your <span className="text-cyan-400 italic">proposal.</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg">
              Tell us what your community has today. Your local Gate Guard dealer turns it into a custom proposal
              with your set-up, your program and your savings, in writing.
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-zinc-900/50 border border-white/10 rounded-[2rem] p-5 sm:p-8 md:p-12 backdrop-blur-xl shadow-2xl flex flex-col lg:flex-row gap-10 lg:gap-12">

            {/* Inputs */}
            <div className="flex-1 space-y-8 min-w-0">
              <div>
                <div className="flex justify-between mb-2">
                  <label htmlFor="units" className="text-white font-bold text-sm tracking-wide uppercase">Units / Homes</label>
                  <span className="text-cyan-400 font-black">{units}</span>
                </div>
                <input
                  id="units" type="range" min="20" max="1000" step="10"
                  value={units} onChange={(e) => setUnits(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="space-y-5">
                <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest border-b border-white/10 pb-2">
                  Your entries today
                </p>
                <p className="text-[11px] text-zinc-500 leading-relaxed -mt-2">
                  Count anything that isn’t working right now under “Needs repair.” We fix it as part of set-up.
                </p>

                {([
                  ['Vehicle Gates', workingVehGates, setWorkingVehGates, nonWorkingVehGates, setNonWorkingVehGates],
                  ['Pedestrian Gates', workingPedGates, setWorkingPedGates, nonWorkingPedGates, setNonWorkingPedGates],
                  ['Access Doors', workingAccessDoors, setWorkingAccessDoors, nonWorkingAccessDoors, setNonWorkingAccessDoors],
                ] as const).map(([label, wVal, wSet, nVal, nSet]) => (
                  <div key={label}>
                    <p className="text-zinc-400 font-bold text-xs tracking-widest uppercase mb-2">{label}</p>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <Stepper label="Working" value={wVal} onChange={wSet} />
                      <Stepper label="Needs repair" value={nVal} onChange={nSet} accent="amber" />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest border-b border-white/10 pb-2 mb-4">
                  What you want covered
                </p>
                <div className="flex flex-wrap gap-2">
                  {SOLUTIONS.map((s) => {
                    const on = solutions[s.key];
                    return (
                      <button
                        key={s.key}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setSolutions((prev) => ({ ...prev, [s.key]: !prev[s.key] }))}
                        className={`px-4 py-2.5 rounded-full text-xs font-bold border transition-all ${on ? 'bg-cyan-500/15 border-cyan-400/60 text-cyan-200' : 'bg-black border-white/10 text-zinc-500 hover:text-white'}`}
                      >
                        {on ? '✓ ' : '+ '}{s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest border-b border-white/10 pb-2 mb-4">
                  How you’d like to pay
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(Object.keys(PROGRAM_LABEL) as Program[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      aria-pressed={program === p}
                      onClick={() => setProgram(p)}
                      className={`px-3 py-3 rounded-xl text-xs font-bold border transition-all ${program === p ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-black border-white/10 text-zinc-400 hover:text-white'}`}
                    >
                      {PROGRAM_LABEL[p]}
                    </button>
                  ))}
                </div>
                {program === 'bulk' && (
                  <p className="text-[11px] text-zinc-400 mt-3">No problem. We’ll quote one flat per-unit rate with nothing billed to residents.</p>
                )}
                {program === 'unsure' && (
                  <p className="text-[11px] text-zinc-400 mt-3">We’ll show you both side by side.</p>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="flex-1 bg-black border border-cyan-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee]"></div>

              <h3 className="text-center text-zinc-400 text-sm font-bold uppercase tracking-widest mb-6">Your proposal will cover</h3>

              <div className="grid grid-cols-3 gap-3 text-center mb-8">
                <div>
                  <p className="text-3xl sm:text-4xl font-black text-white">{units}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Units</p>
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl font-black text-white">{openings}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Entries</p>
                </div>
                <div>
                  <p className={`text-3xl sm:text-4xl font-black ${needsRepair > 0 ? 'text-amber-400' : 'text-white'}`}>{needsRepair}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">To repair</p>
                </div>
              </div>

              <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl space-y-3">
                <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest border-b border-cyan-500/20 pb-2">
                  {program === 'unsure' ? 'Self-funding vs. bulk rate' : PROGRAM_LABEL[program]}
                </p>
                {(chosen.length ? chosen.map((s) => s.label) : ['Pick at least one solution']).map((line) => (
                  <div key={line} className="flex items-start gap-2 text-xs">
                    <span className="text-cyan-400 mt-0.5">✓</span>
                    <span className="text-zinc-200">{line}</span>
                  </div>
                ))}
                {['Every repair, parts, labor and trip charges', 'Phone access, PMS sync and the Nexus portal'].map((line) => (
                  <div key={line} className="flex items-start gap-2 text-xs">
                    <span className="text-cyan-400 mt-0.5">✓</span>
                    <span className="text-zinc-400">{line}</span>
                  </div>
                ))}
              </div>

              <ol className="mt-6 space-y-2 text-xs text-zinc-400">
                <li><span className="text-cyan-400 font-bold mr-2">1</span>We review what you sent and call you.</li>
                <li><span className="text-cyan-400 font-bold mr-2">2</span>Your local dealer walks the site.</li>
                <li><span className="text-cyan-400 font-bold mr-2">3</span>You get a custom proposal with your numbers, in writing.</li>
              </ol>

              <button
                type="button"
                onClick={() => setModal('proposal')}
                className="w-full mt-8 px-8 py-4 bg-cyan-500 text-black font-black rounded-full hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)] transition-all hover:-translate-y-1"
              >
                REQUEST MY PROPOSAL
              </button>
              <p className="text-[10px] text-zinc-500 text-center mt-3">No cost and no commitment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. DEALERS + CONTACT */}
      <section id="dealers" className="py-24 md:py-32 bg-gradient-to-b from-[#050505] to-[#0A192F] relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image src="/hero-bg.jpg" alt="" fill className="object-cover grayscale opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#050505]/80 to-[#050505]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-zinc-900/60 border border-white/10 p-6 sm:p-12 md:p-16 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
              Local service. <span className="text-cyan-400">One standard.</span>
            </h2>
            <p className="text-zinc-300 text-base md:text-lg mb-10 max-w-xl mx-auto font-light leading-relaxed">
              Gate Guard works through certified local dealers who install and service your site on the Nexus platform,
              under the same promise everywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#proposal" className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.6)] transition-all hover:-translate-y-1 text-center tracking-wide text-sm border border-cyan-400/50">
                GET A PROPOSAL
              </a>
              <a href={PHONE_TEL} className="px-10 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all text-center tracking-wide text-sm">
                CALL {PHONE_DISPLAY}
              </a>
            </div>

            <DealerLocator />

            <div className="mt-12 pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
                <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.25em] mb-2">Property managers</p>
                <p className="text-white font-bold text-lg mb-2">Your property in Nexus</p>
                <p className="text-zinc-400 text-sm mb-4">Gate status, cameras, residents and access, and service requests, all in one portal.</p>
                <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
                  <a href={PORTAL_URL} className="text-cyan-400 hover:text-cyan-300">Sign in →</a>
                  <a href={`mailto:${SUPPORT_EMAIL}?subject=Service%20request`} className="text-cyan-400 hover:text-cyan-300">Request service →</a>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
                <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.25em] mb-2">Installers & integrators</p>
                <p className="text-white font-bold text-lg mb-2">Become a dealer</p>
                <p className="text-zinc-400 text-sm mb-4">Recurring revenue on every site you install, with the Nexus platform behind you.</p>
                <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
                  <button type="button" onClick={() => setModal('dealer')} className="text-cyan-400 hover:text-cyan-300">Apply →</button>
                  <a href={PORTAL_URL} className="text-cyan-400 hover:text-cyan-300">Dealer sign in →</a>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
                <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.25em] mb-2">Residents</p>
                <p className="text-white font-bold text-lg mb-2">Access help</p>
                <p className="text-zinc-400 text-sm mb-4">Trouble with your phone key or gate access? Gate Guard handles resident support directly.</p>
                <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
                  <a href={`mailto:${SUPPORT_EMAIL}?subject=Resident%20access%20help`} className="text-cyan-400 hover:text-cyan-300">Get help →</a>
                </div>
              </div>
            </div>

            <div className="mt-10 text-zinc-400 text-sm flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              <span>Gate Guard HQ · Atlanta, GA</span>
              <a href={PHONE_TEL} className="hover:text-cyan-400">{PHONE_DISPLAY}</a>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-cyan-400 break-all">{SUPPORT_EMAIL}</a>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="py-16 md:py-20 bg-black border-t border-white/5 relative">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Image src="/logo.png" alt="Gate Guard logo" width={32} height={32} className="object-contain" />
                <span className="text-xl font-black tracking-tighter italic uppercase">Gate Guard</span>
              </div>
              <p className="text-zinc-500 max-w-sm text-sm leading-relaxed">
                One partner for every gate, door, camera and package room. Installed, monitored and maintained on the
                Nexus platform, and funded so it pays for itself.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Platform</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><a href="#solutions" className="hover:text-cyan-400 transition-colors">Solutions</a></li>
                <li><a href="#funding" className="hover:text-cyan-400 transition-colors">How It&apos;s Funded</a></li>
                <li><a href="#proposal" className="hover:text-cyan-400 transition-colors">Get a Proposal</a></li>
                <li><a href={SCHEDULE_URL} className="hover:text-cyan-400 transition-colors">Schedule a Consultation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Company</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><button type="button" onClick={() => setModal('dealer')} className="hover:text-cyan-400 transition-colors">Become a Dealer</button></li>
                <li><button type="button" onClick={() => setModal('contact')} className="hover:text-cyan-400 transition-colors">Contact Us</button></li>
                <li><a href={PORTAL_URL} className="hover:text-cyan-400 transition-colors">Sign In</a></li>
                <li><Link href="/investor" className="hover:text-cyan-400 transition-colors">Investors</Link></li>
                <li><a href={`${PORTAL_URL}/privacy`} className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                <li><a href={`${PORTAL_URL}/terms`} className="hover:text-cyan-400 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 text-center">
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.4em]">
              &copy; {new Date().getFullYear()} Gate Guard, LLC. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* SALESFORCE LEAD MODAL */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="lead-title">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={() => setModal(null)}
          ></div>

          <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setModal(null)}
              className="absolute top-5 right-6 text-zinc-500 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>

            <h3 id="lead-title" className="text-2xl sm:text-3xl font-bold mb-2 text-white tracking-tight pr-8">{lead[modal].title}</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">{lead[modal].blurb}</p>

            {modal === 'proposal' && (
              <div className="mb-6 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl text-xs text-zinc-300 leading-relaxed">
                <span className="text-cyan-400 font-bold">{units} units</span> · {openings} entries ({needsRepair} to repair) ·{' '}
                {PROGRAM_LABEL[program]}
              </div>
            )}

            {sendState === 'sent' ? (
              <div className="text-center py-6">
                <div className="mx-auto w-14 h-14 rounded-full bg-cyan-500/15 border border-cyan-400/50 flex items-center justify-center text-cyan-300 text-2xl mb-5">✓</div>
                <p className="text-white text-lg font-bold mb-2">{lead[modal].thanks}</p>
                <p className="text-zinc-400 text-sm mb-8">Questions in the meantime? Call <a href={PHONE_TEL} className="text-cyan-400">{PHONE_DISPLAY}</a>.</p>
                <button type="button" onClick={() => setModal(null)} className="px-8 py-3 bg-white/5 border border-white/15 text-white font-bold rounded-full hover:bg-white/10 text-sm">Close</button>
              </div>
            ) : (
            <form onSubmit={submitLead} className="space-y-4">
              {/* Honeypot — hidden from people, tempting to bots */}
              <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">First Name</label>
                  <input id="first_name" maxLength={40} name="first_name" type="text" required autoComplete="given-name" className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors" />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Last Name</label>
                  <input id="last_name" maxLength={80} name="last_name" type="text" required autoComplete="family-name" className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{lead[modal].companyLabel}</label>
                  <input id="company" maxLength={40} name="company" type="text" required autoComplete="organization" className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors" />
                </div>
                <div>
                  <label htmlFor="title" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Job Title</label>
                  <input id="title" maxLength={40} name="title" type="text" autoComplete="organization-title" className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Email</label>
                <input id="email" maxLength={80} name="email" type="email" required autoComplete="email" className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors" />
              </div>

              <div>
                <label htmlFor="phone" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Phone</label>
                <input id="phone" maxLength={40} name="phone" type="tel" autoComplete="tel" className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-colors" />
              </div>

              {sendState === 'error' && (
                <p className="text-sm text-amber-300" role="alert">
                  {sendError} Please try again, or call <a href={PHONE_TEL} className="underline">{PHONE_DISPLAY}</a>.
                </p>
              )}

              <button type="submit" disabled={sendState === 'sending'} className="w-full mt-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-full hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.6)] transition-all tracking-wide disabled:opacity-60">
                {sendState === 'sending' ? 'SENDING…' : lead[modal].submit}
              </button>
            </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
