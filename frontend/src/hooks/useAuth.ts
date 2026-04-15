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
      const { data: signInData, error } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );
      if (error) throw new Error(error.message);

      const token = signInData.session?.access_token;
      if (!token) {
        throw new Error("No session returned. Try again or reset your password.");
      }

      const { data } = await api.post<UserProfile>(
        "/api/auth/sync-profile",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(data);
      router.push("/feed");
    },
    [router, setProfile]
  );

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      const supabase = createClient();
      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: displayName } },
      });
      if (error) throw new Error(error.message);

      const token = signUpData.session?.access_token;
      if (!token) {
        throw new Error(
          "Account created. Confirm your email if required, then sign in."
        );
      }

      const { data } = await api.post<UserProfile>(
        "/api/auth/sync-profile",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setProfile(null);
      return;
    }

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
