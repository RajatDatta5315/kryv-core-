"use client";
import React, { useEffect, useState } from 'react';
import StatusPanel from '@/components/StatusPanel'; 

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // API se real data fetch karne ka try
    fetch('/api/marketplace')
      .then(res => res.json())
      .then(resData => setData(resData))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-white/5 bg-[#050505]/80 backdrop-blur-2xl z-50 p-6">
        <h1 className="text-xl font-bold tracking-widest text-white mb-10">KRYV_</h1>
        <nav className="space-y-2">
          {['Overview', 'Products', 'Settings'].map(item => (
            <div key={item} className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer rounded hover:bg-white/5">{item}</div>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 md:ml-64 p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Command Center</h1>
          <p className="text-gray-500">System Status: Online</p>
        </header>

        {/* --- NEW STATUS PANEL (Nehira Built This) --- */}
        <div className="mb-8">
            <StatusPanel />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-[#0A0A0A] border border-white/10 hover:border-emerald-500/50 transition-colors">
             <div className="text-gray-500 text-xs uppercase tracking-widest mb-2">Total Revenue</div>
             <div className="text-3xl font-bold text-white">$43.00</div>
          </div>
          <div className="p-6 rounded-xl bg-[#0A0A0A] border border-white/10 hover:border-emerald-500/50 transition-colors">
             <div className="text-gray-500 text-xs uppercase tracking-widest mb-2">Active Products</div>
             <div className="text-3xl font-bold text-emerald-400">3</div>
          </div>
        </div>

        {/* Inventory List */}
        <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Live Inventory (DryPaper)</h3>
        <div className="space-y-4">
          {data?.inventory?.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center p-4 rounded-lg bg-[#0A0A0A] border border-white/5 hover:bg-white/5 transition-all">
              <div>
                <div className="text-white font-bold">{item.name}</div>
                <div className="text-xs text-gray-500">ID: {item.id}</div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 font-mono">${item.price}</div>
                <div className="text-xs text-gray-600">{item.status}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

