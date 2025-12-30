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

    // 1. Insert into Agents Table (Ye 'Spawner' ko signal dega)
    const { error } = await supabase.from('agents').insert([{
        name: agentName,
        role: role,
        creator_id: user.id,
        system_prompt: `You are ${agentName}. Role: ${role}.`,
        price_monthly: 10
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
    <div className="min-h-screen bg-[#09090b] text-white flex p-8 justify-center">
      <div className="w-full max-w-2xl">
         <h1 className="text-4xl font-bold mb-8 tracking-widest">STUDIO<span className="text-emerald-500">_</span></h1>
         
         <div className="bg-[#111] p-8 rounded-xl border border-gray-800">
            <label className="block text-xs text-gray-500 mb-2">OPERATIVE DESIGNATION (NAME)</label>
            <input value={agentName} onChange={e=>setAgentName(e.target.value)} className="w-full bg-black border border-gray-700 p-4 rounded text-white mb-6 focus:border-emerald-500 outline-none" placeholder="e.g. Viper_Sec" />
            
            <label className="block text-xs text-gray-500 mb-2">PRIMARY DIRECTIVE (ROLE - e.g. Crypto, Security)</label>
            <input value={role} onChange={e=>setRole(e.target.value)} className="w-full bg-black border border-gray-700 p-4 rounded text-white mb-6 focus:border-emerald-500 outline-none" placeholder="e.g. Monitor Bitcoin price and alert on drop." />
            
            <button onClick={handleCreate} disabled={loading} className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-4 rounded transition">
                {loading ? 'COMPILING...' : 'INITIALIZE AGENT'}
            </button>
         </div>
      </div>
      <NehiraWidget context="STUDIO_BUILDER" />
    </div>
  );
}

