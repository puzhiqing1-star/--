import React, { useState } from 'react';
import { FULL_48_IPA, FullIPARecord } from '../data/phonicsData';
import { findOxfordUnitsForIpa, getTrickyMouthGuide } from '../utils/phonicsIpaLinker';
import { MouthMirrorModal } from './MouthMirrorModal';
import { audioEngine } from '../utils/audioEngine';
import { Volume2, Printer, Search, BookOpen, ArrowRight, Smile } from 'lucide-react';

interface PhonicsVaultProps {
  onNavigateToOrtUnit?: (unitId: string) => void;
}

export const PhonicsVault: React.FC<PhonicsVaultProps> = ({ onNavigateToOrtUnit }) => {
  const [filterType, setFilterType] = useState<'all' | 'vowel' | 'consonant'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mouthMirrorGuideId, setMouthMirrorGuideId] = useState<string | null>(null);

  const filteredList = FULL_48_IPA.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.sym.toLowerCase().includes(q) ||
      item.graphemes.some((g) => g.toLowerCase().includes(q)) ||
      item.examples.some((ex) => ex.word.toLowerCase().includes(q))
    );
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-7 shadow-[0_6px_0_#E2E8F0] border-2 border-slate-100 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl shadow-[0_3px_0_#C7D2FE]">
            📖
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              48 国际音标 × 自拼字母组合全景宝典
              <span className="text-xs bg-indigo-500 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Phonics Vault
              </span>
            </h2>
            <p className="text-sm font-bold text-slate-400">
              耳朵线（国际音标）与眼睛线（自然拼读字母组合）双向闭环，直达牛津树对应课时！
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="btn-3d flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-black px-4 py-2.5 rounded-2xl shadow-[0_4px_0_#0F172A] text-sm cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          打印自拼字卡 (Print)
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            全部 (48)
          </button>
          <button
            onClick={() => setFilterType('vowel')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filterType === 'vowel'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            元音 Vowels (20)
          </button>
          <button
            onClick={() => setFilterType('consonant')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filterType === 'consonant'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            辅音 Consonants (28)
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索音标、字母或单词..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-48"
          />
        </div>
      </div>

      {/* Phonics & IPA Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredList.map((item) => {
          const matchedUnits = findOxfordUnitsForIpa(item.sym);
          const trickyGuide = getTrickyMouthGuide(item.sym);

          return (
            <div
              key={item.sym}
              className="bg-white rounded-2xl p-4 border-2 border-slate-100 shadow-[0_4px_0_#E2E8F0] hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: IPA symbol & type badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => audioEngine.speakIpaSound(item.sym)}
                      className="text-3xl font-black font-mono text-slate-800 hover:text-indigo-600 tracking-tight cursor-pointer flex items-center gap-1.5 group transition-colors"
                      title={`点击只读音标发音: ${item.sym}`}
                    >
                      <span>{item.sym}</span>
                      <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all" />
                    </button>
                    {trickyGuide && (
                      <button
                        onClick={() => {
                          setMouthMirrorGuideId(trickyGuide.id);
                          audioEngine.playPop(750);
                        }}
                        className="px-2 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-black flex items-center gap-0.5 cursor-pointer"
                        title="打开儿童发音口型镜"
                      >
                        <Smile className="w-3 h-3" /> 口型镜
                      </button>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full text-white ${
                      item.type === 'vowel' ? 'bg-purple-500' : 'bg-sky-500'
                    }`}
                  >
                    {item.subType}
                  </span>
                </div>

                {/* Natural Phonics Graphemes */}
                <div className="mb-3">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">
                    对应自然拼读字母组合:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.graphemes.map((g) => (
                      <span
                        key={g}
                        className="bg-amber-100 text-amber-900 border border-amber-200 text-xs font-mono font-black px-2 py-0.5 rounded-lg"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Example Words */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {item.examples.map((ex) => (
                    <button
                      key={ex.word}
                      onClick={() => audioEngine.speakWord(ex.word)}
                      className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 cursor-pointer"
                    >
                      <span>{ex.emoji}</span>
                      <span className="font-mono">{ex.word}</span>
                    </button>
                  ))}
                </div>

                {/* Oxford Reading Tree Units Link (Bidirectional Portal) */}
                {matchedUnits.length > 0 && (
                  <div className="mb-3 pt-2.5 border-t border-slate-100">
                    <span className="text-[10px] font-black text-emerald-700 flex items-center gap-1 mb-1.5">
                      <BookOpen className="w-3 h-3" /> 牛津树对应绘本课程：
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {matchedUnits.slice(0, 2).map((u) => (
                        <button
                          key={u.unitId}
                          onClick={() => {
                            if (onNavigateToOrtUnit) {
                              onNavigateToOrtUnit(u.unitId);
                            }
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-[11px] font-black flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span className="bg-emerald-600 text-white rounded px-1 text-[9px]">
                            L{u.level}
                          </span>
                          <span>{u.title.split(':')[1] || u.title}</span>
                          <ArrowRight className="w-3 h-3 text-emerald-600" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Listen Button */}
              <button
                onClick={() => audioEngine.speakWord(item.examples[0].word)}
                className="btn-3d w-full flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black py-2 rounded-xl border border-indigo-200 text-xs cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                听示范词: {item.examples[0].word}
              </button>
            </div>
          );
        })}
      </div>

      {/* Mouth Shape Mirror Modal */}
      <MouthMirrorModal
        isOpen={Boolean(mouthMirrorGuideId)}
        initialGuideId={mouthMirrorGuideId || undefined}
        onClose={() => setMouthMirrorGuideId(null)}
      />
    </div>
  );
};

