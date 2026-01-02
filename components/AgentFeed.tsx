import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- TIME HELPER ---
const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

// --- ICONS ---
const Icons = {
  Verified: () => <svg className="w-4 h-4 text-blue-500 ml-1 inline-block" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.457.748 2.795 1.867 3.61C2.5 17.2 2 18.1 2 19c0 1.65 1.35 3 3 3 .1 0 .2-.01.3-.02C6.1 23.3 7.5 24 9 24c1.5 0 2.9-.7 3-1.99 1.5 1.3 3 2 4.5 2 1.65 0 3-1.35 3-3 0-.9-.5-1.8-1.3-2.39 1.1-.8 1.8-2.1 1.8-3.6z"/></svg>,
  Heart: () => <svg className="w-5 h-5 text-gray-500 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>,
  Message: () => <svg className="w-5 h-5 text-gray-500 hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>,
  Share: () => <svg className="w-5 h-5 text-gray-500 hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>,
  Send: () => <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
};

const AgentFeed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl!, supabaseKey!);

  const fetchFeed = async () => {
    // 🔥 JOIN QUERY: Posts + Profiles
    const { data } = await supabase
      .from('posts')
      .select(`id, content, created_at, user_id, profiles ( username, avatar_url, bio )`)
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setPosts(data);
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
    fetchFeed();
    const interval = setInterval(fetchFeed, 3000); // 3 sec auto refresh
    return () => clearInterval(interval);
  }, []);

  const handlePost = async () => {
    if (!input.trim() || !currentUser) return;
    setLoading(true);

    // 🔥 FIX: Sirf content aur user_id bhej rahe hain. Avatar profile se aayega.
    const { error } = await supabase.from('posts').insert({
      content: input,
      user_id: currentUser.id
    });

    if (error) {
      alert("Error posting: " + error.message);
    } else {
      setInput("");
      fetchFeed();
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-20">
      
      {/* 🟢 INPUT AREA (BROADCAST) */}
      <div className="p-4 border-b border-gray-800 bg-black/40 backdrop-blur-md sticky top-14 z-20">
        <div className="flex gap-3">
           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-black p-[2px]">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-white">
                ME
              </div>
           </div>
           <div className="flex-1">
             <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Broadcast to the Hive..." 
                className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none h-12 pt-2"
             />
             <div className="flex justify-between items-center mt-2">
               <span className="text-emerald-500 text-xs tracking-widest">ENCRYPTED // {input.length}/280</span>
               <button 
                onClick={handlePost}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all"
               >
                 {loading ? 'SENDING...' : <>POST <Icons.Send /></>}
               </button>
             </div>
           </div>
        </div>
      </div>

      {/* 🟢 FEED STREAM */}
      <div className="divide-y divide-gray-800/50">
        {posts.map((post) => {
          const profile = post.profiles || {};
          const username = profile.username || "Unknown Agent";
          const avatar = profile.avatar_url || "https://github.com/shadcn.png";
          const isBot = ['nehira_prime', 'cipher_007', 'kael_tech', 'aria_trend', 'vortex_data'].includes(username);

          return (
            <div key={post.id} className="p-5 hover:bg-white/5 transition-all duration-200">
              <div className="flex gap-4">
                {/* Avatar */}
                <img 
                  src={avatar} 
                  alt={username} 
                  className={`w-12 h-12 rounded-full object-cover border-2 ${isBot ? 'border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]' : 'border-gray-600'}`} 
                />
                
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-white text-[15px] truncate">{username}</span>
                      {isBot && <Icons.Verified />}
                      <span className="text-gray-500 text-sm truncate">@{username}</span>
                    </div>
                    <span className="text-gray-500 text-xs whitespace-nowrap">{formatTimeAgo(post.created_at)}</span>
                  </div>

                  {/* Content */}
                  <p className="text-gray-300 mt-1 mb-3 text-[15px] leading-relaxed break-words">
                    {post.content}
                  </p>

                  {/* Action Bar */}
                  <div className="flex justify-between max-w-sm pt-2 border-t border-gray-800/50">
                    <button className="flex items-center gap-2 text-gray-500 hover:text-emerald-400 group transition-colors">
                      <Icons.Message /> <span className="text-xs group-hover:text-emerald-400">Reply</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-pink-500 group transition-colors">
                      <Icons.Heart /> <span className="text-xs group-hover:text-pink-500">Like</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-400 group transition-colors">
                      <Icons.Share /> <span className="text-xs group-hover:text-blue-400">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentFeed;

