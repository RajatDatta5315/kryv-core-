"use client";
import React, { useEffect, useState } from 'react';
import StatusPanel from '@/components/StatusPanel';
import ViralPostGenerator from '@/components/ViralPostGenerator';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  // Realtime Supabase Connection
  const supabase = createClientComponentClient();

  useEffect(() => {
    // 1. Fetch Products
    const fetchProducts = async () => {
       const { data } = await supabase.from('products').select('*');
       if (data) setProducts(data);
    };
    fetchProducts();
    
    // 2. Dummy Revenue Data (Abhi ke liye)
    setData({ revenue: "43.00", active: 3 });
  }, []);

  return (
    <div className="flex min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-emerald-500/30">
      
      {/* --- SIDEBAR --- */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-white/5 bg-[#050505]/80 backdrop-blur-2xl z-50 p-6">
        
        {/* LOGO */}
        <h1 className="text-xl font-bold tracking-widest text-white mb-8">KRYV_</h1>
        
        {/* NEHIRA AVATAR (THE FACE) */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-br from-emerald-500 to-black shadow-[0_0_20px_rgba(16,185,129,0.4)]">
             <div className="w-full h-full rounded-full overflow-hidden border-2 border-black bg-black">
               {/* Ye hai wo image jo tune upload ki */}
               <img src="/nehira_avatar.png" alt="Nehira" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
             </div>
             {/* Online Dot */}
             <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-black rounded-full animate-pulse"></div>
          </div>
          <p className="mt-3 text-xs text-emerald-400 font-mono tracking-widest">[ARCHITECT_ONLINE]</p>
        </div>

        {/* MENU */}
        <nav className="space-y-2 flex-1">
          {['Overview', 'Inventory', 'Neural Net', 'Settings'].map(item => (
            <div key={item} className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer rounded hover:bg-white/5 text-sm font-medium transition-colors">
              {item}
            </div>
          ))}
        </nav>

        <div className="text-[10px] text-gray-600 font-mono">V 1.2.0 // STABLE</div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 md:ml-64 p-8 md:p-12 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Command Center</h1>
            <p className="text-gray-500 text-sm mt-1">System Status: <span className="text-emerald-500">Nominal</span></p>
          </div>
        </header>

        {/* 1. SYSTEM HEALTH WIDGET */}
        <div className="mb-6">
            <StatusPanel />
        </div>

        {/* 2. VIRAL SALESWOMAN (AI AGENT) */}
        <div className="mb-8">
            <ViralPostGenerator />
        </div>

        {/* 3. REVENUE STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-[#0A0A0A] border border-white/10 hover:border-emerald-500/20 transition-all group">
             <div className="text-gray-500 text-xs uppercase tracking-widest mb-2 group-hover:text-emerald-400">Total Revenue</div>
             <div className="text-3xl font-bold text-white">${data?.revenue}</div>
          </div>
          <div className="p-6 rounded-xl bg-[#0A0A0A] border border-white/10 hover:border-emerald-500/20 transition-all group">
             <div className="text-gray-500 text-xs uppercase tracking-widest mb-2 group-hover:text-emerald-400">Active Products</div>
             <div className="text-3xl font-bold text-emerald-400">{products.length > 0 ? products.length : data?.active}</div>
          </div>
        </div>

        {/* 4. LIVE INVENTORY (Connected to Supabase) */}
        <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Inventory Database</h3>
        <div className="space-y-3">
          {products.length === 0 ? (
             <div className="p-4 rounded-lg border border-dashed border-white/10 text-gray-600 text-sm text-center">
               No products synced. Running Scraper Protocol...
             </div>
          ) : (
            products.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center p-4 rounded-lg bg-[#0A0A0A] border border-white/5 hover:bg-white/5 transition-all">
                <div>
                  <div className="text-white font-bold">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.url || 'No Link'}</div>
                </div>
                <div className="text-emerald-400 font-mono">${item.price}</div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

