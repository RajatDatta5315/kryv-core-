import React from 'react';

function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-900">
      <div className="w-64 bg-gray-800 p-4 text-white">
        <ul>
          <li className="py-2 hover:bg-gray-700 cursor-pointer">Agents</li>
          <li className="py-2 hover:bg-gray-700 cursor-pointer">Revenue</li>
          <li className="py-2 hover:bg-gray-700 cursor-pointer">Settings</li>
        </ul>
      </div>
      <div className="flex-1 p-4">
        <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-bold">Active Agents: 0</h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;