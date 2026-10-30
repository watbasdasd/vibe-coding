// ==========================================
// MyLink - Core Types & Interfaces
// ==========================================

export type SocialPlatform =
  | "github"
  | "linkedin"
  | "twitter"
  | "instagram"
  | "youtube"
  | "email"
  | "threads"
  | "website"
  | "tiktok"
  | "kakaotalk";

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  platform: SocialPlatform;
  isActive?: boolean;
}

export type LinkCategory = "all" | "featured" | "project" | "blog" | "contact" | "other";

export interface CustomLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  category: "project" | "blog" | "contact" | "other";
  isFeatured?: boolean;
  isActive: boolean;
  clicks: number;
  badge?: string; // e.g. "HOT", "NEW", "SALE", "RECOMMEND"
}

export interface BentoItem {
  songTitle: string;
  songArtist: string;
  focusTitle: string;
  focusDesc: string;
}

export type ThemeId = "aurora" | "cyber" | "sunset" | "forest" | "dark" | "pearl";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  previewColor: string;
  bgClass: string;
  blobColors: string[];
  bannerGradient: string;
  cardBg: string;
  cardBorder: string;
  accentText: string;
  badgeStyle: string;
  buttonPrimary: string;
  isDark: boolean;
}

export interface UserProfile {
  name: string;
  handle: string; // e.g. "alex.dev" or "@alex.dev"
  bio: string;
  avatarUrl: string;
  location: string;
  status: string;
  availableForWork: boolean;
  tags: string[];
  theme: ThemeId;
  likes: number;
  socials: SocialLink[];
  links: CustomLink[];
  bento: BentoItem;
}

// 6 Preset Themes
export const THEMES: Record<ThemeId, ThemeConfig> = {
  aurora: {
    id: "aurora",
    name: "오로라 인디고",
    tagline: "신비롭고 깊이 있는 우주와 오로라의 빛",
    previewColor: "from-indigo-600 to-purple-600",
    bgClass: "bg-slate-950 text-slate-100",
    blobColors: ["bg-indigo-600/20", "bg-purple-600/20", "bg-blue-600/20"],
    bannerGradient: "from-violet-700 via-indigo-600 to-cyan-500",
    cardBg: "bg-slate-900/80 backdrop-blur-2xl",
    cardBorder: "border-slate-800/80 hover:border-indigo-500/40",
    accentText: "from-indigo-400 via-purple-300 to-pink-400",
    badgeStyle: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    buttonPrimary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/25",
    isDark: true,
  },
  cyber: {
    id: "cyber",
    name: "사이버 네온",
    tagline: "미래지향적인 네온 바이올렛 & 사이버 펑크 감성",
    previewColor: "from-fuchsia-600 to-cyan-500",
    bgClass: "bg-neutral-950 text-neutral-100",
    blobColors: ["bg-fuchsia-600/20", "bg-cyan-500/20", "bg-purple-600/20"],
    bannerGradient: "from-fuchsia-600 via-purple-600 to-cyan-500",
    cardBg: "bg-neutral-900/85 backdrop-blur-2xl",
    cardBorder: "border-neutral-800 hover:border-fuchsia-500/50",
    accentText: "from-fuchsia-400 via-purple-300 to-cyan-400",
    badgeStyle: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
    buttonPrimary: "bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white shadow-fuchsia-500/25",
    isDark: true,
  },
  sunset: {
    id: "sunset",
    name: "선셋 코랄",
    tagline: "따스하고 감성적인 노을빛 피치 & 로즈 골드",
    previewColor: "from-rose-500 to-amber-500",
    bgClass: "bg-stone-950 text-stone-100",
    blobColors: ["bg-rose-600/20", "bg-orange-500/20", "bg-amber-500/20"],
    bannerGradient: "from-rose-500 via-orange-500 to-amber-400",
    cardBg: "bg-stone-900/80 backdrop-blur-2xl",
    cardBorder: "border-stone-800/80 hover:border-rose-500/40",
    accentText: "from-rose-400 via-orange-300 to-amber-300",
    badgeStyle: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    buttonPrimary: "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-rose-500/25",
    isDark: true,
  },
  forest: {
    id: "forest",
    name: "에메랄드 포레스트",
    tagline: "차분하고 싱그러운 숲의 에메랄드 & 세이지 그린",
    previewColor: "from-emerald-600 to-teal-500",
    bgClass: "bg-zinc-950 text-zinc-100",
    blobColors: ["bg-emerald-600/20", "bg-teal-500/20", "bg-cyan-600/20"],
    bannerGradient: "from-emerald-600 via-teal-600 to-lime-500",
    cardBg: "bg-zinc-900/80 backdrop-blur-2xl",
    cardBorder: "border-zinc-800/80 hover:border-emerald-500/40",
    accentText: "from-emerald-400 via-teal-300 to-cyan-300",
    badgeStyle: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    buttonPrimary: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/25",
    isDark: true,
  },
  dark: {
    id: "dark",
    name: "미드나잇 모노",
    tagline: "군더더기 없이 정제된 하이엔드 모노크롬",
    previewColor: "from-zinc-700 to-zinc-900",
    bgClass: "bg-black text-zinc-100",
    blobColors: ["bg-zinc-800/30", "bg-zinc-700/20", "bg-zinc-900/40"],
    bannerGradient: "from-zinc-800 via-neutral-800 to-zinc-900",
    cardBg: "bg-zinc-950/90 backdrop-blur-2xl",
    cardBorder: "border-zinc-800 hover:border-zinc-600",
    accentText: "from-white via-zinc-200 to-zinc-400",
    badgeStyle: "bg-zinc-800 text-zinc-300 border-zinc-700",
    buttonPrimary: "bg-white text-black hover:bg-zinc-200 shadow-white/10",
    isDark: true,
  },
  pearl: {
    id: "pearl",
    name: "퓨어 펄 화이트",
    tagline: "티없이 맑고 세련된 라이트 모드 글래스",
    previewColor: "from-sky-300 to-indigo-300",
    bgClass: "bg-gradient-to-b from-slate-50 via-slate-100 to-zinc-200 text-slate-800",
    blobColors: ["bg-sky-400/15", "bg-purple-400/15", "bg-rose-400/15"],
    bannerGradient: "from-sky-400 via-indigo-400 to-pink-400",
    cardBg: "bg-white/80 backdrop-blur-2xl",
    cardBorder: "border-slate-200 hover:border-indigo-400/50",
    accentText: "from-indigo-600 via-purple-600 to-pink-600",
    badgeStyle: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    buttonPrimary: "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/15",
    isDark: false,
  },
};
