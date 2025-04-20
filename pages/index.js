import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select(`
      *,
      users (name, username, avatar_url)
    `).order('created_at', { ascending: false });
    setPosts(data || []);
  };

  const handlePost = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Vui lòng đăng nhập!');
    await supabase.from('posts').insert([{ content, user_id: user.id, type: 'main' }]);
    setContent('');
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Bạn đang nghĩ gì?"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handlePost}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Đăng
          </button>
        </div>
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <BottomNav />
    </div>
  );
}