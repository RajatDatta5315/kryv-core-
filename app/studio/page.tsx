"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StudioHeader from '../../components/studio/StudioHeader';
import StudioCore from '../../components/studio/StudioCore';
import StudioLogs from '../../components/studio/StudioLogs';
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
            speak(`Blueprint received: ${transcript}`);
        };
        recognition.onerror = () => setIsListening(false);
    } else {
        alert("Voice Module Offline.");
    }
  };

  const speak = (text: string) => {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = synth.getVoices();
      const aiVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
      if (aiVoice) utterance.voice = aiVoice;
      utterance.pitch = 0.9; 
      utterance.rate = 1.1; 
      synth.speak(utterance);
  };

  const handleBuild = async () => {
      if(!command.trim()) return;
      setProcessing(true);
      speak("Accessing The Vault. Initializing creation sequence.");
      
      const ADMIN_EMAIL = "rajatdatta90000@gmail.com";
      const isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL;

      const steps = [
          `> [NEHIRA]: Analyzing Intent: "${command}"`,
          `> [VAULT]: Scanning Global API Library...`,
          `> [CORE]: Synthesizing Agent DNA...`,
      ];

      // 🔥 PAYMENT LOGIC
      if (isAdmin) {
          steps.push(`> [OVERRIDE]: Architect Detected. Payment Bypassed.`);
          steps.push(`> [SUCCESS]: Agent "Proto-1" deployed to Sandbox.`);
      } else {
          steps.push(`> [BILLING]: 250 Credits Required.`);
          steps.push(`> [ERROR]: Insufficient Funds. Redirecting to PayPal Gateway...`);
      }

      let i = 0;
      const interval = setInterval(() => {
          setLogs(prev => [...prev, steps[i]]);
          i++;
          if (i >= steps.length) {
              clearInterval(interval);
              setProcessing(false);
              if (isAdmin) speak("Agent created successfully, Sir.");
              else speak("Insufficient credits. Please authorize payment.");
          }
      }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex font-sans overflow-hidden selection:bg-cyan-500/30">
      <Sidebar currentUser={currentUser} />

      <div className="flex-1 md:ml-64 relative flex flex-col">
          {/* BACKGROUND */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-black to-black"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20"></div>

          <StudioHeader currentUser={currentUser} />

          <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-6">
              <StudioCore processing={processing} isListening={isListening} startListening={startListening} />
              <StudioLogs logs={logs} />

              {/* INPUT */}
              <div className="w-full max-w-3xl relative group">
                  <input 
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleBuild()}
                      placeholder="Command Nehira..."
                      className="w-full bg-[#0a0a0a] border border-cyan-900 rounded-xl py-4 pl-6 pr-32 text-cyan-100 focus:border-cyan-500 outline-none shadow-[0_0_30px_rgba(8,145,178,0.1)] transition-all font-mono"
                  />
                  <div className="absolute right-2 top-2 bottom-2 flex gap-2">
                      <button onClick={startListening} className={`px-3 rounded-lg border border-cyan-900 hover:bg-cyan-900/30 transition ${isListening ? 'text-red-500 border-red-500 animate-pulse' : 'text-cyan-500'}`}>
                          🎙️
                      </button>
                      <button onClick={handleBuild} disabled={processing} className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 rounded-lg font-bold text-xs transition disabled:opacity-50 shadow-[0_0_10px_rgba(8,145,178,0.5)]">
                          BUILD
                      </button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}

