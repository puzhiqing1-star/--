import React, { useState, useEffect, useCallback } from 'react';
import { audioEngine } from '../../utils/audioEngine';
import { progressTracker } from '../../utils/progressTracker';
import { Sparkles, RefreshCw, Volume2, Award, CheckCircle2, Trophy, HelpCircle } from 'lucide-react';

export type MatchMode = 'case' | 'anchor' | 'confused';

interface CardItem {
  id: string; // unique card id in game
  pairId: string; // items with same pairId match
  type: 'letter' | 'match_target';
  displayTop: string; // Big symbol/letter
  displaySub: string; // Sub label / IPA
  phoneme: string;
  ipa: string;
  speechText: string;
  isPhonemeSpeech: boolean;
  colorClass: string;
}

const STAGE_SETS = [
  {
    id: 1,
    name: 'Level 1: S - A - T - P - I - N',
    items: [
      { letter: 's', ipa: '/s/', upper: 'S', word: 'sun', emoji: '☀️', name: '太阳 sun' },
      { letter: 'a', ipa: '/æ/', upper: 'A', word: 'apple', emoji: '🍎', name: '苹果 apple' },
      { letter: 't', ipa: '/t/', upper: 'T', word: 'ten', emoji: '🔟', name: '数字十 ten' },
      { letter: 'p', ipa: '/p/', upper: 'P', word: 'pen', emoji: '🖊️', name: '钢笔 pen' },
      { letter: 'i', ipa: '/ɪ/', upper: 'I', word: 'ink', emoji: '💧', name: '墨水 ink' },
      { letter: 'n', ipa: '/n/', upper: 'N', word: 'nest', emoji: '🪺', name: '鸟巢 nest' },
    ],
  },
  {
    id: 2,
    name: 'Level 2: C - K - E - H - R - M - D',
    items: [
      { letter: 'c', ipa: '/k/', upper: 'C', word: 'cat', emoji: '🐱', name: '小猫 cat' },
      { letter: 'e', ipa: '/e/', upper: 'E', word: 'egg', emoji: '🥚', name: '鸡蛋 egg' },
      { letter: 'h', ipa: '/h/', upper: 'H', word: 'hat', emoji: '🎩', name: '帽子 hat' },
      { letter: 'r', ipa: '/r/', upper: 'R', word: 'red', emoji: '🔴', name: '红色 red' },
      { letter: 'm', ipa: '/m/', upper: 'M', word: 'moon', emoji: '🌙', name: '月亮 moon' },
      { letter: 'd', ipa: '/d/', upper: 'D', word: 'dog', emoji: '🐶', name: '小狗 dog' },
    ],
  },
  {
    id: 3,
    name: 'Level 3: 易混音与口型对比',
    items: [
      { letter: 'a', ipa: '/æ/', upper: '大嘴苹果', word: 'apple', emoji: '🍎', name: '大嘴三指宽' },
      { letter: 'e', ipa: '/e/', upper: '微笑小蛋', word: 'egg', emoji: '🥚', name: '微笑两指宽' },
      { letter: 's', ipa: '/s/', upper: '小蛇嘶嘶', word: 'sun', emoji: '🐍', name: '舌尖后缩' },
      { letter: 'th', ipa: '/θ/', upper: '小兔咬舌', word: 'three', emoji: '👅', name: '舌尖微露咬住' },
      { letter: 'i', ipa: '/ɪ/', upper: '短促小老鼠', word: 'pig', emoji: '🐭', name: '短促放松' },
      { letter: 'ee', ipa: '/i:/', upper: '开心露齿', word: 'tree', emoji: '😁', name: '拉长露牙' },
    ],
  },
];

const CARD_COLORS = [
  'bg-amber-400 border-amber-500 text-amber-950',
  'bg-emerald-400 border-emerald-500 text-emerald-950',
  'bg-sky-400 border-sky-500 text-sky-950',
  'bg-purple-400 border-purple-500 text-purple-950',
  'bg-rose-400 border-rose-500 text-rose-950',
  'bg-teal-400 border-teal-500 text-teal-950',
];

