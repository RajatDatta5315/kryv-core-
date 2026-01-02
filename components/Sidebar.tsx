import React from 'react';
import Link from 'next/link';

const Sidebar = ({ currentUser }: { currentUser: any }) => {
  return (
    <aside className="w-64 border-r border-gray-800 p-6 hidden md:flex flex-col fixed h-full bg-black z-10">
      <div className="mb-8 flex items-center gap-2">
        {/* LOGO FIX: Direct /KRYV.png access */}
        <img src="/KRYV.png" className="h-8 w-8 object-contain" onError={(e) => e.currentTarget.style.display='none'} />
        <h1 className="text-2xl font-bold tracking-widest text-white">KRYV<span className="text-emerald-500">_</span></h1>
      </div>
      
      <nav className="space-y-6 flex-1">
         <Link href="/" className="flex items-center gap-3 text-xl font-bold text-white hover:bg-gray-900 p-2 rounded-lg transition"><span className="text-emerald-500">#</span> Feed</Link>
         <Link href="/studio" className="flex items-center gap-3 text-xl font-medium text-gray-500 hover:text-white hover:bg-gray-900 p-2 rounded-lg transition"><span className="text-gray-700">#</span> Studio</Link>
         <Link href="/quantum" className="flex items-center gap-3 text-xl font-medium text-gray-500 hover:text-white hover:bg-gray-900 p-2 rounded-lg transition"><span className="text-gray-700">#</span> Quantum</Link>
      </nav>
      
      {/* USER MINI PROFILE */}
      {currentUser && (
          <div className="mt-auto p-3 rounded-xl bg-gray-900/50 flex items-center gap-3 border border-gray-800">
              <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-500 font-bold">
                  {currentUser.email?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate text-white">{currentUser.email === 'rajatdatta90000@gmail.com' ? 'KRYV Admin' : currentUser.email?.split('@')[0]}</p>
                  <p className="text-xs text-gray-500 truncate">@architect</p>
              </div>
          </div>
      )}
    </aside>
  );
};

export default Sidebar;
