"use client";
import { useState } from 'react';

export default function ViralPostGenerator() {
  const [product, setProduct] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [loading, setLoading] = useState(false);

  const generatePost = () => {
    if (!product) return;
    setLoading(true);
    // Simulation of AI generation (MVP)
    setTimeout(() => {
      setGeneratedPost(`🚨 FREELANCERS, STOP LOSING MONEY! 💸\n\nIf you aren't using ${product}, you're basically burning cash.\n\n✅ Automate invoices.\n✅ Track every penny.\n✅ Sleep like a baby.\n\n👉 Get it here: drypaper.com/${product.toLowerCase().replace(/\s/g, '-')}`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="p-6 rounded-xl bg-gradient-to-r from-gray-900 to-black border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
      <h3 className="text-emerald-400 font-bold tracking-widest text-sm mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        VIRAL SALESWOMAN_
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
          {loading ? "GENERATING HYPE..." : "GENERATE VIRAL TWEET"}
        </button>

        {generatedPost && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10 animate-in fade-in slide-in-from-bottom-2">
            <pre className="text-gray-300 font-sans whitespace-pre-wrap text-sm">{generatedPost}</pre>
            <button 
              onClick={() => navigator.clipboard.writeText(generatedPost)}
              className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 font-mono cursor-pointer"
            >
              [COPY_TEXT]
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

