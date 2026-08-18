import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Coins,
  Layers,
  Link2,
  Mic,
  Play,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
} from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const FEATURES = [
  {
    icon: Link2,
    title: 'Link → Script AI',
    desc: 'Paste a product URL. Our AI reads the page and writes a conversion-focused script with a scroll-stopping hook.',
  },
  {
    icon: Mic,
    title: 'Native Voiceovers',
    desc: 'AI voices in Algerian Darija, Arabic, French and English — accented right, paced to sell.',
  },
  {
    icon: Smartphone,
    title: 'Built for 9:16',
    desc: 'Vertical-first renders optimized for TikTok, Instagram Reels and YouTube Shorts.',
  },
  {
    icon: Layers,
    title: 'One-Click Variations',
    desc: 'Spin multiple hooks and angles from a single product to beat ad fatigue.',
  },
  {
    icon: Coins,
    title: 'Credit-Based, Fair',
    desc: 'One credit per render. Watch your balance live and top up only when you need to.',
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce Native',
    desc: 'Prices, offers and CTAs are baked into every creative — made for store owners.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Paste your product link',
    desc: 'Or upload product photos directly — CreativeGen extracts the title, price and selling points automatically.',
  },
  {
    n: '02',
    title: 'Pick language & tone',
    desc: 'Algerian Darija, Arabic, French or English. Energetic, luxury, urgent — you choose the vibe.',
  },
  {
    n: '03',
    title: 'Generate & launch',
    desc: 'Get a 9:16 video ad with script and voiceover in seconds. Download it and run it anywhere.',
  },
];

const PLANS = [
  {
    name: 'Free Trial',
    price: '$0',
    credits: '5 credits',
    desc: 'Test the magic, no card needed.',
    features: ['5 video renders', 'All 4 languages', '9:16 vertical export', 'Standard queue'],
    popular: false,
  },
  {
    name: 'Starter',
    price: '$9',
    credits: '10 credits',
    desc: 'For testing new products.',
    features: ['10 video renders', 'All 4 languages', '9:16 + 1:1 exports', 'Standard queue'],
    popular: false,
  },
  {
    name: 'Creator',
    price: '$19',
    credits: '30 credits',
    desc: 'For serious store owners.',
    features: ['30 video renders', 'All 4 languages', 'All aspect ratios', 'Priority queue', 'No watermark'],
    popular: true,
  },
  {
    name: 'Studio',
    price: '$49',
    credits: '100 credits',
    desc: 'For agencies & scaling brands.',
    features: ['100 video renders', 'All 4 languages', 'All aspect ratios', 'Priority queue', 'No watermark'],
    popular: false,
  },
];

const TESTIMONIALS = [
  {
    quote: 'I pasted a product link and had a Darija ad live before my coffee was ready. My CTR tripled in a week.',
    name: 'Yacine B.',
    role: 'Shopify seller — Algiers',
    initials: 'YB',
  },
  {
    quote: 'The French voiceovers sound shockingly natural. We retired our old video agency entirely.',
    name: 'Sarah M.',
    role: 'DTC founder — Paris',
    initials: 'SM',
  },
  {
    quote: '5 free credits sold me. Now every single launch goes through CreativeGen first.',
    name: 'Omar K.',
    role: 'Dropshipper — Dubai',
    initials: 'OK',
  },
];

const STATS = [
  ['48K+', 'Creatives generated'],
  ['12K+', 'Store owners'],
  ['4.9/5', 'Average rating'],
  ['3.2x', 'Average ROAS lift'],
];

