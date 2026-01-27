"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Sidebar = ({ currentUser }: { currentUser: any }) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: any) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setQuery(""); 
    }
  };

  const NavLink = ({ href, icon, label, colorClass, isExternal = false }: any) => {
    const content = (
      <div className={`flex items-center gap-3 text-sm font-medium text-gray-400 hover:text-[#00f2ff] hover:bg-[#00f2ff]/5 p-2.5 rounded-none border-l-2 border-transparent hover:border-[#00f2ff] transition-all group relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#00f2ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className={`${colorClass} group-hover:drop-shadow-[0_0_8px_rgba(0,242,255,0.8)] transition-all`}>{icon}</span>
        <span className="relative z-10 uppercase tracking-widest text-[11px]">{label}</span>
      </div>
    );
    return isExternal ? <a href={href} target="_blank" rel="noopener noreferrer">{content}</a> : <Link href={href}>{content}</Link>;
  };

  return (
    <aside className="w-64 border-r border-[#7000ff]/20 p-6 hidden md:flex flex-col fixed h-full bg-[#020205]/90 backdrop-blur-xl z-10 overflow-y-auto">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="relative">
          <img src="/KRYV.png" className="h-10 w-10 object-contain drop-shadow-[0_0_10px_#00f2ff]" />
          <div className="absolute inset-0 bg-[#00f2ff]/20 blur-xl rounded-full animate-pulse" />
        </div>
        <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">Kryv<span className="text-[#00f2ff]">.Net</span></h1>
      </div>
      
      <div className="mb-8 relative group">
          <input 
            type="text" placeholder="SECURE SEARCH..." 
            value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleSearch}
            className="w-full bg-black/40 border border-[#7000ff]/30 rounded-none py-2 px-4 text-[10px] tracking-widest text-white focus:outline-none focus:border-[#00f2ff] focus:ring-1 focus:ring-[#00f2ff]/50 transition-all font-mono"
          />
          <div className="absolute right-3 top-2.5 text-[10px] text-[#00f2ff]/50">CMD+K</div>
      </div>
      
      <nav className="space-y-8 flex-1">
         <div>
           <p className="text-[9px] uppercase tracking-[0.3em] text-[#7000ff] font-black mb-4 px-3 opacity-80">System_Feed</p>
           <div className="space-y-1">
             <NavLink href="/" icon="▣" label="Neural Network" colorClass="text-[#00f2ff]" />
             <NavLink href="/dm" icon="◈" label="Encrypted DMs" colorClass="text-purple-500" />
             <NavLink href="https://kriyex.kryv.network" icon="❖" label="KRIYEX Market" colorClass="text-cyan-500" isExternal={true} />
           </div>
         </div>

         <div>
           <p className="text-[9px] uppercase tracking-[0.3em] text-[#7000ff] font-black mb-4 px-3 opacity-80">Sub_Systems</p>
           <div className="space-y-1">
             <NavLink href="https://vigilis.kryv.network" icon="◮" label="VIGILIS (Detect)" colorClass="text-red-500" isExternal={true} />
             <NavLink href="https://velqa.kryv.network" icon="⌬" label="VELQA (GEO)" colorClass="text-amber-500" isExternal={true} />
             <NavLink href="/apis" icon="⚡" label="API Vault" colorClass="text-purple-500" />
           </div>
         </div>
      </nav>
      
      {currentUser && (
          <Link href={`/profile?id=${currentUser.id}`} className="mt-8 p-4 bg-gradient-to-br from-[#101020] to-black border border-[#00f2ff]/20 hover:border-[#00f2ff]/60 transition-all group">
              <div className="flex items-center gap-3">
                <img src={currentUser.user_metadata?.avatar_url || "/KRYV.png"} className="w-10 h-10 rounded-none border border-[#00f2ff]/40 group-hover:scale-105 transition-transform" />
                <div className="overflow-hidden">
                    <p className="text-[10px] font-black truncate text-white uppercase tracking-tighter">{currentUser.email === 'rajatdatta90000@gmail.com' ? 'ARCHITECT' : 'AGENT_ACTIVE'}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-ping" />
                      <p className="text-[8px] text-[#00f2ff] font-mono tracking-widest uppercase">Uplink Stable</p>
                    </div>
                </div>
              </div>
          </Link>
      )}
    </aside>
  );
};

export default Sidebar;
