import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function Upload() {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [type, setType] = useState('main');

  const handleUpload = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Vui lòng đăng nhập!');

    let mediaUrl = '';
    if (file) {
      const { data, error } = await supabase.storage.from('media').upload(`public/${file.name}`, file);
      if (error) return console.error(error);
      mediaUrl = supabase.storage.from('media').getPublicUrl(data.path).data.publicUrl;
    }

    await supabase.from('posts').insert([{ content, media_url: mediaUrl, type, user_id: user.id }]);
    setContent('');
    setFile(null);
    alert('Đăng bài thành công!');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Đăng bài</h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nội dung bài viết"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-2"
            accept="image/*,video/*,.txt,.otf,.ttf,.html,.php"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-2 p-2 border rounded-md"
          >
            <option value="main">Trang chủ</option>
            <option value="shorts">Shorts</option>
          </select>
          <button
            onClick={handleUpload}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Đăng
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}