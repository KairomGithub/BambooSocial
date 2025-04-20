import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, action } = req.body;

    try {
      if (action === 'signup') {
        const { data: { user }, error } = await supabase.auth.signUp({ email, password });
        if (error) return res.status(400).json({ error: error.message });

        // Thêm user vào bảng users
        await supabase.from('users').insert([
          {
            id: user.id,
            email,
            username: email.split('@')[0], // Tạm thời dùng email làm username
            name: user.user_metadata.full_name || email.split('@')[0],
          },
        ]);

        return res.status(200).json({ user });
      } else if (action === 'signin') {
        const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return res.status(400).json({ error: error.message });
        return res.status(200).json({ user });
      } else if (action === 'google') {
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
        if (error) return res.status(400).json({ error: error.message });
        return res.status(200).json({ message: 'Redirecting to Google OAuth' });
      } else {
        return res.status(400).json({ error: 'Invalid action' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}