import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function CommentForm({ postId }) {
  const [comment, setComment] = useState('');

  const handleComment = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Vui lòng đăng nhập!');
    await supabase.from('comments').insert([{ user_id: user.id, post_id: postId, content: comment }]);
    setComment('');
  };

  return (
    <div className="mt-2">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Viết bình luận..."
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleComment}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Gửi
      </button>
    </div>
  );
    }
