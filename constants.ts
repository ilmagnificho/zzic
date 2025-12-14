import { Market, Comment, RankedUser } from './types';

export const INITIAL_BALANCE = 10000;

export const INITIAL_MARKETS: Market[] = [
  {
    id: 'm1',
    title: '뉴진스 2025년 정규 2집 발매 여부',
    titleEn: 'NewJeans 2nd Regular Album in 2025?',
    category: 'ENTER',
    yesPrice: 65,
    volume: 124500,
    endDate: '2025-12-31',
    imageUrl: 'https://picsum.photos/400/200?random=1'
  },
  {
    id: 'm2',
    title: '손흥민 다음 경기 공격포인트 기록',
    titleEn: 'Son Heung-min Attacking Point in Next Match',
    category: 'SPORTS',
    yesPrice: 42,
    volume: 89300,
    endDate: '2024-05-20',
    imageUrl: 'https://picsum.photos/400/200?random=2'
  },
  {
    id: 'm3',
    title: '2024 서울 화이트 크리스마스 (적설량 1cm↑)',
    titleEn: '2024 Seoul White Christmas (Snow > 1cm)',
    category: 'WEATHER',
    yesPrice: 18,
    volume: 45000,
    endDate: '2024-12-25',
    imageUrl: 'https://picsum.photos/400/200?random=3'
  },
  {
    id: 'm5',
    title: 'GPT-5 vs Gemini 2.0: AI 패권 승자는 Gemini?',
    titleEn: 'GPT-5 vs Gemini 2.0: AI Supremacy?',
    category: 'TECH',
    yesPrice: 35,
    volume: 67000,
    endDate: '2025-06-30',
    imageUrl: 'https://picsum.photos/400/200?random=5'
  },
  {
    id: 'm6',
    title: '미국 증시 산타랠리 온다 (S&P500 신고가 갱신)',
    titleEn: 'US Stock Santa Rally (S&P 500 ATH)',
    category: 'STOCK',
    yesPrice: 72,
    volume: 210000,
    endDate: '2024-12-31',
    imageUrl: 'https://picsum.photos/400/200?random=6'
  },
  {
    id: 'm7',
    title: '비트코인(BTC) 연내 10만 달러($100K) 돌파',
    titleEn: 'Bitcoin (BTC) to hit $100K this year',
    category: 'COIN',
    yesPrice: 48,
    volume: 540000,
    endDate: '2024-12-31',
    imageUrl: 'https://picsum.photos/400/200?random=7'
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
  { id: 'c1', marketId: 'm1', userName: '민희진파이팅', text: '솔직히 올해는 힘들지 않을까요?', timestamp: Date.now() - 100000, prediction: 'NO' },
  { id: 'c2', marketId: 'm7', userName: '사토시', text: '무조건 갑니다. 지금이 저점 매수 기회.', timestamp: Date.now() - 50000, prediction: 'YES' },
  { id: 'c3', marketId: 'm6', userName: '워렌버핏', text: '산타는 없다. 현금 확보해라.', timestamp: Date.now() - 200000, prediction: 'NO' },
  { id: 'c4', marketId: 'm5', userName: '개발자K', text: 'Gemini 2.0 성능 미쳤던데?', timestamp: Date.now() - 30000, prediction: 'YES' },
];

export const MOCK_RANKING: RankedUser[] = [
  { rank: 1, name: '신의손', balance: 1540000, winRate: 92 },
  { rank: 2, name: '한강뷰가자', balance: 890000, winRate: 85 },
  { rank: 3, name: '프로찍러', balance: 450000, winRate: 67 }, 
  { rank: 4, name: '도지코인', balance: 320000, winRate: 55 },
  { rank: 5, name: '소액재미만', balance: 150000, winRate: 40 },
];