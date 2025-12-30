"use client";
import React, { useState } from 'react';
import NehiraWidget from '../../components/NehiraWidget'; 

export default function AlphaParadoxQc() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [circuit, setCircuit] = useState<string[]>(Array(5).fill(null)); 
  const [status, setStatus] = useState("IDLE");
  const [result, setResult] = useState<any>(null);

  const handleLogin = () => setIsLoggedIn(true);

  const handleGridClick = (index: number) => {
    if (selectedGate) {
      const newCircuit = [...circuit];
      newCircuit[index] = selectedGate;
      setCircuit(newCircuit);
      setSelectedGate(null); 
    }
  };

  const runSimulation = async () => {
    setStatus("INITIALIZING QUBITS...");
    setTimeout(() => {
        setStatus("EXECUTING ON ALPHA CLOUD...");
        setTimeout(() => {
            const hasH = circuit.includes('H');
            const res = hasH ? { "00": 0.49, "11": 0.51 } : { "00": 1.00, "11": 0.00 };
            setResult(res);
            setStatus("COMPLETED");
        }, 2000);
    }, 1500);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono relative overflow-hidden">
        {/* KRYV PARTNER WATERMARK (LOGIN SCREEN) */}
        <div className="absolute top-5 right-5 flex items-center gap-2 opacity-80">
            <div className="h-2 w-2 bg-[#00ff41] rounded-full animate-pulse"></div>
            <span className="text-[10px] text-gray-500 tracking-[0.2em]">POWERED BY KRYV.NETWORK</span>
        </div>

        <div className="bg-[#0a0a0a] p-10 border border-[#00ff41]/20 rounded-xl w-96 text-center shadow-[0_0_30px_rgba(0,255,65,0.1)]">
          <h1 className="text-2xl text-white font-bold mb-2 tracking-widest">AlphaParadox<span className="text-purple-500">Qc</span></h1>
          <p className="text-xs text-gray-500 mb-8">QUANTUM SIMULATION ENVIRONMENT</p>
          
          <input type="password" placeholder="ENTER ACCESS KEY" className="w-full bg-black border border-gray-800 p-3 text-white mb-4 focus:border-purple-500 outline-none rounded text-center tracking-widest" />
          <button onClick={handleLogin} className="w-full bg-purple-900/50 text-purple-400 border border-purple-500/50 font-bold p-3 rounded hover:bg-purple-900 transition">INITIALIZE LINK</button>
          
          <p className="mt-6 text-[9px] text-gray-600">SECURED BY KRYV PROTOCOL V2.1</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-gray-300 font-sans relative">
      
      {/* KRYV PLATFORM PARTNER WATERMARK (Always Visible) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-3 border border-[#00ff41]/30 bg-black/80 px-3 py-1 rounded-full backdrop-blur-md">
        <div className="w-3 h-3 bg-[#00ff41] rounded-full shadow-[0_0_10px_#00ff41]"></div>
        <span className="text-[10px] font-bold text-white tracking-widest">KRYV <span className="text-[#00ff41]">PARTNER</span></span>
      </div>

      {/* HEADER */}
      <nav className="border-b border-gray-900 bg-[#050505] p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white tracking-widest">
          AlphaParadox<span className="text-purple-500">Qc</span>
        </h1>
        <div className="text-xs font-mono text-gray-500">NODE: ACTIVE</div>
      </nav>

      <div className="p-4 max-w-4xl mx-auto grid grid-cols-1 gap-6 mt-10">
        
        {/* COMPOSER */}
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 shadow-2xl">
          <h2 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">Quantum Circuit Composer</h2>
          
          <div className="flex gap-4 h-24 items-center justify-center bg-black rounded-lg border border-gray-900 mb-6">
            {circuit.map((gate, i) => (
              <div 
                key={i} 
                onClick={() => handleGridClick(i)}
                className={`w-14 h-14 border border-gray-800 rounded flex items-center justify-center cursor-pointer hover:border-purple-500 transition ${gate ? 'bg-purple-900/20 text-purple-400 border-purple-500' : 'text-gray-700'}`}
              >
                {gate || "+"}
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            {['H', 'X', 'Y', 'Z', 'CNOT'].map(gate => (
              <button 
                key={gate} 
                onClick={() => setSelectedGate(gate)}
                className={`w-12 h-12 border ${selectedGate === gate ? 'border-purple-500 bg-purple-900' : 'border-gray-800 bg-[#111]'} text-white font-bold rounded hover:bg-gray-800 transition`}
              >
                {gate}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS */}
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
          <div className="bg-black h-40 p-4 font-mono text-xs text-purple-400 overflow-y-auto mb-4 border border-gray-900 rounded">
            <p>> SYSTEM READY.</p>
            {status !== "IDLE" && <p className="animate-pulse">> {status}</p>}
            {result && (
              <div className="mt-2 text-white">
                <p>--- PROBABILITY DISTRIBUTION ---</p>
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>
          <button onClick={runSimulation} className="w-full bg-gradient-to-r from-purple-900 to-purple-700 hover:from-purple-800 hover:to-purple-600 text-white p-4 font-bold rounded tracking-widest shadow-lg">
            RUN EXPERIMENT
          </button>
        </div>
      </div>

      {/* 👁️ FOCUSED NEHIRA (SCIENTIST MODE) */}
      <NehiraWidget context="ALPHA_QUANTUM_LAB" />
    </div>
  );
}

