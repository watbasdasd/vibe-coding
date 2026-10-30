/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useProfileStore } from "@/lib/store";
import { THEMES, ThemeId, CustomLink, SocialPlatform } from "@/types/profile";
import { PhoneMockup } from "@/components/PhoneMockup";
import { QRCodeModal } from "@/components/QRCodeModal";

export default function StudioPage() {
  const {
    profile,
    updateProfile,
    addLink,
    updateLink,
    deleteLink,
    moveLink,
    toggleLinkActive,
    incrementClick,
    incrementLike,
    setTheme,
    resetProfile,
    resetLinksToDefault,
    loadPreset,
  } = useProfileStore();

  const [activeTab, setActiveTab] = useState<"links" | "profile" | "themes" | "analytics">("links");
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");

  // New Link Form State
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState("🔗");
  const [newCategory, setNewCategory] = useState<"project" | "blog" | "contact" | "other">("project");
  const [newBadge, setNewBadge] = useState("");

  // Editing existing link ID
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);

  // New Tag State
  const [newTagInput, setNewTagInput] = useState("");

  // Toast / Modals
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyUrl = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/@${profile.handle}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("✨ 내 링크 URL이 복사되었습니다!");
    } catch {
      showToast("URL 복사에 실패했습니다.");
    }
  };

  const handleAddLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      showToast("제목과 URL을 모두 입력해주세요.");
      return;
    }
    let formattedUrl = newUrl.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://") && !formattedUrl.startsWith("mailto:")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    addLink({
      title: newTitle.trim(),
      url: formattedUrl,
      description: newDesc.trim() || undefined,
      icon: newIcon.trim() || "🔗",
      category: newCategory,
      badge: newBadge.trim() || undefined,
      isActive: true,
      isFeatured: false,
    });

    setNewTitle("");
    setNewUrl("");
    setNewDesc("");
    setNewIcon("🔗");
    setNewBadge("");
    setIsAddingLink(false);
    showToast("새 링크가 성공적으로 추가되었습니다.");
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const clean = newTagInput.trim().replace(/^#/, "");
    if (profile.tags.includes(clean)) {
      showToast("이미 존재하는 태그입니다.");
      return;
    }
    updateProfile({ tags: [...profile.tags, clean] });
    setNewTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateProfile({ tags: profile.tags.filter((t) => t !== tagToRemove) });
  };

  // Analytics computation
  const totalClicks = profile.links.reduce((acc, cur) => acc + (cur.clicks || 0), 0);
  const estimatedViews = Math.max(totalClicks * 2 + profile.likes * 5, 240);
  const ctr = estimatedViews > 0 ? ((totalClicks / estimatedViews) * 100).toFixed(1) : "0.0";
  const sortedLinksByClicks = [...profile.links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-zinc-900/90 border-b border-zinc-800 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md group-hover:scale-105 transition">
              M
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              MyLink <span className="text-xs font-semibold text-indigo-400 ml-1">Studio</span>
            </span>
          </Link>

          <span className="hidden sm:inline-block w-px h-5 bg-zinc-800" />

          {/* Public Link Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-xs">
            <span className="text-zinc-400">내 링크:</span>
            <span className="font-semibold text-indigo-300">/@{profile.handle}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Mobile View Switcher */}
          <div className="flex lg:hidden bg-zinc-800 rounded-xl p-0.5 border border-zinc-700">
            <button
              onClick={() => setMobileView("editor")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                mobileView === "editor" ? "bg-zinc-700 text-white" : "text-zinc-400"
              }`}
            >
              편집
            </button>
            <button
              onClick={() => setMobileView("preview")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                mobileView === "preview" ? "bg-indigo-600 text-white" : "text-zinc-400"
              }`}
            >
              미리보기
            </button>
          </div>

          <button
            onClick={handleCopyUrl}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition"
          >
            <span>🔗</span>
            <span>링크 복사</span>
          </button>

          <button
            onClick={() => setIsQRModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition"
            title="QR 코드 생성"
          >
            <span>📱</span>
            <span className="hidden sm:inline">QR 코드</span>
          </button>

          <Link
            href={`/@${profile.handle}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
          >
            <span>방문하기</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Main Studio Body (Split Grid on Desktop) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Editor Controls (7 cols on Desktop) */}
        <section
          className={`lg:col-span-7 flex flex-col gap-4 ${
            mobileView === "preview" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-x-auto scrollbar-none text-xs font-semibold">
            {[
              { id: "links", label: "🔗 링크 & 블록" },
              { id: "profile", label: "👤 프로필 정보" },
              { id: "themes", label: "🎨 디자인 테마" },
              { id: "analytics", label: "📊 통계 분석" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition text-center ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-bold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Links & Blocks Management */}
          {activeTab === "links" && (
            <div className="flex flex-col gap-4">
              {/* Preset & Dummy Data Controller Banner */}
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">✨</span>
                  <div>
                    <span className="font-bold text-zinc-200">더미 데이터 프리셋</span>
                    <span className="text-[11px] text-zinc-400 ml-1.5 hidden sm:inline">원클릭으로 맞춤 링크 목록 적용</span>
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      loadPreset("developer");
                      showToast("👨‍💻 개발자 더미 데이터가 적용되었습니다.");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition"
                  >
                    개발자
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      loadPreset("creator");
                      showToast("🎬 크리에이터 더미 데이터가 적용되었습니다.");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition"
                  >
                    크리에이터
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      loadPreset("store");
                      showToast("🌿 비즈니스 스토어 더미 데이터가 적용되었습니다.");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition"
                  >
                    스토어
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetLinksToDefault();
                      showToast("🔄 최신 더미 링크 목록으로 초기화되었습니다.");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition flex items-center gap-1"
                    title="최신 기본 더미 데이터로 복원"
                  >
                    <span>🔄</span>
                    <span>더미 복원</span>
                  </button>
                </div>
              </div>

              {/* Add New Link Button / Accordion */}
              {!isAddingLink ? (
                <button
                  onClick={() => setIsAddingLink(true)}
                  className="w-full py-3.5 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-indigo-500 bg-zinc-900/50 hover:bg-indigo-950/20 text-indigo-400 font-semibold text-sm flex items-center justify-center gap-2 transition group"
                >
                  <span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs group-hover:scale-110 transition">
                    +
                  </span>
                  <span>새 링크 블록 추가하기</span>
                </button>
              ) : (
                <form
                  onSubmit={handleAddLinkSubmit}
                  className="p-5 rounded-2xl bg-zinc-900 border border-indigo-500/40 shadow-xl flex flex-col gap-3.5"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <h4 className="font-bold text-sm text-indigo-300 flex items-center gap-1.5">
                      <span>✨</span> 새 링크 생성
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingLink(false)}
                      className="text-zinc-400 hover:text-white text-xs"
                    >
                      취소
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-1">
                      <label className="text-[11px] text-zinc-400 block mb-1">아이콘/이모지</label>
                      <input
                        type="text"
                        value={newIcon}
                        onChange={(e) => setNewIcon(e.target.value)}
                        className="w-full text-center py-2 px-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-[11px] text-zinc-400 block mb-1">링크 제목 *</label>
                      <input
                        type="text"
                        placeholder="예: 2026 포트폴리오 웹사이트"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full py-2 px-3 rounded-xl bg-zinc-800 border border-zinc-700 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">이동할 URL *</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-zinc-800 border border-zinc-700 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">부가 설명 (선택)</label>
                    <input
                      type="text"
                      placeholder="간단한 한 줄 요약"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-zinc-800 border border-zinc-700 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">카테고리</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full py-2 px-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="project">프로젝트</option>
                        <option value="blog">블로그</option>
                        <option value="contact">연락처</option>
                        <option value="other">기타</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">배지 문구 (선택)</label>
                      <input
                        type="text"
                        placeholder="예: HOT, NEW"
                        value={newBadge}
                        onChange={(e) => setNewBadge(e.target.value)}
                        className="w-full py-2 px-3 rounded-xl bg-zinc-800 border border-zinc-700 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none uppercase"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30 mt-1"
                  >
                    링크 블록 등록 완료
                  </button>
                </form>
              )}

              {/* Link List */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                  <span>등록된 링크 목록 ({profile.links.length}개)</span>
                  <span className="text-[11px]">위/아래 버튼으로 노출 순서 변경</span>
                </div>

                {profile.links.map((link, idx) => (
                  <div
                    key={link.id}
                    className={`p-3.5 rounded-2xl bg-zinc-900 border transition ${
                      link.isActive
                        ? "border-zinc-800 hover:border-zinc-700"
                        : "border-zinc-800/40 opacity-50 bg-zinc-950"
                    } flex flex-col gap-2 shadow-md`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      {/* Left: Reorder & Icon & Info */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveLink(idx, "up")}
                            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20 text-zinc-400 hover:text-white transition text-[10px]"
                            title="위로 이동"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === profile.links.length - 1}
                            onClick={() => moveLink(idx, "down")}
                            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20 text-zinc-400 hover:text-white transition text-[10px]"
                            title="아래로 이동"
                          >
                            ▼
                          </button>
                        </div>

                        <span className="text-xl w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                          {link.icon || "🔗"}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-zinc-100 truncate">
                              {link.title}
                            </span>
                            {link.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                {link.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-zinc-400 truncate block">
                            {link.url}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Click stat */}
                        <span className="hidden sm:inline text-[11px] text-zinc-500 px-2 py-0.5 rounded-full bg-zinc-800/80">
                          클릭 {link.clicks}
                        </span>

                        {/* Active Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => toggleLinkActive(link.id)}
                          className={`w-11 h-6 rounded-full p-0.5 transition ${
                            link.isActive ? "bg-indigo-600" : "bg-zinc-700"
                          }`}
                          title={link.isActive ? "공개 상태 (클릭하여 숨김)" : "숨김 상태 (클릭하여 공개)"}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition ${
                              link.isActive ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`'${link.title}' 링크를 삭제하시겠습니까?`)) {
                              deleteLink(link.id);
                              showToast("링크가 삭제되었습니다.");
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-rose-950/40 text-zinc-500 hover:text-rose-400 transition"
                          title="삭제"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bento / Widgets Settings */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-3 mt-2">
                <h4 className="font-bold text-xs text-zinc-300 flex items-center gap-1.5">
                  <span>🎧</span> 벤토 위젯 설정 (음악 & 현재 집중하는 일)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">추천 노래 제목</label>
                    <input
                      type="text"
                      value={profile.bento?.songTitle || ""}
                      onChange={(e) =>
                        updateProfile({
                          bento: { ...profile.bento, songTitle: e.target.value },
                        })
                      }
                      className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-xs"
                      placeholder="노래 제목"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">아티스트 / 가수</label>
                    <input
                      type="text"
                      value={profile.bento?.songArtist || ""}
                      onChange={(e) =>
                        updateProfile({
                          bento: { ...profile.bento, songArtist: e.target.value },
                        })
                      }
                      className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-xs"
                      placeholder="가수명"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Profile Settings */}
          {activeTab === "profile" && (
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-4 text-xs">
              <h3 className="font-bold text-sm text-zinc-200">기본 프로필 정보 수정</h3>

              <div className="flex items-center gap-4">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-md flex-shrink-0"
                />
                <div className="flex-1">
                  <label className="text-[11px] text-zinc-400 block mb-1">프로필 이미지 URL</label>
                  <input
                    type="text"
                    value={profile.avatarUrl}
                    onChange={(e) => updateProfile({ avatarUrl: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl bg-zinc-800 border border-zinc-700 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">이름 / 닉네임 *</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl bg-zinc-800 border border-zinc-700 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">고유 핸들 (@slug) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-mono">
                      @
                    </span>
                    <input
                      type="text"
                      value={profile.handle}
                      onChange={(e) =>
                        updateProfile({ handle: e.target.value.replace(/[^a-zA-Z0-9._-]/g, "") })
                      }
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">자기소개 (Bio)</label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => updateProfile({ bio: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl bg-zinc-800 border border-zinc-700 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">활동 지역 (Location)</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => updateProfile({ location: e.target.value })}
                    placeholder="예: 서울, 대한민국"
                    className="w-full py-2 px-3 rounded-xl bg-zinc-800 border border-zinc-700 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">실시간 한 줄 상태</label>
                  <input
                    type="text"
                    value={profile.status}
                    onChange={(e) => updateProfile({ status: e.target.value })}
                    placeholder="예: ✨ 신규 프로젝트 런칭 준비 중"
                    className="w-full py-2 px-3 rounded-xl bg-zinc-800 border border-zinc-700 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Work Available Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/60">
                <div>
                  <span className="font-semibold text-xs text-zinc-200 block">
                    업무 / 협업 가능 배지 노출
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    프로필 상단에 &apos;Work Available&apos; 초록색 핑 배지를 표시합니다.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => updateProfile({ availableForWork: !profile.availableForWork })}
                  className={`w-11 h-6 rounded-full p-0.5 transition ${
                    profile.availableForWork ? "bg-emerald-600" : "bg-zinc-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition ${
                      profile.availableForWork ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Tags Section */}
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">전문 분야 / 키워드 태그</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {profile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-indigo-300 text-xs flex items-center gap-1.5"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-zinc-500 hover:text-rose-400"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="새 태그 입력 후 추가 (예: Full-Stack)"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-zinc-800 border border-zinc-700 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-1.5 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-zinc-100 font-semibold text-xs"
                  >
                    추가
                  </button>
                </div>
              </div>

              {/* Reset All Profile Button */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-zinc-300 block">기본 프로필로 초기화</span>
                  <span className="text-[11px] text-zinc-500">모든 설정 및 링크를 최신 기본 데이터로 되돌립니다.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("프로필 정보와 링크를 기본값으로 초기화하시겠습니까?")) {
                      resetProfile();
                      showToast("🔄 기본 프로필 및 링크로 초기화되었습니다.");
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 border border-zinc-700 text-xs transition"
                >
                  기본값 복원
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Themes Selection */}
          {activeTab === "themes" && (
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-4">
              <div>
                <h3 className="font-bold text-sm text-zinc-200">프리셋 테마 선택</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  원클릭으로 프로필의 배경, 카드, 폰트 및 액센트 색상이 즉시 변경됩니다.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.values(THEMES).map((thm) => {
                  const isSelected = profile.theme === thm.id;
                  return (
                    <button
                      key={thm.id}
                      onClick={() => setTheme(thm.id as ThemeId)}
                      className={`p-4 rounded-2xl text-left border transition relative flex flex-col justify-between h-32 overflow-hidden ${
                        isSelected
                          ? "border-indigo-500 ring-2 ring-indigo-500/50 bg-zinc-800/90 shadow-xl"
                          : "border-zinc-800 bg-zinc-800/40 hover:bg-zinc-800/70"
                      }`}
                    >
                      {/* Top Preview Color Swatch Bar */}
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${thm.previewColor} shadow-md`}
                          />
                          <span className="font-bold text-sm text-zinc-100">{thm.name}</span>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500 text-white">
                            선택됨
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-zinc-400 line-clamp-2 mt-2">
                        {thm.tagline}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-700/40 mt-auto">
                        <span>{thm.isDark ? "🌙 다크 모드" : "☀️ 라이트 모드"}</span>
                        <span>클릭하여 적용 →</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: Analytics */}
          {activeTab === "analytics" && (
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-5">
              <div>
                <h3 className="font-bold text-sm text-zinc-200">방문 및 클릭 통계 분석</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  실시간으로 집계된 링크별 반응과 유입 지표를 확인하세요.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-800/70 border border-zinc-700/60">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">총 조회수 (PV)</span>
                  <div className="text-xl font-black text-white mt-1">{estimatedViews.toLocaleString()}</div>
                  <span className="text-[10px] text-emerald-400">↑ 12% 상승</span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-800/70 border border-zinc-700/60">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">링크 클릭수</span>
                  <div className="text-xl font-black text-indigo-400 mt-1">{totalClicks.toLocaleString()}</div>
                  <span className="text-[10px] text-indigo-300">총 누적 기록</span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-800/70 border border-zinc-700/60">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">평균 클릭률 (CTR)</span>
                  <div className="text-xl font-black text-amber-400 mt-1">{ctr}%</div>
                  <span className="text-[10px] text-zinc-400">방문 대비 클릭</span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-800/70 border border-zinc-700/60">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">응원 하트 수</span>
                  <div className="text-xl font-black text-rose-400 mt-1">{profile.likes}</div>
                  <span className="text-[10px] text-rose-300">방문자 인터랙션</span>
                </div>
              </div>

              {/* Top Links Ranking */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-zinc-300">가장 많이 클릭된 인기 링크</span>
                <div className="flex flex-col gap-2">
                  {sortedLinksByClicks.slice(0, 5).map((l, rank) => {
                    const pct = totalClicks > 0 ? Math.round((l.clicks / totalClicks) * 100) : 0;
                    return (
                      <div
                        key={l.id}
                        className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/40 flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-zinc-700 text-[10px] font-bold flex items-center justify-center text-zinc-300">
                              {rank + 1}
                            </span>
                            <span className="font-semibold text-zinc-200">{l.title}</span>
                          </div>
                          <span className="font-mono text-zinc-400 text-[11px]">
                            {l.clicks}회 ({pct}%)
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 rounded-full bg-zinc-700 overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(pct, 4)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Column: Phone Mockup Frame (5 cols on Desktop) */}
        <section
          className={`lg:col-span-5 flex flex-col items-center justify-start sticky top-24 ${
            mobileView === "editor" ? "hidden lg:flex" : "flex"
          }`}
        >
          <PhoneMockup
            profile={profile}
            onLinkClick={incrementClick}
            onLike={incrementLike}
          />
        </section>
      </main>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        url={
          typeof window !== "undefined"
            ? `${window.location.origin}/@${profile.handle}`
            : `https://mylink.bio/@${profile.handle}`
        }
        title={profile.name}
        avatarUrl={profile.avatarUrl}
      />

      {/* Global Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-indigo-600 text-white font-medium text-xs shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-3 border border-indigo-400/40">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