export function LetterMatchingGame() {
  const [selectedStage, setSelectedStage] = useState(1);
  const [gameMode, setGameMode] = useState<MatchMode>('anchor');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [turns, setTurns] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Initialize deck
  const initDeck = useCallback(() => {
    const stage = STAGE_SETS.find((s) => s.id === selectedStage) || STAGE_SETS[0];
    const deck: CardItem[] = [];

    // Choose 4-5 pairs to keep game cognitively comfortable for 4-8 year olds
    const pairCount = selectedStage === 3 ? 4 : 4;
    const selectedPairs = stage.items.slice(0, pairCount);

    selectedPairs.forEach((item, idx) => {
      const color = CARD_COLORS[idx % CARD_COLORS.length];

      // Card 1: Letter Card (lowercase)
      deck.push({
        id: `c1-${item.letter}-${Math.random()}`,
        pairId: item.letter,
        type: 'letter',
        displayTop: item.letter,
        displaySub: item.ipa,
        phoneme: item.letter,
        ipa: item.ipa,
        speechText: item.letter,
        isPhonemeSpeech: true,
        colorClass: color,
      });

      // Card 2: Match Target
      if (gameMode === 'case') {
        // Uppercase match
        deck.push({
          id: `c2-${item.letter}-${Math.random()}`,
          pairId: item.letter,
          type: 'match_target',
          displayTop: item.upper,
          displaySub: `大写字母 ${item.upper}`,
          phoneme: item.letter,
          ipa: item.ipa,
          speechText: item.letter,
          isPhonemeSpeech: true,
          colorClass: color,
        });
      } else if (gameMode === 'anchor') {
        // Picture & Word match
        deck.push({
          id: `c2-${item.letter}-${Math.random()}`,
          pairId: item.letter,
          type: 'match_target',
          displayTop: item.emoji,
          displaySub: item.word,
          phoneme: item.letter,
          ipa: item.ipa,
          speechText: item.word,
          isPhonemeSpeech: false,
          colorClass: color,
        });
      } else {
        // Confused mouth / anchor match
        deck.push({
          id: `c2-${item.letter}-${Math.random()}`,
          pairId: item.letter,
          type: 'match_target',
          displayTop: item.emoji,
          displaySub: item.name,
          phoneme: item.letter,
          ipa: item.ipa,
          speechText: item.word,
          isPhonemeSpeech: false,
          colorClass: color,
        });
      }
    });

    // Shuffle deck
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIds([]);
    setMatchedPairIds([]);
    setTurns(0);
    setIsLocked(false);
    setShowCelebration(false);
  }, [selectedStage, gameMode]);

  useEffect(() => {
    initDeck();
  }, [initDeck]);

  const handleCardClick = (card: CardItem) => {
    if (isLocked) return;
    if (flippedIds.includes(card.id) || matchedPairIds.includes(card.pairId)) {
      // If already flipped, pronounce it again!
      playCardAudio(card);
      return;
    }

    // Play sound immediately on flip
    playCardAudio(card);

    const newFlipped = [...flippedIds, card.id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setTurns((t) => t + 1);

      const [id1, id2] = newFlipped;
      const card1 = cards.find((c) => c.id === id1);
      const card2 = cards.find((c) => c.id === id2);

      if (card1 && card2 && card1.pairId === card2.pairId) {
        // MATCH SUCCESS!
        setTimeout(() => {
          audioEngine.playSuccessChime();
          const nextMatched = [...matchedPairIds, card1.pairId];
          setMatchedPairIds(nextMatched);
          setFlippedIds([]);
          setIsLocked(false);

          // Track positive result in child's profile
          progressTracker.recordPhonemeResult(card1.phoneme, card1.ipa, true, '字母配对游戏');

          // Check if all pairs matched!
          const targetPairCount = cards.length / 2;
          if (nextMatched.length >= targetPairCount) {
            setTimeout(() => {
              setShowCelebration(true);
            }, 600);
          }
        }, 500);
      } else {
        // MISMATCH
        setTimeout(() => {
          audioEngine.playErrorBoing();
          if (card1) {
            progressTracker.recordPhonemeResult(card1.phoneme, card1.ipa, false, '字母配对游戏');
          }
          // Flip back
          setTimeout(() => {
            setFlippedIds([]);
            setIsLocked(false);
          }, 600);
        }, 800);
      }
    }
  };

  const playCardAudio = (card: CardItem) => {
    if (card.isPhonemeSpeech) {
      audioEngine.speakPhoneme(card.speechText, card.ipa);
    } else {
      audioEngine.speakWord(card.speechText);
    }
  };

  const totalPairs = cards.length / 2;
  const isAllMatched = matchedPairIds.length > 0 && matchedPairIds.length === totalPairs;

  return (
    <div className="bg-white rounded-3xl p-5 md:p-7 shadow-[0_5px_0_#E2E8F0] border-2 border-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-lg font-black shadow-inner">
              🎴
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-800">
              字母发音对对碰 (Sound & Shape Match)
            </h2>
          </div>
          <p className="text-xs md:text-sm font-bold text-slate-500 mt-1">
            翻开卡片听发音，将相同声音与形状的卡片凑成一对！
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <div className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>配对进度: {matchedPairIds.length} / {totalPairs}</span>
          </div>
          <button
            onClick={initDeck}
            className="btn-3d bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs px-3 py-1.5 rounded-2xl shadow-[0_3px_0_#CBD5E1] flex items-center gap-1 cursor-pointer"
            title="打乱重新发牌"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>重置发牌</span>
          </button>
        </div>
      </div>

      {/* Mode & Stage Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-100">
        {/* Game Mode Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-black text-slate-500 mr-1">配对模式:</span>
          <button
            onClick={() => setGameMode('anchor')}
            className={`btn-3d px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
              gameMode === 'anchor'
                ? 'bg-amber-500 text-white shadow-[0_3px_0_#D97706]'
                : 'bg-white text-slate-600 hover:bg-slate-100 shadow-[0_2px_0_#E2E8F0]'
            }`}
          >
            🍎 字母 ➔ 实物图案
          </button>
          <button
            onClick={() => setGameMode('case')}
            className={`btn-3d px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
              gameMode === 'case'
                ? 'bg-emerald-500 text-white shadow-[0_3px_0_#059669]'
                : 'bg-white text-slate-600 hover:bg-slate-100 shadow-[0_2px_0_#E2E8F0]'
            }`}
          >
            🔠 大小写 Aa 配对
          </button>
          <button
            onClick={() => setGameMode('confused')}
            className={`btn-3d px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
              gameMode === 'confused'
                ? 'bg-purple-600 text-white shadow-[0_3px_0_#4C1D95]'
                : 'bg-white text-slate-600 hover:bg-slate-100 shadow-[0_2px_0_#E2E8F0]'
            }`}
          >
            👄 易混音口型配对
          </button>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black text-slate-500 mr-1">关卡:</span>
          {STAGE_SETS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStage(s.id)}
              className={`btn-3d px-2.5 py-1.5 rounded-xl text-xs font-black cursor-pointer ${
                selectedStage === s.id
                  ? 'bg-indigo-600 text-white shadow-[0_3px_0_#3730A3]'
                  : 'bg-white text-slate-600 hover:bg-slate-100 shadow-[0_2px_0_#E2E8F0]'
              }`}
            >
              关卡 {s.id}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 max-w-2xl mx-auto my-4">
        {cards.map((card) => {
          const isFlipped = flippedIds.includes(card.id);
          const isMatched = matchedPairIds.includes(card.pairId);

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`relative h-32 md:h-36 rounded-2xl cursor-pointer select-none transition-all duration-300 transform preserve-3d ${
                isMatched
                  ? 'bg-emerald-50 border-2 border-emerald-400 shadow-[0_5px_0_#10B981] scale-98 opacity-95'
                  : isFlipped
                  ? 'bg-white border-2 border-amber-400 shadow-[0_5px_0_#F59E0B] -translate-y-1'
                  : 'bg-gradient-to-b from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 shadow-[0_6px_0_#1D4ED8] active:translate-y-1 active:shadow-[0_2px_0_#1D4ED8]'
              }`}
            >
              {isFlipped || isMatched ? (
                // Card Front (Revealed)
                <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center animate-in fade-in zoom-in-95 duration-200">
                  <div className="text-4xl md:text-5xl font-black font-mono tracking-wide mb-1">
                    {card.displayTop}
                  </div>
                  <div className="text-xs font-black text-slate-600 flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-amber-500 inline" />
                    <span>{card.displaySub}</span>
                  </div>
                  {isMatched && (
                    <div className="absolute top-2 right-2 text-emerald-500 animate-bounce">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ) : (
                // Card Back (Covered)
                <div className="w-full h-full flex flex-col items-center justify-center p-3 text-white">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-black shadow-inner border border-white/30">
                    ?
                  </div>
                  <span className="text-[11px] font-black text-sky-100 mt-2 tracking-wider">
                    点击翻开
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hint & Encouragement Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-sky-500" />
          <span>规则：翻开两张卡片，如果发音和形状对应，卡片就会变绿锁住！</span>
        </div>
        <div>
          <span>已尝试翻牌: </span>
          <span className="font-black text-slate-800">{turns} 次</span>
        </div>
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl border-4 border-amber-300 animate-in zoom-in duration-200">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-5xl mb-4 shadow-inner border-2 border-amber-300 animate-bounce">
              🌟
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-1">
              太棒啦！配对大成功！
            </h3>
            <p className="text-xs md:text-sm font-bold text-slate-500 mb-5">
              你在 {turns} 次翻牌中完成了全部配对！字母形状与声音已牢牢印在大脑中！
            </p>

            <div className="bg-amber-50 rounded-2xl p-4 mb-5 border border-amber-200 flex items-center justify-around">
              <div>
                <div className="text-xs font-bold text-amber-700">获得星星</div>
                <div className="text-xl font-black text-amber-900">+15 ⭐</div>
              </div>
              <div className="h-8 w-px bg-amber-200"></div>
              <div>
                <div className="text-xs font-bold text-amber-700">准确度</div>
                <div className="text-xl font-black text-amber-900">
                  {turns <= totalPairs + 2 ? '超神 100%' : '极佳 90%'}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowCelebration(false);
                  initDeck();
                }}
                className="btn-3d w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-black text-sm shadow-[0_4px_0_#D97706] cursor-pointer"
              >
                再玩一局新发牌
              </button>
              {selectedStage < 3 && (
                <button
                  onClick={() => {
                    setSelectedStage((s) => s + 1);
                    setShowCelebration(false);
                  }}
                  className="btn-3d w-full py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm shadow-[0_4px_0_#059669] cursor-pointer"
                >
                  挑战下一关 ➔
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
