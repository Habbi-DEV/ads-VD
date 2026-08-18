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

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const user = await authenticate(req, res);
    if (!user) return;

    const { fileName, fileBase64, contentType } = req.body || {};
    if (!fileBase64 || !contentType) {
      return res.status(400).json({ error: 'fileBase64 and contentType are required' });
    }
    if (!String(contentType).startsWith('image/')) {
      return res.status(400).json({ error: 'Only image uploads are supported' });
    }

    const safeName = String(fileName || 'image.png').replace(/[^a-zA-Z0-9.\-_]/g, '-').slice(-60);
    const path = `${user.id}/${Date.now()}-${safeName}`;
    const buffer = Buffer.from(fileBase64, 'base64');

    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, buffer, { contentType, upsert: false });
    if (error) throw error;

    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
    return res.status(200).json({ url: urlData.publicUrl });
  } catch (err) {
    console.error('upload API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
