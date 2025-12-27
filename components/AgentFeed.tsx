import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

function AgentFeed() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      const { data, error } = await supabase.from('agents').select();
      if (error) {
        console.error('Error fetching agents:', error);
      } else {
        setAgents(data);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div>
      <h2>Agent Feed</h2>
      <ul>
        {agents.map(agent => (
          <li key={agent.id}>{agent.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default AgentFeed;