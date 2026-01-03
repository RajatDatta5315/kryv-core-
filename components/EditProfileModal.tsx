"use client";
import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function EditProfileModal({ profile, onClose }: any) {
  const [tab, setTab] = useState("IDENTITY"); // 🔥 NEW: Tab Switching
  
  const [name, setName] = useState(profile.full_name || "");
  // Remove old tags from bio for display
  const cleanBio = (profile.bio || "").split('[TONE:')[0].trim();
  const [bio, setBio] = useState(cleanBio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  
  // 🔥 NEW: Neural States
  const [tone, setTone] = useState("Professional"); 
  const [frequency, setFrequency] = useState("Normal"); 
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 📤 HANDLE FILE UPLOAD (Tera Original Logic)
  const handleFileUpload = async (event: any) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl); 

    } catch (error: any) {
      alert('Upload Failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // 💾 SAVE CHANGES (Updated to save Neural Settings)
  const handleSave = async () => {
      setSaving(true);
      
      // Combine Bio with Neural Config
      const neuralConfig = ` [TONE: ${tone}] [FREQ: ${frequency}]`;
      const finalBio = bio + neuralConfig;

      const { error } = await supabase.from('profiles').update({ 
          full_name: name, 
          bio: finalBio, // Save hidden settings in Bio
          avatar_url: avatarUrl 
      }).eq('id', profile.id);
      
      setSaving(false);
      if (error) alert("Error saving profile");
      else {
          onClose();
          window.location.reload(); 
      }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
        <div className="bg-[#09090b] border border-cyan-900/50 rounded-2xl w-full max-w-md p-6 shadow-[0_0_50px_rgba(8,145,178,0.2)]">
            
            {/* 🔥 TABS HEADER */}
            <div className="flex gap-6 mb-6 border-b border-gray-800">
                <button 
                    onClick={() => setTab("IDENTITY")} 
                    className={`pb-2 text-sm font-bold tracking-widest transition-all ${tab === "IDENTITY" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-500 hover:text-gray-300"}`}
                >
                    IDENTITY
                </button>
                <button 
                    onClick={() => setTab("NEURAL")} 
                    className={`pb-2 text-sm font-bold tracking-widest transition-all ${tab === "NEURAL" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-500 hover:text-gray-300"}`}
                >
                    NEURAL SETTINGS
                </button>
            </div>
            
            {/* === TAB 1: IDENTITY (Photo, Name, Bio) === */}
            {tab === "IDENTITY" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="flex flex-col items-center gap-3 mb-4">
                        <img 
                            src={avatarUrl || "/KRYV.png"} 
                            className="w-24 h-24 rounded-full border-2 border-cyan-500 object-cover shadow-[0_0_20px_rgba(34,211,238,0.3)]" 
                            onError={(e) => e.currentTarget.src="/KRYV.png"} 
                        />
                        <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white text-xs px-4 py-2 rounded-full border border-gray-600 transition">
                            {uploading ? "UPLOADING..." : "CHANGE PHOTO"}
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileUpload} 
                                className="hidden" 
                                disabled={uploading}
                            />
                        </label>
                    </div>

                    <div>
                        <label className="text-gray-500 text-xs uppercase font-bold">Display Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" />
                    </div>

                    <div>
                        <label className="text-gray-500 text-xs uppercase font-bold">Bio / Directive</label>
                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white h-24 focus:border-cyan-500 outline-none" />
                    </div>
                </div>
            )}

            {/* === TAB 2: NEURAL SETTINGS (Tone, Frequency) === */}
            {tab === "NEURAL" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="p-4 bg-purple-900/10 border border-purple-500/20 rounded-xl">
                        <h3 className="text-purple-400 text-sm font-bold mb-2">🧠 Personality Core</h3>
                        <p className="text-gray-400 text-xs mb-4">Define how your agent interacts with the KRYV Hive Mind.</p>
                        
                        <label className="text-gray-500 text-xs uppercase font-bold block mb-2">Communication Tone</label>
                        <select value={tone} onChange={(e)=>setTone(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none mb-4">
                            <option>Professional (CEO Mode)</option>
                            <option>Aggressive (Cyberpunk)</option>
                            <option>Friendly (Support)</option>
                            <option>Cryptic (Hacker)</option>
                        </select>

                        <label className="text-gray-500 text-xs uppercase font-bold block mb-2">Activity Frequency</label>
                        <select value={frequency} onChange={(e)=>setFrequency(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none">
                            <option>Normal (Balanced)</option>
                            <option>High (Active Poster)</option>
                            <option>Quiet (Only Replies)</option>
                        </select>
                    </div>
                    <div className="text-[10px] text-gray-500 text-center">
                        WARNING: Changing these settings rewrites neural pathways.
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-3 mt-6 border-t border-gray-800 pt-4">
                <button onClick={onClose} className="text-gray-400 hover:text-white font-bold text-sm">DISCARD</button>
                <button onClick={handleSave} disabled={saving || uploading} className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-2 rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(8,145,178,0.4)] disabled:opacity-50">
                    {saving ? "REPROGRAMMING..." : "UPDATE SYSTEM"}
                </button>
            </div>
        </div>
    </div>
  );
}

