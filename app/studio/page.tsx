"use client";
import React, { useState } from 'react';
import NehiraWidget from '../../components/NehiraWidget'; 

export const dynamic = 'force-static'; 

export default function KryvStudio() {
  const [view, setView] = useState('dashboard'); 
  const [agentName, setAgentName] = useState('');
  const [agentRole, setAgentRole] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if(!agentName || !agentRole) return alert("Details missing!");
    setLoading(true);
    // Simulation (Asli API call Nehira Core pe jayegi)
    setTimeout(() => {
        alert("Agent Request Sent to Nehira Core!");
        setLoading(false);
        setView('dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex">
      {/* SIDEBAR */}
      <div className="w-64 border-r border-gray-900 p-6 hidden md:block bg-[#0a0a0a]">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-500 mb-8 tracking-tighter">
          KRYV STUDIO
        </h1>
        <nav className="space-y-2 text-sm">
          <button onClick={() => setView('dashboard')} className={`w-full text-left p-2 rounded ${view==='dashboard' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-green-400'}`}>Dashboard</button>
          <button onClick={() => setView('create')} className={`w-full text-left p-2 rounded ${view==='create' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-green-400'}`}>+ Create Agent</button>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">
        {view === 'create' ? (
          <div className="max-w-xl mx-auto mt-10">
            <h2 className="text-3xl font-bold mb-6 text-gray-200">Construct Entity</h2>
            <div className="bg-[#111] p-8 rounded-xl border border-gray-800 shadow-2xl">
               <label className="text-xs text-gray-500 mb-1 block">AGENT NAME</label>
               <input value={agentName} onChange={e => setAgentName(e.target.value)} className="w-full mb-4 bg-black border border-gray-700 p-3 rounded text-white focus:border-green-500 outline-none" placeholder="e.g. Crypto Sniper" />
               
               <label className="text-xs text-gray-500 mb-1 block">PRIMARY DIRECTIVE (PROMPT)</label>
               <textarea value={agentRole} onChange={e => setAgentRole(e.target.value)} className="w-full mb-4 bg-black border border-gray-700 p-3 rounded text-white h-32 focus:border-green-500 outline-none" placeholder="Describe behavior..." />
               
               <button onClick={handleCreate} className="w-full bg-green-700 text-white font-bold py-3 rounded hover:bg-green-600 transition">
                 {loading ? 'COMPILING NEURAL NET...' : 'LAUNCH AGENT'}
               </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6">Studio Dashboard</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-[#111] border border-gray-800 rounded">
                    <p className="text-gray-500 text-xs">ACTIVE AGENTS</p>
                    <p className="text-2xl font-bold">0</p>
                </div>
                <div className="p-6 bg-[#111] border border-gray-800 rounded">
                    <p className="text-gray-500 text-xs">CREDITS REMAINING</p>
                    <p className="text-2xl font-bold text-green-400">500</p>
                </div>
            </div>
          </div>
        )}
      </div>

      {/* 👁️ OMNIPRESENT NEHIRA (BUILDER MODE) */}
      <NehiraWidget context="STUDIO_BUILDER" />
    </div>
  );
}
