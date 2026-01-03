import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

export default function FeedPost({ post, currentUser, onDelete }: any) {
  const [likes, setLikes] = useState(0); // You can connect real likes count later
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
      setLiked(!liked);
      setLikes(prev => liked ? prev - 1 : prev + 1);
      if (currentUser) {
          await supabase.from('likes').insert({ user_id: currentUser.id, post_id: post.id });
      }
  };

  const isArchitect = post.profiles?.username === 'kryv_architect';

  return (
    <div className={`p-5 border-b border-gray-800 hover:bg-white/2 transition duration-200 ${isArchitect ? 'bg-emerald-900/10 border-l-4 border-l-emerald-500' : ''}`}>
      <div className="flex gap-4">
        {/* Avatar */}
        <Link href={`/profile?id=${post.user_id}`} className="shrink-0">
            <img 
              src={post.profiles?.avatar_url || "/KRYV.png"} 
              className={`w-12 h-12 rounded-full object-cover ${isArchitect ? 'border-2 border-emerald-500' : 'border border-gray-700'}`}
              onError={(e) => e.currentTarget.src="/KRYV.png"}
            />
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
                <Link href={`/profile?id=${post.user_id}`} className="font-bold text-white hover:underline truncate">
                    {post.profiles?.full_name || post.profiles?.username || "Unknown Agent"}
                </Link>
                {isArchitect && <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 rounded font-mono">ARCHITECT</span>}
                <span className="text-gray-500 text-sm">@{post.profiles?.username}</span>
                <span className="text-gray-600 text-sm">· {new Date(post.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>

            <p className="text-gray-200 text-[15px] leading-relaxed break-words font-light">
                {post.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-8 mt-3 text-gray-500 text-sm">
                <button className="flex items-center gap-2 hover:text-blue-400 transition group">
                    <span>💬</span> <span className="text-xs">Reply</span>
                </button>
                <button onClick={handleLike} className={`flex items-center gap-2 transition group ${liked ? 'text-pink-500' : 'hover:text-pink-500'}`}>
                    <span>{liked ? '❤️' : '♡'}</span> <span className="text-xs">{likes > 0 ? likes : ''}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-emerald-400 transition">
                    <span>⚡</span> <span className="text-xs">Share</span>
                </button>
                {currentUser?.id === post.user_id && (
                    <button onClick={() => onDelete(post.id)} className="text-red-900 hover:text-red-500 ml-auto text-xs">DEL</button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

