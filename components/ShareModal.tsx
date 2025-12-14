import React from 'react';
import { X, Share2, Zap } from 'lucide-react';
import { PortfolioItem } from '../types';
import { TRANSLATIONS, Language } from '../translations';

interface ShareModalProps {
  item: PortfolioItem;
  onClose: () => void;
  language: Language;
}

const ShareModal: React.FC<ShareModalProps> = ({ item, onClose, language }) => {
  const t = (key: keyof typeof TRANSLATIONS['ko']) => TRANSLATIONS[language][key];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl transform scale-100 transition-all">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white z-20 p-2"
        >
          <X size={24} />
        </button>

        {/* Card Content - Designed for Screenshot */}
        <div className="bg-[#0a0a0a] p-8 text-center relative overflow-hidden">
          {/* Background Effects - Acid Lime */}
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-zzic blur-[100px] opacity-10"></div>
          <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-zzic blur-[100px] opacity-10"></div>
          
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Stamp */}
            <div className="border border-zzic text-zzic px-3 py-1 rounded font-black text-xs tracking-widest mb-6 rotate-[-2deg]">
              TRUST YOUR ZZIC
            </div>

            <h2 className="text-xl font-bold text-gray-200 mb-2 leading-tight line-clamp-2 break-keep">
              {item.marketTitle}
            </h2>
            
            <div className="my-8 relative">
                <div className="absolute inset-0 bg-zzic blur-[40px] opacity-10 rounded-full"></div>
                <div className={`relative text-7xl font-black italic tracking-tighter transform -rotate-2 ${item.prediction === 'YES' ? 'text-blue-500' : 'text-red-500'}`}>
                    {item.prediction}
                </div>
            </div>

            <div className="w-full bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10">
                <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-500 font-bold">{t('share_bet_amount')}</span>
                    <span className="text-white font-mono font-bold">{item.amount.toLocaleString()} VP</span>
                </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-bold">{t('share_return')}</span>
                    <span className="text-zzic font-mono font-black">
                        {Math.floor(item.amount * item.payoutMultiple).toLocaleString()} VP
                    </span>
                </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-zinc-800 w-full flex flex-col gap-3">
                <button className="w-full bg-zzic text-black font-black py-4 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#b3e600] transition-colors uppercase tracking-tight">
                    <Share2 size={20} />
                    {t('share_btn')}
                </button>
            </div>
          </div>
        </div>

        {/* Footer Brand */}
        <div className="bg-black py-4 text-center border-t border-zinc-900">
            <span className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-black">ZZIC . PREDICT THE FUTURE</span>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;