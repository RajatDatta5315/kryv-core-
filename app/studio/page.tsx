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

  // 🗣️ VOICE RECOGNITION (STT)
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
            speak(`I heard: ${transcript}. Should I proceed?`);
        };

        recognition.onerror = () => setIsListening(false);
    } else {
        alert("Neural Voice Interface not supported on this browser.");
    }
  };

  // 🔊 NEHIRA VOICE (TTS)
  const speak = (text: string) => {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find a female/AI voice
      const voices = synth.getVoices();
      const aiVoice = voices.find(v => v.name.includes('Zira') || v.name.includes('Female') || v.name.includes('Google US English'));
      if (aiVoice) utterance.voice = aiVoice;
      
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
      synth.speak(utterance);
  };

  const handleBuild = async () => {
      if(!command.trim()) return;
      setProcessing(true);
      speak("Initiating architectural protocols. Stand by.");
      
      // JARVIS STYLE LOGS
      const steps = [
          `> Analyzing Request: "${command}"...`,
          `> Parsing Neural Requirements...`,
          `> Accessing Global API Vault...`,
          `> Constructing Agent DNA...`,
          `> ERROR: Architect Mode not fully linked. Waiting for API Gateway.`
      ];

      let i = 0;
      const interval = setInterval(() => {
          setLogs(prev => [...prev, steps[i]]);
          i++;
          if (i >= steps.length) {
              clearInterval(interval);
              setProcessing(false);
              speak("Construction paused. Waiting for API access.");
          }
      }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans overflow-hidden">
      <Sidebar currentUser={currentUser} />

      <div className="flex-1 md:ml-64 relative flex flex-col">
          {/* NANO TECH BACKGROUND */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#002200_1px,transparent_1px),linear-gradient(to_bottom,#002200_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

          {/* HEADER */}
          <div className="p-6 z-10 flex justify-between items-center border-b border-emerald-900/30 bg-black/40 backdrop-blur-md">
             <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]"></div>
                 <h1 className="text-2xl font-bold tracking-[0.2em] text-gray-200">KRYV <span className="text-emerald-500">LABS</span></h1>
             </div>
             <div className="text-xs font-mono text-emerald-500/70 text-right">
                 OPERATOR: {currentUser?.email?.split('@')[0].toUpperCase() || "UNKNOWN"}<br/>
                 SYSTEM: ONLINE
             </div>
          </div>

          {/* CENTER CORE */}
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-6">
              
              {/* ARC REACTOR EFFECT */}
              <div className="relative mb-10 group cursor-pointer" onClick={startListening}>
                  {/* Outer Ring */}
                  <div className={`w-72 h-72 rounded-full border border-emerald-500/20 flex items-center justify-center ${processing || isListening ? 'animate-[spin_2s_linear_infinite]' : 'animate-[spin_10s_linear_infinite]'}`}>
                     {/* Middle Ring */}
                     <div className="w-64 h-64 rounded-full border border-emerald-500/40 border-t-transparent border-l-transparent animate-[spin_5s_linear_infinite_reverse]"></div>
                  </div>
                  
                  {/* Inner Core */}
                  <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-40 h-40 rounded-full bg-emerald-900/10 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.2)] backdrop-blur-sm ${isListening ? 'animate-pulse bg-emerald-500/20' : ''}`}>
                          <span className="font-bold text-2xl text-emerald-400 tracking-widest">
                              {isListening ? "LISTENING" : processing ? "BUILDING" : "NEHIRA"}
                          </span>
                      </div>
                  </div>
              </div>
              
              {/* LOGS TERMINAL */}
              <div className="w-full max-w-3xl bg-black/80 border border-emerald-900/50 rounded-lg p-4 h-40 overflow-y-auto mb-6 font-mono text-xs shadow-inner">
                  <div className="text-emerald-700">Initializing Nehira_Builder_v1...</div>
                  <div className="text-emerald-700">Connecting to KRYV Mainframe... Success.</div>
                  {logs.map((log, i) => (
                      <div key={i} className="text-emerald-400 border-l-2 border-emerald-500 pl-2 mt-1 animate-in fade-in slide-in-from-left-2">
                          {log}
                      </div>
                  ))}
                  <div className="animate-pulse text-emerald-500 mt-2">_</div>
              </div>

              {/* INPUT COMMAND */}
              <div className="w-full max-w-3xl relative group">
                  <input 
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleBuild()}
                      placeholder={isListening ? "Listening..." : "Command Nehira to build..."}
                      className="w-full bg-black border border-emerald-900 rounded-xl py-5 px-6 text-emerald-100 focus:border-emerald-500 outline-none shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all font-mono text-lg"
                  />
                  
                  {/* MIC BUTTON */}
                  <button 
                      onClick={startListening}
                      className={`absolute right-24 top-2 bottom-2 px-4 rounded-lg transition ${isListening ? 'text-red-500 animate-pulse' : 'text-emerald-500 hover:bg-emerald-900/20'}`}
                  >
                      🎤
                  </button>

                  {/* BUILD BUTTON */}
                  <button 
                      onClick={handleBuild}
                      disabled={processing}
                      className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 rounded-lg font-bold text-sm transition disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  >
                      BUILD
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}

