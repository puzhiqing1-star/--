/**
 * Magic Phonics Kids - 自然拼读与音标启蒙系统
 * Designed for Zero-Foundation Children (4-8 years old)
 * Following Jolly Phonics & Oxford Reading Tree progressive levels
 */

import React, { useState, useEffect } from 'react';
import { PhonicsRoadmap } from './components/PhonicsRoadmap';
import { BlendingCarTrack } from './components/BlendingCarTrack';
import { WordFamilySpinner } from './components/WordFamilySpinner';
import { MouthShapeVisualizer } from './components/MouthShapeVisualizer';
import { LetterTracingCanvas } from './components/LetterTracingCanvas';
import { ListeningChallenge } from './components/ListeningChallenge';
import { PhonicsVault } from './components/PhonicsVault';
import { InteractiveGamesHub } from './components/InteractiveGamesHub';
import { PersonalizedLearningPath } from './components/PersonalizedLearningPath';
import { OxfordReviewHub } from './components/OxfordReviewHub';
import { audioEngine } from './utils/audioEngine';
import { exportStandaloneHTML } from './utils/exportStandalone';
import { AudioSettingsModal } from './components/AudioSettingsModal';
import {
  Car,
  Disc,
  Smile,
  Edit3,
  Headphones,
  BookOpen,
  Map,
  Compass,
  Gamepad2,
  Download,
  Printer,
  Sparkles,
  Volume2
} from 'lucide-react';

