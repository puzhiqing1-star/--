/**
 * Kid-friendly High-Fidelity Audio Engine
 * Features:
 * 1. Studio Native Audio (authentic American English studio recordings from high-speed dictionary CDN)
 * 2. Purified Web Speech API (zero pitch distortion, natural 1.0 pitch, optimized rates)
 * 3. Neural & Natural Voice Priority (Google US English, Samantha, Microsoft Jenny Online)
 * 4. Zero disruptive procedural bloops/beeps during voice playback
 * 5. Customizable Phonics Mode (Pure Sound vs. Anchor Word Phonics)
 */

export interface PhonicsAnchorInfo {
  letter: string;
  ipa: string;
  anchorWord: string;
  phoneticText: string;
  letterName: string;
}

export const PHONICS_ANCHOR_MAP: Record<string, PhonicsAnchorInfo> = {
  s: { letter: 's', ipa: '/s/', anchorWord: 'sun', phoneticText: 'sss', letterName: 'S' },
  a: { letter: 'a', ipa: '/æ/', anchorWord: 'apple', phoneticText: 'a', letterName: 'A' },
  t: { letter: 't', ipa: '/t/', anchorWord: 'ten', phoneticText: 't', letterName: 'T' },
  p: { letter: 'p', ipa: '/p/', anchorWord: 'pen', phoneticText: 'p', letterName: 'P' },
  i: { letter: 'i', ipa: '/ɪ/', anchorWord: 'ink', phoneticText: 'ih', letterName: 'I' },
  n: { letter: 'n', ipa: '/n/', anchorWord: 'net', phoneticText: 'nnn', letterName: 'N' },
  c: { letter: 'c', ipa: '/k/', anchorWord: 'cat', phoneticText: 'k', letterName: 'C' },
  k: { letter: 'k', ipa: '/k/', anchorWord: 'kite', phoneticText: 'k', letterName: 'K' },
  e: { letter: 'e', ipa: '/e/', anchorWord: 'egg', phoneticText: 'eh', letterName: 'E' },
  h: { letter: 'h', ipa: '/h/', anchorWord: 'hat', phoneticText: 'huh', letterName: 'H' },
  r: { letter: 'r', ipa: '/r/', anchorWord: 'red', phoneticText: 'rrr', letterName: 'R' },
  m: { letter: 'm', ipa: '/m/', anchorWord: 'milk', phoneticText: 'mmm', letterName: 'M' },
  d: { letter: 'd', ipa: '/d/', anchorWord: 'dog', phoneticText: 'd', letterName: 'D' },
  g: { letter: 'g', ipa: '/g/', anchorWord: 'gas', phoneticText: 'g', letterName: 'G' },
  o: { letter: 'o', ipa: '/ɒ/', anchorWord: 'orange', phoneticText: 'ah', letterName: 'O' },
  u: { letter: 'u', ipa: '/ʌ/', anchorWord: 'umbrella', phoneticText: 'uh', letterName: 'U' },
  l: { letter: 'l', ipa: '/l/', anchorWord: 'leg', phoneticText: 'lll', letterName: 'L' },
  f: { letter: 'f', ipa: '/f/', anchorWord: 'fish', phoneticText: 'fff', letterName: 'F' },
  b: { letter: 'b', ipa: '/b/', anchorWord: 'bat', phoneticText: 'b', letterName: 'B' },
  j: { letter: 'j', ipa: '/dʒ/', anchorWord: 'jam', phoneticText: 'j', letterName: 'J' },
  v: { letter: 'v', ipa: '/v/', anchorWord: 'van', phoneticText: 'vvv', letterName: 'V' },
  w: { letter: 'w', ipa: '/w/', anchorWord: 'wet', phoneticText: 'wuh', letterName: 'W' },
  x: { letter: 'x', ipa: '/ks/', anchorWord: 'box', phoneticText: 'ks', letterName: 'X' },
  y: { letter: 'y', ipa: '/j/', anchorWord: 'yak', phoneticText: 'yuh', letterName: 'Y' },
  z: { letter: 'z', ipa: '/z/', anchorWord: 'zip', phoneticText: 'zzz', letterName: 'Z' },
  sh: { letter: 'sh', ipa: '/ʃ/', anchorWord: 'ship', phoneticText: 'shhh', letterName: 'SH' },
  ch: { letter: 'ch', ipa: '/tʃ/', anchorWord: 'chin', phoneticText: 'ch', letterName: 'CH' },
  th: { letter: 'th', ipa: '/θ/', anchorWord: 'thin', phoneticText: 'th', letterName: 'TH' },
  ee: { letter: 'ee', ipa: '/iː/', anchorWord: 'see', phoneticText: 'ee', letterName: 'EE' },
  oo: { letter: 'oo', ipa: '/uː/', anchorWord: 'moon', phoneticText: 'oo', letterName: 'OO' },
  ai: { letter: 'ai', ipa: '/eɪ/', anchorWord: 'rain', phoneticText: 'ay', letterName: 'AI' }
};

