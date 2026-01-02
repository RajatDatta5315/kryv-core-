"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { supabase } from '@/utils/supabase';

export default function KryvStudio() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [command, setCommand] = useState("");
  const [processing, setProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    async function getUser() {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
    }
    getUser();
  }, []);

  // 🗣️ VOICE RECOGNITION (Browser Native)
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        setIsListening(true);
        recognition.start();

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setCommand(transcript);
            setIsListening(false);
            speak(`blueprint received: ${transcript}`);
        };

        recognition.onerror = () => setIsListening(false);
    } else {
        alert("Neural Voice Interface unavailable.");
    }
  };

  // 🔊 NEHIRA VOICE
  const speak = (text: string) => {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      // Attempt to find a futuristic voice
      const voices = synth.getVoices();
      const aiVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
      if (aiVoice) utterance.voice = aiVoice;
      utterance.pitch = 0.9; // Slightly deeper
      utterance.rate = 1.1;  // Faster
      synth.speak(utterance);
  };

  // 🧠 THE BUILD LOGIC (Simulation for UI)
  const handleBuild = async () => {
      if(!command.trim()) return;
      setProcessing(true);
      speak("Accessing The Vault. Initializing creation sequence.");
      
      const steps = [
          `> [NEHIRA]: Analyzing Intent: "${command}"`,
          `> [VAULT]: Searching Global API Library...`,
          `> [MATCH]: Found 'AlphaVantage' & 'OpenAI' modules.`,
          `> [CORE]: Synthesizing Agent Personality...`,
          `> [BILLING]: Calculating Token Cost...`,
          `> ERROR: User Credits Insufficient. Please recharge via PayPal.`
      ];

      let i = 0;
      const interval = setInterval(() => {
          setLogs(prev => [...prev, steps[i]]);
          i++;
          if (i >= steps.length) {
              clearInterval(interval);
              setProcessing(false);
          }
      }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex font-sans overflow-hidden selection:bg-cyan-500/30">
      <Sidebar currentUser={currentUser} />

      <div className="flex-1 md:ml-64 relative flex flex-col">
          {/* TECH BACKGROUND */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-black to-black"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20"></div>

          {/* HEADER */}
          <div className="p-6 z-10 flex justify-between items-center border-b border-cyan-900/30 bg-black/60 backdrop-blur-md">
             <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_15px_#22d3ee]"></div>
                 <h1 className="text-xl font-bold tracking-[0.3em] text-cyan-50">KRYV <span className="text-cyan-500">LABS</span></h1>
             </div>
             <div className="text-[10px] font-mono text-cyan-500/60 text-right leading-tight">
                 ARCHITECT: {currentUser?.email?.split('@')[0].toUpperCase() || "GUEST"}<br/>
                 CREDITS: ∞ (DEV MODE)
             </div>
          </div>

          {/* CENTER CORE (ARC REACTOR) */}
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-6">
              
              <div className="relative mb-12 group cursor-pointer" onClick={startListening}>
                  {/* Outer Glow */}
                  <div className={`absolute -inset-4 bg-cyan-500/20 rounded-full blur-xl transition-all duration-500 ${isListening ? 'scale-125 opacity-100' : 'scale-100 opacity-0 group-hover:opacity-50'}`}></div>
                  
                  {/* Rotating Rings */}
                  <div className={`w-64 h-64 rounded-full border border-cyan-500/30 flex items-center justify-center ${processing ? 'animate-[spin_3s_linear_infinite]' : 'animate-[spin_10s_linear_infinite]'}`}>
                     <div className="w-56 h-56 rounded-full border border-cyan-400/10 border-t-cyan-400 border-r-cyan-400 animate-[spin_5s_linear_infinite_reverse]"></div>
                  </div>
                  
                  {/* Inner Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-40 h-40 rounded-full bg-black border border-cyan-500/50 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.2)] z-10`}>
                          <span className="text-4xl mb-1">{isListening ? '🎙️' : '⚛️'}</span>
                          <span className="font-bold text-xs text-cyan-400 tracking-widest">
                              {isListening ? "LISTENING" : processing ? "BUILDING" : "NEHIRA"}
                          </span>
                      </div>
                  </div>
              </div>
              
              {/* LOGS TERMINAL */}
              <div className="w-full max-w-3xl bg-black/90 border border-cyan-900/50 rounded-lg p-4 h-48 overflow-y-auto mb-6 font-mono text-xs shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                  <div className="text-cyan-700 mb-2">Initialize... Nehira_Builder_v1 connected.</div>
                  {logs.map((log, i) => (
                      <div key={i} className="text-cyan-400 border-l-2 border-cyan-600 pl-2 mt-2 animate-in fade-in slide-in-from-left-2">
                          {log}
                      </div>
                  ))}
                  <div className="animate-pulse text-cyan-500 mt-2">_</div>
              </div>

              {/* INPUT COMMAND */}
              <div className="w-full max-w-3xl relative group">
                  <input 
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleBuild()}
                      placeholder="Command Nehira..."
                      className="w-full bg-[#0a0a0a] border border-cyan-900 rounded-xl py-4 pl-6 pr-32 text-cyan-100 focus:border-cyan-500 outline-none shadow-[0_0_30px_rgba(8,145,178,0.1)] transition-all font-mono"
                  />
                  
                  <div className="absolute right-2 top-2 bottom-2 flex gap-2">
                      <button 
                          onClick={startListening}
                          className={`px-3 rounded-lg border border-cyan-900 hover:bg-cyan-900/30 transition ${isListening ? 'text-red-500 border-red-500 animate-pulse' : 'text-cyan-500'}`}
                      >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                      </button>

                      <button 
                          onClick={handleBuild}
                          disabled={processing}
                          className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 rounded-lg font-bold text-xs transition disabled:opacity-50 shadow-[0_0_10px_rgba(8,145,178,0.5)]"
                      >
                          BUILD
                      </button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}

