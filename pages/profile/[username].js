import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import PostCard from '../../components/PostCard';

export default function Profile() {
  const router = useRouter();
  const { username } = router.query;
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [xUrl, setXUrl] = useState('');
  const [threadsUrl, setThreadsUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [telegramUrl, setTelegramUrl] = useState('');
  const [customSocialUrl, setCustomSocialUrl] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (username) {
      const fetchUser = async () => {
        const { data } = await supabase.from('users').select('*').eq('username', username).single();
        setUser(data);
        setName(data.name);
        setBio(data.bio);
        setFacebookUrl(data.facebook_url || '');
        setInstagramUrl(data.instagram_url || '');
        setXUrl(data.x_url || '');
        setThreadsUrl(data.threads_url || '');
        setTiktokUrl(data.tiktok_url || '');
        setYoutubeUrl(data.youtube_url || '');
        setLinkedinUrl(data.linkedin_url || '');
        setTelegramUrl(data.telegram_url || '');
        setCustomSocialUrl(data.custom_social_url || '');

        const { data: postData } = await supabase.from('posts').select(`
          *,
          users (name, username, avatar_url)
        `).eq('user_id', data.id);
        setPosts(postData || []);

        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          const { data: followData } = await supabase
            .from('followers')
            .select('*')
            .eq('follower_id', currentUser.id)
            .eq('followee_id', data.id);
          setIsFollowing(followData.length > 0);
        }
      };
      fetchUser();
    }
  }, [username]);

  const handleUpdate = async () => {
    await supabase
      .from('users')
      .update({
        name,
        bio,
        facebook_url: facebookUrl,
        instagram_url: instagramUrl,
        x_url: xUrl,
        threads_url: threadsUrl,
        tiktok_url: tiktokUrl,
        youtube_url: youtubeUrl,
        linkedin_url: linkedinUrl,
        telegram_url: telegramUrl,
        custom_social_url: customSocialUrl,
      })
      .eq('id', user.id);
    setIsEditing(false);
    alert('Cập nhật profile thành công!');
  };

  const handleFollow = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return alert('Vui lòng đăng nhập!');
    if (!isFollowing) {
      await supabase
        .from('followers')
        .insert([{ follower_id: currentUser.id, followee_id: user.id }]);
      setIsFollowing(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-2xl mx-auto p-4">
        {user && (
          <>
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <img
                src={user.avatar_url || '/images/avatar.png'}
                alt="Avatar"
                className="w-24 h-24 rounded-full mx-auto"
              />
              <h1 className="text-xl font-semibold text-center mt-2">
                {user.name} {user.verified && <span className="text-blue-500">✔</span>}
              </h1>
              <p className="text-gray-500 text-center">@{user.username}</p>
              <p className="text-center mt-2">{user.bio}</p>
              <div className="flex justify-center space-x-4 mt-2">
                <p>Followers: {user.followers_count}</p>
                <p>Bài viết: {user.posts_count}</p>
              </div>
              <div className="mt-2">
                {facebookUrl && <a href={facebookUrl} className="block text-blue-500">Facebook</a>}
                {instagramUrl && <a href={instagramUrl} className="block text-blue-500">Instagram</a>}
                {xUrl && <a href={xUrl} className="block text-blue-500">X</a>}
                {threadsUrl && <a href={threadsUrl} className="block text-blue-500">Threads</a>}
                {tiktokUrl && <a href={tiktokUrl} className="block text-blue-500">TikTok</a>}
                {youtubeUrl && <a href={youtubeUrl} className="block text-blue-500">YouTube</a>}
                {linkedinUrl && <a href={linkedinUrl} className="block text-blue-500">LinkedIn</a>}
                {telegramUrl && <a href={telegramUrl} className="block text-blue-500">Telegram</a>}
                {customSocialUrl && <a href={customSocialUrl} className="block text-blue-500">Custom Link</a>}
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                {!isFollowing && (
                  <button
                    onClick={handleFollow}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Follow
                  </button>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
            {isEditing && (
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tên"
                  className="w-full p-2 border rounded-md mb-2"
                />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Bio"
                  className="w-full p-2 border rounded-md mb-2"
                />
                <input
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="Facebook URL"
                  className="w-full p-2 border rounded-md mb-2"
                />
                <input
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="Instagram URL"
                  className="w-full p-2 border rounded-md mb-2"
                />
                <input
                  value={xUrl}
                  onChange={(e) => setXUrl(e.target.value)}
                  placeholder="X URL"
                  className="w-full p-2 border rounded-md mb-2"
                />
                <input
                  value={threadsUrl}
                  onChange={(e) => setThreadsUrl(e.target.value)}
                  placeholder="Threads URL"
                  className="w-full p-2 border rounded-md mb-2"
                />
                <input
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="TikTok URL"
                  className="w-full p-2 border rounded-md mb-2"
                />
                <input
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="YouTube URL"
                  className="w-full p-2 border rounded-md mb-2"
                />
                <input
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="LinkedIn URL"
                  className="w-full p-2 border rounded-md mb-2"
                />
                <input
                  value={telegramUrl}
                  onChange={(e) => setTelegramUrl(e.target.value)}
                  placeholder="Telegram URL"
                  className="w-full p-2 border rounded-md mb-2"
                />
                <input
                  value={customSocialUrl}
                  onChange={(e) => setCustomSocialUrl(e.target.value)}
                  placeholder="Custom Social URL"
                  className="w-full p-2 border rounded-md mb-2"
                />
                <button
                  onClick={handleUpdate}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Lưu
                </button>
              </div>
            )}
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
    }
