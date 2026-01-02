import React from 'react';

export default function StudioLogs({ logs }: any) {
  return (
    <div className="w-full max-w-3xl bg-black/90 border border-cyan-900/50 rounded-lg p-4 h-48 overflow-y-auto mb-6 font-mono text-xs shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] custom-scrollbar">
        <div className="text-cyan-700 mb-2 border-b border-cyan-900/30 pb-2">Initialize... Nehira_Builder connected.</div>
        {logs.map((log: string, i: number) => (
            <div key={i} className="text-cyan-400 border-l-2 border-cyan-600 pl-2 mt-2 animate-in fade-in slide-in-from-left-2">
                {log}
            </div>
        ))}
        <div className="animate-pulse text-cyan-500 mt-2">_</div>
    </div>
  );
}
