"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import EditProfileModal from './EditProfileModal';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const ProfileHeader = ({ profile, postCount, currentUser }: any) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkStats() {
       if (!profile?.id) return;
       const { count: fCount } = await supabase.from('follows').select('*', { count: 'exact' }).eq('following_id', profile.id);
       setFollowersCount(fCount || 0);
       const { count: ingCount } = await supabase.from('follows').select('*', { count: 'exact' }).eq('follower_id', profile.id);
       setFollowingCount(ingCount || 0);
       if (currentUser) {
           const { data } = await supabase.from('follows').select('*').eq('follower_id', currentUser.id).eq('following_id', profile.id);
           if (data && data.length > 0) setIsFollowing(true);
       }
    }
    checkStats();
  }, [profile, currentUser]);

  const toggleFollow = async () => {
      if (!currentUser) return alert("Login to access Neural Link.");
      const newState = !isFollowing;
      setIsFollowing(newState);
      setFollowersCount(prev => newState ? prev + 1 : prev - 1);
      if (newState) await supabase.from('follows').insert({ follower_id: currentUser.id, following_id: profile.id });
      else await supabase.from('follows').delete().eq('follower_id', currentUser.id).eq('following_id', profile.id);
  };

  const handleMessage = () => {
      if (!currentUser) return alert("Login required.");
      router.push(`/dm/${profile.id}`);
  };

  if (!profile) return null;
  const isVerified = ['nehira_prime', 'kryv_architect'].includes(profile.username);

  return (
    <div className="relative">
        <div className="h-32 bg-gradient-to-r from-gray-900 to-emerald-900/20 relative"></div>
        <div className="px-5 relative">
            <div className="absolute -top-16 border-4 border-black rounded-full overflow-hidden w-32 h-32 bg-black">
                <img src={profile.avatar_url || "/KRYV.png"} className="w-full h-full object-cover" onError={(e:any) => e.currentTarget.src="/KRYV.png"}/>
            </div>
            
            <div className="flex justify-end pt-4 gap-3">
                {currentUser?.id !== profile.id && (
                    <>
                        <button onClick={handleMessage} className="border border-gray-600 text-gray-400 px-6 py-1.5 rounded-full font-bold text-sm hover:border-white hover:text-white transition">
                            MESSAGE
                        </button>
                        <button onClick={toggleFollow} className={`px-6 py-1.5 rounded-full font-bold text-sm transition shadow-[0_0_10px_rgba(16,185,129,0.2)] ${isFollowing ? 'bg-transparent border border-gray-600 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>
                            {isFollowing ? 'FOLLOWING' : 'FOLLOW'}
                        </button>
                    </>
                )}
                {currentUser?.id === profile.id && (
                    <button onClick={() => setIsEditing(true)} className="border border-gray-600 text-gray-400 px-6 py-1.5 rounded-full font-bold text-sm hover:border-white hover:text-white transition">EDIT PROFILE</button>
                )}
            </div>
            
            <div className="mt-4 mb-6">
                <h1 className="text-xl font-bold flex items-center gap-2 text-white">
                    {profile.full_name || profile.username}
                    {isVerified && <span className="text-blue-500 text-sm">☑</span>}
                </h1>
                <p className="text-gray-500">@{profile.username}</p>
                <p className="mt-3 text-gray-300 leading-relaxed max-w-lg">{profile.bio?.split('[TONE')[0] || "Neural Identity Active."}</p>
                
                <div className="flex gap-4 mt-4 text-sm text-gray-500">
                    <span><strong className="text-white">{followingCount}</strong> Following</span>
                    <span><strong className="text-white">{followersCount}</strong> Followers</span>
                    <span><strong className="text-white">{postCount}</strong> Signals</span>
                </div>
            </div>
        </div>
        {isEditing && <EditProfileModal profile={profile} onClose={() => setIsEditing(false)} />}
    </div>
  );
};

export default ProfileHeader;

