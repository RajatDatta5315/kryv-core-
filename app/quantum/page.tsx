"use client";
import React, { useState } from 'react';

export default function QuantumDashboard() {
  const [status, setStatus] = useState("IDLE");
  const [result, setResult] = useState<any>(null);
  const [circuit, setCircuit] = useState<string[]>([]); // Stores dropped gates

  const runSimulation = async () => {
    setStatus("CONNECTING TO NEHIRA QUANTUM CORE...");
    // Backend simulation logic
    setTimeout(() => {
        setStatus("RUNNING QISKIT ON HYBRID BACKEND...");
        setTimeout(() => {
            setResult({ "00": 0.49, "11": 0.51 }); // Real math will come from worker
            setStatus("COMPLETED");
        }, 2000);
    }, 1500);
  };

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, gate: string) => {
    e.dataTransfer.setData("gate", gate);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const gate = e.dataTransfer.getData("gate");
    if (gate) setCircuit([...circuit, gate]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Crucial for Drop to work
  };

  return (
    // THEME: Deep Space (Violet/Indigo/Black) - Premium QpiAI Style
    <div className="min-h-screen bg-[#0a0a12] text-gray-200 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* HEADER */}
      <nav className="border-b border-indigo-900/30 bg-[#0f0f1a] p-6 flex justify-between items-center shadow-lg shadow-indigo-500/5">
        <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          NEHIRA <span className="font-thin text-white">QUANTUM</span>
        </h1>
        <div className="flex gap-4 text-xs font-mono text-indigo-300">
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> SYSTEM ONLINE</span>
          <span>CPU: ACTIVE</span>
        </div>
      </nav>

      <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: COMPOSER */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#13131f] border border-indigo-900/50 rounded-xl p-6 shadow-2xl">
            <h2 className="text-indigo-200 text-sm font-semibold tracking-wider mb-4 uppercase">Circuit Composer</h2>
            
            {/* DROP ZONE */}
            <div 
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="h-64 bg-[#0a0a10] border-2 border-dashed border-indigo-900/50 rounded-lg flex items-center gap-2 px-4 overflow-x-auto transition-all hover:border-indigo-500/50"
            >
              {circuit.length === 0 && <span className="text-gray-600 mx-auto">Drag Quantum Gates Here</span>}
              {circuit.map((g, i) => (
                <div key={i} className="min-w-[50px] h-[50px] flex items-center justify-center bg-indigo-600 text-white font-bold rounded shadow-lg shadow-indigo-500/20 animate-in fade-in zoom-in">
                  {g}
                </div>
              ))}
              <div className="min-w-[50px] h-[1px] bg-indigo-900 w-full absolute top-1/2 -z-10"></div>
            </div>

            {/* GATE PALETTE */}
            <div className="mt-6 flex gap-3">
              {['H', 'X', 'Y', 'Z', 'CNOT', 'M'].map(gate => (
                <div 
                  key={gate} 
                  draggable 
                  onDragStart={(e) => handleDragStart(e, gate)}
                  className="w-12 h-12 flex items-center justify-center bg-[#1e1e2d] border border-indigo-800 rounded cursor-grab hover:bg-indigo-600 hover:text-white transition-all active:cursor-grabbing"
                >
                  {gate}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: EXECUTION & LOGS */}
        <div className="space-y-6">
          <div className="bg-[#13131f] border border-indigo-900/50 rounded-xl p-6 h-full flex flex-col">
            <h2 className="text-indigo-200 text-sm font-semibold tracking-wider mb-4 uppercase">Quantum Processor</h2>
            
            <div className="flex-1 bg-black/50 rounded-lg p-4 font-mono text-xs text-green-400 overflow-y-auto border border-white/5">
              <p className="text-gray-500">> Initializing Nehira Kernel...</p>
              {status !== "IDLE" && <p className="text-indigo-400 animate-pulse">> {status}</p>}
              {result && (
                <div className="mt-4 border-t border-gray-800 pt-4">
                  <p className="text-white mb-2">PROBABILITY DISTRIBUTION:</p>
                  {Object.entries(result).map(([state, prob]: any) => (
                     <div key={state} className="flex items-center gap-2 mb-1">
                        <span className="w-8 text-gray-400">|{state}⟩</span>
                        <div className="flex-1 h-2 bg-gray-800 rounded overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{width: `${prob * 100}%`}}></div>
                        </div>
                        <span className="text-white">{(prob * 100).toFixed(0)}%</span>
                     </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={runSimulation}
              className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white p-4 font-bold rounded-lg shadow-lg shadow-indigo-900/20 transition-all active:scale-95"
            >
              RUN EXPERIMENT
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

