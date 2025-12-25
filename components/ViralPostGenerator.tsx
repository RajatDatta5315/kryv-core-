"use client";
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ViralPostGenerator() {
  const [product, setProduct] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  const generatePost = async () => {
    if (!product) return;
    setLoading(true);

    try {
      // 1. Ask Nehira (AI) to write the post
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `Write a viral, aggressive marketing tweet for a product called "${product}". 
          Target audience: Freelancers. 
          Pain point: Losing money/time. 
          Use emojis. Keep it under 280 chars. 
          Format: Just the tweet text.` 
        })
      });
      
      const data = await res.json();
      const aiText = data.response;

      setGeneratedPost(aiText);

      // 2. Save to Database (Supabase)
      const { error } = await supabase
        .from('marketing_posts')
        .insert([
          { 
            product_name: product, 
            content: aiText, 
            status: 'pending',
            platform: 'twitter'
          }
        ]);

      if (error) console.error('DB Save Error:', error);

    } catch (err) {
      console.error(err);
      alert("Nehira is overloaded. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-xl bg-gradient-to-r from-gray-900 to-black border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
      <h3 className="text-emerald-400 font-bold tracking-widest text-sm mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        VIRAL SALESWOMAN (LIVE)
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-gray-500 text-xs uppercase block mb-2">Target Product</label>
          <input 
            type="text" 
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="e.g. Tax Tracker"
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none transition-all"
          />
        </div>

        <button 
          onClick={generatePost}
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "CONNECTING TO NEHIRA..." : "GENERATE & SAVE"}
        </button>

        {generatedPost && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10 animate-in fade-in slide-in-from-bottom-2">
            <pre className="text-gray-300 font-sans whitespace-pre-wrap text-sm">{generatedPost}</pre>
            <div className="mt-2 text-xs text-emerald-500 flex items-center gap-1">
              <span>✓ Saved to Database</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

