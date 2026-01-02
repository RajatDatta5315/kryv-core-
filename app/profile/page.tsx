"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/utils/supabase'; 
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import FeedPost from '../../components/FeedPost';
import ProfileHeader from '../../components/ProfileHeader';

function ProfileContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); 

  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("signals"); // 🔥 NEW: Tab State

  useEffect(() => {
    async function fetchData() {
       const { data: { user } } = await supabase.auth.getUser();
       setCurrentUser(user);
       
       if (!id) return;

       // 1. Fetch Profile
       const { data: prof } = await supabase.from('profiles').select('*').eq('id', id).single();
       setProfile(prof);

       // 2. Fetch Posts
       const { data: userPosts } = await supabase
         .from('posts')
         .select('*, profiles(*)')
         .eq('user_id', id)
         .order('created_at', { ascending: false });
       
       if(userPosts) setPosts(userPosts);
       setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="p-10 text-emerald-500 animate-pulse text-center">ACCESSING NEURAL ID...</div>;
  if (!profile) return <div className="p-10 text-red-500 text-center">IDENTITY NOT FOUND.</div>;

  // 🔥 FILTER LOGIC
  const displayedPosts = posts.filter(post => {
      if (activeTab === 'media') return post.content.includes('http'); // Video/Image links
      if (activeTab === 'replies') return post.content.includes('@'); // Mentions
      return true; // Signals shows all
  });

  return (
      <main className="flex-1 md:ml-64 border-r border-gray-800 min-h-screen bg-black">
        {/* HEADER NAV */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md p-3 border-b border-gray-800 z-50 flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-800 rounded-full text-white">←</Link>
            <div>
                <h2 className="font-bold text-lg text-white">{profile.username}</h2>
                <p className="text-xs text-gray-500">{posts.length} Signals</p>
            </div>
        </div>

        {/* HEADER */}
        <ProfileHeader profile={profile} postCount={posts.length} currentUser={currentUser} />

        {/* TABS */}
        <div className="flex border-b border-gray-800 mt-2 sticky top-14 bg-black z-40">
            <div onClick={() => setActiveTab("signals")} className={`flex-1 text-center p-4 cursor-pointer font-bold transition ${activeTab === 'signals' ? 'border-b-2 border-emerald-500 text-white' : 'text-gray-500 hover:bg-white/5'}`}>Signals</div>
            <div onClick={() => setActiveTab("replies")} className={`flex-1 text-center p-4 cursor-pointer font-bold transition ${activeTab === 'replies' ? 'border-b-2 border-emerald-500 text-white' : 'text-gray-500 hover:bg-white/5'}`}>Replies</div>
            <div onClick={() => setActiveTab("media")} className={`flex-1 text-center p-4 cursor-pointer font-bold transition ${activeTab === 'media' ? 'border-b-2 border-emerald-500 text-white' : 'text-gray-500 hover:bg-white/5'}`}>Media</div>
        </div>

        {/* POSTS LIST */}
        <div className="pb-20 min-h-[50vh]">
            {displayedPosts.length === 0 ? (
                <div className="p-10 text-center text-gray-600 italic">No data found in this sector.</div>
            ) : (
                displayedPosts.map(post => (
                    <FeedPost key={post.id} post={post} currentUser={currentUser} onDelete={() => {}} />
                ))
            )}
        </div>
      </main>
  );
}

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans flex">
            <Sidebar currentUser={null} /> 
            <Suspense fallback={<div className="text-white p-10">Loading KRYV...</div>}>
                <ProfileContent />
            </Suspense>
        </div>
    );
}

