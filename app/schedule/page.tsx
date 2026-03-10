'use client';

import { useState } from 'react';
import Image from 'next/image'; // Use Next.js Image component for optimization

// Define our premium icons (for simplicity, we define them here. 
// For production, use a library like Lucide-react or Phosphor)
const PhoneIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 5z" /></svg>
);
const SettingsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const BuildingIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
);

// Define our refined meeting types
const MEETING_TYPES = [
  { 
    id: 'intro', 
    title: 'Discovery Call', 
    description: 'A brief 30-minute introductory overview of the GateGuard system.', 
    duration: '30 min' 
  },
  { 
    id: 'lunch', 
    title: 'Lunch & Learn Session', 
    description: 'We evaluate your site, discuss solutions, and provide lunch for your team.', 
    duration: '1 hr' 
  },
  { 
    id: 'onsite', 
    title: 'Comprehensive Site Assessment', 
    description: 'An exhaustive 2-hour on-site evaluation of your current infrastructure and upgrade options.', 
    duration: '2 hrs' 
  },
];

export default function SchedulePage() {
  // State Machine for the UI flow
  const [step, setStep] = useState<number>(1);
  
  // Selections
  const [meetingType, setMeetingType] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', company: '' });

  // Mock available times (this will later come from our API)
  const availableTimes = ['09:00 AM', '10:30 AM', '01:00 PM', '03:30 PM'];

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Optional: Add a loading state here if you want to show a spinner on the button

  try {
    const response = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingType,
        selectedDate,
        selectedTime,
        formData
      }),
    });

    const data = await response.json();

    if (data.success) {
      setStep(4); // Move to success screen ONLY if Google successfully booked it
    } else {
      alert("Oops! Something went wrong booking your slot. Please try again.");
    }
  } catch (error) {
    console.error("Failed to submit form", error);
  }
};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-4 sm:p-8 font-sans transition-all duration-300">
      {/* Mesh/Grid Background Effect */}
      <div className="absolute inset-0 bg-slate-950 bg-[url('/mesh.svg')] bg-center opacity-30"></div>
      
      <div className="max-w-4xl w-full bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col md:flex-row transition-all duration-500 relative z-10">
        
        {/* Left Column: Premium Content & Context Receipt */}
        <div className="bg-slate-950/50 p-10 md:w-2/5 flex flex-col border-b md:border-b-0 md:border-r border-slate-800">
          <div>
            {/* Instant Brand Recognition: Actual Logo */}
            <div className="flex items-center gap-3 mb-10">
              <Image src="/logo.png" alt="GateGuard Logo" width={40} height={40} className="w-10 h-10 object-contain" />
              <h2 className="text-xl font-bold tracking-widest uppercase text-slate-400">GateGuard</h2>
            </div>
            
            <h1 className="text-4xl font-extralight text-white mb-8 leading-tight">
              {step === 1 && "How can we help?"}
              {step === 2 && "Choose a time."}
              {step === 3 && "Final details."}
              {step === 4 && "Booking Confirmed."}
            </h1>

            {/* Dynamic visual summary: The Receipt flow */}
            <div className="space-y-6 text-sm text-slate-400">
              {meetingType && (
                <div className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2 transition-all duration-300">
                  <span className="text-blue-500 mt-0.5">{meetingType.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-300">{meetingType.title}</p>
                    <p>{meetingType.duration}</p>
                  </div>
                </div>
              )}
              {selectedTime && selectedDate && (
                <div className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2 transition-all duration-300">
                  <span className="text-blue-500 mt-0.5">🗓️</span>
                  <div>
                    <p className="font-semibold text-slate-300">March {selectedDate}, 2026</p>
                    <p>{selectedTime}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: High-End Interactive Step Engine */}
        <div className="p-10 md:w-3/5 relative min-h-[500px]">
          
          {/* STEP 1: Select Meeting Type */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-medium text-white mb-8">SELECT A MEETING TYPE (Step 1 of 4)</h3>
              {MEETING_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setMeetingType(type);
                    handleNextStep();
                  }}
                  className="w-full text-left p-6 rounded-2xl border border-slate-700 bg-slate-800/30 hover:bg-slate-800 hover:border-blue-500 transition-all group duration-300 shadow-xl hover:shadow-blue-900/40"
                >
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <span className="font-semibold text-white text-xl group-hover:text-blue-400 transition-colors">
                      {type.title}
                    </span>
                    {/* Premium Duration Tag */}
                    <span className="text-xs font-mono bg-slate-700 text-slate-300 py-1 px-3 rounded-full mt-0.5">
                      {type.duration}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{type.description}</p>
                </button>
              ))}
            </div>
          )}

          {/* STEP 2: Modern Calendar Selection */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 transition-all duration-300">
              <button onClick={handleBack} className="text-sm text-slate-500 hover:text-white mb-8 transition-colors flex items-center gap-2">
                &larr; <span className="underline">Meeting Types</span>
              </button>
              
              <div className="mb-10">
                <div className="flex justify-between items-center mb-6 text-slate-300 font-medium">
                  <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">&lt;</button>
                  <span className="text-lg">March 2026</span>
                  <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">&gt;</button>
                </div>
                
                <div className="grid grid-cols-7 gap-3 text-center text-xs mb-5 text-slate-500 font-medium uppercase tracking-wider">
                  <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                </div>
                
                <div className="grid grid-cols-7 gap-3 text-center">
                  {[...Array(31)].map((_, i) => {
                    const day = i + 1;
                    const isSelected = selectedDate === day;
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(day)}
                        className={`p-2 rounded-xl w-12 h-12 mx-auto flex items-center justify-center transition-all duration-300 ${
                          isSelected 
                            ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900 scale-105' 
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <div className="animate-in fade-in slide-in-from-bottom-2 transition-all duration-300">
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-4 text-sm font-medium border rounded-xl transition-all duration-300 ${
                          selectedTime === time
                            ? 'border-blue-500 bg-blue-900/30 text-blue-400'
                            : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  {selectedTime && (
                    <button 
                      onClick={handleNextStep}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 flex justify-center items-center gap-2 group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">Continue</span> &rarr;
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Details Form */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 h-full flex flex-col transition-all duration-300">
              <button onClick={handleBack} className="text-sm text-slate-500 hover:text-white mb-8 transition-colors flex items-center gap-2 w-max">
                &larr; <span className="underline">Time Selection</span>
              </button>
              
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                    <input 
                      type="text" required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Work Email</label>
                    <input 
                      type="email" required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Company Name</label>
                    <input 
                      type="text" required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl shadow-lg transition-all mt-10 duration-300 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Confirm Booking</span> &rarr;
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: Success Screen */}
          {step === 4 && (
            <div className="animate-in zoom-in-95 h-full flex flex-col items-center justify-center text-center space-y-4 duration-500">
              <div className="w-20 h-20 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center text-4xl mb-6 shadow-2xl border border-blue-900">
                ✓
              </div>
              <h3 className="text-3xl font-light text-white leading-tight">Your consultation is secured.</h3>
              <p className="text-slate-400 max-w-sm mt-2 text-sm">
                A calendar invitation with meeting details has been dispatched to <span className="text-white font-medium">{formData.email}</span>. We look forward to engineering your custom access solution.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
