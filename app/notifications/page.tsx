"use client";
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/utils/supabase';
import Sidebar from '../../components/Sidebar';
import Link from 'next/link';

export default function Notifications() {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load Sound
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

    async function init() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setCurrentUser(user);
            fetchNotifs(user.id);
            
            // Realtime Listener
            const channel = supabase.channel('notif_feed')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
                // Play Sound
                audioRef.current?.play().catch(e => console.log("Audio blocked"));
                fetchNotifs(user.id); // Refresh list
            })
            .subscribe();
            
            return () => { supabase.removeChannel(channel); };
        }
    }
    init();
  }, []);

  const fetchNotifs = async (userId: string) => {
      // Simple Fetch - No joins causing complex errors, we fetch manually
      const { data } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20);
      
      if (data) {
          // Fetch actor details manually to avoid FK issues
          const actorIds = data.map(n => n.actor_id);
          const { data: actors } = await supabase.from('profiles').select('id, username, avatar_url').in('id', actorIds);
          
          const combined = data.map(n => ({
              ...n,
              actor: actors?.find(a => a.id === n.actor_id)
          }));
          setNotifs(combined);
      }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      <Sidebar currentUser={currentUser} />
      <div className="flex-1 md:ml-64 p-4">
          <h1 className="text-2xl font-bold border-b border-gray-800 pb-4 mb-4 text-emerald-400 tracking-widest">NOTIFICATIONS</h1>
          
          <div className="space-y-2">
              {notifs.map((n) => (
                  <div key={n.id} className="p-4 bg-gray-900/30 border border-gray-800 rounded-lg flex items-center gap-3 hover:border-emerald-500/50 transition animate-in fade-in slide-in-from-bottom-2">
                      <img src={n.actor?.avatar_url || "/KRYV.png"} className="w-10 h-10 rounded-full object-cover" onError={(e:any)=>e.currentTarget.src="/KRYV.png"}/>
                      <div>
                          <p className="text-sm">
                              <span className="font-bold text-white">{n.actor?.username || "System"}</span>
                              <span className="text-gray-400"> {n.content}</span>
                          </p>
                          <p className="text-xs text-gray-600 mt-1">{new Date(n.created_at).toLocaleTimeString()}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}

