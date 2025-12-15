import { Market, Comment, RankedUser } from './types';

export const INITIAL_BALANCE = 10000;

// Current assumed date: Dec 2025
export const INITIAL_MARKETS: Market[] = [
  {
    id: 'm6',
    title: '미국 증시 산타랠리 온다 (S&P500 7,000pt 돌파)',
    titleEn: 'US Stock Santa Rally (S&P 500 > 7,000)',
    category: 'STOCK',
    yesPrice: 72,
    volume: 210000,
    endDate: '2025-12-31',
    imageUrl: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'm3',
    title: '2025 서울 화이트 크리스마스 (적설량 3cm↑)',
    titleEn: '2025 Seoul White Christmas (Snow > 3cm)',
    category: 'WEATHER',
    yesPrice: 45,
    volume: 45000,
    endDate: '2025-12-25',
    imageUrl: 'https://images.unsplash.com/photo-1542601098-8fc114e148e2?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'm7',
    title: '비트코인(BTC) 2026년 1분기 내 2억원 돌파',
    titleEn: 'Bitcoin (BTC) to hit 200M KRW in Q1 2026',
    category: 'COIN',
    yesPrice: 48,
    volume: 540000,
    endDate: '2026-03-31',
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'm5',
    title: 'AGI(일반인공지능) 2026년 상반기 선언될까?',
    titleEn: 'AGI Declaration in H1 2026?',
    category: 'TECH',
    yesPrice: 35,
    volume: 67000,
    endDate: '2026-06-30',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop'
  }
];

export const CATEGORY_COLORS: Record<string, string> = {
  ENTER: 'bg-pink-600',
  SPORTS: 'bg-orange-600',
  WEATHER: 'bg-cyan-600',
  TECH: 'bg-indigo-600',
  STOCK: 'bg-red-600',
  COIN: 'bg-yellow-600'
};

export const MOCK_COMMENTS: Comment[] = [
  { id: 'c2', marketId: 'm7', userName: '사토시', text: '무조건 갑니다. 반감기 효과 이제 시작임.', timestamp: Date.now() - 50000, prediction: 'YES' },
  { id: 'c2-1', marketId: 'm7', userName: '숏충이', text: '경기 침체 오면 코인부터 빠집니다 형님.', timestamp: Date.now() - 20000, parentId: 'c2', prediction: 'NO' },
  { id: 'c3', marketId: 'm6', userName: '워렌버핏', text: '산타는 없다. 현금 확보해라.', timestamp: Date.now() - 200000, prediction: 'NO' },
  { id: 'c4', marketId: 'm5', userName: '개발자K', text: 'OpenAI o3 모델 보셨나요? 특이점 이미 온듯.', timestamp: Date.now() - 30000, prediction: 'YES' },
];

export const MOCK_RANKING: RankedUser[] = [
  { rank: 1, name: '신의손', balance: 1540000, winRate: 92 },
  { rank: 2, name: '한강뷰가자', balance: 890000, winRate: 85 },
  { rank: 3, name: '프로찍러', balance: 450000, winRate: 67 }, 
  { rank: 4, name: '도지코인', balance: 320000, winRate: 55 },
  { rank: 5, name: '소액재미만', balance: 150000, winRate: 40 },
];