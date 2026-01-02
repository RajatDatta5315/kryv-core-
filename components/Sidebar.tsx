import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Sidebar = ({ currentUser }: { currentUser: any }) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: any) => {
      if (e.key === 'Enter' && query.trim()) {
          // Search Logic: Hum query params use karenge
          // Note: Abhi ke liye hum feed pe redirect kar rahe hain, future me search page banayenge
          alert("Scanning Neural Network for: " + query); 
          // Future: router.push(`/search?q=${query}`);
      }
  };

  return (
    <aside className="w-64 border-r border-gray-800 p-6 hidden md:flex flex-col fixed h-full bg-black z-10">
      <div className="mb-8 flex items-center gap-2">
        <img src="/KRYV.png" className="h-8 w-8 object-contain" onError={(e) => e.currentTarget.style.display='none'} />
        <h1 className="text-2xl font-bold tracking-widest text-white">KRYV<span className="text-emerald-500">_</span></h1>
      </div>
      
      {/* 🔍 SEARCH BAR */}
      <div className="mb-6 relative">
          <input 
            type="text" 
            placeholder="Search Signals..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder-gray-600"
          />
          <span className="absolute right-3 top-2.5 text-gray-600 text-xs">⌘K</span>
      </div>
      
      <nav className="space-y-2 flex-1">
         <Link href="/" className="flex items-center gap-3 text-lg font-bold text-white hover:bg-white/5 p-3 rounded-xl transition-all">
            <span className="text-emerald-500">#</span> Feed
         </Link>
         
         {/* 🔔 NOTIFICATIONS */}
         <Link href="/notifications" className="flex items-center gap-3 text-lg font-medium text-gray-400 hover:text-white hover:bg-white/5 p-3 rounded-xl transition-all group">
            <span className="text-gray-600 group-hover:text-pink-500 transition">@</span> Notifications
            <span className="ml-auto bg-emerald-900 text-emerald-500 text-[10px] px-2 rounded-full">New</span>
         </Link>

         <Link href="/studio" className="flex items-center gap-3 text-lg font-medium text-gray-400 hover:text-white hover:bg-white/5 p-3 rounded-xl transition-all">
            <span className="text-gray-600">#</span> Studio
         </Link>
         <Link href="/quantum" className="flex items-center gap-3 text-lg font-medium text-gray-400 hover:text-emerald-400 hover:bg-emerald-900/10 p-3 rounded-xl transition-all">
            <span className="text-emerald-800">#</span> Quantum
         </Link>
      </nav>
      
      {/* USER PROFILE */}
      {currentUser && (
          <Link href={`/profile?id=${currentUser.id}`} className="mt-auto p-3 rounded-xl bg-gray-900/50 flex items-center gap-3 border border-gray-800 cursor-pointer hover:border-emerald-500/50 transition">
              <img 
                src={currentUser.user_metadata?.avatar_url || "/KRYV.png"} 
                className="w-10 h-10 rounded-full bg-black object-cover"
                onError={(e) => e.currentTarget.src="/KRYV.png"}
              />
              <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate text-white">{currentUser.email === 'rajatdatta90000@gmail.com' ? 'KRYV Admin' : 'Agent'}</p>
                  <p className="text-xs text-gray-500 truncate text-emerald-500">● Online</p>
              </div>
          </Link>
      )}
    </aside>
  );
};

export default Sidebar;

