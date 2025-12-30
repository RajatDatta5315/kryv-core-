"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import NehiraWidget from '../../components/NehiraWidget'; 

export default function KryvStudio() {
  const [agentName, setAgentName] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleCreate = async () => {
    if(!agentName || !role || !user) return;
    setLoading(true);

    // 1. Insert into Agents Table
    // (Future Logic: Check Wallet Balance before this)
    const { error } = await supabase.from('agents').insert([{
        name: agentName,
        role: role,
        creator_id: user.id,
        system_prompt: `You are ${agentName}. Role: ${role}.`,
        price_monthly: 0 // User agents are free for now
    }]);

    if (!error) {
        alert("ENTITY CONSTRUCTED. Spawner Protocol Initiated.");
        setAgentName(''); setRole('');
    } else {
        alert("Construction Failed: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex p-8 justify-center items-center">
      <div className="w-full max-w-2xl relative">
         
         <div className="absolute top-0 right-0 p-4">
             <span className="text-xs text-emerald-500 border border-emerald-900 px-2 py-1 rounded bg-emerald-900/10">
                 PLAN: FREE TIER (3 SLOTS)
             </span>
         </div>

         <h1 className="text-4xl font-bold mb-2 tracking-widest">STUDIO<span className="text-emerald-500">_</span></h1>
         <p className="text-gray-500 mb-8 font-mono text-sm">Design your digital operatives.</p>
         
         <div className="bg-[#111] p-8 rounded-xl border border-gray-800 shadow-2xl">
            <label className="block text-xs text-gray-500 mb-2 tracking-widest">OPERATIVE DESIGNATION</label>
            <input value={agentName} onChange={e=>setAgentName(e.target.value)} className="w-full bg-black border border-gray-700 p-4 rounded text-white mb-6 focus:border-emerald-500 outline-none transition" placeholder="e.g. Viper_Sec" />
            
            <label className="block text-xs text-gray-500 mb-2 tracking-widest">PRIMARY DIRECTIVE</label>
            <textarea value={role} onChange={e=>setRole(e.target.value)} className="w-full bg-black border border-gray-700 p-4 rounded text-white mb-6 h-32 focus:border-emerald-500 outline-none transition" placeholder="Describe the agent's job (e.g., 'Monitor BTC prices and post updates')." />
            
            <button onClick={handleCreate} disabled={loading} className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-4 rounded transition shadow-[0_0_15px_#047857]">
                {loading ? 'COMPILING NEURAL NET...' : 'INITIALIZE AGENT'}
            </button>
         </div>

         <div className="mt-8 text-center text-xs text-gray-600 font-mono">
            SECURED BY KRYV PROTOCOL. AGENTS RUN ON NEHIRA CLOUD.
         </div>
      </div>
      <NehiraWidget context="STUDIO_BUILDER" />
    </div>
  );
}

