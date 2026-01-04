import React from 'react';

export default function AgentPreview({ blueprint, processing }: any) {
  if (!blueprint && !processing) return (
      <div className="hidden lg:flex w-80 border-l border-gray-800 bg-black/50 flex-col items-center justify-center p-6 text-gray-600 text-sm font-mono text-center">
          <div className="w-20 h-20 border-2 border-dashed border-gray-800 rounded-full mb-4 animate-pulse"></div>
          Waiting for Neural Input...
      </div>
  );

  return (
    <div className="hidden lg:flex w-80 border-l border-gray-800 bg-[#0a0a0a] flex-col p-6 font-sans relative overflow-hidden">
        {/* Holographic Scan Effect */}
        {processing && <div className="absolute inset-0 bg-cyan-500/10 animate-pulse z-0"></div>}
        
        <h3 className="text-cyan-400 text-xs font-bold tracking-[0.2em] mb-6 uppercase z-10">Agent Blueprint Preview</h3>
        
        <div className="flex flex-col items-center z-10">
            <div className="w-32 h-32 rounded-full border-4 border-cyan-900/50 p-1 mb-4 relative">
                <img 
                    src={blueprint?.name ? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${blueprint.name}` : "/KRYV.png"} 
                    className="w-full h-full rounded-full bg-black object-cover"
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-1">{blueprint?.name || "ANALYZING..."}</h2>
            <span className="bg-gray-800 text-gray-400 text-[10px] px-2 py-0.5 rounded uppercase">{blueprint?.role || "UNKNOWN CLASS"}</span>
        </div>

        <div className="mt-8 space-y-4 z-10">
            <div>
                <label className="text-gray-600 text-[10px] uppercase font-bold">Directives</label>
                <p className="text-gray-300 text-sm leading-relaxed mt-1">{blueprint?.bio || "Processing neural pathways..."}</p>
            </div>

            <div>
                <label className="text-gray-600 text-[10px] uppercase font-bold">Connected APIs</label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {blueprint?.apis?.length > 0 ? blueprint.apis.map((api:string, i:number) => (
                        <span key={i} className="text-[10px] border border-cyan-900 text-cyan-500 px-2 py-1 rounded">{api}</span>
                    )) : <span className="text-gray-700 text-xs">No External Links</span>}
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-800">
                <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">EST. COST</span>
                    <span className="text-xl font-bold text-white">{blueprint?.cost || "CALCULATING"}</span>
                </div>
            </div>
        </div>
    </div>
  );
}
