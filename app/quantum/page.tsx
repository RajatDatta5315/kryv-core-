"use client";
import React, { useState, useEffect } from 'react';
import NehiraWidget from '../../components/NehiraWidget'; 
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function AlphaParadoxQc() {
  const [status, setStatus] = useState("IDLE");
  const [result, setResult] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [circuit, setCircuit] = useState<string[]>(Array(5).fill(null)); 
  const router = useRouter();

  useEffect(() => { checkUser(); }, []);

  const checkUser = async () => {
    // Check if user has a session
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        setIsAuthenticated(true);
    } else {
        // Redirect to Login if not logged in
        router.push('/login');
    }
  };

  const handleGridClick = (index: number) => {
    if (selectedGate) {
      const newCircuit = [...circuit];
      newCircuit[index] = selectedGate;
      setCircuit(newCircuit);
      setSelectedGate(null); 
    }
  };

  const runSimulation = () => {
    setStatus("TUNNELING...");
    setTimeout(() => {
        // Fake Quantum Math based on gates
        const hasH = circuit.includes('H');
        const res = hasH ? { "00": 49, "11": 51 } : { "00": 100, "11": 0 };
        setResult(res);
        setStatus("COMPLETED");
    }, 2000);
  };

  if (!isAuthenticated) return <div className="bg-black min-h-screen flex items-center justify-center text-green-500 animate-pulse">VERIFYING NEURAL LINK...</div>;

  return (
    <div className="min-h-screen bg-[#020202] text-gray-300 font-sans relative">
      
      {/* BIG LOGO */}
      <div className="absolute top-4 right-4 opacity-20 flex flex-col items-end pointer-events-none">
         <h1 className="text-4xl font-black text-gray-800 tracking-tighter">POWERED BY KRYV</h1>
      </div>

      <nav className="border-b border-gray-900 bg-[#050505] p-4">
        <h1 className="text-xl font-bold text-white tracking-widest">AlphaParadox<span className="text-purple-500">Qc</span></h1>
      </nav>

      <div className="p-4 max-w-4xl mx-auto mt-10 grid gap-8">
        
        {/* 1. GATES COMPOSER (Wapas Aa Gaya) */}
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">Circuit Design</h2>
            <div className="flex gap-4 h-20 items-center justify-center bg-black rounded-lg border border-gray-900 mb-6">
            {circuit.map((gate, i) => (
              <div key={i} onClick={() => handleGridClick(i)} className={`w-14 h-14 border border-gray-800 rounded flex items-center justify-center cursor-pointer hover:border-purple-500 transition ${gate ? 'bg-purple-900/20 text-purple-400 border-purple-500' : 'text-gray-700'}`}>
                {gate || "+"}
              </div>
            ))}
            </div>
            <div className="flex gap-3 justify-center">
            {['H', 'X', 'Y', 'Z', 'CNOT'].map(gate => (
              <button key={gate} onClick={() => setSelectedGate(gate)} className={`w-12 h-12 border ${selectedGate === gate ? 'border-purple-500 bg-purple-900' : 'border-gray-800 bg-[#111]'} text-white font-bold rounded hover:bg-gray-800 transition`}>
                {gate}
              </button>
            ))}
            </div>
        </div>

        {/* 2. GRAPH RESULTS (New Feature) */}
        {result && (
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 shadow-2xl">
                <h3 className="text-xs font-bold text-purple-400 mb-4 tracking-widest">PROBABILITY GRAPH</h3>
                <div className="flex items-end h-40 gap-8 justify-center">
                    {Object.entries(result).map(([key, val]: any) => (
                        <div key={key} className="flex flex-col items-center gap-2 w-16 group">
                            <div className="text-xs text-gray-500 group-hover:text-white">{val}%</div>
                            <div className="w-full bg-purple-900/30 rounded-t transition-all duration-500 group-hover:bg-purple-500 relative" style={{height: `${val}%`}}>
                                <div className="absolute top-0 w-full h-1 bg-purple-400 shadow-[0_0_10px_#a855f7]"></div>
                            </div>
                            <div className="text-xs font-mono text-gray-400 border-t border-gray-700 w-full text-center pt-2">{key}</div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <button onClick={runSimulation} className="w-full bg-purple-900/50 hover:bg-purple-900 text-purple-300 border border-purple-500/50 p-4 font-bold rounded tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            {status === 'IDLE' || status === 'COMPLETED' ? 'RUN SIMULATION' : status}
        </button>
      </div>

      <NehiraWidget context="ALPHA_QUANTUM_LAB" />
    </div>
  );
}

