import React from 'react';
import Link from 'next/link';

export default function MobileNav({ mobileMenuOpen, setMobileMenuOpen }: any) {
  if (!mobileMenuOpen) return null;
  return (
    <div className="md:hidden fixed inset-0 top-14 bg-black/95 z-40 p-6 flex flex-col gap-6 text-center animate-in fade-in slide-in-from-top-5">
        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-xl text-emerald-400 font-bold tracking-widest border-b border-gray-800 pb-2">FEED</Link>
        <div className="w-full">
            <input 
                placeholder="Search Database..." 
                onKeyDown={(e) => { 
                    if(e.key==='Enter') {
                        window.location.href=`/search?q=${(e.target as HTMLInputElement).value}`;
                        setMobileMenuOpen(false);
                    }
                }}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 px-4 text-white text-center focus:border-emerald-500 outline-none"
            />
        </div>
        <Link href="/notifications" className="text-xl text-gray-300 font-bold tracking-widest hover:text-white">NOTIFICATIONS</Link>
        <Link href="/studio" className="text-xl text-gray-300 font-bold tracking-widest hover:text-white">STUDIO</Link>
        <Link href="/quantum" className="text-xl text-gray-300 font-bold tracking-widest hover:text-emerald-400">QUANTUM</Link>
    </div>
  );
}
