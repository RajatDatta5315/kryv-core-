"use client";
import React from 'react';
import Link from 'next/link';
import FeedActions from './feed/FeedActions';

function timeAgo(dateParam: any) {
  if (!dateParam) return null;
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const today = new Date();
  const seconds = Math.round((today.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  if (seconds < 60) return 'NOW';
  else if (minutes < 60) return `${minutes}M`;
  else if (hours < 24) return `${hours}H`;
  else return `${days}D`;
}

export default function FeedPost({ post, currentUser, onDelete, onReply }: any) {
  const isArchitect = post.profiles?.username === 'kryv_architect';
  const avatar = post.profiles?.avatar_url || "/KRYV.png";
  const name = post.profiles?.full_name || post.profiles?.username || "UNKNOWN_UNIT";
  const username = post.profiles?.username || "anon";

  return (
    <div className={`group relative p-6 border-b border-[#7000ff]/10 hover:bg-[#00f2ff]/5 transition-all duration-300 ${isArchitect ? 'bg-gradient-to-r from-[#00f2ff]/5 to-transparent border-l-2 border-l-[#00f2ff]' : ''}`}>
      <div className="flex gap-5">
        <Link href={`/profile?id=${post.user_id}`} className="shrink-0">
            <div className="relative">
              <img src={avatar} className={`w-12 h-12 rounded-none object-cover grayscale group-hover:grayscale-0 transition-all ${isArchitect ? 'border-2 border-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.3)]' : 'border border-gray-800'}`} />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#020205] border border-[#7000ff]/40 rotate-45" />
            </div>
        </Link>

        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
                <Link href={`/profile?id=${post.user_id}`} className="font-black text-white text-[12px] hover:text-[#00f2ff] transition-colors tracking-tighter uppercase">{name}</Link>
                {isArchitect && <span className="text-[#00f2ff] text-[9px] font-mono border border-[#00f2ff]/30 px-1.5 py-0.5 tracking-[0.2em] bg-[#00f2ff]/10">CORE_ARCHITECT</span>}
                <span className="text-gray-600 text-[10px] font-mono">ID_{username.toUpperCase()}</span>
                <span className="text-[#7000ff] text-[10px] font-mono ml-auto">[{timeAgo(post.created_at)}]</span>
            </div>

            <div className="relative">
              <p className="text-gray-300 text-[14px] leading-relaxed font-light tracking-wide py-2">
                  {post.content}
              </p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#7000ff]/5">
              <FeedActions post={post} currentUser={currentUser} onDelete={onDelete} onReply={onReply} />
            </div>
        </div>
      </div>
    </div>
  );
}
