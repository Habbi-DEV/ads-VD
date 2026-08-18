import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Coins,
  FolderOpen,
  Globe,
  ImagePlus,
  Link2,
  Loader2,
  MonitorPlay,
  Package,
  Smartphone,
  Sparkles,
  Square,
  X,
} from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useProfile } from '../../contexts/ProfileContext';
import { LANGUAGES, RATIOS, TONES } from '../../lib/constants';

const STEPS = [
  { label: 'Product', icon: Package },
  { label: 'Audience', icon: Globe },
  { label: 'Format', icon: Smartphone },
];

interface FormState {
  product_url: string;
  image_url: string;
  product_name: string;
  price: string;
  description: string;
  language: string;
  tone: string;
  aspect_ratio: string;
}

const INITIAL_FORM: FormState = {
  product_url: '',
  image_url: '',
  product_name: '',
  price: '',
  description: '',
  language: '',
  tone: '',
  aspect_ratio: '9:16',
};

export default function CreateCreative() {
  const { profile, refresh } = useProfile();
  const navigate = useNavigate();
  const balance = profile?.credits_balance ?? 0;

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');
  const [insufficient, setInsufficient] = useState(false);
  const [createdId, setCreatedId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.product_name.trim()) e.product_name = 'Product title is required.';
      if (!form.description.trim()) e.description = 'A short description helps the AI write a better script.';
      if (!form.product_url.trim() && !form.image_url) e.product_url = 'Add a product URL or upload a product image.';
      if (form.product_url.trim() && !/^https?:\/\/.+/i.test(form.product_url.trim()))
        e.product_url = 'Enter a valid URL starting with http:// or https://';
    }
    if (s === 1) {
      if (!form.language) e.language = 'Choose a target audience language.';
      if (!form.tone) e.tone = 'Pick a tone for your ad.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, 2));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose an image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setUploadError('Image must be under 4MB.');
      return;
    }
    setUploadError('');
    setUploading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = String(reader.result).split(',')[1];
      try {
        const res = await apiFetch('/api/upload', {
          method: 'POST',
          body: JSON.stringify({ fileName: file.name, fileBase64: base64, contentType: file.type }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        set('image_url', data.url);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      setUploading(false);
      setUploadError('Could not read the file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    setGenError('');
    setInsufficient(false);
    setGenerating(true);
    try {
      const res = await apiFetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          product_name: form.product_name,
          product_url: form.product_url.trim() || null,
          image_url: form.image_url || null,
          description: form.description,
          price: form.price.trim() || null,
          language: form.language,
          tone: form.tone,
          aspect_ratio: form.aspect_ratio,
        }),
      });
      const data = await res.json();
      if (res.status === 402) {
        setInsufficient(true);
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setCreatedId(data.project_id);
      refresh();
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const resetAll = () => {
    setForm(INITIAL_FORM);
    setStep(0);
    setErrors({});
    setGenError('');
    setInsufficient(false);
    setCreatedId(null);
  };

  /* ---------- success screen ---------- */
  if (createdId !== null) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-dark mx-auto max-w-xl p-10 text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15 ring-1 ring-emerald-400/30">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h2 className="mt-5 font-display text-2xl font-bold text-white">Creative queued for generation!</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Project <span className="font-semibold text-violet-300">#{createdId}</span> is in the render pipeline —
          it usually takes under a minute. Track its status in My Library.
        </p>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
          <Coins className="h-3.5 w-3.5 text-amber-400" /> Remaining balance: {balance} credits
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => navigate('/dashboard/library')} className="btn-primary">
            <FolderOpen className="h-4 w-4" /> View in Library
          </button>
          <button onClick={resetAll} className="btn-ghost">
            <Sparkles className="h-4 w-4" /> Create another
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center">
        {STEPS.map((s, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <div key={s.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
                    done
                      ? 'border-emerald-400/40 bg-emerald-400/15 text-emerald-300'
                      : current
                        ? 'border-violet-400/60 bg-violet-500/20 text-white shadow-lg shadow-violet-600/25'
                        : 'border-white/10 bg-white/4 text-zinc-500'
                  }`}
                >
                  {done ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                </div>
                <span
                  className={`mt-2 text-[11px] font-medium ${
                    current ? 'text-white' : done ? 'text-emerald-300' : 'text-zinc-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-2 mb-5 h-px w-12 sm:w-24 ${i < step ? 'bg-emerald-400/50' : 'bg-white/10'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="card-dark overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ---------------- STEP 1 ---------------- */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.25 }}
              className="p-6 sm:p-8"
            >
              <h2 className="font-display text-xl font-semibold text-white">Tell us about your product</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Paste a product link or upload images — the AI uses both to write your ad.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                    <Link2 className="h-3.5 w-3.5" /> Product URL
                  </label>
                  <input
                    className="input-dark"
                    placeholder="https://yourstore.com/products/amazing-item"
                    value={form.product_url}
                    onChange={(e) => set('product_url', e.target.value)}
                  />
                  {errors.product_url && <p className="mt-1.5 text-xs text-rose-400">{errors.product_url}</p>}
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                    <ImagePlus className="h-3.5 w-3.5" /> Product image <span className="text-zinc-600">(optional if you have a URL)</span>
                  </label>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

                  {form.image_url ? (
                    <div className="relative inline-block">
                      <img
                        src={form.image_url}
                        alt="Product"
                        className="h-36 w-36 rounded-2xl border border-white/10 object-cover"
                      />
                      <button
                        onClick={() => set('image_url', '')}
                        className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1.5 text-white shadow-lg transition hover:bg-rose-400"
                        title="Remove image"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/3 px-4 py-8 text-sm text-zinc-400 transition hover:border-violet-500/50 hover:bg-violet-500/5 hover:text-zinc-300"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
                          Uploading…
                        </>
                      ) : (
                        <>
                          <ImagePlus className="h-6 w-6 text-violet-400" />
                          Click to upload a product photo
                          <span className="text-xs text-zinc-600">PNG, JPG or WEBP · up to 4MB</span>
                        </>
                      )}
                    </button>
                  )}
                  {uploadError && <p className="mt-1.5 text-xs text-rose-400">{uploadError}</p>}
                </div>

                <div className="grid gap-5 sm:grid-cols-[1fr_180px]">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">Product title *</label>
                    <input
                      className="input-dark"
                      placeholder="e.g. Aurora Runners — Limited Edition"
                      value={form.product_name}
                      onChange={(e) => set('product_name', e.target.value)}
                      maxLength={160}
                    />
                    {errors.product_name && <p className="mt-1.5 text-xs text-rose-400">{errors.product_name}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">Price</label>
                    <input
                      className="input-dark"
                      placeholder="e.g. 4,900 DZD"
                      value={form.price}
                      onChange={(e) => set('price', e.target.value)}
                      maxLength={40}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">Description *</label>
                  <textarea
                    className="input-dark min-h-[110px] resize-y"
                    placeholder="What makes this product special? Key benefits, materials, offer details…"
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    maxLength={800}
                  />
                  {errors.description && <p className="mt-1.5 text-xs text-rose-400">{errors.description}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {/* ---------------- STEP 2 ---------------- */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.25 }}
              className="p-6 sm:p-8"
            >
              <h2 className="font-display text-xl font-semibold text-white">Who's the audience?</h2>
              <p className="mt-1 text-sm text-zinc-500">Pick the voiceover language and the tone of your ad.</p>

              <div className="mt-6">
                <p className="mb-2.5 text-xs font-medium text-zinc-400">Target language *</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {LANGUAGES.map((lang) => {
                    const selected = form.language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => set('language', lang.code)}
                        className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                          selected
                            ? 'border-violet-500/60 bg-violet-500/15 ring-2 ring-violet-500/40'
                            : 'border-white/10 bg-white/3 hover:border-white/25 hover:bg-white/5'
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-white">{lang.label}</span>
                          <span className="block truncate text-xs text-zinc-500" dir={lang.code === 'en' || lang.code === 'fr' ? 'ltr' : 'rtl'}>
                            {lang.native}
                          </span>
                        </span>
                        {selected && <Check className="h-5 w-5 shrink-0 text-violet-300" />}
                      </button>
                    );
                  })}
                </div>
                {errors.language && <p className="mt-2 text-xs text-rose-400">{errors.language}</p>}
              </div>

              <div className="mt-7">
                <p className="mb-2.5 text-xs font-medium text-zinc-400">Ad tone *</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {TONES.map((tone) => {
                    const selected = form.tone === tone.code;
                    return (
                      <button
                        key={tone.code}
                        onClick={() => set('tone', tone.code)}
                        className={`rounded-2xl border p-3.5 text-left transition-all ${
                          selected
                            ? 'border-fuchsia-500/60 bg-fuchsia-500/15 ring-2 ring-fuchsia-500/40'
                            : 'border-white/10 bg-white/3 hover:border-white/25 hover:bg-white/5'
                        }`}
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold text-white">
                          <span>{tone.emoji}</span> {tone.label}
                          {selected && <Check className="ml-auto h-4 w-4 text-fuchsia-300" />}
                        </span>
                        <span className="mt-1 block text-xs text-zinc-500">{tone.desc}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.tone && <p className="mt-2 text-xs text-rose-400">{errors.tone}</p>}
              </div>
            </motion.div>
          )}

          {/* ---------------- STEP 3 ---------------- */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.25 }}
              className="p-6 sm:p-8"
            >
              <h2 className="font-display text-xl font-semibold text-white">Choose your format</h2>
              <p className="mt-1 text-sm text-zinc-500">Where will this ad run?</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {RATIOS.map((ratio) => {
                  const selected = form.aspect_ratio === ratio.code;
                  return (
                    <button
                      key={ratio.code}
                      onClick={() => set('aspect_ratio', ratio.code)}
                      className={`relative rounded-2xl border p-4 text-center transition-all ${
                        selected
                          ? 'border-violet-500/60 bg-violet-500/15 ring-2 ring-violet-500/40'
                          : 'border-white/10 bg-white/3 hover:border-white/25 hover:bg-white/5'
                      }`}
                    >
                      {ratio.recommended && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          Recommended
                        </span>
                      )}
                      <div className="flex h-20 items-center justify-center text-violet-300">
                        {ratio.code === '9:16' && <Smartphone className="h-12 w-12" />}
                        {ratio.code === '1:1' && <Square className="h-11 w-11" />}
                        {ratio.code === '16:9' && <MonitorPlay className="h-12 w-12" />}
                      </div>
                      <p className="mt-2 text-sm font-semibold text-white">{ratio.label}</p>
                      <p className="mt-0.5 text-[11px] text-zinc-500">{ratio.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="mt-7 rounded-2xl border border-white/8 bg-white/3 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Summary</p>
                <div className="mt-3 grid gap-2.5 text-sm sm:grid-cols-2">
                  <p className="text-zinc-400">
                    Product: <span className="font-medium text-white">{form.product_name || '—'}</span>
                  </p>
                  <p className="text-zinc-400">
                    Language:{' '}
                    <span className="font-medium text-white">
                      {LANGUAGES.find((l) => l.code === form.language)?.label || '—'}
                    </span>
                  </p>
                  <p className="text-zinc-400">
                    Tone:{' '}
                    <span className="font-medium text-white">
                      {TONES.find((t) => t.code === form.tone)?.label || '—'}
                    </span>
                  </p>
                  <p className="text-zinc-400">
                    Format: <span className="font-medium text-white">{form.aspect_ratio}</span>
                  </p>
                </div>
                <p className="mt-4 flex items-center gap-1.5 border-t border-white/5 pt-3.5 text-xs text-zinc-500">
                  <Coins className="h-3.5 w-3.5 text-amber-400" />
                  This generation costs <span className="font-semibold text-amber-300">1 credit</span> · Balance:{' '}
                  <span className="font-semibold text-amber-300">{balance}</span>
                </p>
              </div>

              {insufficient && (
                <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-start gap-2 text-sm text-amber-200">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    You're out of credits. Top up to keep generating.
                  </p>
                  <Link to="/dashboard/credits" className="btn-primary shrink-0 px-4 py-2 text-xs">
                    <Coins className="h-3.5 w-3.5" /> Go to Credit Store
                  </Link>
                </div>
              )}
              {genError && (
                <div className="mt-5 flex items-start gap-2 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm text-rose-300">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {genError}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer nav */}
        <div className="flex items-center justify-between border-t border-white/5 bg-white/2 px-6 py-4 sm:px-8">
          <button onClick={goBack} disabled={step === 0 || generating} className="btn-ghost disabled:opacity-40">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          {step < 2 ? (
            <button onClick={goNext} className="btn-primary">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={generating || balance <= 0}
              className="btn-primary"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate Creative — 1 credit
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {step === 2 && balance <= 0 && !insufficient && (
        <p className="mt-4 text-center text-sm text-zinc-500">
          Not enough credits —{' '}
          <Link to="/dashboard/credits" className="font-semibold text-violet-400 hover:text-violet-300">
            top up in the Credit Store
          </Link>{' '}
          to generate.
        </p>
      )}

    </div>
  );
}
