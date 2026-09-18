import React, { useState, useEffect, useCallback } from 'react';
import { audioEngine } from '../../utils/audioEngine';
import { progressTracker } from '../../utils/progressTracker';
import { Volume2, Sparkles, RefreshCw, CheckCircle2, RotateCcw, HelpCircle, Star, ArrowRight } from 'lucide-react';

export type SpellingGameMode = 'missing_onset' | 'missing_vowel' | 'scramble';

interface WordChallenge {
  id: string;
  word: string;
  emoji: string;
  meaning: string;
  letters: string[];
  phonemes: string[];
  missingIndex?: number; // for fill-in-the-blank
  candidateOptions?: string[]; // distractors
}

const WORD_BANK: WordChallenge[] = [
  { id: 'cat', word: 'cat', emoji: '🐱', meaning: '小猫', letters: ['c', 'a', 't'], phonemes: ['k', 'a', 't'] },
  { id: 'sun', word: 'sun', emoji: '☀️', meaning: '太阳', letters: ['s', 'u', 'n'], phonemes: ['s', 'u', 'n'] },
  { id: 'pig', word: 'pig', emoji: '🐷', meaning: '小猪', letters: ['p', 'i', 'g'], phonemes: ['p', 'i', 'g'] },
  { id: 'bed', word: 'bed', emoji: '🛏️', meaning: '小床', letters: ['b', 'e', 'd'], phonemes: ['b', 'e', 'd'] },
  { id: 'hat', word: 'hat', emoji: '🎩', meaning: '帽子', letters: ['h', 'a', 't'], phonemes: ['h', 'a', 't'] },
  { id: 'cup', word: 'cup', emoji: '🥤', meaning: '水杯', letters: ['c', 'u', 'p'], phonemes: ['k', 'u', 'p'] },
  { id: 'pen', word: 'pen', emoji: '🖊️', meaning: '钢笔', letters: ['p', 'e', 'n'], phonemes: ['p', 'e', 'n'] },
  { id: 'dog', word: 'dog', emoji: '🐶', meaning: '小狗', letters: ['d', 'o', 'g'], phonemes: ['d', 'o', 'g'] },
  { id: 'fox', word: 'fox', emoji: '🦊', meaning: '狐狸', letters: ['f', 'o', 'x'], phonemes: ['f', 'o', 'x'] },
  { id: 'bus', word: 'bus', emoji: '🚌', meaning: '巴士', letters: ['b', 'u', 's'], phonemes: ['b', 'u', 's'] },
  { id: 'bag', word: 'bag', emoji: '🎒', meaning: '书包', letters: ['b', 'a', 'g'], phonemes: ['b', 'a', 'g'] },
  { id: 'fish', word: 'fish', emoji: '🐟', meaning: '小鱼', letters: ['f', 'i', 'sh'], phonemes: ['f', 'i', 'sh'] },
];

