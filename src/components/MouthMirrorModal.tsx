import React, { useState } from 'react';
import { MOUTH_GUIDES } from '../data/phonicsData';
import { audioEngine } from '../utils/audioEngine';
import { X, Volume2, Sparkles, Smile, Check, ArrowRight } from 'lucide-react';

interface MouthMirrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGuideId?: string;
}

export const MouthMirrorModal: React.FC<MouthMirrorModalProps> = ({
  isOpen,
  onClose,
  initialGuideId,
}) => {
  const [activeIdx, setActiveIdx] = useState<number>(() => {
    if (initialGuideId) {
      const found = MOUTH_GUIDES.findIndex((g) => g.id === initialGuideId);
      if (found >= 0) return found;
    }
    return 0;
  });

  if (!isOpen) return null;

  const currentGuide = MOUTH_GUIDES[activeIdx] || MOUTH_GUIDES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-5 md:p-6 shadow-2xl border-4 border-rose-200 relative overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-xl shadow-md">
              👄
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
                  音标发音镜 · 儿童口型定位
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
                {currentGuide.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers among available guides */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
          {MOUTH_GUIDES.map((g, idx) => (
            <button
              key={g.id}
              onClick={() => {
                setActiveIdx(idx);
                audioEngine.playPop(750);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                activeIdx === idx
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {g.title.split('vs')[0].trim()} 对比
            </button>
          ))}
        </div>

        {/* Comparison Showcase */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <p className="text-xs sm:text-sm font-bold text-slate-600 bg-rose-50/70 p-3 rounded-2xl border border-rose-100 leading-relaxed">
            💡 <span className="font-black text-rose-900">老师秘诀：</span>
            {currentGuide.desc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Pair A */}
            <div className="bg-gradient-to-b from-amber-50 to-orange-50/40 rounded-3xl p-4 border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl">{currentGuide.pairA.emoji}</span>
                  <span className="text-xs font-black bg-white px-2 py-0.5 rounded-full border border-amber-200 text-amber-800">
                    字母: {currentGuide.pairA.letter}
                  </span>
                </div>

                <div className="text-center py-2">
                  <button
                    onClick={() => audioEngine.speakIpaSound(currentGuide.pairA.ipa)}
                    className="text-4xl sm:text-5xl font-mono font-black text-amber-900 hover:text-amber-700 tracking-tight cursor-pointer inline-flex items-center gap-1.5 group transition-transform hover:scale-105"
                    title={`点击只读音标发音: ${currentGuide.pairA.ipa}`}
                  >
                    <span>{currentGuide.pairA.ipa}</span>
                    <Volume2 className="w-5 h-5 text-amber-600 group-hover:scale-110" />
                  </button>
                  <span className="text-xs font-black text-slate-500 block mt-1">
                    代表词: {currentGuide.pairA.word}
                  </span>
                </div>

                <div className="bg-white/80 rounded-2xl p-3 border border-amber-200 text-xs font-bold text-slate-700 leading-snug mt-2">
                  <p className="font-black text-amber-900 mb-1">👄 怎么做口型？</p>
                  <p>{currentGuide.pairA.visualTip}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  onClick={() => audioEngine.speakIpaSound(currentGuide.pairA.ipa)}
                  className="btn-3d py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-black text-xs shadow-[0_3px_0_#B45309] flex items-center justify-center gap-1 cursor-pointer"
                  title="只听音标纯音"
                >
                  <Volume2 className="w-3.5 h-3.5" /> 纯音标
                </button>
                <button
                  onClick={() => {
                    audioEngine.speakWord(currentGuide.pairA.soundCue || currentGuide.pairA.word.split('/')[0].trim());
                  }}
                  className="btn-3d py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs border border-amber-300 flex items-center justify-center gap-1 cursor-pointer"
                  title="读例词"
                >
                  读例词
                </button>
              </div>
            </div>

            {/* Pair B */}
            <div className="bg-gradient-to-b from-indigo-50 to-purple-50/40 rounded-3xl p-4 border-2 border-indigo-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl">{currentGuide.pairB.emoji}</span>
                  <span className="text-xs font-black bg-white px-2 py-0.5 rounded-full border border-indigo-200 text-indigo-800">
                    字母: {currentGuide.pairB.letter}
                  </span>
                </div>

                <div className="text-center py-2">
                  <button
                    onClick={() => audioEngine.speakIpaSound(currentGuide.pairB.ipa)}
                    className="text-4xl sm:text-5xl font-mono font-black text-indigo-900 hover:text-indigo-700 tracking-tight cursor-pointer inline-flex items-center gap-1.5 group transition-transform hover:scale-105"
                    title={`点击只读音标发音: ${currentGuide.pairB.ipa}`}
                  >
                    <span>{currentGuide.pairB.ipa}</span>
                    <Volume2 className="w-5 h-5 text-indigo-600 group-hover:scale-110" />
                  </button>
                  <span className="text-xs font-black text-slate-500 block mt-1">
                    代表词: {currentGuide.pairB.word}
                  </span>
                </div>

                <div className="bg-white/80 rounded-2xl p-3 border border-indigo-200 text-xs font-bold text-slate-700 leading-snug mt-2">
                  <p className="font-black text-indigo-900 mb-1">👄 怎么做口型？</p>
                  <p>{currentGuide.pairB.visualTip}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  onClick={() => audioEngine.speakIpaSound(currentGuide.pairB.ipa)}
                  className="btn-3d py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-[0_3px_0_#3730A3] flex items-center justify-center gap-1 cursor-pointer"
                  title="只听音标纯音"
                >
                  <Volume2 className="w-3.5 h-3.5" /> 纯音标
                </button>
                <button
                  onClick={() => {
                    audioEngine.speakWord(currentGuide.pairB.soundCue || currentGuide.pairB.word.split('/')[0].trim());
                  }}
                  className="btn-3d py-2 rounded-2xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-black text-xs border border-indigo-300 flex items-center justify-center gap-1 cursor-pointer"
                  title="读例词"
                >
                  读例词
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3.5 border-t border-slate-100 mt-2 flex items-center justify-end">
          <button
            onClick={onClose}
            className="btn-3d px-6 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black shadow-[0_3px_0_#0F172A] cursor-pointer"
          >
            我知道啦，回去练习！
          </button>
        </div>
      </div>
    </div>
  );
};
