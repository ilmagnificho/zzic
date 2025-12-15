import { Market, Comment, RankedUser, BillboardMessage } from './types';

// [ECONOMY] Start with 3,000 VP
export const INITIAL_BALANCE = 3000;

// [DATA] 2025 Dec Context - Finance & Future
export const INITIAL_MARKETS: Market[] = [
  // 1. Bitcoin
  {
    id: 'm_btc_200m',
    title: '[코인] 비트코인, 2025년 12월 31일까지 "2억 원" 돌파할까?',
    titleEn: '[Crypto] Will Bitcoin hit 200M KRW by Dec 31, 2025?',
    category: 'COIN',
    yesPrice: 68,
    priceHistory: [55, 58, 62, 60, 65, 67, 68],
    volume: 3200000,
    endDate: '2025-12-31T23:59:59',
    imageUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800&auto=format&fit=crop'
  },
  // 2. Samsung Electronics (Image Fixed)
  {
    id: 'm_samsung_100k',
    title: '[주식] 삼성전자, 올해 안에 기적의 "10만 전자" 회복 가능?',
    titleEn: '[Stock] Will Samsung Electronics recover to 100k KRW this year?',
    category: 'STOCK',
    yesPrice: 24,
    priceHistory: [40, 35, 30, 28, 25, 22, 24], 
    volume: 5100000,
    endDate: '2025-12-30T15:30:00', 
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop' // Generic Tech/Chip
  },
  // 3. Weather
  {
    id: 'm_xmas_snow',
    title: '[날씨] 이번 크리스마스 이브(12/24), 서울에 눈이 올까?',
    titleEn: '[Weather] White Christmas in Seoul this year?',
    category: 'WEATHER',
    yesPrice: 62,
    priceHistory: [25, 30, 45, 50, 55, 60, 62],
    volume: 1500000,
    endDate: '2025-12-24T18:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=800&auto=format&fit=crop'
  },
  // 4. BTS (Image Fixed)
  {
    id: 'm_bts_comeback',
    title: '[K-POP] BTS 완전체 컴백 콘서트, 올해 가기 전 발표 뜰까?',
    titleEn: '[K-POP] BTS Full Group Comeback: Announcement before 2026?',
    category: 'ENTER',
    yesPrice: 88,
    priceHistory: [70, 75, 80, 82, 85, 87, 88],
    volume: 4200000,
    endDate: '2025-12-31T23:59:59',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=800&auto=format&fit=crop' // Concert Crowd
  }
];

export const COMING_SOON_ITEMS = [
    { id: 'cs1', title: '2026 월드컵 아시아 예선', date: 'Coming Jan 2026' },
    { id: 'cs2', title: '애플 글래스(Vision) 2세대 출시', date: 'Coming Q1 2026' }
];

export const INITIAL_BILLBOARD: BillboardMessage[] = [
    { id: 'b1', text: "워렌버핏: 삼성전자 지금이 저점이다. 담아라.", sender: "가치투자", color: "text-blue-400" },
    { id: 'b2', text: "사토시: 1BTC = 1Lamborghini Soon 🚀", sender: "비트맥시", color: "text-yellow-400" },
    { id: 'b3', text: "아미: 2026년엔 스타디움 투어 가자 💜", sender: "보라해", color: "text-purple-400" },
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
  { id: 'c1', marketId: 'm_samsung_100k', userName: '주주총회', text: '5만 전자에서 물린 사람 있냐? ㅋㅋㅋ 그게 나야', timestamp: Date.now() - 50000, prediction: 'NO', likeCount: 242, isLiked: true },
  { id: 'c2', marketId: 'm_samsung_100k', userName: '국장탈출', text: '삼전은 이제 AI 반도체로 간다. 믿어라', timestamp: Date.now() - 20000, prediction: 'YES', likeCount: 45, isLiked: false },
  { id: 'c3', marketId: 'm_btc_200m', userName: '화성갈끄니까', text: '반감기 효과 이제 시작임. 2억은 그냥 넘음', timestamp: Date.now() - 100000, prediction: 'YES', likeCount: 88, isLiked: false },
];

export const MOCK_RANKING: RankedUser[] = [
  { rank: 1, name: '코인왕', balance: 1240000, winRate: 91 },
  { rank: 2, name: '한강뷰', balance: 812000, winRate: 65 },
  { rank: 3, name: '삼성주주', balance: 500, winRate: 12 }, 
  { rank: 4, name: '차트분석', balance: 92000, winRate: 55 },
  { rank: 5, name: '뉴비', balance: 3000, winRate: 0 },
];