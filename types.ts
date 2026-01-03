
export type Category = 'ENTER' | 'SPORTS' | 'WEATHER' | 'TECH' | 'STOCK' | 'COIN';

export interface Market {
  id: string;
  title: string;
  titleEn: string;
  description: string; // [Added] Detailed rules for settlement
  category: Category;
  yesPrice: number; // Current probability (0-100)
  priceHistory: number[]; // Array of historical prices for the chart
  volume: number;
  endDate: string;
  imageUrl: string;
  result?: 'YES' | 'NO' | null; // Result state: null(ongoing), YES, NO
}

export interface PortfolioItem {
  id: string;
  marketId: string;
  marketTitle: string;
  prediction: 'YES' | 'NO';
  amount: number;
  entryPrice: number;
  payoutMultiple: number;
  timestamp: number;
  isClaimed?: boolean; // To track if payout has been received
}

export interface UserState {
  id: string;
  email?: string;
  balance: number;
  name: string;
  portfolio: PortfolioItem[];
  isGuest: boolean;
  isAdmin?: boolean; // Simple admin flag
  age?: number; // User's age for restrictions
  birthYear?: number; // For age verification
  parentalConsent?: boolean; // For users under 18
  isTeenager?: boolean; // 13-17 year old users
  dailyBetAmount?: number; // Daily betting limit tracking
  lastBetReset?: number; // Last time daily limit was reset
}

export type ViewState = 'HOME' | 'DETAIL' | 'PROFILE' | 'RANKING' | 'AUTH' | 'ABOUT';

export interface Comment {
  id: string;
  marketId: string;
  userName: string;
  text: string;
  timestamp: number;
  prediction?: 'YES' | 'NO';
  parentId?: string;
  likeCount: number; // For community engagement
  isLiked?: boolean; // Local state for user interaction
}

export interface RankedUser {
  rank: number;
  name: string;
  balance: number;
  winRate: number;
  isCurrentUser?: boolean;
}

export interface BillboardMessage {
    id: string;
    text: string;
    sender: string;
    color: string; // text color based on tier or random
}