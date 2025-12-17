import { Market, Comment, RankedUser, BillboardMessage } from './types';

// [ECONOMY] Start with 3,000 VP
export const INITIAL_BALANCE = 3000;

// [STRATEGY] End of Year Viral Topics (Guerrilla Marketing: Community Focused)
export const INITIAL_MARKETS: Market[] = [
  // 1. White Christmas (Target: Solo vs Couple / Blind, Instiz)
  {
    id: 'm_xmas_2025',
    title: '[날씨] 크리스마스 눈 올 확률 0%? 솔로부대 vs 커플지옥 승자는?',
    titleEn: '[Weather] White Christmas in Seoul? Solo vs Couple',
    category: 'WEATHER',
    yesPrice: 30, // Low probability provokes couples to bet YES
    priceHistory: [20, 22, 25, 28, 32, 29, 30],
    volume: 1540000,
    endDate: '2025-12-25T00:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=800&auto=format&fit=crop'
  },
  // 2. Bitcoin 200M (Target: Greed vs Logic / Coinpan, DC Bitgall)
  {
    id: 'm_btc_2026',
    title: '[코인] 비트코인, 2026년 1월 1일 전까지 "2억" 찍는다 vs 못 간다',
    titleEn: '[Crypto] Will Bitcoin hit 200M KRW by Jan 1st 2026?',
    category: 'COIN',
    yesPrice: 75, // FOMO driven high price
    priceHistory: [40, 55, 62, 70, 78, 74, 75], 
    volume: 8200000, // Highest volume
    endDate: '2026-01-01T00:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=800&auto=format&fit=crop'
  },
  // 3. Dispatch Jan 1st (Target: Gossip / TheQoo, Twitter)
  {
    id: 'm_dispatch_2026',
    title: '[이슈] 2026년 1월 1일, 디스패치 열애설 "터진다" vs "안 터진다"',
    titleEn: '[Issue] Will Dispatch release a scandal on Jan 1st 2026?',
    category: 'ENTER',
    yesPrice: 88, // High conviction in community rumors
    priceHistory: [60, 75, 80, 82, 85, 87, 88],
    volume: 5400000,
    endDate: '2025-12-31T23:59:59',
    imageUrl: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=800&auto=format&fit=crop'
  }
];

export const COMING_SOON_ITEMS = [
    { id: 'cs1', title: '2026년 1월, 한은 "금리 인하" 소식 들려올까?', date: 'MONEY / ECONOMY' }
];

// Community Style Billboard (Real vibes)
export const INITIAL_BILLBOARD: BillboardMessage[] = [
    { id: 'b1', text: "🔥 비트코인 숏 친 흑우 없제? 2억 간다 꽉 잡아", sender: "코인판", color: "text-red-400" },
    { id: 'b2', text: "☃️ 기상청 피셜: 이브날 맑음^^ 솔로부대 승리!", sender: "솔로천국", color: "text-blue-400" },
    { id: 'b3', text: "💔 내 최애만 아니면 돼... 제발 배우랑 사겨라", sender: "덕후", color: "text-yellow-400" },
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
  { id: 'c1', marketId: 'm_dispatch_2026', userName: '성지순례', text: '이 글은 성지가 됩니다. A군 B양 100%임.', timestamp: Date.now() - 50000, prediction: 'YES', likeCount: 1242, isLiked: true },
  { id: 'c2', marketId: 'm_btc_2026', userName: '숏충이', text: '지금이 고점이다. 인간지표 폭발했네 ㅋㅋ 돔황챠', timestamp: Date.now() - 20000, prediction: 'NO', likeCount: 45, isLiked: false },
  { id: 'c3', marketId: 'm_btc_2026', userName: '화성갈끄니까', text: '반감기 아직 반영 안 됐다. 2억은 보수적으로 잡은 거임.', timestamp: Date.now() - 100000, prediction: 'YES', likeCount: 88, isLiked: true },
  { id: 'c4', marketId: 'm_xmas_2025', userName: '모솔25년차', text: '눈 오면 차 막히고 사고 난다. 나라를 위해 NO에 걸어라.', timestamp: Date.now() - 150000, prediction: 'NO', likeCount: 320, isLiked: true },
];

export const MOCK_RANKING: RankedUser[] = [
  { rank: 1, name: '워렌버핏', balance: 5240000, winRate: 95 },
  { rank: 2, name: '일론머스크', balance: 3812000, winRate: 88 },
  { rank: 3, name: '한강뷰가자', balance: 500, winRate: 12 }, 
  { rank: 4, name: '인간지표', balance: 92000, winRate: 40 },
  { rank: 5, name: '뉴비', balance: 3000, winRate: 0 },
];