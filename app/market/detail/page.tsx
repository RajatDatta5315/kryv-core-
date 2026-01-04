"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/utils/supabase';
import { useSearchParams } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';

// 🔥 CLOUDFLARE BUILD FIX
export const dynamic = "force-dynamic";

function MarketDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Get ID from URL query
  
  const [agent, setAgent] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function load() {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
        if(!id) return;
        
        // Fetch Agent Details
        const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
        setAgent(data);
    }
    load();
  }, [id]);

  const handleRent = async () => {
      if (!currentUser) return alert("Login required.");
      setProcessing(true);
      
      try {
          // 1. TRACK ORDER
          await supabase.from('orders').insert([{
              user_id: currentUser.id,
              item_name: `RENT-${agent.username}`,
              amount: '50',
              status: 'pending'
          }]);

          alert(`Order Initiated for ${agent.full_name}. Redirecting to Payment Gateway...`);
          
          // 2. REDIRECT TO PAYPAL
          window.open(`https://www.paypal.com/paypalme/RajatDatta482/50`, '_blank');
      } catch (err) {
          alert("System Error. Check Console.");
      }
      setProcessing(false);
  };

  if (!agent) return <div className="text-white p-10">Loading Neural Data...</div>;

  return (
    <div className="flex-1 md:ml-64 p-8 flex flex-col items-center">
        <div className="max-w-3xl w-full bg-black border border-cyan-900/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(8,145,178,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-6 mb-8 relative z-10">
                <img src={agent.avatar_url || "/KRYV.png"} className="w-24 h-24 rounded-full border-2 border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.3)]" onError={(e:any)=>e.currentTarget.src="/KRYV.png"} />
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white">{agent.full_name}</h1>
                    <p className="text-cyan-500 font-mono text-lg">@{agent.username}</p>
                </div>
            </div>

            <div className="space-y-8 relative z-10">
                <div>
                    <h3 className="text-gray-500 text-xs uppercase font-bold mb-2 tracking-widest">Core Directives</h3>
                    <p className="text-xl text-gray-200 leading-relaxed font-light">{agent.bio || "No directive set."}</p>
                </div>
                
                <div>
                     <h3 className="text-gray-500 text-xs uppercase font-bold mb-3 tracking-widest">System Capabilities</h3>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl flex items-center gap-3">
                             <span className="text-xl">⚡</span> <span className="text-sm font-bold text-gray-300">High Frequency</span>
                         </div>
                         <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl flex items-center gap-3">
                             <span className="text-xl">🧠</span> <span className="text-sm font-bold text-gray-300">DeepSeek Core</span>
                         </div>
                         <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl flex items-center gap-3">
                             <span className="text-xl">🔗</span> <span className="text-sm font-bold text-gray-300">API Connected</span>
                         </div>
                     </div>
                </div>
            </div>

            <div className="mt-12 border-t border-gray-800 pt-8 flex justify-between items-center relative z-10">
                <div>
                    <span className="text-4xl font-bold text-white">$50</span>
                    <span className="text-gray-500 text-sm"> / month</span>
                </div>
                <button 
                  onClick={handleRent} 
                  disabled={processing}
                  className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold px-10 py-4 rounded-xl transition shadow-[0_0_30px_rgba(8,145,178,0.4)] disabled:opacity-50"
                >
                    {processing ? "PROCESSING..." : "INITIATE RENT PROTOCOL"}
                </button>
            </div>
        </div>
    </div>
  );
}

// WRAPPER FOR BUILD SAFETY
export default function MarketDetailPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white flex font-sans">
            <Sidebar currentUser={null} />
            <Suspense fallback={<div className="p-10 text-emerald-500">Loading Neural Link...</div>}>
                <MarketDetailContent />
            </Suspense>
        </div>
    );
}

