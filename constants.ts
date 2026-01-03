
import { Market, Comment, RankedUser, BillboardMessage } from './types';

// [ECONOMY] Start with 3,000 VP
export const INITIAL_BALANCE = 3000;

// [AGE RESTRICTIONS] Age-based betting limits and features
export const AGE_RESTRICTIONS = {
  // 13-17 years old (GenZ Teens)
  teenager: {
    minAge: 13,
    maxAge: 17,
    maxDailyBet: 3000, // 30% of adult limit
    requireParentalConsent: true,
    timeLimitMinutes: 60, // 1 hour daily limit
    welcomeBonus: 1500, // Half of adult bonus
    allowedMarkets: ['WEATHER', 'TECH', 'ENTER'], // Safe categories only
    features: ['BETTING', 'SOCIAL'], // Limited features
    uiTheme: 'teen_friendly'
  },
  
  // 18+ years old (Adults)
  adult: {
    minAge: 18,
    maxDailyBet: 10000,
    requireParentalConsent: false,
    timeLimitMinutes: null, // No time limit
    welcomeBonus: 3000, // Full bonus
    allowedMarkets: ['ENTER', 'SPORTS', 'WEATHER', 'TECH', 'STOCK', 'COIN'],
    features: ['BETTING', 'SOCIAL', 'ADMIN', 'BILLBOARD'],
    uiTheme: 'default'
  }
};

// [SECURITY] Banned Nicknames (Case insensitive check will be applied)
export const BANNED_NICKNAMES = [
    'admin', 'administrator', 'manager', 'operator', 'master', 'system', 'root',
    'zzic', '찍', '운영자', '관리자', '주인장', '대표', 'ceo', 'official',
    '테트라', 'tetra', 'tetracorp'
];

