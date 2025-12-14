import React from 'react';
import { Home, User, Zap } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Gradient Fade for seamless blend */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none"></div>
      
      <div className="relative pb-safe">
        <div className="flex justify-around items-end h-20 max-w-md mx-auto pb-4 px-6">
            <button
            onClick={() => onChangeView('HOME')}
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
                currentView === 'HOME' || currentView === 'DETAIL' ? 'text-zzic scale-105' : 'text-gray-600 hover:text-gray-400'
            }`}
            >
            <Home size={26} strokeWidth={currentView === 'HOME' ? 2.5 : 2} />
            </button>
            
            <div className="relative -top-4 group cursor-pointer" onClick={() => onChangeView('HOME')}>
                <div className="absolute inset-0 bg-zzic blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                <button
                className="relative bg-zzic text-black p-4 rounded-2xl shadow-[0_0_15px_rgba(204,255,0,0.4)] border-2 border-black transform active:scale-95 transition-all group-hover:rotate-3"
                >
                <Zap size={28} className="fill-black" />
                </button>
            </div>

            <button
            onClick={() => onChangeView('PROFILE')}
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
                currentView === 'PROFILE' ? 'text-zzic scale-105' : 'text-gray-600 hover:text-gray-400'
            }`}
            >
            <User size={26} strokeWidth={currentView === 'PROFILE' ? 2.5 : 2} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;