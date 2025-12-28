"use client";
import React, { useState } from 'react';

export default function QuantumDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [circuit, setCircuit] = useState<string[]>(Array(5).fill(null)); // 5 Slots
  const [status, setStatus] = useState("IDLE");
  const [result, setResult] = useState<any>(null);

  const handleLogin = () => setIsLoggedIn(true);

  const handleGridClick = (index: number) => {
    if (selectedGate) {
      const newCircuit = [...circuit];
      newCircuit[index] = selectedGate;
      setCircuit(newCircuit);
      setSelectedGate(null); // Deselect after placing
    }
  };

  const runSimulation = async () => {
    setStatus("INITIALIZING QUBITS...");
    setTimeout(() => {
        setStatus("EXECUTING ON CLOUD SIMULATOR...");
        setTimeout(() => {
            // Real-looking Math based on gates
            const hasH = circuit.includes('H');
            const res = hasH ? { "00": 0.49, "11": 0.51 } : { "00": 1.00, "11": 0.00 };
            setResult(res);
            setStatus("COMPLETED");
        }, 2000);
    }, 1500);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="bg-gray-900 p-8 border border-green-800 rounded-lg w-80 text-center">
          <h1 className="text-2xl text-green-500 mb-6 tracking-widest">KRYV ACCESS</h1>
          <input type="password" placeholder="ENTER KEY" className="w-full bg-black border border-gray-700 p-2 text-white mb-4 focus:border-green-500 outline-none" />
          <button onClick={handleLogin} className="w-full bg-green-700 text-black font-bold p-2 hover:bg-green-600">AUTHENTICATE</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans">
      {/* HEADER - NO NEHIRA BRANDING */}
      <nav className="border-b border-gray-800 bg-[#0a0a0a] p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white tracking-widest">
          QUANTUM <span className="text-purple-500">CORE</span>
        </h1>
        <div className="text-xs font-mono text-gray-500">V.2.0.4 | CONNECTED</div>
      </nav>

      <div className="p-4 grid grid-cols-1 gap-6">
        
        {/* COMPOSER (CLICK BASED) */}
        <div className="bg-[#0f0f0f] border border-gray-800 rounded p-4">
          <h2 className="text-xs font-bold text-gray-500 mb-4 uppercase">Circuit Design (Tap to Place)</h2>
          
          {/* GRID */}
          <div className="flex gap-2 h-20 items-center justify-center bg-black rounded border border-gray-800 mb-4">
            {circuit.map((gate, i) => (
              <div 
                key={i} 
                onClick={() => handleGridClick(i)}
                className={`w-12 h-12 border border-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-800 ${gate ? 'bg-purple-900 text-white' : 'text-gray-600'}`}
              >
                {gate || "+"}
              </div>
            ))}
          </div>

          {/* PALETTE */}
          <div className="flex gap-2 justify-center">
            {['H', 'X', 'Y', 'Z', 'CNOT'].map(gate => (
              <button 
                key={gate} 
                onClick={() => setSelectedGate(gate)}
                className={`w-12 h-12 border ${selectedGate === gate ? 'border-purple-500 bg-purple-900/50' : 'border-gray-700 bg-[#1a1a1a]'} text-white font-bold rounded`}
              >
                {gate}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">
            {selectedGate ? `Selected: [ ${selectedGate} ] - Tap box above` : "Tap a gate to select"}
          </p>
        </div>

        {/* RESULTS */}
        <div className="bg-[#0f0f0f] border border-gray-800 rounded p-4">
          <div className="bg-black h-40 p-2 font-mono text-xs text-purple-400 overflow-y-auto mb-4 border border-gray-900">
            <p>> SYSTEM READY.</p>
            {status !== "IDLE" && <p className="animate-pulse">> {status}</p>}
            {result && (
              <div className="mt-2 text-white">
                <p>--- RESULTS ---</p>
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>
          <button onClick={runSimulation} className="w-full bg-purple-700 hover:bg-purple-600 text-white p-3 font-bold rounded">
            EXECUTE CIRCUIT
          </button>
        </div>
      </div>
    </div>
  );
}

