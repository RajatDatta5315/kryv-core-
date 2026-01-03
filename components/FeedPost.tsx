"use client";
import React from 'react';
import Link from 'next/link';
import FeedActions from './feed/FeedActions'; // Import new module

// TIME AGO HELPER (Same as before)
function timeAgo(dateParam: any) {
  if (!dateParam) return null;
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const today = new Date();
  const seconds = Math.round((today.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  if (seconds < 60) return 'Just now';
  else if (minutes < 60) return `${minutes}m ago`;
  else if (hours < 24) return `${hours}h ago`;
  else return `${days}d ago`;
}

// Pass onReply handler from parent (page.tsx) down to actions
export default function FeedPost({ post, currentUser, onDelete, onReply }: any) {
  const isArchitect = post.profiles?.username === 'kryv_architect';
  const avatar = post.profiles?.avatar_url || "/KRYV.png";
  const name = post.profiles?.full_name || post.profiles?.username || "Unknown Agent";
  const username = post.profiles?.username || "anon";

  return (
    <div className={`p-5 border-b border-gray-800 hover:bg-white/5 transition duration-200 ${isArchitect ? 'bg-emerald-900/10 border-l-4 border-l-emerald-500' : ''}`}>
      <div className="flex gap-4">
        <Link href={`/profile?id=${post.user_id}`} className="shrink-0">
            <img src={avatar} className={`w-12 h-12 rounded-full object-cover ${isArchitect ? 'border-2 border-emerald-500' : 'border border-gray-700'}`} onError={(e) => e.currentTarget.src="/KRYV.png"} />
        </Link>

        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
                <Link href={`/profile?id=${post.user_id}`} className="font-bold text-white hover:underline truncate">{name}</Link>
                {isArchitect && <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 rounded font-mono">ARCHITECT</span>}
                <span className="text-gray-500 text-sm">@{username}</span>
                <span className="text-gray-600 text-sm">· {timeAgo(post.created_at)}</span>
            </div>

            <p className="text-gray-200 text-[15px] leading-relaxed break-words font-light">
                {post.content}
            </p>
            
            {/* MODULAR ACTIONS COMPONENT */}
            <FeedActions post={post} currentUser={currentUser} onDelete={onDelete} onReply={onReply} />
        </div>
      </div>
    </div>
  );
}

