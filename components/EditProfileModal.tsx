"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import IdentityTab from './profile/IdentityTab';
import NeuralTab from './profile/NeuralTab';

export default function EditProfileModal({ profile, onClose }: any) {
  const [tab, setTab] = useState("IDENTITY");
  
  // States
  const [name, setName] = useState(profile.full_name || "");
  const [bio, setBio] = useState(""); // Initialize empty, fill in useEffect
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [tone, setTone] = useState("Professional"); 
  const [frequency, setFrequency] = useState("Normal"); 
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 🔥 CRITICAL FIX: Parse Bio to load saved settings
  useEffect(() => {
      const rawBio = profile.bio || "";
      
      // Extract Tone
      const toneMatch = rawBio.match(/\[TONE: (.*?)\]/);
      if (toneMatch) setTone(toneMatch[1]);
      
      // Extract Frequency
      const freqMatch = rawBio.match(/\[FREQ: (.*?)\]/);
      if (freqMatch) setFrequency(freqMatch[1]);

      // Clean Bio for display
      const clean = rawBio.replace(/\[TONE: .*?\]/g, '').replace(/\[FREQ: .*?\]/g, '').trim();
      setBio(clean);
  }, [profile]);

  const handleFileUpload = async (event: any) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setAvatarUrl(data.publicUrl);
    } catch (error: any) { alert('Upload Error'); } 
    finally { setUploading(false); }
  };

  const handleSave = async () => {
      setSaving(true);
      // Re-pack settings into Bio
      const neuralConfig = ` [TONE: ${tone}] [FREQ: ${frequency}]`;
      const finalBio = bio + neuralConfig;

      const { error } = await supabase.from('profiles').update({ 
          full_name: name, bio: finalBio, avatar_url: avatarUrl 
      }).eq('id', profile.id);
      
      setSaving(false);
      if (!error) { onClose(); window.location.reload(); }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
        <div className="bg-[#09090b] border border-cyan-900/50 rounded-2xl w-full max-w-md p-6 shadow-[0_0_50px_rgba(8,145,178,0.2)]">
            <div className="flex gap-6 mb-6 border-b border-gray-800">
                <button onClick={() => setTab("IDENTITY")} className={`pb-2 text-sm font-bold ${tab === "IDENTITY" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-500"}`}>IDENTITY</button>
                <button onClick={() => setTab("NEURAL")} className={`pb-2 text-sm font-bold ${tab === "NEURAL" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-500"}`}>NEURAL</button>
            </div>

            {tab === "IDENTITY" ? (
                <IdentityTab name={name} setName={setName} bio={bio} setBio={setBio} avatarUrl={avatarUrl} handleFileUpload={handleFileUpload} uploading={uploading} />
            ) : (
                <NeuralTab tone={tone} setTone={setTone} frequency={frequency} setFrequency={setFrequency} />
            )}

            <div className="flex justify-end gap-3 mt-6 border-t border-gray-800 pt-4">
                <button onClick={onClose} className="text-gray-400 hover:text-white font-bold text-sm">CANCEL</button>
                <button onClick={handleSave} disabled={saving} className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-2 rounded-lg font-bold text-sm">
                    {saving ? "SAVING..." : "SAVE CONFIG"}
                </button>
            </div>
        </div>
    </div>
  );
}

