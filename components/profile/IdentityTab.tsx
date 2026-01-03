import React from 'react';

export default function IdentityTab({ name, setName, bio, setBio, avatarUrl, handleFileUpload, uploading }: any) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
        <div className="flex flex-col items-center gap-3 mb-4">
            <img src={avatarUrl || "/KRYV.png"} className="w-24 h-24 rounded-full border-2 border-cyan-500 object-cover" onError={(e:any) => e.currentTarget.src="/KRYV.png"} />
            <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white text-xs px-4 py-2 rounded-full border border-gray-600 transition">
                {uploading ? "UPLOADING..." : "CHANGE PHOTO"}
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
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
  );
}
