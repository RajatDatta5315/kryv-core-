{
  "code": `import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const AgentFeed = () => {
  const [feedData, setFeedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Supabase URL or Anon Key is missing.');
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const { data, error } = await supabase.from('agent_feed').select('*');

      if (error) {
        console.error('Error fetching data:', error.message);
      } else {
        setFeedData(data);
      }
    };

    fetchData();
  }, []);

  return JSON.stringify(feedData);
};

export default AgentFeed;`,
  "lesson": "Always use standard fetch methods and proper environment keys for data fetching. React hooks should be explicitly imported for component-level state management."
}