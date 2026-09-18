import React, { useState, useEffect, useMemo } from 'react';
import {
  ALL_OXFORD_UNITS,
  OXFORD_LEVELS_METADATA,
  OxfordLessonUnit,
  MindMapSoundGroup,
  MindMapWordBranch,
  OrtStoryLine,
  OrtQuizItem,
} from '../data/oxfordPhonicsIndex';
import {
  getIpaBreakdownForWord,
  getIpaDetailData,
  getTrickyMouthGuide,
  IpaDetailModalData,
} from '../utils/phonicsIpaLinker';
import { IpaAnchorDrawer } from './IpaAnchorDrawer';
import { MouthMirrorModal } from './MouthMirrorModal';
import { audioEngine } from '../utils/audioEngine';
import { progressTracker } from '../utils/progressTracker';
import {
  BookOpen,
  Volume2,
  Sparkles,
  Award,
  CheckCircle2,
  RotateCcw,
  Printer,
  ChevronRight,
  Eye,
  EyeOff,
  Flame,
  Star,
  Search,
  BookMarked,
  Layers,
  Compass,
  ArrowRight,
  Smile,
} from 'lucide-react';

interface OxfordReviewHubProps {
  initialUnitId?: string;
  onNavigateTab?: (tab: string, subAction?: string) => void;
}

type StepType = 'flashcards' | 'blending' | 'story' | 'quiz';
type ViewMode = 'mindmap' | 'lesson';

