import React from 'react';

const StatusPanel = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold text-white">System Health</h2>
      <div className="flex space-x-2 mt-2">
        <div className="bg-green-500 h-2 w-2 rounded-full animate-pulse"></div>
        <div className="bg-yellow-500 h-2 w-2 rounded-full animate-pulse"></div>
        <div className="bg-green-500 h-2 w-2 rounded-full animate-pulse"></div>
      </div>
      <div className="mt-4 text-white">
        <p>CPU: 12%</p>
        <p>Memory: 4GB</p>
        <p>Network: Secured</p>
      </div>
    </div>
  );
};

export default StatusPanel;