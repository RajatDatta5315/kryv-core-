export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col gap-8 bg-[#09090b]">
        <h1 className="text-3xl font-bold tracking-widest text-white">
          KRYV<span className="text-green-500">_</span>
        </h1>
        
        <nav className="flex flex-col gap-2 text-sm font-medium text-gray-400">
          <div className="p-3 bg-white/5 rounded-lg text-white cursor-pointer hover:bg-white/10 transition-all border border-white/5">
            ⚡ Dashboard
          </div>
          <div className="p-3 cursor-pointer hover:bg-white/5 hover:text-white rounded-lg transition-all">
            🤖 My Agents
          </div>
          <div className="p-3 cursor-pointer hover:bg-white/5 hover:text-white rounded-lg transition-all">
            💰 Revenue
          </div>
          <div className="p-3 cursor-pointer hover:bg-white/5 hover:text-white rounded-lg transition-all">
            ⚙️ Settings
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <p className="text-xs text-gray-600 uppercase tracking-wider">Plan: Architect</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-2xl font-light text-white">Command Center</h2>
            <p className="text-gray-500 text-sm mt-1">Welcome back, Architect.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-green-500 font-mono tracking-widest">SYSTEM ONLINE</span>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-xl border border-white/10 bg-[#09090b] shadow-2xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-bl-full transition-all group-hover:bg-green-500/20"></div>
            <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-4">Active Agents</h3>
            <p className="text-5xl font-bold text-white">0</p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl border border-white/10 bg-[#09090b] shadow-2xl relative group overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-bl-full transition-all group-hover:bg-purple-500/20"></div>
            <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-4">Total Revenue</h3>
            <p className="text-5xl font-bold text-green-400">$0.00</p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-xl border border-white/10 bg-[#09090b] shadow-2xl relative group overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full transition-all group-hover:bg-blue-500/20"></div>
            <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-4">Server Load</h3>
            <div className="flex items-end gap-2 mt-2">
              <div className="w-2 h-8 bg-green-500/50 rounded-sm"></div>
              <div className="w-2 h-12 bg-green-500/70 rounded-sm"></div>
              <div className="w-2 h-6 bg-green-500/40 rounded-sm"></div>
              <div className="w-2 h-10 bg-green-500/60 rounded-sm"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-mono">OPTIMAL</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="mt-10 border border-dashed border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-2xl">
            🤖
          </div>
          <h3 className="text-white font-medium mb-2">No Agents Deployed</h3>
          <p className="text-gray-500 text-sm max-w-md mb-6">
            Your empire is empty. Use Nehira to deploy your first automated worker.
          </p>
          <button className="px-6 py-2 bg-white text-black font-bold text-sm rounded hover:bg-gray-200 transition-colors">
            + Deploy New Agent
          </button>
        </div>
      </main>
    </div>
  );
}

