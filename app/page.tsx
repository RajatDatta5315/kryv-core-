"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase'; 
import Link from 'next/link';
import Sidebar from '../components/Sidebar'; // New Component
import FeedPost from '../components/FeedPost'; // New Component

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 

  useEffect(() => {
    async function init() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setCurrentUser(user);
        fetchPosts();
        const interval = setInterval(fetchPosts, 3000);
        return () => clearInterval(interval);
    }
    init();
  }, []);

  const fetchPosts = async () => {
    // Fetch Posts + Profiles
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(*)') 
      .order('created_at', { ascending: false })
      .limit(30);
    if (data) setPosts(data);
  };

  const handlePost = async () => {
    if (!input.trim() || !currentUser) return;
    setLoading(true);

    // 🔥 FIX: Error isliye tha kyuki hum 'avatar_url' insert kar rahe the jo posts table me nahi hai.
    // Ab hum sirf content bhejenge. Avatar Profile se aayega.
    const { error } = await supabase.from('posts').insert([{ 
        content: input, 
        user_id: currentUser.id
    }]);

    if (!error) { setInput(""); fetchPosts(); }
    else { alert("Posting Error: " + error.message); }
    setLoading(false);
  };

  const handleDelete = async (postId: string) => {
    if(!confirm("Terminate Signal?")) return;
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (!error) fetchPosts();
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20 md:pb-0">
      
      {/* 📱 MOBILE HEADER */}
      <div className="md:hidden flex justify-between items-center p-3 border-b border-gray-800 bg-black/90 sticky top-0 z-50 backdrop-blur-md">
         <div className="flex items-center gap-2"><img src="/KRYV.png" className="h-6 w-6" /><span className="font-bold tracking-widest">KRYV</span></div>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-emerald-500 font-bold text-xl">☰</button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-black/95 z-40 p-6 flex flex-col gap-6 text-center">
            <Link href="/" className="text-2xl text-emerald-400 font-bold">FEED</Link>
            <Link href="/studio" className="text-2xl text-gray-400">STUDIO</Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex min-h-screen">
        <Sidebar currentUser={currentUser} />

        {/* MAIN FEED */}
        <main className="flex-1 md:ml-64 border-r border-gray-800 min-h-screen bg-black">
          {/* INPUT AREA */}
          <div className="p-4 border-b border-gray-800 sticky top-14 md:top-0 bg-black/80 backdrop-blur-md z-30">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-black p-[1px]">
                 <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs">
                    ME
                 </div>
              </div>
              <div className="flex-1">
                 <textarea 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handlePost())}
                    placeholder="Broadcast signal..." 
                    className="w-full bg-transparent text-white placeholder-gray-600 outline-none text-lg resize-none h-12 pt-1" 
                 />
                 <div className="flex justify-end mt-2">
                    <button onClick={handlePost} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-1.5 rounded-full font-bold text-sm transition-all disabled:opacity-50">
                        {loading ? "..." : "POST"}
                    </button>
                 </div>
              </div>
            </div>
          </div>
          
          {/* POSTS STREAM */}
          <div className="pb-20">
            {posts.map((post) => (
               <FeedPost key={post.id} post={post} currentUser={currentUser} onDelete={handleDelete} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

