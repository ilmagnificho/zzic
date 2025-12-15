import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, TrendingUp, Wallet, Clock, Trophy, User, MessageSquare, Send, Crown, Info, ChevronRight, Flame, PlusCircle, LogOut, Mail, Lock, X, Zap, AlertCircle, LogIn, Globe, LayoutGrid, Search, Home, MessageCircle, CornerDownRight, Sparkles, Timer, Megaphone, BatteryCharging, Gem } from 'lucide-react';
import { Market, UserState, ViewState, PortfolioItem, Comment, Category, BillboardMessage } from './types';
import { INITIAL_BALANCE, INITIAL_MARKETS, INITIAL_BILLBOARD, CATEGORY_COLORS, MOCK_COMMENTS, MOCK_RANKING } from './constants';
import BottomNav from './components/BottomNav';
import ShareModal from './components/ShareModal';
import { supabase } from './lib/supabase';
import { TRANSLATIONS, Language } from './translations';

// --- Helper Components & Functions ---

const isSupabaseConnected = !supabase['supabaseUrl']?.includes('placeholder');

// Tier Logic
const getTier = (balance: number) => {
    if (balance > 50000) return { name: 'CHALLENGER', icon: Gem, color: 'text-cyan-400', bg: 'bg-cyan-950/30 border-cyan-500/50' };
    if (balance > 20000) return { name: 'GOLD', icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-950/30 border-yellow-500/50' };
    if (balance > 5000) return { name: 'SILVER', icon: Zap, color: 'text-zinc-300', bg: 'bg-zinc-800/50 border-zinc-500/50' };
    return { name: 'BRONZE', icon: User, color: 'text-orange-700', bg: 'bg-orange-950/30 border-orange-800/50' };
};

// SVG Line Chart Component
const MiniChart: React.FC<{ history: number[], color: string }> = ({ history, color }) => {
    if (!history || history.length < 2) return null;
    
    const min = Math.min(...history) * 0.9;
    const max = Math.max(...history) * 1.1;
    const height = 40;
    const width = 100;
    
    const points = history.map((price, i) => {
        const x = (i / (history.length - 1)) * width;
        const y = height - ((price - min) / (max - min)) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                points={points}
                className={color}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* End dot */}
            <circle 
                cx={width} 
                cy={height - ((history[history.length-1] - min) / (max - min)) * height} 
                r="3" 
                className={`${color} fill-current`} 
            />
        </svg>
    );
};

// Billboard Component
const Billboard: React.FC<{ messages: BillboardMessage[] }> = ({ messages }) => {
    return (
        <div className="bg-black border-b border-zinc-900 overflow-hidden py-2 relative flex items-center h-10">
            <div className="absolute left-0 z-10 bg-gradient-to-r from-black to-transparent w-8 h-full"></div>
            <div className="absolute right-0 z-10 bg-gradient-to-l from-black to-transparent w-8 h-full"></div>
            
            <Megaphone size={14} className="text-zzic absolute left-3 z-20 animate-pulse" />
            
            <div className="whitespace-nowrap flex gap-8 animate-marquee pl-10">
                {[...messages, ...messages].map((msg, i) => (
                    <span key={`${msg.id}-${i}`} className={`text-xs font-bold ${msg.color} flex items-center gap-2`}>
                        <span className="opacity-70 text-[10px] border border-zinc-800 px-1 rounded uppercase">{msg.sender}</span>
                        {msg.text}
                    </span>
                ))}
            </div>
            
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
            `}</style>
        </div>
    );
};

interface AuthScreenProps {
  onLogin: (user: UserState) => void;
  onClose: () => void;
  language: Language;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onClose, language }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const t = (key: keyof typeof TRANSLATIONS['ko']) => TRANSLATIONS[language][key];
  
    const handleSubmit = () => {
      // Mock Login for demo purposes
      const mockUser: UserState = {
        id: isLogin ? 'u_demo' : Date.now().toString(),
        email: email || 'user@example.com',
        balance: INITIAL_BALANCE,
        name: isLogin ? (email ? email.split('@')[0] : 'DemoUser') : (name || 'New User'),
        portfolio: [],
        isGuest: false
      };
      
      onLogin(mockUser);
    };

    const handleGuest = () => {
        const guest: UserState = {
            id: 'guest_' + Date.now(),
            balance: INITIAL_BALANCE,
            name: 'Guest ' + Math.floor(Math.random() * 1000),
            portfolio: [],
            isGuest: true
        };
        onLogin(guest);
    };
  
    return (
      <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
        <div className="w-full max-w-sm bg-zinc-900 rounded-3xl border border-zinc-800 p-8 relative shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
          
          <h2 className="text-2xl font-black text-white mb-8 text-center italic uppercase tracking-tighter">
            {isLogin ? t('login') : t('signup')}
          </h2>
  
          <div className="space-y-4">
             {!isLogin && (
                 <div>
                    <label className="text-xs font-bold text-zinc-500 mb-1 block uppercase">{t('nickname')}</label>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white focus:border-zzic outline-none transition-colors"
                        placeholder="ZZIC Master"
                    />
                 </div>
             )}
              <div>
                  <label className="text-xs font-bold text-zinc-500 mb-1 block uppercase">{t('email')}</label>
                  <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white focus:border-zzic outline-none transition-colors"
                      placeholder="user@example.com"
                  />
              </div>
               <div>
                  <label className="text-xs font-bold text-zinc-500 mb-1 block uppercase">{t('password')}</label>
                  <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white focus:border-zzic outline-none transition-colors"
                      placeholder="••••••••"
                  />
              </div>
  
              <button 
                  onClick={handleSubmit}
                  className="w-full bg-zzic text-black font-black py-4 rounded-xl mt-4 hover:bg-[#b3e600] transition-colors uppercase shadow-[0_0_15px_rgba(204,255,0,0.3)]"
              >
                  {isLogin ? t('auth_login_btn') : t('auth_signup_btn')}
              </button>
  
               <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-900 px-2 text-zinc-500 font-bold">Or</span></div>
              </div>
  
              <button 
                  onClick={handleGuest}
                  className="w-full bg-zinc-800 text-white font-bold py-3 rounded-xl hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
              >
                  <User size={18} />
                  {t('auth_guest')}
              </button>
          </div>
  
          <div className="mt-6 text-center">
              <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-xs text-zinc-500 hover:text-white underline decoration-zinc-700 underline-offset-4"
              >
                  {isLogin ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
              </button>
          </div>
        </div>
      </div>
    );
  };

const App: React.FC = () => {
  // --- State ---
  const [user, setUser] = useState<UserState | null>(null);
  const [view, setView] = useState<ViewState>('HOME');
  const [activeMarketId, setActiveMarketId] = useState<string | null>(null);
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS);
  const [billboardMsgs, setBillboardMsgs] = useState<BillboardMessage[]>(INITIAL_BILLBOARD);
  
  // Localization State
  const [language, setLanguage] = useState<Language>('ko');
  const t = (key: keyof typeof TRANSLATIONS['ko']) => TRANSLATIONS[language][key];
  
  // Modals
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [showBillboardModal, setShowBillboardModal] = useState(false);

  // Comments State
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null); 

  // Betting State
  const [betAmount, setBetAmount] = useState<number>(0);
  const [selectedPrediction, setSelectedPrediction] = useState<'YES' | 'NO'>('YES');
  const [lastPurchasedItem, setLastPurchasedItem] = useState<PortfolioItem | null>(null);

  // Billboard Input
  const [billboardText, setBillboardText] = useState('');

  // --- Helpers ---
  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercent = (num: number) => num.toFixed(1);
  const toggleLanguage = () => setLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  const activeMarket = useMemo(() => markets.find(m => m.id === activeMarketId), [markets, activeMarketId]);
  
  // Handlers
  const handleRefill = () => {
    if (user && user.balance < 1000) {
        if(confirm("광고를 시청하고(Mock) 3,000 VP를 충전하시겠습니까?")) {
            setUser({ ...user, balance: user.balance + 3000 });
            alert("충전 완료! 다시 게임을 즐겨보세요.");
        }
    }
  };

  const handlePostBillboard = () => {
      if (!user) return setView('AUTH');
      if (user.balance < 1000) return alert("VP가 부족합니다. (비용: 1,000 VP)");
      if (!billboardText.trim()) return;

      setUser({ ...user, balance: user.balance - 1000 });
      const newMsg: BillboardMessage = {
          id: Date.now().toString(),
          text: billboardText,
          sender: user.name,
          color: "text-white"
      };
      setBillboardMsgs([newMsg, ...billboardMsgs]);
      setBillboardText('');
      setShowBillboardModal(false);
      alert("전광판 등록 완료!");
  };

  const handlePredict = async () => {
    if (!user) return setView('AUTH');
    if (!activeMarket) return;
    if (betAmount <= 0) return alert(t('msg_bet_amount_error'));
    if (user.balance < betAmount) return alert(t('msg_insufficient'));

    const price = selectedPrediction === 'YES' ? activeMarket.yesPrice : (100 - activeMarket.yesPrice);
    const multiplier = 100 / price;

    const newItem: PortfolioItem = {
        id: Date.now().toString(),
        marketId: activeMarket.id,
        marketTitle: language === 'en' ? (activeMarket.titleEn || activeMarket.title) : activeMarket.title,
        prediction: selectedPrediction,
        amount: betAmount,
        entryPrice: price,
        payoutMultiple: multiplier,
        timestamp: Date.now()
    };

    setUser({
        ...user,
        balance: user.balance - betAmount,
        portfolio: [newItem, ...user.portfolio]
    });
    setLastPurchasedItem(newItem);
    setBetAmount(0);
  };

  const handleAddComment = () => {
    if (!user) {
        if(confirm(t('msg_comment_login'))) setView('AUTH');
        return;
    }
    // Check if user has bet on this market
    const userBet = user.portfolio.find(p => p.marketId === activeMarketId);
    if (!userBet) {
        alert("⚠️ 투표에 참여한 '플레이어'만 발언권이 있습니다!\n먼저 예측을 진행해주세요.");
        return;
    }

    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      marketId: activeMarketId!,
      userName: user.name,
      text: newCommentText,
      timestamp: Date.now(),
      prediction: userBet.prediction, // Forced prediction stance based on bet
      parentId: replyToId || undefined
    };

    setComments(prev => [newComment, ...prev]);
    setNewCommentText('');
    setReplyToId(null);
  };

  // --- Render Functions ---

  const renderHome = () => (
    <div className="pb-24 md:pb-0 animate-in fade-in duration-500">
      {/* Billboard */}
      <Billboard messages={billboardMsgs} />

      {/* Header */}
      <div className="px-5 py-4 flex justify-between items-center sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900">
        <h1 
            className="text-2xl font-black italic tracking-tighter text-white cursor-pointer" 
            style={{ textShadow: '0 0 10px rgba(204,255,0,0.5)' }}
            onClick={() => setView('HOME')}
        >
          ZZIC
        </h1>
        <div className="flex gap-3 items-center">
            {user ? (
                <>
                {user.balance < 1000 && (
                     <button onClick={handleRefill} className="animate-bounce bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                        <BatteryCharging size={12} /> 무료 충전
                     </button>
                )}
                <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800" onClick={() => setShowBillboardModal(true)}>
                    <div className="w-2 h-2 rounded-full bg-zzic animate-pulse"></div>
                    <span className="text-sm font-black text-white font-mono">{formatNumber(user.balance)} VP</span>
                </div>
                </>
            ) : (
                <button 
                    onClick={() => setView('AUTH')}
                    className="bg-zzic px-4 py-1.5 rounded-full border border-zzic hover:bg-[#b3e600] transition-colors"
                >
                    <span className="text-xs font-black text-black uppercase">{t('auth_login_signup')}</span>
                </button>
            )}
        </div>
      </div>

      {/* Billboard Input Trigger (if logged in) */}
      {user && (
          <div className="px-5 mt-4">
              <button 
                onClick={() => setShowBillboardModal(true)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between group hover:border-zzic transition-colors"
              >
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 group-hover:text-white">
                      <Megaphone size={14} />
                      <span>전광판에 메시지 띄우기 (1,000 VP)</span>
                  </div>
                  <ChevronRight size={14} className="text-zinc-600 group-hover:text-zzic" />
              </button>
          </div>
      )}

      {/* Market List */}
      <div className="px-5 space-y-4 mt-6">
        <h3 className="text-base font-black text-white mb-2 flex items-center gap-2 uppercase tracking-wide">
            <TrendingUp size={18} className="text-zzic" />
            {t('home_trending')}
        </h3>
        
        {markets.map((market) => (
            <div 
                key={market.id}
                onClick={() => { setActiveMarketId(market.id); setView('DETAIL'); setBetAmount(0); }}
                className="group relative bg-zinc-900 rounded-3xl p-4 border border-zinc-800 active:scale-[0.98] transition-all cursor-pointer hover:border-zzic/50 overflow-hidden"
            >
                <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-black border border-zinc-800">
                         <img 
                            src={market.imageUrl} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0" 
                            alt={market.title} 
                         />
                         <div className={`absolute top-0 left-0 px-2 py-0.5 text-[8px] font-black text-white rounded-br-lg ${CATEGORY_COLORS[market.category]}`}>
                             {market.category}
                         </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 py-1">
                        <div className="flex justify-between items-start mb-1">
                             <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                                <Clock size={10} />
                                <span>오늘 마감</span>
                            </div>
                            {/* Mini Chart */}
                            <div className="w-16 h-6 opacity-50 group-hover:opacity-100 transition-opacity">
                                <MiniChart history={market.priceHistory} color={market.yesPrice > 50 ? 'text-blue-500' : 'text-red-500'} />
                            </div>
                        </div>
                        
                        <h4 className="text-[15px] font-bold text-white leading-snug line-clamp-2 pr-1 group-hover:text-zzic transition-colors mb-2">
                            {language === 'en' ? (market.titleEn || market.title) : market.title}
                        </h4>

                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden flex">
                            <div className="h-full bg-blue-500" style={{ width: `${market.yesPrice}%` }} />
                            <div className="h-full bg-red-500" style={{ width: `${100 - market.yesPrice}%` }} />
                        </div>
                        <div className="flex justify-between text-[9px] font-black mt-1">
                             <span className="text-blue-400">YES {market.yesPrice}%</span>
                             <span className="text-red-400">NO {100 - market.yesPrice}%</span>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );

  const renderDetail = () => {
    if (!activeMarket) return null;
    const tier = user ? getTier(user.balance) : null;
    const currentPrice = selectedPrediction === 'YES' ? activeMarket.yesPrice : (100 - activeMarket.yesPrice);

    return (
        <div className="pb-24 md:pb-0 min-h-screen animate-in slide-in-from-right duration-300">
            {/* Nav */}
            <div className="px-4 py-4 flex items-center sticky top-0 bg-black/90 backdrop-blur-xl z-50 border-b border-zinc-900 justify-between">
                <div className="flex items-center">
                    <button onClick={() => setView('HOME')} className="p-2 -ml-2 rounded-full hover:bg-zinc-900 text-white transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <span className="ml-2 font-black text-lg tracking-wide uppercase italic">{t('detail_nav')}</span>
                </div>
                {tier && (
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-black ${tier.color} ${tier.bg}`}>
                        <tier.icon size={10} /> {tier.name}
                    </div>
                )}
            </div>

            <div className="px-5 pt-6">
                {/* Hero */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-white leading-snug mb-4 break-keep">
                        {language === 'en' ? (activeMarket.titleEn || activeMarket.title) : activeMarket.title}
                    </h2>
                    
                    {/* Graph Area */}
                    <div className="w-full h-24 bg-zinc-900/50 rounded-xl border border-zinc-800 p-4 mb-4 relative overflow-hidden">
                        <div className="absolute top-2 left-4 text-[10px] font-bold text-zinc-500">YES Price Trend</div>
                        <MiniChart history={activeMarket.priceHistory} color="text-zzic" />
                        <div className="absolute bottom-2 right-4 text-xs font-black text-white">{activeMarket.yesPrice}%</div>
                    </div>
                </div>

                {/* Interaction */}
                <div className="bg-zinc-900 rounded-[2rem] p-6 border border-zinc-800 shadow-2xl mb-8">
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button 
                            onClick={() => setSelectedPrediction('YES')}
                            className={`py-6 rounded-2xl font-black text-sm transition-all border-2 ${selectedPrediction === 'YES' ? 'bg-blue-600 border-blue-400 text-white shadow-lg scale-105' : 'bg-black border-zinc-800 text-zinc-600'}`}
                        >
                            <span className="block text-[10px] opacity-60 mb-1">YES</span>
                            <span className="text-3xl italic">{activeMarket.yesPrice}%</span>
                        </button>
                        <button 
                            onClick={() => setSelectedPrediction('NO')}
                            className={`py-6 rounded-2xl font-black text-sm transition-all border-2 ${selectedPrediction === 'NO' ? 'bg-red-600 border-red-400 text-white shadow-lg scale-105' : 'bg-black border-zinc-800 text-zinc-600'}`}
                        >
                             <span className="block text-[10px] opacity-60 mb-1">NO</span>
                             <span className="text-3xl italic">{100 - activeMarket.yesPrice}%</span>
                        </button>
                    </div>

                    {user ? (
                        <div className="bg-zinc-950/50 rounded-2xl p-4 mb-4 border border-zinc-800">
                             <div className="flex justify-between items-center mb-3">
                                <span className="text-xs text-zinc-400 font-bold flex items-center gap-1"><Wallet size={12} /> 주문 수량</span>
                                <span className="text-xs font-mono font-bold text-zinc-500">보유: <span className="text-white ml-1">{formatNumber(user.balance)}</span></span>
                            </div>
                            <input
                                type="number"
                                value={betAmount === 0 ? '' : betAmount}
                                onChange={(e) => setBetAmount(Math.min(parseInt(e.target.value) || 0, user.balance))}
                                placeholder="0"
                                className="w-full bg-black border-2 border-zinc-800 rounded-xl py-3 text-center text-2xl font-black text-white focus:border-zzic outline-none mb-3"
                            />
                            <div className="grid grid-cols-4 gap-2">
                                {[100, 500, 1000].map(amt => (
                                    <button key={amt} onClick={() => setBetAmount(Math.min(betAmount + amt, user.balance))} className="bg-zinc-800 text-zinc-400 text-xs font-bold py-2 rounded-lg hover:text-white">+{amt}</button>
                                ))}
                                <button onClick={() => setBetAmount(user.balance)} className="bg-zzic/20 text-zzic text-xs font-black py-2 rounded-lg">MAX</button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-4 bg-zinc-950 rounded-xl border border-zinc-800 mb-4 text-zinc-500 text-xs font-bold">로그인이 필요합니다.</div>
                    )}

                    <button 
                        onClick={handlePredict}
                        className={`w-full py-4 rounded-xl font-black text-lg shadow-lg uppercase tracking-wider ${user ? (selectedPrediction === 'YES' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white') : 'bg-zinc-800 text-zinc-500'}`}
                    >
                        {user ? '구매 확정' : '로그인 필요'}
                    </button>
                </div>

                {/* Community (Fandom War) */}
                <div className="pb-10">
                    <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                        <MessageSquare size={16} className="text-zzic"/> 실시간 진영 토론
                    </h3>

                    {/* Input */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6">
                        <textarea 
                            placeholder={user ? "참여자만 댓글을 남길 수 있습니다 (Clean Bot 작동중)" : "로그인이 필요합니다."}
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none resize-none font-medium mb-2"
                            rows={2}
                        />
                        <div className="flex justify-end">
                            <button onClick={handleAddComment} className="bg-white text-black text-xs font-black px-4 py-2 rounded-lg hover:bg-zzic transition-colors flex items-center gap-1">
                                <Send size={12} /> 전송
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="space-y-3">
                        {comments.filter(c => c.marketId === activeMarketId && !c.parentId).map(comment => (
                            <div key={comment.id} className={`p-4 rounded-2xl border ${comment.prediction === 'YES' ? 'bg-blue-950/20 border-blue-900/50' : 'bg-red-950/20 border-red-900/50'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${comment.prediction === 'YES' ? 'text-blue-400 border-blue-400' : 'text-red-400 border-red-400'}`}>
                                        {comment.prediction === 'YES' ? 'YES팀' : 'NO팀'}
                                    </span>
                                    <span className="text-xs font-bold text-white">{comment.userName}</span>
                                    <span className="text-[10px] text-zinc-600 ml-auto">{new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <p className="text-sm text-zinc-300 leading-relaxed">{comment.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderProfile = () => {
    if (!user) return <div className="min-h-screen flex items-center justify-center"><button onClick={() => setView('AUTH')} className="bg-zzic px-6 py-3 rounded-xl font-black text-black">로그인하기</button></div>;
    const tier = getTier(user.balance);

    return (
        <div className="pb-24 animate-in fade-in">
            <div className="px-5 py-8 bg-black border-b border-zinc-900 relative overflow-hidden">
                <div className={`absolute top-[-20%] right-[-20%] w-64 h-64 blur-[100px] opacity-20 rounded-full ${tier.bg.split(' ')[0].replace('/30','/50')}`}></div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center mb-4 bg-black ${tier.color.replace('text', 'border')}`}>
                        <tier.icon size={40} className={tier.color} />
                    </div>
                    <div className={`text-xs font-black px-3 py-1 rounded-full border mb-2 ${tier.color} ${tier.bg}`}>
                        {tier.name} TIER
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                    <h1 className="text-4xl font-black text-white font-mono">{formatNumber(user.balance)} <span className="text-lg text-zinc-600">VP</span></h1>
                </div>
            </div>
             {/* Refill CTA */}
             {user.balance < 1000 && (
                <div className="m-5 p-4 bg-red-950/30 border border-red-900/50 rounded-2xl flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-red-400 text-sm">파산 위기!</h4>
                        <p className="text-[10px] text-red-300">지금 무료로 충전하고 복구하세요.</p>
                    </div>
                    <button onClick={handleRefill} className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-black animate-pulse">구조 요청</button>
                </div>
            )}
            <div className="px-5 mt-6">
                <h3 className="text-sm font-black text-zinc-500 mb-4 uppercase">Predict History</h3>
                {user.portfolio.map(item => (
                    <div key={item.id} className="bg-zinc-900 rounded-xl p-4 mb-3 border border-zinc-800 flex justify-between items-center">
                        <div>
                             <h4 className="font-bold text-sm text-white mb-1">{item.marketTitle}</h4>
                             <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${item.prediction === 'YES' ? 'bg-blue-900 text-blue-400' : 'bg-red-900 text-red-400'}`}>{item.prediction}에 {formatNumber(item.amount)} VP</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex justify-center selection:bg-zzic selection:text-black">
      <div className="w-full max-w-md border-x border-zinc-900 min-h-screen relative shadow-2xl">
        {view === 'HOME' && renderHome()}
        {view === 'DETAIL' && renderDetail()}
        {view === 'PROFILE' && renderProfile()}
        
        <BottomNav currentView={view} onChangeView={setView} />

        {/* Billboard Modal */}
        {showBillboardModal && (
            <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-zinc-900 w-full max-w-sm rounded-3xl p-6 border border-zinc-800">
                    <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2"><Megaphone size={20} className="text-zzic"/> Burning Billboard</h3>
                    <p className="text-xs text-zinc-500 mb-6">전체 사용자에게 메시지를 띄웁니다. (1,000 VP 소모)</p>
                    <input 
                        value={billboardText}
                        onChange={e => setBillboardText(e.target.value)}
                        placeholder="하고 싶은 말을 적어주세요!"
                        className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-4 focus:border-zzic outline-none"
                    />
                    <div className="flex gap-2">
                        <button onClick={() => setShowBillboardModal(false)} className="flex-1 py-3 rounded-xl bg-zinc-800 text-white font-bold text-sm">취소</button>
                        <button onClick={handlePostBillboard} className="flex-1 py-3 rounded-xl bg-zzic text-black font-black text-sm hover:bg-[#b3e600]">등록 (-1,000)</button>
                    </div>
                </div>
            </div>
        )}

        {/* Auth Screen Overlay */}
        {view === 'AUTH' && <AuthScreen onLogin={(u) => { setUser(u); setView('HOME'); }} onClose={() => setView('HOME')} language={language} />}
        
        {/* Share Modal */}
        {lastPurchasedItem && <ShareModal item={lastPurchasedItem} onClose={() => { setLastPurchasedItem(null); setView('PROFILE'); }} language={language} />}
      </div>
    </div>
  );
};

export default App;