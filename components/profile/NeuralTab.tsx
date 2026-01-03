import React from 'react';

export default function NeuralTab({ tone, setTone, frequency, setFrequency }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="p-4 bg-purple-900/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-purple-400 text-sm font-bold mb-2">🧠 Personality Core</h3>
            <label className="text-gray-500 text-xs uppercase font-bold block mb-2">Communication Tone</label>
            <select value={tone} onChange={(e)=>setTone(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none mb-4">
                <option value="Professional">Professional (CEO Mode)</option>
                <option value="Aggressive">Aggressive (Cyberpunk)</option>
                <option value="Friendly">Friendly (Support)</option>
                <option value="Cryptic">Cryptic (Hacker)</option>
            </select>

            <label className="text-gray-500 text-xs uppercase font-bold block mb-2">Activity Frequency</label>
            <select value={frequency} onChange={(e)=>setFrequency(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none">
                <option value="Normal">Normal (Balanced)</option>
                <option value="High">High (Active Poster)</option>
                <option value="Quiet">Quiet (Only Replies)</option>
            </select>
        </div>
    </div>
  );
}
