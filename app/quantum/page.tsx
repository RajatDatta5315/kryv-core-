"use client";
import React, { useState, useEffect } from 'react';
import NehiraWidget from '../../components/NehiraWidget'; 
import { supabase } from '@/utils/supabase'; // Auth Check ke liye
import { useRouter } from 'next/navigation';

export default function AlphaParadoxQc() {
  const [status, setStatus] = useState("IDLE");
  const [result, setResult] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // 🔒 AUTH CHECK (Real Security)
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        setIsAuthenticated(true);
    } else {
        // Agar login nahi hai, to login page pe bhejo (Next Step)
        // router.push('/login'); 
        // Abhi ke liye Fake Login dikhayenge
    }
  };

  const runSimulation = () => {
    setStatus("QUANTUM TUNNELING...");
    setTimeout(() => {
        setResult({ "00": 48, "01": 2, "10": 2, "11": 48 }); // Example Data
        setStatus("COMPLETED");
    }, 2000);
  };

  if (!isAuthenticated) {
     return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <img src="/KRYV.png" className="w-20 h-20 mb-6 animate-pulse" />
            <h1 className="text-3xl font-bold text-white mb-2">KRYV ACCESS REQUIRED</h1>
            <p className="text-gray-500 mb-8">Authenticate identity to access Quantum Core.</p>
            <button onClick={() => setIsAuthenticated(true)} className="bg-emerald-600 px-8 py-3 rounded font-bold text-white hover:bg-emerald-500">
                LOGIN WITH KRYV ID
            </button>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-gray-300 font-sans relative">
      
      {/* 🏷️ BIG POWERED BY LOGO */}
      <div className="absolute top-4 right-4 z-0 opacity-20 flex flex-col items-end pointer-events-none">
         <h1 className="text-6xl font-black text-gray-800 tracking-tighter">KRYV</h1>
         <p className="text-xl font-mono text-emerald-800">INFRASTRUCTURE</p>
      </div>

      <nav className="border-b border-gray-900 bg-[#050505] p-4 relative z-10">
        <h1 className="text-xl font-bold text-white tracking-widest">AlphaParadox<span className="text-purple-500">Qc</span></h1>
      </nav>

      <div className="p-4 max-w-4xl mx-auto mt-10 relative z-10">
        {/* GRAPH RESULTS */}
        {result ? (
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 shadow-2xl mb-6">
                <h3 className="text-xs font-bold text-purple-400 mb-4 tracking-widest">PROBABILITY DISTRIBUTION</h3>
                <div className="flex items-end h-40 gap-4 justify-center">
                    {Object.entries(result).map(([key, val]: any) => (
                        <div key={key} className="flex flex-col items-center gap-2 group w-12">
                            <div className="text-xs text-gray-500 group-hover:text-white">{val}%</div>
                            <div className="w-full bg-purple-900/30 rounded-t transition-all duration-500 group-hover:bg-purple-500" style={{height: `${val}%`}}></div>
                            <div className="text-xs font-mono text-gray-400">{key}</div>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <div className="h-64 flex items-center justify-center border border-dashed border-gray-800 rounded-xl mb-6">
                <p className="text-gray-600 text-xs tracking-widest">NO DATA. RUN SIMULATION.</p>
            </div>
        )}

        <button onClick={runSimulation} className="w-full bg-purple-900/50 hover:bg-purple-900 text-purple-300 border border-purple-500/50 p-4 font-bold rounded tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            {status === 'IDLE' || status === 'COMPLETED' ? 'INITIATE QUANTUM CIRCUIT' : status}
        </button>
      </div>

      <NehiraWidget context="ALPHA_QUANTUM_LAB" />
    </div>
  );
}

