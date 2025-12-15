import { Market, Comment, RankedUser } from './types';

// [ECONOMY UPDATE] Start with 1,000 VP to make points feel more valuable (Benchmarking real money markets)
export const INITIAL_BALANCE = 1000;

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
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'm3',
    title: '2025 서울 화이트 크리스마스 (적설량 3cm↑)',
    titleEn: '2025 Seoul White Christmas (Snow > 3cm)',
    category: 'WEATHER',
    yesPrice: 45,
    volume: 45000,
    endDate: '2025-12-25',
    imageUrl: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'm7',
    // [UPDATE] Bitcoin market adjusted to 2025 target & USD price
    title: '비트코인(BTC) 2025년 내 15만 달러($150k) 돌파',
    titleEn: 'Bitcoin (BTC) to hit $150k USD in 2025',
    category: 'COIN',
    yesPrice: 55,
    volume: 540000,
    // Date updated to end of 2025
    endDate: '2025-12-31',
    imageUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'm5',
    title: '2026 북중미 월드컵 대한민국 16강 진출',
    titleEn: 'South Korea to reach Round of 16 in 2026 World Cup',
    category: 'SPORTS',
    yesPrice: 42,
    volume: 150000,
    endDate: '2026-06-30',
    // [UPDATE] Reliable Stadium Image
    imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800&auto=format&fit=crop'
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
  { id: 'c2', marketId: 'm7', userName: '사토시', text: '반감기 1년 후가 진짜입니다. 150k는 보수적인 수치.', timestamp: Date.now() - 50000, prediction: 'YES' },
  { id: 'c2-1', marketId: 'm7', userName: '숏충이', text: '경기 침체 오면 코인부터 빠집니다 형님.', timestamp: Date.now() - 20000, parentId: 'c2', prediction: 'NO' },
  { id: 'c3', marketId: 'm6', userName: '워렌버핏', text: '산타는 없다. 현금 확보해라.', timestamp: Date.now() - 200000, prediction: 'NO' },
  { id: 'c4', marketId: 'm5', userName: '붉은악마', text: '손흥민 마지막 월드컵이다. 무조건 16강 감!', timestamp: Date.now() - 30000, prediction: 'YES' },
];

// [UPDATE] Rebalanced ranking based on 1,000 VP start
export const MOCK_RANKING: RankedUser[] = [
  { rank: 1, name: '신의손', balance: 54300, winRate: 92 },
  { rank: 2, name: '한강뷰가자', balance: 32100, winRate: 85 },
  { rank: 3, name: '프로찍러', balance: 18500, winRate: 67 }, 
  { rank: 4, name: '도지코인', balance: 9200, winRate: 55 },
  { rank: 5, name: '소액재미만', balance: 4500, winRate: 40 },
];