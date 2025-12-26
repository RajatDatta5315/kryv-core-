"use client";
import React from 'react';
import { ShoppingBag, Terminal, Activity, Lock } from 'lucide-react';

// NEHIRA YE LINE BHOOL GAYI THI 👇
interface AgentMarketplaceProps {
  onSelect: (agentName: string) => void;
}

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
    status: 'online',
    desc: 'Monitors mempools for 100x signals. Auto-executes trades on Solana.',
    color: 'purple'
  },
  {
    id: 'legal',
    name: 'Justitia (Legal)',
    role: 'Contract Automation',
    level: 'Lvl 5',
    price: 'DEV ACCESS',
    status: 'online',
    desc: 'Generates iron-clad NDAs and Service Agreements instantly.',
    color: 'blue'
  },
  // --- TOXIC TYLER IS HERE ---
  {
    id: 'toxic',
    name: 'Toxic Tyler',
    role: 'Professional Hater',
    level: 'Lvl 69',
    price: 'FREE',
    status: 'online',
    desc: 'He hates everything. Use him to roast your startup ideas.',
    color: 'red'
  }
];

export default function AgentMarketplace({ onSelect }: AgentMarketplaceProps) {
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
            <p className="text-sm text-gray-500 leading-relaxed mb-6 h-12">{agent.desc}</p>

            <button 
              onClick={() => agent.status === 'online' && onSelect(agent.name)}
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

