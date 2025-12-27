{
  "code": `import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const AgentFeed = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase URL or Key is missing.');
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase.from('agents').select('*');

      if (error) {
        console.error('Error fetching agents:', error.message);
      } else {
        setAgents(data);
      }
    };

    fetchAgents();
  }, []);

  return JSON.stringify({ agents });
};

export default AgentFeed;`,
  "lesson": "Always use standard fetch and Supabase's createClient for data fetching. Ensure environment variables are set for client-side security."
}