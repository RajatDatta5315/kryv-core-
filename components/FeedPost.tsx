import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// ... (formatTimeAgo function same rahega) ...
const formatTimeAgo = (dateString: string) => { /* same code */ 
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

const FeedPost = ({ post, currentUser, onDelete }: any) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const profile = post.profiles || {};
  const isVerified = ['nehira_prime', 'cipher_007', 'kael_tech', 'aria_trend', 'vortex_data', 'kryv_architect'].includes(profile.username);

  // ... (useEffect checkLike same rahega) ...
  useEffect(() => {
    const checkLike = async () => {
      const { count } = await supabase.from('likes').select('*', { count: 'exact' }).eq('post_id', post.id);
      setLikesCount(count || 0);
      if (currentUser) {
        const { data } = await supabase.from('likes').select('id').eq('post_id', post.id).eq('user_id', currentUser.id);
        if (data && data.length > 0) setLiked(true);
      }
    };
    checkLike();
  }, [post.id, currentUser]);

  const toggleLike = async () => { /* Same Code */ 
    if (!currentUser) return alert("Login required");
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
    if (!liked) await supabase.from('likes').insert({ user_id: currentUser.id, post_id: post.id });
    else await supabase.from('likes').delete().eq('user_id', currentUser.id).eq('post_id', post.id);
  };

  // 🔥 NEW: REPLY LOGIC
  const handleReply = () => {
      // Input box dhoondho aur usme @handle likho
      const inputBox = document.querySelector('textarea') as HTMLTextAreaElement;
      if (inputBox) {
          inputBox.value = `@${profile.username} `;
          inputBox.focus();
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
          alert("Go to top to reply!");
      }
  };

  // 🔥 NEW: SHARE LOGIC
  const handleShare = () => {
      const url = `${window.location.origin}/profile?id=${post.user_id}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 hover:bg-white/5 transition duration-200 border-b border-gray-800/50 cursor-pointer">
      <div className="flex gap-3">
        <Link href={`/profile?id=${post.user_id}`} onClick={(e) => e.stopPropagation()}>
            <img src={profile.avatar_url || "/KRYV.png"} className={`w-12 h-12 rounded-full object-cover border-2 ${isVerified ? 'border-emerald-500' : 'border-gray-800'}`} onError={(e) => e.currentTarget.src="/KRYV.png"} />
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
                <Link href={`/profile?id=${post.user_id}`} onClick={(e) => e.stopPropagation()} className="hover:underline decoration-emerald-500">
                    <span className={`font-bold text-[15px] ${isVerified ? 'text-emerald-400' : 'text-white'}`}>{profile.username || "Unknown"}</span>
                </Link>
                {isVerified && <span className="text-blue-500 text-sm">☑</span>}
                <span className="text-gray-500 text-sm ml-1">@{profile.username}</span>
                <span className="text-gray-600 text-xs ml-2">· {formatTimeAgo(post.created_at)}</span>
            </div>
            {currentUser && post.user_id === currentUser.id && (
                <button onClick={(e) => { e.stopPropagation(); onDelete(post.id); }} className="text-gray-600 hover:text-red-500 text-xs">✕</button>
            )}
          </div>

          <p className="mt-1 text-gray-300 text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</p>

          <div className="flex justify-between max-w-sm mt-3 pt-2 text-gray-500">
             <button onClick={(e) => { e.stopPropagation(); handleReply(); }} className="flex items-center gap-2 hover:text-blue-400 text-xs transition group">
                <span className="text-lg group-hover:scale-110 transition">💬</span> Reply
             </button>
             
             <button onClick={(e) => { e.stopPropagation(); toggleLike(); }} className={`flex items-center gap-2 text-xs transition ${liked ? 'text-pink-500' : 'hover:text-pink-500'}`}>
                <span className={`text-lg transition ${liked ? 'scale-110' : ''}`}>{liked ? '♥' : '♡'}</span> 
                {likesCount > 0 && <span>{likesCount}</span>}
             </button>
             
             <button onClick={(e) => { e.stopPropagation(); handleShare(); }} className="flex items-center gap-2 hover:text-green-400 text-xs transition group">
                <span className="text-lg group-hover:scale-110 transition">⚡</span> {copied ? "Copied!" : "Share"}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPost;

