```tsx
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';
import { DryPaperProduct } from '../../types';

export default function DashboardPage() {
  const pathname = usePathname();
  const [revenue, setRevenue] = useState(0);
  const [activeAgents, setActiveAgents] = useState(0);
  const [products, setProducts] = useState<DryPaperProduct[]>([]);

  useEffect(() => {
    const fetchMarketplaceData = async () => {
      const response = await fetch('/api/marketplace');
      const data = await response.json();
      setRevenue(data.revenue);
      setActiveAgents(data.activeAgents);
      setProducts(data.products);
    };
    fetchMarketplaceData();
  }, []);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-zinc-950 p-4 rounded-lg shadow-lg">
          <h2 className="text-emerald-500 text-2xl font-bold mb-2">Revenue</h2>
          <p className="text-zinc-200 text-4xl font-bold">${revenue}</p>
        </div>
        <div className="bg-zinc-950 p-4 rounded-lg shadow-lg">
          <h2 className="text-emerald-500 text-2xl font-bold mb-2">Active Agents</h2>
          <p className="text-zinc-200 text-4xl font-bold">{activeAgents}</p>
        </div>
      </div>
      <div className="mt-8 bg-zinc-950 p-4 rounded-lg shadow-lg">
        <h2 className="text-emerald-500 text-2xl font-bold mb-2">DryPaper Inventory</h2>
        <ul>
          {products.map((product) => (
            <li key={product.id} className="py-2 border-b border-zinc-800">
              <span className="text-zinc-200">{product.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
}