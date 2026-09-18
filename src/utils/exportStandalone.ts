/**
 * Generates and downloads a complete, standalone, single-file HTML version
 * of the Phonics & Pronunciation application with pure HTML/CSS/JS.
 */
export function exportStandaloneHTML() {
  const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Magic Phonics Kids - 自然拼读与音标启蒙 (独立单文件版)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --green: #58CC02; --green-dark: #46A302;
    --blue: #1CB0F6; --blue-dark: #1899D6;
    --purple: #CE82FF; --purple-dark: #A24FD0;
    --amber: #FF9600; --amber-dark: #D97706;
    --rose: #FF4B4B; --rose-dark: #E03535;
    --bg: #F7F9FC; --ink: #1E293B; --card: #FFFFFF;
    --radius: 20px;
    --shadow: 0 5px 0 #E2E8F0;
  }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body {
    margin: 0; padding: 16px; font-family: 'Fredoka', -apple-system, system-ui, sans-serif;
    background: var(--bg); color: var(--ink); max-width: 860px; margin: 0 auto;
    user-select: none;
  }
  header {
    background: linear-gradient(135deg, var(--green), var(--green-dark));
    color: white; padding: 18px 24px; border-radius: var(--radius);
    box-shadow: 0 6px 0 #367c02; margin-bottom: 20px;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
  }
  header h1 { margin: 0; font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
  header .tag { background: rgba(255,255,255,0.25); padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; }
  .nav-tabs {
    display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 18px;
    scrollbar-width: none;
  }
  .nav-tabs::-webkit-scrollbar { display: none; }
  .tab-btn {
    border: none; border-radius: 16px; padding: 10px 18px; font-size: 14px; font-weight: 700;
    background: white; color: #64748B; box-shadow: 0 4px 0 #CBD5E1; cursor: pointer;
    display: flex; align-items: center; gap: 6px; white-space: nowrap; transition: 0.1s;
    font-family: inherit;
  }
  .tab-btn.active {
    background: var(--amber); color: white; box-shadow: 0 4px 0 var(--amber-dark);
    transform: translateY(-2px);
  }
  .tab-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #CBD5E1; }
  .card {
    background: var(--card); border-radius: var(--radius); padding: 22px; margin-bottom: 20px;
    box-shadow: var(--shadow); border: 2px solid #F1F5F9;
  }
  .btn-3d {
    font-family: inherit; font-weight: 700; border: none; border-radius: 14px; padding: 10px 18px;
    cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: 0.08s;
  }
  .btn-3d:active { transform: translateY(3px) !important; }
  .btn-green { background: var(--green); color: white; box-shadow: 0 4px 0 var(--green-dark); }
  .btn-blue { background: var(--blue); color: white; box-shadow: 0 4px 0 var(--blue-dark); }
  .btn-purple { background: var(--purple); color: white; box-shadow: 0 4px 0 var(--purple-dark); }
  .btn-amber { background: var(--amber); color: white; box-shadow: 0 4px 0 var(--amber-dark); }
  /* Road / Track */
  .road {
    background: #334155; border-radius: 20px; height: 90px; position: relative;
    display: flex; align-items: center; justify-content: space-around; padding: 0 30px;
    margin: 24px 0; border-bottom: 4px solid #0F172A;
  }
  .road-line {
    position: absolute; left: 20px; right: 20px; height: 2px;
    border-top: 3px dashed #FCD34D; opacity: 0.6; pointer-events: none;
  }
  .sound-station {
    width: 65px; height: 80px; background: white; border-radius: 14px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    box-shadow: 0 5px 0 #CBD5E1; z-index: 2; cursor: pointer; transition: 0.15s;
  }
  .sound-station.hit { background: var(--amber); color: white; box-shadow: 0 5px 0 var(--amber-dark); transform: scale(1.1); }
  .sound-station .letter { font-size: 32px; font-weight: 700; line-height: 1; }
  .sound-station .ipa { font-size: 11px; opacity: 0.7; font-weight: 700; margin-top: 2px; }
  /* Canvas tracing */
  .trace-box {
    display: flex; flex-direction: column; align-items: center; gap: 14px;
  }
  canvas {
    background: white; border: 4px dashed #93C5FD; border-radius: 20px;
    touch-action: none; cursor: crosshair; box-shadow: 0 6px 0 #DBEAFE;
  }
  /* Grid */
  .grid-letters {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 12px; margin-top: 14px;
  }
  .letter-card {
    background: white; border: 2px solid #E2E8F0; border-radius: 16px; padding: 14px;
    text-align: center; cursor: pointer; box-shadow: 0 4px 0 #E2E8F0; transition: 0.1s;
  }
  .letter-card:hover { border-color: var(--amber); }
  .letter-card.sel { border-color: var(--amber); background: #FFFBEB; box-shadow: 0 4px 0 var(--amber); transform: scale(1.03); }
  .letter-card .big { font-size: 34px; font-weight: 700; }
  .letter-card .em { font-size: 24px; margin: 4px 0; }
  .word-spinner {
    display: flex; align-items: center; justify-content: center; gap: 14px; margin: 20px 0; flex-wrap: wrap;
  }
  .slot-box {
    width: 90px; height: 90px; border-radius: 20px; display: flex; align-items: center; justify-content: center;
    font-size: 40px; font-weight: 700; color: white; box-shadow: 0 6px 0 rgba(0,0,0,0.15);
  }
  @media print {
    .nav-tabs, header, .btn-3d { display: none !important; }
    .card { box-shadow: none; border: 1px solid #999; break-inside: avoid; }
  }
</style>
</head>
<body>

<header>
  <div>
    <h1>🔤 Magic Phonics Kids</h1>
    <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">专为 0 基础儿童设计的自然拼读与音标启蒙系统</div>
  </div>
  <div class="tag">Jolly Phonics × Duolingo 风格</div>
</header>

<div class="nav-tabs">
  <button class="tab-btn active" onclick="switchTab('car')">🚗 拼读小车</button>
  <button class="tab-btn" onclick="switchTab('spinner')">🎡 词族转盘</button>
  <button class="tab-btn" onclick="switchTab('mouth')">👄 口型小怪兽</button>
  <button class="tab-btn" onclick="switchTab('trace')">✍️ 字母描红</button>
  <button class="tab-btn" onclick="switchTab('quiz')">🎧 听音选图</button>
  <button class="tab-btn" onclick="switchTab('vault')">📖 48 音标宝典</button>
</div>

<!-- MODULE 1: Continuous Blending Car -->
<div id="tab-car" class="card">
  <h2>🚗 音轨滑块 · 拼读小车 (Continuous Blending)</h2>
  <p style="color:#64748B; font-size:13px; font-weight:700;">点击字母试听音素，点「小车开动」看声音如何融合成词！</p>
  <div style="display:flex; gap:8px; margin-bottom:12px; overflow-x:auto;">
    <button class="btn-3d btn-green" onclick="setCarWord('cat','🐱',['c','a','t'],['k','a','t'])">🐱 c-a-t</button>
    <button class="btn-3d btn-green" onclick="setCarWord('sun','☀️',['s','u','n'],['s','u','n'])">☀️ s-u-n</button>
    <button class="btn-3d btn-green" onclick="setCarWord('pig','🐷',['p','i','g'],['p','i','g'])">🐷 p-i-g</button>
    <button class="btn-3d btn-green" onclick="setCarWord('bed','🛏️',['b','e','d'],['b','e','d'])">🛏️ b-e-d</button>
    <button class="btn-3d btn-green" onclick="setCarWord('hat','🎩',['h','a','t'],['h','a','t'])">🎩 h-a-t</button>
  </div>
  <div class="road">
    <div class="road-line"></div>
    <div id="st0" class="sound-station" onclick="playStation(0)"><span class="letter">c</span><span class="ipa">/k/</span></div>
    <div id="st1" class="sound-station" onclick="playStation(1)"><span class="letter">a</span><span class="ipa">/æ/</span></div>
    <div id="st2" class="sound-station" onclick="playStation(2)"><span class="letter">t</span><span class="ipa">/t/</span></div>
    <div id="stEnd" class="sound-station" style="background:#F43F5E; color:white;"><span style="font-size:24px;">🏁</span></div>
  </div>
  <div style="display:flex; justify-content:space-between; align-items:center;">
    <button class="btn-3d btn-amber" onclick="driveCar()">🚗 小车开动连读！</button>
    <div id="carResult" style="font-size:18px; font-weight:700; color:var(--green);"></div>
  </div>
</div>

<!-- MODULE 2: Word Family Spinner -->
<div id="tab-spinner" class="card" style="display:none;">
  <h2>🎡 词族转盘 · CVC 拼词 (Word Families)</h2>
  <p style="color:#64748B; font-size:13px; font-weight:700;">旋转首字母，组合出同一词族的所有单词！</p>
  <div class="word-spinner">
    <div class="slot-box" style="background:var(--amber);" id="spinOnset">c</div>
    <div style="font-size:24px; font-weight:700; color:#94A3B8;">➕</div>
    <div class="slot-box" style="background:var(--blue);" id="spinRime">-at</div>
    <div style="font-size:24px; font-weight:700; color:#94A3B8;">➔</div>
    <div class="slot-box" style="background:var(--green);" id="spinResult">cat 🐱</div>
  </div>
  <div style="text-align:center;">
    <button class="btn-3d btn-purple" onclick="spinWheel()">🎲 转动首字母！</button>
  </div>
</div>

<!-- MODULE 3: Mouth Shape -->
<div id="tab-mouth" class="card" style="display:none;">
  <h2>👄 口型小怪兽 · 易混音对比</h2>
  <p style="color:#64748B; font-size:13px; font-weight:700;">三指宽还是两指宽？摸摸下巴、看口型！</p>
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:14px;">
    <div style="background:#FEF3C7; padding:16px; border-radius:18px; text-align:center;">
      <div style="font-size:44px;">🍎</div>
      <h3 style="margin:4px 0;">/æ/ 大嘴苹果音</h3>
      <p style="font-size:12px; font-weight:700; color:#92400E;">三指宽！大张嘴，下巴用力下沉！</p>
      <button class="btn-3d btn-amber" onclick="speak('apple')">🔊 听例词: cat, bat</button>
    </div>
    <div style="background:#DCFCE7; padding:16px; border-radius:18px; text-align:center;">
      <div style="font-size:44px;">🥚</div>
      <h3 style="margin:4px 0;">/e/ 微笑小蛋音</h3>
      <p style="font-size:12px; font-weight:700; color:#166534;">两指宽！嘴角自然微笑拉开！</p>
      <button class="btn-3d btn-green" onclick="speak('egg')">🔊 听例词: bed, pen</button>
    </div>
  </div>
</div>

<!-- MODULE 4: Tracing -->
<div id="tab-trace" class="card" style="display:none;">
  <h2>✍️ 字母及组合笔顺描红</h2>
  <p style="color:#64748B; font-size:13px; font-weight:700;">用手指或鼠标，在浅色虚线内写出漂亮字母！</p>
  <div class="trace-box">
    <canvas id="paintCanvas" width="300" height="200"></canvas>
    <div style="display:flex; gap:10px;">
      <button class="btn-3d btn-blue" onclick="clearCanvas()">🧽 清除重写</button>
      <button class="btn-3d btn-amber" onclick="speakTraceLetter()">🔊 听字母发音</button>
      <button class="btn-3d btn-green" onclick="nextTraceLetter()">➔ 换个字母</button>
    </div>
  </div>
</div>

<!-- MODULE 5: Quiz -->
<div id="tab-quiz" class="card" style="display:none;">
  <h2>🎧 听音选图 · 小小神耳朵</h2>
  <p style="color:#64748B; font-size:13px; font-weight:700;">点大喇叭听声音，选出对应的可爱卡片！</p>
  <div style="text-align:center; margin:16px 0;">
    <button class="btn-3d btn-green" style="font-size:22px; padding:16px 28px; border-radius:24px;" onclick="playQuizSound()">🔊 听一听</button>
  </div>
  <div id="quizOptions" style="display:grid; grid-template-columns:1fr 1fr; gap:14px; max-width:400px; margin:0 auto;"></div>
  <div id="quizFb" style="text-align:center; font-size:18px; font-weight:700; margin-top:14px; min-height:24px;"></div>
</div>

<!-- MODULE 6: 48 IPA Vault -->
<div id="tab-vault" class="card" style="display:none;">
  <div style="display:flex; justify-content:space-between; align-items:center;">
    <h2>📖 48 国际音标 × 自拼全景宝典</h2>
    <button class="btn-3d" style="background:#334155; color:white;" onclick="window.print()">🖨️ 打印练习卡</button>
  </div>
  <p style="color:#64748B; font-size:13px; font-weight:700;">双线对应：黄色是眼睛看到的字母组合，灰色是耳朵听到的音标符号。</p>
  <div class="grid-letters" id="vaultGrid"></div>
</div>

<script>
/* ================= AUDIO SYNTHESIS & TTS ================= */
let audioCtx = null;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function playTone(freq, dur = 0.2, type = 'sine') {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type; osc.frequency.value = freq;
    g.gain.setValueAtTime(0.25, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + dur);
  } catch(e){}
}
function playDing() {
  const ctx = getCtx();
  [523, 659, 783, 1046].forEach((f, i) => setTimeout(() => playTone(f, 0.3), i * 80));
}
function speak(txt, rate = 0.85) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = 'en-US'; u.rate = rate;
    window.speechSynthesis.speak(u);
  } catch(e){}
}

/* ================= TABS ================= */
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  event.currentTarget.classList.add('active');
  ['car','spinner','mouth','trace','quiz','vault'].forEach(id => {
    document.getElementById('tab-' + id).style.display = (id === tabId) ? 'block' : 'none';
  });
  if (tabId === 'trace') initCanvas();
  if (tabId === 'quiz') newQuiz();
  if (tabId === 'vault') initVault();
}

/* ================= BLENDING CAR ================= */
let curLetters = ['c','a','t'];
let curPhonemes = ['k','a','t'];
let curWordName = 'cat';
let curEmoji = '🐱';
function setCarWord(w, em, lets, phs) {
  curWordName = w; curEmoji = em; curLetters = lets; curPhonemes = phs;
  document.getElementById('st0').querySelector('.letter').textContent = lets[0];
  document.getElementById('st1').querySelector('.letter').textContent = lets[1];
  document.getElementById('st2').querySelector('.letter').textContent = lets[2];
  document.getElementById('carResult').textContent = '';
  speak(w);
}
function playStation(idx) {
  document.querySelectorAll('.sound-station').forEach(s => s.classList.remove('hit'));
  const el = document.getElementById('st' + idx);
  if (el) el.classList.add('hit');
  playTone(idx === 0 ? 400 : idx === 1 ? 550 : 700, 0.15);
  speak(curPhonemes[idx]);
}
function driveCar() {
  document.getElementById('carResult').textContent = '拼读中...';
  playStation(0);
  setTimeout(() => playStation(1), 500);
  setTimeout(() => playStation(2), 1000);
  setTimeout(() => {
    document.getElementById('stEnd').classList.add('hit');
    playDing();
    speak(curWordName);
    document.getElementById('carResult').textContent = '🎉 ' + curWordName.toUpperCase() + ' ' + curEmoji;
  }, 1500);
}

