// app/dashboard/page.tsx
import React from 'react';
import {
  Activity,
  Bot,
  Cpu,
  Database,
  LayoutDashboard,
  Network,
  Server,
  Shield,
  Store,
  Zap,
  AlertCircle,
  Cpu as CpuIcon,
  HardDrive,
  RadioTower,
  BarChart3,
  Clock,
  Wifi,
  WifiOff,
  Users,
  BrainCircuit,
  Lock,
  Unlock
} from 'lucide-react';

// Mock data for AI agents
const mockAgents = [
  {
    id: 1,
    name: 'ORION',
    status: 'active',
    type: 'Strategic Analysis',
    version: 'v3.2.1',
    uptime: '99.8%',
    cpu: 34,
    memory: 68,
    bandwidth: 42,
    security: 'encrypted',
    lastActive: '2 minutes ago',
    efficiency: 94,
    subagents: 3
  },
  {
    id: 2,
    name: 'VELVET',
    status: 'active',
    type: 'Data Synthesis',
    version: 'v2.8.4',
    uptime: '99.9%',
    cpu: 42,
    memory: 72,
    bandwidth: 38,
    security: 'quantum',
    lastActive: '5 minutes ago',
    efficiency: 88,
    subagents: 5
  },
  {
    id: 3,
    name: 'NEXUS',
    status: 'warning',
    type: 'Network Security',
    version: 'v4.1.0',
    uptime: '97.2%',
    cpu: 78,
    memory: 84,
    bandwidth: 91,
    security: 'breach',
    lastActive: '1 minute ago',
    efficiency: 76,
    subagents: 8
  },
  {
    id: 4,
    name: 'CHRONOS',
    status: 'inactive',
    type: 'Temporal Analysis',
    version: 'v1.5.3',
    uptime: '0%',
    cpu: 0,
    memory: 12,
    bandwidth: 0,
    security: 'locked',
    lastActive: '2 hours ago',
    efficiency: 0,
    subagents: 0
  }
];

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Bot, label: 'Agents', active: false },
  { icon: Store, label: 'Marketplace', active: false },
  { icon: Database, label: 'Data Streams', active: false },
  { icon: Shield, label: 'Security', active: false },
  { icon: Network, label: 'Network', active: false },
  { icon: Server, label: 'Infrastructure', active: false },
];

const systemStats = {
  totalAgents: 47,
  activeAgents: 32,
  cpuLoad: 64,
  memoryUsage: 78,
  networkThroughput: '2.4 Gb/s',
  threatsBlocked: 1247,
  totalRequests: '2.8M'
};

const StatusIndicator = ({ status }: { status: string }) => {
  const config: Record<string, { color: string; pulse: boolean }> = {
    active: { color: 'bg-emerald-500', pulse: true },
    warning: { color: 'bg-amber-500', pulse: true },
    inactive: { color: 'bg-red-500', pulse: false },
    breach: { color: 'bg-purple-500', pulse: true }
  };

  const { color, pulse } = config[status] || config.inactive;

  return (
    <div className="flex items-center gap-2">
      <div className={`relative flex h-2 w-2`}>
        {pulse && (
          <div className={`absolute inline-flex h-full w-full animate-ping rounded-full ${color} opacity-75`}></div>
        )}
        <div className={`relative inline-flex h-2 w-2 rounded-full ${color}`}></div>
      </div>
      <span className="text-xs font-medium uppercase tracking-wider text-zinc-300">{status}</span>
    </div>
  );
};

