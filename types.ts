
export type Category = 'ENTER' | 'SPORTS' | 'WEATHER' | 'TECH' | 'STOCK' | 'COIN';

export interface Market {
  id: string;
  title: string;
  titleEn: string;
  category: Category;
  yesPrice: number; // Current probability (0-100)
  priceHistory: number[]; // Array of historical prices for the chart
  volume: number;
  endDate: string;
  imageUrl: string;
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
}

export interface UserState {
  id: string;
  email?: string;
  balance: number;
  name: string;
  portfolio: PortfolioItem[];
  isGuest: boolean;
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
  likeCount: number; // [Added] For community engagement
  isLiked?: boolean; // [Added] Local state for user interaction
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