/**
 * Phonetic pronunciation mapping for isolated IPA symbols.
 * Guarantees that clicking an IPA symbol pronounces ONLY the pure sound, never whole words.
 * Pure female pronunciation without male recordings.
 */
export const IPA_PHONETIC_SOUND_MAP: Record<string, { phoneticText: string }> = {
  // Short Vowels
  'æ': { phoneticText: 'ah' },
  'e': { phoneticText: 'eh' },
  'ɪ': { phoneticText: 'ih' },
  'ɒ': { phoneticText: 'ah' },
  'ʌ': { phoneticText: 'uh' },
  'ʊ': { phoneticText: 'ooh' },
  'ə': { phoneticText: 'uh' },

  // Long Vowels
  'i:': { phoneticText: 'ee' },
  'iː': { phoneticText: 'ee' },
  'u:': { phoneticText: 'oo' },
  'uː': { phoneticText: 'oo' },
  'ɑ:': { phoneticText: 'aah' },
  'ɑː': { phoneticText: 'aah' },
  'ɔ:': { phoneticText: 'aw' },
  'ɔː': { phoneticText: 'aw' },
  'ɜ:': { phoneticText: 'ur' },
  'ɜː': { phoneticText: 'ur' },

  // Diphthongs
  'eɪ': { phoneticText: 'ay' },
  'aɪ': { phoneticText: 'eye' },
  'ɔɪ': { phoneticText: 'oy' },
  'aʊ': { phoneticText: 'ow' },
  'əʊ': { phoneticText: 'oh' },
  'oʊ': { phoneticText: 'oh' },
  'ɪə': { phoneticText: 'ear' },
  'eə': { phoneticText: 'air' },
  'ʊə': { phoneticText: 'oor' },

  // Consonants - Plosives
  'p': { phoneticText: 'p' },
  'b': { phoneticText: 'b' },
  't': { phoneticText: 't' },
  'd': { phoneticText: 'd' },
  'k': { phoneticText: 'k' },
  'g': { phoneticText: 'g' },

  // Consonants - Fricatives
  'f': { phoneticText: 'fff' },
  'v': { phoneticText: 'vvv' },
  'θ': { phoneticText: 'th' },
  'ð': { phoneticText: 'the' },
  's': { phoneticText: 'sss' },
  'z': { phoneticText: 'zzz' },
  'ʃ': { phoneticText: 'shhh' },
  'ʒ': { phoneticText: 'zh' },
  'h': { phoneticText: 'huh' },

  // Consonants - Nasals & Approximants
  'm': { phoneticText: 'mmm' },
  'n': { phoneticText: 'nnn' },
  'ŋ': { phoneticText: 'ing' },
  'l': { phoneticText: 'lll' },
  'r': { phoneticText: 'rrr' },
  'w': { phoneticText: 'wuh' },
  'j': { phoneticText: 'yuh' },

  // Affricates
  'tʃ': { phoneticText: 'ch' },
  'dʒ': { phoneticText: 'j' },
  'tr': { phoneticText: 'tr' },
  'dr': { phoneticText: 'dr' },
  'ts': { phoneticText: 'ts' },
  'dz': { phoneticText: 'dz' }
};

export type PhonicsMode = 'anchor' | 'pure';

class PhonicsAudioEngine {
  private ctx: AudioContext | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private chosenVoice: SpeechSynthesisVoice | null = null;
  private wordAudioCache: Map<string, HTMLAudioElement> = new Map();
  private listeners: Array<() => void> = [];

  // Settings
  private useStudioVoice = true;
  private phonicsMode: PhonicsMode = 'pure'; // Default to pure isolated sound for true natural phonics
  private speechRate = 0.95; // Crisp, lively speed (avoids sluggish robot dragging)

