"use client";

import React from "react";
import { useProfileStore } from "@/lib/store";
import { PublicProfileView } from "@/components/PublicProfileView";

export default function ProfilePage() {
  const { profile, incrementClick, incrementLike } = useProfileStore("alex.dev");

  return (
    <main className="min-h-screen w-full flex flex-col justify-start">
      <PublicProfileView
        profile={profile}
        onLinkClick={incrementClick}
        onLike={incrementLike}
      />
    </main>
  );
}
