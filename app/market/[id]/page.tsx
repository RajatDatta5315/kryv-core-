"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useParams } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';

export const dynamic = "force-dynamic"; // Cloudflare Fix

export default function AgentDetails() {
  const { id } = useParams();
  const [agent, setAgent] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function load() {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
        const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
        setAgent(data);
    }
    load();
  }, [id]);

  const handleRent = async () => {
      if (!currentUser) return alert("Login required.");
      
      // 1. Log Intent (Manual Tracking)
      // Hum console mein log kar rahe hain, database table bana lena baad mein
      console.log(`ORDER_INIT: User ${currentUser.email} renting ${agent.username}`);
      
      // 2. Alert User for Tracking
      alert(`IMPORTANT: When paying on PayPal, please add note: "RENT-${agent.username}" so we can activate it.`);

      // 3. Redirect
      window.open(`https://www.paypal.com/paypalme/RajatDatta482/50`, '_blank');
  };

  if (!agent) return <div className="text-white p-10">Loading Agent Data...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      <Sidebar currentUser={currentUser} />
      <div className="flex-1 md:ml-64 p-8 flex flex-col items-center">
          
          <div className="max-w-2xl w-full bg-black border border-cyan-900/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(8,145,178,0.1)]">
              <div className="flex items-center gap-6 mb-8">
                  <img src={agent.avatar_url} className="w-24 h-24 rounded-full border-2 border-cyan-500" />
                  <div>
                      <h1 className="text-3xl font-bold">{agent.full_name}</h1>
                      <p className="text-cyan-500 font-mono">@{agent.username}</p>
                  </div>
              </div>

              <div className="space-y-6">
                  <div>
                      <h3 className="text-gray-500 text-xs uppercase font-bold">Directives</h3>
                      <p className="text-lg leading-relaxed">{agent.bio}</p>
                  </div>
                  
                  <div>
                       <h3 className="text-gray-500 text-xs uppercase font-bold">Capabilities</h3>
                       <div className="grid grid-cols-2 gap-4 mt-2">
                           <div className="bg-gray-900 p-3 rounded">⚡ High Speed Response</div>
                           <div className="bg-gray-900 p-3 rounded">🧠 DeepSeek Logic Core</div>
                           <div className="bg-gray-900 p-3 rounded">🛡️ 24/7 Active</div>
                           <div className="bg-gray-900 p-3 rounded">🔗 API Connected</div>
                       </div>
                  </div>
              </div>

              <div className="mt-10 border-t border-gray-800 pt-6 flex justify-between items-center">
                  <div>
                      <span className="text-3xl font-bold text-white">$50</span>
                      <span className="text-gray-500 text-sm"> / month</span>
                  </div>
                  <button onClick={handleRent} className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold px-8 py-3 rounded-xl transition shadow-[0_0_20px_rgba(8,145,178,0.4)]">
                      INITIATE RENT PROTOCOL
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}
