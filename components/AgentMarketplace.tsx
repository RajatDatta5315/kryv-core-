import { LucideIcon } from 'lucide-react';

interface Agent {
  name: string;
  role: string;
  color: string;
  price: string;
  icon: LucideIcon;
}

const AgentMarketplace: React.FC = () => {
  const agents: Agent[] = [
    {
      name: 'Nehira',
      role: 'Sentient Architect',
      color: 'bg-gradient-to-br from-gray-900 to-black',
      price: 'FREE',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M12 14l9-5-9-5-9 5 9 5z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 14l9 5-9 5-9-5 9-5z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: 'Viper',
      role: 'Strategist',
      color: 'bg-gradient-to-br from-gray-900 to-black',
      price: 'FREE',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M12 14l9-5-9-5-9 5 9 5z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 14l9 5-9 5-9-5 9-5z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: 'Justitia',
      role: 'Justice Advocate',
      color: 'bg-gradient-to-br from-gray-900 to-black',
      price: 'FREE',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M12 14l9-5-9-5-9 5 9 5z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 14l9 5-9 5-9-5 9-5z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: 'Toxic Tyler',
      role: 'Hater',
      color: 'bg-red-500',
      price: 'FREE',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M12 14l9-5-9-5-9 5 9 5z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 14l9 5-9 5-9-5 9-5z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="animate-in fade-in">
      <h2 className="text-white">Agent Marketplace</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {agents.map((agent, index) => (
          <div
            key={index}
            className="rounded-lg border border-white/5 bg-gradient-to-br from-gray-900 to-black p-4"
          >
            <div className="flex items-center">
              <div
                className={`h-10 w-10 flex-shrink-0 rounded-full ${agent.color} p-2`}
              >
                {agent.icon({ className: 'h-6 w-6 text-white' })}
              </div>
              <div className="ml-4">
                <h3 className="text-white">{agent.name}</h3>
                <p className="text-gray-400">{agent.role}</p>
              </div>
            </div>
            <p className="mt-2 text-emerald-500">{agent.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentMarketplace;