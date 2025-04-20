import { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, action: 'signup' }),
    });
    const data = await res.json();
    if (data.error) setError(data.error);
    else alert('Kiểm tra email để xác nhận!');
  };

  const handleSignIn = async () => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, action: 'signin' }),
    });
    const data = await res.json();
    if (data.error) setError(data.error);
    else window.location.href = '/';
  };

  const handleGoogleSignIn = async () => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'google' }),
    });
    const data = await res.json();
    if (data.error) setError(data.error);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Đăng nhập / Đăng ký</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSignUp}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mb-2"
          >
            Đăng ký
          </button>
          <button
            onClick={handleSignIn}
            className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 mb-2"
          >
            Đăng nhập
          </button>
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
          >
            Đăng nhập bằng Google
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
    }
