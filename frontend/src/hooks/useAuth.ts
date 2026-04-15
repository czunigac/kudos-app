"use client";

import api from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import type { UserProfile } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useAuth() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);

  const login = useCallback(
    async (email: string, password: string) => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);

      const { data } = await api.post<UserProfile>("/api/auth/sync-profile");
      setProfile(data);
      router.push("/feed");
    },
    [router, setProfile]
  );

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: displayName } },
      });
      if (error) throw new Error(error.message);

      const { data } = await api.post<UserProfile>("/api/auth/sync-profile");
      setProfile(data);
      router.push("/feed");
    },
    [router, setProfile]
  );

  const logout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setProfile(null);
    router.push("/login");
  }, [router, setProfile]);

  const loadProfile = useCallback(async () => {
    try {
      const { data } = await api.get<UserProfile>("/api/auth/me");
      setProfile(data);
    } catch {
      setProfile(null);
    }
  }, [setProfile]);

  return {
    profile,
    isAuthenticated: !!profile,
    login,
    register,
    logout,
    loadProfile,
  };
}