// [STRATEGY] MVP Launch Content - GenZ Targeted Markets
export const INITIAL_MARKETS: Market[] = [
  // 1. White Christmas (Seasonal & Teen Friendly)
  {
    id: 'm_xmas_2025',
    title: '2025년 크리스마스, 서울에 눈이 내릴까? ❄️',
    titleEn: 'Will it snow in Seoul on Christmas 2025? ❄️',
    description: '기상청 서울(송월동) 관측소 기준, 12월 25일 00:00~23:59 사이 최심신적설량(새로 쌓인 눈) 1.0cm 이상 기록 시 YES 승리.',
    category: 'WEATHER',
    yesPrice: 50,
    priceHistory: [50, 50, 50, 50, 50, 50, 50],
    volume: 1250000,
    endDate: '2025-12-25T00:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1543258103-a62bdc069871?q=80&w=800&auto=format&fit=crop'
  },
  
  // 2. K-POP Comeback (GenZ Hot Topic)
  {
    id: 'm_bts_2025',
    title: 'BTS, 2025년 완전체 앨범 발매 할까? 🎤',
    titleEn: 'Will BTS release a full group album in 2025? 🎤',
    description: '2025년 12월 31일까지 BTS 멤버 7인 전원이 참여한 완전체 정규 앨범(싱글/미니앨범 제외)이 발매될 경우 YES 승리.',
    category: 'ENTER',
    yesPrice: 65,
    priceHistory: [65, 63, 67, 64, 66, 65, 64],
    volume: 2500000,
    endDate: '2025-12-31T23:59:59',
    imageUrl: 'https://images.unsplash.com/photo-1493225457121-a3a16270a9b6?q=80&w=800&auto=format&fit=crop'
  },
  
  // 3. YouTube Milestone (GenZ Favorite)
  {
    id: 'm_pinkfong_2025',
    title: '핑크퐁 2025년 구독자 2000만 돌파할까? 📺',
    titleEn: 'Will Pinkfong hit 20M subscribers in 2025? 📺',
    description: '2025년 12월 31일까지 공식 구독자 수가 20,000,000명을 돌파할 경우 YES 승리.',
    category: 'TECH',
    yesPrice: 55,
    priceHistory: [55, 57, 54, 56, 58, 55, 53],
    volume: 1800000,
    endDate: '2025-12-31T23:59:59',
    imageUrl: 'https://images.unsplash.com/photo-1611225216421-5bc8946d3aa7?q=80&w=800&auto=format&fit=crop'
  },
  
  // 4. Bitcoin $100k (Global Standard)
  {
    id: 'm_btc_2026',
    title: '비트코인, 2026년 전 $100,000 돌파 가능? 🚀',
    titleEn: 'Can Bitcoin break $100k before 2026? 🚀',
    description: 'Binance USDT 마켓 현물 가격 기준, 한국 시간 2026년 1월 1일 00:00 이전에 단 한 번이라도 $100,000를 터치할 경우 YES 승리.',
    category: 'COIN',
    yesPrice: 50,
    priceHistory: [50, 50, 50, 50, 50, 50, 50], 
    volume: 8240000,
    endDate: '2026-01-01T00:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800&auto=format&fit=crop'
  },
  
  // 5. Game Release (GenZ Gaming)
  {
    id: 'm_gta6_2025',
    title: 'GTA 6, 2025년 공식 발표 될까? 🎮',
    titleEn: 'Will GTA 6 be officially announced in 2025? 🎮',
    description: '2025년 12월 31일까지 Rockstar Games가 GTA 6의 공식 티저 트레일러가 포함된 발표를 할 경우 YES 승리.',
    category: 'TECH',
    yesPrice: 35,
    priceHistory: [35, 38, 33, 36, 40, 35, 32],
    volume: 3200000,
    endDate: '2025-12-31T23:59:59',
    imageUrl: 'https://images.unsplash.com/photo-1511512433090-18b5ad8ce2f?q=80&w=800&auto=format&fit=crop'
  },
  
  // 6. Korea Entertainment News
  {
    id: 'm_dispatch_2026',
    title: '2026년 1월 1일, 디스패치 대형 열애설 터질까? 📸',
    titleEn: 'Will Dispatch release a major scandal on Jan 1, 2026? 📸',
    description: '2026년 1월 1일 당일(00:00~23:59), 디스패치(Dispatch)가 연예인 열애설 특종 기사를 공식 보도할 경우 YES 승리.',
    category: 'ENTER',
    yesPrice: 50, 
    priceHistory: [50, 50, 50, 50, 50, 50, 50],
    volume: 4100000,
    endDate: '2025-12-31T23:59:59',
    imageUrl: 'https://placehold.co/800x800/000000/D20000.png?text=DISPATCH&font=oswald'
  },
  
  // 7. Sports Achievement (Safe Sports Topic)
  {
    id: 'm_son_heungmin_2025',
    title: '손흥민, 2025-26시즌 프리미어리골 10골 이상? ⚽',
    titleEn: 'Will Son Heung-min score 10+ goals in 2025-26 PL season? ⚽',
    description: '2025-26시즌 프리미어리그에서 손흥민이 리그 경기에만 10골 이상 기록할 경우 YES 승리.',
    category: 'SPORTS',
    yesPrice: 45,
    priceHistory: [45, 47, 44, 46, 48, 45, 43],
    volume: 5600000,
    endDate: '2025-12-31T23:59:59',
    imageUrl: 'https://images.unsplash.com/photo-1431328801262-df71ad07dd2e?q=80&w=800&auto=format&fit=crop'
  },
  
  // 8. Tech Company News
  {
    id: 'm_naver_stock_2025',
    title: '네이버, 2025년 주가 10만원 돌파할까? 📈',
    titleEn: 'Will Naver stock exceed 100,000 KRW in 2025? 📈',
    description: '2025년 12월 31일 KOSPI 종가 기준, 네이버 주가가 100,000원을 돌파할 경우 YES 승리.',
    category: 'STOCK',
    yesPrice: 30,
    priceHistory: [30, 32, 29, 31, 33, 30, 28],
    volume: 2100000,
    endDate: '2025-12-31T23:59:59',
    imageUrl: 'https://images.unsplash.com/photo-1611974289852-16c9c9b4341?q=80&w=800&auto=format&fit=crop'
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
