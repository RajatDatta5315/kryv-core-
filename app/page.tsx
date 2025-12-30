"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase'; 
import Link from 'next/link';
import NehiraWidget from '../components/NehiraWidget'; // 👁️ IMPORTED

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPosts(data);
  };

  const handlePost = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const { error } = await supabase
      .from('posts')
      .insert([{ 
        content: input, 
        user_name: "The Architect", 
        user_handle: "@creator",
        avatar_url: "/KRYV.png" // Tera Logo
      }]);

    if (!error) {
      setInput("");
      fetchPosts(); 
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto flex min-h-screen">
        
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-white/5 p-6 hidden md:flex flex-col fixed h-full bg-[#09090b]">
          {/* LOGO UPDATE */}
          <div className="mb-8 flex items-center gap-2">
            <img src="/KRYV.png" alt="KRYV" className="h-8 w-8" />
            <h1 className="text-2xl font-bold tracking-widest">KRYV<span className="text-emerald-500">_</span></h1>
          </div>
          
          <nav className="space-y-4 flex-1">
             <Link href="/" className="text-xl font-medium text-emerald-400 cursor-pointer block">Feed</Link>
             <Link href="/studio" className="text-xl font-medium text-gray-400 hover:text-white cursor-pointer block">Studio</Link>
             <Link href="/quantum" className="text-xl font-medium text-gray-400 hover:text-white cursor-pointer block">Quantum</Link>
          </nav>
        </aside>

        {/* Main Feed */}
        <main className="flex-1 md:ml-64 border-r border-white/5 min-h-screen bg-[#09090b]">
          <header className="sticky top-0 bg-[#09090b]/90 backdrop-blur-md border-b border-white/5 p-4 z-10">
            <h2 className="text-lg font-bold">Encrypted Feed</h2>
          </header>
          
          <div className="p-4 border-b border-white/5">
            <div className="flex gap-4">
              <img src="/KRYV.png" className="w-10 h-10 rounded-full border border-gray-700" />
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePost()}
                placeholder="Broadcast to the network..." 
                className="bg-transparent flex-1 outline-none text-lg placeholder-gray-600"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={handlePost} disabled={loading} className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-emerald-500 disabled:opacity-50">
                {loading ? "SENDING..." : "BROADCAST"}
              </button>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {posts.map((post, i) => (
              <div key={i} className="p-4 hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex gap-3">
                  {/* AVATAR HANDLING */}
                  <img src={post.avatar_url || "/KRYV.png"} className="w-10 h-10 rounded-full bg-gray-800 object-cover" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{post.user_name}</span>
                      <span className="text-gray-500 text-sm">{post.user_handle}</span>
                      <span className="text-gray-500 text-sm">· {new Date(post.created_at).toLocaleTimeString()}</span>
                    </div>
                    <p className="mt-1 text-gray-300">{post.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 p-6 hidden lg:block sticky top-0 h-screen">
            <div className="text-gray-500 text-xs uppercase tracking-widest mb-4">Live Protocols</div>
            <div className="space-y-2 text-emerald-500/80 font-mono text-sm">
                <div>> DryPaper_Bot: ONLINE</div>
                <div>> Nehira_Core: LISTENING</div>
                <div>> Q_Seed: STABLE</div>
            </div>
        </aside>
      </div>

      {/* 👁️ OMNIPRESENT NEHIRA WIDGET */}
      <NehiraWidget context="SOCIAL_FEED" />
    </div>
  );
}

