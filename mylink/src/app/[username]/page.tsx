"use client";

import React, { use } from "react";
import { useProfileStore } from "@/lib/store";
import { PublicProfileView } from "@/components/PublicProfileView";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default function UserProfilePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const decodedHandle = decodeURIComponent(resolvedParams.username || "").replace(/^@/, "");

  const { profile, incrementClick, incrementLike } = useProfileStore(decodedHandle || "alex.dev");

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
