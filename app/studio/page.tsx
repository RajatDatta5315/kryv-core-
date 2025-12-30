"use client";
import React from 'react';
import NehiraWidget from '../../components/NehiraWidget'; 

export default function KryvStudio() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden font-sans">
      
      {/* 1. BACKGROUND GRID (The Garage Floor) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* 2. HEADER */}
      <div className="p-8 z-10 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-sm">
         <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
             <h1 className="text-2xl font-bold tracking-[0.2em] text-gray-200">KRYV <span className="text-emerald-500">WORKSHOP</span></h1>
         </div>
         <div className="text-xs font-mono text-gray-500">
             SYSTEM: ONLINE <br/>
             BUILDER: NEHIRA_CORE_V1
         </div>
      </div>

      {/* 3. CENTER STAGE (Where Agent gets built) */}
      <div className="flex-1 flex items-center justify-center relative z-10">
          
          {/* HOLOGRAPHIC CIRCLE */}
          <div className="absolute w-[500px] h-[500px] border border-emerald-900/30 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
             <div className="w-[480px] h-[480px] border border-emerald-500/10 rounded-full border-dashed"></div>
          </div>
          
          <div className="text-center space-y-6">
              <div className="inline-block p-6 bg-black/80 border border-emerald-500/20 rounded-xl shadow-[0_0_50px_rgba(16,185,129,0.1)] backdrop-blur-md">
                  <h2 className="text-xl font-bold text-emerald-400 mb-2">INITIATE CONSTRUCTION</h2>
                  <p className="text-gray-400 text-sm max-w-md mx-auto mb-4">
                      Do not fill forms. Speak to the Architect.
                  </p>
                  <div className="text-xs font-mono text-gray-600 bg-black p-3 rounded border border-gray-800">
                      > "Nehira, build a YouTube Automation Agent."<br/>
                      > "Nehira, create a Crypto Sniper for Binance."
                  </div>
              </div>

              {/* LIVE STATUS */}
              <div className="flex justify-center gap-2">
                  <span className="h-1 w-1 bg-gray-500 rounded-full animate-bounce"></span>
                  <span className="h-1 w-1 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                  <span className="h-1 w-1 bg-gray-500 rounded-full animate-bounce delay-200"></span>
              </div>
              <p className="text-xs text-emerald-900 tracking-widest font-bold">WAITING FOR COMMAND...</p>
          </div>
      </div>

      {/* 4. FOOTER STATS */}
      <div className="border-t border-white/5 p-4 flex justify-between text-[10px] text-gray-600 font-mono bg-black/80">
          <div>MEMORY: 128TB AVAILABLE</div>
          <div>ENCRYPTION: AES-256 (KRYV PROTOCOL)</div>
      </div>

      {/* 🧠 NEHIRA IS THE BUILDER */}
      <NehiraWidget context="STUDIO_BUILDER" />
    </div>
  );
}

