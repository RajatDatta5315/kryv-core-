"use client";
import React, { useEffect, useState } from 'react';
import StatusPanel from '@/components/StatusPanel';
import ViralPostGenerator from '@/components/ViralPostGenerator';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Menu, X } from 'lucide-react'; // Icons

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Mobile State
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchProducts = async () => {
       const { data } = await supabase.from('products').select('*');
       if (data) setProducts(data);
    };
    fetchProducts();
    setData({ revenue: "43.00", active: 3 });
  }, []);

  return (
    <div className="flex min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-emerald-500/30">
      
      {/* --- MOBILE TOGGLE BUTTON --- */}
      <div className="md:hidden fixed top-4 right-4 z-[60]">
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-black/80 border border-emerald-500/50 rounded-full text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- SIDEBAR (Responsive) --- */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#050505]/95 backdrop-blur-xl border-r border-white/5 p-6 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <h1 className="text-xl font-bold tracking-widest text-white mb-8">KRYV_</h1>
        
        {/* NEHIRA AVATAR */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-br from-emerald-500 to-black shadow-[0_0_20px_rgba(16,185,129,0.4)]">
             <div className="w-full h-full rounded-full overflow-hidden border-2 border-black bg-black">
               <img src="/nehira_avatar.png" alt="Nehira" className="w-full h-full object-cover" />
             </div>
             <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-black rounded-full animate-pulse"></div>
          </div>
          <p className="mt-3 text-xs text-emerald-400 font-mono tracking-widest">[ARCHITECT_ONLINE]</p>
        </div>

        <nav className="space-y-2 flex-1">
          {['Overview', 'Inventory', 'Neural Net', 'Settings'].map(item => (
            <div key={item} className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer rounded hover:bg-white/5 text-sm font-medium">
              {item}
            </div>
          ))}
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full">
        <header className="mb-8 mt-8 md:mt-0">
          <h1 className="text-3xl font-bold text-white">Command Center</h1>
          <p className="text-gray-500 text-sm mt-1">System Status: <span className="text-emerald-500">Nominal</span></p>
        </header>

        <div className="mb-6"><StatusPanel /></div>
        <div className="mb-8"><ViralPostGenerator /></div>
        
        {/* Inventory List */}
        <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Inventory Database</h3>
        <div className="space-y-3">
          {products.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center p-4 rounded-lg bg-[#0A0A0A] border border-white/5">
              <div className="text-white font-bold">{item.name}</div>
              <div className="text-emerald-400 font-mono">${item.price}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

