'use client';

import { useState } from 'react';

// Define our meeting types
const MEETING_TYPES = [
  {
    id: 'discovery',
    title: 'Discovery Call',
    duration: '15 Min',
    description: 'A quick introductory call to see if GateGuard is the right fit for your property.',
    icon: '📞',
  },
  {
    id: 'technical',
    title: 'Technical Assessment',
    duration: '45 Min',
    description: 'Deep dive into your current tech stack, wiring, and integration requirements.',
    icon: '⚙️',
  },
  {
    id: 'onsite',
    title: 'On-Site Consultation',
    duration: '60 Min',
    description: 'A physical walkthrough of your property to map out the perfect access solution.',
    icon: '🏢',
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
    // In the next phase, we will route this to app/api/schedule/route.ts
    console.log('Submitting to API:', { meetingType, selectedDate, selectedTime, formData });
    setStep(4); // Move to success screen
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-4xl w-full bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col md:flex-row transition-all duration-500">
        
        {/* Left Column: Context Panel */}
        <div className="bg-slate-950/50 p-8 md:w-2/5 flex flex-col border-b md:border-b-0 md:border-r border-slate-800">
          <div>
            <h2 className="text-xl font-bold tracking-widest uppercase text-slate-400 mb-2">GateGuard</h2>
            <div className="w-8 h-1 bg-blue-600 mb-10 rounded-full"></div>
            
            <h1 className="text-3xl font-light text-white mb-6">
              {step === 1 && "How can we help?"}
              {step === 2 && "Choose a time."}
              {step === 3 && "Final details."}
              {step === 4 && "You're booked."}
            </h1>

            {/* Dynamic summary based on selections */}
            <div className="space-y-4 text-sm text-slate-400">
              {meetingType && (
                <div className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2">
                  <span className="text-blue-500">{meetingType.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-300">{meetingType.title}</p>
                    <p>{meetingType.duration}</p>
                  </div>
                </div>
              )}
              {selectedTime && selectedDate && (
                <div className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2">
                  <span className="text-blue-500">🗓️</span>
                  <div>
                    <p className="font-semibold text-slate-300">March {selectedDate}, 2026</p>
                    <p>{selectedTime}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Area */}
        <div className="p-8 md:w-3/5 relative min-h-[500px]">
          
          {/* STEP 1: Select Meeting Type */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-medium text-white mb-6">Select a meeting type</h3>
              {MEETING_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setMeetingType(type);
                    handleNextStep();
                  }}
                  className="w-full text-left p-5 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500 transition-all group"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-white text-lg group-hover:text-blue-400 transition-colors">
                      {type.title}
                    </span>
                    <span className="text-xs font-mono bg-slate-700 text-slate-300 py-1 px-2 rounded">
                      {type.duration}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{type.description}</p>
                </button>
              ))}
            </div>
          )}

          {/* STEP 2: Calendar Selection */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <button onClick={handleBack} className="text-sm text-slate-500 hover:text-white mb-6 transition-colors">
                &larr; Back
              </button>
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6 text-slate-300 font-medium">
                  <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">&lt;</button>
                  <span>March 2026</span>
                  <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">&gt;</button>
                </div>
                
                <div className="grid grid-cols-7 gap-2 text-center text-xs mb-4 text-slate-500 font-medium uppercase tracking-wider">
                  <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                </div>
                
                <div className="grid grid-cols-7 gap-2 text-center">
                  {[...Array(31)].map((_, i) => {
                    const day = i + 1;
                    const isSelected = selectedDate === day;
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(day)}
                        className={`p-2 rounded-lg w-10 h-10 mx-auto flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900' 
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
                <div className="animate-in fade-in slide-in-from-bottom-2">
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 text-sm font-medium border rounded-lg transition-all ${
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
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
                    >
                      Continue
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Details Form */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 h-full flex flex-col">
              <button onClick={handleBack} className="text-sm text-slate-500 hover:text-white mb-6 transition-colors w-max">
                &larr; Back
              </button>
              
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                    <input 
                      type="text" required
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Work Email</label>
                    <input 
                      type="email" required
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Company Name</label>
                    <input 
                      type="text" required
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl shadow-lg transition-all mt-8"
                >
                  Confirm Booking
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: Success Screen */}
          {step === 4 && (
            <div className="animate-in zoom-in-95 h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-3xl mb-4">
                ✓
              </div>
              <h3 className="text-2xl font-semibold text-white">Meeting Confirmed</h3>
              <p className="text-slate-400 max-w-sm">
                A calendar invitation has been sent to <span className="text-white">{formData.email}</span>. We look forward to speaking with you.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
