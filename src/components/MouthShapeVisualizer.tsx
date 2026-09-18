import React, { useState } from 'react';
import { MOUTH_GUIDES } from '../data/phonicsData';
import { audioEngine } from '../utils/audioEngine';
import { Volume2, Smile, ArrowRightLeft } from 'lucide-react';

export const MouthShapeVisualizer: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const curGuide = MOUTH_GUIDES[selectedIdx];

  const playContrast = (word: string, isA: boolean) => {
    audioEngine.playPop(isA ? 700 : 850);
    audioEngine.speakWord(word, 0.85);
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-7 shadow-[0_6px_0_#E2E8F0] border-2 border-slate-100 max-w-3xl mx-auto">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl shadow-[0_3px_0_#FECDD3]">
            👄
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              口型发音小怪兽 · 易混对比
              <span className="text-xs bg-rose-500 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Mouth & Contrast
              </span>
            </h2>
            <p className="text-sm font-bold text-slate-400">
              看口型、摸下巴，告别中式发音含糊，掌握纯正英美音！
            </p>
          </div>
        </div>
      </div>

      {/* Contrast Pair Selectors */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {MOUTH_GUIDES.map((g, idx) => (
          <button
            key={g.id}
            onClick={() => {
              setSelectedIdx(idx);
              audioEngine.playPop(600);
            }}
            className={`btn-3d px-4 py-2.5 rounded-2xl text-sm font-black flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              selectedIdx === idx
                ? 'bg-rose-500 text-white shadow-[0_4px_0_#BE123C] scale-105'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-[0_3px_0_#CBD5E1]'
            }`}
          >
            <span>{g.title}</span>
          </button>
        ))}
      </div>

      {/* Active Contrast Pair Showcase */}
      <div className="bg-gradient-to-b from-rose-50/70 via-pink-50/30 to-amber-50/40 rounded-3xl p-6 md:p-8 border-2 border-rose-100 mb-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-black text-slate-800">
            {curGuide.title}
          </h3>
          <p className="text-xs font-bold text-rose-600 mt-1">
            {curGuide.desc}
          </p>
        </div>

        {/* Side-by-side Mouth Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card A */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_6px_0_#CBD5E1] border-2 border-amber-200 flex flex-col items-center text-center">
            {/* Visual Mouth Illustration */}
            <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center text-5xl mb-3 shadow-inner">
              {curGuide.pairA.emoji}
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-black text-amber-600">
                {curGuide.pairA.letter}
              </span>
              <button
                onClick={() => audioEngine.speakIpaSound(curGuide.pairA.ipa)}
                className="text-sm font-black bg-amber-100 hover:bg-amber-200 text-amber-800 px-2.5 py-0.5 rounded-full cursor-pointer flex items-center gap-1 transition-colors group"
                title={`点击只读音标发音: ${curGuide.pairA.ipa}`}
              >
                <Volume2 className="w-3 h-3 text-amber-700 group-hover:scale-110" />
                <span>{curGuide.pairA.ipa}</span>
              </button>
            </div>

            {/* Secret Mouth Tip */}
            <div className="bg-amber-50 rounded-2xl p-3 my-3 text-xs font-bold text-amber-800 w-full border border-amber-200">
              💡 {curGuide.pairA.visualTip}
            </div>

            {/* Example Words Button */}
            <button
              onClick={() => playContrast(curGuide.pairA.soundCue, true)}
              className="btn-3d w-full mt-2 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-black py-2.5 px-4 rounded-2xl shadow-[0_4px_0_#D97706] text-sm cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              听示范词: {curGuide.pairA.word}
            </button>
          </div>

          {/* Card B */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_6px_0_#CBD5E1] border-2 border-emerald-200 flex flex-col items-center text-center">
            {/* Visual Mouth Illustration */}
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-5xl mb-3 shadow-inner">
              {curGuide.pairB.emoji}
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-black text-emerald-600">
                {curGuide.pairB.letter}
              </span>
              <button
                onClick={() => audioEngine.speakIpaSound(curGuide.pairB.ipa)}
                className="text-sm font-black bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-2.5 py-0.5 rounded-full cursor-pointer flex items-center gap-1 transition-colors group"
                title={`点击只读音标发音: ${curGuide.pairB.ipa}`}
              >
                <Volume2 className="w-3 h-3 text-emerald-700 group-hover:scale-110" />
                <span>{curGuide.pairB.ipa}</span>
              </button>
            </div>

            {/* Secret Mouth Tip */}
            <div className="bg-emerald-50 rounded-2xl p-3 my-3 text-xs font-bold text-emerald-800 w-full border border-emerald-200">
              💡 {curGuide.pairB.visualTip}
            </div>

            {/* Example Words Button */}
            <button
              onClick={() => playContrast(curGuide.pairB.soundCue, false)}
              className="btn-3d w-full mt-2 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-black py-2.5 px-4 rounded-2xl shadow-[0_4px_0_#059669] text-sm cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              听示范词: {curGuide.pairB.word}
            </button>
          </div>
        </div>

        {/* Quick Contrast Comparison Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              playContrast(curGuide.pairA.soundCue, true);
              setTimeout(() => {
                playContrast(curGuide.pairB.soundCue, false);
              }, 1100);
            }}
            className="btn-3d flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-black px-6 py-3 rounded-2xl shadow-[0_4px_0_#0F172A] text-sm cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4 text-amber-400" />
            连续听 A / B 两组对比发音
          </button>
        </div>
      </div>
    </div>
  );
};
