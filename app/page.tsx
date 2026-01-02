"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase'; 
import Link from 'next/link';
import Sidebar from '../components/Sidebar'; 
import FeedPost from '../components/FeedPost'; 

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 
  const [isAdmin, setIsAdmin] = useState(false); // 🔥 NEW CHECK

  useEffect(() => {
    async function init() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setCurrentUser(user);
            // 🔥 CHECK IF ADMIN
            const adminEmail = "rajatdatta90000@gmail.com"; // Tera Email
            setIsAdmin(user.email === adminEmail);
        }
        fetchPosts();
        const interval = setInterval(fetchPosts, 3000);
        return () => clearInterval(interval);
    }
    init();
  }, []);

  const fetchPosts = async () => {
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

    // 🔥 AB HUM SIRF USER_ID BHEJTE HAIN, PROFILE SE DATA AAYEGA
    const { error } = await supabase.from('posts').insert([{ 
        content: input, 
        user_id: currentUser.id 
    }]);

    if (!error) { setInput(""); fetchPosts(); }
    setLoading(false);
  };

  const handleDelete = async (postId: string) => {
    if(!confirm("Terminate Signal?")) return;
    await supabase.from('posts').delete().eq('id', postId);
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20 md:pb-0">
      
      {/* MOBILE HEADER */}
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

        <main className="flex-1 md:ml-64 border-r border-gray-800 min-h-screen bg-black">
          
          {/* 🔥 SECURE INPUT AREA */}
          <div className="p-4 border-b border-gray-800 bg-black">
            {currentUser ? (
                <div className="flex gap-4">
                  {/* ADMIN KO LOGO DIKHEGA, BAAKIYON KO PROFILE PIC */}
                  <img 
                     src={isAdmin ? "/KRYV.png" : (currentUser.user_metadata?.avatar_url || "https://github.com/shadcn.png")} 
                     className="w-12 h-12 rounded-full object-cover border border-gray-700" 
                     onError={(e) => e.currentTarget.src="/KRYV.png"}
                  />
                  <div className="flex-1">
                     <textarea 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        placeholder={isAdmin ? "Broadcast as THE ARCHITECT..." : "Write a signal..."} 
                        className="w-full bg-transparent text-white placeholder-gray-600 outline-none text-lg resize-none h-14 pt-2" 
                     />
                     <div className="flex justify-end mt-2">
                        <button onClick={handlePost} disabled={loading} className={`text-white px-6 py-1.5 rounded-full font-bold text-sm transition-all disabled:opacity-50 ${isAdmin ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-gray-700 hover:bg-gray-600'}`}>
                            {loading ? "SENDING..." : isAdmin ? "BROADCAST" : "POST"}
                        </button>
                     </div>
                  </div>
                </div>
            ) : (
                <div className="flex items-center justify-between bg-gray-900/40 p-4 rounded-xl border border-gray-800 backdrop-blur-sm">
                    <span className="text-gray-400 text-sm">Log in to join the Neural Network.</span>
                    <Link href="/login" className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition">LOGIN</Link>
                </div>
            )}
          </div>
          
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

