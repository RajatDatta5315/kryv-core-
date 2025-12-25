"use client";

import { useState, useEffect, useRef } from "react";

export default function NehiraTerminal() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", content: "NEHIRA V1.0 // SYSTEMS ONLINE. WAITING FOR COMMAND." }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCommand = async () => {
    if (!input.trim()) return;
    const userCmd = input;
    setInput(""); // Clear input immediately
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: userCmd }]);
    setLoading(true);
    
    try {
      // 1. Minimum "Thinking" Delay start karo (Human feel ke liye)
      const minDelayPromise = new Promise(resolve => setTimeout(resolve, 1500));
      
      // 2. API Call parallel mein karo
      const apiCallPromise = fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ prompt: userCmd }),
      });

      // 3. Dono ke khatam hone ka wait karo
      const [_, res] = await Promise.all([minDelayPromise, apiCallPromise]);

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
      {/* Glass Container glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      
      <div className="relative bg-[#09090b] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-[#121214] px-4 py-3 border-b border-white/5 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          <span className="ml-2 text-[10px] text-gray-500 font-mono tracking-widest uppercase">Nehira / Core / V1</span>
        </div>

        {/* Chat Area */}
        <div className="h-[400px] overflow-y-auto p-6 space-y-4 font-sans text-sm scrollbar-thin scrollbar-thumb-gray-800">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg p-3 leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-[#ededed] text-black font-medium shadow-lg' 
                  : msg.role === 'system'
                  ? 'text-gray-500 text-xs font-mono'
                  : 'bg-[#1a1a1c] text-gray-200 border border-white/5 shadow-md'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {/* Typing Indicator */}
          {loading && (
            <div className="flex justify-start">
               <div className="bg-[#1a1a1c] border border-white/5 rounded-lg p-3 flex gap-1 items-center">
                 <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                 <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                 <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area - Fixed Visibility */}
        <div className="p-4 bg-[#121214] border-t border-white/5 flex items-center gap-3">
          <span className="text-gray-500 text-lg">{">"}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCommand()}
            placeholder="Initialize command..."
            // Yaha text color fix kiya hai
            className="flex-1 bg-transparent border-none outline-none text-[#ffffff] placeholder-gray-600 font-medium text-base"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}

