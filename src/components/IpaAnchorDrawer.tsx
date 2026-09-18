import React from 'react';
import { IpaDetailModalData } from '../utils/phonicsIpaLinker';
import { audioEngine } from '../utils/audioEngine';
import {
  X,
  Volume2,
  Sparkles,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Smile,
  Award,
} from 'lucide-react';

interface IpaAnchorDrawerProps {
  isOpen: boolean;
  data: IpaDetailModalData | null;
  onClose: () => void;
  onNavigateToOrtUnit?: (unitId: string) => void;
  onNavigateToVault?: () => void;
}

export const IpaAnchorDrawer: React.FC<IpaAnchorDrawerProps> = ({
  isOpen,
  data,
  onClose,
  onNavigateToOrtUnit,
  onNavigateToVault,
}) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-5 md:p-6 shadow-2xl border-4 border-indigo-200 relative overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center text-xl shadow-md">
              🎯
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                  音标锚点 · 标准发音尺
                </span>
                <span className="text-xs font-black bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  {data.subType}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
                {data.sym} 发音秘密与拼读对应
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Main Showcase Hero */}
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-indigo-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => audioEngine.speakIpaSound(data.sym)}
                className="text-5xl sm:text-6xl font-black font-mono text-indigo-700 hover:text-indigo-900 tracking-tight select-none cursor-pointer flex items-center gap-2 group transition-colors"
                title="点击只读此音标发音"
              >
                <span>{data.sym}</span>
                <Volume2 className="w-6 h-6 text-indigo-400 group-hover:scale-125 transition-transform" />
              </button>
              <div>
                <div className="text-xs font-black text-slate-600 flex items-center gap-1.5 mb-1">
                  <span>口型手势：</span>
                  <span className="bg-white px-2 py-0.5 rounded-lg border border-indigo-200 text-indigo-900 font-bold">
                    {data.handGesture || '✌️ 准确口型'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-700 leading-snug">
                  {data.mouthTip}
                </p>
              </div>
            </div>

            <button
              onClick={() => audioEngine.speakIpaSound(data.sym)}
              className="btn-3d w-16 h-16 shrink-0 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white flex flex-col items-center justify-center shadow-[0_4px_0_#3730A3] cursor-pointer transition-all"
              title="只读此音标纯发音 (不读整词)"
            >
              <Volume2 className="w-6 h-6" />
              <span className="text-[11px] font-black mt-0.5">纯音发音</span>
            </button>
          </div>

          {/* Graphemes (Natural Phonics Letters) */}
          {data.graphemes.length > 0 && (
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
              <span className="text-xs font-black text-slate-500 block mb-2">
                🔤 对应的自然拼读字母 / 字母组合 (眼睛看到的字母):
              </span>
              <div className="flex flex-wrap gap-2">
                {data.graphemes.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1.5 rounded-xl bg-white border-2 border-indigo-300 font-mono font-black text-sm sm:text-base text-indigo-800 shadow-xs flex items-center gap-1"
                  >
                    <span className="text-amber-500">✦</span> {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Example Words with Sound */}
          {data.examples.length > 0 && (
            <div>
              <span className="text-xs font-black text-slate-500 block mb-2">
                🍎 典型发音代表词 (点击听单词):
              </span>
              <div className="grid grid-cols-3 gap-2">
                {data.examples.map((ex) => (
                  <button
                    key={ex.word}
                    onClick={() => audioEngine.speakWord(ex.word)}
                    className="btn-3d p-2.5 rounded-xl bg-white hover:bg-indigo-50/60 border-2 border-slate-200 hover:border-indigo-300 transition-all text-center flex flex-col items-center justify-center cursor-pointer group"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                      {ex.emoji}
                    </span>
                    <span className="font-mono font-black text-sm text-slate-800 group-hover:text-indigo-600">
                      {ex.word}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tricky Contrast Section */}
          {data.contrastGuide && (
            <div className="bg-amber-50 rounded-2xl p-3.5 border-2 border-amber-300">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Smile className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-black text-amber-900">
                  易混淆音对比：{data.contrastGuide.title}
                </span>
              </div>
              <p className="text-xs text-amber-800 font-bold mb-2">
                {data.contrastGuide.tip}
              </p>
              <div className="flex items-center justify-around gap-2 text-xs font-black">
                <div className="bg-white p-2 rounded-xl border border-amber-200 flex-1 text-center shadow-xs space-y-1">
                  <button
                    onClick={() => audioEngine.speakIpaSound(data.contrastGuide!.pairIpaA)}
                    className="w-full py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono text-sm font-black border border-indigo-200 cursor-pointer flex items-center justify-center gap-1 transition-colors"
                    title={`只听音标纯音: ${data.contrastGuide.pairIpaA}`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{data.contrastGuide.pairIpaA}</span>
                  </button>
                  <button
                    onClick={() => audioEngine.speakWord(data.contrastGuide!.pairWordA)}
                    className="text-slate-600 hover:text-indigo-700 text-[11px] block w-full hover:underline cursor-pointer"
                  >
                    词: {data.contrastGuide.pairWordA}
                  </button>
                </div>
                <span className="text-amber-500 font-black">VS</span>
                <div className="bg-white p-2 rounded-xl border border-amber-200 flex-1 text-center shadow-xs space-y-1">
                  <button
                    onClick={() => audioEngine.speakIpaSound(data.contrastGuide!.pairIpaB)}
                    className="w-full py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-mono text-sm font-black border border-purple-200 cursor-pointer flex items-center justify-center gap-1 transition-colors"
                    title={`只听音标纯音: ${data.contrastGuide.pairIpaB}`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{data.contrastGuide.pairIpaB}</span>
                  </button>
                  <button
                    onClick={() => audioEngine.speakWord(data.contrastGuide!.pairWordB)}
                    className="text-slate-600 hover:text-purple-700 text-[11px] block w-full hover:underline cursor-pointer"
                  >
                    词: {data.contrastGuide.pairWordB}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Oxford Lessons Cross-Link (Bidirectional Portal) */}
          {data.oxfordUnits.length > 0 && (
            <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200">
              <span className="text-xs font-black text-emerald-900 block mb-2 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                牛津树课程直通车 (在绘本实战中巩固该音标):
              </span>
              <div className="space-y-1.5">
                {data.oxfordUnits.map((u) => (
                  <button
                    key={u.unitId}
                    onClick={() => {
                      onClose();
                      if (onNavigateToOrtUnit) {
                        onNavigateToOrtUnit(u.unitId);
                      }
                    }}
                    className="w-full p-2.5 rounded-xl bg-white hover:bg-emerald-100/70 border border-emerald-300 transition-all flex items-center justify-between text-left cursor-pointer group"
                  >
                    <div>
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md mr-1.5">
                        L{u.level}
                      </span>
                      <span className="text-xs font-black text-slate-800 group-hover:text-emerald-700">
                        {u.title}
                      </span>
                    </div>
                    <span className="text-xs font-black text-emerald-600 flex items-center gap-0.5">
                      去学习 <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between gap-3">
          {onNavigateToVault && (
            <button
              onClick={() => {
                onClose();
                onNavigateToVault();
              }}
              className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>查看全部 48 音标宝典</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onClose}
            className="btn-3d px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black shadow-[0_3px_0_#0F172A] cursor-pointer ml-auto"
          >
            返回牛津树继续学 ➔
          </button>
        </div>
      </div>
    </div>
  );
};
