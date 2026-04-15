"use client";

import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { UserProfile } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type UpdateProfileBody = {
  displayName: string;
  avatarUrl?: string | null;
};

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setProfile = useAuthStore((s) => s.setProfile);

  return useMutation({
    mutationFn: async (body: UpdateProfileBody) => {
      const rawUrl = body.avatarUrl;
      const avatarUrl =
        rawUrl === undefined || rawUrl === null || rawUrl === ""
          ? null
          : rawUrl.trim();

      const { data } = await api.put<UserProfile>("/api/auth/profile", {
        displayName: body.displayName.trim(),
        avatarUrl,
      });
      return data;
    },
    onSuccess: (data) => {
      setProfile(data);
      void queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
