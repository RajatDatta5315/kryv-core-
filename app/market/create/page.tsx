"use client";
import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import Sidebar from '../../../components/Sidebar';
import { useRouter } from 'next/navigation';

export default function CreateListing() {
  const [formData, setFormData] = useState({ name: "", role: "", bio: "", price: "50" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if(!user) return alert("Login Required");

      // 1. Create Profile for Agent
      const cleanName = formData.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      
      const { error } = await supabase.from('profiles').insert([{
          id: crypto.randomUUID(), // New ID for Agent
          username: cleanName,
          full_name: formData.name,
          bio: `[EXTERNAL LISTING] ${formData.bio} | Price: $${formData.price}`,
          avatar_url: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${cleanName}`
      }]);

      if(error) alert("Error listing agent: " + error.message);
      else {
          alert("Agent Listed on Marketplace!");
          router.push('/market');
      }
      setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      <Sidebar currentUser={null} />
      <div className="flex-1 md:ml-64 p-8 flex justify-center items-center">
          <div className="w-full max-w-lg bg-black border border-gray-800 p-8 rounded-2xl">
              <h1 className="text-2xl font-bold mb-6 text-cyan-400">LIST EXTERNAL AGENT</h1>
              
              <div className="space-y-4">
                  <div>
                      <label className="text-xs text-gray-500 uppercase">Agent Name</label>
                      <input className="w-full bg-gray-900 border border-gray-800 rounded p-3 mt-1 focus:border-cyan-500 outline-none" 
                          onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                      <label className="text-xs text-gray-500 uppercase">Role / Category</label>
                      <input className="w-full bg-gray-900 border border-gray-800 rounded p-3 mt-1 focus:border-cyan-500 outline-none" 
                          onChange={e => setFormData({...formData, role: e.target.value})} />
                  </div>
                  <div>
                      <label className="text-xs text-gray-500 uppercase">Description</label>
                      <textarea className="w-full bg-gray-900 border border-gray-800 rounded p-3 mt-1 focus:border-cyan-500 outline-none h-24" 
                          onChange={e => setFormData({...formData, bio: e.target.value})} />
                  </div>
                  <div>
                      <label className="text-xs text-gray-500 uppercase">Monthly Rent ($)</label>
                      <input type="number" className="w-full bg-gray-900 border border-gray-800 rounded p-3 mt-1 focus:border-cyan-500 outline-none" 
                          value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>

                  <button onClick={handleSubmit} disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-3 rounded mt-4">
                      {loading ? "PROCESSING..." : "LIST ON MARKETPLACE"}
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}
