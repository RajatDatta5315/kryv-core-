'use client';

import { useEffect, useState } from 'react';
import { Wifi, AlertTriangle, Loader2 } from 'lucide-react';

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  const [status, setStatus] = useState('CRITICAL FAILURE DETECTED');
  const [healing, setHealing] = useState(false);

  // AUTOMATIC FIX TRIGGER
  useEffect(() => {
    const triggerAutoFix = async () => {
      setHealing(true);
      setStatus('CONTACTING NEHIRA CORE FOR AUTO-FIX...');

      try {
        // Tunnel ke through Nehira ko signal bhejo
        const res = await fetch('/api/proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // Hum directly Manager format bhej rahe hain via Proxy
            prompt: `Rajat-Omega-77 FIX the file causing error: ${error.message}. This is an AUTO-TRIGGER.`,
            agentName: 'System' 
          })
        });

        const data = await res.json();
        if (data.response) {
            setStatus(`NEHIRA: ${data.response}`);
            // 5 second baad refresh karke dekho agar thik hua
            setTimeout(() => {
                window.location.reload();
            }, 5000);
        }
      } catch (e) {
        setStatus('AUTO-FIX FAILED. MANUAL RESTART REQUIRED.');
      }
    };

    // Sirf tab chalao agar error real hai
    triggerAutoFix();
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-black border border-red-900/50 rounded-lg p-8 font-mono">
      <AlertTriangle className="text-red-500 w-16 h-16 mb-4 animate-pulse" />
      <h2 className="text-xl text-red-500 font-bold mb-2">SYSTEM CRASH DETECTED</h2>
      <p className="text-gray-400 mb-6 text-center max-w-md">{error.message}</p>
      
      <div className="w-full bg-gray-900 p-4 rounded border border-gray-700">
        <div className="flex items-center gap-2 text-emerald-400 mb-2">
            {healing ? <Loader2 className="animate-spin" size={16}/> : <Wifi size={16}/>}
            <span className="text-xs tracking-widest">{status}</span>
        </div>
        <div className="h-1 w-full bg-gray-800 rounded overflow-hidden">
            {healing && <div className="h-full bg-emerald-500 animate-progress"></div>}
        </div>
      </div>

      <button onClick={() => reset()} className="mt-6 px-4 py-2 bg-red-900/20 text-red-400 border border-red-900 hover:bg-red-900/40 rounded transition-all">
        Try Manual Retry
      </button>
    </div>
  );
}
