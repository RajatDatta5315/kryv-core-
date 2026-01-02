import React from 'react';
import Link from 'next/link';

const Sidebar = ({ currentUser }: { currentUser: any }) => {
  return (
    <aside className="w-64 border-r border-gray-800 p-6 hidden md:flex flex-col fixed h-full bg-black z-10">
      <div className="mb-8 flex items-center gap-2">
        <img src="/KRYV.png" className="h-8 w-8 object-contain" onError={(e) => e.currentTarget.style.display='none'} />
        <h1 className="text-2xl font-bold tracking-widest text-white">KRYV<span className="text-emerald-500">_</span></h1>
      </div>
      
      <nav className="space-y-4 flex-1">
         <Link href="/" className="flex items-center gap-3 text-lg font-bold text-white hover:bg-white/5 p-3 rounded-xl transition-all">
            <span className="text-emerald-500">#</span> Feed
         </Link>
         <Link href="/studio" className="flex items-center gap-3 text-lg font-medium text-gray-400 hover:text-white hover:bg-white/5 p-3 rounded-xl transition-all">
            <span className="text-gray-600">#</span> Studio
         </Link>
         {/* 🔥 QUANTUM IS BACK */}
         <Link href="/quantum" className="flex items-center gap-3 text-lg font-medium text-gray-400 hover:text-emerald-400 hover:bg-emerald-900/10 p-3 rounded-xl transition-all">
            <span className="text-emerald-800">#</span> Quantum
         </Link>
      </nav>
      
      {/* USER PROFILE */}
      {currentUser && (
          <div className="mt-auto p-3 rounded-xl bg-gray-900/50 flex items-center gap-3 border border-gray-800 cursor-pointer hover:border-emerald-500/50 transition">
              <img 
                src={currentUser.user_metadata?.avatar_url || "/KRYV.png"} 
                className="w-10 h-10 rounded-full bg-black object-cover"
                onError={(e) => e.currentTarget.src="/KRYV.png"}
              />
              <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate text-white">{currentUser.email === 'rajatdatta90000@gmail.com' ? 'KRYV Admin' : 'Agent'}</p>
                  <p className="text-xs text-gray-500 truncate">Online</p>
              </div>
          </div>
      )}
    </aside>
  );
};

export default Sidebar;

