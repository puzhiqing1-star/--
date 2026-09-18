import React, { useState, useEffect } from 'react';
import { PHONEMES_DATA, PhonemeInfo } from '../data/phonicsData';
import { audioEngine } from '../utils/audioEngine';
import { progressTracker } from '../utils/progressTracker';
import { Volume2, Sparkles, RefreshCw, Trophy, Heart } from 'lucide-react';

interface Question {
  targetWord: string;
  targetEmoji: string;
  targetPhoneme: PhonemeInfo;
  options: Array<{
    word: string;
    emoji: string;
    isCorrect: boolean;
  }>;
}

export const ListeningChallenge: React.FC = () => {
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Generate a random question from phonemes
  const generateQuestion = () => {
    setFeedbackState('idle');
    setSelectedWord(null);

    // Pick a target phoneme
    const targetIdx = Math.floor(Math.random() * PHONEMES_DATA.length);
    const targetPhoneme = PHONEMES_DATA[targetIdx];
    const targetSample = targetPhoneme.sampleWords[0];

    // Pick 2 distractor words from other phonemes
    const otherPhonemes = PHONEMES_DATA.filter((p) => p.id !== targetPhoneme.id);
    const distractors = otherPhonemes
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map((p) => p.sampleWords[0]);

    const allOptions = [
      { word: targetSample.word, emoji: targetSample.emoji, isCorrect: true },
      ...distractors.map((d) => ({
        word: d.word,
        emoji: d.emoji,
        isCorrect: false
      }))
    ].sort(() => 0.5 - Math.random());

    const newQ: Question = {
      targetWord: targetSample.word,
      targetEmoji: targetSample.emoji,
      targetPhoneme,
      options: allOptions
    };

    setCurrentQ(newQ);

    // Auto play target sound
    setTimeout(() => {
      audioEngine.speakWord(newQ.targetWord, 0.85);
    }, 200);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handlePlaySound = () => {
    if (currentQ) {
      audioEngine.speakWord(currentQ.targetWord, 0.9);
    }
  };

  const handleSelectOption = (opt: { word: string; emoji: string; isCorrect: boolean }) => {
    if (feedbackState === 'correct') return;
    setSelectedWord(opt.word);

    if (opt.isCorrect) {
      setFeedbackState('correct');
      setScore((s) => s + 10);
      setStreak((st) => st + 1);
      audioEngine.playSuccessChime();

      if (currentQ) {
        progressTracker.recordListeningResult(
          currentQ.targetWord,
          currentQ.targetEmoji,
          currentQ.targetPhoneme.letter,
          true
        );
      }

      setTimeout(() => {
        generateQuestion();
      }, 1400);
    } else {
      setFeedbackState('wrong');
      setStreak(0);
      audioEngine.playErrorBoing();

      if (currentQ) {
        progressTracker.recordListeningResult(
          currentQ.targetWord,
          currentQ.targetEmoji,
          currentQ.targetPhoneme.letter,
          false
        );
      }

      setTimeout(() => {
        setFeedbackState('idle');
        setSelectedWord(null);
      }, 800);
    }
  };

  if (!currentQ) return null;

  return (
    <div className="bg-white rounded-3xl p-5 md:p-7 shadow-[0_6px_0_#E2E8F0] border-2 border-slate-100 max-w-3xl mx-auto">
      {/* Title & Star Score */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl shadow-[0_3px_0_#A7F3D0]">
            🎧
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              听音辨辨乐 · 金牌小神耳
              <span className="text-xs bg-emerald-500 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Sound Match
              </span>
            </h2>
            <p className="text-sm font-bold text-slate-400">
              点小喇叭听发音，选出正确的魔法卡片！
            </p>
          </div>
        </div>

        {/* Score & Streak Chips */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-50 px-3.5 py-1.5 rounded-2xl border border-amber-200 shadow-sm">
            <span className="text-amber-500 text-lg">⭐</span>
            <span className="text-sm font-black text-amber-700">{score} 分</span>
          </div>
          {streak > 1 && (
            <div className="flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-2xl border border-rose-200 shadow-sm animate-bounce">
              <span className="text-rose-500 text-sm">🔥</span>
              <span className="text-xs font-black text-rose-600">
                {streak} 连胜
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Challenge Stage */}
      <div className="bg-gradient-to-b from-emerald-50/70 via-teal-50/40 to-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 mb-6 flex flex-col items-center">
        
        {/* Big Pulsing Speaker Button */}
        <div className="mb-6 flex flex-col items-center">
          <button
            onClick={handlePlaySound}
            className="btn-3d w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-emerald-500 hover:bg-emerald-400 text-white flex flex-col items-center justify-center shadow-[0_8px_0_#059669] cursor-pointer ring-8 ring-emerald-200/60 pulse-glow"
            title="点击重听"
          >
            <Volume2 className="w-10 h-10 md:w-12 md:h-12" />
            <span className="text-xs font-black mt-1">听一听</span>
          </button>
          <span className="text-xs font-bold text-slate-400 mt-3">
            点击大喇叭可随时重复播放
          </span>
        </div>

        {/* Choice Big Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
          {currentQ.options.map((opt) => {
            const isSelected = selectedWord === opt.word;
            let cardStyle =
              'bg-white text-slate-800 border-2 border-slate-200 shadow-[0_6px_0_#CBD5E1] hover:border-emerald-300';

            if (isSelected) {
              if (feedbackState === 'correct') {
                cardStyle =
                  'bg-emerald-500 text-white border-2 border-emerald-600 shadow-[0_6px_0_#047857] scale-105 animate-jelly';
              } else if (feedbackState === 'wrong') {
                cardStyle =
                  'bg-rose-500 text-white border-2 border-rose-600 shadow-[0_6px_0_#B91C1C] animate-pulse';
              }
            }

            return (
              <button
                key={opt.word}
                onClick={() => handleSelectOption(opt)}
                className={`btn-3d rounded-3xl p-5 flex flex-col items-center justify-center min-h-[140px] cursor-pointer transition-all ${cardStyle}`}
              >
                <span className="text-5xl mb-2">{opt.emoji}</span>
                <span className="text-xl font-black">{opt.word}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback Message */}
        <div className="mt-6 min-h-[30px] flex items-center justify-center text-center">
          {feedbackState === 'correct' && (
            <div className="flex items-center gap-2 text-emerald-600 font-black text-base animate-bounce">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>太棒了！听力超厉害！+10 分 🌟</span>
            </div>
          )}
          {feedbackState === 'wrong' && (
            <div className="text-rose-500 font-black text-base">
              不要紧，再仔细听一遍哦～ 💪
            </div>
          )}
        </div>
      </div>

      {/* Skip / Next Button */}
      <div className="flex justify-end">
        <button
          onClick={generateQuestion}
          className="btn-3d flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black px-4 py-2 rounded-2xl shadow-[0_3px_0_#CBD5E1] text-xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          跳过换一题
        </button>
      </div>
    </div>
  );
};
