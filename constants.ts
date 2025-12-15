import { Market, Comment, RankedUser, BillboardMessage } from './types';

// [ECONOMY] Start with 3,000 VP for better initial gameplay experience
export const INITIAL_BALANCE = 3000;

// [DATA] Short-term / Viral Topics for High Engagement
export const INITIAL_MARKETS: Market[] = [
  {
    id: 'm_lol',
    title: '[LoL] 오늘 밤 T1 vs GEN, T1이 승리할까?',
    titleEn: '[LoL] T1 vs GEN tonight, will T1 win?',
    category: 'SPORTS',
    yesPrice: 52,
    priceHistory: [45, 48, 47, 50, 55, 53, 52],
    volume: 820000,
    endDate: '2025-05-12T22:00:00', // Very soon
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'm_btc',
    title: '[비트코인] 오늘 자정까지 1억 3천만원 돌파?',
    titleEn: '[BTC] Hit 130M KRW by midnight?',
    category: 'COIN',
    yesPrice: 38,
    priceHistory: [20, 25, 30, 45, 42, 35, 38],
    volume: 1250000,
    endDate: '2025-05-12T23:59:59',
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'm_weather',
    title: '[날씨] 내일 아침 서울 기온 영하 5도 밑으로 떨어질까?',
    titleEn: '[Weather] Seoul below -5°C tomorrow morning?',
    category: 'WEATHER',
    yesPrice: 85,
    priceHistory: [60, 65, 70, 80, 82, 84, 85],
    volume: 32000,
    endDate: '2025-05-13T09:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1476900543704-4312b78632f8?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'm_idol',
    title: '[연예] 뉴진스 신곡, 발매 24시간 내 멜론 1위 달성?',
    titleEn: '[K-POP] NewJeans new song #1 on Melon in 24h?',
    category: 'ENTER',
    yesPrice: 92,
    priceHistory: [80, 85, 88, 90, 91, 93, 92],
    volume: 540000,
    endDate: '2025-05-20T18:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop'
  }
];

export const INITIAL_BILLBOARD: BillboardMessage[] = [
    { id: 'b1', text: "김철수: T1 무조건 이긴다 ㅋㅋ 반박시 롤알못", sender: "김철수", color: "text-blue-400" },
    { id: 'b2', text: "도지킬러: 비트코인 숏 쳤다. 나만 믿어라.", sender: "도지킬러", color: "text-red-400" },
    { id: 'b3', text: "날씨요정: 내일 춥대요 옷 따뜻하게 입으세요!", sender: "날씨요정", color: "text-zzic" },
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
  { id: 'c1', marketId: 'm_lol', userName: '페이커팬', text: '대상혁 믿습니다. 전재산 태움.', timestamp: Date.now() - 50000, prediction: 'YES' },
  { id: 'c2', marketId: 'm_lol', userName: '젠지화이팅', text: '쵸비가 다 해줄거야~ NO에 건 흑우 없제?', timestamp: Date.now() - 20000, prediction: 'NO' },
  { id: 'c3', marketId: 'm_btc', userName: '한강뷰', text: '1억 3천은 무슨 ㅋㅋ 조정 온다', timestamp: Date.now() - 100000, prediction: 'NO' },
];

export const MOCK_RANKING: RankedUser[] = [
  { rank: 1, name: '미래에서옴', balance: 154300, winRate: 92 },
  { rank: 2, name: '워렌버핏', balance: 82100, winRate: 85 },
  { rank: 3, name: '기도매매', balance: 58500, winRate: 45 }, 
  { rank: 4, name: '차트분석가', balance: 29200, winRate: 65 },
  { rank: 5, name: '뉴비', balance: 4500, winRate: 40 },
];