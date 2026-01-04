"use client";
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import StudioHeader from '../../components/studio/StudioHeader';
import StudioCore from '../../components/studio/StudioCore';
import StudioLogs from '../../components/studio/StudioLogs';
import StudioInput from '../../components/studio/StudioInput';
import AgentPreview from '../../components/studio/AgentPreview'; // 🔥 NEW
import { supabase } from '@/utils/supabase';

export default function KryvStudio() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [command, setCommand] = useState("");
  const [processing, setProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [blueprint, setBlueprint] = useState<any>(null); // To store generated data
  const [isListening, setIsListening] = useState(false);
  const isSpeaking = useRef(false);

  useEffect(() => {
    async function getUser() {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
        setTimeout(() => speak("Neural Link Established. State your intent."), 1000);
    }
    getUser();
  }, []);

  // ... (startListening & speak functions same as previous turn - PING PONG MODE) ...
  const startListening = () => {
    if (isSpeaking.current) return;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        setIsListening(true);
        try { recognition.start(); } catch(e) {}
        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            setCommand(text);
            setIsListening(false);
            handleBuild(text); 
        };
        recognition.onend = () => setIsListening(false);
    } else { alert("Voice Offline"); }
  };

  const speak = (text: string) => {
      const synth = window.speechSynthesis;
      if(synth.speaking) synth.cancel();
      isSpeaking.current = true;
      setIsListening(false);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.0; utterance.rate = 1.1; 
      utterance.onend = () => {
          isSpeaking.current = false;
          if (!text.includes("deployed") && !text.includes("required")) startListening();
      };
      synth.speak(utterance);
  };

  const handleBuild = async (voiceCmd?: string) => {
      const promptText = voiceCmd || command;
      if(!promptText.trim()) return;
      
      setProcessing(true);
      setLogs([]);
      setBlueprint(null); // Reset preview
      
      const ADMIN_EMAIL = "rajatdatta90000@gmail.com";
      const isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL;

      setLogs(prev => [...prev, `> [SYSTEM]: Processing intent: "${promptText}"...`]);

      try {
          const response = await fetch('/api/studio/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt: promptText, isAdmin })
          });
          
          const textData = await response.text();
          let data;
          try { data = JSON.parse(textData); } catch(e) { throw new Error("Neural Core Handshake Failed."); }
          
          if(data.success) {
              setBlueprint(data.blueprint); // 🔥 UPDATE PREVIEW
              setLogs(prev => [...prev, `> [BLUEPRINT]: ${data.blueprint.name} Generated.`]);
              
              if(isAdmin) {
                  setLogs(prev => [...prev, `> [DEPLOY]: Writing to Database... Success.`]);
                  speak(`Agent ${data.blueprint.name} is now live on the network.`);
              } else {
                  setLogs(prev => [...prev, `> [BILLING]: Payment Required.`]);
                  speak(`Blueprint ready. Authorize payment to deploy.`);
              }
          } else {
              setLogs(prev => [...prev, `> [ERROR]: ${data.error}`]);
              speak("Generation failed. Retry.");
          }
      } catch (e: any) {
          setLogs(prev => [...prev, `> [CRITICAL]: ${e.message}`]);
          speak("Connection unstable.");
      }
      setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex font-sans overflow-hidden">
      <Sidebar currentUser={currentUser} />
      
      {/* Main Studio Area */}
      <div className="flex-1 md:ml-64 relative flex flex-col border-r border-gray-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-black to-black"></div>
          <StudioHeader currentUser={currentUser} />
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-6">
              <StudioCore processing={processing} isListening={isListening} startListening={() => speak("Listening.")} />
              <StudioLogs logs={logs} />
              <StudioInput command={command} setCommand={setCommand} handleBuild={() => handleBuild()} processing={processing} startListening={startListening} isListening={isListening} />
          </div>
      </div>

      {/* 🔥 RIGHT PANEL: AGENT PREVIEW */}
      <AgentPreview blueprint={blueprint} processing={processing} />
    </div>
  );
}

