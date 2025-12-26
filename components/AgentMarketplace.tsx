"use client";
import React from 'react';
import { ShoppingBag, Terminal, Activity, Lock } from 'lucide-react';

const AGENTS = [
  {
    id: 'nehira',
    name: 'Nehira (Architect)',
    role: 'Marketing & Strategy',
    level: 'Lvl 99',
    price: 'OWNED',
    status: 'online',
    desc: 'The core intelligence of KRYV. Handles viral marketing and strategic execution.',
    color: 'emerald'
  },
  {
    id: 'sniper',
    name: 'Viper (Crypto Sniper)',
    role: 'DeFi Trading',
    level: 'Lvl 1',
    price: 'DEV ACCESS',
    status: 'online', // UNLOCKED FOR YOU
    desc: 'Monitors mempools for 100x signals. Auto-executes trades on Solana.',
    color: 'purple'
  },
  {
    id: 'legal',
    name: 'Justitia (Legal)',
    role: 'Contract Automation',
    level: 'Lvl 5',
    price: 'DEV ACCESS',
    status: 'online', // UNLOCKED FOR YOU
    desc: 'Generates iron-clad NDAs and Service Agreements instantly.',
    color: 'blue'
  }
];

// YE LINE SABSE IMPORTANT HAI 👇
export default function AgentMarketplace() {
  return (
    <div className="animate-in fade-in zoom-in duration-300">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Terminal className="text-emerald-500" /> 
        NEURAL NET <span className="text-gray-600 text-sm font-mono">// AGENT_FOUNDRY</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AGENTS.map((agent) => (
          <div key={agent.id} className={`
            relative p-6 rounded-xl border transition-all duration-300 group
            ${agent.status === 'locked' ? 'bg-[#0A0A0A] border-white/5 grayscale hover:grayscale-0' : 'bg-gradient-to-br from-gray-900 to-black border-emerald-500/30'}
          `}>
            
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg bg-${agent.color}-500/10 text-${agent.color}-400`}>
                <Activity size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded border border-emerald-500/30 text-emerald-400 bg-emerald-500/10`}>
                {agent.price}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">{agent.role}</p>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 h-12">
              {agent.desc}
            </p>

            <button className="w-full py-3 rounded-lg font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20">
              {agent.status === 'locked' ? <><Lock size={16} /> LOCKED</> : 'CONFIGURE AGENT'}
            </button>

          </div>
        ))}

        <div className="p-6 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-all cursor-pointer group">
          <div className="p-4 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform">
            <ShoppingBag className="text-gray-400" />
          </div>
          <h3 className="text-white font-bold">Upload Custom Agent</h3>
          <p className="text-gray-500 text-sm mt-2">Connect your own Llama/Cohere model.</p>
        </div>

      </div>
    </div>
  );
}

