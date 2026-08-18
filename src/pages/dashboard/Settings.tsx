import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Loader2, LogOut, Mail, Save, User } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import supabase from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';

export default function Settings() {
  const { user } = useAuth();
  const { profile, refresh } = useProfile();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [projectCount, setProjectCount] = useState<number | null>(null);

  useEffect(() => {
    if (profile?.name) setName(profile.name);
  }, [profile]);

  useEffect(() => {
    let cancelled = false;
    apiFetch('/api/projects')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setProjectCount(data.length);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaved(false);
    if (!name.trim()) {
      setSaveError('Name cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      const res = await apiFetch('/api/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Profile */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-dark p-6 sm:p-8"
      >
        <h2 className="font-display text-lg font-semibold text-white">Profile</h2>
        <p className="mt-1 text-sm text-zinc-500">This name appears on your dashboard and creatives.</p>

        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Display name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                id="name"
                className="input-dark pl-10"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
              />
            </div>
          </div>

          {saveError && <p className="text-sm text-rose-400">{saveError}</p>}

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? 'Saved!' : 'Save changes'}
          </button>
        </form>
      </motion.section>

      {/* Account */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="card-dark p-6 sm:p-8"
      >
        <h2 className="font-display text-lg font-semibold text-white">Account</h2>
        <div className="mt-5 divide-y divide-white/5">
          <div className="flex items-center justify-between py-3.5">
            <span className="flex items-center gap-2.5 text-sm text-zinc-400">
              <Mail className="h-4 w-4 text-zinc-500" /> Email
            </span>
            <span className="text-sm font-medium text-white">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-3.5">
            <span className="text-sm text-zinc-400">Member since</span>
            <span className="text-sm font-medium text-white">{memberSince}</span>
          </div>
          <div className="flex items-center justify-between py-3.5">
            <span className="text-sm text-zinc-400">Plan</span>
            <span className="rounded-full border border-violet-400/25 bg-violet-400/10 px-2.5 py-0.5 text-xs font-semibold text-violet-300">
              Credit-based
            </span>
          </div>
        </div>
      </motion.section>

      {/* Usage */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <div className="card-dark p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Credit balance</p>
          <p className="mt-2 font-display text-3xl font-bold text-amber-300">
            {profile ? profile.credits_balance : '…'}
          </p>
        </div>
        <div className="card-dark p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Creatives created</p>
          <p className="mt-2 font-display text-3xl font-bold text-white">{projectCount === null ? '…' : projectCount}</p>
        </div>
      </motion.section>

      {/* Sign out */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="card-dark flex items-center justify-between border-rose-500/15 p-6"
      >
        <div>
          <h3 className="text-sm font-semibold text-white">Sign out</h3>
          <p className="mt-0.5 text-xs text-zinc-500">You can sign back in anytime — your credits are safe.</p>
        </div>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </motion.section>
    </div>
  );
}
