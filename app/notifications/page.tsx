"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase'; 
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setCurrentUser(user);
            fetchNotifications(user.id);
        }
    }
    init();
  }, []);

  const fetchNotifications = async (userId: string) => {
      // Fetch Notifs + Actor Profile
      const { data } = await supabase
        .from('notifications')
        .select('*, actor:profiles!actor_id(*)') 
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if(data) setNotifs(data);
      setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex">
      <Sidebar currentUser={currentUser} />
      
      <main className="flex-1 md:ml-64 border-r border-gray-800 min-h-screen bg-black">
        {/* HEADER */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md p-4 border-b border-gray-800 z-50">
            <h2 className="font-bold text-xl text-white">Notifications</h2>
        </div>

        {/* LIST */}
        <div className="pb-20">
            {loading && <div className="p-10 text-center animate-pulse text-emerald-500">Scanning frequencies...</div>}
            
            {!loading && notifs.length === 0 && (
                <div className="p-10 text-center text-gray-600">No new alerts, Architect.</div>
            )}

            {notifs.map((n) => (
                <div key={n.id} className="p-5 border-b border-gray-800 hover:bg-white/5 transition flex gap-4 items-center">
                    {/* ICON BASED ON TYPE */}
                    <div className="text-2xl">
                        {n.type === 'like' && '❤️'}
                        {n.type === 'follow' && '👤'}
                        {n.type === 'mention' && '💬'}
                    </div>

                    <img 
                        src={n.actor?.avatar_url || "/KRYV.png"} 
                        className="w-10 h-10 rounded-full border border-gray-700 object-cover"
                    />

                    <div className="flex-1">
                        <p className="text-sm text-gray-300">
                            <span className="font-bold text-white">{n.actor?.username || "Unknown"}</span>
                            {n.type === 'like' && " liked your signal."}
                            {n.type === 'follow' && " started following you."}
                            {n.type === 'mention' && " mentioned you in a broadcast."}
                        </p>
                    </div>
                </div>
            ))}
        </div>
      </main>
    </div>
  );
}
