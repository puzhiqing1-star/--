import React, { useState } from 'react';
import { PHONIC_LEVELS, PHONEMES_DATA, PhonemeInfo } from '../data/phonicsData';
import { audioEngine } from '../utils/audioEngine';
import { Volume2, Play, Sparkles, Star } from 'lucide-react';

interface PhonicsRoadmapProps {
  onSelectPractice: (tab: any) => void;
}

export const PhonicsRoadmap: React.FC<PhonicsRoadmapProps> = ({ onSelectPractice }) => {
  const [selectedLevelId, setSelectedLevelId] = useState(1);
  const [activePhoneme, setActivePhoneme] = useState<PhonemeInfo>(PHONEMES_DATA[0]);

  const levelPhonemes = PHONEMES_DATA.filter((p) => p.stage === selectedLevelId);

  const handleCardClick = (p: PhonemeInfo) => {
    setActivePhoneme(p);
    audioEngine.speakPhoneme(p.audioPhoneme, p.ipa, undefined, p.anchorWord);
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-7 shadow-[0_6px_0_#E2E8F0] border-2 border-slate-100 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl shadow-[0_3px_0_#FDE68A]">
            🗺️
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              自然拼读启蒙闯关地图
              <span className="text-xs bg-amber-500 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Progress Roadmap
              </span>
            </h2>
            <p className="text-sm font-bold text-slate-400">
              从世界顶尖的 S-A-T-P-I-N 启蒙组开始，拒绝死记硬背！
            </p>
          </div>
        </div>
      </div>

      {/* Stage Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {PHONIC_LEVELS.map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => {
              setSelectedLevelId(lvl.id);
              const firstInLevel = PHONEMES_DATA.find((p) => p.stage === lvl.id);
              if (firstInLevel) setActivePhoneme(firstInLevel);
              audioEngine.playPop(600);
            }}
            className={`btn-3d px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              selectedLevelId === lvl.id
                ? 'bg-amber-500 text-white shadow-[0_4px_0_#D97706] scale-105'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-[0_3px_0_#CBD5E1]'
            }`}
          >
            <span>{lvl.name}</span>
          </button>
        ))}
      </div>

      {/* Current Level Banner & Letter Grid */}
      <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-white rounded-3xl p-5 md:p-6 border-2 border-amber-200 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
            <span>🎯 本阶段音素探险:</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
              点击卡片听发音
            </span>
          </h3>
          <span className="text-xs font-bold text-slate-400">
            {PHONIC_LEVELS.find((l) => l.id === selectedLevelId)?.desc}
          </span>
        </div>

        {/* Big Letter Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {levelPhonemes.map((p) => {
            const isSelected = activePhoneme.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleCardClick(p)}
                className={`btn-3d rounded-2xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer border-2 ${
                  isSelected
                    ? 'bg-amber-400 text-white border-amber-500 shadow-[0_6px_0_#D97706] scale-105 animate-jelly'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-amber-300 shadow-[0_4px_0_#CBD5E1]'
                }`}
              >
                <span className="text-4xl md:text-5xl font-black font-mono tracking-wide mb-1">
                  {p.letter}
                </span>
                <span className="text-2xl mb-1">{p.anchorEmoji}</span>
                <span
                  className={`text-xs font-black px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-white/30 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {p.ipa}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Letter Spotlight Card */}
        {activePhoneme && (
          <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-[0_5px_0_#E2E8F0] flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-amber-100 text-amber-600 flex flex-col items-center justify-center text-4xl shadow-inner border border-amber-200">
                <span>{activePhoneme.anchorEmoji}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-4xl md:text-5xl font-black font-mono tracking-wide text-slate-800">
                    {activePhoneme.letter}
                  </span>
                  <span className="text-base font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                    {activePhoneme.ipa}
                  </span>
                  <span className="text-sm font-bold text-slate-500">
                    · {activePhoneme.name}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-600 mt-1 max-w-md">
                  👅 发音要领: {activePhoneme.mouthTip}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {activePhoneme.sampleWords.map((sw) => (
                    <button
                      key={sw.word}
                      onClick={() => audioEngine.speakWord(sw.word)}
                      className="bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{sw.emoji}</span>
                      <span>{sw.word}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap md:flex-col gap-2 w-full md:w-auto">
              <button
                onClick={() => audioEngine.speakPhoneme(activePhoneme.audioPhoneme, activePhoneme.ipa, undefined, activePhoneme.anchorWord)}
                className="btn-3d flex-1 md:flex-none flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-black px-4 py-2.5 rounded-2xl shadow-[0_4px_0_#D97706] text-xs cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                听音素示范
              </button>
              <button
                onClick={() => onSelectPractice('ort')}
                className="btn-3d flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-white font-black px-4 py-2.5 rounded-2xl shadow-[0_4px_0_#9A3412] text-xs cursor-pointer"
              >
                <span>🐶 牛津树教材课后复习</span>
              </button>
              <button
                onClick={() => onSelectPractice('blending')}
                className="btn-3d flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-black px-4 py-2.5 rounded-2xl shadow-[0_4px_0_#059669] text-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                去拼读小车
              </button>
              <button
                onClick={() => onSelectPractice('games')}
                className="btn-3d flex-1 md:flex-none flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-black px-4 py-2.5 rounded-2xl shadow-[0_4px_0_#C2410C] text-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                玩拼读小游戏
              </button>
              <button
                onClick={() => onSelectPractice('tracing')}
                className="btn-3d flex-1 md:flex-none flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-black px-4 py-2.5 rounded-2xl shadow-[0_4px_0_#0284C7] text-xs cursor-pointer"
              >
                <span>✍️ 描红字母</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
