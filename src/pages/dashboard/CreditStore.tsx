import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, Coins, Crown, Loader2, Rocket, Sparkles, Zap } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useProfile } from '../../contexts/ProfileContext';

const PACKS = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Zap,
    credits: 10,
    price: 9,
    perRender: '$0.90',
    tagline: 'For testing new products',
    perks: ['10 video renders', 'All 4 languages', 'Standard render queue'],
    popular: false,
  },
  {
    id: 'creator',
    name: 'Creator',
    icon: Rocket,
    credits: 30,
    price: 19,
    perRender: '$0.63',
    tagline: 'For serious store owners',
    perks: ['30 video renders', 'All 4 languages', 'Priority render queue', 'No watermark'],
    popular: true,
  },
  {
    id: 'studio',
    name: 'Studio',
    icon: Crown,
    credits: 100,
    price: 49,
    perRender: '$0.49',
    tagline: 'For agencies & scaling brands',
    perks: ['100 video renders', 'All 4 languages', 'Priority render queue', 'No watermark', 'Early access features'],
    popular: false,
  },
];

export default function CreditStore() {
  const { profile, refresh } = useProfile();
  const [buying, setBuying] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleBuy = async (packId: string, credits: number) => {
    setBuying(packId);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await apiFetch('/api/credits', {
        method: 'POST',
        body: JSON.stringify({ amount: credits }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Purchase failed');
      await refresh();
      setSuccessMsg(`+${credits} credits added — new balance: ${data.credits_balance}`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Purchase failed. Please try again.');
    } finally {
      setBuying(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Balance hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-dark relative overflow-hidden p-8 text-center"
      >
        <div className="absolute -top-20 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-amber-400/10 blur-[90px]" />
        <div className="relative">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/15 ring-1 ring-amber-400/30">
            <Coins className="h-7 w-7 text-amber-300" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">Current balance</p>
          <p className="mt-1 font-display text-5xl font-bold text-white">
            {profile ? profile.credits_balance : '…'}
            <span className="ml-2 text-lg font-medium text-zinc-500">credits</span>
          </p>
          <p className="mt-2 text-sm text-zinc-500">1 credit = 1 rendered video ad · credits never expire</p>
        </div>
      </motion.div>

      {/* Messages */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
          >
            <Check className="h-4 w-4 shrink-0" /> {successMsg}
          </motion.div>
        )}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 flex items-center gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
          >
            <AlertCircle className="h-4 w-4 shrink-0" /> {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Packs */}
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {PACKS.map((pack, i) => (
          <motion.div
            key={pack.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.08 }}
            className={`card-dark relative flex flex-col p-6 ${
              pack.popular ? 'border-violet-500/60 ring-2 ring-violet-500/50' : ''
            }`}
          >
            {pack.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg">
                Best value
              </span>
            )}

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/20 ring-1 ring-violet-500/30">
                <pack.icon className="h-5 w-5 text-violet-300" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-white">{pack.name}</h3>
                <p className="text-[11px] text-zinc-500">{pack.tagline}</p>
              </div>
            </div>

            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold text-white">${pack.price}</span>
              <span className="text-sm text-zinc-500">· {pack.perRender}/render</span>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-amber-300">
              <Coins className="h-4 w-4" /> {pack.credits} credits
            </p>

            <ul className="mt-5 flex-1 space-y-2.5">
              {pack.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-sm text-zinc-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {perk}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleBuy(pack.id, pack.credits)}
              disabled={buying !== null}
              className={pack.popular ? 'btn-primary mt-6 w-full' : 'btn-ghost mt-6 w-full'}
            >
              {buying === pack.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Buy {pack.credits} credits
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-zinc-600">
        Demo checkout — no payment required. Credits are added to your balance instantly.
      </p>
    </div>
  );
}
