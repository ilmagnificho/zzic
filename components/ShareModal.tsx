import React, { useState } from 'react';
import { X, Share2, Sparkles, Download, Copy, Check } from 'lucide-react';
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
    // [FIX] Correct deep link URL with marketId
    const shareUrl = `https://zzic.app/?marketId=${item.marketId}`;
    
    const shareData = {
        title: 'ZZIC - 너의 촉을 믿어봐',
        text: `[ZZIC] ${item.marketTitle}\n\n🧧 부적을 확인하고 예측에 참여하세요!\n나의 예측: ${item.prediction === 'YES' ? '⭕️ YES' : '❌ NO'}\n\n👇 지금 바로 성지순례`,
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
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="min-h-full flex items-center justify-center p-4 py-8">
        
        <div className="relative w-full max-w-[340px] transform scale-100 transition-all">
          
          {/* Close Button */}
          <div className="flex justify-end mb-4">
             <button 
              onClick={onClose}
              className="text-white/70 hover:text-white p-2.5 bg-zinc-800/80 rounded-full backdrop-blur-md transition-all active:scale-95 border border-zinc-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* TALISMAN CARD DESIGN (Real Bujeok Vibe) */}
          <div className="bg-[#e8d5b5] text-black p-0 rounded-sm shadow-[0_0_60px_rgba(255,100,0,0.2)] relative overflow-hidden select-none mx-auto border-[6px] border-[#8b0000]">
              
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-80 mix-blend-multiply pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#d4b483]/30 to-[#8b5a2b]/20 pointer-events-none"></div>

              {/* Decorative Corners (Traditional Patterns) */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#8b0000] opacity-60"></div>
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#8b0000] opacity-60"></div>
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#8b0000] opacity-60"></div>
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#8b0000] opacity-60"></div>

              <div className="px-6 py-10 text-center relative flex flex-col items-center">
                  
                  {/* Top Seal */}
                  <div className="w-16 h-16 border-[3px] border-red-700 rounded-full flex items-center justify-center mb-6 opacity-90 shadow-sm mix-blend-multiply bg-red-700/5 rotate-12">
                      <div className="w-14 h-14 border border-red-700 rounded-full flex items-center justify-center border-dashed">
                        <span className="text-red-700 font-serif font-black text-xs leading-none transform -rotate-12 block vertical-text">
                            천기<br/>누설
                        </span>
                      </div>
                  </div>

                  {/* Vertical Text Title (Simulated) */}
                  <div className="flex justify-center gap-2 mb-4">
                      <div className="flex flex-col text-[10px] font-serif font-bold text-[#8b0000] opacity-80 border-r border-[#8b0000]/30 pr-2">
                          <span>이</span><span>천</span><span>이</span><span>십</span><span>육</span>
                      </div>
                      <div className="flex flex-col text-xs font-serif font-black text-black tracking-widest">
                          <span>대</span><span>박</span><span>기</span><span>원</span>
                      </div>
                  </div>

                  {/* Main Header */}
                  <h2 className="text-3xl font-serif font-black text-[#8b0000] mb-8 tracking-widest drop-shadow-sm mix-blend-color-burn">
                     성 지 순 례
                  </h2>

                  {/* Prediction Box */}
                  <div className="w-full bg-[#fdfbf7] border-2 border-black/80 p-5 mb-8 relative shadow-md transform rotate-[-1deg]">
                       <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider">Prediction</div>
                       <p className="text-sm font-bold text-gray-900 mb-3 line-clamp-2 break-keep leading-relaxed font-serif">
                           {item.marketTitle}
                       </p>
                       <div className="w-full h-px bg-black/20 my-3"></div>
                       <div className="flex items-center justify-center gap-4">
                          <span className="text-xs font-serif font-bold text-gray-500">선택</span>
                          <span className={`text-4xl font-serif font-black italic ${item.prediction === 'YES' ? 'text-blue-800' : 'text-red-800'} mix-blend-multiply transform scale-y-110`}>
                              {item.prediction}
                          </span>
                       </div>
                  </div>

                  {/* Footer Message (Charm) */}
                  <p className="text-xs font-serif font-bold text-[#5c4033] mb-8 leading-loose tracking-wide">
                      이 부적을 지니고 있으면<br/>
                      당신의 <span className="text-red-700 underline decoration-wavy underline-offset-4">직감</span>이 현실이 됩니다.
                  </p>

                  {/* Bottom Tear-off Section Design */}
                  <div className="w-full border-t-2 border-dashed border-black/30 pt-4 flex justify-between items-end opacity-70">
                      <div className="text-[9px] font-mono text-black/60 text-left">
                          SERIAL NO.<br/>{item.id.slice(-8).toUpperCase()}
                      </div>
                      <div className="text-right">
                         <span className="text-[10px] font-black tracking-[0.5em] block mb-1">ZZIC</span>
                         <div className="w-12 h-12 border-4 border-red-700 opacity-50 flex items-center justify-center transform rotate-6 mix-blend-multiply">
                            <span className="text-red-700 font-serif text-[10px] font-black">적중</span>
                         </div>
                      </div>
                  </div>
              </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-3">
               <div className="bg-zinc-900/90 backdrop-blur text-zinc-300 text-xs text-center py-3 rounded-xl flex items-center justify-center gap-2 border border-zinc-700/50 shadow-lg">
                  <Sparkles size={14} className="text-yellow-400 fill-yellow-400 animate-pulse"/> 
                  <span className="font-bold">화면을 캡처해서 스토리에 올려보세요!</span>
              </div>
              <button 
                  onClick={handleShare}
                  className={`w-full font-black py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:scale-[1.02] active:scale-95 border-2 ${
                      isCopied 
                      ? 'bg-white text-black border-white' 
                      : 'bg-zzic text-black border-zzic hover:bg-[#b3e600]'
                  }`}
              >
                  {isCopied ? <Check size={20} strokeWidth={3} /> : <Share2 size={20} strokeWidth={3} />}
                  <span className="text-sm tracking-wide">{isCopied ? t('share_copied') : t('share_btn')}</span>
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;