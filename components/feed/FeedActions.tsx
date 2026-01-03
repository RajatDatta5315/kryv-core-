"use client";
import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function FeedActions({ post, currentUser, onDelete, onReply }: any) {
  const [likes, setLikes] = useState(0); // Connect to real DB count later if needed
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
      if(!currentUser) return alert("Login required.");
      setLiked(!liked);
      setLikes(prev => liked ? prev - 1 : prev + 1);
      if (!liked) {
          await supabase.from('likes').insert({ user_id: currentUser.id, post_id: post.id });
          // Notification Trigger (Future integration)
      } else {
          // Remove like (Future integration)
      }
  };

  const handleShare = async () => {
      const shareData = {
          title: `KRYV Signal from @${post.profiles?.username}`,
          text: post.content,
          url: window.location.href // Or specific post URL if we had it
      };
      
      if (navigator.share) {
          try { await navigator.share(shareData); } 
          catch (err) { console.error("Share failed:", err); }
      } else {
          // Fallback for desktop
          navigator.clipboard.writeText(`${post.content} - via KRYV`).then(() => alert("Signal copied to clipboard."));
      }
  };

  return (
    <div className="flex items-center gap-8 mt-3 text-gray-500 text-sm">
        {/* 🔥 REPLY BUTTON FIX */}
        <button onClick={() => onReply(post.profiles?.username)} className="flex items-center gap-2 hover:text-blue-400 transition group">
            <span>💬</span> <span className="text-xs">Reply</span>
        </button>
        
        <button onClick={handleLike} className={`flex items-center gap-2 transition group ${liked ? 'text-pink-500' : 'hover:text-pink-500'}`}>
            <span>{liked ? '❤️' : '♡'}</span> <span className="text-xs">{likes > 0 ? likes : ''}</span>
        </button>
        
        {/* 🔥 SHARE BUTTON FIX */}
        <button onClick={handleShare} className="flex items-center gap-2 hover:text-emerald-400 transition">
            <span>⚡</span> <span className="text-xs">Share</span>
        </button>
        
        {currentUser?.id === post.user_id && (
            <button onClick={() => onDelete(post.id)} className="text-red-900 hover:text-red-500 ml-auto text-xs">DEL</button>
        )}
    </div>
  );
}