export default function Landing() {
  const { user } = useAuth();
  const ctaTarget = user ? '/dashboard' : '/login';

  return (
    <div className="min-h-screen bg-ink-950 text-zinc-100">
      {/* ---------- NAV ---------- */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink-950/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#how" className="transition hover:text-white">How it works</a>
            <a href="#pricing" className="transition hover:text-white">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            {!user && (
              <Link to="/login" className="hidden text-sm text-zinc-300 transition hover:text-white sm:block">
                Sign in
              </Link>
            )}
            <Link to={ctaTarget} className="btn-primary">
              {user ? 'Open Dashboard' : 'Start Free'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden pb-20 pt-32 sm:pt-40">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-44 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.11 } } }}>
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-400/10 px-3.5 py-1.5 text-xs font-medium text-violet-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Ad Studio for E-commerce
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl xl:text-6xl"
              >
                Convert Product Links into <span className="text-gradient">Viral Video Ads</span> in Seconds
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                Paste your product URL, pick a language — Algerian Darija, Arabic, French or English — and
                CreativeGen scripts, voices and renders scroll-stopping 9:16 ads for TikTok, Reels and Shorts.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
                <Link to={ctaTarget} className="btn-primary px-6 py-3.5 text-base">
                  Start Free — 5 Credits
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#how" className="btn-ghost px-6 py-3.5 text-base">
                  <Play className="h-4 w-4" />
                  See how it works
                </a>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> 5 free credits on signup
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> Cancel anytime
                </span>
              </motion.div>
            </motion.div>

            {/* Hero visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="relative"
            >
              <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-tr from-violet-600/20 via-fuchsia-500/10 to-transparent blur-3xl" />

              <div className="card-dark relative p-5">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-zinc-400 sm:text-sm">
                  <Link2 className="h-4 w-4 shrink-0 text-violet-400" />
                  <span className="truncate">https://mystore.dz/products/aurora-runners</span>
                  <span className="ml-auto shrink-0 rounded-md bg-emerald-400/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                    Imported ✓
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-medium">
                  <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 py-2 text-emerald-300">Script ✓</div>
                  <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 py-2 text-emerald-300">Voiceover ✓</div>
                  <div className="rounded-lg border border-violet-400/25 bg-violet-400/10 py-2 text-violet-300">Rendering 78%</div>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                </div>

                <div className="mt-5 flex items-end gap-4">
                  <div className="relative mx-auto w-40 shrink-0 overflow-hidden rounded-[22px] border border-white/15 sm:w-44">
                    <img src="/images/demo-sneaker.jpg" alt="Product ad preview" className="aspect-[9/16] w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 backdrop-blur-sm">
                      <Play className="h-5 w-5 fill-white text-white" />
                    </div>
                    <div className="absolute inset-x-2 bottom-2 rounded-lg bg-black/55 px-2 py-1.5 text-center text-[10px] font-medium text-white backdrop-blur-sm">
                      🇩🇿 Darija voiceover · 0:22
                    </div>
                  </div>

                  <div className="flex-1 space-y-2.5 pb-1">
                    {[
                      ['Hook score', '94 / 100'],
                      ['Ad length', '0:22'],
                      ['Format', '9:16 vertical'],
                      ['Predicted CTR', '+3.2x'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/4 px-3 py-2.5">
                        <span className="text-[11px] text-zinc-500">{k}</span>
                        <span className="text-xs font-semibold text-white">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="animate-float absolute -left-5 top-14 hidden rounded-xl border border-white/10 bg-ink-800/90 px-3.5 py-2.5 text-xs font-medium text-zinc-200 shadow-xl backdrop-blur md:block">
                🎙️ Voiceover ready — Darija
              </div>
              <div className="animate-float-delayed absolute -right-3 bottom-16 hidden rounded-xl border border-white/10 bg-ink-800/90 px-3.5 py-2.5 text-xs font-medium text-zinc-200 shadow-xl backdrop-blur md:block">
                ⚡ Rendered in 38s
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- STATS ---------- */}
      <section className="border-y border-white/5 bg-white/2 py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 text-center sm:grid-cols-4 sm:px-6">
          {STATS.map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-3xl font-bold text-white">{value}</p>
              <p className="mt-1 text-xs text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Features</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Everything you need to ship winning ads
          </h2>
          <p className="mt-4 text-zinc-400">
            From link to launch-ready creative — no editors, no agencies, no waiting.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.1 }}
              className="card-dark group p-6 transition hover:border-violet-500/40"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/20 ring-1 ring-violet-500/30">
                <f.icon className="h-5 w-5 text-violet-300" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section id="how" className="border-y border-white/5 bg-white/2 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">How it works</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              From link to ad in three steps
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.12 }}
                className="card-dark relative overflow-hidden p-7"
              >
                <span className="font-display absolute -right-3 -top-6 text-[88px] font-bold leading-none text-white/4">
                  {s.n}
                </span>
                <span className="inline-flex rounded-lg bg-violet-500/15 px-2.5 py-1 text-xs font-bold text-violet-300 ring-1 ring-violet-500/30">
                  STEP {s.n}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PRICING ---------- */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Pricing</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Credit-based plans that scale with you
          </h2>
          <p className="mt-4 text-zinc-400">1 credit = 1 rendered video ad. Credits never expire.</p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className={`card-dark relative flex flex-col p-6 ${
                plan.popular ? 'border-violet-500/60 ring-2 ring-violet-500/50' : ''
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-lg font-semibold text-white">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-sm text-zinc-500">one-time</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-violet-300">{plan.credits}</p>
              <p className="mt-2 text-xs text-zinc-500">{plan.desc}</p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to={ctaTarget} className={plan.popular ? 'btn-primary mt-6 w-full' : 'btn-ghost mt-6 w-full'}>
                {plan.price === '$0' ? 'Start free' : `Get ${plan.credits}`}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section className="border-t border-white/5 bg-white/2 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Loved by sellers</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Store owners ship faster with CreativeGen
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.figure
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="card-dark p-6"
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-zinc-300">“{t.quote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="card-dark relative overflow-hidden px-6 py-16 text-center sm:px-16">
          <div className="absolute -top-24 left-1/2 h-64 w-[560px] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[110px]" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl">
              Your next viral ad is one link away
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Join 12,000+ store owners turning product pages into scroll-stopping video ads. Start with 5 free credits.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to={ctaTarget} className="btn-primary px-7 py-3.5 text-base">
                Create your first ad free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row">
          <Logo size="sm" />
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} CreativeGen — AI video ads for e-commerce. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-zinc-500">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#pricing" className="transition hover:text-white">Pricing</a>
            <Link to="/login" className="transition hover:text-white">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
