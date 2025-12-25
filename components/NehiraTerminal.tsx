"use client";

import { useState } from "react";

export default function NehiraTerminal() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("NEHIRA SYSTEM: ONLINE. WAITING FOR INPUT...");
  const [loading, setLoading] = useState(false);

  const handleCommand = async () => {
    if (!input) return;
    setLoading(true);
    const originalInput = input;
    setInput(""); // Clear input
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ prompt: originalInput }),
      });
      const data = await res.json();
      
      // AI ka jawab extract karna
      const aiReply = data.choices?.[0]?.message?.content || "SYSTEM ERROR: NO RESPONSE";
      setOutput((prev) => prev + `\n\n> USER: ${originalInput}\n> NEHIRA: ${aiReply}`);
    } catch (error) {
      setOutput((prev) => prev + `\n\n> SYSTEM ERROR: CONNECTION FAILED`);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mt-8 border border-kryv-green/40 bg-black/90 p-4 rounded-sm font-mono text-sm shadow-[0_0_30px_rgba(0,255,65,0.1)]">
      <div className="h-64 overflow-y-auto mb-4 text-kryv-green whitespace-pre-wrap p-2 border-b border-kryv-green/20 scrollbar-hide">
        {output}
        {loading && <span className="animate-pulse">_ PROCESSING...</span>}
      </div>
      
      <div className="flex gap-2">
        <span className="text-kryv-purple py-2">{">"}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ENTER COMMAND..."
          className="flex-1 bg-transparent border-none outline-none text-kryv-green placeholder-gray-700"
          onKeyDown={(e) => e.key === "Enter" && handleCommand()}
        />
        <button 
          onClick={handleCommand}
          className="bg-kryv-green text-black px-4 py-1 font-bold hover:bg-white transition-colors"
        >
          EXE
        </button>
      </div>
    </div>
  );
}
