import React, { useRef, useState, useEffect } from 'react';
import { PHONEMES_DATA, PhonemeInfo } from '../data/phonicsData';
import { audioEngine } from '../utils/audioEngine';
import { Volume2, Sparkles, RotateCcw, ChevronRight } from 'lucide-react';

export const LetterTracingCanvas: React.FC = () => {
  const [selectedPhonemeIdx, setSelectedPhonemeIdx] = useState(0);
  const [strokeColor, setStrokeColor] = useState('#1CB0F6'); // Duolingo blue
  const [isCompleted, setIsCompleted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const drawnPointsCountRef = useRef(0);

  const curPhoneme: PhonemeInfo = PHONEMES_DATA[selectedPhonemeIdx];

  // Draw guide letter background on canvas
  const drawGuideLetter = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Four-line three-grid guide (English handwriting lines)
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);

    // Top line
    ctx.beginPath();
    ctx.moveTo(10, 50);
    ctx.lineTo(canvas.width - 10, 50);
    ctx.stroke();

    // Baseline (middle)
    ctx.strokeStyle = '#CBD5E1';
    ctx.beginPath();
    ctx.moveTo(10, 110);
    ctx.lineTo(canvas.width - 10, 110);
    ctx.stroke();

    // Bottom line
    ctx.strokeStyle = '#E2E8F0';
    ctx.beginPath();
    ctx.moveTo(10, 170);
    ctx.lineTo(canvas.width - 10, 170);
    ctx.stroke();

    ctx.setLineDash([]); // reset

    // Guide letter watermark (light gray dashed outline)
    ctx.font = 'bold 120px "Fredoka", "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#F1F5F9';
    ctx.fillText(curPhoneme.letter, canvas.width / 2, 115);

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#CBD5E1';
    ctx.strokeText(curPhoneme.letter, canvas.width / 2, 115);

    drawnPointsCountRef.current = 0;
    setIsCompleted(false);
  };

  useEffect(() => {
    drawGuideLetter();
  }, [selectedPhonemeIdx]);

  // Touch and pointer events
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const pt = getCanvasCoords(e);
    lastPointRef.current = pt;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const pt = getCanvasCoords(e);
    if (!lastPointRef.current) {
      lastPointRef.current = pt;
      return;
    }

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPointRef.current = pt;
    drawnPointsCountRef.current += 1;

    // Check completion threshold
    if (drawnPointsCountRef.current > 35 && !isCompleted) {
      setIsCompleted(true);
      audioEngine.playSuccessChime();
    }
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const handleClear = () => {
    drawGuideLetter();
    audioEngine.playPop(500);
  };

  const handleNext = () => {
    const nextIdx = (selectedPhonemeIdx + 1) % PHONEMES_DATA.length;
    setSelectedPhonemeIdx(nextIdx);
    audioEngine.playPop(700);
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-7 shadow-[0_6px_0_#E2E8F0] border-2 border-slate-100 max-w-3xl mx-auto">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-2xl shadow-[0_3px_0_#BAE6FD]">
            ✍️
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              字母笔顺描红 · 肌肉记忆
              <span className="text-xs bg-sky-500 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Letter Tracing
              </span>
            </h2>
            <p className="text-sm font-bold text-slate-400">
              写标准英文字母及常见组合，手指跟着笔顺一起动！
            </p>
          </div>
        </div>

        <button
          onClick={() => audioEngine.speakPhoneme(curPhoneme.audioPhoneme)}
          className="btn-3d flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-black px-4 py-2.5 rounded-2xl shadow-[0_4px_0_#0284C7] text-sm cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          听发音: {curPhoneme.ipa}
        </button>
      </div>

      {/* Letter Carousel Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {PHONEMES_DATA.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setSelectedPhonemeIdx(idx)}
            className={`btn-3d px-3.5 py-2 rounded-2xl text-base font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              selectedPhonemeIdx === idx
                ? 'bg-sky-500 text-white shadow-[0_4px_0_#0369A1] scale-105'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-[0_3px_0_#CBD5E1]'
            }`}
          >
            <span>{p.letter}</span>
            <span className="text-xs opacity-75 font-normal">({p.ipa})</span>
          </button>
        ))}
      </div>

      {/* Tracing Canvas Stage */}
      <div className="bg-gradient-to-b from-sky-50/70 via-indigo-50/40 to-white rounded-3xl p-6 md:p-8 border-2 border-sky-100 mb-6 flex flex-col items-center">
        
        {/* Stroke Guide Instruction Tip */}
        <div className="bg-white px-5 py-2.5 rounded-2xl shadow-[0_3px_0_#E2E8F0] border border-sky-200 text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <span>🎯</span>
          <span>{curPhoneme.strokeGuide}</span>
        </div>

        {/* Tracing Box Canvas */}
        <div className="relative touch-none">
          <canvas
            ref={canvasRef}
            width={320}
            height={220}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="bg-white rounded-3xl border-4 border-dashed border-sky-300 shadow-[0_8px_0_#BAE6FD] cursor-crosshair select-none touch-none w-[280px] h-[190px] sm:w-[320px] sm:h-[220px]"
          />

          {/* Completion Celebration Overlay */}
          {isCompleted && (
            <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[1px] rounded-3xl flex flex-col items-center justify-center animate-jelly pointer-events-none">
              <span className="text-5xl animate-bounce">🌟</span>
              <span className="text-lg font-black text-emerald-700 bg-white/95 px-4 py-1 rounded-full shadow mt-2">
                写得真棒！太厉害啦！
              </span>
            </div>
          )}
        </div>

        {/* Tool bar & colors */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {/* Colors */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl shadow-[0_3px_0_#CBD5E1] border border-slate-200">
            {['#1CB0F6', '#58CC02', '#FF9600', '#CE82FF', '#FF4B4B'].map(
              (c) => (
                <button
                  key={c}
                  onClick={() => setStrokeColor(c)}
                  className={`w-7 h-7 rounded-full cursor-pointer transition-transform ${
                    strokeColor === c ? 'scale-125 ring-2 ring-slate-800' : ''
                  }`}
                  style={{ backgroundColor: c }}
                  title="选择魔法笔刷颜色"
                />
              )
            )}
          </div>

          <button
            onClick={handleClear}
            className="btn-3d flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black px-4 py-2.5 rounded-2xl shadow-[0_3px_0_#CBD5E1] text-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            重写一笔
          </button>

          <button
            onClick={handleNext}
            className="btn-3d flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black px-5 py-2.5 rounded-2xl shadow-[0_4px_0_#059669] text-sm cursor-pointer"
          >
            <span>换下一个字母</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
