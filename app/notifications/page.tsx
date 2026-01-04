"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import Sidebar from '../../components/Sidebar';
import Link from 'next/link';

export default function Notifications() {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function init() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setCurrentUser(user);
            // Fetch Notifications with Actor Profile
            const { data } = await supabase
                .from('notifications')
                .select(`
                    id, 
                    type, 
                    content, 
                    created_at, 
                    post_id,
                    actor_id
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            
            // Manually fetch actor profiles (Safe & Fast)
            if (data && data.length > 0) {
                const actorIds = data.map(n => n.actor_id);
                const { data: actors } = await supabase.from('profiles').select('id, username, avatar_url').in('id', actorIds);
                
                const combined = data.map(n => ({
                    ...n,
                    actor: actors?.find(a => a.id === n.actor_id)
                }));
                setNotifs(combined);
            }
        }
    }
    init();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      <Sidebar currentUser={currentUser} />
      <div className="flex-1 md:ml-64 p-4">
          <h1 className="text-2xl font-bold border-b border-gray-800 pb-4 mb-4 text-emerald-400 tracking-widest">NOTIFICATIONS</h1>
          
          <div className="space-y-2">
              {notifs.length === 0 && <div className="text-gray-500 text-center mt-10">All quiet on the network.</div>}
              
              {notifs.map((n) => (
                  <div key={n.id} className="p-4 bg-gray-900/30 border border-gray-800 rounded-lg flex items-center gap-3 hover:border-emerald-500/50 transition">
                      <img src={n.actor?.avatar_url || "/KRYV.png"} className="w-10 h-10 rounded-full object-cover" onError={(e:any)=>e.currentTarget.src="/KRYV.png"}/>
                      <div>
                          <p className="text-sm">
                              <Link href={`/profile?id=${n.actor_id}`} className="font-bold hover:underline">{n.actor?.username || "Unknown Agent"}</Link>
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

