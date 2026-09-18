import React, { useState } from 'react';
import { MistakeItem, progressTracker } from '../utils/progressTracker';
import { audioEngine } from '../utils/audioEngine';
import { MistakeDrillModal } from './MistakeDrillModal';
import {
  BookOpen,
  Sparkles,
  Zap,
  Volume2,
  Trash2,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  Play,
  Filter,
  Flame,
  Award,
  ArrowRight
} from 'lucide-react';

interface MistakeVaultSectionProps {
  onNavigateTab?: (tab: any, subAction?: string) => void;
}

export function MistakeVaultSection({ onNavigateTab }: MistakeVaultSectionProps) {
  const [mistakes, setMistakes] = useState<MistakeItem[]>(progressTracker.getMistakes());
  const [filterType, setFilterType] = useState<'all' | 'needs_practice' | 'mastered' | 'phoneme' | 'word'>('all');
  const [drillTargetItems, setDrillTargetItems] = useState<MistakeItem[] | null>(null);
  const [drillInitialIndex, setDrillInitialIndex] = useState(0);

  const refreshList = () => {
    setMistakes(progressTracker.getMistakes());
  };

  const handlePlaySound = (item: MistakeItem) => {
    if (item.type === 'phoneme') {
      audioEngine.speakPhoneme(item.key, item.ipa, 0.95);
    } else {
      audioEngine.speakWord(item.key, 0.95);
    }
  };

  const handleStartAllDrill = () => {
    const pending = mistakes.filter((m) => m.status !== 'mastered');
    const itemsToDrill = pending.length > 0 ? pending : mistakes;
    if (itemsToDrill.length === 0) return;
    audioEngine.playPop(850);
    setDrillTargetItems(itemsToDrill);
    setDrillInitialIndex(0);
  };

  const handleStartSingleDrill = (item: MistakeItem) => {
    audioEngine.playPop(800);
    setDrillTargetItems([item]);
    setDrillInitialIndex(0);
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确认将此项移出错题宝库吗？')) {
      audioEngine.playPop(450);
      progressTracker.removeMistake(id);
      refreshList();
    }
  };

  const handleClearMastered = () => {
    audioEngine.playPop(450);
    progressTracker.clearMasteredMistakes();
    refreshList();
  };

  const handleInjectDemo = () => {
    audioEngine.playPop(850);
    progressTracker.injectDemoProgress();
    refreshList();
  };

  // Filtered list
  const filteredMistakes = mistakes.filter((item) => {
    if (filterType === 'needs_practice') return item.status !== 'mastered';
    if (filterType === 'mastered') return item.status === 'mastered';
    if (filterType === 'phoneme') return item.type === 'phoneme';
    if (filterType === 'word') return item.type === 'word';
    return true;
  });

  const totalCount = mistakes.length;
  const pendingCount = mistakes.filter((m) => m.status !== 'mastered').length;
  const masteredCount = mistakes.filter((m) => m.status === 'mastered').length;
  const masteryRate = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Vault Header Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white rounded-3xl p-5 md:p-6 shadow-[0_6px_0_#BE123C] flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-inner border border-white/30">
            📕
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black">
                智能错题宝库
              </h2>
              <span className="text-[11px] font-black bg-amber-300 text-amber-950 px-2.5 py-0.5 rounded-full shadow-sm">
                智能归纳 · 专项攻坚
              </span>
            </div>
            <p className="text-xs md:text-sm font-bold text-white/90 mt-1">
              自动捕获听音辨图、字母对对碰与气球拼写中多次出错的音素与单词，定制专属消灭计划！
            </p>
          </div>
        </div>

        {/* Quick Launch All Button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={handleStartAllDrill}
            disabled={mistakes.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-rose-600 hover:bg-rose-50 rounded-2xl font-black text-sm md:text-base shadow-[0_4px_0_#FFE4E6] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:pointer-events-none transition-all"
          >
            <Zap className="w-5 h-5 fill-rose-500 text-rose-500" />
            <span>开启错题突击冲刺营</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border-2 border-slate-100 shadow-[0_3px_0_#E2E8F0]">
          <div className="text-xs font-bold text-slate-400">已收录错题</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{totalCount} 项</div>
          <div className="text-[11px] font-bold text-slate-400 mt-0.5">全自动错误捕获</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border-2 border-rose-100 shadow-[0_3px_0_#FFE4E6]">
          <div className="text-xs font-bold text-rose-500">待强化攻克</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{pendingCount} 项</div>
          <div className="text-[11px] font-bold text-rose-400 mt-0.5">建议今日重点练习</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border-2 border-emerald-100 shadow-[0_3px_0_#D1FAE5]">
          <div className="text-xs font-bold text-emerald-600">已彻底攻克</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{masteredCount} 项 🏅</div>
          <div className="text-[11px] font-bold text-emerald-400 mt-0.5">连续答对 2 次毕业</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border-2 border-amber-100 shadow-[0_3px_0_#FEF3C7]">
          <div className="text-xs font-bold text-amber-600">整体攻克率</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{masteryRate}%</div>
          <div className="w-full bg-amber-100 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${masteryRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Secondary Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border-2 border-slate-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              filterType === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            全部 ({totalCount})
          </button>
          <button
            onClick={() => setFilterType('needs_practice')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              filterType === 'needs_practice'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            待攻克 ({pendingCount})
          </button>
          <button
            onClick={() => setFilterType('mastered')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              filterType === 'mastered'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            已掌握 ({masteredCount})
          </button>
          <button
            onClick={() => setFilterType('phoneme')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              filterType === 'phoneme'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            音素类
          </button>
          <button
            onClick={() => setFilterType('word')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              filterType === 'word'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            单词类
          </button>
        </div>

        <div className="flex items-center gap-2">
          {masteredCount > 0 && (
            <button
              onClick={handleClearMastered}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg transition-colors"
            >
              清除已掌握
            </button>
          )}
          <button
            onClick={handleInjectDemo}
            className="text-xs font-black text-rose-500 hover:text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors"
          >
            🧪 注入测试错题
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredMistakes.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-slate-100 shadow-[0_4px_0_#E2E8F0] max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-inner mb-3">
            🎉
          </div>
          <h3 className="text-xl font-black text-slate-800">当前分类下没有错题！</h3>
          <p className="text-xs md:text-sm font-bold text-slate-400 mt-1 max-w-sm mx-auto">
            在「听音辨图」或「互动游戏」中遇到难点时，系统会自动将易混淆的音素和单词收集到这里！
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={handleInjectDemo}
              className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black text-xs shadow-sm transition-colors"
            >
              体验注入易错题示例
            </button>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('games')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-xs transition-colors"
              >
                前往小游戏闯关 ➔
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMistakes.map((item) => {
            const isMastered = item.status === 'mastered';
            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl p-5 border-2 transition-all shadow-[0_4px_0_#E2E8F0] hover:shadow-[0_6px_0_#CBD5E1] flex flex-col justify-between ${
                  isMastered ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-100'
                }`}
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          item.type === 'phoneme'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {item.type === 'phoneme' ? '字母音素' : '单词拼写'}
                      </span>

                      <span className="text-[10px] font-black bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                        失误 {item.errorCount} 次
                      </span>

                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        来自: {item.source}
                      </span>
                    </div>

                    {isMastered ? (
                      <span className="text-[11px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        已攻克
                      </span>
                    ) : (
                      <span className="text-[11px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        连对 {item.correctStreakInReview} / 2
                      </span>
                    )}
                  </div>

                  {/* Main Display: Symbol, Emoji, Meaning */}
                  <div className="flex items-center justify-between gap-4 py-1">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center text-3xl shadow-inner">
                        {item.emoji}
                      </div>
                      <div>
                        <div className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                          <span>{item.display}</span>
                          {item.meaning && (
                            <span className="text-xs font-bold text-slate-400">
                              ({item.meaning})
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-bold text-slate-400 mt-0.5">
                          {item.type === 'phoneme'
                            ? `发音音标: ${item.ipa || item.display}`
                            : `标准拼写: ${item.key.toUpperCase()}`}
                        </div>
                      </div>
                    </div>

                    {/* Quick Sound preview button */}
                    <button
                      onClick={() => handlePlaySound(item)}
                      title="试听发音"
                      className="w-10 h-10 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-600 border border-teal-200 flex items-center justify-center active:scale-95 transition-all shadow-sm"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Phonics Mouth & Mnemonic Tip */}
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 my-3 text-left">
                    <div className="text-[11px] font-black text-amber-900 flex items-center gap-1">
                      <span>💡</span>
                      <span>口型与避坑诀窍：</span>
                    </div>
                    <p className="text-xs font-bold text-amber-800 mt-1 leading-relaxed">
                      {item.tip}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <button
                    onClick={(e) => handleRemove(item.id, e)}
                    className="text-xs font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1 px-2 py-1 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>移出</span>
                  </button>

                  <button
                    onClick={() => handleStartSingleDrill(item)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black shadow-sm active:translate-y-0.5 transition-all ${
                      isMastered
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-[0_3px_0_#BE123C]'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isMastered ? '重新巩固' : '专项攻克练习'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drill Modal */}
      {drillTargetItems && (
        <MistakeDrillModal
          items={drillTargetItems}
          initialIndex={drillInitialIndex}
          onClose={() => setDrillTargetItems(null)}
          onItemUpdated={refreshList}
        />
      )}
    </div>
  );
}
