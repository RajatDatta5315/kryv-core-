import React from 'react';

export default function StudioHeader({ currentUser }: any) {
  return (
    <div className="p-6 z-10 flex justify-between items-center border-b border-cyan-900/30 bg-black/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_15px_#22d3ee]"></div>
            <h1 className="text-xl font-bold tracking-[0.3em] text-cyan-50">KRYV <span className="text-cyan-500">LABS</span></h1>
        </div>
        <div className="text-[10px] font-mono text-cyan-500/60 text-right leading-tight">
            ARCHITECT: {currentUser?.email?.split('@')[0].toUpperCase() || "GUEST"}<br/>
            SYSTEM: ONLINE
        </div>
    </div>
  );
}
