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
    // 상승장의 붉은(한국기준)/초록(미국기준) 느낌이 강한 차트 이미지
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
    // 눈 내리는 포근한 크리스마스 거리 이미지
    imageUrl: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'm7',
    title: '비트코인(BTC) 2026년 1분기 내 2억원 돌파',
    titleEn: 'Bitcoin (BTC) to hit 200M KRW in Q1 2026',
    category: 'COIN',
    yesPrice: 55,
    volume: 540000,
    endDate: '2026-03-31',
    // 비트코인 실물 + 상승 그래프 느낌
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
    // [UPDATE] 깨지는 이미지 교체 (안정적인 Unsplash ID 사용)
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop'
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
  // 월드컵 관련 댓글로 변경
  { id: 'c4', marketId: 'm5', userName: '붉은악마', text: '손흥민 마지막 월드컵이다. 무조건 16강 감!', timestamp: Date.now() - 30000, prediction: 'YES' },
];

export const MOCK_RANKING: RankedUser[] = [
  { rank: 1, name: '신의손', balance: 1540000, winRate: 92 },
  { rank: 2, name: '한강뷰가자', balance: 890000, winRate: 85 },
  { rank: 3, name: '프로찍러', balance: 450000, winRate: 67 }, 
  { rank: 4, name: '도지코인', balance: 320000, winRate: 55 },
  { rank: 5, name: '소액재미만', balance: 150000, winRate: 40 },
];