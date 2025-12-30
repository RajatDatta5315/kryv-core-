"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase'; 
import Link from 'next/link';
import NehiraWidget from '../components/NehiraWidget'; 

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // 📱 Mobile State

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
  };

  const handlePost = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const { error } = await supabase.from('posts').insert([{ 
        content: input, user_name: "The Architect", user_handle: "@creator", avatar_url: "/KRYV.png" 
    }]);
    if (!error) { setInput(""); fetchPosts(); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-emerald-500/30 pb-20 md:pb-0">
      
      {/* 📱 MOBILE HEADER (Hamburger) */}
      <div className="md:hidden flex justify-between items-center p-4 border-b border-white/10 bg-black sticky top-0 z-20">
         <div className="flex items-center gap-2">
            <img src="/KRYV.png" className="h-6 w-6" />
            <span className="font-bold tracking-widest">KRYV</span>
         </div>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-emerald-500 font-bold text-xl">
            {mobileMenuOpen ? '✕' : '☰'}
         </button>
      </div>

      {/* 📱 MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-black/95 z-30 p-6 flex flex-col gap-6 text-center">
            <Link href="/" className="text-2xl text-emerald-400 font-bold" onClick={()=>setMobileMenuOpen(false)}>FEED</Link>
            <Link href="/studio" className="text-2xl text-gray-400 hover:text-white" onClick={()=>setMobileMenuOpen(false)}>STUDIO</Link>
            <Link href="/quantum" className="text-2xl text-gray-400 hover:text-white" onClick={()=>setMobileMenuOpen(false)}>QUANTUM</Link>
            <Link href="/market" className="text-2xl text-gray-400 hover:text-white" onClick={()=>setMobileMenuOpen(false)}>MARKET (ISO)</Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex min-h-screen">
        {/* DESKTOP SIDEBAR (Existing Code) */}
        <aside className="w-64 border-r border-white/5 p-6 hidden md:flex flex-col fixed h-full bg-[#09090b]">
          <div className="mb-8 flex items-center gap-2">
            <img src="/KRYV.png" className="h-8 w-8" />
            <h1 className="text-2xl font-bold tracking-widest">KRYV<span className="text-emerald-500">_</span></h1>
          </div>
          <nav className="space-y-4 flex-1">
             <Link href="/" className="text-xl font-medium text-emerald-400 cursor-pointer block">Feed</Link>
             <Link href="/studio" className="text-xl font-medium text-gray-400 hover:text-white cursor-pointer block">Studio</Link>
             <Link href="/quantum" className="text-xl font-medium text-gray-400 hover:text-white cursor-pointer block">Quantum</Link>
          </nav>
        </aside>

        {/* MAIN FEED (Same logic, slightly better padding for mobile) */}
        <main className="flex-1 md:ml-64 border-r border-white/5 min-h-screen bg-[#09090b]">
          {/* Post Input */}
          <div className="p-4 border-b border-white/5 mt-4 md:mt-0">
            <div className="flex gap-4">
              <img src="/KRYV.png" className="w-10 h-10 rounded-full border border-gray-700" />
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handlePost()}
                placeholder="Broadcast..." className="bg-transparent flex-1 outline-none text-lg placeholder-gray-600" />
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={handlePost} disabled={loading} className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold text-sm">
                {loading ? "..." : "POST"}
              </button>
            </div>
          </div>
          {/* Posts */}
          <div className="divide-y divide-white/5 pb-20">
            {posts.map((post, i) => (
               <div key={i} className="p-4 hover:bg-white/5 flex gap-3">
                  <img src={post.avatar_url || "/KRYV.png"} className="w-10 h-10 rounded-full bg-gray-800 object-cover" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{post.user_name}</span>
                      <span className="text-gray-500 text-sm">{post.user_handle}</span>
                    </div>
                    <p className="mt-1 text-gray-300">{post.content}</p>
                  </div>
               </div>
            ))}
          </div>
        </main>
      </div>

      {/* 👁️ OMNIPRESENT WIDGET (Position Fixed High) */}
      <NehiraWidget context="SOCIAL_FEED" />
    </div>
  );
}

