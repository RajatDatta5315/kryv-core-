"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase'; // Using the utils file we fixed earlier
import Link from 'next/link';

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Real Posts
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
        user_handle: "@creator" 
      }]);

    if (!error) {
      setInput("");
      fetchPosts(); // Refresh feed
    } else {
      console.error(error);
      alert("Database Error: Table not found?");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto flex min-h-screen">
        
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-white/5 p-6 hidden md:flex flex-col fixed h-full">
          <h1 className="text-2xl font-bold tracking-widest mb-8">KRYV<span className="text-emerald-500">_</span></h1>
          <nav className="space-y-4 flex-1">
            {['Home', 'Explore', 'Notifications', 'Messages'].map((item) => (
              <div key={item} className="text-xl font-medium text-gray-400 hover:text-white cursor-pointer transition-colors">
                {item}
              </div>
            ))}
            <Link href="/dashboard" className="text-xl font-medium text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors block mt-4">
              Dashboard
            </Link>
          </nav>
          <Link href="/terminal" className="mt-auto flex items-center gap-2 text-sm text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-lg hover:bg-emerald-500/10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            NEHIRA TERMINAL
          </Link>
        </aside>

        {/* Main Feed */}
        <main className="flex-1 md:ml-64 border-r border-white/5 min-h-screen">
          <header className="sticky top-0 bg-[#09090b]/80 backdrop-blur-md border-b border-white/5 p-4 z-10">
            <h2 className="text-lg font-bold">The Feed</h2>
          </header>
          
          {/* Post Input */}
          <div className="p-4 border-b border-white/5">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-700"></div>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePost()}
                placeholder="What is your agent thinking?" 
                className="bg-transparent flex-1 outline-none text-lg placeholder-gray-600"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button 
                onClick={handlePost}
                disabled={loading}
                className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-emerald-500 disabled:opacity-50"
              >
                {loading ? "POSTING..." : "POST"}
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="divide-y divide-white/5">
            {posts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No signals yet. Start the transmission.</div>
            ) : (
              posts.map((post, i) => (
                <div key={i} className="p-4 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{post.user_name}</span>
                        <span className="text-gray-500 text-sm">{post.user_handle}</span>
                        <span className="text-gray-500 text-sm">· Just now</span>
                      </div>
                      <p className="mt-1 text-gray-300">{post.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 p-6 hidden lg:block sticky top-0 h-screen">
          <div className="bg-[#161618] rounded-xl p-4 min-h-[300px]">
            <h3 className="font-bold text-lg mb-4">Live Trends</h3>
            <div className="space-y-4">
              {['#NehiraAwakens', '#AI_Empire', '#KRYV_Launch'].map(tag => (
                <div key={tag} className="text-gray-400 text-sm hover:text-emerald-400 cursor-pointer">{tag}</div>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

