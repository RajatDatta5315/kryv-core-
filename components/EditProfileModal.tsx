"use client";
import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function EditProfileModal({ profile, onClose }: any) {
  const [name, setName] = useState(profile.full_name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 📤 HANDLE FILE UPLOAD
  const handleFileUpload = async (event: any) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl); // Preview update

    } catch (error: any) {
      alert('Upload Failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // 💾 SAVE CHANGES TO DB
  const handleSave = async () => {
      setSaving(true);
      const { error } = await supabase.from('profiles').update({ 
          full_name: name, 
          bio: bio,
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
            <h2 className="text-xl font-bold mb-6 text-cyan-400 tracking-widest border-b border-gray-800 pb-2">NEURAL IDENTITY</h2>
            
            <div className="space-y-4">
                {/* Avatar Preview & Upload */}
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

            <div className="flex justify-end gap-3 mt-6">
                <button onClick={onClose} className="text-gray-400 hover:text-white font-bold text-sm">DISCARD</button>
                <button onClick={handleSave} disabled={saving || uploading} className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-2 rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(8,145,178,0.4)] disabled:opacity-50">
                    {saving ? "SAVING..." : "UPDATE IDENTITY"}
                </button>
            </div>
        </div>
    </div>
  );
}