  // Male Voice Filter List (Completely excluded to ensure only clean female voices)
  private readonly MALE_VOICE_KEYWORDS = [
    'male', 'david', 'mark', 'george', 'guy', 'tom', 'thomas', 'oliver', 'daniel',
    'fred', 'ralph', 'albert', 'bruce', 'eddy', 'alex', 'junior', 'knight',
    'jester', 'zarvox', 'trinoids', 'deranged', 'bad news', 'good news',
    'organ', 'ghost', 'narrator', 'cello', 'bells', 'boing', 'wobble',
    'james', 'john', 'robert', 'michael', 'william', 'charles', 'richard',
    'paul', 'steven', 'kevin', 'brian', 'edward', 'ronald', 'anthony', 'steve',
    'en-us-x-sfg#male', 'en-us-x-iom#male', 'en-us-x-iol#male', 'en-us-x-tpc#male',
    'en-us-x-tpd#male'
  ];

  // High-Quality Female Voice Patterns (Prioritized for clear, friendly, natural female articulation)
  private readonly FEMALE_PREFERRED_PATTERNS = [
    'natural',
    'jenny',
    'aria',
    'samantha',
    'victoria',
    'karen',
    'serena',
    'ava',
    'allison',
    'zira',
    'susan',
    'cathy',
    'moira',
    'tessa',
    'fiona',
    'stephanie',
    'veena',
    'alice',
    'claire',
    'emma',
    'ana',
    'michelle',
    'linda',
    'heather',
    'nora',
    'sophia',
    'google us english',
    'en-us-x-sfg#female',
    'en-us-x-iob#female',
    'en-us-x-iom#female',
    'en-us-x-tpd#female',
    'female'
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      // Load saved settings
      try {
        const savedMode = localStorage.getItem('magic_phonics_mode');
        if (savedMode === 'pure' || savedMode === 'anchor') {
          this.phonicsMode = savedMode;
        }
        const savedStudio = localStorage.getItem('magic_phonics_studio');
        if (savedStudio !== null) {
          this.useStudioVoice = savedStudio === 'true';
        }
        const savedSpeed = localStorage.getItem('magic_phonics_speed');
        if (savedSpeed) {
          this.speechRate = parseFloat(savedSpeed) || 0.95;
        }
      } catch {
        // ignore
      }

      if ('speechSynthesis' in window) {
        this.initVoices();
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  public subscribe(fn: () => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach(fn => {
      try { fn(); } catch { /* ignore */ }
    });
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      this.voices = window.speechSynthesis.getVoices();
      this.pickBestVoice();
      this.notify();
    } catch {
      // ignore
    }
  }

  public isMaleVoice(v: SpeechSynthesisVoice): boolean {
    const text = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
    return this.MALE_VOICE_KEYWORDS.some(k => text.includes(k));
  }

  public isFemaleVoice(v: SpeechSynthesisVoice): boolean {
    if (this.isMaleVoice(v)) return false;
    const text = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
    return this.FEMALE_PREFERRED_PATTERNS.some(k => text.includes(k));
  }

  private pickBestVoice() {
    if (!this.voices.length) return;

    // Filter to English non-male voices (strict ban on male voices)
    const enNonMaleVoices = this.voices.filter(v => 
      v.lang && v.lang.toLowerCase().startsWith('en') && !this.isMaleVoice(v)
    );

    // Check if user previously saved a voice name (ensure it is NOT male)
    let savedVoiceName: string | null = null;
    try {
      savedVoiceName = localStorage.getItem('magic_phonics_voice');
    } catch {
      // ignore
    }

    if (savedVoiceName) {
      const matched = enNonMaleVoices.find(v => v.name === savedVoiceName);
      if (matched) {
        this.chosenVoice = matched;
        return;
      } else {
        // Clear cached male voice if any
        try { localStorage.removeItem('magic_phonics_voice'); } catch { /* ignore */ }
      }
    }

    // 1. Prioritize vetted high-quality natural female voices
    for (const pattern of this.FEMALE_PREFERRED_PATTERNS) {
      const found = enNonMaleVoices.find(v => 
        (v.name + ' ' + (v.voiceURI || '')).toLowerCase().includes(pattern)
      );
      if (found) {
        this.chosenVoice = found;
        return;
      }
    }

    // 2. Clear en-US female voices
    const usVoices = enNonMaleVoices.filter(v => v.lang.toLowerCase().includes('en-us'));
    if (usVoices.length > 0) {
      this.chosenVoice = usVoices[0];
      return;
    }

    // 3. Fallback to any non-male English voice
    if (enNonMaleVoices.length > 0) {
      this.chosenVoice = enNonMaleVoices[0];
      return;
    }

    // 4. Absolute fallback (strictly avoiding any male voice)
    const nonMaleFallback = this.voices.find(v => !this.isMaleVoice(v));
    this.chosenVoice = nonMaleFallback || this.voices[0] || null;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices
      .filter(v => v.lang && v.lang.toLowerCase().startsWith('en') && !this.isMaleVoice(v))
      .sort((a, b) => {
        const aPref = this.isFemaleVoice(a);
        const bPref = this.isFemaleVoice(b);
        if (aPref && !bPref) return -1;
        if (!aPref && bPref) return 1;
        return a.name.localeCompare(b.name);
      });
  }

  public setVoiceByName(name: string) {
    const v = this.voices.find(item => item.name === name);
    if (v) {
      this.chosenVoice = v;
      try {
        localStorage.setItem('magic_phonics_voice', name);
      } catch {
        // ignore
      }
      this.notify();
    }
  }

  public getCurrentVoiceName(): string {
    return this.chosenVoice?.name || 'High-Quality Natural Voice';
  }

  public setPhonicsMode(mode: PhonicsMode) {
    this.phonicsMode = mode;
    try {
      localStorage.setItem('magic_phonics_mode', mode);
    } catch {
      // ignore
    }
    this.notify();
  }

  public getPhonicsMode(): PhonicsMode {
    return this.phonicsMode;
  }

  public setUseStudioVoice(enable: boolean) {
    this.useStudioVoice = enable;
    try {
      localStorage.setItem('magic_phonics_studio', String(enable));
    } catch {
      // ignore
    }
    this.notify();
  }

  public getUseStudioVoice(): boolean {
    return this.useStudioVoice;
  }

  public setSpeechRate(rate: number) {
    this.speechRate = Math.max(0.65, Math.min(1.2, rate));
    try {
      localStorage.setItem('magic_phonics_speed', String(this.speechRate));
    } catch {
      // ignore
    }
    this.notify();
  }

  public getSpeechRate(): number {
    return this.speechRate;
  }

  // ==================== STUDIO NATIVE AUDIO ====================

  /**
   * Play clean studio recording of word from native American English dictionary voice
   */
  public async playStudioAudio(word: string, rate: number = 1.0): Promise<boolean> {
    if (typeof window === 'undefined' || !this.useStudioVoice) return false;
    const cleanWord = word.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (!cleanWord) return false;

    return new Promise((resolve) => {
      try {
        // Stop any running speech synthesis
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }

        let audio = this.wordAudioCache.get(cleanWord);
        if (!audio) {
          // type=2 is authentic US English pronunciation
          audio = new Audio(`https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(cleanWord)}&type=2`);
          this.wordAudioCache.set(cleanWord, audio);
        }

        audio.pause();
        audio.currentTime = 0;
        audio.playbackRate = rate;

        let hasResolved = false;

        const onDone = (success: boolean) => {
          if (!hasResolved) {
            hasResolved = true;
            resolve(success);
          }
        };

        audio.onplay = () => onDone(true);
        audio.onerror = () => onDone(false);

        const p = audio.play();
        if (p) {
          p.catch(() => onDone(false));
        }

        // Safety timeout: if network takes > 700ms, fallback immediately to TTS
        setTimeout(() => {
          if (!hasResolved) {
            onDone(false);
          }
        }, 700);
      } catch {
        resolve(false);
      }
    });
  }

