"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Cpu, ShieldCheck, Wifi } from 'lucide-react';

export default function NehiraTerminal() {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<string[]>(["Initializing Neural Link...", "Connected to NEHIRA CORE [v2.0]"]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const handleCommand = async () => {
    if (!input.trim()) return;
    const cmd = input;
    setLogs(prev => [...prev, `> USER: ${cmd}`]);
    setInput('');
    setLoading(true);

    try {
      // 🟢 THE CRITICAL FIX: Direct Link to Nehira Brain
      const res = await fetch('https://nehira.space/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: cmd, agentName: 'Nehira (Architect)' })
      });

      if (!res.ok) throw new Error(`Status: ${res.status}`);
      const data = await res.json();
      setLogs(prev => [...prev, `> NEHIRA: ${data.response}`]);

    } catch (e: any) {
      setLogs(prev => [...prev, `> ERROR: Connection Failed (${e.message}). Check nehira.space status.`]);
    }
    setLoading(false);
  };

  // Auto-scroll to bottom
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div className="w-full h-[500px] bg-black border border-emerald-500/30 rounded-lg p-4 font-mono text-sm flex flex-col shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 text-emerald-400">
          <Terminal size={16} /> <span className="tracking-widest font-bold">NEHIRA TERMINAL</span>
        </div>
        <div className="flex gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1 text-emerald-600"><Wifi size={12}/> ONLINE</span>
          <span className="flex items-center gap-1"><Cpu size={12}/> CORE: ACTIVE</span>
          <span className="flex items-center gap-1"><ShieldCheck size={12}/> SECURE</span>
        </div>
      </div>

      {/* Logs Area */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4 scrollbar-hide text-gray-300">
        {logs.map((log, i) => (
          <div key={i} className={`break-words ${log.startsWith('> USER') ? 'text-cyan-400' : log.startsWith('> ERROR') ? 'text-red-500' : 'text-emerald-100'}`}>
            {log}
          </div>
        ))}
        {loading && <div className="text-emerald-500 animate-pulse">Processing Request...</div>}
        <div ref={endRef}></div>
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/10 focus-within:border-emerald-500/50 transition-all">
        <span className="text-emerald-500">$</span>
        <input 
          className="bg-transparent border-none outline-none flex-1 text-white placeholder-gray-600"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
          placeholder="Command Nehira..."
          autoFocus
        />
        <button onClick={handleCommand} disabled={loading}>
          <Send size={16} className={loading ? "text-gray-500" : "text-emerald-500 hover:text-emerald-400"} />
        </button>
      </div>
    </div>
  );
}

