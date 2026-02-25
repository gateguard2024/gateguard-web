"use client";
import React from 'react';
import Image from 'next/image';
import { SignIn } from '@clerk/nextjs';

export default function Login() {
  return (
    <main className="bg-[#050505] text-white min-h-screen font-sans selection:bg-cyan-500/30 flex">
      
      {/* LEFT SIDE: Your Custom Branding & Security Imagery */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black flex-col justify-between p-12 border-r border-white/5">
        <div className="absolute inset-0 z-0 opacity-40">
           <Image src="/hero-bg.jpg" alt="Secure Gate" fill className="object-cover grayscale" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
           <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
        </div>
        
        <div className="relative z-10">
          <Image src="/logo.png" alt="Gate Guard" width={60} height={60} className="mb-6 object-contain" />
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-[1.1] mb-4">
            Command <br/><span className="text-cyan-400">Center</span>
          </h1>
          <p className="text-zinc-400 font-light max-w-sm">Secure access to your Brivo identity management, Eagle Eye surveillance, and SOC dispatch alerts.</p>
        </div>

        <div className="relative z-10 flex gap-6">
           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> SOC Online
           </div>
           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div> End-to-End Encrypted
           </div>
        </div>
      </div>

      {/* RIGHT SIDE: The Actual Clerk Login Component */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 relative bg-[#050505]">
        
        <div className="lg:hidden flex items-center gap-3 mb-10 w-full max-w-md">
          <Image src="/logo.png" alt="Gate Guard" width={40} height={40} className="object-contain" />
          <h1 className="text-xl font-black uppercase tracking-tighter">Gate Guard</h1>
        </div>

        {/* Clerk's drop-in authentication UI */}
        <SignIn 
          fallbackRedirectUrl="/portal" 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-cyan-600 hover:bg-cyan-500 text-sm font-bold uppercase tracking-widest',
              card: 'bg-[#0a0a0a] border border-white/10 shadow-2xl',
              headerTitle: 'text-white',
              headerSubtitle: 'text-zinc-400',
              socialButtonsBlockButton: 'border border-white/10 hover:bg-white/5 text-white',
              socialButtonsBlockButtonText: 'text-white font-bold',
              dividerLine: 'bg-white/10',
              dividerText: 'text-zinc-500',
              formFieldLabel: 'text-zinc-400 uppercase tracking-widest text-[10px] font-bold',
              formFieldInput: 'bg-[#111] border-white/10 text-white',
              footerActionText: 'text-zinc-400',
              footerActionLink: 'text-cyan-500 hover:text-cyan-400'
            }
          }}
        />

        <p className="mt-12 text-center text-[10px] text-zinc-600 font-medium max-w-sm">
          Protected by enterprise-grade encryption. <br/> Access restricted to authorized personnel only.
        </p>
      </div>

    </main>
  );
}
