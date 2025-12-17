import React, { useState } from 'react';
import { X, Share2, Check, Sparkles } from 'lucide-react';
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

  const handleShare = async () => {
    const shareUrl = `https://zzic.vercel.app/?marketId=${item.marketId}`;
    
    // 이모지 선택: YES(상승/긍정) vs NO(하락/부정)
    const emoji = item.prediction === 'YES' ? '📈' : '📉';
    
    const shareData = {
        title: 'ZZIC - 너의 촉을 믿어봐',
        text: `[ZZIC 예언 적중 기원]\n\n🏆 주제: ${item.marketTitle}\n\n${emoji} 나의 예측: [ ${item.prediction} ]\n\n이 골드바의 기운을 받아가세요! 👇`,
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300 p-6">
      <div className="relative w-full max-w-[320px] flex flex-col gap-6">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/50 hover:text-white p-2 transition-all active:scale-95"
        >
          <X size={24} />
        </button>

        {/* REALISTIC GOLD BAR (Bullion Style) */}
        <div 
            className="w-full aspect-[9/15] relative rounded-[2rem] shadow-[0_20px_60px_-10px_rgba(234,179,8,0.5)] select-none group transform transition-transform hover:scale-[1.02]"
            style={{
                // Base Gold Gradient
                background: 'linear-gradient(135deg, #FBF5C7 0%, #FFD700 25%, #F59E0B 50%, #B45309 80%, #713F12 100%)',
                // Heavy Bevel Effect via Box Shadow
                boxShadow: `
                    inset 2px 2px 4px rgba(255, 255, 255, 0.7),
                    inset -2px -2px 4px rgba(0, 0, 0, 0.4),
                    inset 8px 8px 16px rgba(255, 215, 0, 0.2),
                    inset -8px -8px 16px rgba(180, 83, 9, 0.4),
                    0 25px 50px -12px rgba(0, 0, 0, 0.5)
                `
            }}
        >
            {/* Brushed Metal Texture Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay rounded-[2rem]" 
                 style={{ 
                     backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                     backgroundSize: '100px 100px'
                 }}>
            </div>

            {/* Shine / Glare Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-40 rounded-[2rem] pointer-events-none"></div>

            {/* Engraved Content Container */}
            <div className="absolute inset-4 rounded-[1.5rem] border border-[#B45309]/20 flex flex-col items-center justify-between py-6 px-4 text-center z-10"
                 style={{
                     boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1), inset -1px -1px 2px rgba(255,255,255,0.3)'
                 }}
            >
                {/* Top Stamp: Brand & Purity */}
                <div className="space-y-2 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border-2 border-[#854d0e] flex items-center justify-center mb-1 opacity-70" style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.3), 1px 1px 0 rgba(255,255,255,0.2)' }}>
                        <span className="text-xl font-black italic text-[#854d0e]">Z</span>
                    </div>
                    <h2 className="text-xl font-black tracking-widest text-[#713F12]" 
                        style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.4), -1px -1px 0 rgba(0,0,0,0.2)' }}>
                        ZZIC
                    </h2>
                    <div className="text-[10px] font-bold tracking-[0.3em] text-[#92400e] uppercase scale-x-90">
                        Fine Gold 999.9
                    </div>
                </div>

                {/* Middle: The Proposition (Engraved Text) */}
                <div className="flex-1 flex flex-col items-center justify-center w-full space-y-6">
                    <div className="w-full px-2">
                         <p className="text-xs font-serif font-bold text-[#78350f] leading-relaxed break-keep line-clamp-3 opacity-90"
                            style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.3), -0.5px -0.5px 0 rgba(0,0,0,0.2)' }}
                         >
                            "{item.marketTitle}"
                        </p>
                    </div>

                    {/* The Prediction Stamp (Deep Press Effect) */}
                    <div className="relative group-hover:scale-105 transition-transform duration-500">
                        <div className="absolute inset-0 bg-black/10 blur-md rounded-lg transform translate-y-1"></div>
                        <div className="relative px-8 py-3 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-lg border-2 border-[#92400e]/30 flex items-center justify-center"
                             style={{
                                 boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(255,255,255,0.2)'
                             }}
                        >
                            <span className={`text-4xl font-black italic tracking-tighter drop-shadow-sm 
                                ${item.prediction === 'YES' ? 'text-blue-900' : 'text-red-900'}`}
                                style={{ 
                                    textShadow: '0 1px 1px rgba(255,255,255,0.3)'
                                }}
                            >
                                {item.prediction}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom: Weight & Serial */}
                <div className="w-full space-y-2 pb-2">
                    <div className="flex items-center justify-center gap-2 opacity-80">
                        <div className="h-[1px] w-8 bg-[#92400e]"></div>
                        <span className="text-[9px] font-black text-[#713F12]">NET WT 1000g</span>
                        <div className="h-[1px] w-8 bg-[#92400e]"></div>
                    </div>
                    <div className="pt-2 border-t border-[#92400e]/20 w-3/4 mx-auto">
                        <div className="text-[8px] font-mono text-[#78350f] tracking-widest font-bold">
                            NO. {item.id.slice(-8).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2">
            <button 
                onClick={handleShare}
                className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95
                ${isCopied ? 'bg-white text-black' : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black'}`}
            >
                {isCopied ? <Check size={18} /> : <Share2 size={18} />}
                {isCopied ? t('share_copied') : t('share_btn')}
            </button>
            <div className="text-center mt-1">
                <p className="text-[10px] text-zinc-500 flex items-center justify-center gap-1.5 opacity-80">
                    <Sparkles size={10} className="text-yellow-500" />
                    부자되세요! 인스타 스토리에 공유해보세요
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ShareModal;