import { Market, Comment, RankedUser, BillboardMessage } from './types';

// [ECONOMY] Start with 3,000 VP
export const INITIAL_BALANCE = 3000;

// [STRATEGY] End of Year Special Topics (Minimal Resource, Max Viral)
export const INITIAL_MARKETS: Market[] = [
  // 1. White Christmas (Viral for Couples/Instagram)
  {
    id: 'm_xmas_2025',
    title: '[날씨] 2025년 크리스마스, 서울에 눈이 내릴까? (White Christmas)',
    titleEn: '[Weather] Will it snow in Seoul on Christmas 2025?',
    category: 'WEATHER',
    yesPrice: 45, // Slightly less than 50% usually creates tension
    priceHistory: [20, 25, 30, 42, 40, 44, 45],
    volume: 1250000,
    endDate: '2025-12-25T00:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=800&auto=format&fit=crop' // Snowy street
  },
  // 2. Dispatch Jan 1st (Viral for Community/Twitter)
  {
    id: 'm_dispatch_2026',
    title: '[이슈] 2026년 1월 1일, 디스패치 "초대형 열애설" 터질까?',
    titleEn: '[Issue] Will Dispatch reveal a Top Star Couple on Jan 1st, 2026?',
    category: 'ENTER',
    yesPrice: 82, // High expectation
    priceHistory: [60, 65, 70, 75, 80, 81, 82],
    volume: 5400000,
    endDate: '2025-12-31T23:59:59',
    imageUrl: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=800&auto=format&fit=crop' // Paparazzi vibe
  },
  // 3. Samsung Stock (Viral for 3040/Investors)
  {
    id: 'm_samsung_end',
    title: '[금융] 삼성전자, 2025년 종가 "8만 전자" 위에서 마감할까?',
    titleEn: '[Stock] Will Samsung close above 80k KRW in 2025?',
    category: 'STOCK',
    yesPrice: 35, // Pessimism vs Hope
    priceHistory: [50, 45, 40, 38, 32, 34, 35], 
    volume: 3100000,
    endDate: '2025-12-30T15:30:00', // Last trading day usually
    imageUrl: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=800&auto=format&fit=crop' // Stock chart
  }
];

export const COMING_SOON_ITEMS = [
    { id: 'cs1', title: '제62회 백상예술대상 대상 예측', date: '2026.04 Open' },
    { id: 'cs2', title: '2026 북중미 월드컵 우승국', date: '2026.05 Open' }
];

// Holiday Vibe Billboard
export const INITIAL_BILLBOARD: BillboardMessage[] = [
    { id: 'b1', text: "🎄 솔로부대: 크리스마스에 제발 눈 오지 마라...", sender: "커플지옥", color: "text-red-400" },
    { id: 'b2', text: "주식왕: 삼성전자 연말 랠리 간다! 지금이 기회!", sender: "희망회로", color: "text-blue-400" },
    { id: 'b3', text: "K-POP덕후: 1월 1일 제발 내 최애만 아니길 🙏", sender: "탈덕위기", color: "text-yellow-400" },
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
  { id: 'c1', marketId: 'm_dispatch_2026', userName: '안방1열', text: '솔직히 이제 터질 때 됐다. 3세대 아이돌 중 하나일 듯.', timestamp: Date.now() - 50000, prediction: 'YES', likeCount: 1242, isLiked: true },
  { id: 'c2', marketId: 'm_xmas_2025', userName: '기상청', text: '엘니뇨 현상 때문에 올해는 눈 힘들어요. 팩트 체크 하세요.', timestamp: Date.now() - 20000, prediction: 'NO', likeCount: 45, isLiked: false },
  { id: 'c3', marketId: 'm_samsung_end', userName: '구조대', text: '8만? 지금 5만도 간당간당한데 무슨 소리냐 ㅋㅋ', timestamp: Date.now() - 100000, prediction: 'NO', likeCount: 88, isLiked: false },
  { id: 'c4', marketId: 'm_xmas_2025', userName: '로맨티스트', text: '이브 날 눈 오면 고백합니다. 제발 YES 가즈아!', timestamp: Date.now() - 150000, prediction: 'YES', likeCount: 320, isLiked: true },
];

export const MOCK_RANKING: RankedUser[] = [
  { rank: 1, name: '예언가', balance: 2540000, winRate: 95 },
  { rank: 2, name: '디스패치', balance: 1812000, winRate: 88 },
  { rank: 3, name: '개미투자자', balance: 500, winRate: 12 }, 
  { rank: 4, name: '기상캐스터', balance: 92000, winRate: 60 },
  { rank: 5, name: '뉴비', balance: 3000, winRate: 0 },
];