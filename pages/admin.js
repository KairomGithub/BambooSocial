import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
      if (!user || userData.role !== 'admin') {
        window.location.href = '/';
      }
    };
    checkAdmin();

    const fetchUsers = async () => {
      const { data } = await supabase.from('users').select('*');
      setUsers(data || []);
    };
    const fetchRequests = async () => {
      const { data } = await supabase.from('verification_requests').select(`
        *,
        users (name, username)
      `).eq('status', 'pending');
      setRequests(data || []);
    };
    fetchUsers();
    fetchRequests();
  }, []);

  const handleVerify = async (userId) => {
    await supabase.from('users').update({ verified: true }).eq('id', userId);
    await supabase.from('verification_requests').update({ status: 'approved' }).eq('user_id', userId);
    setRequests(requests.filter(req => req.user_id !== userId));
  };

  const handleReject = async (userId) => {
    await supabase.from('verification_requests').update({ status: 'rejected' }).eq('user_id', userId);
    setRequests(requests.filter(req => req.user_id !== userId));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Trang Admin</h2>
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h3 className="text-lg font-semibold">Yêu cầu Verify</h3>
          {requests.map(req => (
            <div key={req.id} className="border-b py-2">
              <p>{req.users.name} (@{req.users.username})</p>
              <p>{req.request_details}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleVerify(req.user_id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Xác minh
                </button>
                <button
                  onClick={() => handleReject(req.user_id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Từ chối
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold">Danh sách người dùng</h3>
          {users.map(user => (
            <div key={user.id} className="border-b py-2">
              <p>{user.name} (@{user.username})</p>
              <p>{user.verified ? 'Đã xác minh' : 'Chưa xác minh'}</p>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}