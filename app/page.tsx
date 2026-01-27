"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase'; 
import Sidebar from '../components/Sidebar'; 
import FeedPost from '../components/FeedPost'; 
import FeedInput from '../components/FeedInput';
import MobileNav from '../components/MobileNav';
import CyberCore from '../components/CyberCore';

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 
  const [isAdmin, setIsAdmin] = useState(false);
  const [myAvatar, setMyAvatar] = useState("https://github.com/shadcn.png");

  const ADMIN_EMAIL = "rajatdatta90000@gmail.com"; 

  useEffect(() => {
    async function init() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setCurrentUser(user);
            const isBoss = user.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
            setIsAdmin(isBoss);
            const { data: profile } = await supabase.from('profiles').select('avatar_url').eq('id', user.id).single();
            if (profile?.avatar_url) setMyAvatar(profile.avatar_url);
        }
        fetchPosts();
        const interval = setInterval(fetchPosts, 5000);
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
    const { error } = await supabase.from('posts').insert([{ content: input, user_id: currentUser.id }]);
    if (!error) { setInput(""); fetchPosts(); }
    else { alert("Transmission Error: " + error.message); }
    setLoading(false);
  };

  const handleDelete = async (postId: string) => {
    if(!confirm("Purge Signal?")) return;
    await supabase.from('posts').delete().eq('id', postId);
    fetchPosts();
  };

  const handleReply = (username: string) => {
      setInput(`@${username} `);
      const textarea = document.querySelector('textarea');
      if(textarea) textarea.focus();
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans pb-20 md:pb-0 selection:bg-[#00f2ff]/30">
      <div className="universe-bg" /> {/* Global CSS background */}
      
      {/* MOBILE HEADER */}
      <div className="md:hidden flex justify-between items-center p-4 border-b border-[#7000ff]/20 bg-black/90 sticky top-0 z-50 backdrop-blur-md">
         <div className="flex items-center gap-2"><img src="/KRYV.png" className="h-6 w-6 drop-shadow-[0_0_5px_#00f2ff]" /><span className="font-black tracking-widest text-lg italic text-white">KRYV</span></div>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[#00f2ff] font-bold text-2xl">☰</button>
      </div>

      <MobileNav mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <div className="max-w-7xl mx-auto flex min-h-screen relative">
        <Sidebar currentUser={currentUser} />

        <main className="flex-1 md:ml-64 border-r border-[#7000ff]/10 min-h-screen bg-transparent">
          
          {/* 🚀 UPDATED JARVIS HUD (No More Green) */}
          <div className="border-b border-[#7000ff]/20 bg-gradient-to-b from-[#00f2ff]/5 to-transparent flex flex-col items-center justify-center py-10 overflow-hidden relative">
            <div className="absolute inset-0 bg-[#7000ff]/5 blur-[120px] rounded-full"></div>
            <div className="z-10 scale-125 md:scale-150">
              <CyberCore />
            </div>
            <div className="mt-[-40px] text-center z-10">
              <div className="flex items-center gap-2 justify-center mb-1">
                <span className="w-2 h-[2px] bg-[#00f2ff] animate-pulse"></span>
                <h2 className="text-[10px] uppercase tracking-[0.6em] text-[#00f2ff] font-black drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]">System_Online</h2>
                <span className="w-2 h-[2px] bg-[#00f2ff] animate-pulse"></span>
              </div>
              <p className="text-[9px] text-purple-400/60 font-mono uppercase tracking-[0.2em]">KRYV_Sovereign_Node_01</p>
            </div>
          </div>

          <div className="glass-panel m-4 mt-6">
            <FeedInput 
                input={input} setInput={setInput} handlePost={handlePost} 
                loading={loading} currentUser={currentUser} isAdmin={isAdmin} myAvatar={myAvatar} 
            />
          </div>
          
          <div className="pb-20 px-4">
            <div className="glass-panel border-t-0">
                {posts.map((post) => (
                <FeedPost key={post.id} post={post} currentUser={currentUser} onDelete={handleDelete} onReply={handleReply} />
                ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
