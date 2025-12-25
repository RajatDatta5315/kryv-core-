export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#09090b] text-gray-100 font-sans selection:bg-green-500/30">
      {/* Sidebar - Glassmorphism Manual */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-white/5 bg-[#09090b]/80 backdrop-blur-xl z-50 flex flex-col p-6">
        <div className="mb-10 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
          <h1 className="text-xl font-bold tracking-[0.2em] text-white">KRYV_</h1>
        </div>
        
        <nav className="space-y-2">
          {['Dashboard', 'Agents', 'Revenue', 'Settings'].map((item) => (
            <div key={item} className="cursor-pointer rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:border-white/10 hover:bg-white/5 hover:text-white">
              {item}
            </div>
          ))}
        </nav>
        
        <div className="mt-auto border-t border-white/5 pt-6">
          <div className="text-xs uppercase tracking-widest text-gray-600">Status: Architect</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-10">
        <header className="mb-12 flex justify-between items-end border-b border-white/5 pb-6">
          <div>
            <h2 className="text-3xl font-light text-white">Command Center</h2>
            <p className="mt-2 text-sm text-gray-500">Overview of your Agentic Empire</p>
          </div>
          <div className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1 text-xs font-bold text-green-500">
            SYSTEM ONLINE
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { label: 'Active Agents', val: '3', color: 'text-white' },
            { label: 'Monthly Revenue', val: '$450.00', color: 'text-green-400' },
            { label: 'System Load', val: '12%', color: 'text-blue-400' }
          ].map((stat, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl border border-white/5 bg-[#121214] p-8 shadow-2xl transition-all hover:border-white/10">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-4">{stat.label}</div>
              <div className={`text-5xl font-bold ${stat.color}`}>{stat.val}</div>
            </div>
          ))}
        </div>

        {/* Agent Grid */}
        <h3 className="mt-12 mb-6 text-sm uppercase tracking-widest text-gray-500">Deployed Units</h3>
        <div className="grid gap-4">
          {[
            { name: 'Orion', role: 'Market Sniper', status: 'Active', profit: '+$320' },
            { name: 'Velvet', role: 'Content Creator', status: 'Idle', profit: '+$130' },
            { name: 'Nexus', role: 'Code Builder', status: 'Training', profit: '$0' }
          ].map((agent, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-white/5 bg-[#121214] p-4 transition-all hover:bg-white/5">
              <div className="flex items-center gap-4">
                <div className={`h-2 w-2 rounded-full ${agent.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <div>
                  <div className="font-bold text-white">{agent.name}</div>
                  <div className="text-xs text-gray-500">{agent.role}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono text-green-400">{agent.profit}</div>
                <div className="text-xs text-gray-600">{agent.status}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

