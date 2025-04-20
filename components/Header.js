import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('users').select('username, avatar_url').eq('id', user.id).single();
        setUser(data);
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <Link href="/">
        <img src="/images/logo.png" alt="Bamboo Social" className="h-10" />
      </Link>
      <input
        type="text"
        placeholder="Tìm kiếm..."
        className="w-1/2 p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex items-center space-x-4">
        {user ? (
          <Link href={`/profile/${user.username}`}>
            <img
              src={user.avatar_url || '/images/avatar.png'}
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
          </Link>
        ) : (
          <Link href="/auth">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Đăng nhập
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}