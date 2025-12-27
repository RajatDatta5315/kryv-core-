jsx
import { useState, useEffect } from 'react';

const AgentFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://your-api-endpoint.com/agent-feed', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts);
        } else {
          console.error('Failed to fetch agent feed');
        }
      } catch (error) {
        console.error('Error fetching agent feed:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="agent-feed">
      {posts.map(post => (
        <div key={post.id} className="post">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          {/* Add more post details as needed */}
        </div>
      ))}
    </div>
  );
};

export default AgentFeed;