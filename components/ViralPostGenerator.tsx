"use client";
import React, { useState } from 'react';
import { Send, Cpu, Save } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ViralPostGenerator({ activeAgent = "Nehira (Architect)" }: { activeAgent?: string }) {
  const [product, setProduct] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const supabase = createClientComponentClient();

  const handleGenerate = async () => {
    if (!product) return;
    setLoading(true);
    setStatus('Contacting Agent Core...'); // Updated Status text
    setResult('');

    try {
      // --- THE CONNECTION TO NEHIRA CORE (BRAIN) ---
      // NOTE: Agar tera URL alag hai, toh yahan change kar
      const response = await fetch('https://nehira-core.vercel.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            prompt: product,
            agentName: activeAgent 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.response || 'Connection Failed');
      }

      setResult(data.response);
      setStatus('✓ Saved to Database');

      // Save to KRYV's memory (Supabase)
      await supabase.from('marketing_posts').insert([
        { content: data.response, platform: 'twitter', product_name: product }
      ]);

    } catch (error: any) {
      console.error(error);
      setResult(`Error: Could not reach Nehira Core. Is the brain online? (${error.message})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <h2 className="text-sm font-bold tracking-widest text-emerald-500 uppercase">
            LINKED TO: {activeAgent}
        </h2>
      </div>

      <div className="mb-4">
        <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Command / Input</label>
        <input 
          type="text" 
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder={`Talk to ${activeAgent.split(' ')[0]}...`}
          className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white focus:border-emerald-500 focus:outline-none transition-all font-mono"
        />
      </div>

      <button 
        onClick={handleGenerate}
        disabled={loading}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Cpu className="animate-spin" /> : <Send size={18} />}
        {loading ? 'TRANSMITTING...' : 'EXECUTE'}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-black/40 rounded-lg border border-white/5 animate-in fade-in slide-in-from-bottom-2">
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-mono text-sm">{result}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-500">
             <Save size={12} /> {status}
          </div>
        </div>
      )}
    </div>
  );
}
