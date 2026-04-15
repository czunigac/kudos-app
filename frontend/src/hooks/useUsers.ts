"use client";

import api from "@/lib/api";
import type { UserProfile } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useTeammates() {
  return useQuery({
    queryKey: ["users", "teammates"],
    queryFn: async () => {
      const { data } = await api.get<UserProfile[]>("/api/users/teammates");
      return data;
    },
  });
}
