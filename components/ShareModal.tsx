
import React, { useState } from 'react';
import { X, Share2, Check, QrCode, Fingerprint, Snowflake, Coins, Ticket } from 'lucide-react';
import { PortfolioItem, Market } from '../types';
import { TRANSLATIONS, Language } from '../translations';

interface ShareModalProps {
  item: PortfolioItem;
  market?: Market;
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
      case 'WEATHER': // Style: Frost Glass / Ice Amulet
        return {
          type: 'FROST',
          containerClass: 'rounded-[2rem] border-2 border-white/40 shadow-[0_20px_50px_-10px_rgba(14,165,233,0.5)]',
          bg: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(224,242,254,0.2) 50%, rgba(14,165,233,0.1) 100%)',
          textColor: 'text-white',
          accentColor: 'text-cyan-200',
          label: 'WEATHER FORECAST',
          icon: <Snowflake size={24} className="text-cyan-200 animate-pulse" />,
          textureOpacity: 0.6
        };
      case 'ENTER': // Style: Holographic Ticket
      case 'SPORTS':
        return {
          type: 'TICKET',
          containerClass: 'rounded-xl border-x-2 border-y-0 border-pink-500/50 shadow-[0_0_30px_-5px_rgba(236,72,153,0.6)] clip-path-ticket',
          bg: 'repeating-linear-gradient(45deg, #18181b, #18181b 10px, #27272a 10px, #27272a 20px)',
          textColor: 'text-white',
          accentColor: 'text-pink-400',
          label: 'OFFICIAL TICKET',
          icon: <Ticket size={24} className="text-pink-500" />,
          textureOpacity: 0.1
        };
      case 'COIN': // Style: Gold Bar
      case 'STOCK':
      default:
        return {
          type: 'GOLD',
          containerClass: 'rounded-[4px] rounded-tr-[2rem] rounded-bl-[2rem] border-4 border-[#b45309] shadow-[0_20px_40px_-5px_rgba(0,0,0,0.8)]',
          bg: 'linear-gradient(110deg, #854d0e 0%, #facc15 15%, #fef08a 25%, #ca8a04 45%, #a16207 50%, #ca8a04 55%, #fef08a 75%, #facc15 85%, #854d0e 100%)',
          textColor: 'text-[#451a03]',
          accentColor: 'text-[#78350f]',
          label: '999.9 PURE LUCK',
          icon: <Coins size={24} className="text-[#78350f]" />,
          textureOpacity: 0.3
        };
    }
  };

  const style = getCardStyle();

  const handleShare = async () => {
    // 1. Dynamic Text Construction based on Market Type
    let shareText = '';
    
    if (category === 'WEATHER') {
        shareText = `[ZZIC 기상청 속보] ☃️\n\n"${displayTitle}"\n\n제 예측은 [ ${item.prediction === 'YES' ? '눈 온다 ❄️' : '안 온다 ☀️'} ] 입니다.\n함께 결과를 지켜보시죠!`;
    } else if (category === 'COIN' || category === 'STOCK') {
        shareText = `[ZZIC 투자 주의보] 💎\n\n"${displayTitle}"\n\n저는 [ ${item.prediction === 'YES' ? '간다! 🚀' : '안 간다! 📉'} ] 에 걸었습니다.\n이 황금 부적의 기운을 받으세요!`;
    } else {
        shareText = `[ZZIC 찌라시] ⚡️\n\n"${displayTitle}"\n\n${predictionEmoji} 저의 촉은 [ ${item.prediction} ] 입니다.\n성지순례 미리 오세요!`;
    }

    const shareUrl = `https://zzic.vercel.app/?marketId=${item.marketId}`;
    
    const shareData = {
        title: 'ZZIC - 너의 촉을 믿어봐',
        text: `${shareText}\n👇 투표 하러가기`,
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

        {/* --- DYNAMIC CARD RENDERER --- */}
        <div 
            className={`w-full aspect-[3/4.5] relative select-none group transform transition-transform duration-500 hover:scale-[1.01] overflow-hidden flex flex-col ${style.containerClass}`}
            style={{ background: style.bg }}
        >
            {/* Texture Layer */}
            <div className="absolute inset-0 pointer-events-none mix-blend-overlay" 
                 style={{ 
                     opacity: style.textureOpacity,
                     backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                 }}>
            </div>

            {/* Frost/Glass Effect Layer (Weather Only) */}
            {style.type === 'FROST' && (
                <div className="absolute inset-0 backdrop-blur-sm bg-white/10"></div>
            )}

            {/* Content Container */}
            <div className="relative z-10 flex-1 flex flex-col p-6 h-full">
                
                {/* Header */}
                <div className="flex justify-between items-start border-b pb-4 mb-4" style={{ borderColor: style.type === 'GOLD' ? '#78350f' : 'rgba(255,255,255,0.3)' }}>
                    <div className="flex flex-col">
                        <span className={`text-[10px] font-black tracking-[0.2em] ${style.accentColor}`}>{style.label}</span>
                        <span className={`text-2xl font-black italic tracking-tighter ${style.textColor}`}>ZZIC</span>
                    </div>
                    <div>{style.icon}</div>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
                    <h2 className={`text-xl font-bold leading-tight break-keep ${style.textColor}`} style={{ textShadow: style.type === 'GOLD' ? '0 1px 0 rgba(255,255,255,0.4)' : '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {displayTitle}
                    </h2>

                    {/* Prediction Stamp */}
                    <div className="relative">
                        {style.type === 'GOLD' ? (
                            <div className="border-4 border-[#78350f] rounded-lg p-4 bg-[#b45309]/10 shadow-inner transform -rotate-6">
                                <div className="text-[10px] font-black text-[#78350f] uppercase mb-1">PREDICTION</div>
                                <div className={`text-5xl font-black ${item.prediction === 'YES' ? 'text-blue-900' : 'text-red-900'}`}>{item.prediction}</div>
                            </div>
                        ) : style.type === 'FROST' ? (
                             <div className="rounded-full w-32 h-32 border-4 border-white/50 flex flex-col items-center justify-center bg-white/20 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                                <div className="text-[10px] font-bold text-white mb-1">MY CHOICE</div>
                                <div className={`text-4xl font-black ${item.prediction === 'YES' ? 'text-blue-100' : 'text-pink-100'}`}>{item.prediction}</div>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-pink-500/50 p-2 rounded bg-black/50">
                                <div className="border border-pink-500 px-6 py-3 rounded bg-pink-500/10">
                                    <div className="text-4xl font-black text-white drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]">{item.prediction}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t flex justify-between items-end" style={{ borderColor: style.type === 'GOLD' ? '#78350f' : 'rgba(255,255,255,0.3)' }}>
                    <div className="flex flex-col">
                        <span className={`text-[8px] font-bold ${style.accentColor}`}>DATE</span>
                        <span className={`text-[10px] font-mono font-bold ${style.textColor}`}>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                    {style.type === 'TICKET' ? <QrCode className="text-white opacity-80" size={32}/> : <Fingerprint className={style.type === 'GOLD' ? 'text-[#78350f]' : 'text-white'} opacity={0.5} size={32}/>}
                </div>
            </div>

            {/* Shine Effect */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-shine" />
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
        @keyframes shine {
            100% {
                left: 125%;
            }
        }
        .animate-shine {
            animation: shine 3s infinite;
        }
        .clip-path-ticket {
            clip-path: polygon(
                0% 0%, 100% 0%, 100% 100%, 0% 100%,
                0% 70%, 5% 65%, 0% 60%,
                100% 60%, 95% 65%, 100% 70%
            );
        }
      `}</style>
    </div>
  );
};

export default ShareModal;
