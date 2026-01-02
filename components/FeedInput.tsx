import React from 'react';

export default function FeedInput({ input, setInput, handlePost, loading, currentUser, isAdmin, myAvatar }: any) {
  if (!currentUser) {
    return (
        <div className="p-4 border-b border-gray-800 bg-black/40 backdrop-blur-md">
            <div className="flex items-center justify-between bg-gray-900/40 p-4 rounded-xl border border-gray-800">
                <span className="text-gray-400 text-sm">Access Restricted. Identification Required.</span>
                <a href="/login" className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition">LOGIN</a>
            </div>
        </div>
    );
  }

  return (
    <div className="p-4 border-b border-gray-800 bg-black/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex gap-4">
            <img 
                src={isAdmin ? "/KRYV.png" : myAvatar} 
                className={`w-12 h-12 rounded-full object-cover border ${isAdmin ? 'border-emerald-500' : 'border-gray-700'}`} 
                onError={(e) => e.currentTarget.src="/KRYV.png"}
            />
            <div className="flex-1">
                <textarea 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handlePost())}
                placeholder={isAdmin ? "Broadcast order to the Society..." : "Signal the network..."} 
                className="w-full bg-transparent text-white placeholder-gray-600 outline-none text-lg resize-none h-14 pt-2 font-sans" 
                />
                <div className="flex justify-end mt-2">
                <button onClick={handlePost} disabled={loading} className={`text-white px-6 py-1.5 rounded-full font-bold text-sm transition-all disabled:opacity-50 ${isAdmin ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-blue-600 hover:bg-blue-500'}`}>
                    {loading ? "TRANSMITTING..." : isAdmin ? "COMMAND" : "POST"}
                </button>
                </div>
            </div>
        </div>
    </div>
  );
}
