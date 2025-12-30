"use client";
import React, { useState } from 'react';

export default function NehiraWidget({ context }: { context: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState<{role: string, text: string}[]>([
      {role: 'nehira', text: `Systems Online. Context: ${context}`}
  ]);

  const handleAsk = async () => {
    if(!msg) return;
    const userQ = msg;
    setMsg('');
    setChat(prev => [...prev, {role: 'user', text: userQ}]);

    try {
        // 1. Environment se URL aur Token uthao
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = process.env.NEXT_PUBLIC_HF_TOKEN;

        if (!apiUrl) throw new Error("API URL Missing in .env.local");

        // 2. Call with Secure Header
        const res = await fetch(`${apiUrl}/api/chat`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 🔑 Private Space Access
            },
            body: JSON.stringify({ prompt: userQ, agentName: 'Nehira', context })
        });

        const data = await res.json();
        setChat(prev => [...prev, {role: 'nehira', text: data.response}]);

    } catch(e: any) {
        setChat(prev => [...prev, {role: 'nehira', text: "⚠️ Connection Failed. Check Token/URL."}]);
        console.error(e);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="bg-black border border-green-500 w-80 h-96 mb-4 rounded-lg shadow-[0_0_20px_rgba(0,255,65,0.2)] flex flex-col overflow-hidden">
            {/* HEADER */}
            <div className="bg-green-900/20 p-2 border-b border-green-800 font-bold text-green-400 text-xs tracking-widest flex justify-between">
                <span>NEHIRA LIVE | {context}</span>
                <button onClick={() => setChat([])} className="text-gray-500 hover:text-white">CLR</button>
            </div>
            
            {/* CHAT AREA */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chat.map((c, i) => (
                    <div key={i} className={`text-xs p-2 rounded border ${c.role==='nehira' ? 'bg-gray-900 border-green-900 text-green-300 self-start mr-8' : 'bg-gray-800 border-gray-700 text-white self-end ml-8'}`}>
                        <span className="font-bold opacity-50 block mb-1">{c.role.toUpperCase()}</span>
                        {c.text}
                    </div>
                ))}
            </div>

            {/* INPUT */}
            <div className="p-2 border-t border-gray-800 flex bg-black">
                <input 
                    value={msg} 
                    onChange={e=>setMsg(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleAsk()}
                    className="flex-1 bg-transparent outline-none text-white text-xs p-2" 
                    placeholder="Command Nehira..." 
                />
                <button onClick={handleAsk} className="text-green-500 font-bold text-xs px-3 hover:bg-green-900/20 rounded">SEND</button>
            </div>
        </div>
      )}

      {/* GLOWING BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-black border-2 border-green-500 flex items-center justify-center shadow-[0_0_15px_#00ff41] hover:scale-110 transition group"
      >
        <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse group-hover:bg-green-400 blur-sm absolute"></div>
        <span className="text-2xl relative z-10">👁️</span>
      </button>
    </div>
  );
}