export function WordSpellingGame() {
  const [gameMode, setGameMode] = useState<SpellingGameMode>('missing_onset');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<WordChallenge>(WORD_BANK[0]);
  const [slots, setSlots] = useState<Array<string | null>>([]);
  const [availableTiles, setAvailableTiles] = useState<Array<{ id: string; letter: string; used: boolean }>>([]);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [streak, setStreak] = useState(0);
  const [stars, setStars] = useState(0);

  // Setup current challenge
  const setupWord = useCallback(
    (index: number, mode: SpellingGameMode) => {
      const target = WORD_BANK[index % WORD_BANK.length];
      setCurrentWord(target);
      setStatus('idle');

      if (mode === 'missing_onset') {
        // Missing index 0 (initial consonant)
        const initialSlots: Array<string | null> = [null, ...target.letters.slice(1)];
        setSlots(initialSlots);

        // Options: correct letter + 3 distractors
        const correctLetter = target.letters[0];
        const distractors = ['s', 'b', 'p', 'c', 'h', 'm', 'd', 't'].filter((l) => l !== correctLetter);
        const pickedDistractors = distractors.sort(() => Math.random() - 0.5).slice(0, 3);
        const allTiles = [correctLetter, ...pickedDistractors]
          .sort(() => Math.random() - 0.5)
          .map((l, i) => ({ id: `tile-${l}-${i}`, letter: l, used: false }));
        setAvailableTiles(allTiles);
      } else if (mode === 'missing_vowel') {
        // Missing index 1 (vowel)
        const vowelIndex = target.letters.length === 3 ? 1 : 1;
        const initialSlots: Array<string | null> = target.letters.map((l, i) => (i === vowelIndex ? null : l));
        setSlots(initialSlots);

        // Vowel options: a, e, i, o, u
        const correctVowel = target.letters[vowelIndex];
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        const allTiles = vowels.map((v, i) => ({
          id: `tile-vowel-${v}-${i}`,
          letter: v,
          used: false,
        }));
        setAvailableTiles(allTiles);
      } else {
        // Scramble mode: all slots empty
        const initialSlots: Array<string | null> = new Array(target.letters.length).fill(null);
        setSlots(initialSlots);

        // All letters scrambled
        const scrambled = [...target.letters]
          .sort(() => Math.random() - 0.5)
          .map((l, i) => ({ id: `tile-scramble-${l}-${i}`, letter: l, used: false }));
        setAvailableTiles(scrambled);
      }

      // Read audio clue with pleasant delay
      setTimeout(() => {
        audioEngine.speakWord(target.word);
      }, 300);
    },
    []
  );

  useEffect(() => {
    setupWord(currentIndex, gameMode);
  }, [currentIndex, gameMode, setupWord]);

  // Click on letter tile to fill first empty slot
  const handleTileClick = (tile: { id: string; letter: string; used: boolean }) => {
    if (status === 'success') return;

    // Pronounce letter phoneme
    audioEngine.speakPhoneme(tile.letter);

    // Find first empty slot
    const emptyIndex = slots.findIndex((s) => s === null);
    if (emptyIndex === -1) return; // all slots filled

    const nextSlots = [...slots];
    nextSlots[emptyIndex] = tile.letter;
    setSlots(nextSlots);

    // In scramble mode, mark tile as used
    if (gameMode === 'scramble') {
      setAvailableTiles((prev) =>
        prev.map((t) => (t.id === tile.id ? { ...t, used: true } : t))
      );
    }

    // Check if slots are fully filled now
    if (!nextSlots.includes(null)) {
      validateSpelling(nextSlots);
    }
  };

  // Click on a slot to remove its letter
  const handleSlotClick = (index: number) => {
    if (status === 'success') return;
    const removedLetter = slots[index];
    if (!removedLetter) return;

    // In missing_onset / missing_vowel modes, you can only clear the missing slot!
    if (gameMode === 'missing_onset' && index !== 0) return;
    if (gameMode === 'missing_vowel' && index !== 1) return;

    audioEngine.playPop(500);
    const nextSlots = [...slots];
    nextSlots[index] = null;
    setSlots(nextSlots);
    setStatus('idle');

    // If scramble mode, return tile to available pool
    if (gameMode === 'scramble') {
      const tileIndex = availableTiles.findIndex((t) => t.letter === removedLetter && t.used);
      if (tileIndex !== -1) {
        const nextTiles = [...availableTiles];
        nextTiles[tileIndex] = { ...nextTiles[tileIndex], used: false };
        setAvailableTiles(nextTiles);
      }
    }
  };

  // Validate spelling
  const validateSpelling = (filledSlots: Array<string | null>) => {
    const spelled = filledSlots.join('');
    const correct = currentWord.letters.join('');

    if (spelled === correct) {
      // SUCCESS!
      setStatus('success');
      audioEngine.playSuccessChime();
      setStreak((s) => s + 1);
      setStars((s) => s + 3);

      progressTracker.recordSpellingResult(currentWord.word, currentWord.emoji, true);

      // Celebrate & pronounce full word
      setTimeout(() => {
        audioEngine.speakWord(currentWord.word);
      }, 500);
    } else {
      // INCORRECT
      setStatus('error');
      audioEngine.playErrorBoing();
      setStreak(0);

      progressTracker.recordSpellingResult(currentWord.word, currentWord.emoji, false);
    }
  };

  const handleNextWord = () => {
    audioEngine.playPop(700);
    setCurrentIndex((i) => i + 1);
  };

  const handleResetSlots = () => {
    audioEngine.playPop(400);
    setupWord(currentIndex, gameMode);
  };

  const handleSpeakClue = () => {
    audioEngine.speakWord(currentWord.word);
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-7 shadow-[0_5px_0_#E2E8F0] border-2 border-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg font-black shadow-inner">
              🎈
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-800">
              魔法单词气球填空 (Spelling Fill-in)
            </h2>
          </div>
          <p className="text-xs md:text-sm font-bold text-slate-500 mt-1">
            看图案听发音，将缺失的字母气球填入卡槽，拼出完整单词！
          </p>
        </div>

        {/* Action Controls & Streak */}
        <div className="flex items-center gap-2">
          <div className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>连对连胜: {streak} 连击</span>
          </div>
          <button
            onClick={handleResetSlots}
            className="btn-3d bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs px-3 py-1.5 rounded-2xl shadow-[0_3px_0_#CBD5E1] flex items-center gap-1 cursor-pointer"
            title="清空已填字母"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* Mode Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-100">
        <span className="text-xs font-black text-slate-500">拼写挑战难度:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setGameMode('missing_onset')}
            className={`btn-3d px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
              gameMode === 'missing_onset'
                ? 'bg-purple-600 text-white shadow-[0_3px_0_#4C1D95]'
                : 'bg-white text-slate-600 hover:bg-slate-100 shadow-[0_2px_0_#E2E8F0]'
            }`}
          >
            1. 首字母缺失填空 (_ a t)
          </button>
          <button
            onClick={() => setGameMode('missing_vowel')}
            className={`btn-3d px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
              gameMode === 'missing_vowel'
                ? 'bg-rose-500 text-white shadow-[0_3px_0_#BE123C]'
                : 'bg-white text-slate-600 hover:bg-slate-100 shadow-[0_2px_0_#E2E8F0]'
            }`}
          >
            2. 核心短元音填空 (c _ t)
          </button>
          <button
            onClick={() => setGameMode('scramble')}
            className={`btn-3d px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
              gameMode === 'scramble'
                ? 'bg-emerald-500 text-white shadow-[0_3px_0_#059669]'
                : 'bg-white text-slate-600 hover:bg-slate-100 shadow-[0_2px_0_#E2E8F0]'
            }`}
          >
            3. 全词乱序重组拼装
          </button>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="bg-gradient-to-b from-indigo-50/50 via-purple-50/30 to-pink-50/30 rounded-3xl p-6 border-2 border-indigo-100 text-center max-w-xl mx-auto mb-6 relative overflow-hidden">
        {/* Big Word Anchor Card */}
        <div className="inline-block relative">
          <div className="w-28 h-28 mx-auto rounded-3xl bg-white shadow-md border-2 border-indigo-200 flex items-center justify-center text-6xl mb-3 animate-pulse">
            {currentWord.emoji}
          </div>
          <span className="text-xs font-black bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full shadow-sm">
            {currentWord.meaning}
          </span>
        </div>

        {/* Audio Clue Trigger */}
        <div className="my-3">
          <button
            onClick={handleSpeakClue}
            className="btn-3d inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-black text-sm px-4 py-2 rounded-2xl shadow-[0_3px_0_#6D28D9] cursor-pointer"
          >
            <Volume2 className="w-4 h-4 animate-bounce" />
            <span>听一听单词读音</span>
          </button>
        </div>

        {/* Word Letter Slots */}
        <div className="flex items-center justify-center gap-3 md:gap-4 my-6">
          {slots.map((letter, idx) => {
            const isMissingSlot =
              (gameMode === 'missing_onset' && idx === 0) ||
              (gameMode === 'missing_vowel' && idx === 1) ||
              gameMode === 'scramble';

            return (
              <div
                key={idx}
                onClick={() => handleSlotClick(idx)}
                className={`w-18 h-22 md:w-22 md:h-26 rounded-3xl flex flex-col items-center justify-center text-4xl md:text-5xl font-mono font-black transition-all cursor-pointer select-none ${
                  letter
                    ? status === 'success'
                      ? 'bg-emerald-500 text-white shadow-[0_6px_0_#059669] scale-105 animate-bounce'
                      : status === 'error'
                      ? 'bg-rose-100 border-2 border-rose-400 text-rose-800 shadow-[0_4px_0_#FDA4AF] animate-shake'
                      : 'bg-white border-2 border-purple-400 text-slate-800 shadow-[0_4px_0_#C084FC]'
                    : isMissingSlot
                    ? 'bg-white/80 border-3 border-dashed border-purple-300 text-purple-400 shadow-inner'
                    : 'bg-slate-100 border-2 border-slate-200 text-slate-500'
                }`}
              >
                {letter || <span className="text-sm font-bold opacity-40">点这里</span>}
              </div>
            );
          })}
        </div>

        {/* Status Prompt */}
        <div className="min-h-8 text-sm font-black flex items-center justify-center gap-1.5">
          {status === 'success' && (
            <div className="text-emerald-700 bg-emerald-100 px-4 py-1.5 rounded-full flex items-center gap-1.5 animate-in zoom-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>太聪明啦！正确拼写出 {currentWord.word.toUpperCase()}！</span>
            </div>
          )}
          {status === 'error' && (
            <div className="text-rose-700 bg-rose-100 px-4 py-1.5 rounded-full flex items-center gap-1.5 animate-shake">
              <span>再仔细听听发音，选另外一个字母试试哦～</span>
            </div>
          )}
          {status === 'idle' && (
            <span className="text-slate-400 text-xs">
              点击下方字母气球放入空格中
            </span>
          )}
        </div>
      </div>

      {/* Available Candidate Tiles */}
      <div className="max-w-xl mx-auto text-center">
        <div className="text-xs font-black text-slate-500 mb-3">
          备选字母气球 (点击试听发音并填入):
        </div>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {availableTiles.map((tile) => (
            <button
              key={tile.id}
              disabled={tile.used || status === 'success'}
              onClick={() => handleTileClick(tile)}
              className={`btn-3d w-16 h-16 md:w-18 md:h-18 rounded-2xl text-3xl md:text-4xl font-mono font-black cursor-pointer select-none transition-all ${
                tile.used
                  ? 'bg-slate-200 text-slate-400 shadow-none border-dashed border border-slate-300 opacity-40 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-[0_5px_0_#D97706] active:translate-y-1'
              }`}
            >
              {tile.letter}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
          <HelpCircle className="w-4 h-4 text-purple-500" />
          <span>点击卡槽内的字母可以退回重选</span>
        </div>

        <button
          onClick={handleNextWord}
          className="btn-3d bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs md:text-sm px-4 py-2.5 rounded-2xl shadow-[0_4px_0_#059669] flex items-center gap-2 cursor-pointer"
        >
          <span>下一个单词</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
