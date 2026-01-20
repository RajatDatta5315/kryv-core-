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
      <div className={`flex items-center gap-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 p-2.5 rounded-xl transition-all group`}>
        <span className={`${colorClass} group-hover:scale-110 transition-transform`}>{icon}</span>
        {label}
      </div>
    );
    return isExternal ? <a href={href} target="_blank" rel="noopener noreferrer">{content}</a> : <Link href={href}>{content}</Link>;
  };

  return (
    <aside className="w-64 border-r border-gray-800 p-6 hidden md:flex flex-col fixed h-full bg-[#050505] z-10 overflow-y-auto">
      <div className="mb-8 flex items-center gap-2">
        <img src="/KRYV.png" className="h-8 w-8 object-contain" />
        <h1 className="text-xl font-bold tracking-tighter text-white uppercase">Kryv<span className="text-emerald-500">.Net</span></h1>
      </div>
      
      <div className="mb-6 relative">
          <input 
            type="text" placeholder="Search Intel..." 
            value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleSearch}
            className="w-full bg-gray-900/50 border border-gray-800 rounded-lg py-2 px-4 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all"
          />
      </div>
      
      <nav className="space-y-6 flex-1">
         {/* CORE SECTION */}
         <div>
           <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold mb-3 px-3">Central Command</p>
           <div className="space-y-1">
             <NavLink href="/" icon="#" label="Neural Feed" colorClass="text-emerald-500" />
             <NavLink href="/dm" icon="💬" label="Encrypted DMs" colorClass="text-blue-500" />
             <NavLink href="https://kriyex.kryv.network" icon="★" label="KRIYEX Market" colorClass="text-cyan-500" isExternal={true} />
           </div>
         </div>

         {/* SECURITY & TOOLS SECTION */}
         <div>
           <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold mb-3 px-3">Active Subsystems</p>
           <div className="space-y-1">
             <NavLink href="https://vigilis.kryv.network" icon="🛡️" label="VIGILIS (Detect)" colorClass="text-red-500" isExternal={true} />
             <NavLink href="https://velqa.kryv.network" icon="🛰️" label="VELQA (GEO)" colorClass="text-amber-500" isExternal={true} />
             <NavLink href="/apis" icon="⚡" label="API Vault" colorClass="text-purple-500" />
           </div>
         </div>

         {/* STUDIO */}
         <div>
           <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold mb-3 px-3">Architect</p>
           <div className="space-y-1">
             <NavLink href="/studio" icon="⚙️" label="KRYV Studio" colorClass="text-gray-500" />
           </div>
         </div>
      </nav>
      
      {currentUser && (
          <Link href={`/profile?id=${currentUser.id}`} className="mt-8 p-3 rounded-xl bg-gray-900/30 flex items-center gap-3 border border-gray-800/50 hover:border-emerald-500/30 transition">
              <img src={currentUser.user_metadata?.avatar_url || "/KRYV.png"} className="w-8 h-8 rounded-full border border-gray-700" />
              <div className="overflow-hidden">
                  <p className="text-xs font-bold truncate text-white">{currentUser.email === 'rajatdatta90000@gmail.com' ? 'Architect' : 'Agent'}</p>
                  <p className="text-[10px] text-emerald-500 flex items-center gap-1">Online</p>
              </div>
          </Link>
      )}
    </aside>
  );
};

export default Sidebar;
