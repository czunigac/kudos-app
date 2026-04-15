import api from "@/lib/api";
import type {
  Category,
  CreateKudosRequest,
  KudosFeedResponse,
  LeaderboardResponse,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useKudosFeed() {
  const query = useQuery({
    queryKey: ["kudos", "feed"],
    queryFn: async () => {
      const { data } = await api.get<KudosFeedResponse>("/api/kudos", {
        params: { page: 1, pageSize: 20 },
      });
      return data;
    },
  });

  return {
    kudos: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get<Category[]>("/api/kudos/categories");
      return data;
    },
    staleTime: Infinity,
  });
}

export function useCreateKudos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateKudosRequest) => {
      const { data } = await api.post("/api/kudos", body);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["kudos", "feed"] });
      void queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      void queryClient.invalidateQueries({ queryKey: ["kudos", "leaderboard"] });
    },
  });
}

export function useLeaderboard(top = 5) {
  return useQuery({
    queryKey: ["kudos", "leaderboard", top],
    queryFn: async () => {
      const { data } = await api.get<LeaderboardResponse>("/api/kudos/leaderboard", {
        params: { top },
      });
      return data;
    },
  });
}
