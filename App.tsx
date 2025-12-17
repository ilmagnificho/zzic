import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, TrendingUp, Wallet, Clock, Trophy, User, MessageSquare, Send, Crown, Info, ChevronRight, Flame, PlusCircle, LogOut, Mail, Lock, X, Zap, AlertCircle, Globe, LayoutGrid, Search, Home, MessageCircle, CornerDownRight, Sparkles, Timer, Megaphone, BatteryCharging, Gem, Heart, ThumbsUp, MoreHorizontal, LogIn as LogInIcon, Lightbulb, Calendar, ShieldCheck, Bug, Users, Snowflake, Rocket } from 'lucide-react';
import { Market, UserState, ViewState, PortfolioItem, Comment, Category, BillboardMessage } from './types';
import { INITIAL_BALANCE, INITIAL_MARKETS, INITIAL_BILLBOARD, CATEGORY_COLORS, MOCK_COMMENTS, MOCK_RANKING, COMING_SOON_ITEMS } from './constants';
import BottomNav from './components/BottomNav';
import ShareModal from './components/ShareModal';
import { supabase } from './lib/supabase';
import { TRANSLATIONS, Language } from './translations';

// --- Helper Functions (Module Scope) ---
const formatNumber = (num: number) => num.toLocaleString();
const formatPercent = (num: number) => num.toFixed(1);

// --- Robust Logo Component ---
const LogoImage: React.FC<{ className?: string }> = ({ className }) => {
    const [error, setError] = useState(false);
    if (error) return <div className={className}></div>;
    return (
        <img 
            src="/ZZIC_Favicon.png" 
            alt="ZZIC" 
            className={`${className} object-cover`}
            onError={() => setError(true)}
        />
    );
};

// --- Hook: Countdown ---
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

// --- Tier Logic ---
const getTier = (balance: number) => {
    if (balance > 50000) return { name: 'CHALLENGER', icon: Gem, color: 'text-cyan-400', bg: 'bg-cyan-950/30 border-cyan-500/50' };
    if (balance > 20000) return { name: 'GOLD', icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-950/30 border-yellow-500/50' };
    if (balance > 5000) return { name: 'SILVER', icon: Zap, color: 'text-zinc-300', bg: 'bg-zinc-800/50 border-zinc-500/50' };
    return { name: 'BRONZE', icon: User, color: 'text-orange-700', bg: 'bg-orange-950/30 border-orange-800/50' };
};

// --- SVG Line Chart ---
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
            <polyline fill="none" stroke="currentColor" strokeWidth="2" points={points} className={color} strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx={width} cy={height - ((history[history.length-1] - min) / (max - min)) * height} r="3" className={`${color} fill-current`} />
        </svg>
    );
};

