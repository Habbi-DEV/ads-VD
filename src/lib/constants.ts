export interface LanguageOption {
  code: string;
  label: string;
  native: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'dz', label: 'Algerian Darija', native: 'الدارجة الجزائرية', flag: '🇩🇿' },
  { code: 'ar', label: 'Arabic', native: 'العربية الفصحى', flag: '🌐' },
  { code: 'fr', label: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
];

export interface ToneOption {
  code: string;
  label: string;
  emoji: string;
  desc: string;
}

export const TONES: ToneOption[] = [
  { code: 'energetic', label: 'Energetic', emoji: '⚡', desc: 'High energy, hype-driven' },
  { code: 'trustworthy', label: 'Trustworthy', emoji: '🤝', desc: 'Calm, credible, proof-led' },
  { code: 'luxury', label: 'Luxury', emoji: '✨', desc: 'Premium, minimal, elegant' },
  { code: 'funny', label: 'Funny', emoji: '😂', desc: 'Meme-flavoured, playful' },
  { code: 'urgent', label: 'Urgent', emoji: '🔥', desc: 'FOMO, limited-time push' },
];

export interface RatioOption {
  code: string;
  label: string;
  desc: string;
  recommended: boolean;
}

export const RATIOS: RatioOption[] = [
  { code: '9:16', label: 'Vertical 9:16', desc: 'TikTok · Reels · Shorts', recommended: true },
  { code: '1:1', label: 'Square 1:1', desc: 'Facebook · Instagram feed', recommended: false },
  { code: '16:9', label: 'Landscape 16:9', desc: 'YouTube · Web players', recommended: false },
];

export const languageMeta = (code: string | null | undefined) =>
  LANGUAGES.find((l) => l.code === code);

export const toneMeta = (code: string | null | undefined) =>
  TONES.find((t) => t.code === code);
