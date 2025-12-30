"use client";
import React, { useState, useEffect } from 'react';

export default function NehiraWidget({ context }: { context: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [chat, setChat] = useState<{role: string, text: string}[]>([
      {role: 'nehira', text: `Nehira Online. Context: ${context}`}
  ]);

  // 🗣️ SPEAK FUNCTION
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1; 
    window.speechSynthesis.speak(utterance);
  };

  // 🎤 LISTEN FUNCTION
  const toggleMic = () => {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Use Chrome for Voice.");
        return;
    }
    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setMsg(text);
        handleAsk(text);
    };
    recognition.start();
  };

  const handleAsk = async (textOverride?: string) => {
    const userQ = textOverride || msg;
    if(!userQ) return;
    setMsg('');
    setChat(prev => [...prev, {role: 'user', text: userQ}]);

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = process.env.NEXT_PUBLIC_HF_TOKEN;
        
        const res = await fetch(`${apiUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ prompt: userQ, agentName: 'Nehira', context })
        });
        const data = await res.json();
        setChat(prev => [...prev, {role: 'nehira', text: data.response}]);
        speak(data.response); // BOLEGI

    } catch(e) {
        setChat(prev => [...prev, {role: 'nehira', text: "Brain Disconnected."}]);
    }
  };

  return (
    // ✨ TOP-RIGHT POSITION (Fixed)
    <div className="fixed top-24 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* GEMINI STYLE OVERLAY */}
      {isOpen && (
        <div className="bg-black/90 backdrop-blur-xl border border-emerald-500/50 w-80 h-96 mb-4 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
             <div className="bg-emerald-900/20 p-3 text-emerald-400 text-xs font-bold tracking-widest flex justify-between">
                <span>NEHIRA OS</span>
                <button onClick={() => setChat([])}>CLR</button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chat.map((c, i) => (
                    <div key={i} className={`text-xs p-3 rounded-xl ${c.role==='nehira' ? 'bg-[#1a1a1a] text-gray-200 self-start mr-8' : 'bg-emerald-900/30 text-white self-end ml-8'}`}>
                        {c.text}
                    </div>
                ))}
            </div>
            <div className="p-3 bg-black/50 flex items-center gap-2 border-t border-white/10">
                <button onClick={toggleMic} className={`p-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-800'}`}>🎤</button>
                <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==='Enter' && handleAsk()} className="flex-1 bg-transparent outline-none text-white text-xs" placeholder="Ask..." />
                <button onClick={() => handleAsk()} className="text-emerald-500 font-bold">></button>
            </div>
        </div>
      )}

      {/* ✨ GLOWING BUTTON WITH 'nehira.png' */}
      <button onClick={() => setIsOpen(!isOpen)} className="w-16 h-16 rounded-full border-2 border-emerald-500 shadow-[0_0_20px_#10b981] overflow-hidden hover:scale-110 transition bg-black">
        <img src="/nehira.png" alt="AI" className="w-full h-full object-cover opacity-90 hover:opacity-100" />
      </button>
    </div>
  );
}

