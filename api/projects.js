import supabase from './db-client.js';

const PENDING_MS = 20000; // pending -> processing after 20s
const TOTAL_MS = 60000;   // processing -> completed after 60s total

const SCRIPTS = {
  dz: (p) => `واش! لسه ما جربتش ${p}؟ 😱 المنتج هذا راهو viral بزاف والستوك محدود. اطلب دوك قبل ما يفوتك! 🔥`,
  ar: (p) => `اكتشف ${p} — المنتج الذي يتحدث عنه الجميع! عرض حصري لفترة محدودة. اطلب الآن قبل نفاد الكمية. 🔥`,
  fr: (p) => `Découvrez ${p} — le produit dont tout le monde parle ! Offre exclusive, stocks limités. Commandez maintenant. 🔥`,
  en: (p) => `Meet ${p} — the viral product everyone is talking about! Limited-time offer, limited stock. Order now before it's gone. 🔥`,
};
const VOICES = { dz: 'dz-lyna', ar: 'ar-omar', fr: 'fr-chloe', en: 'en-ava' };

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

// Simulated render pipeline: advances pending/processing projects based on age.
async function advancePipeline(userId) {
  const { data: active, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['pending', 'processing']);
  if (error || !active || active.length === 0) return;

  const now = Date.now();
  for (const p of active) {
    const age = now - new Date(p.created_at).getTime();
    if (p.status === 'pending' && age >= PENDING_MS) {
      await supabase.from('projects').update({ status: 'processing' }).eq('id', p.id);
    } else if (p.status === 'processing' && age >= TOTAL_MS) {
      await supabase.from('projects').update({ status: 'completed' }).eq('id', p.id);
      const makeScript = SCRIPTS[p.language] || SCRIPTS.en;
      await supabase.from('creatives').insert({
        project_id: p.id,
        video_url: '/videos/sample-ad.mp4',
        script: makeScript(p.product_name || 'your product'),
        voice_id: VOICES[p.language] || VOICES.en,
      });
    }
  }
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const user = await authenticate(req, res);
    if (!user) return;

    if (req.method === 'GET') {
      await advancePipeline(user.id);

      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;

      const completedIds = (projects || []).filter((p) => p.status === 'completed').map((p) => p.id);
      let creatives = [];
      if (completedIds.length > 0) {
        const { data: cr, error: crError } = await supabase
          .from('creatives')
          .select('*')
          .in('project_id', completedIds);
        if (crError) throw crError;
        creatives = cr || [];
      }

      const merged = (projects || []).map((p) => ({
        ...p,
        creative: creatives.find((c) => c.project_id === p.id) || null,
      }));
      return res.status(200).json(merged);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Project id is required' });

      const { data: existing, error: findError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      if (findError) throw findError;
      if (!existing) return res.status(404).json({ error: 'Project not found' });

      await supabase.from('creatives').delete().eq('project_id', id);
      const { error: delError } = await supabase.from('projects').delete().eq('id', id);
      if (delError) throw delError;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('projects API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