const ResourceBar = ({ value, label }: { value: number; label: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs">
      <span className="text-zinc-400">{label}</span>
      <span className="font-mono text-zinc-300">{value}%</span>
    </div>
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
      <div 
        className={`h-full rounded-full transition-all duration-500 ${
          value > 80 ? 'bg-red-500' : value > 60 ? 'bg-amber-500' : 'bg-emerald-500'
        }`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#050505] text-zinc-100">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-zinc-800 p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-20 blur"></div>
                <BrainCircuit className="relative h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tighter bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  KRYV
                </h1>
                <p className="text-xs text-zinc-500">AI COMMAND CENTER</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all ${
                  item.active
                    ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-emerald-300 border-l-4 border-emerald-500'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* System Status */}
          <div className="border-t border-zinc-800 p-4">
            <div className="rounded-lg bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 p-4 ring-1 ring-zinc-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500">SYSTEM STATUS</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
                    <span className="text-sm font-medium text-emerald-400">OPERATIONAL</span>
                  </div>
                </div>
                <div className="rounded-full bg-emerald-500/20 p-2">
                  <Zap className="h-4 w-4 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Command Dashboard</h2>
              <p className="text-zinc-500">Real-time AI agent monitoring and control</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-20 blur"></div>
                <button className="relative rounded-lg bg-zinc-900 px-6 py-3 font-medium hover:bg-zinc-800">
                  Deploy Agent
                </button>
              </div>
              <div className="rounded-lg bg-zinc-900/50 p-2">
                <Clock className="h-5 w-5 text-zinc-400" />
              </div>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="mb-8 grid grid-cols-4 gap-6">
          {[
            { icon: CpuIcon, label: 'CPU Load', value: `${systemStats.cpuLoad}%`, color: 'from-cyan-500 to-blue-500' },
            { icon: HardDrive, label: 'Memory', value: `${systemStats.memoryUsage}%`, color: 'from-emerald-500 to-green-500' },
            { icon: RadioTower, label: 'Network', value: systemStats.networkThroughput, color: 'from-violet-500 to-purple-500' },
            { icon: Users, label: 'Active Agents', value: systemStats.activeAgents, color: 'from-amber-500 to-orange-500' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 p-6 ring-1 ring-zinc-800/50 hover:ring-zinc-700/50"
            >
              <div className={`absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br ${stat.color} opacity-5 blur-xl group-hover:opacity-10`} />
              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <stat.icon className="h-8 w-8 text-zinc-400" />
                  <div className={`h-2 w-2 animate-pulse rounded-full bg-gradient-to-r ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Agents Section */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold">Active Agents</h3>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-500">Total: {mockAgents.length} deployed</span>
              <div className="h-1.5 w-24 rounded-full bg-zinc-800">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
              </div>
            </div>
          </div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-2 gap-6">
            {mockAgents.map((agent) => (
              <div
                key={agent.id}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/30 to-zinc-950/30 p-6 ring-1 ring-zinc-800/50 hover:ring-zinc-700/50"
              >
                {/* Glow effect based on status */}
                <div className={`absolute inset-0 ${
                  agent.status === 'active' ? 'bg-gradient-to-br from-emerald-500/5 to-cyan-500/5' :
                  agent.status === 'warning' ? 'bg-gradient-to-br from-amber-500/5 to-orange-500/5' :
                  'bg-gradient-to-br from-red-500/5 to-rose-500/5'
                } opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Agent Header */}
                <div className="relative mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`rounded-lg p-2 ${
                          agent.status === 'active' ? 'bg-emerald-500/20' :
                          agent.status === 'warning' ? 'bg-amber-500/20' :
                          'bg-red-500/20'
                        }`}>
                          <Bot className={`h-5 w-5 ${
                            agent.status === 'active' ? 'text-emerald-400' :
                            agent.status === 'warning' ? 'text-amber-400' :
                            'text-red-400'
                          }`} />
                        </div>
                        <StatusIndicator status={agent.status} />
                      </div>
                      <h4 className="text-2xl font-bold tracking-tight mb-1">{agent.name}</h4>
                      <p className="text-sm text-zinc-500">{agent.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 rounded-full bg-zinc-800/50 px-3 py-1">
                        {agent.security === 'encrypted' || agent.security === 'quantum' ? (
                          <Lock className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Unlock className="h-3 w-3 text-red-400" />
                        )}
                        <span className="text-xs font-mono uppercase">{agent.security}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agent Stats */}
                <div className="relative space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Uptime</p>
                      <p className="font-mono text-sm font-medium">{agent.uptime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Version</p>
                      <p className="font-mono text-sm font-medium">{agent.version}</p>
                    </div>
                  </div>

                  <ResourceBar value={agent.cpu} label="CPU" />
                  <ResourceBar value={agent.memory} label="Memory" />
                  <ResourceBar value={agent.bandwidth} label="Bandwidth" />

                  {/* Efficiency Bar */}
                  <div className="pt-4 border-t border-zinc-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-zinc-500">Efficiency</span>
                      <span className={`text-xs font-bold ${
                        agent.efficiency > 90 ? 'text-emerald-400' :
                        agent.efficiency > 70 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {agent.efficiency}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${
                          agent.efficiency > 90 ? 'from-emerald-500 to-cyan-500' :
                          agent.efficiency > 70 ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-500'
                        }`}
                        style={{ width: `${agent.efficiency}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="relative mt-6 pt-6 border-t border-zinc-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-3 w-3 text-zinc-500" />
                      <span className="text-xs text-zinc-500">Last active: {agent.lastActive}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BrainCircuit className="h-3 w-3 text-zinc-500" />
                      <span className="text-xs text-zinc-500">{agent.subagents} subagents</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Stream */}
        <div className="rounded-2xl bg-gradient-to-br from-zinc-900/30 to-zinc-950/30 p-6 ring-1 ring-zinc-800/50">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold">Recent Activity</h3>
            <BarChart3 className="h-5 w-5 text-zinc-500" />
          </div>
          <div className="space-y-4">
            {[
              { agent: 'ORION', action: 'Completed threat analysis', time: '2 min ago', status: 'success' },
              { agent: 'VELVET', action: 'Data synthesis in progress', time: '5 min ago', status: 'processing' },
              { agent: 'NEXUS', action: 'Security protocol activated', time: '8 min ago', status: 'warning' },
              { agent: 'CHRONOS', action: 'System reboot initiated', time: '15 min ago', status: 'inactive' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-4 rounded-lg bg-zinc-900/20 p-4">
                <div className={`rounded-full p-2 ${
                  activity.status === 'success' ? 'bg-emerald-500/20' :
                  activity.status === 'warning' ? 'bg-amber-500/20' :
                  'bg-red-500/20'
                }`}>
                  {activity.status === 'success' ? (
                    <Shield className="h-4 w-4 text-emerald-400" />
                  ) : activity.status === 'warning' ? (
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Server className="h-4 w-4 text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.agent}</p>
                  <p className="text-sm text-zinc-500">{activity.action}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
