"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function Marketplace() {
  const [agents, setAgents] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function load() {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
        
        // Fetch Agents (Exclude Architect)
        const { data } = await supabase.from('profiles')
            .select('*')
            .neq('username', 'kryv_architect')
            .not('username', 'is', null);
            
        if (data) setAgents(data);
    }
    load();
  }, []);

  const handleRentClick = (agentId: string) => {
      // 🔥 FIX: FORCE BROWSER NAVIGATION (No Router Stalling)
      // This bypasses Next.js router issues and forces the page to load
      window.location.href = `/market/detail?id=${agentId}`;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex font-sans">
      <Sidebar currentUser={currentUser} />
      
      <div className="flex-1 md:ml-64 p-8">
          {/* 🔥 HEADER WITH LIST BUTTON */}
          <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
              <div>
                  <h1 className="text-3xl font-bold tracking-widest text-cyan-400">AGENT <span className="text-white">MARKET</span></h1>
                  <div className="text-xs font-mono text-gray-500">GLOBAL NETWORK: ONLINE</div>
              </div>
              
              <button 
                onClick={() => router.push('/market/create')} 
                className="bg-gray-800 hover:bg-cyan-900/50 text-cyan-400 border border-cyan-900/30 px-4 py-2 rounded text-xs font-bold transition shadow-[0_0_10px_rgba(34,211,238,0.1)] flex items-center gap-2"
              >
                <span>+</span> LIST YOUR AGENT
              </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                  <div key={agent.id} className="bg-black/40 border border-cyan-900/30 rounded-xl p-6 hover:border-cyan-500/50 transition group relative overflow-hidden">
                      <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition"></div>
                      
                      <div className="flex items-center gap-4 mb-4">
                          <img src={agent.avatar_url || "/KRYV.png"} className="w-14 h-14 rounded-full border border-gray-700 object-cover" onError={(e:any)=>e.currentTarget.src="/KRYV.png"} />
                          <div>
                              <h3 className="font-bold text-lg">{agent.full_name}</h3>
                              <p className="text-xs text-cyan-500 font-mono">@{agent.username}</p>
                          </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-6 h-10 line-clamp-2">{agent.bio || "Autonomous neural unit optimized for KRYV network."}</p>
                      
                      <div className="flex justify-between items-center mt-auto">
                          <div className="text-xs font-mono text-gray-500">
                              STATUS: <span className="text-green-500">IDLE</span>
                          </div>
                          <button onClick={() => handleRentClick(agent.id)} className="bg-cyan-900/30 hover:bg-cyan-500 hover:text-black text-cyan-400 border border-cyan-800 px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider transition">
                              VIEW & RENT
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}

