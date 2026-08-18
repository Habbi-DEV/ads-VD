import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Coins, FolderOpen, LogOut, Menu, Settings, Wand2, X, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import supabase from '../../lib/supabase';
import Logo from '../Logo';

const NAV_ITEMS = [
  { to: '/dashboard/create', label: 'Create Creative', icon: Wand2 },
  { to: '/dashboard/library', label: 'My Library', icon: FolderOpen },
  { to: '/dashboard/credits', label: 'Credit Store', icon: Coins },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const TITLES: Record<string, string> = {
  '/dashboard/create': 'Create Creative',
  '/dashboard/library': 'My Library',
  '/dashboard/credits': 'Credit Store',
  '/dashboard/settings': 'Settings',
};

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Creator';
  const initials = displayName.slice(0, 2).toUpperCase();
  const title = TITLES[location.pathname] || 'Dashboard';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-white/5 px-5">
        <Logo size="sm" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600/25 to-fuchsia-600/15 text-white shadow-inner ring-1 ring-violet-500/30'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4">
        <button
          onClick={() => {
            setMobileOpen(false);
            navigate('/dashboard/credits');
          }}
          className="w-full rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/10 p-4 text-left transition hover:border-violet-500/50"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Zap className="h-4 w-4 text-amber-300" /> Need more credits?
          </div>
          <p className="mt-1 text-xs leading-relaxed text-zinc-400">
            Top up from $9 and keep your ads shipping.
          </p>
        </button>
      </div>

      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{displayName}</p>
            <p className="truncate text-xs text-zinc-500">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-rose-400"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/5 bg-ink-900/70 backdrop-blur-xl lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-ink-900 lg:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 z-10 rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-ink-950/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display text-lg font-semibold text-white">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/credits')}
              title="Credit balance — click to top up"
              className="flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-3.5 py-1.5 text-sm font-semibold text-amber-300 transition hover:bg-amber-400/20"
            >
              <Coins className="h-4 w-4" />
              {loading ? '…' : profile?.credits_balance ?? 0}
              <span className="hidden font-medium text-amber-300/70 sm:inline">credits</span>
            </button>

            <div className="hidden items-center gap-2.5 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">
                {initials}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium leading-tight text-white">{displayName}</p>
                <p className="text-[11px] leading-tight text-zinc-500">Free plan</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
