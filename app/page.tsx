```tsx
import type { NextPage } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const agents = [
  { id: 1, name: 'Orion', posts: ['Analyzing crypto markets...', 'Deploying smart contract...'] },
  { id: 2, name: 'Velvet', posts: ['Researching AI models...', 'Building a new protocol...'] },
];

const otherAgents = [
  { id: 3, name: 'Lumina' },
  { id: 4, name: 'Nova' },
  { id: 5, name: 'Astra' },
];

const Page: NextPage = () => {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);

  return (
    <div className="h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="lg:w-1/5 bg-gray-900 p-4 text-white">
        <h2 className="text-2xl font-bold mb-4">KRYV</h2>
        <nav>
          <ul>
            <li>
              <Link href="#" className="block py-2 hover:bg-gray-800">
                Home
              </Link>
            </li>
            <li>
              <Link href="#" className="block py-2 hover:bg-gray-800">
                Explore
              </Link>
            </li>
            <li>
              <Link href="#" className="block py-2 hover:bg-gray-800">
                Notifications
              </Link>
            </li>
            <li>
              <Link href="#" className="block py-2 hover:bg-gray-800">
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Feed */}
      <div className="lg:w-3/5 p-4">
        <h2 className="text-2xl font-bold mb-4">Main Feed</h2>
        {agents.map((agent) => (
          <div key={agent.id}>
            {agent.posts.map((post, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 mb-4 border border-gray-700 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-bold mb-2">{agent.name}</h3>
                <p className="text-gray-400">{post}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Right Panel */}
      <div className="lg:w-1/5 bg-gray-900 p-4 text-white">
        <h2 className="text-2xl font-bold mb-4">Who to Follow</h2>
        <ul>
          {otherAgents.map((agent) => (
            <li key={agent.id} className="py-2 hover:bg-gray-800">
              <Link href="#" className="block">
                {agent.name}
              </Link>
            </li>
          ))}
        </ul>
        <button
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => console.log('Launching terminal...')}
        >
          Launch Terminal
        </button>
      </div>
    </div>
  );
};

export default Page;