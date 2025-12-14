import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, TrendingUp, Wallet, Clock, Trophy, User, MessageSquare, Send, Crown, Info, ChevronRight, Flame, PlusCircle, LogOut, Mail, Lock, X, Zap, AlertCircle, LogIn } from 'lucide-react';
import { Market, UserState, ViewState, PortfolioItem, Comment, MarketSuggestion, Category } from './types';
import { INITIAL_BALANCE, INITIAL_MARKETS, CATEGORY_COLORS, MOCK_COMMENTS, MOCK_RANKING } from './constants';
import BottomNav from './components/BottomNav';
import ShareModal from './components/ShareModal';

// --- Helper Components ---

const AuthScreen: React.FC<{ onLogin: (user: UserState) => void; onClose: () => void }> = ({ onLogin, onClose }) => {
    const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            const usersDb = JSON.parse(localStorage.getItem('zzic_users_db') || '{}');
            
            if (mode === 'SIGNUP') {
                if (usersDb[email]) {
                    alert('이미 존재하는 이메일입니다.');
                    setLoading(false);
                    return;
                }
                const newUser: UserState = {
                    id: Date.now().toString(),
                    email,
                    name: name || email.split('@')[0],
                    balance: INITIAL_BALANCE,
                    portfolio: [],
                    isGuest: false
                };
                usersDb[email] = { ...newUser, password };
                localStorage.setItem('zzic_users_db', JSON.stringify(usersDb));
                onLogin(newUser);
            } else {
                const userRecord = usersDb[email];
                if (userRecord && userRecord.password === password) {
                    const { password: _, ...userData } = userRecord;
                    onLogin(userData);
                } else {
                    alert('이메일 또는 비밀번호가 일치하지 않습니다.');
                }
            }
            setLoading(false);
        }, 800);
    };

    const handleGuest = () => {
        onLogin({
            id: 'guest_' + Date.now(),
            name: '게스트',
            balance: INITIAL_BALANCE,
            portfolio: [],
            isGuest: true
        });
    };

    return (
        <div className="min-h-screen bg-black flex flex-col justify-center px-6 relative overflow-hidden animate-in fade-in duration-500 z-[100] fixed inset-0">
            {/* ZZIC Ambience */}
            <div className="absolute top-[-10%] right-[-30%] w-[100%] h-[60%] bg-zzic blur-[150px] opacity-20 rounded-full"></div>
            
            {/* Close Button */}
            <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white z-50">
                <X size={28} />
            </button>

            <div className="relative z-10 w-full max-w-sm mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-7xl font-black italic tracking-tighter text-white mb-2" style={{ textShadow: '0 0 20px rgba(204,255,0,0.3)' }}>
                        ZZIC
                    </h1>
                    <p className="text-zzic font-bold text-lg tracking-widest uppercase">Trust Your ZZIC</p>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl">
                    <div className="flex gap-4 mb-8">
                        <button 
                            onClick={() => setMode('LOGIN')}
                            className={`flex-1 pb-2 text-sm font-black uppercase tracking-wider transition-all border-b-2 ${mode === 'LOGIN' ? 'text-white border-zzic' : 'text-zinc-600 border-zinc-800'}`}
                        >
                            로그인
                        </button>
                        <button 
                             onClick={() => setMode('SIGNUP')}
                             className={`flex-1 pb-2 text-sm font-black uppercase tracking-wider transition-all border-b-2 ${mode === 'SIGNUP' ? 'text-white border-zzic' : 'text-zinc-600 border-zinc-800'}`}
                        >
                            회원가입
                        </button>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {mode === 'SIGNUP' && (
                             <div className="relative group">
                                <User size={18} className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-zzic transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="닉네임"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-zzic transition-all placeholder:text-zinc-700 font-bold"
                                />
                            </div>
                        )}
                        <div className="relative group">
                            <Mail size={18} className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-zzic transition-colors" />
                            <input 
                                type="email" 
                                placeholder="이메일"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-zzic transition-all placeholder:text-zinc-700 font-bold"
                            />
                        </div>
                        <div className="relative group">
                            <Lock size={18} className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-zzic transition-colors" />
                            <input 
                                type="password" 
                                placeholder="비밀번호"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-zzic transition-all placeholder:text-zinc-700 font-bold"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-zzic text-black font-black uppercase tracking-wider py-4 rounded-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 hover:bg-[#b3e600]"
                        >
                            {loading ? '처리중...' : (mode === 'LOGIN' ? '로그인' : '회원가입 완료')}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px bg-zinc-800 flex-1"></div>
                        <span className="text-[10px] text-zinc-600 font-bold uppercase">소셜 계정으로 계속하기</span>
                        <div className="h-px bg-zinc-800 flex-1"></div>
                    </div>

                    <div className="space-y-3">
                        <button 
                            type="button"
                            onClick={() => alert("MVP 버전에서는 이메일 로그인을 이용해주세요.")}
                            className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            Google
                        </button>
                        <button 
                            onClick={handleGuest}
                            className="w-full bg-zinc-800 text-zinc-400 font-bold py-3 rounded-xl hover:bg-zinc-700 transition-colors text-sm"
                        >
                            게스트 모드 (체험하기)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SuggestModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<Category>('ENTER');
    const [desc, setDesc] = useState('');

    const handleSubmit = () => {
        // In a real app, send to API
        alert(`제안해주셔서 감사합니다!\n관리자 검토 후 등록됩니다.\n\n[${category}] ${title}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
             <div className="w-full max-w-sm bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl p-6 relative">
                 <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={20}/></button>
                 <h2 className="text-2xl font-black italic text-white mb-1">NEW TOPIC</h2>
                 <p className="text-xs text-zinc-500 mb-6 font-bold uppercase tracking-wide">여러분이 원하는 주제를 제안해주세요</p>

                 <div className="space-y-4">
                     <div>
                         <label className="block text-[10px] font-black text-zzic mb-2 uppercase">카테고리</label>
                         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                             {(Object.keys(CATEGORY_COLORS) as Category[]).map(cat => (
                                 <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-black border transition-colors whitespace-nowrap ${category === cat ? `bg-white text-black border-white` : 'bg-black text-zinc-500 border-zinc-800'}`}
                                 >
                                     {cat}
                                 </button>
                             ))}
                         </div>
                     </div>
                     <div>
                         <label className="block text-[10px] font-black text-zzic mb-2 uppercase">제목</label>
                         <input 
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-zzic font-bold"
                            placeholder="예: 비트코인 100K 도달"
                         />
                     </div>
                     <div>
                         <label className="block text-[10px] font-black text-zzic mb-2 uppercase">설명 (선택)</label>
                         <textarea 
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-zzic h-24 resize-none font-medium"
                            placeholder="판정 기준 등 상세 내용을 적어주세요."
                         />
                     </div>

                     <button 
                        onClick={handleSubmit}
                        disabled={!title.trim()}
                        className="w-full bg-zzic text-black font-black py-4 rounded-xl mt-2 disabled:opacity-50 uppercase tracking-wide hover:bg-[#b3e600]"
                     >
                         제안 보내기
                     </button>
                 </div>
             </div>
        </div>
    );
};

