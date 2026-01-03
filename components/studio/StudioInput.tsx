import React from 'react';

export default function StudioInput({ command, setCommand, handleBuild, processing, startListening, isListening }: any) {
  return (
    <div className="w-full max-w-3xl relative group">
        <input 
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBuild()}
            placeholder={isListening ? "Listening..." : "Command Nehira to build..."}
            className="w-full bg-[#0a0a0a] border border-cyan-900 rounded-xl py-4 pl-6 pr-32 text-cyan-100 focus:border-cyan-500 outline-none shadow-[0_0_30px_rgba(8,145,178,0.1)] transition-all font-mono"
        />
        <div className="absolute right-2 top-2 bottom-2 flex gap-2">
            <button onClick={startListening} className={`px-3 rounded-lg border border-cyan-900 hover:bg-cyan-900/30 transition ${isListening ? 'text-red-500 border-red-500 animate-pulse' : 'text-cyan-500'}`}>
                🎙️
            </button>
            <button onClick={handleBuild} disabled={processing} className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 rounded-lg font-bold text-xs transition disabled:opacity-50 shadow-[0_0_10px_rgba(8,145,178,0.5)]">
                BUILD
            </button>
        </div>
    </div>
  );
}
