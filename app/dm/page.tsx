"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import Sidebar from '../../components/Sidebar';
import Link from 'next/link';

export default function DMList() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function load() {
        const { data: { user } } = await supabase.auth.getUser();
        if(!user) return;
        setCurrentUser(user);

        // Get all messages involving user
        const { data: msgs } = await supabase.from('messages')
            .select('sender_id, receiver_id')
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
            
        if(msgs) {
            const userIds = new Set();
            msgs.forEach(m => {
                if(m.sender_id !== user.id) userIds.add(m.sender_id);
                if(m.receiver_id !== user.id) userIds.add(m.receiver_id);
            });
            
            const ids = Array.from(userIds);
            if(ids.length > 0) {
                const { data: profiles } = await supabase.from('profiles').select('*').in('id', ids);
                setConversations(profiles || []);
            }
        }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      <Sidebar currentUser={currentUser} />
      <div className="flex-1 md:ml-64 p-8">
          <h1 className="text-2xl font-bold border-b border-gray-800 pb-4 mb-4 text-emerald-400 tracking-widest">ENCRYPTED CHANNELS</h1>
          
          <div className="space-y-2">
              {conversations.length === 0 && <div className="text-gray-500">No active signals.</div>}
              
              {conversations.map((user) => (
                  <Link href={`/dm?id=${user.id}`} key={user.id} className="block p-4 bg-gray-900/30 border border-gray-800 rounded-xl hover:border-emerald-500/50 transition flex items-center gap-4">
                      <img src={user.avatar_url || "/KRYV.png"} className="w-12 h-12 rounded-full object-cover" onError={(e:any)=>e.currentTarget.src="/KRYV.png"}/>
                      <div>
                          <h3 className="font-bold text-lg">{user.full_name}</h3>
                          <p className="text-xs text-gray-500 font-mono">@{user.username}</p>
                      </div>
                  </Link>
              ))}
          </div>
      </div>
    </div>
  );
}

