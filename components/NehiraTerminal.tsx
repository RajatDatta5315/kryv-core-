"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link"; // Link component import kiya navigation ke liye

export default function NehiraTerminal() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", content: "NEHIRA V1.1 // READY. COMMAND ME." }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCommand = async () => {
    if (!input.trim()) return;
    const userCmd = input;
    setInput(""); 
    
    setMessages(prev => [...prev, { role: "user", content: userCmd }]);
    setLoading(true);
    
    try {
      const minDelayPromise = new Promise(resolve => setTimeout(resolve, 1500));
      const apiCallPromise = fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ prompt: userCmd }),
      });

      const [_, res] = await Promise.all([minDelayPromise, apiCallPromise]);
      const data = await res.json();
      const aiReply = data.response || "Connection Interrupted.";
      
      setMessages(prev => [...prev, { role: "ai", content: aiReply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "system", content: "ERROR: UPLINK FAILED" }]);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mt-4 relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      
      <div className="relative bg-[#09090b] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header with Dashboard Link */}
        <div className="bg-[#121214] px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            <span className="ml-2 text-[10px] text-gray-500 font-mono tracking-widest uppercase">Nehira / Architect</span>
          </div>
          
          {/* NAVIGATION BUTTON ADDED HERE */}
          <Link href="/dashboard" className="text-[10px] text-green-500 hover:text-green-400 font-mono tracking-widest border border-green-500/20 px-3 py-1 rounded hover:bg-green-500/10 transition-all">
            ↗ OPEN DASHBOARD
          </Link>
        </div>

        {/* Chat Area */}
        <div className="h-[60vh] md:h-[75vh] overflow-y-auto p-6 space-y-4 font-sans text-sm scrollbar-thin scrollbar-thumb-gray-800">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] rounded-lg p-3 leading-relaxed border shadow-md`}
                style={{
                  backgroundColor: msg.role === 'user' ? '#333333' : (msg.role === 'system' ? 'transparent' : '#1a1a1c'),
                  color: msg.role === 'user' ? '#ffffff' : '#e5e5e5',
                  borderColor: msg.role === 'user' ? '#555555' : 'rgba(255,255,255,0.1)'
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
               <div className="bg-[#1a1a1c] border border-white/5 rounded-lg p-3">
                 <span className="text-gray-400 text-xs animate-pulse">Building...</span>
               </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#121214] border-t border-white/5 flex items-center gap-3">
          <span className="text-gray-500 text-lg">{">"}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCommand()}
            placeholder="Type here..."
            className="flex-1 border-none outline-none font-medium text-base"
            style={{
              backgroundColor: '#222222',
              color: '#ffffff',
              padding: '10px',
              borderRadius: '5px'
            }}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}

