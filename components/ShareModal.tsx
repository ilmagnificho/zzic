
import React, { useState } from 'react';
import { X, Share2, Check, QrCode, Fingerprint, Snowflake, Coins, Ticket, Scale, Siren, Camera, TrendingUp, Trees, Gift, Star } from 'lucide-react';
import { PortfolioItem, Market } from '../types';
import { TRANSLATIONS, Language } from '../translations';

interface ShareModalProps {
  item?: PortfolioItem | null;
  market?: Market;
  onClose: () => void;
  language: Language;
}

const ShareModal: React.FC<ShareModalProps> = ({ item, market, onClose, language }) => {
  const t = (key: keyof typeof TRANSLATIONS['ko']) => TRANSLATIONS[language][key];
  const [isCopied, setIsCopied] = useState(false);

  const displayTitle = item?.marketTitle || market?.title || 'ZZIC';
  const category = market?.category || 'STOCK';
  const isPredictionShare = !!item;

  // --- THEME LOGIC ---
  const getTheme = () => {
    switch (category) {
      case 'WEATHER':
        return 'CHRISTMAS';
      case 'ENTER':
      case 'SPORTS':
        return 'TABLOID';
      case 'COIN':
      case 'STOCK':
      default:
        return 'GOLD';
    }
  };

  const theme = getTheme();

  const handleShare = async () => {
    let shareText = '';
    
    // 1. Text Generation based on Category
    if (category === 'WEATHER') {
        if (isPredictionShare) {
            const pred = item?.prediction === 'YES' ? '화이트 크리스마스 ☃️' : '그냥 크리스마스 ☀️';
            shareText = `[ZZIC 시즌 특보] 🎄\n\n"${displayTitle}"\n\n제 예측은 [ ${pred} ] 입니다.\n성탄절의 기적, 함께 지켜보시죠!`;
        } else {
            shareText = `[ZZIC 시즌 특보] 🎄\n\n"${displayTitle}"\n\n올해 크리스마스, 눈이 올까요?\n당신의 촉을 보여주세요!`;
        }
    } 
    else if (category === 'ENTER' || category === 'SPORTS') {
        if (isPredictionShare) {
            shareText = `[ZZIC 단독 입수] 📸\n\n"${displayTitle}"\n\n저는 [ ${item?.prediction} ] 쪽에 걸었습니다.\n이게 터지면 성지순례 오세요!`;
        } else {
            shareText = `[ZZIC 핫이슈] 🔥\n\n"${displayTitle}"\n\n대한민국을 뒤흔들 떡밥!\n지금 바로 투표하고 결과를 확인하세요.`;
        }
    } 
    else { // COIN, STOCK
        if (isPredictionShare) {
             const pred = item?.prediction === 'YES' ? '떡상 간다 🚀' : '돔황챠! 📉';
             shareText = `[ZZIC 투자 인증] 💎\n\n"${displayTitle}"\n\n저는 [ ${pred} ] 에 전재산(?) 걸었습니다.\n이 황금 부적의 기운을 받으세요!`;
        } else {
             shareText = `[ZZIC 투자 주의보] 💎\n\n"${displayTitle}"\n\n비트코인 10만불, 과연 가능할까요?\n당신의 예측력을 증명해보세요!`;
        }
    }

    const shareUrl = `https://zzic.vercel.app/?marketId=${item?.marketId || market?.id}`;
    
    const shareData = {
        title: 'ZZIC - Trust Your Instinct',
        text: `${shareText}\n👇 결과 확인하기`,
        url: shareUrl,
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    } catch (e) {
        console.error('Share failed:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300 p-6 overflow-y-auto">
      <div className="relative w-full max-w-[340px] flex flex-col gap-6 my-auto">
        
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-all active:scale-95 backdrop-blur-sm border border-white/10"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* --- CARD VISUALS --- */}
        <div className={`w-full aspect-[3/4.5] relative select-none overflow-hidden flex flex-col shadow-2xl transition-transform duration-500 hover:scale-[1.01] ${
            theme === 'GOLD' ? 'rounded-[4px] rounded-tr-[30px] rounded-bl-[30px] border-4 border-[#b45309]' : 
            theme === 'CHRISTMAS' ? 'rounded-[20px] border-4 border-white/20' : 
            'rounded-none border-y-8 border-red-600' // TABLOID theme
        }`}>
            
            {/* 1. BACKGROUNDS */}
            {theme === 'GOLD' && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#854d0e] via-[#facc15] to-[#713f12]">
                     <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1h2v2H1V1zm4 4h2v2H5V5zm4 4h2v2H9V9z' fill='%23000000' fill-opacity='0.4'/%3E%3C/svg%3E")`}}></div>
                     <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-45 animate-shine"></div>
                </div>
            )}
            
            {theme === 'CHRISTMAS' && (
                <div className="absolute inset-0 bg-[#0f172a]">
                    {/* Gradient Sky */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900"></div>
                    
                    {/* Snow Particles */}
                    {[...Array(40)].map((_, i) => (
                         <div key={i} className="absolute bg-white rounded-full opacity-80 animate-snow" style={{
                            width: Math.random() * 3 + 1 + 'px',
                            height: Math.random() * 3 + 1 + 'px',
                            left: Math.random() * 100 + '%',
                            animationDuration: Math.random() * 5 + 3 + 's',
                            animationDelay: Math.random() * 5 + 's'
                        }}></div>
                    ))}
                    
                    {/* Bottom Snow Accumulation */}
                     <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/20 to-transparent"></div>
                </div>
            )}

            {theme === 'TABLOID' && (
                <div className="absolute inset-0 bg-[#0a0a0a]">
                     <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#222_2px,#222_4px)] opacity-50"></div>
                     <div className="absolute inset-0 bg-white opacity-0 animate-flash"></div>
                </div>
            )}

            {/* 2. CONTENT */}
            <div className="relative z-10 flex flex-col h-full p-6">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col">
                         {theme === 'GOLD' && <span className="text-[10px] font-black text-[#451a03] tracking-[0.3em]">GOLD STANDARD</span>}
                         {theme === 'CHRISTMAS' && (
                             <div className="flex items-center gap-1 mb-1">
                                 <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">EVENT</span>
                                 <span className="text-[10px] font-black text-green-400 tracking-[0.2em]">SEASON 2025</span>
                             </div>
                         )}
                         {theme === 'TABLOID' && (
                             <div className="bg-[#D20000] text-white px-2 py-0.5 font-black tracking-tighter text-xs transform -skew-x-12 inline-block border border-white/20 shadow-lg">
                                 DISPATCH
                             </div>
                         )}
                         
                         <h1 className={`text-3xl font-black italic tracking-tighter mt-1 ${
                             theme === 'GOLD' ? 'text-[#451a03]' : 'text-white'
                         }`}>ZZIC</h1>
                    </div>
                    <div>
                        {theme === 'GOLD' && <Coins size={32} className="text-[#451a03] opacity-80" />}
                        {theme === 'CHRISTMAS' && (
                            <div className="relative">
                                <Trees size={32} className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                <Star size={12} className="absolute -top-1 left-1/2 -translate-x-1/2 text-yellow-300 fill-yellow-300 animate-pulse" />
                            </div>
                        )}
                        {theme === 'TABLOID' && <Camera size={32} className="text-white animate-pulse" />}
                    </div>
                </div>

                {/* Main Body */}
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
                    
                    {/* Title */}
                    <h2 className={`text-2xl font-bold leading-tight break-keep drop-shadow-lg ${
                        theme === 'GOLD' ? 'text-[#451a03]' : 'text-white'
                    }`}>
                        {displayTitle}
                    </h2>

                    {/* Stamp / Icon */}
                    <div className="relative">
                        {isPredictionShare && item ? (
                             <div className={`border-4 rounded-xl p-4 transform -rotate-6 shadow-2xl relative overflow-hidden ${
                                 theme === 'GOLD' ? 'border-[#713f12] bg-[#fef08a]/30 text-[#451a03]' :
                                 theme === 'CHRISTMAS' ? 'border-green-400/30 bg-black/40 text-white backdrop-blur-sm shadow-[0_0_20px_rgba(34,197,94,0.2)]' :
                                 'border-white bg-[#D20000] text-white'
                             }`}>
                                {theme === 'CHRISTMAS' && <div className="absolute -top-2 -left-2 text-white/20"><Snowflake size={24}/></div>}
                                <div className="text-[10px] font-black opacity-80 mb-1 uppercase">MY PREDICTION</div>
                                <div className={`text-5xl font-black ${theme === 'CHRISTMAS' && item.prediction === 'YES' ? 'text-green-400' : ''}`}>{item.prediction}</div>
                            </div>
                        ) : (
                            // Generic Share Visuals
                            theme === 'GOLD' ? (
                                <div className="flex flex-col items-center gap-2">
                                     <Scale size={64} className="text-[#451a03] drop-shadow-md" />
                                     <div className="bg-[#451a03] text-[#facc15] px-4 py-1 font-black text-xl rounded">VOTE NOW</div>
                                </div>
                            ) : theme === 'CHRISTMAS' ? (
                                <div className="flex flex-col items-center">
                                     <div className="relative mb-2">
                                         <Gift size={64} className="text-red-500 fill-red-500 stroke-white stroke-2 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-bounce" />
                                         <Snowflake size={24} className="text-white absolute -top-2 -right-2 animate-spin-slow" />
                                     </div>
                                     <div className="text-white/80 font-mono text-xs mt-2 border border-white/30 px-3 py-1 rounded-full bg-white/10">White Christmas?</div>
                                </div>
                            ) : (
                                <div className="relative">
                                     <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-t from-zinc-500 to-white italic transform -rotate-6">VS</div>
                                     <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#D20000] text-white text-[12px] font-black px-2 py-0.5">EXCLUSIVE</div>
                                </div>
                            )
                        )}
                    </div>
                    
                    {theme === 'TABLOID' && !isPredictionShare && (
                        <div className="text-[#D20000] font-black text-2xl tracking-widest border-y-4 border-[#D20000] w-full py-2 bg-black transform rotate-1">
                            BREAKING NEWS
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={`mt-auto pt-4 border-t flex justify-between items-end ${
                    theme === 'GOLD' ? 'border-[#451a03]/30' : 'border-white/30'
                }`}>
                    <div className="flex flex-col">
                        <span className={`text-[8px] font-bold ${theme === 'GOLD' ? 'text-[#713f12]' : 'text-zinc-400'}`}>DATE</span>
                        <span className={`text-[12px] font-mono font-bold ${theme === 'GOLD' ? 'text-[#451a03]' : 'text-white'}`}>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                         <span className={`text-[10px] font-bold tracking-widest ${theme === 'GOLD' ? 'text-[#713f12]' : 'text-zinc-400'}`}>ZZIC.APP</span>
                         <Fingerprint className={theme === 'GOLD' ? 'text-[#451a03]' : 'text-white'} opacity={0.7} size={28}/>
                    </div>
                </div>

            </div>
        </div>
        
        {/* Share Button */}
        <button 
            onClick={handleShare}
            className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 border
            ${isCopied ? 'bg-white text-black border-white' : 'bg-zzic text-black border-zzic hover:bg-[#b3e600]'}`}
        >
            {isCopied ? <Check size={18} /> : <Share2 size={18} />}
            {isCopied ? t('share_copied') : t('share_btn')}
        </button>
      </div>

      <style>{`
        @keyframes snow {
            0% { transform: translateY(-10px); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translateY(340px); opacity: 0.5; }
        }
        .animate-snow { animation: snow linear infinite; }
        
        @keyframes shine {
            0% { left: -100%; }
            100% { left: 200%; }
        }
        .animate-shine { animation: shine 3s infinite; }

        @keyframes flash {
            0%, 100% { opacity: 0; }
            5%, 10% { opacity: 0.3; }
        }
        .animate-flash { animation: flash 4s infinite; }
        
        .animate-spin-slow { animation: spin 4s linear infinite; }
      `}</style>
    </div>
  );
};

export default ShareModal;
