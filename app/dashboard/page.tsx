"use client";
import React, { useEffect, useState } from 'react';
import StatusPanel from '@/components/StatusPanel';
import ViralPostGenerator from '@/components/ViralPostGenerator';
import AgentMarketplace from '@/components/AgentMarketplace';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Menu, X, LayoutGrid, Cpu, Box, Settings } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  
  // NEW: SELECTED AGENT STATE
  const [selectedAgent, setSelectedAgent] = useState('Nehira (Architect)');

  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchProducts = async () => {
       const { data } = await supabase.from('products').select('*');
       if (data) setProducts(data);
    };
    fetchProducts();
    setData({ revenue: "43.00", active: 3 });
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'Neural Net':
        // Pass function to handle agent selection
        return <AgentMarketplace onSelect={(agentName: string) => {
            setSelectedAgent(agentName);
            setActiveTab('Overview'); // Go back to chat
        }} />;
      case 'Inventory':
        return (
          <div className="animate-in fade-in">
             <h2 className="text-2xl font-bold text-white mb-6">Inventory Database</h2>
             <div className="space-y-3">
              {products.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center p-4 rounded-lg bg-[#0A0A0A] border border-white/5">
                  <div className="text-white font-bold">{item.name}</div>
                  <div className="text-emerald-400 font-mono">${item.price}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Overview':
      default:
        return (
          <div className="animate-in fade-in">
            <div className="mb-6"><StatusPanel /></div>
            {/* PASS SELECTED AGENT TO CHAT */}
            <div className="mb-8"><ViralPostGenerator activeAgent={selectedAgent} /></div>
          </div>
        );
    }
  };

  const navItems = [
    { name: 'Overview', icon: <LayoutGrid size={18} /> },
    { name: 'Inventory', icon: <Box size={18} /> },
    { name: 'Neural Net', icon: <Cpu size={18} /> },
    { name: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-emerald-500/30">
      <div className="md:hidden fixed top-4 right-4 z-[60]">
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 bg-black/80 border border-emerald-500/50 rounded-full text-emerald-500">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#050505]/95 backdrop-blur-xl border-r border-white/5 p-6 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <h1 className="text-xl font-bold tracking-widest text-white mb-8">KRYV_</h1>
        <div className="mb-8 flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-br from-emerald-500 to-black shadow-[0_0_20px_rgba(16,185,129,0.4)]">
             <img src="/nehira_avatar.png" alt="Nehira" className="w-full h-full object-cover rounded-full border-2 border-black" />
          </div>
          <p className="mt-3 text-xs text-emerald-400 font-mono tracking-widest">[SYSTEM_ONLINE]</p>
        </div>
        <nav className="space-y-2 flex-1">
          {navItems.map(item => (
            <div key={item.name} onClick={() => { setActiveTab(item.name); setSidebarOpen(false); }} className={`px-4 py-3 cursor-pointer rounded-lg text-sm font-medium flex items-center gap-3 transition-all ${activeTab === item.name ? 'bg-emerald-500/10 text-white border border-emerald-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              {item.icon} {item.name}
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full">
        <header className="mb-8 mt-8 md:mt-0">
          <h1 className="text-3xl font-bold text-white">{activeTab}</h1>
          <p className="text-gray-500 text-sm mt-1">Active Agent: <span className="text-emerald-500 font-bold">{selectedAgent}</span></p>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}

