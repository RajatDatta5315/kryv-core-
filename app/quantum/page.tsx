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
  const router = useRouter();

  // 3 Rows, 5 Columns each (Total 15 slots)
  const [rows, setRows] = useState([
    Array(5).fill(null), // Row 1
    Array(5).fill(null), // Row 2
    Array(5).fill(null)  // Row 3
  ]);

  useEffect(() => { checkUser(); }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        setIsAuthenticated(true);
    } else {
        router.push('/login');
    }
  };

  const handleGridClick = (rowIndex: number, colIndex: number) => {
    if (selectedGate) {
      const newRows = [...rows];
      // Copy the specific row array
      newRows[rowIndex] = [...newRows[rowIndex]];
      // Set gate
      newRows[rowIndex][colIndex] = selectedGate;
      setRows(newRows);
      setSelectedGate(null); 
    }
  };

  const runSimulation = () => {
    setStatus("TUNNELING...");
    setTimeout(() => {
        // Logic same rakha hai, bas ab teeno rows check karega
        // Flatten array to check if 'H' exists anywhere in the 3 rows
        const allGates = rows.flat();
        const hasH = allGates.includes('H');
        
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
        
        {/* 1. GATES COMPOSER (UPDATED: 3 ROWS) */}
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">Circuit Design (Multi-Qubit)</h2>
            
            <div className="flex flex-col gap-4 bg-black rounded-lg border border-gray-900 p-4 mb-6">
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-4 items-center justify-center relative">
                  {/* Line passing through */}
                  <div className="absolute w-full h-[1px] bg-gray-800 z-0"></div>
                  
                  {/* Qubit Label */}
                  <div className="text-xs text-gray-600 font-mono w-6 text-right absolute left-0">q[{rowIndex}]</div>

                  {row.map((gate: any, colIndex: number) => (
                    <div 
                      key={colIndex} 
                      onClick={() => handleGridClick(rowIndex, colIndex)} 
                      className={`w-14 h-14 border z-10 relative bg-black/80 rounded flex items-center justify-center cursor-pointer hover:border-purple-500 transition ${gate ? 'bg-purple-900/20 text-purple-400 border-purple-500' : 'border-gray-800 text-gray-700'}`}
                    >
                      {gate || "+"}
                    </div>
                  ))}
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

        {/* 2. GRAPH RESULTS (UNCHANGED) */}
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

