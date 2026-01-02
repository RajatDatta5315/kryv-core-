import React from 'react';

export default function StudioCore({ processing, isListening, startListening }: any) {
  return (
    <div className="relative mb-12 group cursor-pointer" onClick={startListening}>
        {/* Outer Glow */}
        <div className={`absolute -inset-6 bg-cyan-500/10 rounded-full blur-2xl transition-all duration-500 ${isListening ? 'scale-125 opacity-100' : 'scale-100 opacity-0 group-hover:opacity-50'}`}></div>
        
        {/* Reactor Rings */}
        <div className={`w-64 h-64 rounded-full border border-cyan-500/20 flex items-center justify-center ${processing ? 'animate-[spin_2s_linear_infinite]' : 'animate-[spin_10s_linear_infinite]'}`}>
            <div className="w-56 h-56 rounded-full border border-cyan-400/10 border-t-cyan-400/80 border-r-cyan-400/80 animate-[spin_3s_linear_infinite_reverse]"></div>
            <div className="absolute w-48 h-48 rounded-full border border-cyan-500/10 border-b-cyan-400/50 animate-[spin_5s_linear_infinite]"></div>
        </div>
        
        {/* Inner Core Text */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-40 h-40 rounded-full bg-black/80 border border-cyan-500/30 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.15)] z-10 backdrop-blur-sm`}>
                <span className={`text-xl font-bold tracking-[0.2em] text-cyan-400 ${isListening ? 'animate-pulse' : ''}`}>
                    {isListening ? "LISTENING" : "NEHIRA"}
                </span>
                <span className="text-[9px] text-cyan-700 mt-1">CORE V1</span>
            </div>
        </div>
    </div>
  );
}
