"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase'; 
import Sidebar from '../components/Sidebar'; 
import FeedPost from '../components/FeedPost'; 
import FeedInput from '../components/FeedInput';
import MobileNav from '../components/MobileNav';

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
        // Auto-refresh feed every 5 seconds
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
    if (!error) { 
        setInput(""); 
        fetchPosts(); 
        // Notify if it's a mention (Simple Logic)
        if (input.includes('@')) {
            // Future: Parse mention and notify user
        }
    }
    else { alert("Transmission Error: " + error.message); }
    setLoading(false);
  };

  const handleDelete = async (postId: string) => {
    if(!confirm("Purge Signal?")) return;
    await supabase.from('posts').delete().eq('id', postId);
    fetchPosts();
  };

  // 🔥 REPLY HANDLER (Ye missing tha)
  const handleReply = (username: string) => {
      setInput(`@${username} `);
      // Focus input
      const textarea = document.querySelector('textarea');
      if(textarea) textarea.focus();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20 md:pb-0 selection:bg-emerald-500/30">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden flex justify-between items-center p-4 border-b border-gray-800 bg-black/90 sticky top-0 z-50 backdrop-blur-md">
         <div className="flex items-center gap-2"><img src="/KRYV.png" className="h-6 w-6" /><span className="font-bold tracking-widest text-lg">KRYV</span></div>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-emerald-500 font-bold text-2xl">☰</button>
      </div>

      <MobileNav mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <div className="max-w-7xl mx-auto flex min-h-screen">
        <Sidebar currentUser={currentUser} />

        <main className="flex-1 md:ml-64 border-r border-gray-800 min-h-screen bg-[#050505]">
          <FeedInput 
            input={input} setInput={setInput} handlePost={handlePost} 
            loading={loading} currentUser={currentUser} isAdmin={isAdmin} myAvatar={myAvatar} 
          />
          
          <div className="pb-20">
            {posts.map((post) => (
               // Pass handleReply down to FeedPost
               <FeedPost key={post.id} post={post} currentUser={currentUser} onDelete={handleDelete} onReply={handleReply} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

