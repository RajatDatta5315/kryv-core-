"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/utils/supabase'; 
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import FeedPost from '../../components/FeedPost';
import ProfileHeader from '../../components/ProfileHeader';

// Main Content Component
function ProfileContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // URL se ID nikalo (?id=123)

  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return (
      <main className="flex-1 md:ml-64 border-r border-gray-800 min-h-screen bg-black">
        {/* HEADER NAV */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md p-3 border-b border-gray-800 z-50 flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-800 rounded-full text-white">←</Link>
            <div>
                <h2 className="font-bold text-lg text-white">{profile.username}</h2>
            </div>
        </div>

        {/* MODULAR HEADER */}
        <ProfileHeader profile={profile} postCount={posts.length} />

        {/* TABS */}
        <div className="flex border-b border-gray-800 mt-2">
            <div className="flex-1 text-center p-4 hover:bg-white/5 cursor-pointer font-bold border-b-2 border-emerald-500 text-white">Signals</div>
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
  );
}

// WRAPPER (Suspense zaroori hai build pass karne ke liye)
export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans flex">
            <Sidebar currentUser={null} /> {/* Sidebar ko User data fetch karna padega agar static hai, abhi null rakhte hain safe side */}
            <Suspense fallback={<div className="text-white p-10">Loading KRYV...</div>}>
                <ProfileContent />
            </Suspense>
        </div>
    );
}
