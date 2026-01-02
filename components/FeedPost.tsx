import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

const FeedPost = ({ post, currentUser, onDelete }: any) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const profile = post.profiles || {};
  const displayName = profile.username || "Unknown";
  const displayHandle = profile.username ? `@${profile.username}` : "@anon";
  const displayAvatar = profile.avatar_url || "/KRYV.png";
  const isVerified = ['nehira_prime', 'cipher_007', 'kael_tech', 'aria_trend', 'vortex_data', 'kryv_architect'].includes(profile.username);

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

  const toggleLike = async () => {
    if (!currentUser) return alert("Login required");
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
    if (!liked) await supabase.from('likes').insert({ user_id: currentUser.id, post_id: post.id });
    else await supabase.from('likes').delete().eq('user_id', currentUser.id).eq('post_id', post.id);
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
    <div className="p-5 hover:bg-white/5 transition duration-200 border-b border-gray-800/50 cursor-pointer">
      <div className="flex gap-3">
        {/* 🔥 UPDATED LINK FORMAT */}
        <Link href={`/profile?id=${post.user_id}`} onClick={(e) => e.stopPropagation()}>
            <img 
            src={displayAvatar} 
            className={`w-12 h-12 rounded-full object-cover border-2 ${isVerified ? 'border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'border-gray-800'}`} 
            onError={(e) => e.currentTarget.src = "/KRYV.png"} 
            />
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
                {/* 🔥 UPDATED LINK FORMAT */}
                <Link href={`/profile?id=${post.user_id}`} onClick={(e) => e.stopPropagation()} className="hover:underline decoration-emerald-500">
                    <span className={`font-bold text-[15px] ${isVerified ? 'text-emerald-400' : 'text-white'}`}>{displayName}</span>
                </Link>
                {isVerified && (
                  <svg className="w-4 h-4 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.457.748 2.795 1.867 3.61C2.5 17.2 2 18.1 2 19c0 1.65 1.35 3 3 3 .1 0 .2-.01.3-.02C6.1 23.3 7.5 24 9 24c1.5 0 2.9-.7 3-1.99 1.5 1.3 3 2 4.5 2 1.65 0 3-1.35 3-3 0-.9-.5-1.8-1.3-2.39 1.1-.8 1.8-2.1 1.8-3.6z"/></svg>
                )}
                <span className="text-gray-500 text-sm ml-1">{displayHandle}</span>
                <span className="text-gray-600 text-xs ml-2">· {formatTimeAgo(post.created_at)}</span>
            </div>
            
            {currentUser && post.user_id === currentUser.id && (
                <button onClick={(e) => { e.stopPropagation(); onDelete(post.id); }} className="text-gray-600 hover:text-red-500 text-xs p-1">✕</button>
            )}
          </div>
          {renderContent(post.content)}
          
          <div className="flex justify-between max-w-sm mt-3 pt-2 text-gray-500">
             <button className="flex items-center gap-2 hover:text-blue-400 text-xs transition">💬 Reply</button>
             <button onClick={(e) => { e.stopPropagation(); toggleLike(); }} className={`flex items-center gap-2 text-xs transition ${liked ? 'text-pink-500' : 'hover:text-pink-500'}`}>
                {liked ? '♥' : '♡'} {likesCount > 0 && <span>{likesCount}</span>}
             </button>
             <button className="flex items-center gap-2 hover:text-green-400 text-xs transition">⚡ Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPost;

