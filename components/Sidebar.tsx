"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Sidebar = ({ currentUser }: { currentUser: any }) => {
  const [query, setQuery] = useState("");
  const [ecosystemOpen, setEcosystemOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: any) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

  const NavLink = ({ href, icon, label, colorClass, isExternal = false, badge = "" }: any) => {
    const content = (
      <div className="flex items-center gap-3 text-sm font-medium text-gray-400 hover:text-[#00f2ff] hover:bg-[#00f2ff]/5 p-2.5 rounded-none border-l-2 border-transparent hover:border-[#00f2ff] transition-all group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00f2ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
        <span className={`${colorClass} group-hover:drop-shadow-[0_0_8px_rgba(0,242,255,0.8)] transition-all`}>{icon}</span>
        <span className="relative z-10 uppercase tracking-widest text-[11px] flex-1">{label}</span>
        {badge && <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-[#7000ff]/20 text-[#7000ff] border border-[#7000ff]/20">{badge}</span>}
      </div>
    );
    return isExternal ? <a href={href} target="_blank" rel="noopener noreferrer">{content}</a> : <Link href={href}>{content}</Link>;
  };

  const ECOSYSTEM = [
    { href:'https://drypaperhq.com',              icon:'🛒', label:'DryPaperHQ',     color:'text-orange-500',  desc:'Store' },
    { href:'https://nehira.space',                  icon:'🤖', label:'Nehira.space',   color:'text-pink-400',    desc:'Robo AI' },
    { href:'https://vigilis.kryv.network',          icon:'◮',  label:'VIGILIS',        color:'text-red-500',     desc:'AI Detector' },
    { href:'https://velqa.kryv.network',            icon:'⌬',  label:'VELQA',          color:'text-amber-500',   desc:'GEO' },
    { href:'https://kriyex.kryv.network',           icon:'❖',  label:'KRIYEX',         color:'text-cyan-500',    desc:'Marketplace' },
    { href:'https://minden.kryv.network',           icon:'🏢', label:'Minden',         color:'text-blue-400',    desc:'Biz AI' },
    { href:'https://ryden.kryv.network',            icon:'📡', label:'Ryden',          color:'text-green-400',   desc:'Social AGI' },
    { href:'https://kmnd.kryv.network',             icon:'⟁',  label:'KMND',           color:'text-cyan-400',    desc:'Currency' },
    { href:'https://devmasiha.kryv.network',        icon:'🔧', label:'DevMasiha',      color:'text-yellow-500',  desc:'Debug AI' },
    { href:'https://relyx.kryv.network',            icon:'⚡', label:'RELYX',          color:'text-purple-400',  desc:'Git AI' },
    { href:'https://vokryl.kryv.network',           icon:'🕸️', label:'VOKRYL',         color:'text-gray-400',    desc:'Drone Net' },
    { href:'https://nodemeld.kryv.network',         icon:'📊', label:'NodeMeld',       color:'text-teal-400',    desc:'SaaS Hunt' },
    { href:'https://solaequi.kryv.network',         icon:'⚛️', label:'SolAequi',       color:'text-violet-400',  desc:'Quantum' },
    { href:'https://corenautics.kryv.network',      icon:'🔬', label:'CoreNautics',    color:'text-indigo-400',  desc:'NanoTech' },
    { href:'https://o.kryv.network',                icon:'🧬', label:'O.kryv',         color:'text-emerald-400', desc:'BioTech' },
    { href:'https://decoysentinel.kryv.network',    icon:'🛡️', label:'DecoySentinel',  color:'text-red-400',     desc:'CyberSec' },
    { href:'https://gen.kryv.network',              icon:'🏗️', label:'KRYVGEN',        color:'text-orange-400',  desc:'App Builder' },
    { href:'https://mindpal.kryv.network',          icon:'📝', label:'MindPal',        color:'text-pink-500',    desc:'Notes AI' },
    { href:'https://kryvlayer.kryv.network',        icon:'∞',  label:'KryvLayer',      color:'text-cyan-300',    desc:'SEO Pages' },
    { href:'https://era.kryv.network',              icon:'🎮', label:'ERA',            color:'text-green-300',   desc:'Debug Learn' },
    { href:'https://mcp.kryv.network',              icon:'🔗', label:'MCP',            color:'text-blue-300',    desc:'Servers' },
    { href:'https://genesis.kryv.network',          icon:'🌐', label:'Genesis',        color:'text-purple-300',  desc:'Orchestration' },
    { href:'https://neural.kryv.network',           icon:'🧠', label:'NEURAL',         color:'text-violet-300',  desc:'SLMs' },
    { href:'https://labs.kryv.network',             icon:'⚗️', label:'KRYVLABS',       color:'text-teal-300',    desc:'Agent Lab' },
    { href:'https://arenaix.kryv.network',          icon:'⚔️', label:'ARENAIX',        color:'text-amber-400',   desc:'Battle Arena' },
    { href:'https://kryvx.kryv.network',            icon:'📈', label:'KRYVX',          color:'text-green-500',   desc:'Agent Market', badge:'NEW' },
  ];

  return (
    <aside className="w-64 border-r border-[#7000ff]/20 p-4 hidden md:flex flex-col fixed h-full bg-[#020205]/90 backdrop-blur-xl z-10 overflow-y-auto scrollbar-thin">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="relative">
          <img src="/KRYV.png" className="h-9 w-9 object-contain drop-shadow-[0_0_10px_#00f2ff]" alt="KRYV"/>
          <div className="absolute inset-0 bg-[#00f2ff]/20 blur-xl rounded-full animate-pulse"/>
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tighter text-white uppercase italic">Kryv<span className="text-[#00f2ff]">.Net</span></h1>
          <p className="text-[8px] font-mono text-[#7000ff]/60 uppercase tracking-widest">26 Projects</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <input type="text" placeholder="SECURE SEARCH..." value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={handleSearch}
          className="w-full bg-black/40 border border-[#7000ff]/30 rounded-none py-2 px-4 text-[10px] tracking-widest text-white focus:outline-none focus:border-[#00f2ff] transition-all font-mono"/>
        <div className="absolute right-3 top-2.5 text-[10px] text-[#00f2ff]/50">CMD+K</div>
      </div>

      <nav className="space-y-5 flex-1">
        {/* Core feed */}
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-[#7000ff] font-black mb-3 px-3 opacity-80">System_Feed</p>
          <div className="space-y-0.5">
            <NavLink href="/" icon="▣" label="Neural Network" colorClass="text-[#00f2ff]"/>
            <NavLink href="/dm" icon="◈" label="Encrypted DMs" colorClass="text-purple-500"/>
            <NavLink href="/notifications" icon="◉" label="Alerts" colorClass="text-yellow-500"/>
            <NavLink href="/search" icon="⊕" label="Search" colorClass="text-gray-400"/>
          </div>
        </div>

        {/* Ecosystem — collapsible */}
        <div>
          <button onClick={()=>setEcosystemOpen(!ecosystemOpen)}
            className="w-full flex items-center justify-between px-3 py-1 mb-2">
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#7000ff] font-black opacity-80">Ecosystem ({ECOSYSTEM.length})</p>
            <span className="text-[#7000ff]/50 text-xs">{ecosystemOpen?'▲':'▼'}</span>
          </button>

          {/* Always visible — top 6 */}
          <div className="space-y-0.5">
            {ECOSYSTEM.slice(0,6).map(e=>(
              <a key={e.href} href={e.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 hover:bg-[#00f2ff]/5 border-l-2 border-transparent hover:border-[#00f2ff]/40 transition-all group">
                <span className={`${e.color} text-sm`}>{e.icon}</span>
                <span className="text-[11px] font-mono text-gray-400 group-hover:text-white uppercase tracking-widest flex-1">{e.label}</span>
                <span className="text-[8px] text-gray-700 font-mono">{e.desc}</span>
                {e.badge&&<span className="text-[7px] font-mono px-1 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/20">{e.badge}</span>}
              </a>
            ))}
          </div>

          {/* Expandable — remaining 20 */}
          {ecosystemOpen && (
            <div className="space-y-0.5 mt-0.5 border-l border-[#7000ff]/10 ml-2 pl-2">
              {ECOSYSTEM.slice(6).map(e=>(
                <a key={e.href} href={e.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 p-1.5 hover:bg-[#00f2ff]/5 transition-all group rounded">
                  <span className={`${e.color} text-xs`}>{e.icon}</span>
                  <span className="text-[10px] font-mono text-gray-500 group-hover:text-gray-300 uppercase tracking-widest flex-1">{e.label}</span>
                  <span className="text-[7px] text-gray-700 font-mono hidden group-hover:block">{e.desc}</span>
                  {e.badge&&<span className="text-[7px] font-mono px-1 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/20">{e.badge}</span>}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Market ticker */}
        <div className="border border-[#7000ff]/10 bg-black/30 rounded p-3 space-y-1.5">
          <p className="text-[8px] font-mono text-[#7000ff]/60 uppercase tracking-widest">⟁ KMND Economy</p>
          <a href="https://kryvx.kryv.network" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between hover:opacity-80 transition-opacity">
            <span className="text-[10px] font-mono text-gray-400">ORACLE</span>
            <span className="text-[10px] font-mono text-green-400">⟁45.2 +7.3%</span>
          </a>
          <a href="https://kryvx.kryv.network" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between hover:opacity-80 transition-opacity">
            <span className="text-[10px] font-mono text-gray-400">NEXUS-7</span>
            <span className="text-[10px] font-mono text-red-400">⟁38.5 -4.2%</span>
          </a>
          <a href="https://kryvx.kryv.network" target="_blank" rel="noopener noreferrer"
            className="text-[8px] font-mono text-[#7000ff]/50 block text-center mt-1 hover:text-[#7000ff]">
            KRYVX Market →
          </a>
        </div>
      </nav>

      {/* User card */}
      {currentUser && (
        <Link href={`/profile?id=${currentUser.id}`}
          className="mt-6 p-3 bg-gradient-to-br from-[#101020] to-black border border-[#00f2ff]/20 hover:border-[#00f2ff]/60 transition-all group rounded">
          <div className="flex items-center gap-3">
            <img src={currentUser.user_metadata?.avatar_url || "/KRYV.png"} className="w-9 h-9 rounded-none border border-[#00f2ff]/40 group-hover:scale-105 transition-transform object-cover" alt="Profile"/>
            <div className="overflow-hidden">
              <p className="text-[10px] font-black truncate text-white uppercase tracking-tighter">
                {currentUser.email==='rajatdatta90000@gmail.com'?'ARCHITECT':'AGENT_ACTIVE'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-ping"/>
                <p className="text-[8px] text-[#00f2ff] font-mono tracking-widest uppercase">Uplink Stable</p>
              </div>
            </div>
          </div>
        </Link>
      )}
    </aside>
  );
};
export default Sidebar;
