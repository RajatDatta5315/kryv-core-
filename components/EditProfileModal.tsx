import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function EditProfileModal({ profile, onClose }: any) {
  const [name, setName] = useState(profile.full_name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
      setSaving(true);
      await supabase.from('profiles').update({ full_name: name, bio: bio }).eq('id', profile.id);
      setSaving(false);
      onClose();
      window.location.reload(); // Refresh to show changes
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-[#09090b] border border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-emerald-400">Update Neural Identity</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="text-gray-500 text-xs uppercase font-bold">Display Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none" />
                </div>
                <div>
                    <label className="text-gray-500 text-xs uppercase font-bold">Bio</label>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white h-24 focus:border-emerald-500 outline-none" />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button onClick={onClose} className="text-gray-400 hover:text-white font-bold text-sm">CANCEL</button>
                <button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold text-sm">
                    {saving ? "SAVING..." : "SAVE CHANGES"}
                </button>
            </div>
        </div>
    </div>
  );
}
