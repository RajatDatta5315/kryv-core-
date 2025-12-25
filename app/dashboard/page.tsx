"use client";

import React from 'react';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-emerald-500/30 overflow-hidden">
      
      {/* Sidebar - Fixed Glass */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-white/5 bg-[#050505]/80 backdrop-blur-2xl z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="text-lg font-bold tracking-widest text-white">KRYV<span className="text-emerald-500">_</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {[
            { name: 'Command Center', icon: <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /> },
            { name: 'Marketplace', icon: <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> },
            { name: 'Agents', icon: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 rounded-lg hover:bg-white/5 hover:text-white hover:border border border-transparent hover:border-white/5 transition-all cursor-pointer group">
              <svg className="w-5 h-5 group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">{item.icon}</svg>
              {item.name}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
            <div>
              <p className="text-xs font-bold text-white">The Architect</p>
              <p className="text-[10px] text-emerald-400">System Online</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-12 overflow-y-auto relative">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <header className="mb-12 relative z-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-2 font-mono text-sm">OVERVIEW // KRYV_NETWORK_V1</p>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
          {[
            { label: "Active Agents", value: "3", sub: "Operational", color: "from-emerald-500/20 to-emerald-900/5", border: "border-emerald-500/20", text: "text-emerald-400" },
            { label: "Revenue (DryPaper)", value: "$0.00", sub: "Connecting...", color: "from-blue-500/20 to-blue-900/5", border: "border-blue-500/20", text: "text-blue-400" },
            { label: "Server Load", value: "12%", sub: "Optimal", color: "from-purple-500/20 to-purple-900/5", border: "border-purple-500/20", text: "text-purple-400" }
          ].map((stat, i) => (
            <div key={i} className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.border} backdrop-blur-sm`}>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
              <h2 className="text-4xl font-bold text-white mb-1">{stat.value}</h2>
              <p className={`text-xs font-mono ${stat.text}`}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Agent Grid */}
        <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6 font-bold">Deployed Units</h3>
        <div className="grid grid-cols-1 gap-4 relative z-10">
          {[
            { name: "Orion", role: "Market Sniper", status: "Active", profit: "$320.00", color: "bg-emerald-500" },
            { name: "Velvet", role: "Content Engine", status: "Idle", profit: "$130.00", color: "bg-yellow-500" },
            { name: "Nexus", role: "Code Architect", status: "Training", profit: "$0.00", color: "bg-blue-500" }
          ].map((agent, i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-xl border border-white/5 bg-[#0A0A0A] hover:border-white/10 transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${agent.color} shadow-[0_0_10px_currentColor]`}></div>
                <div>
                  <h4 className="font-bold text-gray-200 group-hover:text-white">{agent.name}</h4>
                  <p className="text-xs text-gray-500">{agent.role}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-emerald-400 text-sm">{agent.profit}</p>
                <p className="text-[10px] text-gray-600 uppercase tracking-wider">Net Profit</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

