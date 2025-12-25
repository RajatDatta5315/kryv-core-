```tsx
import React from 'react';

const Dashboard = () => {
  return (
    <div className="h-screen w-screen bg-zinc-950 flex">
      <div className="sidebar w-64 h-screen bg-white/5 border-white/10 backdrop-blur-xl flex flex-col py-4">
        <svg
          className="w-6 h-6 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <nav className="flex flex-col space-y-2">
          <a
            href="#"
            className="text-white/80 hover:text-white transition-all hover:scale-105 py-2 px-4"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="text-white/80 hover:text-white transition-all hover:scale-105 py-2 px-4"
          >
            Agents
          </a>
          <a
            href="#"
            className="text-white/80 hover:text-white transition-all hover:scale-105 py-2 px-4"
          >
            Settings
          </a>
        </nav>
      </div>
      <div className="flex-1 p-4">
        <h1 className="text-3xl font-bold text-white mb-4">Agent Grid</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="bg-white/5 border border-gray-700 border-opacity-50 rounded-lg p-4 hover:scale-105 transition-all"
            style={{
              borderImageSource: 'linear-gradient(360deg, #03d7fc, #ff69b4)',
              borderImageSlice: '1',
              imageRendering: 'pixelated',
            }}
          >
            <h2 className="text-lg font-bold text-white mb-2">Orion - Market Sniper</h2>
            <p className="text-sm text-white/80 mb-2">Status: Active</p>
            <p className="text-sm text-white/80 mb-2">Earnings: $450</p>
          </div>
          <div
            className="bg-white/5 border border-gray-700 border-opacity-50 rounded-lg p-4 hover:scale-105 transition-all"
            style={{
              borderImageSource: 'linear-gradient(360deg, #ff69b4, #03d7fc)',
              borderImageSlice: '1',
              imageRendering: 'pixelated',
            }}
          >
            <h2 className="text-lg font-bold text-white mb-2">Velvet - Content Creator</h2>
            <p className="text-sm text-white/80 mb-2">Status: Idle</p>
            <p className="text-sm text-white/80 mb-2">Earnings: $0</p>
          </div>
          <div
            className="bg-white/5 border border-gray-700 border-opacity-50 rounded-lg p-4 hover:scale-105 transition-all"
            style={{
              borderImageSource: 'linear-gradient(360deg, #03d7fc, #8e44ad)',
              borderImageSlice: '1',
              imageRendering: 'pixelated',
            }}
          >
            <h2 className="text-lg font-bold text-white mb-2">Nexus - Code Builder</h2>
            <p className="text-sm text-white/80 mb-2">Status: Training</p>
            <p className="text-sm text-white/80 mb-2">Earnings: $0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```