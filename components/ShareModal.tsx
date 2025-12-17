import React, { useState } from 'react';
import { X, Share2, Check, Sparkles } from 'lucide-react';
import { PortfolioItem, Market } from '../types';
import { TRANSLATIONS, Language } from '../translations';

interface ShareModalProps {
  item: PortfolioItem;
  market?: Market; // Added to access category and description
  onClose: () => void;
  language: Language;
}

const ShareModal: React.FC<ShareModalProps> = ({ item, market, onClose, language }) => {
  const t = (key: keyof typeof TRANSLATIONS['ko']) => TRANSLATIONS[language][key];
  const [isCopied, setIsCopied] = useState(false);

  const displayTitle = item.marketTitle;
  const category = market?.category || 'STOCK';
  const predictionEmoji = item.prediction === 'YES' ? '📈' : '📉';

  // --- STYLING LOGIC ---
  const getCardStyle = () => {
    switch (category) {
      case 'WEATHER': // Ice Theme
        return {
          bg: 'linear-gradient(135deg, #e0f2fe 0%, #7dd3fc 50%, #0ea5e9 100%)',
          border: 'border-cyan-200',
          shadow: 'shadow-[0_20px_50px_-10px_rgba(14,165,233,0.5)]',
          textColor: 'text-cyan-950',
          accentColor: 'text-cyan-700',
          label: 'FROSTED LUCK',
          texture: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
          icon: '❄️'
        };
      case 'COIN': // Gold Bar Theme
      case 'STOCK':
        return {
          bg: 'linear-gradient(110deg, #b46b00 0%, #fde047 15%, #fcd34d 25%, #d97706 45%, #b45309 50%, #d97706 55%, #fcd34d 75%, #fde047 85%, #b46b00 100%)',
          border: 'border-yellow-600/30',
          shadow: 'shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)]',
          textColor: 'text-[#451a03]',
          accentColor: 'text-[#92400e]',
          label: '999.9 FINE GOLD',
          texture: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          icon: '💰'
        };
      default: // Holographic/Neon Theme (Enter, Sports, Tech)
        return {
          bg: 'linear-gradient(135deg, #3b0764 0%, #7e22ce 50%, #ec4899 100%)',
          border: 'border-purple-500/30',
          shadow: 'shadow-[0_20px_50px_-10px_rgba(126,34,206,0.6)]',
          textColor: 'text-white',
          accentColor: 'text-purple-200',
          label: 'VIP ACCESS',
          texture: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='p' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='10' cy='10' r='1' fill='rgba(255,255,255,0.2)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23p)'/%3E%3C/svg%3E")`,
          icon: '🎟️'
        };
    }
  };

  const style = getCardStyle();

  const handleShare = async () => {
    const shareUrl = `https://zzic.vercel.app/?marketId=${item.marketId}`;
    const shareData = {
        title: 'ZZIC - 너의 촉을 믿어봐',
        text: `[ZZIC 예언 적중 기원]\n\n🏆 주제: ${displayTitle}\n\n${predictionEmoji} 나의 예측: [ ${item.prediction} ]\n\n이 부적의 기운을 받아가세요! 👇`,
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300 p-6">
      <div className="relative w-full max-w-[340px] flex flex-col gap-6">
        
        <button 
          onClick={onClose}
          className="absolute -top-14 right-0 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-all active:scale-95 backdrop-blur-sm border border-white/10"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* --- DYNAMIC CARD DESIGN --- */}
        <div 
            className={`w-full aspect-[9/14] relative rounded-[1.5rem] select-none group transform transition-transform duration-500 hover:scale-[1.01] ${style.shadow}`}
            style={{ background: style.bg }}
        >
            {/* Texture Overlay */}
            <div className="absolute inset-2 rounded-[1.2rem] opacity-30 pointer-events-none mix-blend-overlay border border-white/20" 
                 style={{ backgroundImage: style.texture }}>
            </div>

            {/* Inner Content Container */}
            <div className={`absolute inset-3 rounded-[1rem] border-2 ${style.border} flex flex-col items-center justify-between py-6 px-4 text-center z-10`}
                 style={{
                    background: category === 'COIN' ? 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)' : 'rgba(255,255,255,0.1)',
                    backdropFilter: category !== 'COIN' ? 'blur(4px)' : 'none'
                 }}
            >
                {/* 1. Header */}
                <div className="w-full flex flex-col items-center gap-1 pt-2">
                    <div className="flex items-center gap-2 mb-1">
                        <div className={`h-[1px] w-8 ${category === 'ENTER' ? 'bg-white/40' : 'bg-black/20'}`}></div>
                        <div className={`text-[10px] font-black tracking-[0.3em] uppercase scale-x-90 ${style.accentColor}`}>
                            {style.label}
                        </div>
                        <div className={`h-[1px] w-8 ${category === 'ENTER' ? 'bg-white/40' : 'bg-black/20'}`}></div>
                    </div>
                    <h1 className={`text-4xl font-black tracking-tighter ${style.textColor}`} 
                        style={{ fontFamily: 'serif', textShadow: category === 'ENTER' ? '0 2px 10px rgba(0,0,0,0.5)' : 'none' }}>
                        ZZIC
                    </h1>
                </div>

                {/* 2. Main Content */}
                <div className="flex-1 w-full flex flex-col items-center justify-center gap-6">
                    <div className="w-full relative px-1">
                        <p className={`text-2xl font-black leading-snug break-keep text-center font-serif tracking-tight ${style.textColor}`}
                           style={{ textShadow: category === 'COIN' ? '0 1px 0 rgba(255,255,255,0.6)' : '0 2px 4px rgba(0,0,0,0.2)' }}
                        >
                           "{displayTitle}"
                        </p>
                    </div>

                    {/* Prediction Stamp */}
                    <div className="relative w-full max-w-[200px] group-hover:scale-105 transition-transform duration-500 ease-out">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite]"></div>
                        
                        <div className={`relative rounded-xl border p-4 shadow-lg flex flex-col items-center justify-center gap-1
                            ${category === 'WEATHER' ? 'bg-white/30 border-white/50' : 
                              category === 'COIN' ? 'bg-gradient-to-b from-[#f59e0b] to-[#d97706] border-[#b45309]/50' : 
                              'bg-black/40 border-purple-400/50'}`}>
                            
                            <span className={`text-[9px] font-bold uppercase tracking-widest opacity-80 ${category === 'COIN' ? 'text-[#78350f]' : 'text-white'}`}>
                                MY PREDICTION
                            </span>
                            <span className={`text-5xl font-black italic tracking-tighter drop-shadow-sm 
                                ${category === 'COIN' 
                                    ? (item.prediction === 'YES' ? 'text-blue-900' : 'text-red-900') 
                                    : (item.prediction === 'YES' ? 'text-blue-200' : 'text-pink-300')}`}
                            >
                                {item.prediction}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. Footer */}
                <div className="w-full space-y-3 pb-2">
                     <p className={`text-[10px] font-bold opacity-90 break-keep leading-tight ${style.accentColor}`}>
                        위 예측이 적중할 시<br/>이 부적을 소유한 자에게 {style.icon} 행운이 깃듭니다.
                    </p>
                    <div className={`w-full border-t pt-2 flex justify-between items-end px-2 ${category==='ENTER' ? 'border-white/20' : 'border-black/10'}`}>
                        <div className="flex flex-col items-start">
                             <span className={`text-[8px] font-bold ${style.accentColor}`}>DATE</span>
                             <span className={`text-[10px] font-black ${style.textColor}`}>{new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className={`text-[8px] font-bold ${style.accentColor}`}>SERIAL NO.</span>
                            <span className={`text-[10px] font-mono font-bold tracking-wider ${style.textColor}`}>{item.id.slice(-8).toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Glare Effect */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/20 to-transparent skew-x-[-20deg] pointer-events-none rounded-[1.5rem]"></div>
        </div>
        
        {/* Buttons */}
        <div className="w-full flex flex-col gap-3">
            <button 
                onClick={handleShare}
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 border
                ${isCopied ? 'bg-white text-black border-white' : 'bg-zzic text-black border-zzic hover:bg-[#b3e600]'}`}
            >
                {isCopied ? <Check size={18} /> : <Share2 size={18} />}
                {isCopied ? t('share_copied') : t('share_btn')}
            </button>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
            0% { transform: translateX(-150%) skewX(-20deg); }
            50% { transform: translateX(150%) skewX(-20deg); }
            100% { transform: translateX(150%) skewX(-20deg); }
        }
      `}</style>
    </div>
  );
};

export default ShareModal;