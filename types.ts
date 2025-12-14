export type Category = 'ENTER' | 'SPORTS' | 'WEATHER' | 'TECH' | 'STOCK' | 'COIN';

export interface Market {
  id: string;
  title: string;
  titleEn: string; // Added for English support
  category: Category;
  yesPrice: number; // 0 to 100 representing probability
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
  entryPrice: number; // Price at the time of purchase
  payoutMultiple: number; // calculated multiplier
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

export type ViewState = 'HOME' | 'DETAIL' | 'PROFILE' | 'RANKING' | 'AUTH';

export interface BetDraft {
  marketId: string;
  prediction: 'YES' | 'NO';
  amount: number;
  potentialReturn: number;
}

export interface Comment {
  id: string;
  marketId: string;
  userName: string;
  text: string;
  timestamp: number;
  prediction?: 'YES' | 'NO'; // The stance of the commenter
}

export interface RankedUser {
  rank: number;
  name: string;
  balance: number;
  winRate: number;
  isCurrentUser?: boolean;
}

export interface MarketSuggestion {
    title: string;
    category: Category;
    description: string;
}