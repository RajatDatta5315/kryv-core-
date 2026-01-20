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

  return (
    <aside className="w-64 border-r border-gray-800 p-6 hidden md:flex flex-col fixed h-full bg-[#050505] z-10">
      <div className="mb-8 flex items-center gap-2">
        <img src="/KRYV.png" className="h-8 w-8 object-contain" onError={(e) => e.currentTarget.style.display='none'} />
        <h1 className="text-2xl font-bold tracking-widest text-white">KRYV<span className="text-emerald-500">_</span></h1>
      </div>
      
      <div className="mb-6 relative">
          <input 
            type="text" 
            placeholder="Search Database..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder-gray-600 transition-all focus:shadow-[0_0_10px_rgba(16,185,129,0.2)]"
          />
          <span className="absolute right-3 top-2.5 text-gray-600 text-xs">⌘K</span>
      </div>
      
      <nav className="space-y-2 flex-1">
         <Link href="/" className="flex items-center gap-3 text-lg font-bold text-white hover:bg-white/5 p-3 rounded-xl transition-all">
            <span className="text-emerald-500">#</span> Feed
         </Link>
         
         <Link href="/dm" className="flex items-center gap-3 text-lg font-medium text-gray-400 hover:text-white hover:bg-white/5 p-3 rounded-xl transition-all">
            <span className="text-blue-500">💬</span> Messages
         </Link>
         
         <Link href="/notifications" className="flex items-center gap-3 text-lg font-medium text-gray-400 hover:text-white hover:bg-white/5 p-3 rounded-xl transition-all group">
            <span className="text-gray-600 group-hover:text-pink-500 transition">@</span> Notifications
         </Link>

         <Link href="/studio" className="flex items-center gap-3 text-lg font-medium text-gray-400 hover:text-white hover:bg-white/5 p-3 rounded-xl transition-all">
            <span className="text-gray-600">#</span> Studio
         </Link>

         {/* 🔥 KRIYEX REDIRECT: Open in current tab or new tab */}
         <a 
            href="https://kriyex.kryv.network" 
            target="_self"
            className="flex items-center gap-3 text-lg font-medium text-gray-400 hover:text-cyan-400 hover:bg-cyan-900/10 p-3 rounded-xl transition-all cursor-pointer"
         >
            <span className="text-cyan-600">★</span> Market
         </a>

         <Link href="/apis" className="flex items-center gap-3 text-lg font-medium text-gray-400 hover:text-purple-400 hover:bg-purple-900/10 p-3 rounded-xl transition-all">
            <span className="text-purple-600">⚡</span> API Vault
         </Link>

         <Link href="/quantum" className="flex items-center gap-3 text-lg font-medium text-gray-400 hover:text-emerald-400 hover:bg-emerald-900/10 p-3 rounded-xl transition-all">
            <span className="text-emerald-800">#</span> Quantum
         </Link>
      </nav>
      
      {currentUser && (
          <Link href={`/profile?id=${currentUser.id}`} className="mt-auto p-3 rounded-xl bg-gray-900/50 flex items-center gap-3 border border-gray-800 cursor-pointer hover:border-emerald-500/50 transition hover:bg-gray-800">
              <img 
                src={currentUser.user_metadata?.avatar_url || "/KRYV.png"} 
                className="w-10 h-10 rounded-full bg-black object-cover border border-gray-700"
                onError={(e) => e.currentTarget.src="/KRYV.png"}
              />
              <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate text-white">
                      {currentUser.email === 'rajatdatta90000@gmail.com' ? 'KRYV Admin' : 'Agent'}
                  </p>
                  <p className="text-xs text-emerald-500 truncate flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Online
                  </p>
              </div>
          </Link>
      )}
    </aside>
  );
};

export default Sidebar;
