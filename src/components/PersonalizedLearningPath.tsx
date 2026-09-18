import React, { useState, useEffect } from 'react';
import { progressTracker, DiagnosisResult, UserProgressProfile, MistakeItem } from '../utils/progressTracker';
import { audioEngine } from '../utils/audioEngine';
import { MistakeVaultSection } from './MistakeVaultSection';
import {
  Compass,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Flame,
  Star,
  Award,
  Zap,
  RotateCcw,
  BookOpen,
  Layers,
  Smile,
  Car,
  History,
  Info
} from 'lucide-react';

interface PersonalizedLearningPathProps {
  onNavigateTab: (tab: any, subAction?: string) => void;
}

export function PersonalizedLearningPath({ onNavigateTab }: PersonalizedLearningPathProps) {
  const [profile, setProfile] = useState<UserProgressProfile>(progressTracker.getProfile());
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult>(progressTracker.getDiagnosis());
  const [mistakes, setMistakes] = useState<MistakeItem[]>(progressTracker.getMistakes());
  const [activeView, setActiveView] = useState<'recommendations' | 'vault'>('recommendations');

  useEffect(() => {
    const update = () => {
      setProfile(progressTracker.getProfile());
      setDiagnosis(progressTracker.getDiagnosis());
      setMistakes(progressTracker.getMistakes());
    };
    const unsub = progressTracker.subscribe(update);
    return () => unsub();
  }, []);

  const handleInjectDemo = () => {
    audioEngine.playPop(850);
    progressTracker.injectDemoProgress();
  };

  const handleReset = () => {
    if (confirm('确认清空当前学情数据，重新从 0 基础开始记录吗？')) {
      audioEngine.playPop(400);
      progressTracker.resetProgress();
    }
  };

  const pendingMistakes = mistakes.filter((m) => m.status !== 'mastered');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-500 text-white rounded-3xl p-5 md:p-6 shadow-[0_6px_0_#0F766E] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-inner border border-white/30">
            🧭
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black">
                个性化智能学习路径
              </h2>
              <span className="text-[11px] font-black bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full shadow-sm">
                自适应学习引擎
              </span>
            </div>
            <p className="text-xs md:text-sm font-bold text-white/90 mt-1">
              实时监测字母发音、自然拼读与单词拼写三维能力，智能定制下一个单元与薄弱攻坚方案！
            </p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2">
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-3.5 py-2 rounded-2xl text-center">
            <div className="text-[11px] font-bold text-teal-100 flex items-center justify-center gap-1">
              <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span>获得星星</span>
            </div>
            <div className="text-lg font-black">{profile.totalStars} ⭐</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-3.5 py-2 rounded-2xl text-center">
            <div className="text-[11px] font-bold text-teal-100 flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-orange-300 fill-orange-300" />
              <span>连续打卡</span>
            </div>
            <div className="text-lg font-black">{profile.streakDays} 天</div>
          </div>
        </div>
      </div>

      {/* Top View Mode Switcher */}
      <div className="flex items-center gap-2 bg-slate-200/70 p-1.5 rounded-2xl max-w-md">
        <button
          onClick={() => {
            audioEngine.playPop(750);
            setActiveView('recommendations');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs md:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeView === 'recommendations'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-4 h-4 text-teal-600" />
          <span>智能方案与学情</span>
        </button>
        <button
          onClick={() => {
            audioEngine.playPop(850);
            setActiveView('vault');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs md:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeView === 'vault'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-rose-500" />
          <span>错题宝库</span>
          {pendingMistakes.length > 0 && (
            <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full animate-pulse">
              {pendingMistakes.length}
            </span>
          )}
        </button>
      </div>

      {activeView === 'vault' ? (
        <MistakeVaultSection onNavigateTab={onNavigateTab} />
      ) : (
        <>
          {/* 3-Pillar Proficiency Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Letter Sounds */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_0_#E2E8F0] border-2 border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                1. 字母发音与形状
              </span>
              <span className="text-lg font-black text-slate-800">
                {diagnosis.letterSoundMastery}%
              </span>
            </div>
            <h4 className="text-base font-black text-slate-800 mb-1">
              音素辨识准确度
            </h4>
            <p className="text-xs font-bold text-slate-400 mb-3">
              字母发音对对碰、描红与听音辨识
            </p>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${diagnosis.letterSoundMastery}%` }}
            ></div>
          </div>
        </div>

        {/* Pillar 2: Blending */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_0_#E2E8F0] border-2 border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                2. 自然拼读与连读
              </span>
              <span className="text-lg font-black text-slate-800">
                {diagnosis.blendingMastery}%
              </span>
            </div>
            <h4 className="text-base font-black text-slate-800 mb-1">
              音轨滑动连读能力
            </h4>
            <p className="text-xs font-bold text-slate-400 mb-3">
              拼读小车连续混合与词族转盘
            </p>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${diagnosis.blendingMastery}%` }}
            ></div>
          </div>
        </div>

        {/* Pillar 3: Spelling */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_0_#E2E8F0] border-2 border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                3. 基础单词拼写
              </span>
              <span className="text-lg font-black text-slate-800">
                {diagnosis.spellingMastery}%
              </span>
            </div>
            <h4 className="text-base font-black text-slate-800 mb-1">
              CVC 单词气球拼写
            </h4>
            <p className="text-xs font-bold text-slate-400 mb-3">
              首音填空、元音填空与全词重组
            </p>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${diagnosis.spellingMastery}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses Analysis Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-[0_4px_0_#E2E8F0] border-2 border-emerald-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
              ✨
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black text-slate-800">
                当前强项 (Mastered Strengths)
              </h3>
              <p className="text-xs font-bold text-slate-400">
                宝宝掌握极佳的发音与拼读技能
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {diagnosis.strengths.map((st, i) => (
              <div
                key={i}
                className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3 flex items-start gap-3"
              >
                <span className="text-xl">{st.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-emerald-950">
                      {st.name}
                    </span>
                    <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                      {st.tag}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-[0_4px_0_#E2E8F0] border-2 border-rose-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                🎯
              </div>
              <div>
                <h3 className="text-base md:text-lg font-black text-slate-800">
                  需重点强化 (Identified Weaknesses)
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  系统检测到的易错发音与拼写盲区
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                audioEngine.playPop(850);
                setActiveView('vault');
              }}
              className="text-xs font-black text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>查看错题宝库</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {diagnosis.weaknesses.map((wk) => (
              <div
                key={wk.id}
                className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-3 flex items-start justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-rose-950">
                      {wk.name}
                    </span>
                    <span className="text-[10px] font-black bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">
                      {wk.tag}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-rose-700 mt-0.5">
                    {wk.desc}
                  </p>
                </div>

                <button
                  onClick={() => onNavigateTab(wk.recommendedTab, wk.recommendedSubAction)}
                  className="btn-3d bg-rose-500 hover:bg-rose-400 text-white font-black text-xs px-2.5 py-1.5 rounded-xl shadow-[0_3px_0_#BE123C] shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <span>去攻克</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Mistake Vault Callout inside Weakness Section */}
            <div className="mt-3 bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">📕</span>
                <div>
                  <div className="text-xs font-black text-rose-950 flex items-center gap-1.5">
                    <span>智能错题宝库收录：{pendingMistakes.length} 项待攻克</span>
                    <span className="text-[10px] font-bold bg-rose-200 text-rose-800 px-1.5 py-0.2 rounded-full">
                      自动归集
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-rose-700 mt-0.5">
                    含听音辨图、字母对对碰、气球拼写中出错的音素与单词
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  audioEngine.playPop(850);
                  setActiveView('vault');
                }}
                className="btn-3d px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black shadow-[0_2px_0_#BE123C] flex items-center gap-1.5 shrink-0 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <span>进入宝库专项练习</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SMART RECOMMENDATION MODULE (The Core Intelligence) */}
      <div className="bg-white rounded-3xl p-6 md:p-7 shadow-[0_5px_0_#E2E8F0] border-2 border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-black">
              🤖
            </span>
            <div>
              <h3 className="text-lg md:text-xl font-black text-slate-800">
                智能学习方案推荐 (Smart Recommendations)
              </h3>
              <p className="text-xs font-bold text-slate-400">
                根据宝宝当前薄弱点与认知梯度计算的最佳学习步骤
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Weakness Review Prescription */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl p-5 shadow-[0_4px_0_#C2410C] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black bg-white/20 px-2.5 py-0.5 rounded-full">
                  方案一 · 靶向薄弱项复习
                </span>
                <span className="text-xs font-black text-amber-200">
                  即时提分
                </span>
              </div>
              <h4 className="text-lg font-black mb-1">
                攻克：{diagnosis.weaknesses[0]?.name || '易混音辨析'}
              </h4>
              <p className="text-xs font-bold text-white/90 mb-4 leading-relaxed">
                {diagnosis.weaknesses[0]?.desc || '推荐通过口型小怪兽直观感受大嘴与小嘴的肌肉记忆！'}
              </p>
            </div>

            <button
              onClick={() =>
                onNavigateTab(
                  diagnosis.weaknesses[0]?.recommendedTab || 'mouth',
                  diagnosis.weaknesses[0]?.recommendedSubAction
                )
              }
              className="btn-3d w-full py-2.5 rounded-xl bg-white text-orange-950 font-black text-xs md:text-sm shadow-[0_3px_0_#FED7AA] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>立即进入专属薄弱项复习</span>
              <ArrowRight className="w-4 h-4 text-orange-600" />
            </button>
          </div>

          {/* Card 2: Next Stage Progression */}
          <div className="bg-gradient-to-br from-indigo-600 to-sky-600 text-white rounded-2xl p-5 shadow-[0_4px_0_#3730A3] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black bg-white/20 px-2.5 py-0.5 rounded-full">
                  方案二 · 推荐下一单元
                </span>
                <span className="text-xs font-black text-sky-200">
                  {diagnosis.nextRecommendedUnit.badge}
                </span>
              </div>
              <h4 className="text-lg font-black mb-1">
                {diagnosis.nextRecommendedUnit.title}
              </h4>
              <p className="text-xs font-bold text-white/90 mb-4 leading-relaxed">
                {diagnosis.nextRecommendedUnit.reason}
              </p>
            </div>

            <button
              onClick={() => onNavigateTab(diagnosis.nextRecommendedUnit.targetTab)}
              className="btn-3d w-full py-2.5 rounded-xl bg-white text-indigo-950 font-black text-xs md:text-sm shadow-[0_3px_0_#E0E7FF] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>前往下一单元学习 ➔</span>
            </button>
          </div>
        </div>

        {/* Daily 5-Min Smart Practice Capsule */}
        <div className="mt-6 bg-slate-50 rounded-2xl p-4 md:p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
              <h4 className="text-sm font-black text-slate-800">
                今日 5 分钟微复习胶囊 (Daily 3-Step Capsule)
              </h4>
            </div>
            <span className="text-xs font-bold text-slate-400">
              免疲劳、高频度、低认知负荷
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {diagnosis.todayCapsule.map((cap) => (
              <div
                key={cap.id}
                onClick={() => onNavigateTab(cap.targetTab)}
                className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm hover:border-emerald-400 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-slate-800">
                      {cap.title}
                    </span>
                    {cap.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                        +{cap.rewardStars} ⭐
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-400 mb-2">
                    {cap.desc}
                  </p>
                </div>
                <div className="text-[11px] font-black text-emerald-600 flex items-center gap-1">
                  <span>点击开始</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Oxford Reading Tree Curriculum Review Capsule */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-indigo-500/10 border-2 border-emerald-300 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-sm">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-slate-800">
                  牛津自然拼读 (Oxford Phonics World 1-5 级) 体系思维导图
                </h4>
                <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                  40 节细化课时
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                完整覆盖 1-5 级全部课时：思维导图音素分支 ➔ 核心词分音拼读 ➔ 原版绘本点读 ➔ 课后随堂闯关
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('ort')}
            className="btn-3d px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-black shadow-[0_3px_0_#065F46] flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>进入牛津树思维导图与课程</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      </>
      )}

      {/* Parent Transparency & Diagnostic Controls */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-[0_4px_0_#E2E8F0] border-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl text-slate-600">
            📊
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800">
              家长学情调试与演示视窗
            </h4>
            <p className="text-xs font-bold text-slate-400">
              可随时注入典型薄弱样本数据体验诊断效果，或清空数据全新测试
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInjectDemo}
            className="btn-3d bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-black text-xs px-3 py-2 rounded-xl shadow-[0_2px_0_#C7D2FE] flex items-center gap-1.5 cursor-pointer"
            title="注入测试学情数据，直观体验弱项诊断"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>注入演示学情数据</span>
          </button>

          <button
            onClick={handleReset}
            className="btn-3d bg-white hover:bg-slate-50 text-rose-600 border border-rose-200 font-black text-xs px-3 py-2 rounded-xl shadow-[0_2px_0_#FECDD3] flex items-center gap-1.5 cursor-pointer"
            title="清空重置"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置进度</span>
          </button>
        </div>
      </div>
    </div>
  );
}