// --- Billboard Component ---
const Billboard: React.FC<{ messages: BillboardMessage[] }> = ({ messages }) => (
    <div className="bg-black border-b border-zinc-900 overflow-hidden py-2 relative flex items-center h-10 shrink-0">
        <div className="absolute left-0 z-10 bg-gradient-to-r from-black to-transparent w-4 h-full"></div>
        <div className="absolute right-0 z-10 bg-gradient-to-l from-black to-transparent w-4 h-full"></div>
        <div className="whitespace-nowrap flex gap-8 animate-marquee pl-4">
            {[...messages, ...messages].map((msg, i) => (
                <span key={`${msg.id}-${i}`} className={`text-xs font-bold ${msg.color} flex items-center gap-2`}>
                    <span className="opacity-70 text-[10px] border border-zinc-800 px-1 rounded uppercase">{msg.sender}</span>
                    {msg.text}
                </span>
            ))}
        </div>
        <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-marquee { animation: marquee 20s linear infinite; }`}</style>
    </div>
);

// --- Auth Screen Component ---
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
          <h2 className="text-2xl font-black text-white mb-2 text-center italic uppercase tracking-tighter">
            {isLogin ? t('login') : t('signup')}
          </h2>
          <p className="text-center text-zinc-500 text-xs mb-8">로그인하면 기록이 영구 저장됩니다.</p>
           <button 
              onClick={handleGuest}
              className="w-full bg-white text-black font-black py-4 rounded-xl mb-6 hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
              <Rocket size={20} className="text-blue-600" />
              <span>3초만에 게스트로 시작하기</span>
          </button>
          <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-900 px-2 text-zinc-500 font-bold">Or Email Login</span></div>
          </div>
          <div className="space-y-4 opacity-80 hover:opacity-100 transition-opacity">
              <div>
                  <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white focus:border-zzic outline-none transition-colors"
                      placeholder="user@example.com"
                  />
              </div>
               <div>
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
                  className="w-full bg-zinc-800 text-zinc-400 font-bold py-3 rounded-xl hover:text-white hover:bg-zinc-700 transition-colors uppercase"
              >
                  {isLogin ? t('auth_login_btn') : t('auth_signup_btn')}
              </button>
          </div>
          <div className="mt-6 text-center">
              <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-xs text-zinc-500 hover:text-white underline decoration-zinc-700 underline-offset-4"
              >
                  {isLogin ? t('auth_toggle_msg_signup') : t('auth_toggle_msg_login')}
              </button>
          </div>
        </div>
      </div>
    );
};

// --- Independent Components (Fixing React2shell Vulnerability) ---

interface SidebarProps {
    view: ViewState;
    setView: (view: ViewState) => void;
    user?: UserState | null;
    language: Language;
    toggleLanguage?: () => void;
    handleLogout?: () => void;
    setShowBillboardModal?: (show: boolean) => void;
    setShowSuggestModal?: (show: boolean) => void;
    t: (key: keyof typeof TRANSLATIONS['ko']) => string;
}

const SidebarLeft: React.FC<SidebarProps> = ({ view, setView, user, language, toggleLanguage, handleLogout, setShowBillboardModal, t }) => (
    <div className="hidden lg:flex flex-col h-[calc(100vh-2rem)] sticky top-4 gap-6 p-4 w-[280px]">
        <div onClick={() => setView('HOME')} className="cursor-pointer group">
            <div className="flex items-center gap-0">
                <div>
                  <h1 className="text-3xl font-black italic tracking-tighter text-white group-hover:text-zzic transition-colors leading-none">ZZIC</h1>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Trust Your Instinct</p>
                </div>
            </div>
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
           <button onClick={toggleLanguage} className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition-colors text-sm font-bold">
              <div className="flex items-center gap-2"><Globe size={18} /><span>Language</span></div>
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
                  <button 
                      onClick={() => setShowBillboardModal?.(true)} 
                      className="w-full bg-gradient-to-r from-zzic to-lime-400 text-black font-black py-3 rounded-xl transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2 group relative overflow-hidden"
                  >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                      <Megaphone size={16} className="fill-black" /> 
                      <span className="relative z-10">{t('sidebar_billboard_btn')}</span>
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

const SidebarRight: React.FC<SidebarProps> = ({ view, setView, setShowSuggestModal, t }) => (
  <div className="hidden lg:flex flex-col h-[calc(100vh-2rem)] sticky top-4 gap-6 p-4 w-[320px]">
      <div className="relative group">
          <Search size={18} className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-zzic transition-colors" />
          <input type="text" placeholder="Search Topics" className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-3 pl-11 pr-4 text-white focus:outline-none focus:border-zzic transition-all placeholder:text-zinc-600 font-bold text-sm" />
      </div>
      <button onClick={() => setShowSuggestModal?.(true)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between group hover:border-zzic transition-all">
          <div className="flex items-center gap-3">
              <div className="bg-zinc-800 p-2 rounded-lg text-zinc-400 group-hover:text-zzic transition-colors"><Lightbulb size={20} /></div>
              <div className="text-left">
                  <div className="text-sm font-bold text-white group-hover:text-zzic transition-colors">{t('sidebar_suggest_title')}</div>
                  <div className="text-[10px] text-zinc-500">{t('sidebar_suggest_desc')}</div>
              </div>
          </div>
          <ChevronRight size={16} className="text-zinc-600 group-hover:text-zzic" />
      </button>
      <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800">
          <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wide flex items-center gap-2"><Crown size={16} className="text-zzic" /> Top Predictors</h3>
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

interface CommentItemProps {
    comment: Comment;
    depth?: number;
    allComments: Comment[];
    t: (key: keyof typeof TRANSLATIONS['ko']) => string;
    user: UserState | null;
    handleLikeComment: (id: string) => void;
    setReplyToId: (id: string | null) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, depth = 0, allComments, t, user, handleLikeComment, setReplyToId }) => {
    const replies = allComments.filter(c => c.parentId === comment.id);
    return (
        <div className={`animate-in fade-in slide-in-from-bottom-2 duration-300 ${depth > 0 ? 'mt-2' : 'mt-4 border-b border-zinc-900/50 pb-4 last:border-0'}`}>
            <div className="flex gap-3 relative">
               {depth > 0 && <div className="absolute -left-3 -top-3 w-3 h-6 border-b border-l border-zinc-800 rounded-bl-xl pointer-events-none"></div>}
               <div className="flex flex-col items-center shrink-0">
                  <div className={`${depth > 0 ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 overflow-hidden`}>
                      <User size={depth > 0 ? 12 : 14} className="text-zinc-500"/>
                  </div>
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase ${comment.prediction === 'YES' ? 'text-blue-400 border-blue-400' : 'text-red-400 border-red-400'}`}>
                          {comment.prediction === 'YES' ? t('comment_team_yes') : t('comment_team_no')}
                      </span>
                      <span className="text-xs font-bold text-white">{comment.userName}</span>
                      <span className="text-[10px] text-zinc-600 ml-auto">{new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className={`text-sm leading-relaxed font-medium break-words rounded-xl p-3 border ${comment.prediction === 'YES' ? 'bg-blue-950/10 border-blue-900/30' : 'bg-red-950/10 border-red-900/30'} text-zinc-300`}>
                      {comment.text}
                  </div>
                  <div className="flex items-center gap-4 mt-2 pl-1">
                      <button onClick={() => handleLikeComment(comment.id)} className={`flex items-center gap-1.5 text-xs font-bold transition-all ${comment.isLiked ? 'text-pink-500' : 'text-zinc-500 hover:text-pink-400'}`}>
                          <Heart size={14} className={comment.isLiked ? 'fill-pink-500' : ''} /> <span>{comment.likeCount}</span>
                      </button>
                      {user && depth < 3 && <button onClick={() => setReplyToId(comment.id)} className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-white transition-colors"><MessageCircle size={14} /> <span>{t('detail_reply')}</span></button>}
                  </div>
               </div>
            </div>
            {replies.length > 0 && <div className="pl-8">{replies.map(reply => <CommentItem key={reply.id} comment={reply} depth={depth + 1} allComments={allComments} t={t} user={user} handleLikeComment={handleLikeComment} setReplyToId={setReplyToId} />)}</div>}
        </div>
    );
};

// --- View Components (Extracted from App) ---

const HomeView: React.FC<any> = ({ billboardMsgs, toggleLanguage, user, setShowBillboardModal, handleRefill, setView, markets, setActiveMarketId, setBetAmount, comments, language, t }) => (
    <div className="pb-24 lg:pb-0 animate-in fade-in duration-500">
      <Billboard messages={billboardMsgs} />
      {/* Mobile Header */}
      <div className="lg:hidden px-4 py-4 flex justify-between items-center sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900">
        <div className="flex items-center cursor-pointer" onClick={() => setView('HOME')}>
            <h1 className="text-2xl font-black italic tracking-tighter text-white">ZZIC</h1>
        </div>
        <div className="flex gap-2 items-center">
            <button onClick={toggleLanguage} className="bg-zinc-900 p-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-colors"><Globe size={18} /></button>
            {user ? (
                <>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowBillboardModal(true);
                    }} 
                    className="flex items-center gap-1.5 bg-zzic text-black pl-3 pr-4 py-1.5 rounded-full transition-all active:scale-95 shadow-md hover:bg-[#b3e600]"
                    aria-label="Billboard"
                >
                    <Megaphone size={14} className="fill-black" />
                    <span className="text-[10px] font-black">전광판 등록</span>
                </button>
                {user.balance < 1000 && <button onClick={handleRefill} className="animate-bounce bg-red-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-[0_0_10px_rgba(220,38,38,0.5)]"><BatteryCharging size={12} /></button>}
                <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800" onClick={() => setShowBillboardModal(true)}>
                    <div className="w-2 h-2 rounded-full bg-zzic animate-pulse"></div>
                    <span className="text-sm font-black text-white font-mono">{formatNumber(user.balance)}</span>
                </div>
                </>
            ) : (
                <button onClick={() => setView('AUTH')} className="bg-zzic px-4 py-1.5 rounded-full border border-zzic hover:bg-[#b3e600] transition-colors"><span className="text-xs font-black text-black uppercase">Login</span></button>
            )}
        </div>
      </div>
      {/* Desktop Header Title */}
      <div className="hidden lg:flex px-6 py-4 sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900 justify-between items-center">
         <h2 className="text-xl font-bold text-white">Home</h2>
         {user && user.balance < 1000 && <button onClick={handleRefill} className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black animate-pulse shadow-lg flex items-center gap-1"><BatteryCharging size={12}/> {t('home_low_battery')}</button>}
      </div>
      <div className="px-5 mt-6">
        <h3 className="text-base font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
            <TrendingUp size={18} className="text-zzic" />
            {t('home_trending')}
            <span className="ml-2 text-xs bg-white text-black px-2 py-0.5 rounded-full font-black animate-pulse flex items-center gap-1">
                <Snowflake size={10} /> Year-End Special
            </span>
        </h3>
        <div className="space-y-4">
            {markets.map((market: Market) => {
                const recentComment = comments.find((c: Comment) => c.marketId === market.id);
                const commentCount = comments.filter((c: Comment) => c.marketId === market.id).length;
                return (
                <div 
                    key={market.id}
                    onClick={() => { setActiveMarketId(market.id); setView('DETAIL'); setBetAmount(0); }}
                    className="group relative bg-zinc-900 rounded-3xl p-4 border border-zinc-800 active:scale-[0.99] transition-all cursor-pointer hover:border-zzic/50 overflow-hidden hover:bg-zinc-800/50"
                >
                    <div className="absolute top-0 right-0 z-10">
                        <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl rounded-tr-2xl shadow-lg animate-pulse">
                            D-{Math.ceil((new Date(market.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-black border border-zinc-800">
                            <img src={market.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={market.title} />
                            <div className={`absolute top-0 left-0 px-2 py-0.5 text-[8px] font-black text-white rounded-br-lg ${CATEGORY_COLORS[market.category]}`}>{market.category}</div>
                        </div>
                        <div className="flex-1 min-w-0 py-1 flex flex-col justify-between h-24">
                            <div>
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                                        <Clock size={10} />
                                        <span>{new Date(market.endDate).getFullYear() === new Date().getFullYear() ? new Date(market.endDate).toLocaleDateString() + ' ' + t('market_closed') : t('market_long_term')}</span>
                                    </div>
                                </div>
                                <h4 className="text-[16px] font-bold text-white leading-snug line-clamp-2 pr-1 group-hover:text-zzic transition-colors">{language === 'en' ? (market.titleEn || market.title) : market.title}</h4>
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
                    {recentComment && (
                        <div className="mt-3 bg-zinc-800/40 rounded-xl p-3 relative">
                            <div className="absolute -top-1 left-6 w-2 h-2 bg-zinc-800/40 rotate-45"></div>
                            <div className="flex items-center gap-2 text-xs text-zinc-300">
                                <MessageCircle size={14} className="shrink-0 text-zinc-500" />
                                <span className="truncate flex-1">
                                    <span className={`font-bold mr-2 ${recentComment.prediction === 'YES' ? 'text-blue-400' : 'text-red-400'}`}>{recentComment.userName}</span>
                                    <span className="text-zinc-400">{recentComment.text}</span>
                                </span>
                                {commentCount > 1 && <span className="shrink-0 text-[10px] bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-500 font-bold">+{commentCount-1}</span>}
                            </div>
                        </div>
                    )}
                </div>
                );
            })}
            <div className="pt-8 pb-4">
                <h3 className="text-xs font-black text-zinc-500 mb-4 flex items-center gap-2 uppercase tracking-wide pl-2"><Calendar size={14} /> Coming Soon</h3>
                <div className="w-full">
                    {COMING_SOON_ITEMS.map(item => (
                        <div key={item.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between relative overflow-hidden group cursor-not-allowed">
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                             <div className="flex items-center gap-4 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-black border border-zinc-700 flex items-center justify-center">
                                    <TrendingUp size={18} className="text-red-500 rotate-180" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-zinc-400 leading-tight group-hover:text-white transition-colors">{item.title}</h4>
                                    <div className="text-[10px] text-zinc-600 font-mono mt-1 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-zzic animate-pulse"></span>
                                        {item.date}
                                    </div>
                                </div>
                             </div>
                             <button className="text-[10px] font-black border border-zinc-700 text-zinc-500 px-3 py-1.5 rounded-full uppercase tracking-wider group-hover:border-zzic group-hover:text-zzic transition-colors">
                                 Notify Me
                             </button>
                        </div>
                    ))}
                </div>
            </div>
             <div className="py-8 text-center px-4 lg:hidden"><p className="text-[10px] text-zinc-600 font-medium leading-relaxed">{t('footer_text')}</p></div>
        </div>
      </div>
    </div>
);

const DetailView: React.FC<any> = ({ activeMarket, user, setView, t, timeLeft, selectedPrediction, setSelectedPrediction, betAmount, setBetAmount, handlePredict, comments, activeMarketId, replyToId, setReplyToId, newCommentText, setNewCommentText, handleAddComment, handleLikeComment, language }) => {
    if (!activeMarket) return null;
    const tier = user ? getTier(user.balance) : null;
    return (
        <div className="pb-24 lg:pb-0 min-h-screen animate-in slide-in-from-right duration-300">
            <div className="px-4 py-4 flex items-center sticky top-0 bg-black/90 backdrop-blur-xl z-50 border-b border-zinc-900 justify-between">
                <div className="flex items-center">
                    <button onClick={() => setView('HOME')} className="p-2 -ml-2 rounded-full hover:bg-zinc-900 text-white transition-colors"><ArrowLeft size={24} /></button>
                    <span className="ml-2 font-black text-lg tracking-wide uppercase italic">{t('detail_nav')}</span>
                </div>
                {tier && <div className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-black ${tier.color} ${tier.bg}`}><tier.icon size={10} /> {tier.name}</div>}
            </div>
            <div className="px-5 pt-6">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-white leading-snug mb-2 break-keep">{language === 'en' ? (activeMarket.titleEn || activeMarket.title) : activeMarket.title}</h2>
                    <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full mb-4">
                        <Timer size={12} className="text-zzic animate-pulse" />
                        <span className="text-xs font-mono font-bold text-zinc-300">{timeLeft.expired ? "CLOSED" : `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m left`}</span>
                    </div>
                    <div className="w-full h-32 bg-zinc-900/50 rounded-xl border border-zinc-800 p-4 mb-4 relative overflow-hidden">
                        <div className="absolute top-2 left-4 text-[10px] font-bold text-zinc-500">YES Price Trend</div>
                        <MiniChart history={activeMarket.priceHistory} color="text-zzic" />
                        <div className="absolute bottom-2 right-4 text-xs font-black text-white">{activeMarket.yesPrice}%</div>
                    </div>
                </div>
                <div className="bg-zinc-900 rounded-[2rem] p-6 border border-zinc-800 shadow-2xl mb-8">
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button onClick={() => setSelectedPrediction('YES')} className={`py-6 rounded-2xl font-black text-sm transition-all border-2 ${selectedPrediction === 'YES' ? 'bg-blue-600 border-blue-400 text-white shadow-lg scale-105' : 'bg-black border-zinc-800 text-zinc-600'}`}>
                            <span className="block text-[10px] opacity-60 mb-1">YES</span>
                            <span className="text-3xl italic">{activeMarket.yesPrice}%</span>
                        </button>
                        <button onClick={() => setSelectedPrediction('NO')} className={`py-6 rounded-2xl font-black text-sm transition-all border-2 ${selectedPrediction === 'NO' ? 'bg-red-600 border-red-400 text-white shadow-lg scale-105' : 'bg-black border-zinc-800 text-zinc-600'}`}>
                             <span className="block text-[10px] opacity-60 mb-1">NO</span>
                             <span className="text-3xl italic">{100 - activeMarket.yesPrice}%</span>
                        </button>
                    </div>
                    {user ? (
                        <div className="bg-zinc-950/50 rounded-2xl p-4 mb-4 border border-zinc-800">
                             <div className="flex justify-between items-center mb-3">
                                <span className="text-xs text-zinc-400 font-bold flex items-center gap-1"><Wallet size={12} /> {t('detail_bet_amount')}</span>
                                <span className="text-xs font-mono font-bold text-zinc-500">{t('detail_holding')}: <span className="text-white ml-1">{formatNumber(user.balance)}</span></span>
                            </div>
                            <input type="number" value={betAmount === 0 ? '' : betAmount} onChange={(e) => setBetAmount(Math.min(parseInt(e.target.value) || 0, user.balance))} placeholder="0" className="w-full bg-black border-2 border-zinc-800 rounded-xl py-3 text-center text-2xl font-black text-white focus:border-zzic outline-none mb-3" />
                            <div className="grid grid-cols-4 gap-2">
                                {[100, 500, 1000].map(amt => <button key={amt} onClick={() => setBetAmount(Math.min(betAmount + amt, user.balance))} className="bg-zinc-800 text-zinc-400 text-xs font-bold py-2 rounded-lg hover:text-white">+{amt}</button>)}
                                <button onClick={() => setBetAmount(user.balance)} className="bg-zzic/20 text-zzic text-xs font-black py-2 rounded-lg">MAX</button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-4 bg-zinc-950 rounded-xl border border-zinc-800 mb-4 text-zinc-500 text-xs font-bold">{t('detail_login_required')}</div>
                    )}
                    <button onClick={handlePredict} className={`w-full py-4 rounded-xl font-black text-lg shadow-lg uppercase tracking-wider ${user ? (selectedPrediction === 'YES' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white') : 'bg-zinc-800 text-zinc-500'}`}>{user ? t('detail_confirm') : t('detail_login_btn')}</button>
                </div>
                <div className="pb-10">
                    <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wide"><MessageSquare size={16} className="text-zzic"/> {t('detail_discussion')} <span className="text-xs text-zinc-500 ml-auto font-normal">{t('detail_discussion_count').replace('{0}', comments.filter((c: Comment) => c.marketId === activeMarketId).length.toString())}</span></h3>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6 relative focus-within:border-zzic transition-colors">
                        {replyToId && <div className="flex justify-between items-center bg-zinc-800/50 px-3 py-2 rounded-lg mb-2"><span className="text-xs text-zinc-400"><CornerDownRight size={12} className="inline mr-1"/>{t('detail_reply_to').replace('{0}', comments.find((c: Comment) => c.id === replyToId)?.userName || 'User')}</span><button onClick={() => setReplyToId(null)} className="text-zinc-500 hover:text-white"><X size={14}/></button></div>}
                        <textarea placeholder={user ? t('detail_input_placeholder_participant') : t('detail_input_placeholder_login')} value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none resize-none font-medium mb-2" rows={2} />
                        <div className="flex justify-end"><button onClick={handleAddComment} className="bg-white text-black text-xs font-black px-4 py-2 rounded-lg hover:bg-zzic transition-colors flex items-center gap-1"><Send size={12} /> {replyToId ? t('detail_reply_action') : t('detail_send_action')}</button></div>
                    </div>
                    <div className="space-y-0">
                        {comments.filter((c: Comment) => c.marketId === activeMarketId && !c.parentId).length === 0 && <div className="text-center py-8 text-zinc-600 text-xs font-bold">{t('detail_no_comments')}</div>}
                        {comments.filter((c: Comment) => c.marketId === activeMarketId && !c.parentId).map((comment: Comment) => <CommentItem key={comment.id} comment={comment} allComments={comments.filter((c: Comment) => c.marketId === activeMarketId)} t={t} user={user} handleLikeComment={handleLikeComment} setReplyToId={setReplyToId} />)}
                    </div>
                </div>
            </div>
             <div className="py-8 text-center px-4 lg:hidden"><p className="text-[10px] text-zinc-600 font-medium leading-relaxed">{t('footer_text')}</p></div>
        </div>
    );
};

const RankingView: React.FC<any> = ({ setView, t, user }) => (
    <div className="pb-24 lg:pb-0 animate-in slide-in-from-bottom-4 duration-500">
        <div className="px-5 py-6 sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900 lg:hidden">
            <div className="flex items-center gap-3"><button onClick={() => setView('HOME')} className="p-2 -ml-2 rounded-full hover:bg-zinc-900 text-white transition-colors"><ArrowLeft size={24} /></button><h1 className="text-xl font-black italic text-white tracking-tighter uppercase">{t('ranking_title')}</h1></div>
        </div>
        <div className="hidden lg:flex px-6 py-4 sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900 justify-between items-center"><h2 className="text-xl font-bold text-white">Ranking</h2></div>
        <div className="px-5 mt-6">
            <div className="flex justify-center items-end gap-3 mb-12 pt-24 relative">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-zzic/10 blur-[80px] rounded-full pointer-events-none"></div>
                <div className="flex flex-col items-center z-10">
                    <div className="relative"><div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center mb-3 shadow-lg"><User size={28} className="text-zinc-500"/></div></div>
                    <div className="text-[10px] font-black text-zinc-500 mb-2 max-w-[70px] truncate text-center uppercase tracking-wide">Silver</div>
                    <div className="w-24 h-28 bg-gradient-to-b from-zinc-800 to-black rounded-t-xl flex flex-col items-center pt-4 border-t border-zinc-700"><span className="text-3xl font-black text-zinc-600 italic">2</span></div>
                </div>
                 <div className="flex flex-col items-center relative -top-4 z-20">
                    <div className="absolute -top-[60px] animate-bounce"><Crown size={40} className="text-zzic fill-zzic drop-shadow-[0_0_15px_rgba(204,255,0,0.6)]" /></div>
                    <div className="relative"><div className="w-24 h-24 rounded-full bg-zinc-900 border-4 border-zzic flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(204,255,0,0.2)]"><User size={40} className="text-zzic"/></div></div>
                    <div className="text-xs font-black text-zzic mb-2 max-w-[100px] truncate text-center uppercase tracking-widest">Gold</div>
                    <div className="w-28 h-40 bg-gradient-to-b from-zzic to-black rounded-t-xl flex flex-col items-center pt-4 border-t border-zzic relative overflow-hidden"><div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div><span className="text-5xl font-black text-black italic">1</span></div>
                </div>
                <div className="flex flex-col items-center z-10">
                    <div className="relative"><div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center mb-3 shadow-lg"><User size={28} className="text-zinc-500"/></div></div>
                    <div className="text-[10px] font-black text-zinc-500 mb-2 max-w-[70px] truncate text-center uppercase tracking-wide">Bronze</div>
                    <div className="w-24 h-20 bg-gradient-to-b from-zinc-800 to-black rounded-t-xl flex flex-col items-center pt-4 border-t border-zinc-700"><span className="text-3xl font-black text-zinc-600 italic">3</span></div>
                </div>
            </div>
            <div className="space-y-3 relative z-20">
                {MOCK_RANKING.map((rankUser, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${user && rankUser.name === user.name ? 'bg-zzic/10 border-zzic/50 shadow-[0_0_15px_rgba(204,255,0,0.1)]' : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900'}`}>
                        <div className="flex items-center gap-5">
                            <span className={`font-black w-6 text-center italic text-lg ${idx < 3 ? 'text-zzic' : 'text-zinc-700'}`}>{rankUser.rank}</span>
                            <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-black border border-zinc-800 flex items-center justify-center"><User size={16} className="text-zinc-500"/></div><div><div className="font-bold text-sm text-white flex items-center gap-2">{rankUser.name}{user && rankUser.name === user.name && <span className="text-[9px] bg-zzic text-black px-1.5 py-0.5 rounded font-black">ME</span>}</div><div className="text-[10px] text-zinc-500 font-bold">{t('ranking_winrate')} {rankUser.winRate}%</div></div></div>
                        </div>
                        <div className="font-mono font-bold text-white text-sm">{formatNumber(rankUser.balance)} <span className="text-zinc-600">VP</span></div>
                    </div>
                ))}
            </div>
             <div className="py-8 text-center px-4 lg:hidden"><p className="text-[10px] text-zinc-600 font-medium leading-relaxed">{t('footer_text')}</p></div>
        </div>
    </div>
);

const ProfileView: React.FC<any> = ({ setView, t, user, handleRefill, handleLogout }) => (
    <div className="pb-24 lg:pb-0 animate-in slide-in-from-right duration-300 min-h-screen">
        <div className="px-5 py-6 sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900 lg:hidden"><div className="flex items-center gap-3"><button onClick={() => setView('HOME')} className="p-2 -ml-2 rounded-full hover:bg-zinc-900 text-white transition-colors"><ArrowLeft size={24} /></button><h1 className="text-xl font-black italic text-white tracking-tighter uppercase">{t('profile_title')}</h1></div></div>
        <div className="hidden lg:flex px-6 py-4 sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900 justify-between items-center"><h2 className="text-xl font-bold text-white">Profile</h2></div>
        <div className="px-5 pt-6">
            {!user ? (
                 <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                    <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center border-2 border-zinc-800 mb-4"><User size={40} className="text-zinc-500" /></div>
                    <h2 className="text-2xl font-black text-white">{t('auth_login_required')}</h2>
                    <p className="text-zinc-500 text-sm max-w-[250px]">{t('auth_login_profile_desc')}</p>
                    <button onClick={() => setView('AUTH')} className="bg-zzic text-black font-black py-3 px-8 rounded-xl hover:bg-[#b3e600] transition-colors uppercase tracking-wide flex items-center gap-2"><LogInIcon size={18} /> {t('profile_login_btn')}</button>
                 </div>
            ) : (
                <div className="space-y-6">
                     <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3"><span className="text-[10px] font-black bg-zinc-800 text-zinc-500 px-2 py-1 rounded uppercase tracking-wider">{user.isGuest ? t('profile_guest') : t('profile_rookie')}</span></div>
                        <div className="flex items-center gap-4 mb-6"><div className="w-16 h-16 rounded-full bg-black border-2 border-zinc-700 flex items-center justify-center"><User size={30} className="text-zinc-300"/></div><div><h2 className="text-xl font-black text-white">{user.name}</h2><p className="text-xs text-zinc-500 font-bold">{user.email || 'No Email'}</p></div></div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-black/50 rounded-xl p-4 border border-zinc-800"><div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">{t('profile_assets')}</div><div className="text-xl font-mono font-black text-zzic">{formatNumber(user.balance)} VP</div></div>
                              <div className="bg-black/50 rounded-xl p-4 border border-zinc-800"><div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">{t('profile_hit_rate')}</div><div className="text-xl font-mono font-black text-white">- %</div></div>
                        </div>
                        {user.isGuest && <div className="mt-4 flex items-start gap-2 text-[10px] text-orange-500 bg-orange-950/30 p-3 rounded-xl border border-orange-900/50"><AlertCircle size={14} className="shrink-0 mt-0.5"/>{t('profile_cache_warn')}</div>}
                     </div>
                     {user.balance < 500 && <div className="bg-red-950/20 border border-red-900/50 rounded-3xl p-5 flex items-center justify-between animate-pulse"><div><h3 className="text-sm font-black text-red-500 flex items-center gap-2 uppercase"><AlertCircle size={16}/> {t('profile_bankruptcy_title')}</h3><p className="text-xs text-red-400 mt-1">{t('profile_bankruptcy_desc')}</p></div><button onClick={handleRefill} className="bg-red-600 text-white text-xs font-black px-4 py-2 rounded-lg hover:bg-red-500 transition-colors">{t('profile_rescue_btn')}</button></div>}
                     <div>
                        <h3 className="text-base font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wide"><Clock size={18} className="text-zzic"/> {t('profile_recent')}</h3>
                        {user.portfolio.length === 0 ? (
                            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-3xl"><p className="text-zinc-600 text-sm font-bold mb-4">{t('profile_no_history')}</p><button onClick={() => setView('HOME')} className="text-zzic text-xs font-black hover:underline uppercase tracking-wide">{t('profile_explore')}</button></div>
                        ) : (
                            <div className="space-y-3">
                                {user.portfolio.map((item: PortfolioItem) => (
                                    <div key={item.id} className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 flex justify-between items-center group hover:bg-zinc-900 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black italic text-lg ${item.prediction === 'YES' ? 'bg-blue-900/20 text-blue-500 border border-blue-900/50' : 'bg-red-900/20 text-red-500 border border-red-900/50'}`}>{item.prediction}</div>
                                            <div><div className="text-sm font-bold text-white mb-0.5 line-clamp-1">{item.marketTitle}</div><div className="text-[10px] text-zinc-500 font-mono">{new Date(item.timestamp).toLocaleDateString()}</div></div>
                                        </div>
                                        <div className="text-right"><div className="text-sm font-mono font-bold text-zinc-300">{formatNumber(item.amount)} VP</div><div className="text-[10px] text-zzic font-mono">x {formatPercent(item.payoutMultiple)}</div></div>
                                    </div>
                                ))}
                            </div>
                        )}
                     </div>
                     <div className="pt-4 space-y-3">
                         <button onClick={() => setView('ABOUT')} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold py-3 rounded-xl hover:text-white transition-colors flex items-center justify-center gap-2 text-sm"><Info size={16}/> {t('profile_about_btn')}</button>
                         <button onClick={handleLogout} className="w-full bg-black border border-zinc-800 text-zinc-500 font-bold py-3 rounded-xl hover:text-red-500 hover:border-red-900/30 transition-colors flex items-center justify-center gap-2 text-sm"><LogOut size={16}/> {t('profile_logout')}</button>
                     </div>
                     <div className="py-8 text-center px-4 lg:hidden"><p className="text-[10px] text-zinc-600 font-medium leading-relaxed">{t('footer_text')}</p></div>
                </div>
            )}
        </div>
    </div>
);

const AboutView: React.FC<any> = ({ setView, t }) => (
    <div className="pb-24 lg:pb-0 animate-in fade-in duration-500 min-h-screen flex flex-col">
        <div className="px-5 py-6 sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900 lg:hidden"><div className="flex items-center gap-3"><button onClick={() => setView('HOME')} className="p-2 -ml-2 rounded-full hover:bg-zinc-900 text-white transition-colors"><ArrowLeft size={24} /></button><h1 className="text-xl font-black italic text-white tracking-tighter uppercase">{t('about_nav')}</h1></div></div>
        <div className="hidden lg:flex px-6 py-4 sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900 justify-between items-center"><h2 className="text-xl font-bold text-white">About ZZIC</h2></div>
        <div className="px-6 py-10 flex-1 flex flex-col items-center text-center">
            <div className="mb-8 relative flex flex-col items-center">
                <div className="absolute inset-0 bg-zzic blur-[60px] opacity-20 rounded-full"></div>
                <LogoImage className="w-24 h-24 rounded-3xl shadow-2xl mb-4 relative z-10 border border-zinc-800" />
                <h1 className="text-5xl font-black italic tracking-tighter text-white relative z-10">ZZIC</h1>
                <p className="text-xs text-zzic font-bold tracking-[0.3em] uppercase mt-2">{t('about_slogan')}</p>
            </div>
            <p className="text-lg font-bold text-zinc-300 mb-12 leading-relaxed max-w-sm">{t('about_desc_1')}<br/><span className="text-white">{t('about_desc_2')}</span></p>
            <div className="w-full space-y-4 max-w-md">
                <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 text-left relative overflow-hidden group hover:border-zzic/50 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><ShieldCheck size={64} className="text-white"/></div>
                    <div className="relative z-10"><h3 className="text-xl font-black text-white mb-2 flex items-center gap-2"><ShieldCheck size={20} className="text-zzic"/>{t('about_card_1_title')}</h3><p className="text-sm text-zinc-400 font-medium leading-relaxed">{t('about_card_1_desc')}</p></div>
                </div>
                <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 text-left relative overflow-hidden group hover:border-yellow-500/50 transition-all">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Bug size={64} className="text-yellow-500"/></div>
                    <div className="relative z-10"><h3 className="text-xl font-black text-white mb-2 flex items-center gap-2"><Bug size={20} className="text-yellow-500"/>{t('about_card_2_title')}</h3><p className="text-sm text-zinc-400 font-medium leading-relaxed">{t('about_card_2_desc')}</p></div>
                </div>
                 <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 text-left relative overflow-hidden group hover:border-blue-500/50 transition-all">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Users size={64} className="text-blue-500"/></div>
                    <div className="relative z-10"><h3 className="text-xl font-black text-white mb-2 flex items-center gap-2"><Users size={20} className="text-blue-500"/>{t('about_card_3_title')}</h3><p className="text-sm text-zinc-400 font-medium leading-relaxed">{t('about_card_3_desc')}</p></div>
                </div>
            </div>
             <div className="mt-auto pt-12 pb-6"><p className="text-[10px] text-zinc-600 font-mono">© 2025 ZZIC Inc. All rights reserved.<br/>Contact: support@zzic.app</p></div>
        </div>
    </div>
);

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
  const toggleLanguage = () => setLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  const activeMarket = useMemo(() => markets.find(m => m.id === activeMarketId), [markets, activeMarketId]);
  
  const timeLeft = useCountdown(activeMarket?.endDate);

  // [DEEP LINKING] Handle ?marketId=xyz
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mid = params.get('marketId');
    if (mid) {
        const targetMarket = markets.find(m => m.id === mid);
        if (targetMarket) {
            setActiveMarketId(mid);
            setView('DETAIL');
        }
    }
  }, [markets]);

  const handleRefill = () => {
    if (user && user.balance < 1000) {
        if(confirm(t('confirm_ad_refill'))) {
            setUser({ ...user, balance: user.balance + 3000 });
            alert(t('alert_refill_success'));
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
      if (user.balance < 1000) return alert(t('alert_vp_insufficient'));
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
      alert(t('alert_billboard_success'));
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
        alert(t('alert_vote_required'));
        return;
    }

    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      marketId: activeMarketId!,
      userName: user.name,
      text: newCommentText,
      timestamp: Date.now(),
      prediction: userBet.prediction,
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

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-zzic selection:text-black flex justify-center">
      <div className="w-full max-w-[1200px] flex items-start gap-0 lg:gap-8 justify-center min-h-screen relative shadow-2xl">
        <SidebarLeft 
            view={view} 
            setView={setView} 
            user={user} 
            language={language} 
            toggleLanguage={toggleLanguage} 
            handleLogout={handleLogout} 
            setShowBillboardModal={setShowBillboardModal} 
            t={t} 
        />
        <main className="flex-1 w-full max-w-[600px] border-x border-zinc-900 min-h-screen bg-black relative pb-20 lg:pb-0">
            {view === 'HOME' && (
                <HomeView 
                    billboardMsgs={billboardMsgs} 
                    toggleLanguage={toggleLanguage} 
                    user={user} 
                    setShowBillboardModal={setShowBillboardModal} 
                    handleRefill={handleRefill} 
                    setView={setView} 
                    markets={markets} 
                    setActiveMarketId={setActiveMarketId} 
                    setBetAmount={setBetAmount} 
                    comments={comments} 
                    language={language} 
                    t={t} 
                />
            )}
            {view === 'DETAIL' && (
                <DetailView 
                    activeMarket={activeMarket}
                    user={user}
                    setView={setView}
                    t={t}
                    timeLeft={timeLeft}
                    selectedPrediction={selectedPrediction}
                    setSelectedPrediction={setSelectedPrediction}
                    betAmount={betAmount}
                    setBetAmount={setBetAmount}
                    handlePredict={handlePredict}
                    comments={comments}
                    activeMarketId={activeMarketId}
                    replyToId={replyToId}
                    setReplyToId={setReplyToId}
                    newCommentText={newCommentText}
                    setNewCommentText={setNewCommentText}
                    handleAddComment={handleAddComment}
                    handleLikeComment={handleLikeComment}
                    language={language}
                />
            )}
            {view === 'RANKING' && <RankingView setView={setView} t={t} user={user} />}
            {view === 'PROFILE' && <ProfileView setView={setView} t={t} user={user} handleRefill={handleRefill} handleLogout={handleLogout} />}
            {view === 'ABOUT' && <AboutView setView={setView} t={t} />}
        </main>
        <SidebarRight 
            view={view} 
            setView={setView} 
            user={user} 
            language={language} 
            setShowSuggestModal={setShowSuggestModal}
            t={t}
        />
        <BottomNav currentView={view} onChangeView={setView} />
        {showBillboardModal && (
            <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-zinc-900 w-full max-w-sm rounded-3xl p-6 border border-zinc-800">
                    <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2"><Megaphone size={20} className="text-zzic"/> {t('billboard_modal_title')}</h3>
                    <p className="text-xs text-zinc-500 mb-6">{t('billboard_modal_desc')}</p>
                    <input value={billboardText} onChange={e => setBillboardText(e.target.value)} placeholder={t('billboard_input_placeholder')} className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-4 focus:border-zzic outline-none"/>
                    <div className="flex gap-2"><button onClick={() => setShowBillboardModal(false)} className="flex-1 py-3 rounded-xl bg-zinc-800 text-white font-bold text-sm">{t('billboard_btn_cancel')}</button><button onClick={handlePostBillboard} className="flex-1 py-3 rounded-xl bg-zzic text-black font-black text-sm hover:bg-[#b3e600]">{t('billboard_btn_register')}</button></div>
                </div>
            </div>
        )}
        {showSuggestModal && (
            <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-zinc-900 w-full max-w-sm rounded-3xl p-6 border border-zinc-800 relative">
                    <button onClick={() => setShowSuggestModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={20}/></button>
                    <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2"><Lightbulb size={20} className="text-zzic"/> {t('suggest_title')}</h3>
                    <p className="text-xs text-zinc-500 mb-6">{t('suggest_desc')}</p>
                    <div className="space-y-4">
                        <div><label className="text-[10px] font-bold text-zinc-500 uppercase mb-1 block">{t('suggest_input_title')}</label><input value={suggestTitle} onChange={e => setSuggestTitle(e.target.value)} placeholder={t('suggest_input_placeholder_title')} className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white focus:border-zzic outline-none"/></div>
                        <div><label className="text-[10px] font-bold text-zinc-500 uppercase mb-1 block">{t('suggest_input_desc')}</label><textarea value={suggestDesc} onChange={e => setSuggestDesc(e.target.value)} placeholder={t('suggest_input_placeholder_desc')} className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white focus:border-zzic outline-none resize-none h-24"/></div>
                        <button onClick={handleSuggest} className="w-full py-3 rounded-xl bg-zzic text-black font-black text-sm hover:bg-[#b3e600]">{t('suggest_btn')}</button>
                    </div>
                </div>
            </div>
        )}
        {view === 'AUTH' && <AuthScreen onLogin={(u) => { setUser(u); setView('HOME'); }} onClose={() => setView('HOME')} language={language} />}
        {lastPurchasedItem && <ShareModal item={lastPurchasedItem} onClose={() => { setLastPurchasedItem(null); setView('PROFILE'); }} language={language} />}
      </div>
    </div>
  );
};

export default App;