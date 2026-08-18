import supabase from './db-client.js';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

async function authenticate(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return null;
  }
  return user;
}

async function getOrCreateProfile(user) {
  let { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    const meta = user.user_metadata || {};
    const name = meta.full_name || meta.name || meta.user_name || (user.email ? user.email.split('@')[0] : 'Creator');
    const { data: created, error: insertError } = await supabase
      .from('profiles')
      .insert({ user_id: user.id, name, credits_balance: 5 })
      .select()
      .single();
    if (insertError) throw insertError;
    data = created;
  }
  return data;
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const user = await authenticate(req, res);
    if (!user) return;

    if (req.method === 'GET') {
      const profile = await getOrCreateProfile(user);
      return res.status(200).json(profile);
    }

    if (req.method === 'PUT') {
      const { name } = req.body || {};
      if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
      }
      await getOrCreateProfile(user);
      const { data, error } = await supabase
        .from('profiles')
        .update({ name: name.trim().slice(0, 80) })
        .eq('user_id', user.id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('profile API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