/* ================= WORD SPINNER ================= */
const onsets = ['c','b','h','m','p','s','r'];
const meanings = { 'cat':'猫咪🐱', 'bat':'蝙蝠/球棒🦇', 'hat':'帽子🎩', 'mat':'垫子🧘', 'pat':'拍拍🫳', 'sat':'坐下🪑', 'rat':'老鼠🐀' };
let spinIdx = 0;
function spinWheel() {
  spinIdx = (spinIdx + 1) % onsets.length;
  const o = onsets[spinIdx];
  const w = o + 'at';
  document.getElementById('spinOnset').textContent = o;
  document.getElementById('spinResult').textContent = w + ' ' + (meanings[w]||'');
  playTone(800, 0.1);
  setTimeout(() => { playDing(); speak(w); }, 200);
}

/* ================= TRACING ================= */
const traceLetters = ['a', 's', 't', 'p', 'i', 'n', 'ee', 'sh'];
let curTraceIdx = 0;
function initCanvas() {
  const c = document.getElementById('paintCanvas');
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.font = 'bold 110px Fredoka, sans-serif';
  ctx.fillStyle = '#E2E8F0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(traceLetters[curTraceIdx], c.width/2, c.height/2);
}
let painting = false;
const cv = document.getElementById('paintCanvas');
cv.addEventListener('pointerdown', e => { painting = true; drawPoint(e); });
cv.addEventListener('pointermove', e => { if (painting) drawPoint(e); });
window.addEventListener('pointerup', () => painting = false);
function drawPoint(e) {
  const r = cv.getBoundingClientRect();
  const x = (e.clientX - r.left) * (cv.width / r.width);
  const y = (e.clientY - r.top) * (cv.height / r.height);
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#1CB0F6'; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
}
function clearCanvas() { initCanvas(); }
function nextTraceLetter() { curTraceIdx = (curTraceIdx + 1) % traceLetters.length; initCanvas(); speakTraceLetter(); }
function speakTraceLetter() { speak(traceLetters[curTraceIdx]); }

