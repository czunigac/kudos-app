import type { UserProfile } from "@/types";
import { create } from "zustand";

type AuthState = {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  updateProfile: (partial) =>
    set((state) =>
      state.profile ? { profile: { ...state.profile, ...partial } } : state
    ),
}));