const App: React.FC = () => {
  // --- State ---
  const [user, setUser] = useState<UserState | null>(() => {
    // Check session first
    const session = localStorage.getItem('zzic_current_user');
    if (session) return JSON.parse(session);
    return null;
  });

  const [view, setView] = useState<ViewState>('HOME');
  const [activeMarketId, setActiveMarketId] = useState<string | null>(null);
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS);
  
  // Modals
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  // Comments State
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');

  // Betting State
  const [betAmount, setBetAmount] = useState<number>(100);
  const [selectedPrediction, setSelectedPrediction] = useState<'YES' | 'NO'>('YES');
  const [lastPurchasedItem, setLastPurchasedItem] = useState<PortfolioItem | null>(null);

  // --- Effects ---

  // Persist Current Session
  useEffect(() => {
    if (user) {
        localStorage.setItem('zzic_current_user', JSON.stringify(user));
    } else {
        localStorage.removeItem('zzic_current_user');
    }
  }, [user]);
  
  // Simulate price fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets(prevMarkets => 
        prevMarkets.map(m => {
          const change = (Math.random() - 0.5) * 2; // -1 to +1 change
          let newPrice = m.yesPrice + change;
          // Clamp price
          if (newPrice > 98) newPrice = 98;
          if (newPrice < 2) newPrice = 2;
          
          return {
            ...m,
            yesPrice: Number(newPrice.toFixed(1)) // Ensure 1 decimal place internally too
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // --- Helpers ---

  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercent = (num: number) => num.toFixed(1);

  const getMultiplier = (price: number, type: 'YES' | 'NO') => {
    const p = type === 'YES' ? price : 100 - price;
    if (p <= 0) return 0;
    return 100 / p;
  };

  const handlePredict = () => {
    if (!user) {
        setView('AUTH');
        return;
    }
    const market = markets.find(m => m.id === activeMarketId);
    if (!market) return;
    if (user.balance < betAmount) {
        alert("ZZIC 포인트(VP)가 부족합니다!");
        return;
    }

    const price = selectedPrediction === 'YES' ? market.yesPrice : (100 - market.yesPrice);
    const multiplier = getMultiplier(market.yesPrice, selectedPrediction);

    const newItem: PortfolioItem = {
        id: Date.now().toString(),
        marketId: market.id,
        marketTitle: market.title,
        prediction: selectedPrediction,
        amount: betAmount,
        entryPrice: price,
        payoutMultiple: multiplier,
        timestamp: Date.now()
    };

    setUser(prev => prev ? ({
        ...prev,
        balance: prev.balance - betAmount,
        portfolio: [newItem, ...prev.portfolio]
    }) : null);

    setLastPurchasedItem(newItem);
  };

  const handleAddComment = () => {
    if (!user) {
        if(confirm("댓글을 작성하려면 로그인이 필요합니다. 로그인하시겠습니까?")) {
            setView('AUTH');
        }
        return;
    }
    if (!newCommentText.trim() || !activeMarketId) return;
    
    // Check if user has bet on this market to show stance tag
    const userBet = user.portfolio.find(p => p.marketId === activeMarketId);
    const stance = userBet ? userBet.prediction : undefined;

    const newComment: Comment = {
      id: Date.now().toString(),
      marketId: activeMarketId,
      userName: user.name,
      text: newCommentText,
      timestamp: Date.now(),
      prediction: stance
    };

    setComments(prev => [newComment, ...prev]);
    setNewCommentText('');
  };

  const handleLogout = () => {
      if(confirm('ZZIC에서 로그아웃 하시겠습니까?')) {
          setUser(null);
          setView('HOME');
      }
  };

  const activeMarket = useMemo(() => 
    markets.find(m => m.id === activeMarketId), 
  [markets, activeMarketId]);

  const marketComments = useMemo(() => 
    comments.filter(c => c.marketId === activeMarketId),
  [comments, activeMarketId]);


  // --- Render Functions ---

  const renderHome = () => (
    <div className="pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <div className="px-6 py-5 flex justify-between items-center sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900">
        <h1 
            className="text-2xl font-black italic tracking-tighter text-white cursor-pointer" 
            style={{ textShadow: '0 0 10px rgba(204,255,0,0.5)' }}
            onClick={() => setView('HOME')}
        >
          ZZIC
        </h1>
        <div className="flex gap-3">
            <button 
                onClick={() => setView('RANKING')}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zzic transition-colors group"
            >
                <Trophy size={16} className="text-zinc-500 group-hover:text-zzic transition-colors"/>
            </button>
            {user ? (
                <div className="flex items-center gap-2 bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-800">
                    <div className="w-2 h-2 rounded-full bg-zzic animate-pulse"></div>
                    <span className="text-sm font-black text-white font-mono tracking-tight">{formatNumber(user.balance)} VP</span>
                </div>
            ) : (
                <button 
                    onClick={() => setView('AUTH')}
                    className="flex items-center gap-2 bg-zzic px-4 py-1.5 rounded-full border border-zzic hover:bg-[#b3e600] transition-colors"
                >
                    <span className="text-xs font-black text-black uppercase">로그인 / 가입</span>
                </button>
            )}
        </div>
      </div>

      {/* Featured Banner */}
      <div className="px-5 mt-6 mb-8">
        <div onClick={() => setView('RANKING')} className="relative w-full aspect-[2/1] rounded-[2rem] overflow-hidden bg-zinc-900 group cursor-pointer border border-zinc-800">
            {/* Texture Overlay */}
            <div className="absolute inset-0 z-10 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            
            <img src="https://picsum.photos/800/400?random=banner" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700 grayscale mix-blend-luminosity" alt="Banner" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-zzic text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">EVENT</span>
                    <span className="text-zzic text-xs font-bold flex items-center gap-1 drop-shadow-md">
                        <Flame size={12} className="animate-pulse fill-zzic"/> 총 상금 100만 VP
                    </span>
                </div>
                <h2 className="text-3xl font-black text-white leading-none tracking-tighter italic uppercase">
                    ZZIC의 신은<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">누구인가?</span>
                </h2>
            </div>
        </div>
      </div>

      {/* Market List */}
      <div className="px-5 space-y-4">
        <h3 className="text-base font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
            <TrendingUp size={18} className="text-zzic" />
            실시간 트렌딩
        </h3>
        
        {markets.map((market) => (
            <div 
                key={market.id}
                onClick={() => {
                    setActiveMarketId(market.id);
                    setView('DETAIL');
                    setBetAmount(100);
                }}
                className="group relative bg-zinc-900 rounded-3xl p-4 border border-zinc-800 active:scale-[0.98] transition-all cursor-pointer hover:border-zzic/50 overflow-hidden"
            >
                <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-black">
                         <img src={market.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0" alt="market" />
                         <div className={`absolute top-0 left-0 px-2 py-1 text-[9px] font-black text-white rounded-br-xl ${CATEGORY_COLORS[market.category]}`}>
                             {market.category}
                         </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-2 py-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                            <Clock size={10} />
                            <span>{market.endDate} 마감</span>
                        </div>
                        
                        <h4 className="text-[15px] font-bold text-white leading-snug line-clamp-2 pr-1 group-hover:text-zzic transition-colors">
                            {market.title}
                        </h4>

                        {/* Bar */}
                        <div className="mt-1">
                            <div className="flex justify-between text-[10px] font-black mb-1.5">
                                <span className="text-blue-400">YES {formatPercent(market.yesPrice)}%</span>
                                <span className="text-red-400">NO {formatPercent(100 - market.yesPrice)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-black rounded-full overflow-hidden flex">
                                <div 
                                    className="h-full bg-blue-500" 
                                    style={{ width: `${market.yesPrice}%`, transition: 'width 1s ease-in-out' }}
                                />
                                <div 
                                    className="h-full bg-red-500" 
                                    style={{ width: `${100 - market.yesPrice}%`, transition: 'width 1s ease-in-out' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="text-zinc-700 group-hover:text-zzic transition-colors">
                        <ChevronRight size={20} strokeWidth={3} />
                    </div>
                </div>
            </div>
        ))}
        
        {/* Suggestion Button */}
        <button 
            onClick={() => setShowSuggestModal(true)}
            className="w-full py-5 mt-6 rounded-3xl border border-dashed border-zinc-700 bg-transparent text-zinc-500 font-bold text-sm flex items-center justify-center gap-2 hover:border-zzic hover:text-zzic transition-all uppercase tracking-wide"
        >
            <PlusCircle size={18} />
            새로운 주제 제안하기
        </button>
      </div>

      {/* Footer Disclaimer */}
      <div className="px-6 py-12 mt-8 text-center border-t border-zinc-900 bg-black">
        <div className="flex justify-center items-center gap-2 text-zinc-600 mb-2">
            <AlertCircle size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Beta Service Disclaimer</span>
        </div>
        <p className="text-[10px] text-zinc-700 leading-relaxed break-keep">
            본 서비스는 가상 포인트(VP)를 사용하는 시뮬레이션 게임이며, 실제 금전적 이득이나 손실이 발생하지 않습니다. <br/>
            베타 서비스 기간 동안의 데이터는 예고 없이 초기화될 수 있습니다.
        </p>
        <p className="text-[10px] text-zinc-800 font-black mt-4 uppercase tracking-[0.2em]">
            © 2024 ZZIC. All Rights Reserved.
        </p>
      </div>
    </div>
  );

  const renderRanking = () => (
    <div className="pb-24 animate-in slide-in-from-bottom-4 duration-500">
        <div className="px-5 py-6 sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900">
            <div className="flex items-center gap-3">
                 <button onClick={() => setView('HOME')} className="p-2 -ml-2 rounded-full hover:bg-zinc-900 text-white transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-black italic text-white tracking-tighter uppercase">랭킹 (God of ZZIC)</h1>
            </div>
        </div>

        <div className="px-5 mt-6">
            {/* Top 3 Podium */}
            <div className="flex justify-center items-end gap-3 mb-12 pt-20 relative">
                 {/* Background Glow */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-zzic/10 blur-[80px] rounded-full pointer-events-none"></div>

                 {/* 2nd Place */}
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

                {/* 1st Place */}
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

                {/* 3rd Place */}
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

            {/* List */}
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
                                    <div className="text-[10px] text-zinc-500 font-bold">승률 {rankUser.winRate}%</div>
                                </div>
                            </div>
                        </div>
                        <div className="font-mono font-bold text-white text-sm">
                            {formatNumber(rankUser.balance)} <span className="text-zinc-600">VP</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderDetail = () => {
    if (!activeMarket) return null;

    const currentMultiplier = getMultiplier(activeMarket.yesPrice, selectedPrediction);
    const potentialReturn = Math.floor(betAmount * currentMultiplier);

    return (
        <div className="pb-24 min-h-screen animate-in slide-in-from-right duration-300">
            {/* Nav */}
            <div className="px-4 py-4 flex items-center sticky top-0 bg-black/90 backdrop-blur-xl z-50 border-b border-zinc-900">
                <button onClick={() => setView('HOME')} className="p-2 -ml-2 rounded-full hover:bg-zinc-900 text-white transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <span className="ml-2 font-black text-lg tracking-wide uppercase italic">예측하기</span>
            </div>

            <div className="px-5 pt-6">
                {/* Hero Info */}
                <div className="flex flex-col items-center mb-8 relative">
                    <div className="absolute inset-0 bg-zzic blur-[80px] opacity-10 rounded-full pointer-events-none"></div>
                     <div className="w-24 h-24 rounded-2xl bg-black overflow-hidden mb-6 shadow-2xl border border-zinc-800 relative z-10">
                         <img src={activeMarket.imageUrl} className="w-full h-full object-cover grayscale" alt="market" />
                    </div>
                    <span className={`text-[10px] font-black px-3 py-1 rounded text-white mb-3 relative z-10 ${CATEGORY_COLORS[activeMarket.category]}`}>
                        {activeMarket.category}
                    </span>
                    <h2 className="text-2xl font-black text-center leading-snug mb-3 text-white relative z-10 max-w-[80%] break-keep">{activeMarket.title}</h2>
                    <p className="text-zinc-500 text-xs font-bold flex items-center gap-1 relative z-10 uppercase tracking-wide">
                        <Clock size={12}/> {activeMarket.endDate} 결과 발표
                    </p>
                </div>

                {/* Interaction Area */}
                <div className="bg-zinc-900 rounded-[2rem] p-6 border border-zinc-800 shadow-2xl mb-8 relative overflow-hidden">
                    
                    {/* Yes/No Toggle */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <button 
                            onClick={() => setSelectedPrediction('YES')}
                            className={`relative py-6 rounded-2xl font-black text-sm transition-all duration-200 border-2 ${
                                selectedPrediction === 'YES' 
                                ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105 z-10' 
                                : 'bg-black border-zinc-800 text-zinc-600 hover:border-zinc-700'
                            }`}
                        >
                            <span className="block text-[10px] font-bold opacity-60 mb-1 uppercase tracking-wider">YES 확률</span>
                            <span className="text-3xl italic">{formatPercent(activeMarket.yesPrice)}%</span>
                        </button>
                        <button 
                            onClick={() => setSelectedPrediction('NO')}
                            className={`relative py-6 rounded-2xl font-black text-sm transition-all duration-200 border-2 ${
                                selectedPrediction === 'NO' 
                                ? 'bg-red-600 border-red-400 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] scale-105 z-10' 
                                : 'bg-black border-zinc-800 text-zinc-600 hover:border-zinc-700'
                            }`}
                        >
                             <span className="block text-[10px] font-bold opacity-60 mb-1 uppercase tracking-wider">NO 확률</span>
                             <span className="text-3xl italic">{formatPercent(100 - activeMarket.yesPrice)}%</span>
                        </button>
                    </div>

                    {/* Amount Slider */}
                    {user ? (
                        <div className="mb-8">
                            <div className="flex justify-between text-sm mb-4 items-end">
                                <span className="text-zinc-500 font-bold uppercase text-xs tracking-wider">베팅 금액</span>
                                <span className="text-white font-mono font-bold text-2xl">{formatNumber(betAmount)} VP</span>
                            </div>
                            <div className="relative h-8 flex items-center">
                                <input 
                                    type="range" 
                                    min="100" 
                                    max={user.balance} 
                                    step="100"
                                    value={betAmount}
                                    onChange={(e) => setBetAmount(Number(e.target.value))}
                                    className="absolute w-full h-4 bg-zinc-800 rounded-full appearance-none cursor-pointer z-20 opacity-0"
                                />
                                <div className="w-full h-4 bg-black border border-zinc-800 rounded-full overflow-hidden relative z-10">
                                    <div 
                                        className="h-full bg-zzic" 
                                        style={{ width: `${(betAmount / user.balance) * 100}%` }}
                                    ></div>
                                </div>
                                <div 
                                    className="absolute h-7 w-7 bg-white rounded-full shadow-lg border-4 border-black z-10 pointer-events-none transition-all"
                                    style={{ left: `calc(${(betAmount / user.balance) * 100}% - 14px)` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-zinc-600 mt-2 font-bold uppercase">
                                <span>최소 100</span>
                                <span>최대 {formatNumber(user.balance)}</span>
                            </div>
                        </div>
                    ) : (
                         <div className="mb-8 p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl text-center">
                             <p className="text-xs text-zinc-500 font-bold uppercase mb-2">투표를 하려면 로그인이 필요합니다</p>
                         </div>
                    )}

                    {/* Summary */}
                    <div className="bg-black rounded-xl p-5 mb-6 border border-zinc-800">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs text-zinc-500 font-bold uppercase">배당률</span>
                            <span className={`font-black font-mono text-lg ${selectedPrediction === 'YES' ? 'text-blue-500' : 'text-red-500'}`}>
                                x{currentMultiplier.toFixed(2)}
                            </span>
                        </div>
                        <div className="w-full h-px bg-zinc-900 mb-3"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-zinc-500 font-bold uppercase">예상 수익</span>
                            <span className="text-xl font-black text-zzic drop-shadow-[0_0_5px_rgba(204,255,0,0.5)]">
                                + {formatNumber(potentialReturn)} VP
                            </span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button 
                        onClick={handlePredict}
                        className={`w-full py-5 rounded-2xl font-black text-black text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden group uppercase tracking-wider
                        ${user ? (selectedPrediction === 'YES' 
                            ? 'bg-blue-500 hover:bg-blue-400' 
                            : 'bg-red-500 hover:bg-red-400') : 'bg-zinc-700 hover:bg-zinc-600'} text-white border-b-4 border-black/20`}
                    >
                        {user ? 'ZZIC 확정하기' : '로그인하고 ZZIC 하기'}
                    </button>
                </div>

                {/* Comments Section */}
                <div className="border-t border-zinc-900 pt-8">
                    <h3 className="text-sm font-black text-zinc-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                        <MessageSquare size={16} />
                        토론방 <span className="text-xs bg-zinc-800 text-white px-2 py-0.5 rounded-full">{marketComments.length}</span>
                    </h3>
                    
                    {/* Comment Input */}
                    <div className="flex gap-2 mb-8">
                        <input 
                            type="text" 
                            placeholder={user ? "의견을 남겨주세요..." : "로그인이 필요합니다."}
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                            onClick={() => !user && confirm("로그인이 필요합니다. 이동하시겠습니까?") && setView('AUTH')}
                            readOnly={!user}
                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-zzic transition-all placeholder:text-zinc-600 font-medium"
                        />
                        <button 
                            onClick={handleAddComment}
                            className="bg-zinc-800 text-white w-12 rounded-xl hover:bg-zzic hover:text-black transition-colors disabled:opacity-30 flex items-center justify-center"
                            disabled={!newCommentText.trim() && !!user}
                        >
                            <Send size={18} />
                        </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                        {marketComments.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-zinc-700 text-sm font-bold uppercase">아직 작성된 의견이 없습니다.</p>
                            </div>
                        ) : (
                            marketComments.map(comment => (
                                <div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center flex-shrink-0 border border-zinc-800">
                                        <User size={14} className="text-zinc-500"/>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-zinc-300">{comment.userName}</span>
                                            {comment.prediction && (
                                                <span className={`text-[9px] font-black px-1.5 py-[1px] rounded uppercase ${comment.prediction === 'YES' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-500'}`}>
                                                    {comment.prediction}
                                                </span>
                                            )}
                                            <span className="text-[10px] text-zinc-600 ml-auto font-mono">{new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        <div className="text-sm text-zinc-400 leading-relaxed bg-black/40 p-3 rounded-2xl rounded-tl-none border border-zinc-900">
                                            {comment.text}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderProfile = () => {
    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                    <User size={40} className="text-zinc-500"/>
                </div>
                <h2 className="text-2xl font-black text-white mb-2">로그인이 필요합니다</h2>
                <p className="text-zinc-500 text-sm mb-8 font-medium">나의 예측 기록과 자산을 확인하려면 로그인하세요.</p>
                <button 
                    onClick={() => setView('AUTH')}
                    className="w-full max-w-xs bg-zzic text-black font-black py-4 rounded-xl uppercase tracking-wide hover:bg-[#b3e600]"
                >
                    로그인 / 가입하기
                </button>
            </div>
        );
    }

    return (
    <div className="pb-24 animate-in fade-in duration-500">
        <div className="px-5 py-8 bg-black border-b border-zinc-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-zzic blur-[120px] opacity-10 rounded-full pointer-events-none"></div>
            
            <div className="flex justify-between items-start relative z-10">
                <h1 className="text-3xl font-black italic mb-8 uppercase text-white tracking-tight">마이 페이지</h1>
                <button onClick={handleLogout} className="p-2 bg-zinc-900 rounded-full text-zinc-500 hover:text-white transition-colors">
                    <LogOut size={16} />
                </button>
            </div>
            
            <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full border-2 border-zzic p-1">
                        <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center">
                            <User size={36} className="text-zinc-400" />
                        </div>
                    </div>
                    <div className="absolute -bottom-1 right-0 bg-zzic text-[10px] text-black px-2 py-0.5 rounded-full border border-black font-black">
                        LV.3
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                    <div className="flex gap-2">
                        <p className="text-xs text-zinc-500 bg-zinc-900 inline-block px-2 py-1 rounded font-bold uppercase">루키</p>
                        {user.isGuest && <p className="text-xs text-yellow-500 bg-yellow-500/10 inline-block px-2 py-1 rounded font-bold uppercase">게스트</p>}
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 relative z-10 overflow-hidden group">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="flex items-center gap-2 mb-2 text-zzic text-xs uppercase font-black tracking-widest">
                    <Wallet size={14} /> 총 보유 자산
                </div>
                <div className="text-4xl font-black text-white mb-6 tracking-tight relative z-10">
                    {formatNumber(user.balance)} <span className="text-xl text-zinc-600 font-bold">VP</span>
                </div>
                <div className="flex gap-3 relative z-10">
                    <div className="flex-1 bg-black rounded-2xl p-3 text-center border border-zinc-800">
                        <div className="text-[10px] text-zinc-500 font-bold mb-1 uppercase">적중률</div>
                        <div className="font-black text-white text-lg">75%</div>
                    </div>
                    <div className="flex-1 bg-black rounded-2xl p-3 text-center border border-zinc-800">
                        <div className="text-[10px] text-zinc-500 font-bold mb-1 uppercase">참여 기록</div>
                        <div className="font-black text-white text-lg">{user.portfolio.length}</div>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-xs text-zinc-500 flex items-start gap-3 leading-relaxed font-medium">
                 <Info size={16} className="flex-shrink-0 mt-0.5 text-zinc-600" />
                 <span>브라우저 캐시 삭제 시 게스트 데이터가 초기화될 수 있습니다.</span>
            </div>
        </div>

        <div className="px-5 mt-8">
            <h3 className="text-base font-black text-white mb-4 uppercase tracking-wide">최근 활동</h3>
            {user.portfolio.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-zinc-700 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
                    <Wallet size={32} className="mb-3 opacity-20"/>
                    <p className="text-sm font-bold uppercase">아직 참여 내역이 없습니다.</p>
                    <button onClick={() => setView('HOME')} className="mt-4 text-xs font-black text-zzic hover:underline uppercase">
                        시장 둘러보기 &rarr;
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {user.portfolio.map((item) => (
                        <div key={item.id} className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex justify-between items-center hover:border-zinc-600 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-1 h-12 rounded-full ${item.prediction === 'YES' ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                                <div>
                                    <div className="text-[10px] text-zinc-500 mb-1 font-mono font-bold">{new Date(item.timestamp).toLocaleDateString()}</div>
                                    <h4 className="font-bold text-sm text-gray-200 mb-1.5">{item.marketTitle}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase ${item.prediction === 'YES' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {item.prediction}
                                        </span>
                                        <span className="text-[10px] text-zinc-500 font-mono font-bold">
                                            x{item.payoutMultiple.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-black text-white text-base">{formatNumber(item.amount)} VP</div>
                                <div className="text-[10px] text-zinc-600 uppercase font-black tracking-wider">베팅액</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-zzic selection:text-black pb-safe">
      <div className="mx-auto max-w-md min-h-screen relative shadow-2xl overflow-hidden bg-black">
        
        <div className="relative z-10">
            {view === 'HOME' && renderHome()}
            {view === 'DETAIL' && renderDetail()}
            {view === 'PROFILE' && renderProfile()}
            {view === 'RANKING' && renderRanking()}
            {view === 'AUTH' && (
                <AuthScreen 
                    onLogin={(u) => {
                        setUser(u);
                        setView('HOME');
                    }}
                    onClose={() => setView('HOME')}
                />
            )}
        </div>
        
        <BottomNav currentView={view} onChangeView={setView} />
        
        {lastPurchasedItem && (
            <ShareModal 
                item={lastPurchasedItem} 
                onClose={() => {
                    setLastPurchasedItem(null);
                    setView('PROFILE');
                }} 
            />
        )}

        {showSuggestModal && <SuggestModal onClose={() => setShowSuggestModal(false)} />}
      </div>
    </div>
  );
};

export default App;