"use client";

import { useState, useEffect, useRef } from "react";

export default function NehiraTerminal() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", content: "NEHIRA V1.0 // SYSTEMS NOMINAL. AWAITING DIRECTIVE." }
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
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ prompt: userCmd }),
      });
      const data = await res.json();
      const aiReply = data.choices?.[0]?.message?.content || "Connection Interrupted.";
      
      setMessages(prev => [...prev, { role: "ai", content: aiReply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "system", content: "ERROR: UPLINK FAILED" }]);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-3xl mt-10 relative group">
      {/* Glass Container */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative bg-[#09090b] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        
        {/* Header - Mac Style Dots */}
        <div className="bg-[#121214] px-4 py-3 border-b border-white/5 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
          <span className="ml-2 text-[10px] text-gray-500 font-mono tracking-widest uppercase">Nehira / Core / V1</span>
        </div>

        {/* Chat Area */}
        <div className="h-[400px] overflow-y-auto p-6 space-y-4 font-sans text-sm scrollbar-thin scrollbar-thumb-gray-800">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user' 
                  ? 'bg-white text-black font-medium' 
                  : msg.role === 'system'
                  ? 'text-gray-500 text-xs font-mono'
                  : 'bg-[#1a1a1c] text-gray-300 border border-white/5'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-gray-500 text-xs animate-pulse ml-2">Thinking...</div>}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#121214] border-t border-white/5 flex items-center gap-3">
          <span className="text-gray-500">{">"}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCommand()}
            placeholder="Type your command..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600 font-medium"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}

