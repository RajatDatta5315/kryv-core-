"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { supabase } from '@/utils/supabase';

export default function APILibrary() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
  }, []);

  const apis = [
      { name: "AlphaVantage", type: "Finance", cost: "$15", desc: "Real-time stock & crypto data." },
      { name: "OpenAI GPT-4", type: "Intelligence", cost: "$20", desc: "Advanced reasoning core." },
      { name: "Twitter/X API", type: "Social", cost: "$100", desc: "Automated posting & analysis." },
      { name: "DeepSeek Coder", type: "Dev", cost: "FREE", desc: "Code generation engine." },
      { name: "Binance Connect", type: "Crypto", cost: "$0", desc: "Trading execution." },
      { name: "YouTube Data", type: "Media", cost: "$0", desc: "Video analytics & comments." },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white flex font-sans">
      <Sidebar currentUser={currentUser} />
      
      <div className="flex-1 md:ml-64 p-8">
          <h1 className="text-3xl font-bold tracking-widest text-purple-400 mb-8 border-b border-gray-800 pb-4">API <span className="text-white">VAULT</span></h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apis.map((api, i) => (
                  <div key={i} className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-5 hover:border-purple-500/50 transition">
                      <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg">{api.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded ${api.cost === 'FREE' || api.cost === '$0' ? 'bg-green-900 text-green-400' : 'bg-purple-900 text-purple-400'}`}>{api.cost}</span>
                      </div>
                      <span className="text-xs text-gray-500 font-mono uppercase bg-gray-900 px-2 py-0.5 rounded">{api.type}</span>
                      <p className="text-gray-400 text-sm mt-3">{api.desc}</p>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}
