"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { supabase } from '@/utils/supabase';

export default function KryvStudio() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [command, setCommand] = useState("");
  const [processing, setProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    async function getUser() {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
    }
    getUser();
  }, []);

  const handleBuild = async () => {
      if(!command.trim()) return;
      setProcessing(true);
      
      // Simulate Building Process
      setLogs(prev => [...prev, `> Analyzing Request: "${command}"...`]);
      
      setTimeout(() => {
          setLogs(prev => [...prev, `> Blueprint generated.`, `> Allocating Neural Resources...`]);
      }, 1500);

      setTimeout(() => {
          setLogs(prev => [...prev, `> ERROR: Architect Mode not fully linked. Waiting for API Gateway.`]);
          setProcessing(false);
          setCommand("");
      }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      <Sidebar currentUser={currentUser} />

      <div className="flex-1 md:ml-64 relative overflow-hidden flex flex-col">
          {/* BACKGROUND */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

          {/* HEADER */}
          <div className="p-6 z-10 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-sm">
             <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                 <h1 className="text-2xl font-bold tracking-[0.2em] text-gray-200">KRYV <span className="text-emerald-500">WORKSHOP</span></h1>
             </div>
             <div className="text-xs font-mono text-gray-500 text-right">
                 BUILDER: NEHIRA_CORE_V1<br/>
                 STATUS: READY
             </div>
          </div>

          {/* CENTER STAGE */}
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-6">
              
              {/* HOLOGRAPHIC CORE */}
              <div className="relative mb-8">
                  <div className={`w-64 h-64 border border-emerald-900/50 rounded-full flex items-center justify-center ${processing ? 'animate-[spin_2s_linear_infinite]' : 'animate-[spin_10s_linear_infinite]'}`}>
                     <div className="w-60 h-60 border border-emerald-500/20 rounded-full border-dashed"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl text-emerald-500">
                      {processing ? "BUILDING" : "IDLE"}
                  </div>
              </div>
              
              {/* TERMINAL LOGS */}
              <div className="w-full max-w-2xl bg-black/80 border border-gray-800 rounded-lg p-4 h-32 overflow-y-auto mb-6 font-mono text-xs text-green-400">
                  <div className="opacity-50">System initialized... Waiting for input.</div>
                  {logs.map((log, i) => <div key={i}>{log}</div>)}
              </div>

              {/* INPUT AREA */}
              <div className="w-full max-w-2xl relative">
                  <input 
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleBuild()}
                      placeholder='Example: "Create a crypto sniper agent for Binance..."'
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-4 px-6 text-white focus:border-emerald-500 outline-none shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
                  />
                  <button 
                      onClick={handleBuild}
                      disabled={processing}
                      className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 rounded-lg font-bold text-sm transition disabled:opacity-50"
                  >
                      {processing ? "..." : "BUILD"}
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}

