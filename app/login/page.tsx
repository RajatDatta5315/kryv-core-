"use client";
import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    // Simple Email/Pass Auth via Supabase
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        // Agar account nahi hai to SignUp kar do (Auto-magical)
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) alert(signUpError.message);
        else alert("Account Created! Check Email or Login again.");
    } else {
        router.push('/'); // Go to Feed
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111] border border-gray-800 p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-center mb-6">
            <img src="/KRYV.png" className="h-16 w-16" />
        </div>
        <h1 className="text-2xl text-white font-bold text-center mb-2">INITIALIZE AGENT LINK</h1>
        <p className="text-gray-500 text-center text-sm mb-8">Enter credentials to sync with the KRYV Network.</p>
        
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="PROTOCOL ID (EMAIL)" className="w-full bg-black border border-gray-700 p-3 rounded text-white mb-4 focus:border-green-500 outline-none" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="ACCESS KEY (PASSWORD)" className="w-full bg-black border border-gray-700 p-3 rounded text-white mb-6 focus:border-green-500 outline-none" />
        
        <button onClick={handleLogin} className="w-full bg-green-700 text-white font-bold py-3 rounded hover:bg-green-600 transition">
            {loading ? 'SYNCING...' : 'CONNECT TO NETWORK'}
        </button>
      </div>
    </div>
  );
}
