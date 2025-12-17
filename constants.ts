
import { Market, Comment, RankedUser, BillboardMessage } from './types';

// [ECONOMY] Start with 3,000 VP
export const INITIAL_BALANCE = 3000;

// [SECURITY] Banned Nicknames (Case insensitive check will be applied)
export const BANNED_NICKNAMES = [
    'admin', 'administrator', 'manager', 'operator', 'master', 'system', 'root',
    'zzic', '찍', '운영자', '관리자', '주인장', '대표', 'ceo', 'official',
    '테트라', 'tetra', 'tetracorp'
];

// [STRATEGY] MVP Launch Content
export const INITIAL_MARKETS: Market[] = [
  // 1. White Christmas (Seasonal & Romantic)
  {
    id: 'm_xmas_2025',
    title: '2025년 크리스마스, 서울에 눈이 내릴까?',
    titleEn: 'Will it snow in Seoul on Christmas 2025?',
    description: '기상청 서울(송월동) 관측소 기준, 12월 25일 00:00~23:59 사이 최심신적설량(새로 쌓인 눈) 1.0cm 이상 기록 시 YES 승리.',
    category: 'WEATHER',
    yesPrice: 50,
    priceHistory: [50, 50, 50, 50, 50, 50, 50],
    volume: 1250000,
    endDate: '2025-12-25T00:00:00',
    // Updated: Snowy winter vibes
    imageUrl: 'https://images.unsplash.com/photo-1543258103-a62bdc069871?q=80&w=800&auto=format&fit=crop'
  },
  // 2. Bitcoin $100k (Global Standard)
  {
    id: 'm_btc_2026',
    title: '비트코인, 2026년 전 $100,000 돌파 가능?',
    titleEn: 'Can Bitcoin break $100k before 2026?',
    description: 'Binance USDT 마켓 현물 가격 기준, 한국 시간 2026년 1월 1일 00:00 이전에 단 한 번이라도 $100,000를 터치할 경우 YES 승리.',
    category: 'COIN',
    yesPrice: 50,
    priceHistory: [50, 50, 50, 50, 50, 50, 50], 
    volume: 8240000,
    endDate: '2026-01-01T00:00:00',
    // Updated: High quality 3D Bitcoin render
    imageUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800&auto=format&fit=crop'
  },
  // 3. Dispatch Jan 1st (Gossip)
  {
    id: 'm_dispatch_2026',
    title: '2026년 1월 1일, 디스패치 대형 열애설 터질까?',
    titleEn: 'Will Dispatch release a major scandal on Jan 1, 2026?',
    description: '2026년 1월 1일 당일(00:00~23:59), 디스패치(Dispatch)가 연예인 열애설 특종 기사를 공식 보도할 경우 YES 승리.',
    category: 'ENTER',
    yesPrice: 50, 
    priceHistory: [50, 50, 50, 50, 50, 50, 50],
    volume: 4100000,
    endDate: '2025-12-31T23:59:59',
    // Updated: Dispatch Logo Style (Text-based image)
    imageUrl: 'https://placehold.co/800x800/000000/D20000.png?text=DISPATCH&font=oswald'
  }
];

export const COMING_SOON_ITEMS = [
    { id: 'cs1', title: '2026 월드컵 대한민국 16강 진출?', date: 'SPORTS / 2026.06' },
    { id: 'cs2', title: '테슬라 주가 $500 안착 가능?', date: 'STOCK / 2025.12' }
];

// Community Style Billboard
export const INITIAL_BILLBOARD: BillboardMessage[] = [
    { id: 'b1', text: "📢 ZZIC 베타 오픈! 가입만 해도 3,000 VP 지급", sender: "운영자", color: "text-zzic" },
    { id: 'b2', text: "🔥 비트코인 숏 친 흑우 없제? 10만불 간다", sender: "코인판", color: "text-red-400" },
    { id: 'b3', text: "☃️ 솔직히 눈 안 온다에 전재산 검 ㅋㅋ", sender: "솔로천국", color: "text-blue-400" },
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

// Seed Comments
export const MOCK_COMMENTS: Comment[] = [
  // Dispatch Topic
  { id: 'c1', marketId: 'm_dispatch_2026', userName: '성지순례', text: '이 글은 성지가 됩니다. A군 B양 100%임. 내가 봄.', timestamp: Date.now() - 50000, prediction: 'YES', likeCount: 1242, isLiked: true },
  { id: 'c1_2', marketId: 'm_dispatch_2026', userName: '팩트체크', text: '근데 요즘 디패 감 다 잃지 않았냐? 작년에도 별거 없더만.', timestamp: Date.now() - 150000, prediction: 'NO', likeCount: 8, isLiked: false },
  
  // Bitcoin Topic
  { id: 'c2', marketId: 'm_btc_2026', userName: '숏충이', text: '지금이 고점이다. 인간지표 폭발했네 ㅋㅋ 돔황챠!', timestamp: Date.now() - 20000, prediction: 'NO', likeCount: 45, isLiked: false },
  { id: 'c3', marketId: 'm_btc_2026', userName: '화성갈끄니까', text: '10만불은 보수적으로 잡은 거임. 집 팔아서 롱 쳤다.', timestamp: Date.now() - 100000, prediction: 'YES', likeCount: 88, isLiked: true },
  
  // Weather Topic
  { id: 'c4', marketId: 'm_xmas_2025', userName: '모솔25년차', text: '눈 오면 차 막히고 사고 난다. 나라를 위해 NO에 걸어라.', timestamp: Date.now() - 300000, prediction: 'NO', likeCount: 320, isLiked: true },
  { id: 'c5', marketId: 'm_xmas_2025', userName: '엘사', text: '낭만 뒤졌냐? 화이트 크리스마스 가즈아 ❄️', timestamp: Date.now() - 5000, prediction: 'YES', likeCount: 56, isLiked: false },
];

// Realistic Early Stage Ranking
export const MOCK_RANKING: RankedUser[] = [
  { rank: 1, name: '촉이좋아', balance: 48500, winRate: 100 },
  { rank: 2, name: '비트10만불', balance: 29200, winRate: 80 },
  { rank: 3, name: '무한도전', balance: 12400, winRate: 66 }, 
  { rank: 4, name: '찍기장인', balance: 8900, winRate: 50 },
  { rank: 5, name: '뉴비123', balance: 3500, winRate: 100 },
];
