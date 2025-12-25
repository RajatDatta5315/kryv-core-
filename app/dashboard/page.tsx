import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import StatusPanel from '@/components/StatusPanel';
import Stats from '@/components/Stats';
import InventoryList from '@/components/InventoryList';

const Dashboard: NextPage = () => {
  const supabaseClient = useSupabaseClient();
  const [stats, setStats] = useState({});
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabaseClient.from('stats').select('*');
      if (error) console.error(error);
      else setStats(data[0]);
    };

    const fetchInventory = async () => {
      const { data, error } = await supabaseClient.from('inventory').select('*');
      if (error) console.error(error);
      else setInventory(data);
    };

    fetchStats();
    fetchInventory();
  }, [supabaseClient]);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-900 text-white p-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </header>
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <StatusPanel />
              <Stats stats={stats} />
              <InventoryList inventory={inventory} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;