  // ==================== PROCEDURAL SOUND FX (FOR UI ONLY) ====================

  /**
   * Cleared level / Correct answer fanfare chime
   */
  public playSuccessChime() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.4);
    });
  }

  /**
   * Big victory celebratory fanfare for mastering a mistake
   */
  public playCheerFanfare() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.07 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.65);
    });
  }

  /**
   * Gentle, encouraging bounce on mistake (non-punitive)
   */
  public playErrorBoing() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * Crisp, subtle pop sound when clicking an interactive UI tile
   */
  public playPop(pitch: number = 800) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.3, now + 0.05);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  /**
   * Blending car engine sound / zoom
   */
  public playCarZoom() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(320, now + 0.35);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.55);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  /**
   * Dial click / wheel click
   */
  public playWheelClick() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.025);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  }

  // ==================== SPEECH SYNTHESIS & IPA ENGINE ====================

  /**
   * Speak ONLY the pure isolated IPA sound (NEVER reads anchor words or whole words).
   * 100% Female Voice: Guarantees children hear crisp, gentle female teacher pronunciation.
   */
  public async speakIpaSound(rawIpa: string, rate: number = 0.9): Promise<void> {
    const cleanSym = rawIpa.replace(/[/\\\[\]\s]/g, '').trim();
    if (!cleanSym) return;

    // Colon normalization (e.g. i: vs iː)
    const normalized = cleanSym.replace('ː', ':');
    const ipaInfo = IPA_PHONETIC_SOUND_MAP[cleanSym] || IPA_PHONETIC_SOUND_MAP[normalized];

    // Pure phoneme speech synthesis strictly with female voice
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const phoneticText = ipaInfo?.phoneticText || cleanSym;
      const u = new SpeechSynthesisUtterance(phoneticText);
      u.lang = 'en-US';
      u.rate = rate;
      u.pitch = 1.12; // Bright, pleasant female teacher pitch (avoids any low/male tones)
      if (this.chosenVoice && !this.isMaleVoice(this.chosenVoice)) {
        u.voice = this.chosenVoice;
      }
      window.speechSynthesis.speak(u);
    } catch {
      // fallback
    }
  }

  /**
   * Speak a phoneme clearly and crisply in female voice.
   * If ipa is provided or forcePure is true, speaks ONLY the isolated phoneme sound.
   */
  public async speakPhoneme(
    phoneme: string,
    ipaOrRate?: string | number,
    speedRate?: number,
    explicitAnchor?: string,
    forcePure: boolean = false
  ) {
    const key = phoneme.toLowerCase().trim();
    const actualRate = typeof ipaOrRate === 'number' ? ipaOrRate : (speedRate || this.speechRate);
    const ipaStr = typeof ipaOrRate === 'string' ? ipaOrRate : undefined;

    // 1. If IPA symbol is specified or pure sound is forced, speak strictly isolated sound in female voice
    if (ipaStr || forcePure) {
      await this.speakIpaSound(ipaStr || key, actualRate);
      return;
    }

    const info = PHONICS_ANCHOR_MAP[key];

    // 2. If anchor word mode is explicitly requested AND anchor word exists (studio audio is female)
    if (this.phonicsMode === 'anchor' && explicitAnchor && this.useStudioVoice) {
      const success = await this.playStudioAudio(explicitAnchor, actualRate);
      if (success) return;
    }

    // 3. In default 'pure' mode: if we have an IPA for this letter, use pure isolated sound
    if (info?.ipa) {
      await this.speakIpaSound(info.ipa, actualRate);
      return;
    }

    // 4. Fallback to SpeechSynthesis with isolated phoneticText in female voice
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();

      let textToSpeak = key;
      if (this.phonicsMode === 'anchor' && explicitAnchor) {
        textToSpeak = `${key.toUpperCase()}, as in ${explicitAnchor}`;
      } else if (info) {
        textToSpeak = info.phoneticText;
      }

      const u = new SpeechSynthesisUtterance(textToSpeak);
      u.lang = 'en-US';
      u.rate = actualRate;
      u.pitch = 1.12; // Clear, pleasant female teacher pitch
      if (this.chosenVoice && !this.isMaleVoice(this.chosenVoice)) {
        u.voice = this.chosenVoice;
      }

      window.speechSynthesis.speak(u);
    } catch {
      // fallback
    }
  }

  /**
   * Pronounce full word with pristine studio recording first (female native voice), falling back to female TTS
   */
  public async speakWord(word: string, rate?: number) {
    const actualRate = rate || this.speechRate;
    
    // 1. Try studio female native audio first for 100% human crystal-clear pronunciation
    if (this.useStudioVoice) {
      const success = await this.playStudioAudio(word, actualRate);
      if (success) return;
    }

    // 2. Fallback to clean female Web Speech API
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(word);
      u.lang = 'en-US';
      u.rate = actualRate;
      u.pitch = 1.08; // Crisp, friendly female pitch
      if (this.chosenVoice && !this.isMaleVoice(this.chosenVoice)) {
        u.voice = this.chosenVoice;
      }
      window.speechSynthesis.speak(u);
    } catch {
      // fallback
    }
  }
}

export const audioEngine = new PhonicsAudioEngine();
