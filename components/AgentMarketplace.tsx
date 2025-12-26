"use client";
import React, { useEffect, useState } from 'react';
import { ShoppingBag, Terminal, Activity, Lock, RefreshCw } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Agent {
  id: string;
  name: string;
  role: string;
  price: string;
  status: string;
  description: string;
  color: string;
}

interface AgentMarketplaceProps {
  onSelect: (agentName: string) => void;
}

export default function AgentMarketplace({ onSelect }: AgentMarketplaceProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  // FETCH AGENTS FROM DB (AUTOMATION READY)
  const fetchAgents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('agents').select('*').order('created_at', { ascending: true });
    if (data) {
      setAgents(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Terminal className="text-emerald-500" /> 
          NEURAL NET <span className="text-gray-600 text-sm font-mono">// FOUNDRY_DB</span>
        </h2>
        <button onClick={fetchAgents} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all">
          <RefreshCw size={16} className={loading ? "animate-spin text-emerald-500" : "text-gray-400"} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className={`
            relative p-6 rounded-xl border transition-all duration-300 group
            ${agent.status === 'locked' ? 'bg-[#0A0A0A] border-white/5 grayscale' : 'bg-gradient-to-br from-gray-900 to-black border-emerald-500/30'}
          `}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg bg-${agent.color}-500/10 text-${agent.color}-400`}>
                <Activity size={24} />
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded border border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                {agent.price}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">{agent.role}</p>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 h-12 overflow-hidden">{agent.description}</p>

            <button 
              onClick={() => agent.status !== 'locked' && onSelect(agent.name)}
              className={`
              w-full py-3 rounded-lg font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all
              ${agent.status === 'locked' 
                ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20'}
            `}>
              {agent.status === 'locked' ? <><Lock size={16} /> LOCKED</> : 'ACTIVATE AGENT'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

