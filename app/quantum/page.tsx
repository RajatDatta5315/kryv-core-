"use client";
import React, { useState } from 'react';

export default function QuantumDashboard() {
  const [status, setStatus] = useState("IDLE");
  // FIX: Added <any> so TypeScript doesn't cry about data types
  const [result, setResult] = useState<any>(null);

  const runSimulation = async () => {
    setStatus("CONNECTING TO NEHIRA QUANTUM CORE...");
    // Mocking the call for demo
    setTimeout(() => {
        setStatus("RUNNING QISKIT SIMULATION...");
        setTimeout(() => {
            setResult({ "00": 0.49, "11": 0.51 });
            setStatus("COMPLETED");
        }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
      <h1 className="text-4xl font-bold border-b border-green-500 pb-4 mb-8">
        QUANTUM INTERFACE <span className="text-xs animate-pulse">● ONLINE</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* COMPOSER */}
        <div className="border border-green-800 p-4 rounded bg-gray-900">
          <h2 className="text-xl mb-4">CIRCUIT COMPOSER</h2>
          <div className="h-64 border-2 border-dashed border-green-900 flex items-center justify-center text-gray-600">
            [ DRAG GATES HERE: H, X, CNOT ]
          </div>
          <div className="flex gap-2 mt-4">
            {['H', 'X', 'Y', 'Z', 'CNOT'].map(gate => (
              <div key={gate} className="p-2 border border-green-500 cursor-move hover:bg-green-900">
                {gate}
              </div>
            ))}
          </div>
        </div>

        {/* RESULTS */}
        <div className="border border-green-800 p-4 rounded bg-gray-900">
          <h2 className="text-xl mb-4">EXECUTION LOGS</h2>
          <div className="bg-black h-64 p-2 overflow-y-auto text-sm">
            <p>> INITIALIZING SYSTEM...</p>
            <p>> CONNECTED TO NEHIRA BACKEND.</p>
            {status !== "IDLE" && <p className="animate-pulse">> {status}</p>}
            {result && (
              <div className="mt-4 border-t border-gray-700 pt-4">
                <p className="text-white">RESULT (Probabilities):</p>
                <pre className="text-yellow-400">{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>
          <button 
            onClick={runSimulation}
            className="w-full mt-4 bg-green-700 hover:bg-green-600 text-white p-3 font-bold rounded"
          >
            RUN SIMULATION
          </button>
        </div>
      </div>
    </div>
  );
}

