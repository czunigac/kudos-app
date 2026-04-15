export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  role: "User" | "Admin";
  totalPoints: number;
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
  giver: UserProfile;
  receiver: UserProfile;
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
