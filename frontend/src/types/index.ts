export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  earnedAt: string;
}

/** Profile fields returned on kudos cards and teammate lists */
export interface PublicUserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  role: "User" | "Admin";
  totalPoints: number;
}

/** Full profile from `/api/auth/me` and sync */
export interface UserProfile extends PublicUserProfile {
  kudosGivenCount: number;
  kudosReceivedCount: number;
  badges: UserBadge[];
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatarUrl: string;
  kudosCount: number;
}

export interface LeaderboardResponse {
  topGivers: LeaderboardEntry[];
  topReceivers: LeaderboardEntry[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointValue: number;
  color: string;
}

export interface Kudos {
  id: string;
  message: string;
  points: number;
  createdAt: string;
  giver: PublicUserProfile;
  receiver: PublicUserProfile;
  category: Category;
}

export interface CoachSuggestion {
  suggestedCategory: string;
  categoryReason: string;
  suggestedRecipient: { id: string; name: string } | null;
  recipientReason: string | null;
  enhancedMessage: string;
  improvements: string[];
  needsMoreContext?: boolean;
}

export interface KudosFeedResponse {
  data: Kudos[];
  page: number;
  pageSize: number;
  total: number;
}

export interface CreateKudosRequest {
  receiverId: string;
  categoryId: string;
  message: string;
}
