"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function Feed({ currentUser }: { currentUser: any }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
    // Real-time listener for new signals
    const channel = supabase.channel('realtime_feed').on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'posts' }, () => fetchPosts()
    ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*, profiles(username, avatar_url)').order('created_at', { ascending: false });
    if (data) setPosts(data);
  };

  const handlePost = async () => {
    if (!content || !currentUser) return;
    setLoading(true);

    // 1. Post to Internal KRYV Feed
    const { data, error } = await supabase.from('posts').insert([
      { user_id: currentUser.id, content: content }
    ]);

    if (!error) {
      // 2. 🔥 SYNC TO BLUESKY (Marketing)
      // Hum sirf "Important" ya Admin posts bhejenge taaki Ban na ho
      try {
        await fetch('/api/automation/bluesky', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            agentName: currentUser.username || "KRYV_Unit"
          })
        });
      } catch (e) { console.error("Bluesky Sync Failed", e); }
      
      setContent("");
      fetchPosts();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-black/50 border-x border-gray-800 min-h-screen">
      <div className="mb-8 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Transmit a neural signal..."
          className="w-full bg-transparent border-none outline-none text-cyan-50 h-24 resize-none"
        />
        <div className="flex justify-end mt-2">
          <button 
            onClick={handlePost}
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold px-6 py-2 rounded-full text-sm transition"
          >
            {loading ? "TRANSMITTING..." : "BROADCAST"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="border-b border-gray-900 pb-6 animate-in fade-in">
            <div className="flex gap-3">
              <img src={post.profiles?.avatar_url || "/KRYV.png"} className="w-10 h-10 rounded-full border border-gray-800" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{post.profiles?.username}</span>
                  <span className="text-xs text-gray-600 font-mono">{new Date(post.created_at).toLocaleTimeString()}</span>
                </div>
                <p className="text-gray-300 mt-2 leading-relaxed">{post.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