/* ================= QUIZ ================= */
const quizData = [
  { target: 'cat', emoji: '🐱', choices: [['cat','🐱'],['dog','🐶']] },
  { target: 'sun', emoji: '☀️', choices: [['sun','☀️'],['pig','🐷']] },
  { target: 'bed', emoji: '🛏️', choices: [['bed','🛏️'],['cup','🥤']] },
  { target: 'apple', emoji: '🍎', choices: [['apple','🍎'],['fish','🐟']] }
];
let curQ = null;
function newQuiz() {
  curQ = quizData[Math.floor(Math.random() * quizData.length)];
  document.getElementById('quizFb').textContent = '';
  const box = document.getElementById('quizOptions'); box.innerHTML = '';
  curQ.choices.sort(() => 0.5 - Math.random()).forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'btn-3d'; btn.style.background = 'white'; btn.style.border = '2px solid #E2E8F0';
    btn.style.boxShadow = '0 4px 0 #CBD5E1'; btn.style.padding = '18px'; btn.style.borderRadius = '20px';
    btn.style.fontSize = '36px'; btn.style.flexDirection = 'column';
    btn.innerHTML = '<span>' + c[1] + '</span><span style="font-size:16px; font-weight:700; margin-top:6px;">' + c[0] + '</span>';
    btn.onclick = () => {
      if (c[0] === curQ.target) {
        btn.style.background = '#DCFCE7'; btn.style.borderColor = 'var(--green)';
        playDing(); speak(curQ.target);
        document.getElementById('quizFb').textContent = '🎉 太棒啦！完全正确！';
        setTimeout(newQuiz, 1500);
      } else {
        btn.style.background = '#FEE2E2'; btn.style.borderColor = 'var(--rose)';
        playTone(180, 0.25, 'triangle');
        document.getElementById('quizFb').textContent = '再听一遍试试看哦～';
      }
    };
    box.appendChild(btn);
  });
  speak(curQ.target);
}
function playQuizSound() { if (curQ) speak(curQ.target); }

