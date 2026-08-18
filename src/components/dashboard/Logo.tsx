import { Clapperboard } from 'lucide-react';

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const box = size === 'md' ? 'h-9 w-9' : 'h-8 w-8';
  const icon = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';
  const text = size === 'md' ? 'text-lg' : 'text-base';
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-600/30 ${box}`}
      >
        <Clapperboard className={`${icon} text-white`} />
      </div>
      <span className={`font-display font-bold tracking-tight text-white ${text}`}>
        Creative<span className="text-gradient">Gen</span>
      </span>
    </div>
  );
}
