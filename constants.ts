import { Market, Comment, RankedUser } from './types';

export const INITIAL_BALANCE = 10000;

export const INITIAL_MARKETS: Market[] = [
  {
    id: 'm1',
    title: '뉴진스 2025년 정규 2집 발매 여부',
    category: 'ENTER',
    yesPrice: 65,
    volume: 124500,
    endDate: '2025-12-31',
    imageUrl: 'https://picsum.photos/400/200?random=1'
  },
  {
    id: 'm2',
    title: '손흥민 다음 경기 공격포인트 기록',
    category: 'SPORTS',
    yesPrice: 42,
    volume: 89300,
    endDate: '2024-05-20',
    imageUrl: 'https://picsum.photos/400/200?random=2'
  },
  {
    id: 'm3',
    title: '2024 서울 화이트 크리스마스 (적설량 1cm↑)',
    category: 'WEATHER',
    yesPrice: 18,
    volume: 45000,
    endDate: '2024-12-25',
    imageUrl: 'https://picsum.photos/400/200?random=3'
  },
  {
    id: 'm4',
    title: 'LCK 스프링 T1 우승',
    category: 'ESPORTS',
    yesPrice: 55,
    volume: 210000,
    endDate: '2025-04-14',
    imageUrl: 'https://picsum.photos/400/200?random=4'
  }
];

export const CATEGORY_COLORS: Record<string, string> = {
  ENTER: 'bg-pink-600',
  SPORTS: 'bg-orange-600',
  WEATHER: 'bg-cyan-600',
  ESPORTS: 'bg-violet-600'
};

export const MOCK_COMMENTS: Comment[] = [
  { id: 'c1', marketId: 'm1', userName: '민희진파이팅', text: '솔직히 올해는 힘들지 않을까요?', timestamp: Date.now() - 100000, prediction: 'NO' },
  { id: 'c2', marketId: 'm1', userName: '버니즈1기', text: '무조건 나옵니다. 믿습니다.', timestamp: Date.now() - 50000, prediction: 'YES' },
  { id: 'c3', marketId: 'm4', userName: '페이커팬', text: '대상혁이 있는 한 T1은 우승이다', timestamp: Date.now() - 200000, prediction: 'YES' },
  { id: 'c4', marketId: 'm2', userName: '축구도사', text: '이번 상대 수비가 너무 빡세요', timestamp: Date.now() - 30000, prediction: 'NO' },
];

export const MOCK_RANKING: RankedUser[] = [
  { rank: 1, name: '신의손', balance: 1540000, winRate: 92 },
  { rank: 2, name: '한강뷰가자', balance: 890000, winRate: 85 },
  { rank: 3, name: '프로찍러', balance: 450000, winRate: 67 }, 
  { rank: 4, name: '도지코인', balance: 320000, winRate: 55 },
  { rank: 5, name: '소액재미만', balance: 150000, winRate: 40 },
];