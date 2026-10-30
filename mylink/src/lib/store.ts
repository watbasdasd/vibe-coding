"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProfile, CustomLink, ThemeId, THEMES } from "@/types/profile";
import { DEFAULT_LINKS, LINK_PRESETS } from "./dummyData";

export const STORAGE_KEY_PREFIX = "mylink_profile_v3_";

export const DEFAULT_PROFILE: UserProfile = {
  ...LINK_PRESETS.developer.profile,
};

// Normalize handle helper (removes leading @ and converts to lowercase)
export function normalizeHandle(handle: string): string {
  if (!handle) return "alex.dev";
  return decodeURIComponent(handle).replace(/^@/, "").toLowerCase().trim();
}

// Get storage key
export function getStorageKey(handle: string): string {
  return `${STORAGE_KEY_PREFIX}${normalizeHandle(handle)}`;
}

// Raw storage getters & setters
export function loadProfileFromStorage(handle: string = "alex.dev"): UserProfile {
  if (typeof window === "undefined") {
    return DEFAULT_PROFILE;
  }
  try {
    const key = getStorageKey(handle);
    const data = localStorage.getItem(key);
    if (data) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
    }
    // Also check legacy key if loading alex.dev
    const legacy = localStorage.getItem("mylink_profile_v2");
    if (legacy) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(legacy) };
    }
  } catch (err) {
    console.error("Failed to load profile from storage", err);
  }
  return DEFAULT_PROFILE;
}

export function saveProfileToStorage(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    const key = getStorageKey(profile.handle);
    localStorage.setItem(key, JSON.stringify(profile));
    // Also broadcast update event across tabs/components
    window.dispatchEvent(new CustomEvent("mylink_profile_updated", { detail: profile }));
  } catch (err) {
    console.error("Failed to save profile to storage", err);
  }
}

// React Hook for Reactive Profile Store
export function useProfileStore(initialHandle: string = "alex.dev") {
  const [handle, setHandle] = useState(normalizeHandle(initialHandle));
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync with handle change
  useEffect(() => {
    const norm = normalizeHandle(initialHandle);
    setHandle(norm);
    const loaded = loadProfileFromStorage(norm);
    setProfile(loaded);
    setIsLoaded(true);
  }, [initialHandle]);

  // Listen for storage events
  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserProfile>;
      if (customEvent.detail && normalizeHandle(customEvent.detail.handle) === handle) {
        setProfile(customEvent.detail);
      }
    };
    window.addEventListener("mylink_profile_updated", handleUpdate);
    return () => window.removeEventListener("mylink_profile_updated", handleUpdate);
  }, [handle]);

  const updateProfile = useCallback(
    (updater: Partial<UserProfile> | ((prev: UserProfile) => UserProfile)) => {
      setProfile((prev) => {
        const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
        saveProfileToStorage(next);
        return next;
      });
    },
    []
  );

  const addLink = useCallback((newLink: Omit<CustomLink, "id" | "clicks">) => {
    setProfile((prev) => {
      const link: CustomLink = {
        ...newLink,
        id: `link-${Date.now()}`,
        clicks: 0,
      };
      const next = { ...prev, links: [link, ...prev.links] };
      saveProfileToStorage(next);
      return next;
    });
  }, []);

  const updateLink = useCallback((id: string, updates: Partial<CustomLink>) => {
    setProfile((prev) => {
      const links = prev.links.map((item) => (item.id === id ? { ...item, ...updates } : item));
      const next = { ...prev, links };
      saveProfileToStorage(next);
      return next;
    });
  }, []);

  const deleteLink = useCallback((id: string) => {
    setProfile((prev) => {
      const links = prev.links.filter((item) => item.id !== id);
      const next = { ...prev, links };
      saveProfileToStorage(next);
      return next;
    });
  }, []);

  const moveLink = useCallback((index: number, direction: "up" | "down") => {
    setProfile((prev) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.links.length) return prev;
      const copy = [...prev.links];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      const next = { ...prev, links: copy };
      saveProfileToStorage(next);
      return next;
    });
  }, []);

  const toggleLinkActive = useCallback((id: string) => {
    setProfile((prev) => {
      const links = prev.links.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      );
      const next = { ...prev, links };
      saveProfileToStorage(next);
      return next;
    });
  }, []);

  const incrementClick = useCallback((id: string) => {
    setProfile((prev) => {
      const links = prev.links.map((item) =>
        item.id === id ? { ...item, clicks: (item.clicks || 0) + 1 } : item
      );
      const next = { ...prev, links };
      saveProfileToStorage(next);
      return next;
    });
  }, []);

  const incrementLike = useCallback(() => {
    setProfile((prev) => {
      const next = { ...prev, likes: prev.likes + 1 };
      saveProfileToStorage(next);
      return next;
    });
  }, []);

  const setTheme = useCallback((themeId: ThemeId) => {
    if (!THEMES[themeId]) return;
    setProfile((prev) => {
      const next = { ...prev, theme: themeId };
      saveProfileToStorage(next);
      return next;
    });
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
    saveProfileToStorage(DEFAULT_PROFILE);
  }, []);

  const resetLinksToDefault = useCallback(() => {
    setProfile((prev) => {
      const next = { ...prev, links: DEFAULT_LINKS };
      saveProfileToStorage(next);
      return next;
    });
  }, []);

  const loadPreset = useCallback((presetKey: keyof typeof LINK_PRESETS) => {
    const preset = LINK_PRESETS[presetKey];
    if (!preset) return;
    setProfile(preset.profile);
    saveProfileToStorage(preset.profile);
  }, []);

  return {
    profile,
    isLoaded,
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
  };
}
