"use client";

import React from "react";
import { UserProfile } from "@/types/profile";
import { PublicProfileView } from "./PublicProfileView";

interface PhoneMockupProps {
  profile: UserProfile;
  onLinkClick?: (id: string) => void;
  onLike?: () => void;
}

export function PhoneMockup({ profile, onLinkClick, onLike }: PhoneMockupProps) {
  return (
    <div className="relative mx-auto flex flex-col items-center select-none">
      {/* Phone Hardware Outer Case */}
      <div className="relative w-[340px] sm:w-[360px] h-[690px] rounded-[50px] bg-zinc-900 border-[8px] border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-white/10 overflow-hidden flex flex-col">
        {/* Dynamic Island / Camera Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 w-24 h-5 rounded-full bg-black flex items-center justify-between px-2 shadow-sm pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800/80" />
          <div className="w-2 h-2 rounded-full bg-indigo-950/80 border border-indigo-500/30" />
        </div>

        {/* Screen Content (Scrollable Container) */}
        <div className="w-full h-full overflow-y-auto scrollbar-none pt-7 pb-6 flex flex-col">
          <PublicProfileView
            profile={profile}
            isPreview={true}
            onLinkClick={onLinkClick}
            onLike={onLike}
          />
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-30 w-32 h-1 rounded-full bg-white/40 pointer-events-none" />
      </div>

      {/* Decorative reflection glare */}
      <div className="mt-3 text-center">
        <span className="text-[11px] font-medium text-zinc-400">
          📱 실시간 모바일 미리보기 (WYSIWYG)
        </span>
      </div>
    </div>
  );
}
