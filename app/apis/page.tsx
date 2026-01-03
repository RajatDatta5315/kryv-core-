"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { supabase } from '@/utils/supabase';

export default function APILibrary() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
  }, []);

  // 🔥 REAL LINKS
  const apis = [
      { name: "AlphaVantage", type: "Finance", cost: "$15", desc: "Stocks, Forex, Crypto data.", url: "https://www.alphavantage.co/" },
      { name: "Polygon.io", type: "Finance", cost: "$29", desc: "Real-time market data.", url: "https://polygon.io/" },
      { name: "OpenAI GPT-4", type: "AI", cost: "$20", desc: "Advanced reasoning core.", url: "https://openai.com/api/" },
      { name: "Anthropic Claude", type: "AI", cost: "$15", desc: "Large context window.", url: "https://www.anthropic.com/api" },
      { name: "DeepSeek V2", type: "AI", cost: "FREE", desc: "Open-source coding genius.", url: "https://deepseek.com/" },
      { name: "Twitter/X API", type: "Social", cost: "$100", desc: "Automated posting.", url: "https://developer.twitter.com/" },
      { name: "Binance Connect", type: "Crypto", cost: "$0", desc: "Trading execution.", url: "https://www.binance.com/en/binance-api" },
      { name: "Twilio SMS", type: "Tools", cost: "$0.01/msg", desc: "SMS notifications.", url: "https://www.twilio.com/" },
      { name: "SendGrid", type: "Tools", cost: "$15", desc: "Email automation.", url: "https://sendgrid.com/" },
      { name: "AWS S3", type: "Cloud", cost: "Usage", desc: "Massive storage.", url: "https://aws.amazon.com/s3/" },
      { name: "Stripe", type: "Tools", cost: "2.9%", desc: "Payment processing.", url: "https://stripe.com/" },
      { name: "Midjourney", type: "AI", cost: "$10", desc: "Image generation.", url: "https://www.midjourney.com/" },
  ];

  const filteredApis = filter === "ALL" ? apis : apis.filter(api => api.type === filter);

  const handleBuy = (api: any) => {
      // 1. ADMIN BYPASS (Open Real Site)
      if (currentUser?.email === 'rajatdatta90000@gmail.com') {
          if(api.url) window.open(api.url, '_blank');
          return;
      }
      
      // 2. FREE API
      if (api.cost === 'FREE' || api.cost === '$0' || api.cost === 'Usage') {
          if(api.url) window.open(api.url, '_blank');
          return;
      }
      
      // 3. PAYPAL REDIRECT (Updated Email)
      const price = api.cost.replace('$', '').replace('/img', '').replace('/msg', '');
      const paypalUrl = `https://www.paypal.com/paypalme/Rajatdatta099/${price}`;
      window.open(paypalUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex font-sans">
      <Sidebar currentUser={currentUser} />
      
      <div className="flex-1 md:ml-64 p-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-800 pb-4 gap-4">
              <div>
                  <h1 className="text-3xl font-bold tracking-widest text-purple-400">API <span className="text-white">VAULT</span></h1>
                  <p className="text-gray-500 text-sm mt-1">Connect neural pathways to external worlds.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                  {["ALL", "Finance", "AI", "Social", "Crypto", "Tools"].map(cat => (
                      <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1 rounded text-xs font-bold transition ${filter === cat ? 'bg-purple-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}>
                          {cat}
                      </button>
                  ))}
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredApis.map((api, i) => (
                  <div key={i} className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-5 hover:border-purple-500/50 transition group relative">
                      <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-md text-gray-200 group-hover:text-purple-400 transition">{api.name}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${api.cost.includes('FREE') || api.cost === '$0' ? 'bg-green-900/30 text-green-400' : 'bg-purple-900/30 text-purple-400'}`}>{api.cost}</span>
                      </div>
                      <span className="text-[10px] text-gray-600 font-mono uppercase border border-gray-800 px-1.5 rounded">{api.type}</span>
                      <p className="text-gray-500 text-xs mt-3 leading-relaxed">{api.desc}</p>
                      
                      <button 
                          onClick={() => handleBuy(api)} 
                          className={`w-full mt-4 text-xs py-2 rounded transition border font-bold tracking-wide
                          ${currentUser?.email === 'rajatdatta90000@gmail.com' 
                              ? 'bg-emerald-900/20 text-emerald-400 border-emerald-900 hover:bg-emerald-900/40' 
                              : 'bg-gray-900 text-gray-400 border-gray-800 hover:bg-purple-600 hover:text-white group-hover:border-purple-500/30'}`}
                      >
                          {currentUser?.email === 'rajatdatta90000@gmail.com' ? 'BYPASS ACCESS' : 'ACQUIRE ACCESS'}
                      </button>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}

