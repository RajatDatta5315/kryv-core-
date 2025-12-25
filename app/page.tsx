```tsx
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [dummyPosts, setDummyPosts] = useState([
    { id: 1, content: 'This is a dummy post 1' },
    { id: 2, content: 'This is a dummy post 2' },
    { id: 3, content: 'This is a dummy post 3' },
  ]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase.from('posts').select('*');
    if (error) {
      console.error(error);
    } else {
      setPosts(data);
    }
  };

  const handlePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPost.trim() !== '') {
      const { data, error } = await supabase.from('posts').insert([{ content: newPost }]);
      if (error) {
        console.error(error);
      } else {
        setPosts([...posts, data[0]]);
        setNewPost('');
      }
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
        <h1 className="text-3xl font-bold mb-4">Cyberpunk Feed</h1>
        <form onSubmit={handlePost} className="mb-4">
          <input
            type="text"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Write a post..."
            className="w-full p-2 pl-10 text-gray-100 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          <button
            type="submit"
            className="ml-2 bg-gray-600 hover:bg-gray-500 text-gray-100 py-2 px-4 rounded-lg"
          >
            Post
          </button>
        </form>
        {posts.length === 0 ? (
          <div>
            {dummyPosts.map((post) => (
              <div key={post.id} className="mb-4 p-4 bg-gray-700 rounded-lg">
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <div key={post.id} className="mb-4 p-4 bg-gray-700 rounded-lg">
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```