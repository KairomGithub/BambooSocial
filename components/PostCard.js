import { useState } from 'react';
import { supabase } from '../lib/supabase';
import CommentForm from './CommentForm';

export default function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes_count);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Vui lòng đăng nhập!');
    const { error } = await supabase.from('likes').insert([{ user_id: user.id, post_id: post.id }]);
    if (!error) setLikes(likes + 1);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center space-x-2">
        <img
          src={post.users.avatar_url || '/images/avatar.png'}
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold">{post.users.name}</p>
          <p className="text-gray-500 text-sm">@{post.users.username}</p>
        </div>
      </div>
      <p className="mt-2">{post.content}</p>
      {post.media_url && (
        post.type === 'shorts' ? (
          <video src={post.media_url} controls className="mt-2 w-full rounded-md" />
        ) : (
          <img src={post.media_url} alt="Media" className="mt-2 w-full rounded-md" />
        )
      )}
      <div className="flex items-center space-x-4 mt-2">
        <button onClick={handleLike} className="flex items-center text-gray-600 hover:text-red-500">
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {likes}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center text-gray-600 hover:text-blue-500"
        >
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 15h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm-4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm-4 8H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zM7 15H5v-2h2v2zm0-4H5V9h2v2zm0-4H5V5h2v2zm-2 10H3v-2h2v2zm16 0h-2v-2h2v2zM3 3v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3H3zm16 14H5V5h14v12z" />
          </svg>
          {post.comments_count}
        </button>
      </div>
      {showComments && <CommentForm postId={post.id} />}
    </div>
  );
}