type TabType =
  | 'roadmap'
  | 'ort'
  | 'path'
  | 'games'
  | 'blending'
  | 'spinner'
  | 'mouth'
  | 'tracing'
  | 'challenge'
  | 'vault';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('roadmap');
  const [selectedOrtUnitId, setSelectedOrtUnitId] = useState<string | undefined>(undefined);
  const [initialSubGame, setInitialSubGame] = useState<'matching' | 'spelling'>('matching');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState('');
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState(false);

  useEffect(() => {
    // Populate voices when loaded
    const updateVoiceList = () => {
      setVoices(audioEngine.getVoices());
      setCurrentVoice(audioEngine.getCurrentVoiceName());
    };

    updateVoiceList();
    const unsub = audioEngine.subscribe(updateVoiceList);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoiceList;
    }
    return () => unsub();
  }, []);

  const handleTabChange = (tab: TabType, subAction?: string, unitId?: string) => {
    setActiveTab(tab);
    if (subAction === 'matching' || subAction === 'spelling') {
      setInitialSubGame(subAction);
    }
    if (unitId) {
      setSelectedOrtUnitId(unitId);
    }
    audioEngine.playPop(800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-16 font-sans">
      {/* Top Utility Bar */}
      <div className="max-w-4xl mx-auto px-4 pt-3 pb-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            儿童启蒙模式 · 免认知过载
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Audio Tuning & Studio Voice Button */}
          <button
            onClick={() => {
              audioEngine.playPop(750);
              setIsAudioSettingsOpen(true);
            }}
            className="btn-3d flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border-2 border-emerald-200 font-black text-xs px-3 py-1.5 rounded-2xl shadow-[0_3px_0_#A7F3D0] cursor-pointer transition-all"
            title="点击调节发音清脆度、切换美式真人原声、人声与语速"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>发音调优 · 真人原声</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-full font-black">
              高清
            </span>
          </button>

          {/* Export Standalone HTML */}
          <button
            onClick={exportStandaloneHTML}
            className="btn-3d flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white font-black text-xs px-3 py-1.5 rounded-2xl shadow-[0_3px_0_#D97706] cursor-pointer"
            title="一键下载独立单文件 HTML，可在任何手机电脑双击离线打开"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出单文件 HTML</span>
          </button>

          {/* Print */}
          <button
            onClick={() => window.print()}
            className="btn-3d flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-black text-xs px-3 py-1.5 rounded-2xl shadow-[0_3px_0_#CBD5E1] cursor-pointer"
            title="打印字卡与练习单"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>打印字卡</span>
          </button>
        </div>
      </div>

      {/* Main Header Banner */}
      <header className="max-w-4xl mx-auto px-4 mb-5">
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white rounded-3xl p-5 md:p-6 shadow-[0_7px_0_#065F46] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner border border-white/30 animate-bounce">
              🔤
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                  Magic Phonics Kids
                </h1>
                <span className="text-[11px] font-black bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full shadow-sm">
                  0 基础首选
                </span>
              </div>
              <p className="text-xs md:text-sm font-bold text-white/90 mt-1">
                自然拼读与音标融合启蒙 · 字母音 ➔ 音轨滑动 ➔ 词族转盘 ➔ 描红口型
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3.5 py-2 rounded-2xl border border-white/20 text-xs font-black">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>Jolly Phonics 分级体系</span>
          </div>
        </div>
      </header>

      {/* Navigation Tabs (Duolingo 3D Pills) */}
      <nav className="max-w-4xl mx-auto px-4 mb-6">
        <div className="bg-white p-2 rounded-3xl shadow-[0_5px_0_#E2E8F0] border-2 border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleTabChange('roadmap')}
            className={`btn-3d px-3.5 py-2.5 rounded-2xl text-xs md:text-sm font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeTab === 'roadmap'
                ? 'bg-amber-500 text-white shadow-[0_4px_0_#D97706]'
                : 'text-slate-600 hover:bg-slate-100 shadow-none'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>1. 闯关地图</span>
          </button>

          <button
            onClick={() => handleTabChange('ort')}
            className={`btn-3d px-3.5 py-2.5 rounded-2xl text-xs md:text-sm font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer relative ${
              activeTab === 'ort'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_4px_0_#065F46]'
                : 'text-slate-700 hover:bg-emerald-50 shadow-none border border-emerald-200'
            }`}
          >
            <span className="text-base">🌳</span>
            <span>牛津自然拼读导图 (1-5级)</span>
            <span className="text-[10px] bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-full font-black animate-pulse shadow-sm">
              40 课细化
            </span>
          </button>

          <button
            onClick={() => handleTabChange('path')}
            className={`btn-3d px-3.5 py-2.5 rounded-2xl text-xs md:text-sm font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer relative ${
              activeTab === 'path'
                ? 'bg-teal-600 text-white shadow-[0_4px_0_#0D9488]'
                : 'text-slate-600 hover:bg-slate-100 shadow-none'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>2. 智能推荐路径</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => handleTabChange('games')}
            className={`btn-3d px-3.5 py-2.5 rounded-2xl text-xs md:text-sm font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeTab === 'games'
                ? 'bg-orange-500 text-white shadow-[0_4px_0_#C2410C]'
                : 'text-slate-600 hover:bg-slate-100 shadow-none'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>3. 拼读互动游戏</span>
          </button>

          <button
            onClick={() => handleTabChange('blending')}
            className={`btn-3d px-3.5 py-2.5 rounded-2xl text-xs md:text-sm font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeTab === 'blending'
                ? 'bg-emerald-500 text-white shadow-[0_4px_0_#059669]'
                : 'text-slate-600 hover:bg-slate-100 shadow-none'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>4. 拼读小车</span>
          </button>

          <button
            onClick={() => handleTabChange('spinner')}
            className={`btn-3d px-3.5 py-2.5 rounded-2xl text-xs md:text-sm font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeTab === 'spinner'
                ? 'bg-purple-600 text-white shadow-[0_4px_0_#4C1D95]'
                : 'text-slate-600 hover:bg-slate-100 shadow-none'
            }`}
          >
            <Disc className="w-4 h-4" />
            <span>5. 词族转盘</span>
          </button>

          <button
            onClick={() => handleTabChange('mouth')}
            className={`btn-3d px-3.5 py-2.5 rounded-2xl text-xs md:text-sm font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeTab === 'mouth'
                ? 'bg-rose-500 text-white shadow-[0_4px_0_#BE123C]'
                : 'text-slate-600 hover:bg-slate-100 shadow-none'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span>6. 口型小怪兽</span>
          </button>

          <button
            onClick={() => handleTabChange('tracing')}
            className={`btn-3d px-3.5 py-2.5 rounded-2xl text-xs md:text-sm font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeTab === 'tracing'
                ? 'bg-sky-500 text-white shadow-[0_4px_0_#0284C7]'
                : 'text-slate-600 hover:bg-slate-100 shadow-none'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>7. 笔顺描红</span>
          </button>

          <button
            onClick={() => handleTabChange('challenge')}
            className={`btn-3d px-3.5 py-2.5 rounded-2xl text-xs md:text-sm font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeTab === 'challenge'
                ? 'bg-teal-500 text-white shadow-[0_4px_0_#0F766E]'
                : 'text-slate-600 hover:bg-slate-100 shadow-none'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>8. 听音辨图</span>
          </button>

          <button
            onClick={() => handleTabChange('vault')}
            className={`btn-3d px-3.5 py-2.5 rounded-2xl text-xs md:text-sm font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeTab === 'vault'
                ? 'bg-indigo-600 text-white shadow-[0_4px_0_#3730A3]'
                : 'text-slate-600 hover:bg-slate-100 shadow-none'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>9. 48音标宝典</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={`${activeTab === 'ort' ? 'max-w-6xl' : 'max-w-4xl'} mx-auto px-4`}>
        {activeTab === 'roadmap' && (
          <PhonicsRoadmap onSelectPractice={(tab) => handleTabChange(tab as TabType)} />
        )}
        {activeTab === 'ort' && (
          <OxfordReviewHub
            initialUnitId={selectedOrtUnitId}
            onNavigateTab={(tab, subAction) => handleTabChange(tab as TabType, subAction)}
          />
        )}
        {activeTab === 'path' && (
          <PersonalizedLearningPath onNavigateTab={(tab, subAction) => handleTabChange(tab, subAction)} />
        )}
        {activeTab === 'games' && (
          <InteractiveGamesHub initialSubTab={initialSubGame} />
        )}
        {activeTab === 'blending' && <BlendingCarTrack />}
        {activeTab === 'spinner' && <WordFamilySpinner />}
        {activeTab === 'mouth' && <MouthShapeVisualizer />}
        {activeTab === 'tracing' && <LetterTracingCanvas />}
        {activeTab === 'challenge' && <ListeningChallenge />}
        {activeTab === 'vault' && (
          <PhonicsVault
            onNavigateToOrtUnit={(unitId) => handleTabChange('ort', undefined, unitId)}
          />
        )}
      </main>

      {/* Audio Clarity & Voice Settings Modal */}
      <AudioSettingsModal
        isOpen={isAudioSettingsOpen}
        onClose={() => setIsAudioSettingsOpen(false)}
      />

      {/* Footer Educational Summary */}
      <footer className="max-w-4xl mx-auto px-4 mt-12 text-center text-xs font-bold text-slate-400">
        <p>
          遵循英国主流自然拼读 (Phonics) 与国际音标 (IPA) 认知科学规律 ·
          以耳朵听音、嘴巴模仿为先，严禁死记硬背抽象符号
        </p>
        <p className="mt-1">
          Developed with Duolingo Design Tokens & Web Audio Hybrid Synthesizer ·
          支持触屏防误触与离线单文件运行
        </p>
      </footer>
    </div>
  );
}
