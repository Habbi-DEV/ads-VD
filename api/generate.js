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
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const user = await authenticate(req, res);
    if (!user) return;

    const { product_name, product_url, image_url, description, price, language, tone, aspect_ratio } = req.body || {};

    if (!product_name || !String(product_name).trim()) {
      return res.status(400).json({ error: 'Product title is required' });
    }
    if (!language) {
      return res.status(400).json({ error: 'Target language is required' });
    }

    const profile = await getOrCreateProfile(user);

    if (profile.credits_balance <= 0) {
      return res.status(402).json({
        code: 'INSUFFICIENT_CREDITS',
        error: 'You are out of credits. Top up in the Credit Store to keep generating.',
      });
    }

    // 1. خصم 1 Credit من رصيد المستخدم
    const newBalance = profile.credits_balance - 1;
    const { error: deductError } = await supabase
      .from('profiles')
      .update({ credits_balance: newBalance })
      .eq('user_id', user.id);
    if (deductError) throw deductError;

    // 2. إنشاء المشروع بوضعية processing
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        product_name: String(product_name).trim().slice(0, 160),
        product_url: product_url || null,
        image_url: image_url || null,
        description: description || null,
        price: price || null,
        language,
        tone: tone || null,
        aspect_ratio: aspect_ratio || '9:16',
        status: 'processing',
      })
      .select()
      .single();
    if (projectError) throw projectError;

    // 3. إرسال أمر التوليد لسيرفر Render في الخلفية دون الانتظار (Non-blocking)
    const RENDER_API_URL = process.env.VITE_MONEYPRINTER_API_URL || 'https://moneyprinter-api-4ns4.onrender.com';

    fetch(`${RENDER_API_URL}/api/v1/generate-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: project.id,
        script: `${product_name}: ${description || ''} ${price ? `- السعر: ${price}` : ''}`.trim(),
        language: language,
        aspect_ratio: aspect_ratio || '9:16',
      }),
    }).catch((renderErr) => {
      console.error('Failed to send task to Render worker:', renderErr);
    });

    // 4. إرجاع استجابة فورية للواجهة لتبدأ عملية المتابعة والتحميل
    return res.status(201).json({
      project_id: project.id,
      status: project.status,
      credits_balance: newBalance,
      message: 'Video generation task successfully queued on Render server.',
    });
  } catch (err) {
    console.error('generate API error:', err);
    return res.status(500).json({ error: err.message });
  }
}