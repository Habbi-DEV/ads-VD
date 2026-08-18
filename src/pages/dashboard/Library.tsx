import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Film,
  FolderOpen,
  Loader2,
  Mic,
  Play,
  Trash2,
  Wand2,
  X,
  XCircle,
} from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { languageMeta, toneMeta } from '../../lib/constants';
import type { Project, ProjectStatus } from '../../types';

const STATUS_META: Record<ProjectStatus, { label: string; classes: string }> = {
  pending: { label: 'Queued', classes: 'border-amber-400/25 bg-amber-400/10 text-amber-300' },
  processing: { label: 'Rendering', classes: 'border-sky-400/25 bg-sky-400/10 text-sky-300' },
  completed: { label: 'Ready', classes: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300' },
  failed: { label: 'Failed', classes: 'border-rose-400/25 bg-rose-400/10 text-rose-300' },
};

function StatusBadge({ status }: { status: ProjectStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${meta.classes}`}>
      {status === 'pending' && <Clock className="h-3 w-3" />}
      {status === 'processing' && <Loader2 className="h-3 w-3 animate-spin" />}
      {status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
      {status === 'failed' && <XCircle className="h-3 w-3" />}
      {meta.label}
    </span>
  );
}

export default function Library() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await apiFetch('/api/projects');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load projects');
      setProjects(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load your library');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Poll while any project is still in the pipeline
  const hasActive = projects.some((p) => p.status === 'pending' || p.status === 'processing');
  useEffect(() => {
    if (!hasActive) return;
    const timer = setInterval(fetchProjects, 5000);
    return () => clearInterval(timer);
  }, [hasActive, fetchProjects]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this creative? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await apiFetch('/api/projects', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Delete failed');
      }
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card-dark flex animate-pulse items-center gap-4 p-5">
            <div className="h-16 w-16 rounded-xl bg-white/8" />
            <div className="flex-1 space-y-2.5">
              <div className="h-4 w-1/3 rounded bg-white/8" />
              <div className="h-3 w-1/2 rounded bg-white/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && projects.length === 0) {
    return (
      <div className="card-dark mx-auto max-w-md p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-rose-400" />
        <p className="mt-3 text-sm text-zinc-300">{error}</p>
        <button onClick={fetchProjects} className="btn-ghost mt-5">Try again</button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="card-dark mx-auto max-w-md border-dashed p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 ring-1 ring-violet-500/30">
          <FolderOpen className="h-6 w-6 text-violet-300" />
        </div>
        <h2 className="mt-4 font-display text-lg font-semibold text-white">Your library is empty</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Generate your first creative and it will show up here with live status updates.
        </p>
        <Link to="/dashboard/create" className="btn-primary mt-6">
          <Wand2 className="h-4 w-4" /> Create your first ad
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          {projects.length} creative{projects.length === 1 ? '' : 's'}
          {hasActive && (
            <span className="ml-2 inline-flex items-center gap-1.5 text-xs text-sky-300">
              <Loader2 className="h-3 w-3 animate-spin" /> live-updating
            </span>
          )}
        </p>
        <Link to="/dashboard/create" className="btn-primary px-4 py-2 text-xs">
          <Wand2 className="h-3.5 w-3.5" /> New creative
        </Link>
      </div>

      {error && projects.length > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <div className="space-y-4">
        {projects.map((p, i) => {
          const lang = languageMeta(p.language);
          const tone = toneMeta(p.tone);
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }}
              className="card-dark flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
            >
              {/* Thumbnail */}
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.product_name || 'Product'}
                  className="h-16 w-16 shrink-0 rounded-xl border border-white/10 object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/20 ring-1 ring-violet-500/25">
                  <Film className="h-6 w-6 text-violet-300" />
                </div>
              )}

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-semibold text-white">{p.product_name || 'Untitled product'}</h3>
                  <span className="text-xs text-zinc-600">#{p.id}</span>
                </div>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {new Date(p.created_at).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {p.price ? ` · ${p.price}` : ''}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {lang && (
                    <span className="rounded-md border border-white/8 bg-white/4 px-2 py-0.5 text-[11px] text-zinc-300">
                      {lang.flag} {lang.label}
                    </span>
                  )}
                  {tone && (
                    <span className="rounded-md border border-white/8 bg-white/4 px-2 py-0.5 text-[11px] text-zinc-300">
                      {tone.emoji} {tone.label}
                    </span>
                  )}
                  <span className="rounded-md border border-white/8 bg-white/4 px-2 py-0.5 text-[11px] text-zinc-300">
                    {p.aspect_ratio || '9:16'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2.5 sm:flex-col sm:items-end">
                <StatusBadge status={p.status} />
                <div className="flex items-center gap-1.5">
                  {p.status === 'completed' && p.creative?.video_url && (
                    <button
                      onClick={() => setSelected(p)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/20"
                    >
                      <Play className="h-3.5 w-3.5" /> Preview
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="rounded-lg p-2 text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50"
                    title="Delete"
                  >
                    {deletingId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="card-dark max-h-[90vh] w-full max-w-4xl overflow-y-auto bg-ink-900 p-6"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">{selected.product_name}</h3>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    Project #{selected.id} · {languageMeta(selected.language)?.label} ·{' '}
                    {toneMeta(selected.tone)?.label || 'No tone'}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-[260px_1fr]">
                <div className="mx-auto w-full max-w-[260px] overflow-hidden rounded-2xl border border-white/12 bg-black">
                  {selected.creative?.video_url && (
                    <video
                      src={selected.creative.video_url}
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="aspect-[9/16] w-full object-cover"
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      <Mic className="h-3.5 w-3.5" /> Generated script
                    </p>
                    <div className="rounded-2xl border border-white/8 bg-white/3 p-4 text-sm leading-relaxed text-zinc-200">
                      {selected.creative?.script || 'No script available.'}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-1 font-medium text-violet-300">
                      Voice: {selected.creative?.voice_id || 'n/a'}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-zinc-300">
                      Format: {selected.aspect_ratio}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Full render download and A/B variations are coming soon in the production pipeline.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
