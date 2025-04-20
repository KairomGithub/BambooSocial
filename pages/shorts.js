import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import ShortCard from '../components/ShortCard';

export default function Shorts() {
  const [shorts, setShorts] = useState([]);

  useEffect(() => {
    const fetchShorts = async () => {
      const { data } = await supabase.from('posts').select(`
        *,
        users (name, username, avatar_url)
      `).eq('type', 'shorts').order('created_at', { ascending: false });
      setShorts(data || []);
    };
    fetchShorts();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="max-w-2xl mx-auto p-4">
        {shorts.map(short => (
          <ShortCard key={short.id} post={short} />
        ))}
      </div>
      <BottomNav />
    </div>
  );
}