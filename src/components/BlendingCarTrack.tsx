import React, { useState, useRef, useEffect } from 'react';
import { BLENDING_WORDS, BlendingWord } from '../data/phonicsData';
import { audioEngine } from '../utils/audioEngine';
import { progressTracker } from '../utils/progressTracker';
import { Volume2, Play, Sparkles, RefreshCw } from 'lucide-react';

export const BlendingCarTrack: React.FC = () => {
  const [selectedWordIdx, setSelectedWordIdx] = useState(0);
  const [carProgress, setCarProgress] = useState(0); // 0 to 100
  const [activePhonemeIdx, setActivePhonemeIdx] = useState<number | null>(null);
  const [hasFinished, setHasFinished] = useState(false);
  const [isAutoDriving, setIsAutoDriving] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const curWord: BlendingWord = BLENDING_WORDS[selectedWordIdx];
  const numLetters = curWord.letters.length;

  // Reset when word changes
  useEffect(() => {
    setCarProgress(0);
    setActivePhonemeIdx(null);
    setHasFinished(false);
    setIsAutoDriving(false);
  }, [selectedWordIdx]);

  // Update active letter sound based on progress
  const updateProgressAndSound = (newProgress: number) => {
    setCarProgress(newProgress);

    // Segment thresholds
    const segmentWidth = 80 / numLetters; // first 80% is the letters, last 20% is finish line
    if (newProgress < 85) {
      const idx = Math.min(
        numLetters - 1,
        Math.floor(newProgress / segmentWidth)
      );
      if (idx !== activePhonemeIdx && newProgress > 5) {
        setActivePhonemeIdx(idx);
        audioEngine.speakPhoneme(curWord.phonemes[idx], curWord.ipas[idx]);
      }
    } else {
      // Reached finish line!
      if (!hasFinished) {
        setHasFinished(true);
        setActivePhonemeIdx(null);
        audioEngine.playCarZoom();
        setTimeout(() => {
          audioEngine.playSuccessChime();
          audioEngine.speakWord(curWord.word, 0.8);
          progressTracker.recordBlendingPractice(curWord.word);
        }, 300);
      }
    }
  };

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const p = Math.max(0, Math.min(100, (x / rect.width) * 100));
    updateProgressAndSound(p);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Auto-drive continuous blending animation
  const handleAutoDrive = () => {
    if (isAutoDriving) return;
    setIsAutoDriving(true);
    setHasFinished(false);
    setCarProgress(0);
    setActivePhonemeIdx(null);

    let step = 0;
    const interval = setInterval(() => {
      step += 1.8;
      if (step >= 95) {
        clearInterval(interval);
        updateProgressAndSound(100);
        setIsAutoDriving(false);
      } else {
        updateProgressAndSound(step);
      }
    }, 28);
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-7 shadow-[0_6px_0_#E2E8F0] border-2 border-slate-100 max-w-3xl mx-auto">
      {/* Header with Word Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl shadow-[0_3px_0_#FDE68A]">
            🚗
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              音轨小车 · 滑动连读
              <span className="text-xs bg-amber-500 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Continuous Blending
              </span>
            </h2>
            <p className="text-sm font-bold text-slate-400">
              拖拽小车滑过字母，听音节如何融合成为一个完整的单词！
            </p>
          </div>
        </div>

        <button
          onClick={handleAutoDrive}
          disabled={isAutoDriving}
          className="btn-3d flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-black px-4 py-2.5 rounded-2xl shadow-[0_4px_0_#059669] text-sm cursor-pointer disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-white" />
          一键试听连读
        </button>
      </div>

      {/* Word Quick Pick Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {BLENDING_WORDS.map((bw, idx) => (
          <button
            key={bw.id}
            onClick={() => setSelectedWordIdx(idx)}
            className={`btn-3d px-3.5 py-2 rounded-2xl text-sm font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              selectedWordIdx === idx
                ? 'bg-amber-500 text-white shadow-[0_4px_0_#D97706] scale-105'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-[0_3px_0_#CBD5E1]'
            }`}
          >
            <span className="text-lg">{bw.emoji}</span>
            <span>{bw.word}</span>
          </button>
        ))}
      </div>

      {/* Main Track Interactive Stage */}
      <div className="relative bg-gradient-to-b from-sky-50 via-indigo-50/50 to-amber-50/30 rounded-3xl p-6 md:p-8 border-2 border-indigo-100 overflow-hidden mb-6">
        {/* Background Road Markings */}
        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-14 bg-slate-700/90 rounded-2xl flex items-center justify-between px-6 border-b-4 border-slate-900 shadow-inner">
          <div className="w-full border-t-2 border-dashed border-amber-300 opacity-60"></div>
        </div>

        {/* Phoneme Station Letter Blocks */}
        <div className="relative z-10 flex justify-between items-center px-4 md:px-12 my-6">
          {curWord.letters.map((letter, idx) => {
            const isActive = activePhonemeIdx === idx;
            const isPassed =
              carProgress > ((idx + 1) * 80) / numLetters || hasFinished;

            return (
              <button
                key={idx}
                onClick={() => {
                  setActivePhonemeIdx(idx);
                  audioEngine.speakPhoneme(curWord.phonemes[idx], curWord.ipas[idx]);
                }}
                className={`flex flex-col items-center group transition-transform duration-200 cursor-pointer ${
                  isActive ? 'scale-115 -translate-y-2' : ''
                }`}
              >
                <div
                  className={`w-16 h-20 md:w-20 md:h-24 rounded-2xl flex flex-col items-center justify-center font-black transition-all ${
                    isActive
                      ? 'bg-amber-400 text-white shadow-[0_6px_0_#D97706] ring-4 ring-amber-300 ring-offset-2 animate-jelly'
                      : isPassed
                      ? 'bg-emerald-400 text-white shadow-[0_5px_0_#059669]'
                      : 'bg-white text-slate-800 shadow-[0_5px_0_#CBD5E1] border-2 border-slate-200'
                  }`}
                >
                  <span className="text-4xl md:text-5xl font-mono font-black leading-none">
                    {letter}
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      audioEngine.speakIpaSound(curWord.ipas[idx]);
                    }}
                    className={`text-xs font-bold mt-1.5 px-2 py-0.5 rounded-full hover:scale-110 transition-transform ${
                      isActive || isPassed
                        ? 'bg-white/30 text-white'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                    title={`点击只读音标纯音: ${curWord.ipas[idx]}`}
                  >
                    {curWord.ipas[idx]}
                  </span>
                </div>

                <span className="text-xs font-bold text-slate-400 mt-2">
                  音节 {idx + 1}
                </span>
              </button>
            );
          })}

          {/* Finish Line Flag & Target Word Reveal */}
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-20 md:w-20 md:h-24 rounded-2xl flex flex-col items-center justify-center font-black transition-all ${
                hasFinished
                  ? 'bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-[0_6px_0_#9333EA] ring-4 ring-pink-300 scale-110 animate-jelly'
                  : 'bg-white/80 border-2 border-dashed border-purple-300 text-purple-400'
              }`}
            >
              {hasFinished ? (
                <>
                  <span className="text-3xl animate-bounce">
                    {curWord.emoji}
                  </span>
                  <span className="text-xs font-black uppercase mt-1">
                    {curWord.word}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl">🏁</span>
                  <span className="text-[10px] font-black uppercase text-slate-400 mt-1">
                    终点合读
                  </span>
                </>
              )}
            </div>
            <span className="text-xs font-bold text-slate-400 mt-2">连读单词</span>
          </div>
        </div>

        {/* Drag Track Bar & The Sound Car */}
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative h-16 bg-slate-200/80 rounded-full mx-2 md:mx-6 flex items-center px-3 cursor-ew-resize select-none touch-none shadow-inner border border-slate-300/80"
        >
          {/* Track Progress Fill */}
          <div
            className="absolute left-2 top-2 bottom-2 bg-gradient-to-r from-amber-400 via-emerald-400 to-purple-500 rounded-full opacity-60 transition-all duration-75"
            style={{ width: `${Math.max(6, carProgress)}%` }}
          />

          {/* The Cute Bouncing Car */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-75 flex flex-col items-center z-20 pointer-events-none"
            style={{ left: `${Math.max(5, Math.min(95, carProgress))}%` }}
          >
            {/* Engine Smoke on Move */}
            {(carProgress > 10 || isAutoDriving) && (
              <div className="absolute -left-6 top-1 text-xs opacity-70 animate-ping">
                💨
              </div>
            )}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-amber-400 border-2 border-amber-500 flex items-center justify-center text-3xl shadow-[0_5px_0_#B45309] hover:scale-105 transition-transform animate-float">
              🚗
            </div>
            <div className="text-[10px] font-black bg-slate-800 text-white px-2 py-0.5 rounded-full mt-1 shadow whitespace-nowrap">
              拖我滑动 ➔
            </div>
          </div>
        </div>
      </div>

      {/* Completion Victory Card */}
      {hasFinished && (
        <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border-2 border-pink-200 flex flex-col md:flex-row items-center justify-between gap-4 animate-jelly">
          <div className="flex items-center gap-4 text-center md:text-left">
            <span className="text-5xl">{curWord.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-slate-800">
                  {curWord.word}
                </span>
                <button
                  onClick={() => audioEngine.speakWord(curWord.word)}
                  className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center shadow hover:bg-purple-600 cursor-pointer"
                  title="再听一遍"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs font-bold text-purple-600 mt-0.5">
                🎉 拼读成功！音素自然连贯起来了！
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const nextIdx = (selectedWordIdx + 1) % BLENDING_WORDS.length;
              setSelectedWordIdx(nextIdx);
            }}
            className="btn-3d flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black px-5 py-2.5 rounded-2xl shadow-[0_4px_0_#7E22CE] text-sm cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            拼读下一个词
          </button>
        </div>
      )}
    </div>
  );
};