export const OxfordReviewHub: React.FC<OxfordReviewHubProps> = ({
  initialUnitId,
  onNavigateTab,
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(() => {
    if (initialUnitId && ALL_OXFORD_UNITS.some((u) => u.id === initialUnitId)) {
      return initialUnitId;
    }
    return ALL_OXFORD_UNITS[0].id;
  });
  const [viewMode, setViewMode] = useState<ViewMode>('lesson');
  const [activeStep, setActiveStep] = useState<StepType>('flashcards');
  const [activeLevelFilter, setActiveLevelFilter] = useState<number>(1); // 1 = Level 1 by default
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [masteredUnitIds, setMasteredUnitIds] = useState<string[]>([]);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [largeLetterFont, setLargeLetterFont] = useState<boolean>(true);

  // IPA X-Ray & Bridge states
  const [showIpaXRay, setShowIpaXRay] = useState<boolean>(true);
  const [selectedIpaDetail, setSelectedIpaDetail] = useState<IpaDetailModalData | null>(null);
  const [activeMouthMirrorId, setActiveMouthMirrorId] = useState<string | null>(null);

  // Blending interactive state
  const [activeWordIdx, setActiveWordIdx] = useState<number>(0);
  const [highlightPhonemeIdx, setHighlightPhonemeIdx] = useState<number | null>(null);

  // Quiz state
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizStatus, setQuizStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  // Expanded sound groups in mind map
  const [expandedUnitIds, setExpandedUnitIds] = useState<Record<string, boolean>>({
    [ALL_OXFORD_UNITS[0].id]: true,
  });

  // Load mastered units
  useEffect(() => {
    try {
      const saved = localStorage.getItem('magic_oxford_mastered_units');
      if (saved) {
        setMasteredUnitIds(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const currentUnit: OxfordLessonUnit = useMemo(() => {
    return ALL_OXFORD_UNITS.find((u) => u.id === selectedUnitId) || ALL_OXFORD_UNITS[0];
  }, [selectedUnitId]);

  const filteredUnits = useMemo(() => {
    let list = ALL_OXFORD_UNITS;
    if (activeLevelFilter !== 0) {
      list = list.filter((u) => u.level === activeLevelFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((u) => {
        const titleMatch = u.unitTitle.toLowerCase().includes(q) || u.subtitle.toLowerCase().includes(q);
        const rhymeMatch = u.summaryRhyme.toLowerCase().includes(q);
        const soundMatch = u.soundGroups.some(
          (sg) =>
            sg.symbol.toLowerCase().includes(q) ||
            sg.words.some((w) => w.word.toLowerCase().includes(q) || w.meaning.includes(q))
        );
        return titleMatch || rhymeMatch || soundMatch;
      });
    }
    return list;
  }, [activeLevelFilter, searchQuery]);

  // All words in current unit flattened
  const allUnitWords: MindMapWordBranch[] = useMemo(() => {
    return currentUnit.soundGroups.flatMap((sg) => sg.words);
  }, [currentUnit]);

  const activeWord: MindMapWordBranch | undefined = allUnitWords[activeWordIdx] || allUnitWords[0];

  // Sync initialUnitId from navigation
  useEffect(() => {
    if (initialUnitId && ALL_OXFORD_UNITS.some((u) => u.id === initialUnitId)) {
      setSelectedUnitId(initialUnitId);
      setViewMode('lesson');
      setActiveWordIdx(0);
      setHighlightPhonemeIdx(null);
    }
  }, [initialUnitId]);

  // Tricky mouth guide if current unit contains challenging sounds
  const activeTrickyMouthGuide = useMemo(() => {
    for (const sg of currentUnit.soundGroups) {
      const guide = getTrickyMouthGuide(sg.ipa);
      if (guide) return guide;
    }
    return null;
  }, [currentUnit]);

  const handleOpenIpaDetail = (ipaSym: string) => {
    const detail = getIpaDetailData(ipaSym);
    setSelectedIpaDetail(detail);
    audioEngine.speakIpaSound(ipaSym);
  };

  // Build enhanced quiz list with interactive IPA lock question
  const unitQuizList: OrtQuizItem[] = useMemo(() => {
    const list = [...currentUnit.quiz];
    if (currentUnit.soundGroups.length > 0) {
      const targetSg = currentUnit.soundGroups[0];
      const targetWordObj = targetSg.words[0];
      if (targetWordObj) {
        const fullWordIpa = getIpaBreakdownForWord(targetWordObj.word, targetWordObj.phonicsBreakdown).join('');
        list.push({
          id: `quiz-ipa-lock-${currentUnit.id}`,
          type: 'ipa_match',
          prompt: `🗝️ 音标钥匙配对：请听发音，选出单词 "${targetWordObj.word}" 的正确音标钥匙！`,
          audioTarget: targetWordObj.word,
          options: [
            {
              id: 'ipa-opt-correct',
              text: `/${fullWordIpa}/`,
              emoji: '🗝️',
              sub: `正确钥匙: ${targetWordObj.word}`,
              isCorrect: true,
            },
            {
              id: 'ipa-opt-wrong-1',
              text: targetSg.soundId === 'sg-a' ? '/bed/' : '/kæt/',
              emoji: '🔒',
              sub: '密码不匹配',
              isCorrect: false,
            },
            {
              id: 'ipa-opt-wrong-2',
              text: '/sɪt/',
              emoji: '🔒',
              sub: '密码不匹配',
              isCorrect: false,
            },
          ],
        });
      }
    }
    return list;
  }, [currentUnit]);

  const handleSelectUnit = (unit: OxfordLessonUnit, targetStep: StepType = 'flashcards') => {
    setSelectedUnitId(unit.id);
    setActiveStep(targetStep);
    setViewMode('lesson');
    setActiveWordIdx(0);
    setHighlightPhonemeIdx(null);
    setQuizIdx(0);
    setQuizSelectedOption(null);
    setQuizStatus('idle');
    setQuizScore(0);
    setIsQuizCompleted(false);
    audioEngine.playPop(750);
  };

  const toggleUnitExpand = (unitId: string) => {
    setExpandedUnitIds((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
    audioEngine.playPop(600);
  };

  // Step 1: Speak Sound / Phoneme (strictly pure isolated sound, never whole words)
  const handleSoundGroupClick = (sg: MindMapSoundGroup) => {
    audioEngine.speakIpaSound(sg.ipa);
  };

  const handleWordClick = (word: MindMapWordBranch) => {
    audioEngine.speakWord(word.word, 0.92);
  };

  // Step 2: Decodable Blending
  const handleBlendWord = (word: MindMapWordBranch) => {
    audioEngine.speakWord(word.word, 0.95);
  };

  const handleStepPhoneme = (phoneme: string, idx: number) => {
    setHighlightPhonemeIdx(idx);
    if (activeWord) {
      const activeWordIpaList = getIpaBreakdownForWord(activeWord.word, activeWord.phonicsBreakdown);
      const ipa = activeWordIpaList[idx];
      if (ipa) {
        audioEngine.speakIpaSound(ipa);
      } else {
        audioEngine.speakPhoneme(phoneme, undefined, undefined, undefined, true);
      }
    } else {
      audioEngine.speakPhoneme(phoneme, undefined, undefined, undefined, true);
    }
    setTimeout(() => {
      setHighlightPhonemeIdx(null);
    }, 600);
  };

  // Step 3: Story Reader
  const handlePlayStoryLine = (line: OrtStoryLine) => {
    audioEngine.speakWord(line.text, 0.9);
  };

  const handleWordInSentenceClick = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    if (cleanWord) {
      audioEngine.speakWord(cleanWord, 0.95);
    }
  };

  // Step 4: Quiz
  const currentQuiz: OrtQuizItem | undefined = unitQuizList[quizIdx];

  const handlePlayQuizAudio = () => {
    if (!currentQuiz) return;
    audioEngine.speakWord(currentQuiz.audioTarget, 0.9);
  };

  const handleSelectQuizOption = (opt: { id: string; text: string; isCorrect: boolean }) => {
    if (quizStatus === 'correct') return;
    setQuizSelectedOption(opt.id);

    if (opt.isCorrect) {
      setQuizStatus('correct');
      audioEngine.playSuccessChime();
      const newScore = quizScore + 10;
      setQuizScore(newScore);

      setTimeout(() => {
        if (quizIdx < unitQuizList.length - 1) {
          setQuizIdx((prev) => prev + 1);
          setQuizSelectedOption(null);
          setQuizStatus('idle');
        } else {
          setIsQuizCompleted(true);
          audioEngine.playCheerFanfare();
          // Mark unit as mastered
          if (!masteredUnitIds.includes(currentUnit.id)) {
            const updated = [...masteredUnitIds, currentUnit.id];
            setMasteredUnitIds(updated);
            try {
              localStorage.setItem('magic_oxford_mastered_units', JSON.stringify(updated));
            } catch {
              // ignore
            }
          }
          progressTracker.recordSpellingResult(opt.text, '🏅', true);
        }
      }, 1100);
    } else {
      setQuizStatus('wrong');
      audioEngine.playErrorBoing();
      setTimeout(() => {
        setQuizStatus('idle');
        setQuizSelectedOption(null);
      }, 1000);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-100 text-xs font-bold border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>牛津树自然拼读体系 (Oxford Phonics World 1-5 级全套)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>牛津自然拼读课程与思维导图</span>
              <span className="text-sm font-bold bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full shadow-sm">
                40 节细化课时
              </span>
            </h1>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              严格根据牛津树 1-5 级思维导图与教材脉络细化对应：音素族、代表单词分解、思维导图韵律诗、原版故事逐句点读及课后闯关测评。
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold text-white/90">
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
                <Compass className="w-4 h-4 text-emerald-300" />
                <span>已通关课时：{masteredUnitIds.length} / {ALL_OXFORD_UNITS.length}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
                <Flame className="w-4 h-4 text-amber-300" />
                <span>5 大层级 · 40 课 · 400+ 核心拼读词</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: View Toggle & Print */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Mind Map vs Lesson View Toggle */}
            <div className="bg-black/30 p-1 rounded-2xl flex items-center border border-white/20">
              <button
                id="btn-switch-mindmap"
                onClick={() => {
                  setViewMode('mindmap');
                  audioEngine.playPop(700);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'mindmap'
                    ? 'bg-white text-emerald-900 shadow-md scale-105'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>思维导图总览</span>
              </button>
              <button
                id="btn-switch-lesson"
                onClick={() => {
                  setViewMode('lesson');
                  audioEngine.playPop(750);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'lesson'
                    ? 'bg-white text-emerald-900 shadow-md scale-105'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>每课深度学习</span>
              </button>
            </div>

            {/* Letter Font Size Quick Toggle */}
            <button
              id="btn-toggle-font-size"
              onClick={() => {
                setLargeLetterFont(!largeLetterFont);
                audioEngine.playPop(800);
              }}
              className="btn-3d px-3.5 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 border border-amber-300 rounded-2xl text-xs font-black shadow-[0_2px_0_#D97706] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="切换学习字母字号大小"
            >
              <span className="text-sm">🔤</span>
              <span>{largeLetterFont ? '特大字母 A++' : '大号字母 A+'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="btn-3d px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/30 rounded-2xl text-xs font-black backdrop-blur-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="打印本课复习纸"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">打印复习单</span>
            </button>
          </div>
        </div>
      </div>

      {/* LEVEL SELECTOR TABS (LEVEL 1 to 5) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              教材分级筛选
            </span>
            <span className="text-xs font-bold text-slate-400">
              (点击切换 1 - 5 级课表)
            </span>
          </div>
          {/* Search box */}
          <div className="relative w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索发音、单词或课时..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          <button
            onClick={() => {
              setActiveLevelFilter(0);
              audioEngine.playPop(650);
            }}
            className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeLevelFilter === 0
                ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">🌟</span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                40 课
              </span>
            </div>
            <div className="mt-1">
              <p className="text-xs font-black text-slate-800">全部课程</p>
              <p className="text-[10px] text-slate-400">1 - 5 级总览</p>
            </div>
          </button>

          {OXFORD_LEVELS_METADATA.map((meta) => {
            const isSelected = activeLevelFilter === meta.level;
            return (
              <button
                key={meta.level}
                onClick={() => {
                  setActiveLevelFilter(meta.level);
                  audioEngine.playPop(650 + meta.level * 30);
                }}
                className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/80 shadow-md ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{meta.badgeEmoji}</span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {meta.unitCount} 课
                  </span>
                </div>
                <div className="mt-1">
                  <p className="text-xs font-black text-slate-800 truncate">
                    Level {meta.level}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{meta.enTitle.split(' ')[0]}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODE 1: INTERACTIVE MIND MAP VIEW (思维导图模式) */}
      {/* ============================================================ */}
      {viewMode === 'mindmap' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <span>牛津树 1-5 级体系思维导图分支树</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  点击思维导图上的音素标签直接听发音，点击单词直接发音，点击【进入本课】直接开启课文与闯关。
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const allExp: Record<string, boolean> = {};
                    filteredUnits.forEach((u) => {
                      allExp[u.id] = true;
                    });
                    setExpandedUnitIds(allExp);
                    audioEngine.playPop(700);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  全部展开
                </button>
                <button
                  onClick={() => {
                    setExpandedUnitIds({});
                    audioEngine.playPop(600);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  全部折叠
                </button>
              </div>
            </div>

            {/* Mind Map Units Tree */}
            <div className="space-y-4 pt-4">
              {filteredUnits.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-sm font-bold">未找到匹配的课时或发音</p>
                </div>
              ) : (
                filteredUnits.map((unit) => {
                  const isExpanded = !!expandedUnitIds[unit.id];
                  const isCurrent = unit.id === selectedUnitId;
                  const isMastered = masteredUnitIds.includes(unit.id);

                  return (
                    <div
                      key={unit.id}
                      className={`rounded-2xl border-2 transition-all ${
                        isCurrent
                          ? 'border-emerald-400 bg-emerald-50/40 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {/* Unit Node Header */}
                      <div
                        onClick={() => toggleUnitExpand(unit.id)}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-2 rounded-xl bg-slate-100">
                            {unit.coverEmoji}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                L{unit.level} · Unit {unit.unitNum}
                              </span>
                              {isMastered && (
                                <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 已掌握
                                </span>
                              )}
                            </div>
                            <h3 className="text-sm font-black text-slate-800 mt-0.5">
                              {unit.unitTitle}
                            </h3>
                            <p className="text-xs text-slate-500">{unit.subtitle}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectUnit(unit, 'flashcards');
                            }}
                            className="btn-3d px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-[0_2px_0_#059669] flex items-center gap-1 cursor-pointer"
                          >
                            <span>进入本课精学</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-black">
                            {isExpanded ? '▲' : '▼'}
                          </div>
                        </div>
                      </div>

                      {/* Mind Map Branch Content */}
                      {isExpanded && (
                        <div className="p-4 pt-0 border-t border-slate-100 space-y-4">
                          {/* Summary Rhyme */}
                          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                              <span className="text-sm">🎶</span>
                              <span>思维导图口诀："{unit.summaryRhyme}"</span>
                            </div>
                            <button
                              onClick={() => audioEngine.speakWord(unit.summaryRhyme, 0.9)}
                              className="p-1.5 rounded-lg bg-amber-200/60 hover:bg-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
                              title="听口诀"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span className="text-[10px]">读口诀</span>
                            </button>
                          </div>

                          {/* Sound Group Branches */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {unit.soundGroups.map((sg) => (
                              <div
                                key={sg.soundId}
                                className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2.5"
                              >
                                <div className="flex items-center justify-between">
                                  <button
                                    onClick={() => handleSoundGroupClick(sg)}
                                    className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer text-left"
                                  >
                                    <span
                                      className={`px-3 py-1 rounded-xl font-mono font-black text-white shadow-sm flex items-center justify-center tracking-wide ${
                                        largeLetterFont ? 'text-xl sm:text-2xl min-w-[48px]' : 'text-base sm:text-lg min-w-[38px]'
                                      }`}
                                      style={{ backgroundColor: sg.color }}
                                    >
                                      {sg.symbol}
                                    </span>
                                    <div>
                                      <span className="text-xs sm:text-sm font-mono font-bold text-slate-600 block">
                                        {sg.ipa}
                                      </span>
                                      <span className="text-[10px] text-slate-400">点击点读</span>
                                    </div>
                                    <Volume2 className="w-4 h-4 text-slate-400" />
                                  </button>
                                  <span className="text-[10px] text-slate-400 font-bold">
                                    {sg.words.length} 词
                                  </span>
                                </div>

                                {/* Words list under this sound group */}
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                  {sg.words.map((w) => (
                                    <button
                                      key={w.word}
                                      onClick={() => handleWordClick(w)}
                                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all text-left flex items-center justify-between gap-1.5 cursor-pointer group"
                                    >
                                      <div>
                                        <p className={`font-black font-mono text-slate-800 group-hover:text-emerald-600 tracking-wide ${
                                          largeLetterFont ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                                        }`}>
                                          {w.word}
                                        </p>
                                        <p className="text-[10px] text-slate-400">{w.meaning}</p>
                                      </div>
                                      <span className="text-xl">{w.emoji}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Story Capsule preview */}
                          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 text-indigo-950 font-bold">
                              <BookMarked className="w-4 h-4 text-indigo-600" />
                              <span>原版绘本故事：《{unit.story.title}》</span>
                              <span className="text-slate-400 font-normal hidden sm:inline">
                                ({unit.story.description})
                              </span>
                            </div>
                            <button
                              onClick={() => handleSelectUnit(unit, 'story')}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                            >
                              <span>阅读故事</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODE 2: DETAILED LESSON STUDIO (每课细化学堂) */}
      {/* ============================================================ */}
      {viewMode === 'lesson' && (
        <div className="space-y-6 animate-fade-in">
          {/* CURRENT UNIT SUMMARY BAR & QUICK PICKER */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  {currentUnit.coverEmoji}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                      {currentUnit.levelTitle}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      第 {currentUnit.unitNum} / 8 课
                    </span>
                  </div>
                  <h2 className="text-lg md:text-xl font-black text-slate-800">
                    {currentUnit.unitTitle}
                  </h2>
                  <p className="text-xs font-bold text-slate-500">{currentUnit.subtitle}</p>
                </div>
              </div>

              {/* Unit Dropdown quick picker */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-500 whitespace-nowrap">快速选课：</label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => {
                    const unit = ALL_OXFORD_UNITS.find((u) => u.id === e.target.value);
                    if (unit) handleSelectUnit(unit, activeStep);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {ALL_OXFORD_UNITS.map((u) => (
                    <option key={u.id} value={u.id}>
                      L{u.level} · {u.unitTitle} ({u.subtitle})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mind map rhyme banner */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">💡</span>
                <div>
                  <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                    本课思维导图记忆口诀 (Mind Map Rhyme)
                  </span>
                  <p className="text-xs font-bold text-amber-950 font-serif italic">
                    "{currentUnit.summaryRhyme}"
                  </p>
                </div>
              </div>
              <button
                onClick={() => audioEngine.speakWord(currentUnit.summaryRhyme, 0.9)}
                className="btn-3d px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-[0_2px_0_#D97706] flex items-center justify-center gap-1 cursor-pointer self-start sm:self-center"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>朗读口诀</span>
              </button>
            </div>

            {/* Target Letters & Phonics Spotlight Bar */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border-2 border-emerald-300 rounded-2xl p-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  <span className="text-xs sm:text-sm font-black text-slate-800 tracking-wide">
                    本课学习核心字母与音标锚点 (Target Phonics & IPA Anchors)
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {/* IPA X-Ray Toggle */}
                  <button
                    onClick={() => {
                      setShowIpaXRay(!showIpaXRay);
                      audioEngine.playPop(showIpaXRay ? 600 : 850);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                      showIpaXRay
                        ? 'bg-indigo-600 text-white shadow-[0_2px_0_#3730A3]'
                        : 'bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-50'
                    }`}
                    title="在单词和拼读台下方开启音标透视"
                  >
                    <span>🔍 音标透视镜: {showIpaXRay ? '已开启' : '关闭'}</span>
                  </button>

                  {/* Mouth Mirror Button if Tricky Sound detected */}
                  {activeTrickyMouthGuide && (
                    <button
                      onClick={() => {
                        setActiveMouthMirrorId(activeTrickyMouthGuide.id);
                        audioEngine.playPop(750);
                      }}
                      className="px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-black transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                      title="查看易混发音儿童口型与手势"
                    >
                      <Smile className="w-3.5 h-3.5 text-rose-600" />
                      <span>👄 发音口型镜</span>
                    </button>
                  )}

                  <button
                    onClick={() => setLargeLetterFont(!largeLetterFont)}
                    className="px-2 py-1 rounded-xl bg-white border border-slate-300 font-mono text-[10px] font-black text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                  >
                    {largeLetterFont ? '特大 A++' : '大号 A+'}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {currentUnit.soundGroups.map((sg) => (
                  <div
                    key={sg.soundId}
                    className="flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-emerald-400 p-2 sm:p-2.5 rounded-2xl shadow-xs transition-all group"
                  >
                    <button
                      onClick={() => handleSoundGroupClick(sg)}
                      className="flex items-center gap-2.5 cursor-pointer text-left"
                    >
                      <span
                        className={`font-mono font-black text-white px-3.5 py-1.5 rounded-xl shadow-sm flex items-center justify-center transition-all ${
                          largeLetterFont ? 'text-3xl sm:text-4xl min-w-[64px]' : 'text-2xl sm:text-3xl min-w-[50px]'
                        }`}
                        style={{ backgroundColor: sg.color }}
                      >
                        {sg.symbol}
                      </span>
                    </button>

                    <div className="flex flex-col pr-1">
                      <button
                        onClick={() => handleOpenIpaDetail(sg.ipa)}
                        className="px-2 py-0.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono font-black text-sm border border-indigo-200 cursor-pointer flex items-center gap-1 transition-colors group"
                        title="点击只读此音标发音 (并查看口型锚点)"
                      >
                        <Volume2 className="w-3 h-3 text-indigo-500 group-hover:scale-110 transition-transform" />
                        <span>{sg.ipa}</span>
                        <span className="text-[10px] font-bold bg-indigo-600 text-white px-1 rounded-sm">
                          纯音标
                        </span>
                      </button>
                      <button
                        onClick={() => handleSoundGroupClick(sg)}
                        className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1 cursor-pointer hover:underline"
                        title="只听字母纯音"
                      >
                        <Volume2 className="w-3 h-3" /> 听发音
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP TABS: 1.发音卡 -> 2.拼读台 -> 3.读故事 -> 4.小测验 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setActiveStep('flashcards');
                  audioEngine.playPop(700);
                }}
                className={`p-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeStep === 'flashcards'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>🔤 1. 音素与字音</span>
              </button>

              <button
                onClick={() => {
                  setActiveStep('blending');
                  audioEngine.playPop(730);
                }}
                className={`p-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeStep === 'blending'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>🧩 2. 分音拼读台</span>
              </button>

              <button
                onClick={() => {
                  setActiveStep('story');
                  audioEngine.playPop(760);
                }}
                className={`p-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeStep === 'story'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>📖 3. 原版故事</span>
              </button>

              <button
                onClick={() => {
                  setActiveStep('quiz');
                  audioEngine.playPop(790);
                }}
                className={`p-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeStep === 'quiz'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>4. 课后闯关</span>
              </button>
            </div>
          </div>

          {/* ==================== STEP 1: SOUND GROUPS & FLASHCARDS ==================== */}
          {activeStep === 'flashcards' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>本课核心音素群与单词网 (Sound Groups)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    点击发音标签可听标准音标示范；点击卡片可听纯正单词朗读。
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentUnit.soundGroups.map((sg) => (
                  <div
                    key={sg.soundId}
                    className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-xs space-y-4 hover:border-emerald-300 transition-colors"
                  >
                    {/* Header sound banner */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3.5">
                        <button
                          onClick={() => handleSoundGroupClick(sg)}
                          className="hover:opacity-85 transition-all cursor-pointer text-left group"
                        >
                          <span
                            className={`rounded-2xl font-black font-mono text-white shadow-md flex items-center justify-center transition-all ${
                              largeLetterFont
                                ? 'px-4 py-2 text-2xl sm:text-3xl md:text-4xl min-w-[64px]'
                                : 'px-3.5 py-1.5 text-xl sm:text-2xl min-w-[50px]'
                            }`}
                            style={{ backgroundColor: sg.color }}
                          >
                            {sg.symbol}
                          </span>
                        </button>

                        <div>
                          <button
                            onClick={() => handleOpenIpaDetail(sg.ipa)}
                            className="text-base sm:text-lg font-mono font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-lg border border-indigo-200 cursor-pointer flex items-center gap-1 transition-colors group"
                            title="点击只读此音标发音 (并查看口型锚点)"
                          >
                            <Volume2 className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                            <span>{sg.ipa}</span>
                            <span className="text-[10px] font-bold bg-indigo-600 text-white px-1 rounded-sm">
                              纯音标
                            </span>
                          </button>
                          <button
                            onClick={() => handleSoundGroupClick(sg)}
                            className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1 hover:underline cursor-pointer"
                            title="只听字母纯音"
                          >
                            <Volume2 className="w-3.5 h-3.5" /> 听字母字音
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSoundGroupClick(sg)}
                        className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 flex items-center justify-center cursor-pointer transition-colors"
                        title="朗读音素"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Word Grid */}
                    <div className="space-y-2.5">
                      {sg.words.map((w) => {
                        const ipaBreakdown = getIpaBreakdownForWord(w.word, w.phonicsBreakdown);

                        return (
                          <div
                            key={w.word}
                            onClick={() => handleWordClick(w)}
                            className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between text-left cursor-pointer group"
                          >
                            <div className="flex items-center gap-3.5">
                              <span className="text-3xl">{w.emoji}</span>
                              <div>
                                <p className={`font-black font-mono text-slate-800 group-hover:text-emerald-700 tracking-wide ${
                                  largeLetterFont ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
                                }`}>
                                  {w.word}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                                  <span className="font-mono font-bold bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-slate-700 text-xs sm:text-sm">
                                    {w.phonicsBreakdown.join(' · ')}
                                  </span>
                                  <span className="font-bold">{w.meaning}</span>
                                </div>

                                {/* IPA X-Ray layer */}
                                {showIpaXRay && (
                                  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">
                                      音标
                                    </span>
                                    {ipaBreakdown.map((ipaSym, idx) => (
                                      <button
                                        key={idx}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenIpaDetail(ipaSym);
                                        }}
                                        className="px-1.5 py-0.5 rounded-md bg-white hover:bg-indigo-100 border border-indigo-200 font-mono text-xs font-black text-indigo-700 hover:text-indigo-900 cursor-pointer shadow-2xs transition-colors flex items-center gap-0.5"
                                        title={`点击只读音标发音: ${ipaSym}`}
                                      >
                                        <Volume2 className="w-2.5 h-2.5 text-indigo-400" />
                                        <span>{ipaSym}</span>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            <Volume2 className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Next Step Link */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setActiveStep('blending');
                    audioEngine.playPop(750);
                  }}
                  className="btn-3d px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black shadow-[0_3px_0_#059669] flex items-center gap-2 cursor-pointer"
                >
                  <span>下一步：进入分音拼读台 ➔</span>
                </button>
              </div>
            </div>
          )}

          {/* ==================== STEP 2: DECODABLE BLENDING ==================== */}
          {activeStep === 'blending' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>互动拼读机 (Interactive Sound Blending)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    点击各个音素气泡逐音发音，然后点击整词合成连贯发音。
                  </p>
                </div>

                {/* Word selector capsules */}
                <div className="flex flex-wrap gap-2 max-w-lg">
                  {allUnitWords.map((w, idx) => (
                    <button
                      key={w.word}
                      onClick={() => {
                        setActiveWordIdx(idx);
                        audioEngine.playPop(700);
                      }}
                      className={`rounded-xl font-mono font-black transition-all cursor-pointer ${
                        largeLetterFont
                          ? 'px-3.5 py-1.5 text-sm sm:text-base'
                          : 'px-2.5 py-1 text-xs'
                      } ${
                        activeWordIdx === idx
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {w.word}
                    </button>
                  ))}
                </div>
              </div>

              {/* Central Blending Stage */}
              {activeWord && (
                <div className="bg-gradient-to-b from-slate-50 to-emerald-50/30 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 text-center space-y-6">
                  <div className="text-6xl sm:text-7xl animate-bounce">{activeWord.emoji}</div>

                  {/* Phoneme breakdown bubbles */}
                  <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap">
                    {activeWord.phonicsBreakdown.map((p: string, pIdx: number) => {
                      const isHighlighted = highlightPhonemeIdx === pIdx;
                      const activeWordIpaList = getIpaBreakdownForWord(activeWord.word, activeWord.phonicsBreakdown);
                      const ipaSym = activeWordIpaList[pIdx] || `/${p}/`;

                      return (
                        <button
                          key={pIdx}
                          onClick={() => handleStepPhoneme(p, pIdx)}
                          className={`rounded-3xl border-3 font-mono font-black transition-all cursor-pointer flex flex-col items-center justify-center ${
                            largeLetterFont
                              ? 'w-22 h-26 sm:w-28 sm:h-32 text-4xl sm:text-5xl md:text-6xl'
                              : 'w-18 h-22 sm:w-22 sm:h-26 text-3xl sm:text-4xl'
                          } ${
                            isHighlighted
                              ? 'bg-emerald-500 border-emerald-600 text-white scale-110 shadow-xl'
                              : 'bg-white border-slate-300 text-slate-800 hover:border-emerald-400 hover:bg-emerald-50 shadow-sm'
                          }`}
                        >
                          <span className="leading-none tracking-wide">{p}</span>
                          {showIpaXRay ? (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenIpaDetail(ipaSym);
                              }}
                              className={`text-xs sm:text-sm font-mono font-black mt-1 px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1 ${
                                isHighlighted
                                  ? 'bg-white text-emerald-900 shadow-xs'
                                  : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                              }`}
                              title={`点击只读此音标发音: ${ipaSym}`}
                            >
                              <Volume2 className="w-3 h-3 text-indigo-600" />
                              <span>{ipaSym}</span>
                            </span>
                          ) : (
                            <span
                              className={`text-[11px] font-sans font-black mt-1 ${
                                isHighlighted ? 'text-emerald-100' : 'text-slate-400'
                              }`}
                            >
                              音素 {pIdx + 1}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Dual-Track Phonics ⇄ IPA X-Ray Aligner */}
                  {showIpaXRay && (
                    <div className="bg-white rounded-2xl p-4 border-2 border-indigo-200 max-w-lg mx-auto shadow-xs text-left animate-in fade-in duration-200">
                      <div className="flex items-center justify-between mb-3 border-b border-indigo-100 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">🔬</span>
                          <span className="text-xs font-black text-indigo-900">
                            双轨对齐透视台 (眼睛字母线 ⇄ 耳朵音标线)
                          </span>
                        </div>
                        <span className="text-[10px] font-black bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                          自拼闭环
                        </span>
                      </div>

                      <div className="grid grid-flow-col auto-cols-fr gap-2.5">
                        {activeWord.phonicsBreakdown.map((p, idx) => {
                          const activeWordIpaList = getIpaBreakdownForWord(activeWord.word, activeWord.phonicsBreakdown);
                          const ipaSym = activeWordIpaList[idx] || `/${p}/`;

                          return (
                            <div
                              key={idx}
                              className="bg-slate-50 hover:bg-indigo-50/60 rounded-xl p-2.5 border border-slate-200 text-center transition-all"
                            >
                              <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                                字母
                              </span>
                              <span className="text-2xl font-mono font-black text-slate-800 block">
                                {p}
                              </span>

                              <div className="my-1.5 border-t border-dashed border-indigo-200 relative">
                                <span className="absolute left-1/2 -top-2 -translate-x-1/2 bg-white text-[9px] text-indigo-400 font-bold px-1 rounded">
                                  对齐
                                </span>
                              </div>

                              <span className="text-[10px] font-bold text-indigo-500 block mb-0.5">
                                音标
                              </span>
                              <button
                                onClick={() => handleOpenIpaDetail(ipaSym)}
                                className="w-full py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono font-black text-xs sm:text-sm border border-indigo-200 cursor-pointer transition-colors shadow-2xs flex items-center justify-center gap-1"
                                title={`点击只读此音标发音: ${ipaSym}`}
                              >
                                <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
                                <span>{ipaSym}</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-bold">
                          整词音标：
                          <span className="font-mono font-black text-indigo-700 ml-1">
                            /{getIpaBreakdownForWord(activeWord.word, activeWord.phonicsBreakdown).join('')}/
                          </span>
                        </span>
                        <button
                          onClick={() => handleBlendWord(activeWord)}
                          className="text-xs font-black text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" /> 听整词合成
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="text-slate-400 text-xs font-bold">
                    ↑ 点击上方任意音素单独发音，或点击下方直接拼出整词
                  </div>

                  {/* Full Word Button */}
                  <div>
                    <button
                      onClick={() => handleBlendWord(activeWord)}
                      className={`btn-3d bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black font-mono tracking-wider shadow-[0_5px_0_#059669] inline-flex items-center gap-3 cursor-pointer ${
                        largeLetterFont
                          ? 'px-10 py-5 text-3xl sm:text-4xl md:text-5xl'
                          : 'px-8 py-4 text-2xl sm:text-3xl'
                      }`}
                    >
                      <Volume2 className="w-8 h-8" />
                      <span>{activeWord.word}</span>
                      <span className="text-sm font-sans font-bold opacity-90">
                        ({activeWord.meaning})
                      </span>
                    </button>
                  </div>

                  {/* Sentences in Oxford Curriculum */}
                  {activeWord.sentences && activeWord.sentences.length > 0 && (
                    <div className="pt-4 border-t border-slate-200 max-w-xl mx-auto space-y-2 text-left">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-wider text-center">
                        教材配套例句朗读
                      </p>
                      {activeWord.sentences.map((sentence: string, sIdx: number) => (
                        <div
                          key={sIdx}
                          onClick={() => audioEngine.speakWord(sentence, 0.9)}
                          className="bg-white p-3 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between cursor-pointer group"
                        >
                          <span className="text-xs sm:text-sm font-serif font-bold text-slate-700 group-hover:text-emerald-700">
                            {sentence}
                          </span>
                          <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => {
                    setActiveStep('flashcards');
                    audioEngine.playPop(700);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  ⬅️ 返回音素卡
                </button>

                <button
                  onClick={() => {
                    setActiveStep('story');
                    audioEngine.playPop(750);
                  }}
                  className="btn-3d px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black shadow-[0_3px_0_#059669] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>下一步：阅读原版绘本故事 ➔</span>
                </button>
              </div>
            </div>
          )}

          {/* ==================== STEP 3: ORIGINAL STORY READER ==================== */}
          {activeStep === 'story' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
                      牛津树分级绘本短篇
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {currentUnit.story.lines.length} 个完整句子
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mt-1">
                    《{currentUnit.story.title}》
                  </h3>
                  <p className="text-xs text-slate-500">{currentUnit.story.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowTranslation(!showTranslation)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                  >
                    {showTranslation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showTranslation ? '隐藏中文' : '显示中文'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const fullText = currentUnit.story.lines.map((l) => l.text).join(' ');
                      audioEngine.speakWord(fullText, 0.88);
                    }}
                    className="btn-3d px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-[0_2px_0_#4338CA] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>全文朗读</span>
                  </button>
                </div>
              </div>

              {/* Story Sight Words & New Words */}
              {(currentUnit.story.sightWords || currentUnit.story.newWords) && (
                <div className="flex flex-wrap items-center gap-3 p-3.5 bg-slate-50 rounded-2xl">
                  {currentUnit.story.sightWords && (
                    <div className="flex items-center gap-2 mr-3 flex-wrap">
                      <span className="text-xs font-black text-slate-500">Sight Words:</span>
                      {currentUnit.story.sightWords.map((sw) => (
                        <span
                          key={sw}
                          onClick={() => audioEngine.speakWord(sw, 0.9)}
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-xl font-mono font-black text-slate-800 text-sm sm:text-base hover:border-indigo-400 hover:text-indigo-600 shadow-xs cursor-pointer"
                        >
                          {sw}
                        </span>
                      ))}
                    </div>
                  )}
                  {currentUnit.story.newWords && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-slate-500">New Words:</span>
                      {currentUnit.story.newWords.map((nw) => (
                        <span
                          key={nw}
                          onClick={() => audioEngine.speakWord(nw, 0.9)}
                          className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-xl font-mono font-black text-indigo-800 text-sm sm:text-base hover:border-indigo-400 shadow-xs cursor-pointer"
                        >
                          {nw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sentence by Sentence List */}
              <div className="space-y-3.5">
                {currentUnit.story.lines.map((line, idx) => {
                  const words = line.text.split(' ');
                  return (
                    <div
                      key={idx}
                      onClick={() => handlePlayStoryLine(line)}
                      className="p-5 rounded-2xl border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex items-start gap-4 cursor-pointer group"
                    >
                      <span className="text-4xl p-2.5 rounded-2xl bg-slate-50 group-hover:bg-white shadow-xs transition-colors">
                        {line.emoji}
                      </span>

                      <div className="flex-1 space-y-2">
                        <div className={`flex flex-wrap items-center gap-x-2 font-serif leading-relaxed ${
                          largeLetterFont ? 'text-xl sm:text-2xl md:text-3xl' : 'text-lg sm:text-xl md:text-2xl'
                        }`}>
                          {words.map((w, wIdx) => {
                            const cleanW = w.toLowerCase().replace(/[^a-z]/g, '');
                            const isHighlighted = line.highlightWords?.some(
                              (hw) => hw.toLowerCase() === cleanW
                            );
                            return (
                              <span
                                key={wIdx}
                                onClick={(e) => handleWordInSentenceClick(cleanW, e)}
                                className={`px-1 rounded-lg transition-colors ${
                                  isHighlighted
                                    ? 'bg-amber-100 text-amber-950 font-black underline decoration-amber-400 decoration-3 hover:bg-amber-200'
                                    : 'text-slate-800 hover:text-indigo-600 hover:bg-slate-100'
                                }`}
                              >
                                {w}
                              </span>
                            );
                          })}
                        </div>

                        {showTranslation && (
                          <p className="text-sm font-bold text-slate-500 pt-0.5">
                            {line.translation}
                          </p>
                        )}
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 flex items-center gap-1 text-xs font-black">
                        <Volume2 className="w-4 h-4" />
                        <span className="hidden sm:inline">点读</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => {
                    setActiveStep('blending');
                    audioEngine.playPop(700);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  ⬅️ 返回拼读台
                </button>

                <button
                  onClick={() => {
                    setActiveStep('quiz');
                    audioEngine.playPop(750);
                  }}
                  className="btn-3d px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-xs font-black shadow-[0_3px_0_#D97706] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>下一步：课后闯关挑战 ➔</span>
                </button>
              </div>
            </div>
          )}

          {/* ==================== STEP 4: REVIEW QUIZ / MASTERY CHECK ==================== */}
          {activeStep === 'quiz' && (
            <div className="space-y-6">
              {!isQuizCompleted ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                        第 {quizIdx + 1} / {unitQuizList.length} 题
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        当前得分：{quizScore} 分
                      </span>
                    </div>

                    <button
                      onClick={handlePlayQuizAudio}
                      className="btn-3d px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-[0_2px_0_#D97706] flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>重播发音</span>
                    </button>
                  </div>

                  {/* Prompt Card */}
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 text-center space-y-4">
                    <h4 className="text-base md:text-lg font-black text-slate-800">
                      {currentQuiz?.prompt}
                    </h4>

                    <button
                      onClick={handlePlayQuizAudio}
                      className="w-16 h-16 mx-auto rounded-2xl bg-amber-500 hover:bg-amber-400 text-white flex items-center justify-center text-2xl shadow-[0_4px_0_#D97706] cursor-pointer transition-all active:translate-y-1"
                    >
                      <Volume2 className="w-8 h-8" />
                    </button>
                    <p className="text-xs font-bold text-slate-400">点击大喇叭听题</p>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {currentQuiz?.options.map((opt) => {
                      const isSelected = quizSelectedOption === opt.id;
                      let colorClass = 'border-slate-200 bg-white hover:border-amber-300';
                      if (isSelected) {
                        if (quizStatus === 'correct') {
                          colorClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-md';
                        } else if (quizStatus === 'wrong') {
                          colorClass = 'border-rose-500 bg-rose-50 text-rose-950 animate-shake';
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectQuizOption(opt)}
                          disabled={quizStatus === 'correct'}
                          className={`p-5 rounded-2xl border-3 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${colorClass}`}
                        >
                          {opt.emoji && <span className="text-4xl mb-1">{opt.emoji}</span>}
                          <span className={`font-black font-mono tracking-wider ${
                            largeLetterFont ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-xl sm:text-2xl'
                          }`}>
                            {opt.text}
                          </span>
                          {opt.sub && <span className="text-xs sm:text-sm font-bold text-slate-500">{opt.sub}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Celebration Card */
                <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 border-3 border-emerald-300 rounded-3xl p-8 text-center space-y-5 animate-fade-in shadow-md">
                  <div className="text-6xl animate-bounce">🏅</div>
                  <div>
                    <h3 className="text-2xl font-black text-emerald-950">
                      恭喜通关！点亮牛津黄金勋章
                    </h3>
                    <p className="text-xs font-bold text-emerald-700 mt-1">
                      你已成功掌握 {currentUnit.unitTitle} 的全部核心音素与绘本课文！
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-emerald-200 shadow-xs">
                    <div className="text-left">
                      <div className="text-[11px] font-bold text-slate-400">奖励积分</div>
                      <div className="text-base font-black text-amber-500 flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>+25 自然拼读能量</span>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-slate-200"></div>
                    <div className="text-left">
                      <div className="text-[11px] font-bold text-slate-400">掌握进度</div>
                      <div className="text-base font-black text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>已加入掌握勋章库</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setIsQuizCompleted(false);
                        setQuizIdx(0);
                        setQuizSelectedOption(null);
                        setQuizStatus('idle');
                        setQuizScore(0);
                      }}
                      className="btn-3d px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-black shadow-[0_2px_0_#E2E8F0] cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>再次温习本课</span>
                    </button>

                    <button
                      onClick={() => {
                        const currentIdx = ALL_OXFORD_UNITS.findIndex((u) => u.id === currentUnit.id);
                        if (currentIdx < ALL_OXFORD_UNITS.length - 1) {
                          handleSelectUnit(ALL_OXFORD_UNITS[currentIdx + 1]);
                        }
                      }}
                      className="btn-3d px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black shadow-[0_3px_0_#059669] flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>学习下一课时 ➔</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* PRINTABLE WORKSHEET TEMPLATE (Hidden on screen, rendered on Print) */}
      <div className="hidden print:block print:p-6 print:space-y-6">
        <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-serif">
              Oxford Phonics World Worksheet · Level {currentUnit.level}
            </h1>
            <p className="text-sm font-serif">
              {currentUnit.unitTitle} ({currentUnit.subtitle})
            </p>
          </div>
          <div className="text-right text-xs">
            <p>Name: _______________</p>
            <p>Date: _______________</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-bold font-serif">Part 1: Mind Map Rhyme</h2>
          <div className="border border-slate-400 p-3 rounded-xl italic">
            "{currentUnit.summaryRhyme}"
          </div>

          <h2 className="text-base font-bold font-serif mt-4">Part 2: Sound Groups & Vocabulary</h2>
          <div className="grid grid-cols-3 gap-3">
            {currentUnit.soundGroups.map((sg) => (
              <div key={sg.soundId} className="border border-slate-300 p-3 rounded-lg">
                <div className="font-mono font-bold text-sm">{sg.symbol} ({sg.ipa})</div>
                <div className="mt-2 space-y-1 text-xs">
                  {sg.words.map((w) => (
                    <div key={w.word}>• {w.word} ({w.meaning})</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-base font-bold font-serif mt-6">Part 3: Read the Story Aloud</h2>
          <div className="border border-slate-300 rounded-xl p-4 space-y-2">
            <h3 className="font-bold">{currentUnit.story.title}</h3>
            {currentUnit.story.lines.map((l, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <span>[  ]</span>
                <span className="font-serif">{l.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* IPA Anchor Drawer (Just-In-Time Micro-Learning Bottom Sheet) */}
      <IpaAnchorDrawer
        isOpen={Boolean(selectedIpaDetail)}
        data={selectedIpaDetail}
        onClose={() => setSelectedIpaDetail(null)}
        onNavigateToOrtUnit={(unitId) => {
          setSelectedIpaDetail(null);
          const found = ALL_OXFORD_UNITS.find((u) => u.id === unitId);
          if (found) {
            handleSelectUnit(found, 'flashcards');
          }
        }}
        onNavigateToVault={() => {
          setSelectedIpaDetail(null);
          if (onNavigateTab) {
            onNavigateTab('vault');
          }
        }}
      />

      {/* Children's Mouth Shape Mirror Modal (Contrast Pairs & Gestures) */}
      <MouthMirrorModal
        isOpen={Boolean(activeMouthMirrorId)}
        initialGuideId={activeMouthMirrorId || undefined}
        onClose={() => setActiveMouthMirrorId(null)}
      />
    </div>
  );
};
