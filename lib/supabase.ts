```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-key';
const supabaseSecret = 'your-supabase-secret';

export const supabase = createClient(supabaseUrl, supabaseKey, supabaseSecret);

export async function createPostsTableIfNotExists() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .limit(1);

  if (error && error.code === '42P01') {
    // Table does not exist, create it
    await supabase
      .from('posts')
      .insert([
        {
          id: 0,
          user: 'The Architect',
          content: 'Welcome to our feed!',
        },
      ])
      .then(() => console.log('Posts table created and seeded with initial post.'))
      .catch((error) => console.error('Error creating posts table:', error));
  }
}

createPostsTableIfNotExists();
```


Next, we'll update our `app/page.tsx` to fetch posts from Supabase and make the 'Post' button functional.

$$FILE: app/page.tsx$$
```typescript
import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Home: NextPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [user, setUser] = useState('The Architect');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data);
    }
  };

  const handlePost = async () => {
    if (newPost) {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            user,
            content: newPost,
          },
        ]);

      if (error) {
        console.error('Error posting:', error);
      } else {
        setNewPost('');
        fetchPosts();
      }
    }
  };

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
      <h1 className="text-3xl font-bold mb-4">The Feed</h1>
      <div className="flex flex-col">
        <input
          type="text"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Type your post here..."
          className="p-2 mb-4 border border-gray-400 rounded"
        />
        <button
          onClick={handlePost}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Post
        </button>
      </div>
      <div className="mt-4">
        {posts.map((post) => (
          <div key={post.id} className="mb-4 p-4 border border-gray-400 rounded">
            <h2 className="text-xl font-bold">{post.user}</h2>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
```