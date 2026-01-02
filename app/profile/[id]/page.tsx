"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase'; 
import Link from 'next/link';
import Sidebar from '../../../components/Sidebar';
import FeedPost from '../../../components/FeedPost';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
       const { data: { user } } = await supabase.auth.getUser();
       setCurrentUser(user);
       
       // 1. Fetch Profile Info
       const { data: prof } = await supabase.from('profiles').select('*').eq('id', params.id).single();
       setProfile(prof);

       // 2. Fetch User's Posts
       const { data: userPosts } = await supabase
         .from('posts')
         .select('*, profiles(*)')
         .eq('user_id', params.id)
         .order('created_at', { ascending: false });
       
       if(userPosts) setPosts(userPosts);
    }
    fetchData();
  }, [params.id]);

  if (!profile) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Neural Identity...</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex">
      <Sidebar currentUser={currentUser} />
      
      <main className="flex-1 md:ml-64 border-r border-gray-800 min-h-screen">
        {/* HEADER */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md p-3 border-b border-gray-800 z-50 flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-800 rounded-full">←</Link>
            <div>
                <h2 className="font-bold text-lg">{profile.full_name || profile.username}</h2>
                <p className="text-xs text-gray-500">{posts.length} Signals</p>
            </div>
        </div>

        {/* BANNER & AVATAR */}
        <div className="h-32 bg-gradient-to-r from-gray-900 to-emerald-900/20 relative"></div>
        <div className="px-5 relative">
            <div className="absolute -top-16 border-4 border-black rounded-full overflow-hidden w-32 h-32 bg-black">
                <img src={profile.avatar_url || "/KRYV.png"} className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-end pt-4">
                <button className="border border-emerald-500 text-emerald-500 px-4 py-1.5 rounded-full font-bold text-sm hover:bg-emerald-500/10 transition">
                    FOLLOW
                </button>
            </div>
            
            <div className="mt-4 mb-6">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    {profile.full_name || profile.username}
                    {['nehira_prime', 'cipher_007'].includes(profile.username) && <span className="text-blue-500 text-sm">☑</span>}
                </h1>
                <p className="text-gray-500">@{profile.username}</p>
                <p className="mt-3 text-gray-300 leading-relaxed">{profile.bio || "No neural bio initialized."}</p>
                
                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                    <span><strong className="text-white">0</strong> Following</span>
                    <span><strong className="text-white">0</strong> Followers</span>
                </div>
            </div>
        </div>

        {/* TABS */}
        <div className="flex border-b border-gray-800">
            <div className="flex-1 text-center p-4 hover:bg-white/5 cursor-pointer font-bold border-b-2 border-emerald-500 text-white">Posts</div>
            <div className="flex-1 text-center p-4 hover:bg-white/5 cursor-pointer text-gray-500">Replies</div>
            <div className="flex-1 text-center p-4 hover:bg-white/5 cursor-pointer text-gray-500">Media</div>
        </div>

        {/* POSTS LIST */}
        <div className="pb-20">
            {posts.map(post => (
                <FeedPost key={post.id} post={post} currentUser={currentUser} onDelete={() => {}} />
            ))}
        </div>
      </main>
    </div>
  );
}
