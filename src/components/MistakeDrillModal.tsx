import React, { useState, useEffect } from 'react';
import { MistakeItem, progressTracker } from '../utils/progressTracker';
import { audioEngine } from '../utils/audioEngine';
import { Volume2, Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Star, ShieldCheck, Zap, HelpCircle } from 'lucide-react';

interface MistakeDrillModalProps {
  items: MistakeItem[];
  initialIndex?: number;
  onClose: () => void;
  onItemUpdated?: () => void;
}

export function MistakeDrillModal({ items, initialIndex = 0, onClose, onItemUpdated }: MistakeDrillModalProps) {
  const [queue, setQueue] = useState<MistakeItem[]>(items);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [conqueredIds, setConqueredIds] = useState<string[]>([]);
  const [earnedStars, setEarnedStars] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [slowAudio, setSlowAudio] = useState(false);

  const currentItem = queue[currentIndex] || null;

  // Options generator for the current item
  const [options, setOptions] = useState<Array<{ id: string; text: string; sub?: string; isCorrect: boolean }>>([]);

  useEffect(() => {
    if (!currentItem) {
      setIsFinished(true);
      return;
    }

    setFeedback('idle');
    setSelectedAnswer(null);

    // Play target audio with small delay
    const timer = setTimeout(() => {
      playCurrentAudio();
    }, 300);

    // Generate smart distractor options
    if (currentItem.type === 'phoneme') {
      const targetLetter = currentItem.key.toLowerCase();
      // Pick classic easily confused pairs
      const confusionPool: Record<string, string[]> = {
        a: ['e', 'i', 'u'],
        e: ['a', 'i', 'o'],
        i: ['e', 'a', 'y'],
        o: ['u', 'a', 'e'],
        u: ['o', 'a', 'i'],
        s: ['c', 'z', 't'],
        p: ['b', 't', 'd'],
        t: ['d', 'p', 'k'],
        b: ['d', 'p', 'g'],
        d: ['b', 't', 'p'],
        c: ['k', 's', 'g'],
        k: ['c', 't', 'g'],
        n: ['m', 'l', 'r'],
        m: ['n', 'b', 'p'],
        f: ['v', 'th', 's'],
      };

      const distractorPool = confusionPool[targetLetter] || ['s', 'a', 't', 'p', 'i', 'n'].filter(x => x !== targetLetter);
      const chosenDistractors = distractorPool.slice(0, 2);

      const allChoices = [
        { id: targetLetter, text: targetLetter.toUpperCase(), sub: currentItem.ipa || `/${targetLetter}/`, isCorrect: true },
        ...chosenDistractors.map(d => ({
          id: d,
          text: d.toUpperCase(),
          sub: `/${d}/`,
          isCorrect: false,
        })),
      ].sort(() => Math.random() - 0.5);

      setOptions(allChoices);
    } else {
      // Word spelling options: target missing vowel or full word
      const targetWord = currentItem.key.toLowerCase();
      const vowels = ['a', 'e', 'i', 'o', 'u'];
      // Find the vowel in CVC
      const vowelInWord = targetWord.split('').find(ch => vowels.includes(ch)) || 'e';
      const otherVowels = vowels.filter(v => v !== vowelInWord).sort(() => Math.random() - 0.5).slice(0, 2);

      const allChoices = [
        { id: vowelInWord, text: vowelInWord.toUpperCase(), sub: `/${vowelInWord}/`, isCorrect: true },
        ...otherVowels.map(v => ({
          id: v,
          text: v.toUpperCase(),
          sub: `/${v}/`,
          isCorrect: false,
        })),
      ].sort(() => Math.random() - 0.5);

      setOptions(allChoices);
    }

    return () => clearTimeout(timer);
  }, [currentIndex, currentItem]);

  const playCurrentAudio = () => {
    if (!currentItem) return;
    const speed = slowAudio ? 0.8 : 0.95;
    if (currentItem.type === 'phoneme') {
      audioEngine.speakPhoneme(currentItem.key, currentItem.ipa, speed);
    } else {
      audioEngine.speakWord(currentItem.key, speed);
    }
  };

  const handleSelect = (opt: { id: string; isCorrect: boolean }) => {
    if (feedback === 'correct') return;
    setSelectedAnswer(opt.id);

    if (opt.isCorrect) {
      setFeedback('correct');
      audioEngine.playSuccessChime();

      // Record review result
      const result = progressTracker.recordReviewResult(currentItem.id, true);
      setEarnedStars(s => s + (result.conquered ? 13 : 3));

      if (result.conquered && !conqueredIds.includes(currentItem.id)) {
        setConqueredIds(prev => [...prev, currentItem.id]);
        audioEngine.playCheerFanfare();
      }

      if (onItemUpdated) {
        onItemUpdated();
      }

      // Proceed to next question after animation
      setTimeout(() => {
        if (currentIndex < queue.length - 1) {
          setCurrentIndex(i => i + 1);
        } else {
          setIsFinished(true);
        }
      }, 1600);
    } else {
      setFeedback('wrong');
      audioEngine.playErrorBoing();
      progressTracker.recordReviewResult(currentItem.id, false);

      if (onItemUpdated) {
        onItemUpdated();
      }

      setTimeout(() => {
        setFeedback('idle');
        setSelectedAnswer(null);
      }, 900);
    }
  };

  if (isFinished) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border-4 border-amber-300 text-center animate-in fade-in zoom-in duration-200">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-4xl shadow-[0_4px_0_#D97706] mb-4">
            🏆
          </div>

          <h3 className="text-2xl font-black text-slate-800">
            专项复习冲刺大胜利！
          </h3>
          <p className="text-sm font-bold text-slate-500 mt-2">
            你专注地完成了本次错题宝库复习特训，发音辨析与拼读感觉大幅增强！
          </p>

          <div className="grid grid-cols-2 gap-3 my-6">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3.5">
              <div className="text-xs font-bold text-amber-700 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>收获星星</span>
              </div>
              <div className="text-2xl font-black text-amber-600 mt-1">
                +{earnedStars} ⭐
              </div>
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3.5">
              <div className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>彻底攻克</span>
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {conqueredIds.length} 项 🏅
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-black text-lg shadow-[0_5px_0_#0F766E] active:translate-y-1 active:shadow-none transition-all"
          >
            返回错题宝库 ✨
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 md:p-7 max-w-xl w-full shadow-2xl border-4 border-teal-200 relative animate-in fade-in duration-150">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <div>
              <span className="text-xs font-black text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                错题专项特训
              </span>
              <span className="ml-2 text-xs font-black text-slate-400">
                第 {currentIndex + 1} / {queue.length} 题
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-black flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-5">
          <div
            className="bg-gradient-to-r from-teal-400 to-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / queue.length) * 100}%` }}
          />
        </div>

        {/* Question card */}
        <div className="bg-gradient-to-b from-sky-50 to-indigo-50/50 rounded-3xl p-5 border-2 border-sky-100 text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full shadow-sm border border-sky-200 text-xs font-black text-sky-800 mb-3">
            <span>{currentItem.source} 易错点</span>
            <span>·</span>
            <span className="text-rose-500">已失误 {currentItem.errorCount} 次</span>
          </div>

          <div className="text-4xl md:text-5xl my-2 animate-bounce">
            {currentItem.emoji}
          </div>

          <div className="text-sm md:text-base font-bold text-slate-700 max-w-md mx-auto">
            {currentItem.type === 'phoneme' ? (
              <span>仔细听小喇叭播放的发音，找出正确的字母音卡片：</span>
            ) : (
              <span>
                单词 <strong className="text-indigo-600 font-black tracking-wider">{currentItem.display}</strong> 中间缺少哪个核心元音？
              </span>
            )}
          </div>

          {/* Sound play buttons */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => {
                setSlowAudio(false);
                playCurrentAudio();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl font-black text-sm shadow-[0_4px_0_#0F766E] active:translate-y-0.5 active:shadow-none transition-all"
            >
              <Volume2 className="w-4 h-4" />
              <span>原速发音</span>
            </button>

            <button
              onClick={() => {
                setSlowAudio(true);
                audioEngine.speakPhoneme(currentItem.key, 0.65);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-2xl font-black text-sm border border-amber-300 active:translate-y-0.5 transition-all"
            >
              <span>🐢 慢速发音</span>
            </button>
          </div>

          {/* Word incomplete display if word type */}
          {currentItem.type === 'word' && (
            <div className="mt-4 bg-white/90 py-2.5 px-6 rounded-2xl inline-block border border-indigo-200 shadow-inner text-2xl font-black tracking-widest text-slate-800">
              {currentItem.key.charAt(0).toUpperCase()}
              <span className="text-rose-500 underline mx-2">_</span>
              {currentItem.key.slice(2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Options grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {options.map((opt) => {
            const isSelected = selectedAnswer === opt.id;
            let btnClass = 'bg-white border-2 border-slate-200 text-slate-800 hover:border-teal-400 hover:bg-teal-50/50 shadow-[0_4px_0_#E2E8F0]';
            if (isSelected) {
              if (feedback === 'correct') {
                btnClass = 'bg-emerald-500 border-2 border-emerald-600 text-white shadow-[0_4px_0_#065F46] animate-bounce';
              } else if (feedback === 'wrong') {
                btnClass = 'bg-rose-500 border-2 border-rose-600 text-white shadow-[0_4px_0_#9F1239] animate-shake';
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt)}
                disabled={feedback === 'correct'}
                className={`py-4 rounded-2xl font-black text-2xl md:text-3xl flex flex-col items-center justify-center transition-all active:translate-y-1 active:shadow-none ${btnClass}`}
              >
                <span>{opt.text}</span>
                {opt.sub && (
                  <span className={`text-xs mt-1 font-bold ${isSelected && feedback !== 'idle' ? 'text-white/90' : 'text-slate-400'}`}>
                    {opt.sub}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Phonics Expert Tip Banner */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5 text-left">
          <span className="text-lg">💡</span>
          <div>
            <div className="text-xs font-black text-amber-900">
              名师避坑口型诀窍：
            </div>
            <p className="text-xs font-bold text-amber-800/90 mt-0.5">
              {currentItem.tip}
            </p>
          </div>
        </div>

        {/* Bottom review streak counter */}
        <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-400 px-1">
          <span>攻克标准：连续答对 2 次自动标为已掌握</span>
          <span className="font-black text-teal-600">
            当前连对：{currentItem.correctStreakInReview} / 2
          </span>
        </div>
      </div>
    </div>
  );
}