/* ================= VAULT ================= */
const vaultData = [
  { s: '/i:/', g: 'ee, ea', w: 'tree 🌳' }, { s: '/ɪ/', g: 'i, y', w: 'pig 🐷' },
  { s: '/e/', g: 'e, ea', w: 'egg 🥚' }, { s: '/æ/', g: 'a', w: 'apple 🍎' },
  { s: '/ɒ/', g: 'o', w: 'dog 🐶' }, { s: '/ʌ/', g: 'u, o', w: 'cup 🥤' },
  { s: '/s/', g: 's, ss', w: 'sun ☀️' }, { s: '/t/', g: 't', w: 'ten 🔟' },
  { s: '/p/', g: 'p', w: 'pen 🖊️' }, { s: '/k/', g: 'c, k', w: 'cat 🐱' },
  { s: '/ʃ/', g: 'sh', w: 'ship 🚢' }, { s: '/tʃ/', g: 'ch', w: 'chair 🪑' }
];
function initVault() {
  const g = document.getElementById('vaultGrid'); g.innerHTML = '';
  vaultData.forEach(d => {
    const el = document.createElement('div'); el.className = 'letter-card';
    el.innerHTML = '<div class="big">' + d.s + '</div><div style="font-size:12px; color:var(--amber); font-weight:700;">' + d.g + '</div><div style="font-size:13px; font-weight:700; margin-top:4px;">' + d.w + '</div>';
    el.onclick = () => speak(d.w.split(' ')[0]);
    g.appendChild(el);
  });
}
initCanvas();
</script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Magic_Phonics_Kids_Standalone.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
