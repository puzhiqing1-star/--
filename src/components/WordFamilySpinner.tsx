import React, { useState } from 'react';
import { WORD_FAMILIES, WordFamily } from '../data/phonicsData';
import { audioEngine } from '../utils/audioEngine';
import { Disc, Volume2, Sparkles, Dices } from 'lucide-react';

export const WordFamilySpinner: React.FC = () => {
  const [selectedFamilyIdx, setSelectedFamilyIdx] = useState(0);
  const [activeOnsetIdx, setActiveOnsetIdx] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const curFamily: WordFamily = WORD_FAMILIES[selectedFamilyIdx];
  const curWordObj = curFamily.words[activeOnsetIdx] || curFamily.words[0];

  const handleSelectOnset = (idx: number) => {
    setActiveOnsetIdx(idx);
    const item = curFamily.words[idx];
    
    // Staggered phonics pronunciation: onset -> rime -> full word
    audioEngine.speakPhoneme(item.onset);
    setTimeout(() => {
      audioEngine.speakWord(curFamily.rime, 0.95);
    }, 450);
    setTimeout(() => {
      audioEngine.speakWord(item.word, 0.9);
    }, 950);
  };

  const handleRandomSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    let count = 0;
    const maxSpins = 12;
    const totalWords = curFamily.words.length;

    const interval = setInterval(() => {
      count++;
      audioEngine.playWheelClick();
      const nextIdx = (activeOnsetIdx + count) % totalWords;
      setActiveOnsetIdx(nextIdx);

      if (count >= maxSpins) {
        clearInterval(interval);
        setIsSpinning(false);
        const finalWord = curFamily.words[nextIdx];
        audioEngine.playSuccessChime();
        setTimeout(() => {
          audioEngine.speakWord(finalWord.word, 0.9);
        }, 400);
      }
    }, 80);
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-7 shadow-[0_6px_0_#E2E8F0] border-2 border-slate-100 max-w-3xl mx-auto">
      {/* Module Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl shadow-[0_3px_0_#E9D5FF]">
            🎡
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              词族魔方转盘 · CVC 拼词
              <span className="text-xs bg-purple-500 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Word Families
              </span>
            </h2>
            <p className="text-sm font-bold text-slate-400">
              固定词尾韵母，拨动首字母，轻松拼出一整串同韵好词！
            </p>
          </div>
        </div>

        <button
          onClick={handleRandomSpin}
          disabled={isSpinning}
          className="btn-3d flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black px-4 py-2.5 rounded-2xl shadow-[0_4px_0_#4338CA] text-sm cursor-pointer disabled:opacity-50"
        >
          <Dices className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
          随机转一转 🎲
        </button>
      </div>

      {/* Family Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {WORD_FAMILIES.map((fam, idx) => (
          <button
            key={fam.id}
            onClick={() => {
              setSelectedFamilyIdx(idx);
              setActiveOnsetIdx(0);
              audioEngine.playPop(600);
            }}
            className={`btn-3d px-3.5 py-2 rounded-2xl text-sm font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              selectedFamilyIdx === idx
                ? 'bg-purple-600 text-white shadow-[0_4px_0_#4C1D95] scale-105'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-[0_3px_0_#CBD5E1]'
            }`}
          >
            <span className="text-base">{fam.emoji}</span>
            <span>-{fam.rime}</span>
          </button>
        ))}
      </div>

      {/* Spinner Stage */}
      <div className="bg-gradient-to-b from-purple-50/70 via-indigo-50/50 to-white rounded-3xl p-6 md:p-8 border-2 border-purple-100 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
          
          {/* Left: Onset Consonants Wheel / Slot */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-black text-purple-600 uppercase tracking-wider mb-2">
              首字母 (Onset)
            </span>

            <div className="bg-white rounded-3xl p-2 shadow-[0_6px_0_#CBD5E1] border-2 border-purple-200 flex md:flex-col gap-2 overflow-x-auto max-w-full md:max-h-72 no-scrollbar">
              {curFamily.words.map((item, idx) => (
                <button
                  key={item.onset}
                  onClick={() => handleSelectOnset(idx)}
                  className={`btn-3d w-16 h-16 md:w-18 md:h-18 rounded-2xl font-black font-mono text-3xl md:text-4xl flex items-center justify-center transition-all cursor-pointer ${
                    activeOnsetIdx === idx
                      ? 'bg-amber-400 text-white shadow-[0_5px_0_#D97706] scale-105 ring-4 ring-amber-200'
                      : 'bg-slate-50 text-slate-700 hover:bg-purple-50 shadow-[0_3px_0_#E2E8F0]'
                  }`}
                >
                  {item.onset}
                </button>
              ))}
            </div>
          </div>

          {/* Plus Sign */}
          <div className="text-2xl font-black text-purple-400">➕</div>

          {/* Center: Fixed Rime Block */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-black text-purple-600 uppercase tracking-wider mb-2">
              固定词根 (Rime)
            </span>
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-indigo-500 text-white font-mono font-black text-5xl md:text-6xl flex items-center justify-center shadow-[0_7px_0_#3730A3] border-2 border-indigo-400">
              -{curFamily.rime}
            </div>
          </div>

          {/* Equals Sign */}
          <div className="text-2xl font-black text-purple-400">➔</div>

          {/* Right: Assembled Target Word & Meaning Card */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-2">
              拼合结果 (Word)
            </span>
            <div className="bg-white rounded-3xl p-5 shadow-[0_7px_0_#CBD5E1] border-2 border-emerald-200 flex flex-col items-center justify-center min-w-[180px] min-h-[150px] animate-jelly">
              <span className="text-5xl mb-2 animate-bounce">
                {curWordObj.emoji}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-black font-mono tracking-wide text-slate-800">
                  <span className="text-amber-500">{curWordObj.onset}</span>
                  <span className="text-indigo-600">{curFamily.rime}</span>
                </span>
                <button
                  onClick={() => audioEngine.speakWord(curWordObj.word)}
                  className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow cursor-pointer"
                  title="朗读单词"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs font-bold text-slate-500 mt-1">
                {curWordObj.meaning}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Word Family Grid List */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          -{curFamily.rime} 词族大家庭（点击卡片发音）:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {curFamily.words.map((item, idx) => (
            <button
              key={item.word}
              onClick={() => handleSelectOnset(idx)}
              className={`btn-3d p-3 rounded-2xl flex items-center gap-3 text-left border-2 cursor-pointer transition-all ${
                activeOnsetIdx === idx
                  ? 'bg-amber-50 border-amber-300 shadow-[0_4px_0_#F59E0B]'
                  : 'bg-white border-slate-200 hover:border-purple-200 shadow-[0_3px_0_#E2E8F0]'
              }`}
            >
              <span className="text-3xl">{item.emoji}</span>
              <div>
                <div className="text-base font-black text-slate-800">
                  <span className="text-amber-500">{item.onset}</span>
                  <span className="text-indigo-600">{curFamily.rime}</span>
                </div>
                <div className="text-[11px] font-bold text-slate-400">
                  {item.meaning}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
