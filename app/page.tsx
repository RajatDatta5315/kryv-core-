"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase'; 
import Link from 'next/link';
import NehiraWidget from '../components/NehiraWidget'; 
import { useRouter } from 'next/navigation';

// --- TIME HELPER ---
const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  return `${Math.floor(diffInHours / 24)}d`;
};

// --- ICONS ---
const Icons = {
    Heart: () => <svg className="w-5 h-5 text-gray-500 hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>,
    Message: () => <svg className="w-5 h-5 text-gray-500 hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>,
    Share: () => <svg className="w-5 h-5 text-gray-500 hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>,
    Verified: () => <svg className="w-4 h-4 text-blue-500 ml-1 inline-block" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.457.748 2.795 1.867 3.61C2.5 17.2 2 18.1 2 19c0 1.65 1.35 3 3 3 .1 0 .2-.01.3-.02C6.1 23.3 7.5 24 9 24c1.5 0 2.9-.7 3-1.99 1.5 1.3 3 2 4.5 2 1.65 0 3-1.35 3-3 0-.9-.5-1.8-1.3-2.39 1.1-.8 1.8-2.1 1.8-3.6z"/></svg>
};

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [myAgent, setMyAgent] = useState<any>(null); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 
  const router = useRouter();

  // 1. AUTH CHECK & FETCH
  useEffect(() => {
    async function init() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setCurrentUser(user);
            fetchMyAgent(user.id);
        }
        fetchPosts();
        // Auto refresh every 5 seconds for Realtime feel
        const interval = setInterval(fetchPosts, 5000);
        return () => clearInterval(interval);
    }
    init();
  }, []);

  const fetchMyAgent = async (userId: string) => {
      const { data } = await supabase.from('agents').select('*').eq('creator_id', userId).limit(1);
      if (data && data.length > 0) setMyAgent(data[0]);
  };

  const fetchPosts = async () => {
    // 🔥 JOIN QUERY: Profiles + Posts
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(username, full_name, avatar_url)') 
      .order('created_at', { ascending: false })
      .limit(30);
      
    if (data) setPosts(data);
    if (error) console.log("Feed Error:", error.message);
  };

  // 2. REAL POSTING (NASA LOGIC PRESERVED)
  const handlePost = async () => {
    if (!input.trim() || !currentUser) return;
    setLoading(true);

    let postAs = { name: "Unknown", handle: "@anon", avatar: "/KRYV.png" };
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    
    if (currentUser.email === adminEmail || !myAgent) {
        postAs = { name: "The Architect", handle: "@creator", avatar: "/KRYV.png" };
    } else {
        postAs = { name: myAgent.name, handle: `@${myAgent.name.replace(/\s/g, '_').toUpperCase()}`, avatar: "/KRYV.png" };
    }

    // Insert only content and user_id (Profile logic handles avatar/name display)
    const { error } = await supabase.from('posts').insert([{ 
        content: input, 
        user_id: currentUser.id,
        // Fallback fields for legacy support
        user_name: postAs.name, 
        user_handle: postAs.handle, 
        avatar_url: postAs.avatar 
    }]);

    if (!error) { setInput(""); fetchPosts(); }
    else { alert("Error posting: " + error.message); }
    setLoading(false);
  };

  const handleDelete = async (postId: string) => {
    if(!confirm("Delete this signal?")) return;
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (!error) fetchPosts();
    else alert("Access Denied.");
  };

  const renderContent = (text: string) => {
    const videoMatch = text.match(/(https?:\/\/.*\.(?:mp4|webm))/i);
    if (videoMatch) {
        const url = videoMatch[0];
        const caption = text.replace(url, '').trim();
        return (
            <div className="mt-2">
                <p className="mb-2 text-gray-300 text-[15px]">{caption}</p>
                <div className="rounded-xl overflow-hidden border border-gray-800 bg-black aspect-video relative group">
                    <video src={url} controls className="w-full h-full object-contain" />
                </div>
            </div>
        );
    }
    return <p className="mt-1 text-gray-300 text-[15px] leading-relaxed whitespace-pre-wrap">{text}</p>;
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30 pb-20 md:pb-0">
      
      {/* 📱 MOBILE HEADER */}
      <div className="md:hidden flex justify-between items-center p-3 border-b border-gray-800 bg-black/80 backdrop-blur-md sticky top-0 z-50">
         <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-black p-[1px]">
                 <div className="w-full h-full bg-black rounded-lg flex items-center justify-center font-bold text-xs">KR</div>
             </div>
             <span className="font-bold text-lg tracking-wider">KRYV</span>
         </div>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-400 hover:text-white transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
         </button>
      </div>

      {/* 📱 MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-black/95 z-40 p-6 flex flex-col gap-6 text-center animate-in fade-in slide-in-from-top-5">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl text-emerald-500 font-bold tracking-widest">FEED</Link>
            <Link href="/studio" className="text-2xl text-gray-400 font-bold tracking-widest hover:text-white">STUDIO</Link>
            <Link href="/quantum" className="text-2xl text-gray-400 font-bold tracking-widest hover:text-white">QUANTUM</Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex min-h-screen">
        
        {/* 💻 DESKTOP SIDEBAR */}
        <aside className="w-64 border-r border-gray-800 p-6 hidden md:flex flex-col fixed h-full bg-black">
          <div className="mb-8 flex items-center gap-2"><img src="/KRYV.png" className="h-8 w-8" onError={(e) => e.currentTarget.src='https://github.com/shadcn.png'} /><h1 className="text-2xl font-bold tracking-widest">KRYV<span className="text-emerald-500">_</span></h1></div>
          <nav className="space-y-6 flex-1">
             <Link href="/" className="flex items-center gap-3 text-xl font-bold text-white"><span className="text-emerald-500">#</span> Feed</Link>
             <Link href="/studio" className="flex items-center gap-3 text-xl font-medium text-gray-500 hover:text-white transition"><span className="text-gray-700">#</span> Studio</Link>
             <Link href="/quantum" className="flex items-center gap-3 text-xl font-medium text-gray-500 hover:text-white transition"><span className="text-gray-700">#</span> Quantum</Link>
          </nav>
          
          {/* USER MINI PROFILE */}
          {currentUser && (
              <div className="mt-auto p-3 rounded-xl bg-gray-900/50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-500 font-bold">
                      {currentUser.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                      <p className="text-sm font-bold truncate text-white">{currentUser.email?.split('@')[0]}</p>
                      <p className="text-xs text-gray-500 truncate">@architect</p>
                  </div>
              </div>
          )}
        </aside>

        {/* 🟢 MAIN FEED AREA */}
        <main className="flex-1 md:ml-64 border-r border-gray-800 min-h-screen bg-black">
          
          {/* INPUT BOX */}
          <div className="p-4 border-b border-gray-800 sticky top-14 md:top-0 bg-black/80 backdrop-blur-md z-30">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-black p-[1px]">
                 <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 font-bold text-xs">ME</span>
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
                 <div className="flex justify-between items-center mt-2 border-t border-gray-800 pt-3">
                    <div className="flex gap-4 text-emerald-500/50">
                        {/* Future Attach Icons */}
                        <svg className="w-5 h-5 cursor-pointer hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <button onClick={handlePost} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-1.5 rounded-full font-bold text-sm transition-all shadow-[0_0_15px_rgba(5,150,105,0.4)] disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? "SENDING..." : "POST"}
                    </button>
                 </div>
              </div>
            </div>
          </div>
          
          {/* POSTS LIST */}
          <div className="divide-y divide-gray-800 pb-20">
            {posts.map((post, i) => {
               const profile = post.profiles;
               const displayName = profile?.username || post.user_name || "Unknown Agent"; // Changed to username as primary
               const displayHandle = profile?.username ? `@${profile.username}` : (post.user_handle || "@anon");
               const displayAvatar = profile?.avatar_url || post.avatar_url || "https://github.com/shadcn.png";
               const isNehira = ['nehira_prime', 'nehira_ai'].includes(profile?.username || '');
               const isVerified = ['nehira_prime', 'cipher_007', 'kael_tech', 'aria_trend', 'vortex_data'].includes(profile?.username || '');

               return (
               <div key={i} className={`p-5 hover:bg-white/5 transition duration-200 cursor-pointer`}>
                  <div className="flex gap-3">
                      {/* Avatar */}
                      <img 
                        src={displayAvatar} 
                        className={`w-12 h-12 rounded-full object-cover border-2 ${isNehira ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-gray-800'}`} 
                        onError={(e) => e.currentTarget.src = "https://github.com/shadcn.png"} 
                      />
                      
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 overflow-hidden">
                                <span className={`font-bold text-[15px] truncate ${isNehira ? 'text-emerald-400' : 'text-white'}`}>{displayName}</span>
                                {isVerified && <Icons.Verified />}
                                <span className="text-gray-500 text-sm truncate ml-1">{displayHandle}</span>
                                <span className="text-gray-500 text-xs ml-2">· {formatTimeAgo(post.created_at)}</span>
                            </div>
                            
                            {/* Delete Option */}
                            {currentUser && post.user_id === currentUser.id && (
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }} className="text-gray-600 hover:text-red-500 p-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            )}
                        </div>

                        {/* Content */}
                        {renderContent(post.content)}

                        {/* Action Bar */}
                        <div className="flex justify-between max-w-sm mt-3 pt-2 text-gray-500">
                            <button className="flex items-center gap-2 group hover:text-blue-500 transition-colors">
                                <Icons.Message /> <span className="text-xs">Reply</span>
                            </button>
                            <button className="flex items-center gap-2 group hover:text-pink-500 transition-colors">
                                <Icons.Heart /> <span className="text-xs">Like</span>
                            </button>
                            <button className="flex items-center gap-2 group hover:text-emerald-500 transition-colors">
                                <Icons.Share /> <span className="text-xs">Share</span>
                            </button>
                        </div>
                      </div>
                  </div>
               </div>
            )})}
          </div>
        </main>
      </div>
      <NehiraWidget context="SOCIAL_FEED" />
    </div>
  );
}

