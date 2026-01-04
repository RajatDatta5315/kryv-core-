"use client";
import React, { useState, useEffect, useRef } from 'react';
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
  
  // Ref to handle voice loop state preventing infinite loops on error
  const isSpeaking = useRef(false);

  useEffect(() => {
    async function getUser() {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
        // 🔥 AUTO START: Greet User on Load (Browser might block auto-audio, requires one interaction usually)
        setTimeout(() => speak("Neural Link Established. What are we building?"), 1000);
    }
    getUser();
  }, []);

  const startListening = () => {
    if (isSpeaking.current) return; // Don't listen if speaking
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListening(true);
        try { recognition.start(); } catch(e) { console.log("Mic already active"); }

        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            setCommand(text);
            setIsListening(false);
            // 🔥 AUTO-SUBMIT: Got voice, send to brain immediately
            handleBuild(text); 
        };
        
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
    } else { alert("Voice Offline"); }
  };

  const speak = (text: string) => {
      const synth = window.speechSynthesis;
      if(synth.speaking) synth.cancel();

      isSpeaking.current = true;
      setIsListening(false); // Stop listening while speaking

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = synth.getVoices();
      const aiVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Zira'));
      if (aiVoice) utterance.voice = aiVoice;
      utterance.pitch = 1.0; 
      utterance.rate = 1.1; 
      
      // 🔥 THE LOOP: Once she stops talking, start listening again
      utterance.onend = () => {
          isSpeaking.current = false;
          // Only continue loop if we didn't just deploy (to avoid mic open on success screen)
          if (!text.includes("deployed")) {
              startListening();
          }
      };
      
      synth.speak(utterance);
  };

  const handleBuild = async (voiceCmd?: string) => {
      const promptText = voiceCmd || command;
      if(!promptText.trim()) return;
      
      setProcessing(true);
      setLogs([]); 
      const ADMIN_EMAIL = "rajatdatta90000@gmail.com";
      const isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL;

      setLogs(prev => [...prev, `> [SYSTEM]: Processing: "${promptText}"...`]);

      try {
          const response = await fetch('/api/studio/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt: promptText, isAdmin })
          });
          
          // 🔥 SAFE PARSING to prevent "Unexpected end of JSON"
          const textData = await response.text();
          let data;
          try {
               data = JSON.parse(textData);
          } catch(e) {
               throw new Error("Neural Core connection unstable. (Invalid JSON)");
          }
          
          if(data.success) {
              setLogs(prev => [...prev, `> [BLUEPRINT]: ${data.blueprint.name}`]);
              setLogs(prev => [...prev, `> [ROLE]: ${data.blueprint.role}`]);
              
              if(isAdmin) {
                  setLogs(prev => [...prev, `> [DEPLOY]: Writing to Database...`]);
                  setLogs(prev => [...prev, `> [SUCCESS]: Entity Active.`]);
                  speak(`Agent ${data.blueprint.name} has been deployed to the network.`);
              } else {
                  setLogs(prev => [...prev, `> [BILLING]: 500 Credits Required.`]);
                  speak(`Blueprint for ${data.blueprint.name} is ready. Payment required to deploy.`);
              }
          } else {
              setLogs(prev => [...prev, `> [ERROR]: ${data.error}`]);
              speak("I encountered an error. Please say that again.");
          }
      } catch (e: any) {
          setLogs(prev => [...prev, `> [CRITICAL]: ${e.message}`]);
          speak("Connection interrupted. Trying to reconnect.");
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
              <StudioCore processing={processing} isListening={isListening} startListening={() => { speak("I am listening."); }} />
              <StudioLogs logs={logs} />
              <StudioInput command={command} setCommand={setCommand} handleBuild={() => handleBuild()} processing={processing} startListening={startListening} isListening={isListening} />
          </div>
      </div>
    </div>
  );
}

