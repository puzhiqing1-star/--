import React, { useState } from 'react';
import { LetterMatchingGame } from './games/LetterMatchingGame';
import { WordSpellingGame } from './games/WordSpellingGame';
import { Sparkles, Gamepad2, Layers, SpellCheck } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface InteractiveGamesHubProps {
  initialSubTab?: 'matching' | 'spelling';
}

export function InteractiveGamesHub({ initialSubTab = 'matching' }: InteractiveGamesHubProps) {
  const [subTab, setSubTab] = useState<'matching' | 'spelling'>(initialSubTab);

  const handleSubTabChange = (tab: 'matching' | 'spelling') => {
    setSubTab(tab);
    audioEngine.playPop(750);
  };

  return (
    <div className="space-y-5">
      {/* Game Selector Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-3xl p-5 shadow-[0_6px_0_#C2410C] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-inner border border-white/30">
            🎮
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black">
              自然拼读互动游戏乐园
            </h2>
            <p className="text-xs md:text-sm font-bold text-white/90">
              通过趣味配对与拼词闯关，告别死记硬背，玩中学、学中练！
            </p>
          </div>
        </div>

        {/* Sub Game Switcher */}
        <div className="bg-black/20 p-1.5 rounded-2xl flex items-center gap-1">
          <button
            onClick={() => handleSubTabChange('matching')}
            className={`btn-3d px-3.5 py-2 rounded-xl text-xs md:text-sm font-black flex items-center gap-1.5 cursor-pointer transition-all ${
              subTab === 'matching'
                ? 'bg-white text-slate-800 shadow-[0_3px_0_#CBD5E1]'
                : 'text-white hover:bg-white/10 shadow-none'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-500" />
            <span>游戏一：字母对对碰</span>
          </button>
          <button
            onClick={() => handleSubTabChange('spelling')}
            className={`btn-3d px-3.5 py-2 rounded-xl text-xs md:text-sm font-black flex items-center gap-1.5 cursor-pointer transition-all ${
              subTab === 'spelling'
                ? 'bg-white text-slate-800 shadow-[0_3px_0_#CBD5E1]'
                : 'text-white hover:bg-white/10 shadow-none'
            }`}
          >
            <SpellCheck className="w-4 h-4 text-purple-500" />
            <span>游戏二：单词气球填空</span>
          </button>
        </div>
      </div>

      {/* Render Active Game */}
      {subTab === 'matching' ? <LetterMatchingGame /> : <WordSpellingGame />}
    </div>
  );
}
