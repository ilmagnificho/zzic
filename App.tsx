import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, TrendingUp, Wallet, Clock, Trophy, User, MessageSquare, Send, Crown, Info, ChevronRight, Flame, PlusCircle, LogOut, Mail, Lock, X, Zap, AlertCircle, LogIn, Globe, LayoutGrid, Search, Home, MessageCircle, CornerDownRight, Sparkles, Timer, Megaphone, BatteryCharging, Gem, Heart, ThumbsUp, MoreHorizontal, LogIn as LogInIcon, Lightbulb, Calendar, ShieldCheck, Bug, Users } from 'lucide-react';
import { Market, UserState, ViewState, PortfolioItem, Comment, Category, BillboardMessage } from './types';
import { INITIAL_BALANCE, INITIAL_MARKETS, INITIAL_BILLBOARD, CATEGORY_COLORS, MOCK_COMMENTS, MOCK_RANKING, COMING_SOON_ITEMS } from './constants';
import BottomNav from './components/BottomNav';
import ShareModal from './components/ShareModal';
import { supabase } from './lib/supabase';
import { TRANSLATIONS, Language } from './translations';

// --- Helper Components & Functions ---

const isSupabaseConnected = !supabase['supabaseUrl']?.includes('placeholder');

// Hook: Countdown (Robust for long dates)
const useCountdown = (targetDate: string | undefined) => {
  const calculateTimeLeft = () => {
    if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    const target = new Date(targetDate); 
    
    if (isNaN(target.getTime())) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    
    const difference = +target - +new Date();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

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
        <div className="bg-black border-b border-zinc-900 overflow-hidden py-2 relative flex items-center h-10 shrink-0">
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
      <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
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

// --- Main App Component ---

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

  // Inputs
  const [billboardText, setBillboardText] = useState('');
  const [suggestTitle, setSuggestTitle] = useState('');
  const [suggestDesc, setSuggestDesc] = useState('');

  // --- Helpers ---
  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercent = (num: number) => num.toFixed(1);
  const toggleLanguage = () => setLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  const activeMarket = useMemo(() => markets.find(m => m.id === activeMarketId), [markets, activeMarketId]);
  
  // Countdown for active market
  const timeLeft = useCountdown(activeMarket?.endDate);

  // Handlers
  const handleRefill = () => {
    if (user && user.balance < 1000) {
        if(confirm("광고를 시청하고(Mock) 3,000 VP를 충전하시겠습니까?")) {
            setUser({ ...user, balance: user.balance + 3000 });
            alert("충전 완료! 다시 게임을 즐겨보세요.");
        }
    }
  };

  const handleLogout = () => {
      if(confirm(t('msg_logout_confirm'))) {
          setUser(null);
          setView('HOME');
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

  const handleSuggest = () => {
      if(!suggestTitle.trim()) return;
      alert(t('msg_suggest_thankyou'));
      setSuggestTitle('');
      setSuggestDesc('');
      setShowSuggestModal(false);
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
      parentId: replyToId || undefined,
      likeCount: 0,
      isLiked: false
    };

    setComments(prev => [newComment, ...prev]);
    setNewCommentText('');
    setReplyToId(null);
  };

  const handleLikeComment = (commentId: string) => {
      if (!user) return;
      setComments(prev => prev.map(c => {
          if (c.id === commentId) {
              return {
                  ...c,
                  likeCount: c.isLiked ? c.likeCount - 1 : c.likeCount + 1,
                  isLiked: !c.isLiked
              };
          }
          return c;
      }));
  };

  // --- Components ---

  const SidebarLeft = () => (
      <div className="hidden lg:flex flex-col h-[calc(100vh-2rem)] sticky top-4 gap-6 p-4 w-[280px]">
          <div onClick={() => setView('HOME')} className="cursor-pointer">
              <h1 className="text-3xl font-black italic tracking-tighter text-white hover:text-zzic transition-colors">ZZIC</h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-1">Trust Your Instinct</p>
          </div>
          
          <nav className="flex-1 space-y-2">
              <button onClick={() => setView('HOME')} className={`flex items-center gap-4 px-4 py-3 rounded-xl w-full text-left transition-all ${view === 'HOME' || view === 'DETAIL' ? 'bg-white text-black font-black' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
                  <Home size={24} /> <span className="text-lg">Home</span>
              </button>
              <button onClick={() => setView('RANKING')} className={`flex items-center gap-4 px-4 py-3 rounded-xl w-full text-left transition-all ${view === 'RANKING' ? 'bg-white text-black font-black' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
                  <Trophy size={24} /> <span className="text-lg">Ranking</span>
              </button>
              <button onClick={() => setView('PROFILE')} className={`flex items-center gap-4 px-4 py-3 rounded-xl w-full text-left transition-all ${view === 'PROFILE' ? 'bg-white text-black font-black' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
                  <User size={24} /> <span className="text-lg">Profile</span>
              </button>
              <button onClick={() => setView('ABOUT')} className={`flex items-center gap-4 px-4 py-3 rounded-xl w-full text-left transition-all ${view === 'ABOUT' ? 'bg-white text-black font-black' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
                  <Info size={24} /> <span className="text-lg">About</span>
              </button>
          </nav>

          <div className="space-y-4">
             {/* Language Switcher */}
             <button 
                onClick={toggleLanguage}
                className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition-colors text-sm font-bold"
             >
                <div className="flex items-center gap-2">
                    <Globe size={18} />
                    <span>Language</span>
                </div>
                <span className="text-xs font-mono bg-black px-2 py-0.5 rounded text-zzic">{language.toUpperCase()}</span>
             </button>

            {user ? (
                <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-black border border-zinc-700 flex items-center justify-center">
                            <User size={20} className="text-zinc-500"/>
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-bold text-white truncate">{user.name}</div>
                            <div className="text-xs text-zzic font-mono">{formatNumber(user.balance)} VP</div>
                        </div>
                    </div>
                    <button onClick={() => setShowBillboardModal(true)} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <Megaphone size={12} /> 전광판 등록
                    </button>
                    <button onClick={handleLogout} className="w-full mt-2 text-zinc-500 hover:text-white text-xs font-bold py-2 flex items-center justify-center gap-2 transition-colors">
                        <LogOut size={12} /> {t('profile_logout')}
                    </button>
                </div>
            ) : (
                <button onClick={() => setView('AUTH')} className="w-full bg-zzic text-black font-black py-3 rounded-xl uppercase tracking-wide hover:bg-[#b3e600] flex items-center justify-center gap-2">
                    <LogInIcon size={20} /> Login
                </button>
            )}
          </div>
      </div>
  );

  const SidebarRight = () => (
    <div className="hidden lg:flex flex-col h-[calc(100vh-2rem)] sticky top-4 gap-6 p-4 w-[320px]">
        {/* Search */}
        <div className="relative group">
            <Search size={18} className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-zzic transition-colors" />
            <input 
                type="text" 
                placeholder="Search Topics" 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-3 pl-11 pr-4 text-white focus:outline-none focus:border-zzic transition-all placeholder:text-zinc-600 font-bold text-sm"
            />
        </div>

        {/* Suggest Topic */}
        <button 
            onClick={() => setShowSuggestModal(true)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between group hover:border-zzic transition-all"
        >
            <div className="flex items-center gap-3">
                <div className="bg-zinc-800 p-2 rounded-lg text-zinc-400 group-hover:text-zzic transition-colors">
                    <Lightbulb size={20} />
                </div>
                <div className="text-left">
                    <div className="text-sm font-bold text-white group-hover:text-zzic transition-colors">주제 제안하기</div>
                    <div className="text-[10px] text-zinc-500">원하는 주제를 만들어보세요</div>
                </div>
            </div>
            <ChevronRight size={16} className="text-zinc-600 group-hover:text-zzic" />
        </button>

        {/* Mini Ranking */}
        <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wide flex items-center gap-2">
                <Crown size={16} className="text-zzic" /> Top Predictors
            </h3>
            <div className="space-y-3">
                {MOCK_RANKING.slice(0, 3).map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                            <span className={`font-black italic w-4 ${i===0 ? 'text-zzic' : 'text-zinc-600'}`}>{r.rank}</span>
                            <span className="font-bold text-zinc-300">{r.name}</span>
                        </div>
                        <span className="font-mono text-zinc-500">{formatNumber(r.balance)}</span>
                    </div>
                ))}
            </div>
            <button onClick={() => setView('RANKING')} className="w-full mt-4 text-xs font-bold text-zinc-500 hover:text-white py-2 border-t border-zinc-800">View All</button>
        </div>

         <div className="mt-auto text-[10px] text-zinc-600 font-medium leading-relaxed px-2">
             <p>© 2025 ZZIC Inc.</p>
             <p>{t('footer_text')}</p>
         </div>
    </div>
  );

  const CommentItem: React.FC<{ comment: Comment, depth?: number, allComments: Comment[] }> = ({ comment, depth = 0, allComments }) => {
    const replies = allComments.filter(c => c.parentId === comment.id);
    
    return (
        <div className={`animate-in fade-in slide-in-from-bottom-2 duration-300 ${depth > 0 ? 'mt-2' : 'mt-4 border-b border-zinc-900/50 pb-4 last:border-0'}`}>
            <div className="flex gap-3 relative">
               {depth > 0 && (
                   <div className="absolute -left-3 -top-3 w-3 h-6 border-b border-l border-zinc-800 rounded-bl-xl pointer-events-none"></div>
               )}

               <div className="flex flex-col items-center shrink-0">
                  <div className={`${depth > 0 ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 overflow-hidden`}>
                      <User size={depth > 0 ? 12 : 14} className="text-zinc-500"/>
                  </div>
               </div>

               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase ${comment.prediction === 'YES' ? 'text-blue-400 border-blue-400' : 'text-red-400 border-red-400'}`}>
                          {comment.prediction === 'YES' ? 'YES팀' : 'NO팀'}
                      </span>
                      <span className="text-xs font-bold text-white">{comment.userName}</span>
                      <span className="text-[10px] text-zinc-600 ml-auto">{new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  
                  <div className={`text-sm leading-relaxed font-medium break-words rounded-xl p-3 border ${comment.prediction === 'YES' ? 'bg-blue-950/10 border-blue-900/30' : 'bg-red-950/10 border-red-900/30'} text-zinc-300`}>
                      {comment.text}
                  </div>

                  <div className="flex items-center gap-4 mt-2 pl-1">
                      <button 
                          onClick={() => handleLikeComment(comment.id)}
                          className={`flex items-center gap-1.5 text-xs font-bold transition-all ${comment.isLiked ? 'text-pink-500' : 'text-zinc-500 hover:text-pink-400'}`}
                      >
                          <Heart size={14} className={comment.isLiked ? 'fill-pink-500' : ''} /> 
                          <span>{comment.likeCount}</span>
                      </button>
                      
                      {user && depth < 3 && ( 
                          <button 
                              onClick={() => setReplyToId(comment.id)}
                              className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-white transition-colors"
                          >
                              <MessageCircle size={14} /> 
                              <span>답글</span>
                          </button>
                      )}
                  </div>
               </div>
            </div>

            {replies.length > 0 && (
                <div className="pl-8">
                    {replies.map(reply => (
                        <CommentItem key={reply.id} comment={reply} depth={depth + 1} allComments={allComments} />
                    ))}
                </div>
            )}
        </div>
    );
  };

  const renderHome = () => (
    <div className="pb-24 lg:pb-0 animate-in fade-in duration-500">
      {/* Billboard */}
      <Billboard messages={billboardMsgs} />

      {/* Mobile Header */}
      <div className="lg:hidden px-5 py-4 flex justify-between items-center sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900">
        <h1 className="text-2xl font-black italic tracking-tighter text-white cursor-pointer" onClick={() => setView('HOME')}>ZZIC</h1>
        <div className="flex gap-3 items-center">
            <button onClick={toggleLanguage} className="bg-zinc-900 p-1.5 rounded-full border border-zinc-800 text-zinc-400">
                <Globe size={18} />
            </button>
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
                <button onClick={() => setView('AUTH')} className="bg-zzic px-4 py-1.5 rounded-full border border-zzic hover:bg-[#b3e600] transition-colors">
                    <span className="text-xs font-black text-black uppercase">Login</span>
                </button>
            )}
        </div>
      </div>

      {/* Desktop Header Title */}
      <div className="hidden lg:flex px-6 py-4 sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900 justify-between items-center">
         <h2 className="text-xl font-bold text-white">Home</h2>
         {user && user.balance < 1000 && (
            <button onClick={handleRefill} className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black animate-pulse shadow-lg flex items-center gap-1">
               <BatteryCharging size={12}/> Low Battery
            </button>
         )}
      </div>

      {/* Market List - Refactored for PC to be Single Column */}
      <div className="px-5 mt-6">
        <h3 className="text-base font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
            <TrendingUp size={18} className="text-zzic" />
            {t('home_trending')}
        </h3>
        
        {/* Single Column Stack for both Mobile and PC */}
        <div className="space-y-4">
            {markets.map((market) => (
                <div 
                    key={market.id}
                    onClick={() => { setActiveMarketId(market.id); setView('DETAIL'); setBetAmount(0); }}
                    className="group relative bg-zinc-900 rounded-3xl p-4 border border-zinc-800 active:scale-[0.99] transition-all cursor-pointer hover:border-zzic/50 overflow-hidden hover:bg-zinc-800/50"
                >
                    <div className="flex items-center gap-4">
                        {/* Thumbnail */}
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-black border border-zinc-800">
                            <img 
                                src={market.imageUrl} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                alt={market.title} 
                            />
                            <div className={`absolute top-0 left-0 px-2 py-0.5 text-[8px] font-black text-white rounded-br-lg ${CATEGORY_COLORS[market.category]}`}>
                                {market.category}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 py-1 flex flex-col justify-between h-24">
                            <div>
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                                        <Clock size={10} />
                                        <span>{new Date(market.endDate).getFullYear() === new Date().getFullYear() ? new Date(market.endDate).toLocaleDateString() + ' 마감' : '장기 예측'}</span>
                                    </div>
                                    <div className="w-16 h-6 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <MiniChart history={market.priceHistory} color={market.yesPrice > 50 ? 'text-blue-500' : 'text-red-500'} />
                                    </div>
                                </div>
                                
                                <h4 className="text-[16px] font-bold text-white leading-snug line-clamp-2 pr-1 group-hover:text-zzic transition-colors">
                                    {language === 'en' ? (market.titleEn || market.title) : market.title}
                                </h4>
                            </div>

                            <div>
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
                </div>
            ))}

            {/* Coming Soon Section */}
            <div className="pt-8 pb-4">
                <h3 className="text-xs font-black text-zinc-500 mb-4 flex items-center gap-2 uppercase tracking-wide pl-2">
                    <Calendar size={14} /> Coming Soon
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {COMING_SOON_ITEMS.map(item => (
                        <div key={item.id} className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4 flex flex-col justify-between h-24 relative overflow-hidden group">
                             <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/80"></div>
                             <div className="relative z-10">
                                <span className="text-[9px] font-black bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded mb-2 inline-block">NEXT SEASON</span>
                                <h4 className="text-sm font-bold text-zinc-400 leading-tight group-hover:text-white transition-colors">{item.title}</h4>
                             </div>
                             <div className="relative z-10 text-[10px] text-zinc-600 font-mono mt-auto">{item.date}</div>
                        </div>
                    ))}
                </div>
            </div>
            
             {/* Mobile Footer Disclaimer */}
             <div className="py-8 text-center px-4 lg:hidden">
                <p className="text-[10px] text-zinc-600 font-medium leading-relaxed">
                   {t('footer_text')}
                </p>
            </div>
        </div>
      </div>
    </div>
  );

  const renderDetail = () => {
    if (!activeMarket) return null;
    const tier = user ? getTier(user.balance) : null;
    
    return (
        <div className="pb-24 lg:pb-0 min-h-screen animate-in slide-in-from-right duration-300">
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
                    <h2 className="text-2xl font-black text-white leading-snug mb-2 break-keep">
                        {language === 'en' ? (activeMarket.titleEn || activeMarket.title) : activeMarket.title}
                    </h2>
                    {/* Countdown */}
                    <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full mb-4">
                        <Timer size={12} className="text-zzic animate-pulse" />
                        <span className="text-xs font-mono font-bold text-zinc-300">
                            {timeLeft.expired ? "CLOSED" : `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m left`}
                        </span>
                    </div>
                    
                    {/* Graph Area */}
                    <div className="w-full h-32 bg-zinc-900/50 rounded-xl border border-zinc-800 p-4 mb-4 relative overflow-hidden">
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
                        <span className="text-xs text-zinc-500 ml-auto font-normal">총 {comments.filter(c => c.marketId === activeMarketId).length}개 의견</span>
                    </h3>

                    {/* Input */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6 relative focus-within:border-zzic transition-colors">
                        {replyToId && (
                            <div className="flex justify-between items-center bg-zinc-800/50 px-3 py-2 rounded-lg mb-2">
                                <span className="text-xs text-zinc-400">
                                    <CornerDownRight size={12} className="inline mr-1"/>
                                    @{comments.find(c => c.id === replyToId)?.userName} 님에게 답글 작성 중
                                </span>
                                <button onClick={() => setReplyToId(null)} className="text-zinc-500 hover:text-white"><X size={14}/></button>
                            </div>
                        )}
                        <textarea 
                            placeholder={user ? "참여자만 댓글을 남길 수 있습니다 (Clean Bot 작동중)" : "로그인이 필요합니다."}
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none resize-none font-medium mb-2"
                            rows={2}
                        />
                        <div className="flex justify-end">
                            <button onClick={handleAddComment} className="bg-white text-black text-xs font-black px-4 py-2 rounded-lg hover:bg-zzic transition-colors flex items-center gap-1">
                                <Send size={12} /> {replyToId ? '답글 달기' : '전송'}
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="space-y-0">
                        {comments.filter(c => c.marketId === activeMarketId && !c.parentId).length === 0 && (
                            <div className="text-center py-8 text-zinc-600 text-xs font-bold">아직 작성된 의견이 없습니다. 첫 번째로 작성해보세요!</div>
                        )}
                        {comments.filter(c => c.marketId === activeMarketId && !c.parentId).map(comment => (
                            <CommentItem key={comment.id} comment={comment} allComments={comments.filter(c => c.marketId === activeMarketId)} />
                        ))}
                    </div>
                </div>
            </div>
             {/* Mobile Footer Disclaimer for Detail Page */}
             <div className="py-8 text-center px-4 lg:hidden">
                <p className="text-[10px] text-zinc-600 font-medium leading-relaxed">
                   {t('footer_text')}
                </p>
            </div>
        </div>
    );
  };

  const renderRanking = () => (
    <div className="pb-24 lg:pb-0 animate-in slide-in-from-bottom-4 duration-500">
        <div className="px-5 py-6 sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900 lg:hidden">
            <div className="flex items-center gap-3">
                 <button onClick={() => setView('HOME')} className="p-2 -ml-2 rounded-full hover:bg-zinc-900 text-white transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-black italic text-white tracking-tighter uppercase">{t('ranking_title')}</h1>
            </div>
        </div>
        
        {/* Desktop Header for Ranking View */}
        <div className="hidden lg:flex px-6 py-4 sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900 justify-between items-center">
            <h2 className="text-xl font-bold text-white">Ranking</h2>
        </div>

        <div className="px-5 mt-6">
            <div className="flex justify-center items-end gap-3 mb-12 pt-10 relative">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-zzic/10 blur-[80px] rounded-full pointer-events-none"></div>

                <div className="flex flex-col items-center z-10">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center mb-3 shadow-lg">
                            <User size={28} className="text-zinc-500"/>
                        </div>
                    </div>
                    <div className="text-[10px] font-black text-zinc-500 mb-2 max-w-[70px] truncate text-center uppercase tracking-wide">Silver</div>
                    <div className="w-24 h-28 bg-gradient-to-b from-zinc-800 to-black rounded-t-xl flex flex-col items-center pt-4 border-t border-zinc-700">
                        <span className="text-3xl font-black text-zinc-600 italic">2</span>
                    </div>
                </div>

                 <div className="flex flex-col items-center relative -top-4 z-20">
                    <div className="absolute -top-[60px] animate-bounce">
                        <Crown size={40} className="text-zzic fill-zzic drop-shadow-[0_0_15px_rgba(204,255,0,0.6)]" />
                    </div>
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-zinc-900 border-4 border-zzic flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(204,255,0,0.2)]">
                            <User size={40} className="text-zzic"/>
                        </div>
                    </div>
                    <div className="text-xs font-black text-zzic mb-2 max-w-[100px] truncate text-center uppercase tracking-widest">Gold</div>
                    <div className="w-28 h-40 bg-gradient-to-b from-zzic to-black rounded-t-xl flex flex-col items-center pt-4 border-t border-zzic relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        <span className="text-5xl font-black text-black italic">1</span>
                    </div>
                </div>

                <div className="flex flex-col items-center z-10">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center mb-3 shadow-lg">
                            <User size={28} className="text-zinc-500"/>
                        </div>
                    </div>
                    <div className="text-[10px] font-black text-zinc-500 mb-2 max-w-[70px] truncate text-center uppercase tracking-wide">Bronze</div>
                    <div className="w-24 h-20 bg-gradient-to-b from-zinc-800 to-black rounded-t-xl flex flex-col items-center pt-4 border-t border-zinc-700">
                        <span className="text-3xl font-black text-zinc-600 italic">3</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3 relative z-20">
                {MOCK_RANKING.map((rankUser, idx) => (
                    <div 
                        key={idx} 
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                            user && rankUser.name === user.name 
                            ? 'bg-zzic/10 border-zzic/50 shadow-[0_0_15px_rgba(204,255,0,0.1)]' 
                            : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900'
                        }`}
                    >
                        <div className="flex items-center gap-5">
                            <span className={`font-black w-6 text-center italic text-lg ${idx < 3 ? 'text-zzic' : 'text-zinc-700'}`}>
                                {rankUser.rank}
                            </span>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-black border border-zinc-800 flex items-center justify-center">
                                    <User size={16} className="text-zinc-500"/>
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-white flex items-center gap-2">
                                        {rankUser.name}
                                        {user && rankUser.name === user.name && <span className="text-[9px] bg-zzic text-black px-1.5 py-0.5 rounded font-black">ME</span>}
                                    </div>
                                    <div className="text-[10px] text-zinc-500 font-bold">{t('ranking_winrate')} {rankUser.winRate}%</div>
                                </div>
                            </div>
                        </div>
                        <div className="font-mono font-bold text-white text-sm">
                            {formatNumber(rankUser.balance)} <span className="text-zinc-600">VP</span>
                        </div>
                    </div>
                ))}
            </div>
             {/* Mobile Footer Disclaimer for Ranking Page */}
             <div className="py-8 text-center px-4 lg:hidden">
                <p className="text-[10px] text-zinc-600 font-medium leading-relaxed">
                   {t('footer_text')}
                </p>
            </div>
        </div>
    </div>
  );

  const renderAbout = () => (
    <div className="pb-24 lg:pb-0 animate-in fade-in duration-500 min-h-screen flex flex-col">
        {/* Mobile Header */}
        <div className="px-5 py-6 sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900 lg:hidden">
            <div className="flex items-center gap-3">
                 <button onClick={() => setView('HOME')} className="p-2 -ml-2 rounded-full hover:bg-zinc-900 text-white transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-black italic text-white tracking-tighter uppercase">{t('about_nav')}</h1>
            </div>
        </div>
        
        {/* Desktop Header */}
        <div className="hidden lg:flex px-6 py-4 sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900 justify-between items-center">
            <h2 className="text-xl font-bold text-white">About ZZIC</h2>
        </div>

        <div className="px-6 py-10 flex-1 flex flex-col items-center text-center">
            
            <div className="mb-8 relative">
                <div className="absolute inset-0 bg-zzic blur-[60px] opacity-20 rounded-full"></div>
                <h1 className="text-5xl font-black italic tracking-tighter text-white relative z-10">ZZIC</h1>
                <p className="text-xs text-zzic font-bold tracking-[0.3em] uppercase mt-2">{t('about_slogan')}</p>
            </div>

            <p className="text-lg font-bold text-zinc-300 mb-12 leading-relaxed max-w-sm">
                {t('about_desc_1')}<br/>
                <span className="text-white">{t('about_desc_2')}</span>
            </p>

            <div className="w-full space-y-4 max-w-md">
                {/* Card 1: No Real Money */}
                <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 text-left relative overflow-hidden group hover:border-zzic/50 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShieldCheck size={64} className="text-white"/>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2">
                            <ShieldCheck size={20} className="text-zzic"/>
                            {t('about_card_1_title')}
                        </h3>
                        <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                            {t('about_card_1_desc')}
                        </p>
                    </div>
                </div>

                {/* Card 2: Beta */}
                <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 text-left relative overflow-hidden group hover:border-yellow-500/50 transition-all">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Bug size={64} className="text-yellow-500"/>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2">
                             <Bug size={20} className="text-yellow-500"/>
                             {t('about_card_2_title')}
                        </h3>
                         <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                            {t('about_card_2_desc')}
                        </p>
                    </div>
                </div>

                 {/* Card 3: Community */}
                 <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 text-left relative overflow-hidden group hover:border-blue-500/50 transition-all">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={64} className="text-blue-500"/>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2">
                             <Users size={20} className="text-blue-500"/>
                             {t('about_card_3_title')}
                        </h3>
                         <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                            {t('about_card_3_desc')}
                        </p>
                    </div>
                </div>
            </div>

             <div className="mt-auto pt-12 pb-6">
                <p className="text-[10px] text-zinc-600 font-mono">
                    © 2025 ZZIC Inc. All rights reserved.<br/>
                    Contact: support@zzic.app
                </p>
            </div>
        </div>
    </div>
  );

  const renderProfile = () => {
    if (!user) return <div className="min-h-screen flex items-center justify-center"><button onClick={() => setView('AUTH')} className="bg-zzic px-6 py-3 rounded-xl font-black text-black">로그인하기</button></div>;
    const tier = getTier(user.balance);

    return (
        <div className="pb-24 lg:pb-0 animate-in fade-in">
            {/* Desktop Profile Header */}
             <div className="hidden lg:flex px-6 py-4 sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900 justify-between items-center">
                <h2 className="text-xl font-bold text-white">Profile</h2>
                <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-400 flex items-center gap-1">
                    <LogOut size={14} /> {t('profile_logout')}
                </button>
            </div>

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
            
            {/* Mobile Actions: Logout & About */}
            <div className="px-5 lg:hidden mb-6 flex justify-end gap-2">
                 <button onClick={() => setView('ABOUT')} className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                    <Info size={14} /> {t('profile_about_btn')}
                </button>
                 <button onClick={handleLogout} className="bg-zinc-900 border border-zinc-800 text-red-500 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                    <LogOut size={14} /> {t('profile_logout')}
                </button>
            </div>

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
             {/* Mobile Footer Disclaimer for Profile Page */}
             <div className="py-8 text-center px-4 lg:hidden">
                <p className="text-[10px] text-zinc-600 font-medium leading-relaxed">
                   {t('footer_text')}
                </p>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-zzic selection:text-black flex justify-center">
      {/* PC Layout: Fixed Width Center Feed */}
      <div className="w-full max-w-[1200px] flex items-start gap-0 lg:gap-8 justify-center min-h-screen relative shadow-2xl">
        
        {/* Left Sidebar (Fixed, 280px) */}
        <SidebarLeft />

        {/* Center Feed (Scrollable, max-600px) */}
        <main className="flex-1 w-full max-w-[600px] border-x border-zinc-900 min-h-screen bg-black relative pb-20 lg:pb-0">
            {view === 'HOME' && renderHome()}
            {view === 'DETAIL' && renderDetail()}
            {view === 'PROFILE' && renderProfile()}
            {view === 'RANKING' && renderRanking()}
            {view === 'ABOUT' && renderAbout()}
        </main>

        {/* Right Sidebar (Fixed, 320px) */}
        <SidebarRight />

        {/* Mobile Bottom Nav */}
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

        {/* Suggest Topic Modal */}
        {showSuggestModal && (
            <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-zinc-900 w-full max-w-sm rounded-3xl p-6 border border-zinc-800 relative">
                    <button onClick={() => setShowSuggestModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={20}/></button>
                    <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2"><Lightbulb size={20} className="text-zzic"/> Suggest Topic</h3>
                    <p className="text-xs text-zinc-500 mb-6">다루고 싶은 주제가 있다면 알려주세요.</p>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1 block">Title</label>
                            <input 
                                value={suggestTitle}
                                onChange={e => setSuggestTitle(e.target.value)}
                                placeholder="예: 2026 월드컵 우승국은?"
                                className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white focus:border-zzic outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1 block">Description</label>
                            <textarea 
                                value={suggestDesc}
                                onChange={e => setSuggestDesc(e.target.value)}
                                placeholder="추가 설명이 필요하다면 적어주세요."
                                className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white focus:border-zzic outline-none resize-none h-24"
                            />
                        </div>
                        <button onClick={handleSuggest} className="w-full py-3 rounded-xl bg-zzic text-black font-black text-sm hover:bg-[#b3e600]">제안하기</button>
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