import { Market, Comment, RankedUser, BillboardMessage } from './types';

// [ECONOMY] Start with 3,000 VP
export const INITIAL_BALANCE = 3000;

// [STRATEGY] MVP Launch Content - Seeded with "Hot" Topics
// Volume is pre-filled to show activity (Social Proof)
export const INITIAL_MARKETS: Market[] = [
  // 1. White Christmas (Seasonal & Romantic vs Solo)
  {
    id: 'm_xmas_2025',
    title: '[날씨] 2025년 크리스마스, 서울에 눈이 내린다?',
    titleEn: '[Weather] Will it snow in Seoul on Christmas 2025?',
    category: 'WEATHER',
    yesPrice: 30, // Low probability -> High payout potential
    priceHistory: [25, 28, 26, 30, 29, 31, 30],
    volume: 1250000,
    endDate: '2025-12-25T00:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=800&auto=format&fit=crop'
  },
  // 2. Bitcoin 200M (FOMO & Greed)
  {
    id: 'm_btc_2026',
    title: '[코인] 2026년 1월 1일 전, 비트코인 2억 돌파?',
    titleEn: '[Crypto] Bitcoin hits 200M KRW before Jan 1, 2026?',
    category: 'COIN',
    yesPrice: 82, // Bullish sentiment
    priceHistory: [60, 65, 75, 80, 78, 81, 82], 
    volume: 8240000, // Highest volume market
    endDate: '2026-01-01T00:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=800&auto=format&fit=crop'
  },
  // 3. Dispatch Jan 1st (Gossip & Curiosity)
  {
    id: 'm_dispatch_2026',
    title: '[이슈] 2026년 1월 1일, 디스패치 열애설 터진다?',
    titleEn: '[Issue] Will Dispatch release a scandal on Jan 1st 2026?',
    category: 'ENTER',
    yesPrice: 95, // Almost certain
    priceHistory: [80, 85, 90, 92, 94, 95, 95],
    volume: 4100000,
    endDate: '2025-12-31T23:59:59',
    imageUrl: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=800&auto=format&fit=crop'
  }
];

export const COMING_SOON_ITEMS = [
    { id: 'cs1', title: '2026 월드컵 대한민국 16강 진출?', date: 'SPORTS / 2026.06' },
    { id: 'cs2', title: '테슬라 주가 500달러 돌파?', date: 'STOCK / 2025.12' }
];

// Community Style Billboard - Setting the "Vibe"
export const INITIAL_BILLBOARD: BillboardMessage[] = [
    { id: 'b1', text: "📢 ZZIC 베타 오픈! 가입만 해도 3,000 VP 지급", sender: "운영자", color: "text-zzic" },
    { id: 'b2', text: "🔥 비트코인 숏 친 흑우 없제? 2억 간다 꽉 잡아", sender: "코인판", color: "text-red-400" },
    { id: 'b3', text: "☃️ 기상청 피셜: 이브날 맑음^^ 솔로부대 승리!", sender: "솔로천국", color: "text-blue-400" },
    { id: 'b4', text: "👑 랭킹 1위 도전합니다. 다들 비켜주세요.", sender: "도전자", color: "text-yellow-400" },
];

export const CATEGORY_COLORS: Record<string, string> = {
  ENTER: 'bg-pink-600',
  SPORTS: 'bg-orange-600',
  WEATHER: 'bg-cyan-600',
  TECH: 'bg-indigo-600',
  STOCK: 'bg-red-600',
  COIN: 'bg-yellow-600'
};

// Seed Comments - Creating Conflict & Humor
export const MOCK_COMMENTS: Comment[] = [
  // Dispatch Topic
  { id: 'c1', marketId: 'm_dispatch_2026', userName: '성지순례', text: '이 글은 성지가 됩니다. A군 B양 100%임. 내가 봄.', timestamp: Date.now() - 50000, prediction: 'YES', likeCount: 1242, isLiked: true },
  { id: 'c1_2', marketId: 'm_dispatch_2026', userName: '팩트체크', text: '근데 요즘 디패 감 다 잃지 않았냐? 작년에도 별거 없더만.', timestamp: Date.now() - 150000, prediction: 'NO', likeCount: 8, isLiked: false },
  
  // Bitcoin Topic
  { id: 'c2', marketId: 'm_btc_2026', userName: '숏충이', text: '지금이 고점이다. 인간지표 폭발했네 ㅋㅋ 돔황챠!', timestamp: Date.now() - 20000, prediction: 'NO', likeCount: 45, isLiked: false },
  { id: 'c3', marketId: 'm_btc_2026', userName: '화성갈끄니까', text: '반감기 아직 반영 안 됐다. 2억은 보수적으로 잡은 거임. 집 팔아서 롱 쳤다.', timestamp: Date.now() - 100000, prediction: 'YES', likeCount: 88, isLiked: true },
  
  // Weather Topic
  { id: 'c4', marketId: 'm_xmas_2025', userName: '모솔25년차', text: '눈 오면 차 막히고 사고 난다. 나라를 위해 NO에 걸어라. 제발 맑아라.', timestamp: Date.now() - 300000, prediction: 'NO', likeCount: 320, isLiked: true },
  { id: 'c5', marketId: 'm_xmas_2025', userName: '엘사', text: '낭만 뒤졌냐? 화이트 크리스마스 가즈아 ❄️', timestamp: Date.now() - 5000, prediction: 'YES', likeCount: 56, isLiked: false },
];

export const MOCK_RANKING: RankedUser[] = [
  { rank: 1, name: '워렌버핏', balance: 5240000, winRate: 95 },
  { rank: 2, name: '일론머스크', balance: 3812000, winRate: 88 },
  { rank: 3, name: '한강뷰가자', balance: 1540000, winRate: 62 }, 
  { rank: 4, name: '인간지표', balance: 92000, winRate: 40 },
  { rank: 5, name: '뉴비', balance: 3000, winRate: 0 },
];