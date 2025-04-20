import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function VerifyRequestForm() {
  const [details, setDetails] = useState('');

  const handleRequest = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Vui lòng đăng nhập!');
    await supabase
      .from('verification_requests')
      .insert([{ user_id: user.id, request_details: details }]);
    alert('Yêu cầu đã được gửi!');
    setDetails('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Yêu cầu Verify</h2>
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Lý do yêu cầu verify"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleRequest}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Gửi yêu cầu
      </button>
    </div>
  );
}