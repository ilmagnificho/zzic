import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, TrendingUp, Wallet, Clock, Trophy, User, MessageSquare, Send, Crown, Info, ChevronRight, Flame, PlusCircle, LogOut, Mail, Lock, X, Zap, AlertCircle, LogIn, Globe, LayoutGrid, Search, Home } from 'lucide-react';
import { Market, UserState, ViewState, PortfolioItem, Comment, MarketSuggestion, Category } from './types';
import { INITIAL_BALANCE, INITIAL_MARKETS, CATEGORY_COLORS, MOCK_COMMENTS, MOCK_RANKING } from './constants';
import BottomNav from './components/BottomNav';
import ShareModal from './components/ShareModal';
import { supabase } from './lib/supabase';
import { TRANSLATIONS, Language } from './translations';

// --- Helper Components ---

const isSupabaseConnected = !supabase['supabaseUrl']?.includes('placeholder');

const DBWarningBanner = () => {
    if (isSupabaseConnected) return null;
    return (
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 text-center">
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide flex items-center justify-center gap-2">
                <AlertCircle size={12} />
                데이터베이스 연결 안됨 (데모 모드)
            </p>
        </div>
    );
};

const AuthScreen: React.FC<{ onLogin: (user: UserState) => void; onClose: () => void; language: Language }> = ({ onLogin, onClose, language }) => {
    const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const t = (key: keyof typeof TRANSLATIONS['ko']) => TRANSLATIONS[language][key];

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!isSupabaseConnected) {
            alert("DB 연결이 설정되지 않았습니다. (Demo Mode)");
            // 데모용 강제 로그인
            onLogin({
                id: 'demo_' + Date.now(),
                name: name || 'DemoUser',
                email: email,
                balance: INITIAL_BALANCE,
                portfolio: [],
                isGuest: false
            });
            onClose();
            setLoading(false);
            return;
        }

        try {
            if (mode === 'SIGNUP') {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { name: name || email.split('@')[0] }
                    }
                });
                if (error) throw error;
                
                // Supabase에서 이메일 인증이 필수인 경우 data.session은 null입니다.
                if (data.session) {
                    alert(t('msg_signup_success'));
                    onClose();
                } else {
                    alert(t('msg_email_verification'));
                    // 인증 대기 상태이므로 모달을 닫고 메일 확인을 유도하거나, 모달을 유지할 수 있습니다.
                    // 여기서는 모달을 닫아줍니다.
                    onClose();
                }
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
                onClose();
            }
        } catch (error: any) {
            console.error("Auth Error:", error);
            let msg = t('alert_error');
            if (error.message.includes('User already registered')) msg = t('msg_email_exist');
            if (error.message.includes('Invalid login credentials')) msg = t('msg_login_fail');
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGuest = () => {
        onLogin({
            id: 'guest_' + Date.now(),
            name: t('profile_guest'),
            balance: INITIAL_BALANCE,
            portfolio: [],
            isGuest: true
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            {/* ZZIC Ambience */}
            <div className="absolute top-[-10%] right-[-30%] w-[100%] h-[60%] bg-zzic blur-[150px] opacity-20 rounded-full pointer-events-none"></div>
            
            {/* Close Button */}
            <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white z-50">
                <X size={28} />
            </button>

            <div className="relative z-10 w-full max-w-sm mx-auto p-4">
                <div className="mb-12 text-center">
                    <h1 className="text-7xl font-black italic tracking-tighter text-white mb-2" style={{ textShadow: '0 0 20px rgba(204,255,0,0.3)' }}>
                        ZZIC
                    </h1>
                    <p className="text-zzic font-bold text-lg tracking-widest uppercase">Trust Your ZZIC</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
                    <div className="flex gap-4 mb-8">
                        <button 
                            onClick={() => setMode('LOGIN')}
                            className={`flex-1 pb-2 text-sm font-black uppercase tracking-wider transition-all border-b-2 ${mode === 'LOGIN' ? 'text-white border-zzic' : 'text-zinc-600 border-zinc-800'}`}
                        >
                            {t('login')}
                        </button>
                        <button 
                             onClick={() => setMode('SIGNUP')}
                             className={`flex-1 pb-2 text-sm font-black uppercase tracking-wider transition-all border-b-2 ${mode === 'SIGNUP' ? 'text-white border-zzic' : 'text-zinc-600 border-zinc-800'}`}
                        >
                            {t('signup')}
                        </button>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {mode === 'SIGNUP' && (
                             <div className="relative group">
                                <User size={18} className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-zzic transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder={t('nickname')}
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
                                placeholder={t('email')}
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
                                placeholder={t('password')}
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
                            {loading ? 'Processing...' : (mode === 'LOGIN' ? t('auth_login_btn') : t('auth_signup_btn'))}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px bg-zinc-800 flex-1"></div>
                        <span className="text-[10px] text-zinc-600 font-bold uppercase">{t('auth_social')}</span>
                        <div className="h-px bg-zinc-800 flex-1"></div>
                    </div>

                    <div className="space-y-3">
                        <button 
                            type="button"
                            onClick={() => alert(t('auth_google_alert'))}
                            className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            Google
                        </button>
                        <button 
                            onClick={handleGuest}
                            className="w-full bg-zinc-800 text-zinc-400 font-bold py-3 rounded-xl hover:bg-zinc-700 transition-colors text-sm"
                        >
                            {t('auth_guest')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SuggestModal: React.FC<{ onClose: () => void; language: Language }> = ({ onClose, language }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<Category>('ENTER');
    const [desc, setDesc] = useState('');

    const t = (key: keyof typeof TRANSLATIONS['ko']) => TRANSLATIONS[language][key];

    const handleSubmit = () => {
        alert(t('msg_suggest_thankyou') + `\n\n[${category}] ${title}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
             <div className="w-full max-w-sm bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl p-6 relative">
                 <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={20}/></button>
                 <h2 className="text-2xl font-black italic text-white mb-1">{t('suggest_title')}</h2>
                 <p className="text-xs text-zinc-500 mb-6 font-bold uppercase tracking-wide">{t('suggest_subtitle')}</p>

                 <div className="space-y-4">
                     <div>
                         <label className="block text-[10px] font-black text-zzic mb-2 uppercase">{t('suggest_category')}</label>
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
                         <label className="block text-[10px] font-black text-zzic mb-2 uppercase">{t('suggest_input_title')}</label>
                         <input 
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-zzic font-bold"
                            placeholder={t('suggest_input_title') + "..."}
                         />
                     </div>
                     <div>
                         <label className="block text-[10px] font-black text-zzic mb-2 uppercase">{t('suggest_input_desc')}</label>
                         <textarea 
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-zzic h-24 resize-none font-medium"
                            placeholder={t('suggest_input_desc')}
                         />
                     </div>

                     <button 
                        onClick={handleSubmit}
                        disabled={!title.trim()}
                        className="w-full bg-zzic text-black font-black py-4 rounded-xl mt-2 disabled:opacity-50 uppercase tracking-wide hover:bg-[#b3e600]"
                     >
                         {t('suggest_btn')}
                     </button>
                 </div>
             </div>
        </div>
    );
};

// --- Desktop Components ---

const DesktopSidebar: React.FC<{ 
    currentView: ViewState; 
    onChangeView: (v: ViewState) => void; 
    onOpenSuggest: () => void;
    user: UserState | null;
    language: Language;
    toggleLanguage: () => void;
}> = ({ currentView, onChangeView, onOpenSuggest, user, language, toggleLanguage }) => {
    
    const t = (key: keyof typeof TRANSLATIONS['ko']) => TRANSLATIONS[language][key];

    const menuItems = [
        { id: 'HOME', label: '홈', icon: Home },
        { id: 'RANKING', label: t('ranking_title').split(' ')[0], icon: Trophy },
        { id: 'PROFILE', label: t('profile_title'), icon: User },
    ];

    return (
        <div className="flex flex-col h-full pl-4 pr-6">
            <div className="mb-10 pl-4">
                 <h1 className="text-4xl font-black italic tracking-tighter text-white cursor-pointer hover:text-zzic transition-colors" onClick={() => onChangeView('HOME')}>
                    ZZIC
                 </h1>
                 <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-1">Predict The Future</p>
            </div>

            <nav className="flex-1 space-y-4">
                {menuItems.map((item) => {
                    const isActive = currentView === item.id || (item.id === 'HOME' && currentView === 'DETAIL');
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onChangeView(item.id as ViewState)}
                            className={`flex items-center gap-4 px-4 py-4 rounded-2xl w-full transition-all group ${
                                isActive 
                                ? 'bg-zzic text-black font-black' 
                                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                            }`}
                        >
                            <Icon size={24} className={isActive ? 'text-black' : 'group-hover:text-zzic transition-colors'} strokeWidth={isActive ? 3 : 2}/>
                            <span className="text-lg tracking-tight">{item.label}</span>
                        </button>
                    )
                })}
                 <button 
                    onClick={onOpenSuggest}
                    className="flex items-center gap-4 px-4 py-4 rounded-2xl w-full text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all group"
                >
                    <PlusCircle size={24} className="group-hover:text-zzic transition-colors" />
                    <span className="text-lg tracking-tight font-bold">주제 제안</span>
                </button>
            </nav>

            <div className="mt-auto space-y-4">
                <button 
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 text-zinc-500 font-bold text-xs px-4 hover:text-white transition-colors"
                >
                    <Globe size={14} />
                    {language === 'ko' ? '한국어 / English' : 'English / 한국어'}
                </button>

                {user && (
                    <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-black border border-zinc-700 flex items-center justify-center text-zinc-400">
                             <User size={18} />
                         </div>
                         <div className="flex-1 min-w-0">
                             <div className="text-sm font-bold text-white truncate">{user.name}</div>
                             <div className="text-xs text-zzic font-mono">{user.balance.toLocaleString()} VP</div>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const DesktopRightColumn: React.FC<{
    markets: Market[];
    onMarketClick: (id: string) => void;
    language: Language;
}> = ({ markets, onMarketClick, language }) => {
    return (
        <div className="h-full pl-6 pr-4 overflow-y-auto no-scrollbar">
            {/* Search (Dummy) */}
            <div className="relative mb-8 group">
                <Search size={18} className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-zzic transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search ZZIC" 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-3 pl-11 pr-4 text-white focus:outline-none focus:border-zzic transition-all placeholder:text-zinc-600 font-bold text-sm"
                />
            </div>

            <div className="bg-zinc-900/50 rounded-3xl p-5 border border-zinc-800 mb-6">
                <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wide flex items-center gap-2">
                    <TrendingUp size={16} className="text-zzic" /> Trending
                </h3>
                <div className="space-y-4">
                    {markets.slice(0, 3).map((m, i) => (
                        <div key={m.id} onClick={() => onMarketClick(m.id)} className="flex items-center gap-3 cursor-pointer group">
                             <span className="text-zinc-700 font-black italic text-lg w-4">{i + 1}</span>
                             <div className="flex-1 min-w-0">
                                 <div className="text-[10px] text-zinc-500 font-bold mb-0.5">{m.category}</div>
                                 <div className="text-sm font-bold text-zinc-300 truncate group-hover:text-zzic transition-colors">
                                    {language === 'en' ? (m.titleEn || m.title) : m.title}
                                 </div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-[10px] text-zinc-600 font-medium leading-relaxed px-2">
                <p>© 2024 ZZIC Inc.</p>
                <div className="flex gap-2 mt-1">
                    <span className="hover:text-zinc-400 cursor-pointer">Privacy</span>
                    <span className="hover:text-zinc-400 cursor-pointer">Terms</span>
                    <span className="hover:text-zinc-400 cursor-pointer">More</span>
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
  
  // Localization State
  const [language, setLanguage] = useState<Language>('ko');
  const t = (key: keyof typeof TRANSLATIONS['ko']) => TRANSLATIONS[language][key];
  
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

  // Auth & Profile Listener
  useEffect(() => {
    // 1. 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) fetchProfile(session.user.id);
    });

    // 2. Auth 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
            fetchProfile(session.user.id);
        } else {
            // 게스트가 아닌 경우만 로그아웃 처리
            setUser(prev => prev?.isGuest ? prev : null);
        }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
      // Demo mode check
      if (!isSupabaseConnected && userId.startsWith('demo_')) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
          setUser({
              id: data.id,
              email: data.email,
              name: data.name,
              balance: data.balance,
              portfolio: data.portfolio || [],
              isGuest: false
          });
      }
  };
  
  // Simulate price fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets(prevMarkets => 
        prevMarkets.map(m => {
          const change = (Math.random() - 0.5) * 2; 
          let newPrice = m.yesPrice + change;
          if (newPrice > 98) newPrice = 98;
          if (newPrice < 2) newPrice = 2;
          
          return {
            ...m,
            yesPrice: Number(newPrice.toFixed(1))
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // --- Helpers ---

  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercent = (num: number) => num.toFixed(1);
  const toggleLanguage = () => setLanguage(prev => prev === 'ko' ? 'en' : 'ko');

  const getMultiplier = (price: number, type: 'YES' | 'NO') => {
    const p = type === 'YES' ? price : 100 - price;
    if (p <= 0) return 0;
    return 100 / p;
  };

  const handlePredict = async () => {
    if (!user) {
        setView('AUTH');
        return;
    }
    const market = markets.find(m => m.id === activeMarketId);
    if (!market) return;
    
    // Safety check for invalid amount
    if (betAmount <= 0) {
        alert(t('msg_bet_amount_error'));
        return;
    }

    // 1. Double Check Balance (Server Side Fetch)
    if (!user.isGuest) {
        if (isSupabaseConnected && !user.id.startsWith('demo_')) {
             const { data: currentProfile, error } = await supabase
                .from('profiles')
                .select('balance')
                .eq('id', user.id)
                .single();

            if (error || !currentProfile) {
                alert(t('alert_server_error'));
                return;
            }

            if (currentProfile.balance < betAmount) {
                alert(t('msg_insufficient'));
                fetchProfile(user.id);
                return;
            }
        } else {
             // Demo user check
             if (user.balance < betAmount) {
                 alert(t('msg_insufficient'));
                 return;
             }
        }
    } else {
        if (user.balance < betAmount) {
            alert(t('msg_insufficient'));
            return;
        }
    }

    const price = selectedPrediction === 'YES' ? market.yesPrice : (100 - market.yesPrice);
    const multiplier = getMultiplier(market.yesPrice, selectedPrediction);

    const newItem: PortfolioItem = {
        id: Date.now().toString(),
        marketId: market.id,
        marketTitle: language === 'en' ? (market.titleEn || market.title) : market.title,
        prediction: selectedPrediction,
        amount: betAmount,
        entryPrice: price,
        payoutMultiple: multiplier,
        timestamp: Date.now()
    };

    // Optimistic Update (UI 즉시 반영)
    const updatedUser = {
        ...user,
        balance: user.balance - betAmount,
        portfolio: [newItem, ...user.portfolio]
    };
    setUser(updatedUser);
    setLastPurchasedItem(newItem);

    // Database Update (if not guest/demo)
    if (!user.isGuest && isSupabaseConnected && !user.id.startsWith('demo_')) {
        const { error } = await supabase
            .from('profiles')
            .update({
                balance: updatedUser.balance,
                portfolio: updatedUser.portfolio
            })
            .eq('id', user.id);
        
        if (error) {
            console.error("DB Update Failed:", error);
            alert(t('alert_save_fail'));
            fetchProfile(user.id);
        }
    }
  };

  const handleAddComment = () => {
    if (!user) {
        if(confirm(t('msg_comment_login'))) {
            setView('AUTH');
        }
        return;
    }
    if (!newCommentText.trim() || !activeMarketId) return;
    
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

  const handleLogout = async () => {
      if(confirm(t('msg_logout_confirm'))) {
          if (!user?.isGuest && isSupabaseConnected && !user?.id.startsWith('demo_')) {
              await supabase.auth.signOut();
          }
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
    <div className="pb-24 md:pb-0 animate-in fade-in duration-500">
      {/* Header (Only on Mobile) */}
      <div className="md:hidden px-6 py-5 flex justify-between items-center sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900">
        <h1 
            className="text-2xl font-black italic tracking-tighter text-white cursor-pointer" 
            style={{ textShadow: '0 0 10px rgba(204,255,0,0.5)' }}
            onClick={() => setView('HOME')}
        >
          ZZIC
        </h1>
        <div className="flex gap-3">
             {/* Language Toggle */}
            <button 
                onClick={toggleLanguage}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:border-white transition-colors text-xs font-black"
            >
                {language === 'ko' ? 'EN' : 'KO'}
            </button>

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
                    <span className="text-xs font-black text-black uppercase">{t('auth_login_signup')}</span>
                </button>
            )}
        </div>
      </div>
      
      {/* Desktop Header Replacement (Title bar inside feed) */}
      <div className="hidden md:flex px-6 py-4 sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900 justify-between items-center">
         <h2 className="text-xl font-bold text-white">Home</h2>
         <div className="flex items-center gap-2">
            {!user && (
                 <button 
                    onClick={() => setView('AUTH')}
                    className="flex items-center gap-2 bg-white text-black px-4 py-1.5 rounded-full hover:bg-zinc-200 transition-colors"
                >
                    <span className="text-xs font-black uppercase">Login</span>
                </button>
            )}
         </div>
      </div>

      <DBWarningBanner />

      {/* Featured Banner */}
      <div className="px-5 mt-6 mb-8">
        <div onClick={() => setView('RANKING')} className="relative w-full aspect-[2/1] rounded-[2rem] overflow-hidden bg-zinc-900 group cursor-pointer border border-zinc-800">
            {/* Texture Overlay */}
            <div className="absolute inset-0 z-10 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            
            <img src="https://picsum.photos/800/400?random=banner" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700 grayscale mix-blend-luminosity" alt="Banner" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-zzic text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">{t('home_event')}</span>
                    <span className="text-zzic text-xs font-bold flex items-center gap-1 drop-shadow-md">
                        <Flame size={12} className="animate-pulse fill-zzic"/> {t('home_prize')}
                    </span>
                </div>
                <h2 className="text-3xl font-black text-white leading-none tracking-tighter italic uppercase">
                    {t('home_banner_1')}<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">{t('home_banner_2')}</span>
                </h2>
            </div>
        </div>
      </div>

      {/* Market List */}
      <div className="px-5 space-y-4">
        <h3 className="text-base font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
            <TrendingUp size={18} className="text-zzic" />
            {t('home_trending')}
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
                            <span>{market.endDate} {t('home_close')}</span>
                        </div>
                        
                        <h4 className="text-[15px] font-bold text-white leading-snug line-clamp-2 pr-1 group-hover:text-zzic transition-colors">
                            {language === 'en' ? (market.titleEn || market.title) : market.title}
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
        
        {/* Suggestion Button (Mobile Only in feed flow) */}
        <button 
            onClick={() => setShowSuggestModal(true)}
            className="md:hidden w-full py-5 mt-6 rounded-3xl border border-dashed border-zinc-700 bg-transparent text-zinc-500 font-bold text-sm flex items-center justify-center gap-2 hover:border-zzic hover:text-zzic transition-all uppercase tracking-wide"
        >
            <PlusCircle size={18} />
            {t('home_new_topic')}
        </button>
      </div>

      {/* Footer Disclaimer */}
      <div className="px-6 py-12 mt-8 text-center border-t border-zinc-900 bg-black">
        <div className="flex justify-center items-center gap-2 text-zinc-600 mb-2">
            <AlertCircle size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{t('home_disclaimer_title')}</span>
        </div>
        <p className="text-[10px] text-zinc-700 leading-relaxed break-keep whitespace-pre-wrap">
            {t('home_disclaimer')}
        </p>
        <p className="text-[10px] text-zinc-800 font-black mt-4 uppercase tracking-[0.2em]">
            © 2024 ZZIC. All Rights Reserved.
        </p>
      </div>
    </div>
  );

  const renderRanking = () => (
    <div className="pb-24 md:pb-0 animate-in slide-in-from-bottom-4 duration-500">
        <div className="px-5 py-6 sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900">
            <div className="flex items-center gap-3">
                 <button onClick={() => setView('HOME')} className="md:hidden p-2 -ml-2 rounded-full hover:bg-zinc-900 text-white transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-black italic text-white tracking-tighter uppercase">{t('ranking_title')}</h1>
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
        </div>
    </div>
  );

  const renderDetail = () => {
    if (!activeMarket) return null;

    const currentMultiplier = getMultiplier(activeMarket.yesPrice, selectedPrediction);
    const potentialReturn = Math.floor(betAmount * currentMultiplier);
    const marketTitle = language === 'en' ? (activeMarket.titleEn || activeMarket.title) : activeMarket.title;

    return (
        <div className="pb-24 md:pb-0 min-h-screen animate-in slide-in-from-right duration-300">
            {/* Nav */}
            <div className="px-4 py-4 flex items-center sticky top-0 bg-black/90 backdrop-blur-xl z-50 border-b border-zinc-900">
                <button onClick={() => setView('HOME')} className="p-2 -ml-2 rounded-full hover:bg-zinc-900 text-white transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <span className="ml-2 font-black text-lg tracking-wide uppercase italic">{t('detail_nav')}</span>
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
                    <h2 className="text-2xl font-black text-center leading-snug mb-3 text-white relative z-10 max-w-[80%] break-keep">
                        {marketTitle}
                    </h2>
                    <p className="text-zinc-500 text-xs font-bold flex items-center gap-1 relative z-10 uppercase tracking-wide">
                        <Clock size={12}/> {activeMarket.endDate} {t('detail_result')}
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
                            <span className="block text-[10px] font-bold opacity-60 mb-1 uppercase tracking-wider">YES {t('detail_prob')}</span>
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
                             <span className="block text-[10px] font-bold opacity-60 mb-1 uppercase tracking-wider">NO {t('detail_prob')}</span>
                             <span className="text-3xl italic">{formatPercent(100 - activeMarket.yesPrice)}%</span>
                        </button>
                    </div>

                    {/* Amount Slider */}
                    {user ? (
                        <div className="mb-8">
                            <div className="flex justify-between text-sm mb-4 items-end">
                                <span className="text-zinc-500 font-bold uppercase text-xs tracking-wider">{t('detail_bet_amount')}</span>
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
                                <span>{t('detail_min')} 100</span>
                                <span>{t('detail_max')} {formatNumber(user.balance)}</span>
                            </div>
                        </div>
                    ) : (
                         <div className="mb-8 p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl text-center">
                             <p className="text-xs text-zinc-500 font-bold uppercase mb-2">{t('detail_login_needed')}</p>
                         </div>
                    )}

                    {/* Summary */}
                    <div className="bg-black rounded-xl p-5 mb-6 border border-zinc-800">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs text-zinc-500 font-bold uppercase">{t('detail_multiplier')}</span>
                            <span className={`font-black font-mono text-lg ${selectedPrediction === 'YES' ? 'text-blue-500' : 'text-red-500'}`}>
                                x{currentMultiplier.toFixed(2)}
                            </span>
                        </div>
                        <div className="w-full h-px bg-zinc-900 mb-3"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-zinc-500 font-bold uppercase">{t('detail_return')}</span>
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
                        {user ? t('detail_confirm') : t('detail_login_btn')}
                    </button>
                </div>

                {/* Comments Section */}
                <div className="border-t border-zinc-900 pt-8">
                    <h3 className="text-sm font-black text-zinc-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                        <MessageSquare size={16} />
                        {t('detail_discussion')} <span className="text-xs bg-zinc-800 text-white px-2 py-0.5 rounded-full">{marketComments.length}</span>
                    </h3>
                    
                    {/* Comment Input */}
                    <div className="flex gap-2 mb-8">
                        <input 
                            type="text" 
                            placeholder={user ? t('detail_comment_placeholder') : t('detail_comment_login_placeholder')}
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                            onClick={() => !user && confirm(t('msg_comment_login')) && setView('AUTH')}
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
                                <p className="text-zinc-700 text-sm font-bold uppercase">{t('detail_no_comments')}</p>
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
                <h2 className="text-2xl font-black text-white mb-2">{t('auth_login_required')}</h2>
                <p className="text-zinc-500 text-sm mb-8 font-medium">{t('auth_login_profile_desc')}</p>
                <button 
                    onClick={() => setView('AUTH')}
                    className="w-full max-w-xs bg-zzic text-black font-black py-4 rounded-xl uppercase tracking-wide hover:bg-[#b3e600]"
                >
                    {t('auth_login_signup')}
                </button>
            </div>
        );
    }

    return (
    <div className="pb-24 md:pb-0 animate-in fade-in duration-500">
        <div className="px-5 py-8 bg-black border-b border-zinc-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-zzic blur-[120px] opacity-10 rounded-full pointer-events-none"></div>
            
            <div className="flex justify-between items-start relative z-10">
                <h1 className="text-3xl font-black italic mb-8 uppercase text-white tracking-tight">{t('profile_title')}</h1>
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
                        <p className="text-xs text-zinc-500 bg-zinc-900 inline-block px-2 py-1 rounded font-bold uppercase">{t('profile_rookie')}</p>
                        {user.isGuest && <p className="text-xs text-yellow-500 bg-yellow-500/10 inline-block px-2 py-1 rounded font-bold uppercase">{t('profile_guest')}</p>}
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 relative z-10 overflow-hidden group">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="flex items-center gap-2 mb-2 text-zzic text-xs uppercase font-black tracking-widest">
                    <Wallet size={14} /> {t('profile_assets')}
                </div>
                <div className="text-4xl font-black text-white mb-6 tracking-tight relative z-10">
                    {formatNumber(user.balance)} <span className="text-xl text-zinc-600 font-bold">VP</span>
                </div>
                <div className="flex gap-3 relative z-10">
                    <div className="flex-1 bg-black rounded-2xl p-3 text-center border border-zinc-800">
                        <div className="text-[10px] text-zinc-500 font-bold mb-1 uppercase">{t('profile_hit_rate')}</div>
                        <div className="font-black text-white text-lg">75%</div>
                    </div>
                    <div className="flex-1 bg-black rounded-2xl p-3 text-center border border-zinc-800">
                        <div className="text-[10px] text-zinc-500 font-bold mb-1 uppercase">{t('profile_history_count')}</div>
                        <div className="font-black text-white text-lg">{user.portfolio.length}</div>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-xs text-zinc-500 flex items-start gap-3 leading-relaxed font-medium">
                 <Info size={16} className="flex-shrink-0 mt-0.5 text-zinc-600" />
                 <span>{t('profile_cache_warn')}</span>
            </div>
        </div>

        <div className="px-5 mt-8">
            <h3 className="text-base font-black text-white mb-4 uppercase tracking-wide">{t('profile_recent')}</h3>
            {user.portfolio.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-zinc-700 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
                    <Wallet size={32} className="mb-3 opacity-20"/>
                    <p className="text-sm font-bold uppercase">{t('profile_no_history')}</p>
                    <button onClick={() => setView('HOME')} className="mt-4 text-xs font-black text-zzic hover:underline uppercase">
                        {t('profile_explore')} &rarr;
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
                                <div className="text-[10px] text-zinc-600 uppercase font-black tracking-wider">{t('profile_bet_label')}</div>
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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-zzic selection:text-black flex justify-center">
      <div className="w-full max-w-7xl flex items-start justify-center gap-0 md:gap-8 md:px-4">
        
        {/* Left Sidebar (Desktop) */}
        <div className="hidden md:block w-64 sticky top-0 h-screen py-8">
            <DesktopSidebar 
                currentView={view} 
                onChangeView={setView} 
                onOpenSuggest={() => setShowSuggestModal(true)}
                user={user}
                language={language}
                toggleLanguage={toggleLanguage}
            />
        </div>

        {/* Main Content (Mobile + Desktop Center) */}
        <main className="w-full max-w-md md:max-w-lg border-x border-zinc-900 min-h-screen bg-black relative shadow-2xl">
            {view === 'HOME' && renderHome()}
            {view === 'DETAIL' && renderDetail()}
            {view === 'PROFILE' && renderProfile()}
            {view === 'RANKING' && renderRanking()}
        </main>

        {/* Right Sidebar (Desktop) */}
        <div className="hidden lg:block w-80 sticky top-0 h-screen py-8">
            <DesktopRightColumn 
                markets={markets} 
                onMarketClick={(id) => {
                    setActiveMarketId(id);
                    setView('DETAIL');
                }}
                language={language}
            />
        </div>

      </div>

      {/* Mobile Only: Bottom Nav */}
      <BottomNav currentView={view} onChangeView={setView} />
      
      {/* Modals & Overlays */}
      {view === 'AUTH' && (
          <AuthScreen 
              onLogin={(u) => {
                  setUser(u);
                  setView('HOME');
              }}
              onClose={() => setView('HOME')}
              language={language}
          />
      )}
      
      {lastPurchasedItem && (
          <ShareModal 
              item={lastPurchasedItem} 
              onClose={() => {
                  setLastPurchasedItem(null);
                  setView('PROFILE');
              }} 
              language={language}
          />
      )}

      {showSuggestModal && <SuggestModal onClose={() => setShowSuggestModal(false)} language={language} />}
    </div>
  );
};

export default App;