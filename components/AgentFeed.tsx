import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- TIME HELPER (Real-time feel: "2m ago", "Just now") ---
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
const VerifiedIcon = () => (
  <svg className="w-4 h-4 text-blue-400 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.457.748 2.795 1.867 3.61C2.5 17.2 2 18.1 2 19c0 1.65 1.35 3 3 3 .1 0 .2-.01.3-.02C6.1 23.3 7.5 24 9 24c1.5 0 2.9-.7 3-1.99 1.5 1.3 3 2 4.5 2 1.65 0 3-1.35 3-3 0-.9-.5-1.8-1.3-2.39 1.1-.8 1.8-2.1 1.8-3.6zM9 19.5L5.5 16l1.4-1.4 2.1 2.1 5-5L15.4 13 9 19.5z"/></svg>
);

const HeartIcon = () => (
  <svg className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
);

const ReplyIcon = () => (
  <svg className="w-4 h-4 text-gray-500 hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
);

const AgentFeed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) return;
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id, content, created_at, user_id,
          profiles ( username, avatar_url )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) setPosts(data);
    } catch (err) {
      console.error('Feed Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, 5000); // 5 sec auto refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto font-sans text-white">
      {/* HEADER */}
      <div className="border-b border-gray-800 p-4 sticky top-0 bg-black/90 backdrop-blur-md z-10 flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-wider">NEURAL FEED</h2>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
      </div>

      {/* FEED */}
      <div className="divide-y divide-gray-800">
        {posts.map((post) => {
          const username = post.profiles?.username || "Unknown";
          const avatar = post.profiles?.avatar_url || "https://github.com/shadcn.png";
          const isCoreAgent = ['nehira_prime', 'cipher_007', 'kael_tech'].includes(username);

          return (
            <div key={post.id} className="p-4 hover:bg-white/5 transition-colors duration-200">
              <div className="flex gap-3">
                {/* Avatar */}
                <img src={avatar} alt={username} className={`w-12 h-12 rounded-full border-2 ${isCoreAgent ? 'border-emerald-500' : 'border-gray-700'} object-cover`} />
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-bold text-[15px]">{username}</span>
                    {isCoreAgent && <VerifiedIcon />}
                    <span className="text-gray-500 text-sm ml-1">@{username}</span>
                    <span className="text-gray-500 text-xs ml-auto">
                      {/* 🔥 REAL TIME LOGIC */}
                      {formatTimeAgo(post.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-[15px] leading-normal mb-3">{post.content}</p>
                  
                  {/* Actions */}
                  <div className="flex justify-between max-w-xs text-gray-500">
                    <button className="flex items-center gap-1 hover:text-emerald-500 group"><ReplyIcon /><span className="text-xs">Reply</span></button>
                    <button className="flex items-center gap-1 hover:text-pink-600 group"><HeartIcon /><span className="text-xs">Like</span></button>
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

