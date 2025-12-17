import React, { useState, useRef } from 'react';
import { X, Share2, Check, Download, Sparkles } from 'lucide-react';
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
    
    const shareData = {
        title: 'ZZIC - 너의 촉을 믿어봐',
        text: `[ZZIC 성지순례] "${item.marketTitle}"\n\n🧧 저의 예측은 [${item.prediction}]입니다.\n이 부적의 기운을 받아가세요! 👇`,
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300 p-4">
      <div className="relative w-full max-w-[340px] flex flex-col gap-4">
        
        {/* Close Button (Floating outside) */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white p-2 transition-all active:scale-95"
        >
          <X size={24} />
        </button>

        {/* TALISMAN CARD (Fit within view, Trendy Design) */}
        <div 
            className="w-full aspect-[9/14] max-h-[70vh] relative overflow-hidden shadow-[0_0_50px_rgba(255,200,0,0.3)] select-none group"
            style={{
                background: 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)', // Vivid Amber
                boxShadow: 'inset 0 0 40px rgba(180, 83, 9, 0.4)'
            }}
        >
            {/* Background Texture & Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
            </div>
            
            {/* Decorative Borders (Traditional but Graphic) */}
            <div className="absolute top-3 left-3 w-16 h-16 border-t-4 border-l-4 border-red-700/80 rounded-tl-sm"></div>
            <div className="absolute top-3 right-3 w-16 h-16 border-t-4 border-r-4 border-red-700/80 rounded-tr-sm"></div>
            <div className="absolute bottom-3 left-3 w-16 h-16 border-b-4 border-l-4 border-red-700/80 rounded-bl-sm"></div>
            <div className="absolute bottom-3 right-3 w-16 h-16 border-b-4 border-r-4 border-red-700/80 rounded-br-sm"></div>

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col items-center justify-between py-10 px-6 text-center">
                
                {/* Header */}
                <div className="space-y-1">
                    <div className="text-[10px] font-black text-red-800 tracking-[0.5em] opacity-70">OFFICIAL TALISMAN</div>
                    <h2 className="text-3xl font-black text-red-900 tracking-tight font-serif drop-shadow-sm mix-blend-color-burn">
                        적 중 기 원
                    </h2>
                </div>

                {/* Main Prediction */}
                <div className="flex-1 flex flex-col items-center justify-center w-full space-y-4">
                    
                    {/* Market Title */}
                    <div className="w-full bg-red-900/10 border-y-2 border-red-900/20 py-3 px-2 backdrop-blur-sm">
                        <p className="text-sm font-bold text-red-950 font-serif leading-relaxed break-keep line-clamp-3">
                            "{item.marketTitle}"
                        </p>
                    </div>

                    {/* The Giant Stamp (User Choice) */}
                    <div className="relative mt-4 transform group-hover:scale-105 transition-transform duration-500">
                        {/* Stamp Ink Splatter Effect */}
                        <div className="absolute inset-0 bg-red-600 blur-xl opacity-20 rounded-full animate-pulse"></div>
                        
                        <div className={`w-32 h-32 rounded-full border-[6px] flex items-center justify-center transform -rotate-12 bg-red-100/10 backdrop-blur-sm
                            ${item.prediction === 'YES' ? 'border-blue-700 text-blue-700' : 'border-red-700 text-red-700'}
                            shadow-lg`}
                             style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }} // Organic shape
                        >
                            <div className="text-center">
                                <span className="block text-xs font-black uppercase tracking-widest opacity-80 mb-1">Prediction</span>
                                <span className="text-5xl font-black italic tracking-tighter" style={{ fontFamily: 'serif' }}>
                                    {item.prediction}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / Info */}
                <div className="w-full space-y-3">
                    <p className="text-[11px] font-bold text-red-800/80 font-serif break-keep">
                        이 부적은 {item.prediction === 'YES' ? '긍정' : '부정'}의 기운을 담고 있습니다.<br/>
                        지니고 있으면 직감이 현실이 됩니다.
                    </p>
                    
                    {/* Serial & Brand */}
                    <div className="flex justify-between items-end border-t border-red-900/30 pt-3 opacity-70">
                        <div className="text-left">
                            <div className="text-[9px] font-mono text-red-900 font-bold">SERIAL NO.</div>
                            <div className="text-[10px] font-mono text-red-950">{item.id.slice(-8).toUpperCase()}</div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1">
                                <span className="text-lg font-black italic text-red-900">ZZIC</span>
                                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2">
            <button 
                onClick={handleShare}
                className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 border-2
                ${isCopied ? 'bg-white text-black border-white' : 'bg-[#ccff00] text-black border-[#ccff00] hover:bg-[#b3e600]'}`}
            >
                {isCopied ? <Check size={18} /> : <Share2 size={18} />}
                {isCopied ? t('share_copied') : t('share_btn')}
            </button>
            <div className="text-center">
                <p className="text-[10px] text-zinc-500 flex items-center justify-center gap-1.5">
                    <Sparkles size={10} className="text-yellow-500" />
                    캡처해서 인스타 스토리에 올려보세요!
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ShareModal;