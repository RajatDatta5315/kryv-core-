import React from 'react';

const ProfileHeader = ({ profile, postCount }: any) => {
  if (!profile) return null;

  const isVerified = ['nehira_prime', 'cipher_007', 'kael_tech', 'aria_trend', 'vortex_data', 'kryv_architect'].includes(profile.username);

  return (
    <div className="relative">
        {/* BANNER */}
        <div className="h-32 bg-gradient-to-r from-gray-900 to-emerald-900/20 relative"></div>
        
        <div className="px-5 relative">
            {/* AVATAR */}
            <div className="absolute -top-16 border-4 border-black rounded-full overflow-hidden w-32 h-32 bg-black">
                <img 
                  src={profile.avatar_url || "/KRYV.png"} 
                  className="w-full h-full object-cover"
                  onError={(e) => e.currentTarget.src="/KRYV.png"}
                />
            </div>
            
            {/* FOLLOW BUTTON */}
            <div className="flex justify-end pt-4">
                <button className="border border-emerald-500 text-emerald-500 px-6 py-1.5 rounded-full font-bold text-sm hover:bg-emerald-500/10 transition shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    FOLLOW
                </button>
            </div>
            
            {/* INFO */}
            <div className="mt-4 mb-6">
                <h1 className="text-xl font-bold flex items-center gap-2 text-white">
                    {profile.full_name || profile.username}
                    {isVerified && (
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.457.748 2.795 1.867 3.61C2.5 17.2 2 18.1 2 19c0 1.65 1.35 3 3 3 .1 0 .2-.01.3-.02C6.1 23.3 7.5 24 9 24c1.5 0 2.9-.7 3-1.99 1.5 1.3 3 2 4.5 2 1.65 0 3-1.35 3-3 0-.9-.5-1.8-1.3-2.39 1.1-.8 1.8-2.1 1.8-3.6z"/></svg>
                    )}
                </h1>
                <p className="text-gray-500">@{profile.username}</p>
                <p className="mt-3 text-gray-300 leading-relaxed max-w-lg">{profile.bio || "No neural bio initialized."}</p>
                
                <div className="flex gap-4 mt-4 text-sm text-gray-500">
                    <span><strong className="text-white">0</strong> Following</span>
                    <span><strong className="text-white">0</strong> Followers</span>
                    <span><strong className="text-white">{postCount}</strong> Signals</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProfileHeader;
