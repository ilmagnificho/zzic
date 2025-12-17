import React, { useState } from 'react';
import { X, Share2, Check, Sparkles, Copy } from 'lucide-react';
import { PortfolioItem } from '../types';
import { TRANSLATIONS, Language } from '../translations';

interface ShareModalProps {
  item: PortfolioItem;
  onClose: () => void;
  language: Language;
}

const ShareModal: React.FC<ShareModalProps> = ({ item, onClose, language }) => {
  const t = (key: keyof typeof TRANSLATIONS['ko']) => TRANSLATIONS[language][key];
  const [isCopied, setIsCopied] = useState(false);

  // [Fix 2] Remove category tags like [날씨], [코인] using Regex
  const displayTitle = item.marketTitle.replace(/^\[.*?\]\s*/, '');

  const handleShare = async () => {
    const shareUrl = `https://zzic.vercel.app/?marketId=${item.marketId}`;
    
    // 이모지 선택: YES(상승/긍정) vs NO(하락/부정)
    const emoji = item.prediction === 'YES' ? '📈' : '📉';
    
    const shareData = {
        title: 'ZZIC - 너의 촉을 믿어봐',
        text: `[ZZIC 예언 적중 기원]\n\n🏆 주제: ${displayTitle}\n\n${emoji} 나의 예측: [ ${item.prediction} ]\n\n이 골드바의 기운을 받아가세요! 👇`,
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
        
        {/* [Fix 1] Close Button: Better visibility and positioning */}
        <button 
          onClick={onClose}
          className="absolute -top-14 right-0 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-all active:scale-95 backdrop-blur-sm border border-white/10"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* --- REALISTIC GOLD BAR (Bullion Style v2) --- */}
        <div 
            className="w-full aspect-[9/15] relative rounded-[1.5rem] select-none group transform transition-transform duration-500 hover:scale-[1.01]"
            style={{
                // Complex Metallic Gradient for Shine
                background: 'linear-gradient(110deg, #b46b00 0%, #fde047 15%, #fcd34d 25%, #d97706 45%, #b45309 50%, #d97706 55%, #fcd34d 75%, #fde047 85%, #b46b00 100%)',
                // Heavy 3D Bevel Effect
                boxShadow: `
                    0 20px 50px -10px rgba(0, 0, 0, 0.7),
                    inset 2px 2px 5px rgba(255, 255, 255, 0.9),
                    inset -4px -4px 10px rgba(120, 53, 15, 0.5)
                `
            }}
        >
            {/* Texture: Brushed Metal (Noise) */}
            <div className="absolute inset-2 rounded-[1.2rem] opacity-30 pointer-events-none mix-blend-overlay border border-yellow-900/10" 
                 style={{ 
                     backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                 }}>
            </div>

            {/* Content Container (Recessed look) */}
            <div className="absolute inset-3 rounded-[1rem] border-2 border-[#92400e]/20 flex flex-col items-center justify-between py-6 px-4 text-center z-10"
                 style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                    boxShadow: 'inset 4px 4px 10px rgba(146, 64, 14, 0.2), inset -2px -2px 5px rgba(255,255,255,0.3)'
                 }}
            >
                {/* 1. Header: Brand */}
                <div className="w-full flex flex-col items-center gap-1 pt-2">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-[1px] w-8 bg-[#78350f]/40"></div>
                        <div className="text-[10px] font-black text-[#78350f] tracking-[0.3em] uppercase scale-x-90 drop-shadow-sm">
                            Pure Gold
                        </div>
                        <div className="h-[1px] w-8 bg-[#78350f]/40"></div>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-[#451a03]" 
                        style={{ 
                            fontFamily: 'serif',
                            textShadow: '1px 1px 0px rgba(255,255,255,0.4), -1px -1px 0px rgba(180,83,9,0.1)' 
                        }}>
                        ZZIC
                    </h1>
                    <div className="text-[8px] font-bold text-[#92400e] uppercase tracking-widest border border-[#92400e] px-2 py-0.5 rounded-sm">
                        999.9 FINE
                    </div>
                </div>

                {/* 2. Main Content: The Topic & Prediction */}
                <div className="flex-1 w-full flex flex-col items-center justify-center gap-6">
                    
                    {/* [Fix 3] Topic Title: Increased Font Size & Max Contrast */}
                    <div className="w-full relative px-1">
                        <p className="text-2xl font-black text-[#1a0f00] leading-snug break-keep text-center font-serif tracking-tight"
                           style={{ 
                               // Sharp white shadow for engraving effect
                               textShadow: '0 1px 0 rgba(255,255,255,0.6)' 
                           }}
                        >
                           "{displayTitle}"
                        </p>
                    </div>

                    {/* The Prediction Stamp (Embossed Box) */}
                    <div className="relative w-full max-w-[200px] group-hover:scale-105 transition-transform duration-500 ease-out">
                         {/* Shine effect across the stamp */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite]"></div>
                        
                        <div className="relative bg-gradient-to-b from-[#f59e0b] to-[#d97706] rounded-xl border border-[#b45309]/50 p-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_4px_8px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center gap-1">
                            <span className="text-[9px] font-bold text-[#78350f] uppercase tracking-widest opacity-80">Prediction</span>
                            <span className={`text-5xl font-black italic tracking-tighter drop-shadow-sm 
                                ${item.prediction === 'YES' ? 'text-blue-900' : 'text-red-900'}`}
                                style={{ 
                                    textShadow: '1px 1px 0 rgba(255,255,255,0.3)'
                                }}
                            >
                                {item.prediction}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. Footer: Details */}
                <div className="w-full space-y-3 pb-2">
                     <p className="text-[10px] font-bold text-[#78350f] opacity-90 break-keep leading-tight">
                        위 예측이 적중할 시<br/>이 부적을 소유한 자에게 행운이 깃듭니다.
                    </p>
                    
                    {/* Serial Number Plate */}
                    <div className="w-full border-t border-[#78350f]/20 pt-2 flex justify-between items-end px-2">
                        <div className="flex flex-col items-start">
                             <span className="text-[8px] font-bold text-[#92400e]">WEIGHT</span>
                             <span className="text-[10px] font-black text-[#451a03]">1000g</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-bold text-[#92400e]">SERIAL NO.</span>
                            <span className="text-[10px] font-mono font-bold text-[#451a03] tracking-wider">{item.id.slice(-8).toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Reflection Glare (Overall) */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/20 to-transparent skew-x-[-20deg] pointer-events-none rounded-[1.5rem]"></div>
        </div>
        
        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
            <button 
                onClick={handleShare}
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 border
                ${isCopied 
                    ? 'bg-white text-black border-white' 
                    : 'bg-[#FFE135] text-black border-[#FCD34D] hover:bg-[#FFD700]'}`}
            >
                {isCopied ? <Check size={18} /> : <Share2 size={18} />}
                {isCopied ? t('share_copied') : t('share_btn')}
            </button>
            <div className="text-center">
                <p className="text-[11px] text-zinc-500 flex items-center justify-center gap-1.5 font-bold">
                    <Sparkles size={12} className="text-yellow-500 fill-yellow-500" />
                    부자되세요! 인스타 스토리에 공유해보세요
                </p>
            </div>
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