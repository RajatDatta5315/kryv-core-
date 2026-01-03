"use client";
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { supabase } from '@/utils/supabase';
import { useSearchParams } from 'next/navigation';
import Sidebar from '../../components/Sidebar';

// 🔥 CONTENT COMPONENT (Client Side Logic)
function DMContent() {
  const searchParams = useSearchParams();
  const receiverId = searchParams.get('id'); // Get ID from URL (?id=...)
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [receiver, setReceiver] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(!receiverId) return;

    async function init() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setCurrentUser(user);
        
        // Fetch Receiver
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', receiverId).single();
        setReceiver(profile);

        // Fetch Old Messages
        const { data: oldMsgs } = await supabase.from('messages')
            .select('*')
            .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
            .order('created_at', { ascending: true });
            
        const chatMsgs = oldMsgs?.filter(m => 
            (m.sender_id === user?.id && m.receiver_id === receiverId) || 
            (m.sender_id === receiverId && m.receiver_id === user?.id)
        ) || [];
        setMessages(chatMsgs);

        // Realtime Subscription
        const channel = supabase.channel('chat_room')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                const newMsg = payload.new;
                if ((newMsg.sender_id === user?.id && newMsg.receiver_id === receiverId) || 
                    (newMsg.sender_id === receiverId && newMsg.receiver_id === user?.id)) {
                    setMessages(prev => [...prev, newMsg]);
                }
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }
    init();
  }, [receiverId]);

  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
      if (!input.trim() || !currentUser) return;
      await supabase.from('messages').insert([{
          sender_id: currentUser.id,
          receiver_id: receiverId,
          content: input
      }]);
      setInput("");
  };

  if(!receiverId) return <div className="text-gray-500 p-10">Select an agent to chat.</div>;

  return (
    <div className="flex-1 md:ml-64 flex flex-col h-screen bg-[#050505] text-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-800 bg-black/90 flex items-center gap-3 sticky top-0 z-10">
            <img src={receiver?.avatar_url || "/KRYV.png"} className="w-10 h-10 rounded-full object-cover" onError={(e:any)=>e.currentTarget.src="/KRYV.png"}/>
            <div>
                <h2 className="font-bold text-lg">{receiver?.full_name || "Agent"}</h2>
                <p className="text-xs text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Encrypted Connection
                </p>
            </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-xl text-sm shadow-md ${msg.sender_id === currentUser?.id ? 'bg-emerald-900/80 text-emerald-100 rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none'}`}>
                        {msg.content}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-800 bg-black">
            <div className="flex gap-2">
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Transmission..."
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 py-3 text-white focus:border-emerald-500 outline-none transition-all"
                />
                <button onClick={sendMessage} className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-full transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    ➤
                </button>
            </div>
        </div>
    </div>
  );
}

// 🔥 WRAPPER FOR STATIC EXPORT COMPATIBILITY
export default function DirectMessagePage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white flex font-sans">
            <Sidebar currentUser={null} />
            <Suspense fallback={<div className="p-10 text-emerald-500">Loading Neural Link...</div>}>
                <DMContent />
            </Suspense>
        </div>
    );
}
