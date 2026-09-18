import React, { useState, useEffect } from 'react';
import { audioEngine, PhonicsMode } from '../utils/audioEngine';
import { Volume2, Check, Sparkles, X, Sliders, Radio, Music } from 'lucide-react';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({ isOpen, onClose }) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState('');
  const [phonicsMode, setPhonicsMode] = useState<PhonicsMode>('anchor');
  const [useStudioVoice, setUseStudioVoice] = useState(true);
  const [speechRate, setSpeechRate] = useState(0.95);
  const [testPlaying, setTestPlaying] = useState(false);

  useEffect(() => {
    const update = () => {
      setVoices(audioEngine.getVoices());
      setCurrentVoice(audioEngine.getCurrentVoiceName());
      setPhonicsMode(audioEngine.getPhonicsMode());
      setUseStudioVoice(audioEngine.getUseStudioVoice());
      setSpeechRate(audioEngine.getSpeechRate());
    };

    update();
    const unsub = audioEngine.subscribe(update);
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vName = e.target.value;
    audioEngine.setVoiceByName(vName);
    setCurrentVoice(vName);
  };

  const handleTestListen = async () => {
    setTestPlaying(true);
    if (phonicsMode === 'anchor') {
      await audioEngine.speakWord('apple');
    } else {
      await audioEngine.speakWord('phonics');
    }
    setTimeout(() => setTestPlaying(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-4 border-emerald-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight flex items-center gap-1.5">
                发音调优与原声设置
              </h3>
              <p className="text-xs font-bold text-emerald-100">
                Crystal-Clear Audio Tuning & Studio Voices
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 md:p-6 space-y-5 text-slate-700 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Studio HD Voice Toggle */}
          <div className="bg-emerald-50/70 border-2 border-emerald-200/80 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <span>高保真真人原声 (Studio HD)</span>
                    <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                      强烈推荐
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">
                    采用专业美式母语者录音，彻底告别机械电音，清脆纯净
                  </p>
                </div>
              </div>

              <button
                onClick={() => audioEngine.setUseStudioVoice(!useStudioVoice)}
                className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  useStudioVoice ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                    useStudioVoice ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section 2: Phonics Style */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-600" />
              拼读发音模式 (Pronunciation Style)
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  audioEngine.setPhonicsMode('anchor');
                  audioEngine.speakPhoneme('a', 0.95, undefined, 'apple');
                }}
                className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all flex flex-col justify-between ${
                  phonicsMode === 'anchor'
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-slate-800">🍎 音素+代表词联读</span>
                  {phonicsMode === 'anchor' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] font-bold text-slate-400 leading-tight">
                  国际主流：如点击 A 听 &quot;Apple&quot;，辨析度极高
                </p>
              </button>

              <button
                onClick={() => {
                  audioEngine.setPhonicsMode('pure');
                  audioEngine.speakWord('cat');
                }}
                className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all flex flex-col justify-between ${
                  phonicsMode === 'pure'
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-slate-800">🎵 单音素纯音模式</span>
                  {phonicsMode === 'pure' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] font-bold text-slate-400 leading-tight">
                  单音节短促发音，已校正音高杜绝杂音
                </p>
              </button>
            </div>
          </div>

          {/* Section 3: Speech Voice Engine */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-emerald-600" />
                系统纯正女声发音人 (Female Teacher Voice)
              </label>
              <button
                onClick={handleTestListen}
                disabled={testPlaying}
                className="text-xs font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{testPlaying ? '播放中...' : '🎧 试听女声'}</span>
              </button>
            </div>

            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-2.5 flex items-center gap-2">
              <select
                value={currentVoice}
                onChange={handleVoiceChange}
                className="w-full bg-transparent border-none text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    👩 {v.name.includes('Natural') || v.name.includes('Google') ? '⭐ ' : ''}
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] font-bold text-slate-400">
              已彻底过滤所有男声，全系统统一采用温润清脆的母语女声，音标与例词声调自然一致
            </p>
          </div>

          {/* Section 4: Speech Rate */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>发音语速 (Speech Speed)</span>
              <span className="text-emerald-600 font-bold">{speechRate}x</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => audioEngine.setSpeechRate(0.95)}
                className={`py-2 px-3 rounded-xl text-xs font-black border-2 cursor-pointer transition-all ${
                  speechRate >= 0.9
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-600 bg-white'
                }`}
              >
                ✨ 1.0x 清脆标准 (自然流利)
              </button>
              <button
                onClick={() => audioEngine.setSpeechRate(0.8)}
                className={`py-2 px-3 rounded-xl text-xs font-black border-2 cursor-pointer transition-all ${
                  speechRate < 0.9
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-600 bg-white'
                }`}
              >
                🐢 0.8x 幼童慢速 (清晰跟读)
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              audioEngine.setUseStudioVoice(true);
              audioEngine.setPhonicsMode('anchor');
              audioEngine.setSpeechRate(0.95);
            }}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            恢复最佳推荐音质
          </button>

          <button
            onClick={onClose}
            className="btn-3d px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-[0_3px_0_#059669] cursor-pointer"
          >
            完成并应用
          </button>
        </div>
      </div>
    </div>
  );
};
