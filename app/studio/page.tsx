"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StudioHeader from '../../components/studio/StudioHeader';
import StudioCore from '../../components/studio/StudioCore';
import StudioLogs from '../../components/studio/StudioLogs';
import StudioInput from '../../components/studio/StudioInput';
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
        recognition.lang = 'en-US';
        setIsListening(true);
        recognition.start();
        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            setCommand(text);
            setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
    } else { alert("Voice Offline"); }
  };

  const speak = (text: string) => {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = synth.getVoices();
      const aiVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
      if (aiVoice) utterance.voice = aiVoice;
      utterance.pitch = 0.9; utterance.rate = 1.1; 
      synth.speak(utterance);
  };

  const handleBuild = async () => {
      if(!command.trim()) return;
      setProcessing(true);
      setLogs([]); 
      
      const ADMIN_EMAIL = "rajatdatta90000@gmail.com";
      const isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL;

      setLogs(prev => [...prev, `> [SYSTEM]: Initializing Genesis Protocol...`]);
      setLogs(prev => [...prev, `> [NEHIRA]: Sending Data to Neural Core...`]);

      try {
          const response = await fetch('/api/studio/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt: command, isAdmin })
          });
          
          const data = await response.json();

          if(!response.ok) {
              throw new Error(data.error || `Server Error: ${response.status}`);
          }
          
          if(data.success) {
              setLogs(prev => [...prev, `> [BLUEPRINT]: ${data.blueprint.name}`]);
              setLogs(prev => [...prev, `> [ROLE]: ${data.blueprint.role}`]);
              
              if(isAdmin) {
                  setLogs(prev => [...prev, `> [DEPLOY]: Writing to Database...`]);
                  setLogs(prev => [...prev, `> [SUCCESS]: Entity Active.`]);
                  speak(`Agent ${data.blueprint.name} is online.`);
              } else {
                  setLogs(prev => [...prev, `> [BILLING]: ${data.blueprint.cost} Required.`]);
                  setLogs(prev => [...prev, `> [INFO]: Payment Gateway Link Generated.`]);
                  speak(`Blueprint ready. ${data.blueprint.cost} required.`);
              }
          } else {
              setLogs(prev => [...prev, `> [ERROR]: ${data.error}`]);
          }
      } catch (e: any) {
          setLogs(prev => [...prev, `> [CRITICAL FAILURE]: ${e.message}`]);
          console.error("Studio Error:", e);
      }
      setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex font-sans overflow-hidden">
      <Sidebar currentUser={currentUser} />
      <div className="flex-1 md:ml-64 relative flex flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-black to-black"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20"></div>

          <StudioHeader currentUser={currentUser} />
          
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-6">
              <StudioCore processing={processing} isListening={isListening} startListening={startListening} />
              <StudioLogs logs={logs} />
              <StudioInput command={command} setCommand={setCommand} handleBuild={handleBuild} processing={processing} startListening={startListening} isListening={isListening} />
          </div>
      </div>
    </div>
  );
}

