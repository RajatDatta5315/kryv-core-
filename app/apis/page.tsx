"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { supabase } from '@/utils/supabase';

export default function APILibrary() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    async function getUser() {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
    }
    getUser();
  }, []);

  // 🔥 50+ APIs LIST
  const apis = [
      // FINANCE
      { name: "AlphaVantage", type: "Finance", cost: "$15", desc: "Stocks, Forex, Crypto data." },
      { name: "Polygon.io", type: "Finance", cost: "$29", desc: "Real-time market data." },
      { name: "Yahoo Finance", type: "Finance", cost: "FREE", desc: "Historical market data." },
      { name: "TradingView", type: "Finance", cost: "$50", desc: "Advanced charting lib." },
      { name: "CoinMarketCap", type: "Finance", cost: "FREE", desc: "Crypto prices & rank." },
      // AI MODELS
      { name: "OpenAI GPT-4", type: "AI", cost: "$20", desc: "Advanced reasoning core." },
      { name: "Anthropic Claude", type: "AI", cost: "$15", desc: "Large context window." },
      { name: "DeepSeek V2", type: "AI", cost: "FREE", desc: "Open-source coding genius." },
      { name: "Mistral Large", type: "AI", cost: "$10", desc: "Efficient European LLM." },
      { name: "Stable Diffusion", type: "AI", cost: "$0.02", desc: "Image generation engine." },
      { name: "Midjourney API", type: "AI", cost: "$10", desc: "High-quality art gen." },
      { name: "HuggingFace", type: "AI", cost: "FREE", desc: "Model hosting & inference." },
      { name: "Replicate", type: "AI", cost: "Usage", desc: "Run AI models in cloud." },
      // SOCIAL & MEDIA
      { name: "Twitter/X API", type: "Social", cost: "$100", desc: "Automated posting & analysis." },
      { name: "Reddit API", type: "Social", cost: "FREE", desc: "Community sentiment tracking." },
      { name: "Discord Bot", type: "Social", cost: "FREE", desc: "Server automation & chat." },
      { name: "Telegram Bot", type: "Social", cost: "FREE", desc: "Secure messaging automation." },
      { name: "YouTube Data", type: "Social", cost: "FREE", desc: "Video analytics & comments." },
      { name: "Twitch API", type: "Social", cost: "FREE", desc: "Live streaming data." },
      // CRYPTO & BLOCKCHAIN
      { name: "Binance Connect", type: "Crypto", cost: "$0", desc: "Trading execution." },
      { name: "CoinGecko", type: "Crypto", cost: "FREE", desc: "Coin pricing & market cap." },
      { name: "Etherscan", type: "Crypto", cost: "FREE", desc: "Blockchain transaction tracking." },
      { name: "Solana RPC", type: "Crypto", cost: "$0.01", desc: "High-speed Solana interactions." },
      { name: "Metamask SDK", type: "Crypto", cost: "FREE", desc: "Wallet connection." },
      // TOOLS & CLOUD
      { name: "Google Search", type: "Tools", cost: "$5", desc: "Web search capability." },
      { name: "Twilio SMS", type: "Tools", cost: "$0.01", desc: "SMS notifications." },
      { name: "SendGrid", type: "Tools", cost: "$15", desc: "Email marketing automation." },
      { name: "AWS S3", type: "Cloud", cost: "Usage", desc: "Massive file storage." },
      { name: "Vercel SDK", type: "Cloud", cost: "FREE", desc: "Frontend deployment." },
      { name: "Supabase", type: "Cloud", cost: "FREE", desc: "Database & Auth." },
      { name: "Stripe", type: "Tools", cost: "2.9%", desc: "Payment processing." },
  ];

  const filteredApis = filter === "ALL" ? apis : apis.filter(api => api.type === filter);

  // 💰 HANDLE PURCHASE
  const handleBuy = (cost: string) => {
      // 1. ADMIN BYPASS
      if (currentUser?.email === 'rajatdatta90000@gmail.com') {
          return alert("Architect Access Granted. API Key: KRYV_UNLIMITED_ACCESS");
      }
      
      const price = cost.replace('$', '').replace('/img', '').replace('/msg', '');
      
      // 2. FREE API
      if (cost === 'FREE' || cost === '$0' || cost === 'Usage') {
          return alert("This API is Open Source. Key generated.");
      }
      
      // 3. PAYPAL REDIRECT (User Pays You)
      // Link format: paypal.me/YOUR_ID/AMOUNT
      const paypalUrl = `https://www.paypal.com/paypalme/rajatdatta90000/${price}`;
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
                  {["ALL", "Finance", "AI", "Social", "Crypto", "Tools", "Cloud"].map(cat => (
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
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${api.cost === 'FREE' || api.cost === '$0' ? 'bg-green-900/30 text-green-400' : 'bg-purple-900/30 text-purple-400'}`}>{api.cost}</span>
                      </div>
                      <span className="text-[10px] text-gray-600 font-mono uppercase border border-gray-800 px-1.5 rounded">{api.type}</span>
                      <p className="text-gray-500 text-xs mt-3 leading-relaxed">{api.desc}</p>
                      
                      {/* Button Logic */}
                      <button 
                          onClick={() => handleBuy(api.cost)} 
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

