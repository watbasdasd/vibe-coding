/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo } from "react";
import { UserProfile, LinkCategory, THEMES, SocialPlatform } from "@/types/profile";
import { QRCodeModal } from "./QRCodeModal";

interface PublicProfileViewProps {
  profile: UserProfile;
  isPreview?: boolean;
  onLinkClick?: (id: string) => void;
  onLike?: () => void;
}

// Social icon helpers
function getSocialIcon(platform: SocialPlatform) {
  switch (platform) {
    case "github":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      );
    case "twitter":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "kakaotalk":
      return <span className="font-bold text-xs">TALK</span>;
    case "email":
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
  }
}

export function PublicProfileView({
  profile,
  isPreview = false,
  onLinkClick,
  onLike,
}: PublicProfileViewProps) {
  const [activeCategory, setActiveCategory] = useState<LinkCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [heartPushed, setHeartPushed] = useState(false);
  const [heartParticles, setHeartParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const theme = THEMES[profile.theme] || THEMES.aurora;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newParticle = {
      id: Date.now(),
      x: e.clientX - rect.left - 10,
      y: e.clientY - rect.top - 20,
    };
    setHeartParticles((prev) => [...prev, newParticle]);
    setTimeout(() => {
      setHeartParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1000);

    setHeartPushed(true);
    setTimeout(() => setHeartPushed(false), 300);

    if (onLike) {
      onLike();
    }
  };

  const handleLinkSelect = (id: string, url: string) => {
    if (onLinkClick) {
      onLinkClick(id);
    }
    if (!isPreview && url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleShareClick = async () => {
    const url = typeof window !== "undefined" ? window.location.href : `https://mylink.bio/@${profile.handle}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name} | MyLink`,
          text: profile.bio,
          url,
        });
        return;
      } catch {
        // Fallback
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("✨ 프로필 링크가 복사되었습니다!");
    } catch {
      showToast("링크 복사에 실패했습니다.");
    }
  };

  // Filtered links
  const filteredLinks = useMemo(() => {
    return profile.links.filter((link) => {
      // Must be active (or in preview mode show active ones)
      if (link.isActive === false) return false;
      // Category filter
      if (activeCategory !== "all") {
        if (activeCategory === "featured" && !link.isFeatured) return false;
        if (activeCategory !== "featured" && link.category !== activeCategory) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = link.title.toLowerCase().includes(q);
        const matchDesc = link.description?.toLowerCase().includes(q) || false;
        if (!matchTitle && !matchDesc) return false;
      }
      return true;
    });
  }, [profile.links, activeCategory, searchQuery]);

  const profileUrl = typeof window !== "undefined"
    ? `${window.location.origin}/@${profile.handle}`
    : `https://mylink.bio/@${profile.handle}`;

  return (
    <div
      className={`relative w-full ${
        isPreview ? "min-h-full" : "min-h-screen"
      } ${theme.bgClass} flex flex-col items-center select-none transition-colors duration-500 overflow-x-hidden`}
    >
      {/* Background Decorative Blur Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-24 -left-24 w-72 h-72 rounded-full ${theme.blobColors[0]} blur-3xl opacity-70 animate-pulse`}
        />
        <div
          className={`absolute top-1/3 -right-20 w-80 h-80 rounded-full ${theme.blobColors[1]} blur-3xl opacity-60`}
        />
        <div
          className={`absolute -bottom-20 left-10 w-96 h-96 rounded-full ${theme.blobColors[2]} blur-3xl opacity-50`}
        />
      </div>

      {/* Profile Container */}
      <div className={`relative z-10 w-full ${isPreview ? "max-w-md px-3 py-4" : "max-w-md px-4 py-8"} flex flex-col items-center`}>
        {/* Top Floating Actions (Share & QR & Like) */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/80">
              @{profile.handle}
            </span>
            {profile.availableForWork && (
              <span className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Work Available
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Heart Button */}
            <button
              onClick={handleLikeClick}
              className={`relative px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md flex items-center gap-1.5 text-xs text-rose-400 transition transform ${
                heartPushed ? "scale-125" : "scale-100"
              }`}
              title="좋아요 / 응원하기"
            >
              <span>❤️</span>
              <span className="font-semibold text-[11px] text-white/90">{profile.likes}</span>
              {heartParticles.map((p) => (
                <span
                  key={p.id}
                  className="absolute pointer-events-none text-rose-500 font-bold animate-ping text-sm"
                  style={{ left: p.x, top: p.y }}
                >
                  💖
                </span>
              ))}
            </button>

            {/* QR Modal Trigger */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-white/90 hover:text-white transition"
              title="QR 코드 & 공유"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </button>

            {/* Share Trigger */}
            <button
              onClick={handleShareClick}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-white/90 hover:text-white transition"
              title="링크 복사"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Profile Card Header */}
        <div className="w-full flex flex-col items-center text-center mt-2 mb-6">
          <div className="relative group mb-3">
            <div
              className={`absolute -inset-1 rounded-full bg-gradient-to-r ${theme.bannerGradient} opacity-75 blur group-hover:opacity-100 transition duration-500`}
            />
            <img
              src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80"}
              alt={profile.name}
              className="relative w-24 h-24 rounded-full object-cover border-2 border-white/80 shadow-2xl"
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-1">
            {profile.name}
          </h1>

          {profile.location && (
            <p className="text-xs text-white/60 flex items-center gap-1 mb-2">
              <span>📍</span>
              <span>{profile.location}</span>
            </p>
          )}

          <p className="text-xs sm:text-sm text-white/80 max-w-xs leading-relaxed mb-3">
            {profile.bio}
          </p>

          {profile.status && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs backdrop-blur-md mb-3">
              <span>{profile.status}</span>
            </div>
          )}

          {/* Tags */}
          {profile.tags && profile.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 max-w-sm mb-4">
              {profile.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${theme.badgeStyle}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Socials Icon Bar */}
          {profile.socials && profile.socials.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-1">
              {profile.socials
                .filter((s) => s.isActive !== false && s.url)
                .map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white/90 hover:text-white transition transform hover:scale-110 shadow-sm"
                    title={social.name}
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
            </div>
          )}
        </div>

        {/* Bento Widgets (Song & Focus) */}
        {profile.bento && (profile.bento.songTitle || profile.bento.focusTitle) && (
          <div className="w-full grid grid-cols-2 gap-2.5 mb-5">
            {profile.bento.songTitle && (
              <div className={`p-3 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} flex flex-col justify-between shadow-lg`}>
                <div className="flex items-center gap-1.5 text-[10px] text-white/60 mb-1">
                  <span>🎧</span>
                  <span className="font-semibold uppercase tracking-wider">Now Playing</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white truncate">{profile.bento.songTitle}</div>
                  <div className="text-[11px] text-white/70 truncate">{profile.bento.songArtist}</div>
                </div>
              </div>
            )}
            {profile.bento.focusTitle && (
              <div className={`p-3 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} flex flex-col justify-between shadow-lg`}>
                <div className="flex items-center gap-1.5 text-[10px] text-white/60 mb-1">
                  <span>⚡</span>
                  <span className="font-semibold uppercase tracking-wider">Current Focus</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white truncate">{profile.bento.focusTitle}</div>
                  <div className="text-[11px] text-white/70 truncate">{profile.bento.focusDesc}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Link Filter Categories & Search Bar */}
        <div className="w-full mb-4 space-y-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            {(
              [
                { id: "all", label: "전체" },
                { id: "featured", label: "⭐ 추천" },
                { id: "project", label: "프로젝트" },
                { id: "blog", label: "블로그" },
                { id: "contact", label: "연락처" },
                { id: "other", label: "기타" },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition font-medium ${
                  activeCategory === cat.id
                    ? "bg-white text-zinc-900 font-bold shadow-md"
                    : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="링크 검색하기..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/40"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/50 text-xs">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Custom Links List */}
        <div className="w-full flex flex-col gap-2.5">
          {filteredLinks.length === 0 ? (
            <div className="text-center py-8 text-white/50 text-xs">
              등록된 링크가 없거나 검색 조건에 맞지 않습니다.
            </div>
          ) : (
            filteredLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkSelect(link.id, link.url)}
                className={`group relative w-full p-3.5 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} flex items-center justify-between gap-3 text-left transition transform hover:-translate-y-0.5 active:scale-[0.98] shadow-lg backdrop-blur-xl ${
                  link.isFeatured ? "ring-1 ring-white/30" : ""
                }`}
              >
                {/* Left Icon */}
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg flex-shrink-0 border border-white/10 shadow-inner group-hover:scale-105 transition">
                  {link.icon || "🔗"}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-bold text-sm text-white truncate">
                      {link.title}
                    </span>
                    {link.badge && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-500 text-white tracking-wide uppercase shadow-sm">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  {link.description && (
                    <p className="text-[11px] text-white/70 line-clamp-1">
                      {link.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-white/50">
                    <span>{new URL(link.url.startsWith("http") ? link.url : `https://${link.url}`).hostname}</span>
                    <span>•</span>
                    <span>클릭 {link.clicks}회</span>
                  </div>
                </div>

                {/* Outlink Arrow */}
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-white/20 transition flex-shrink-0">
                  <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer Brand */}
        <div className="mt-8 mb-4 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/60 hover:text-white transition px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>Powered by <strong>MyLink</strong></span>
          </a>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={profileUrl}
        title={profile.name}
        avatarUrl={profile.avatarUrl}
      />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 z-50 px-4 py-2 rounded-full bg-zinc-900/90 text-white text-xs border border-zinc-700 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
