/**
 * Magic Phonics Kids - Progress Tracker & Smart Diagnostic Engine
 * Tracks child's mastery across:
 * 1. Letter Sounds & Shapes (字母发音与形状)
 * 2. Continuous Blending (自然拼读与连读)
 * 3. Word Spelling (基础单词拼写)
 * Identifies strengths & weaknesses, and computes personalized recommendations.
 */

export interface PhonemeRecord {
  letter: string;
  ipa: string;
  practiced: number;
  correct: number;
  incorrect: number;
  lastPracticed: number;
}

export interface SpellingRecord {
  word: string;
  emoji: string;
  practiced: number;
  correct: number;
  incorrect: number;
}

export interface ActivityLogItem {
  id: string;
  type: 'game_match' | 'game_spelling' | 'blending' | 'challenge' | 'tracing' | 'mistake_vault';
  title: string;
  details: string;
  result: 'perfect' | 'good' | 'retry';
  score: number;
  timestamp: number;
}

export interface MistakeItem {
  id: string; // e.g. 'p_a' or 'w_bed'
  type: 'phoneme' | 'word';
  key: string; // e.g. 'a' or 'bed'
  display: string; // e.g. 'A /æ/' or 'BED'
  ipa?: string;
  emoji: string;
  meaning?: string;
  errorCount: number;
  correctCount: number;
  correctStreakInReview: number; // 2 in a row = conquered / mastered
  lastErrorTime: number;
  source: '听音辨图' | '字母对对碰' | '单词气球填空';
  tip: string; // child-friendly mouth shape mnemonic
  status: 'needs_practice' | 'reviewing' | 'mastered';
}

export interface UserProgressProfile {
  totalStars: number;
  streakDays: number;
  currentStage: number; // 1 to 5
  phonemes: Record<string, PhonemeRecord>;
  spelling: Record<string, SpellingRecord>;
  mistakes: Record<string, MistakeItem>;
  blendingCount: number;
  tracingCount: number;
  activityHistory: ActivityLogItem[];
  lastActiveDate: string;
}

export interface DiagnosisResult {
  overallScore: number; // 0 - 100
  letterSoundMastery: number; // 0 - 100
  blendingMastery: number; // 0 - 100
  spellingMastery: number; // 0 - 100
  strengths: Array<{ name: string; tag: string; desc: string; icon: string }>;
  weaknesses: Array<{
    id: string;
    name: string;
    tag: string;
    desc: string;
    accuracy: number;
    recommendedTab: 'mouth' | 'games' | 'blending' | 'tracing';
    recommendedSubAction?: string;
  }>;
  nextRecommendedUnit: {
    stage: number;
    title: string;
    reason: string;
    targetTab: string;
    badge: string;
  };
  todayCapsule: Array<{
    id: string;
    title: string;
    desc: string;
    targetTab: string;
    completed: boolean;
    rewardStars: number;
  }>;
}

const STORAGE_KEY = 'magic_phonics_user_profile_v2';

export const PHONEME_TIPS_MAP: Record<string, { ipa: string; emoji: string; tip: string; meaning: string }> = {
  s: { ipa: '/s/', emoji: '🐍', tip: '小蛇咝咝音：上下牙齿咬合，舌尖放牙后，气流呼出咝咝叫！', meaning: '小蛇' },
  a: { ipa: '/æ/', emoji: '🍎', tip: '大嘴苹果音：嘴巴张得最大（约三指宽），嘴角向两侧拉开，发短促音，避免念成 /e/！', meaning: '小苹果' },
  t: { ipa: '/t/', emoji: '🔟', tip: '小钟滴答音：舌尖轻点上牙龈，像小闹钟 tick-tock 清脆爆破！', meaning: '数字十' },
  p: { ipa: '/p/', emoji: '🐼', tip: '双唇轻闭爆破：两唇闭合后突然张开，送出一小股清脆气流！', meaning: '大熊猫' },
  i: { ipa: '/ɪ/', emoji: '🦎', tip: '微笑短元音：下巴微垂，舌前部稍抬，发短促轻快的 /ɪ/！', meaning: '变色龙' },
  n: { ipa: '/n/', emoji: '🪺', tip: '鼻音嗡嗡音：舌尖紧贴上牙龈，气流从鼻腔出，手指按鼻翼感受震动！', meaning: '鸟巢' },
  c: { ipa: '/k/', emoji: '🐱', tip: '小猫哈欠音：舌根抬起抵软腭突然放开，像小猫打喷嚏一样爆破！', meaning: '小猫' },
  k: { ipa: '/k/', emoji: '🪁', tip: '风筝爆破音：同 c 音，舌后部爆破送气！', meaning: '风筝' },
  e: { ipa: '/e/', emoji: '🥚', tip: '微笑鸡蛋音：嘴巴张开约两指（比 a 的三指小），嘴角微扬，舌尖抵下齿！', meaning: '鸡蛋' },
  h: { ipa: '/h/', emoji: '🎩', tip: '哈气音：嘴巴张开轻柔呼出气流，就像冬天天冷向手心呵气！', meaning: '帽子' },
  r: { ipa: '/r/', emoji: '🚀', tip: '小火箭卷舌音：舌尖向上卷起但不碰到口腔顶部，嘴唇稍圆！', meaning: '火箭' },
  m: { ipa: '/m/', emoji: '🐒', tip: '美味闭唇音：双唇自然闭合，鼻腔哼鸣，就像闻到香喷喷的美食！', meaning: '猴子' },
  d: { ipa: '/d/', emoji: '🐶', tip: '小鼓咚咚音：舌尖顶住上牙龈震动声带，像小鼓在敲咚咚咚！', meaning: '小狗' },
  g: { ipa: '/g/', emoji: '👧', tip: '舌根浊辅音：舌后部抵住软腭，声带震动爆破！', meaning: '女孩' },
  o: { ipa: '/ɒ/', emoji: '🐙', tip: '圆嘴章鱼音：嘴唇收圆稍张开，舌头后缩，发短促 /ɒ/！', meaning: '章鱼' },
  u: { ipa: '/ʌ/', emoji: '☂️', tip: '短伞撑开音：嘴巴半张，舌头自然平放，短促有力的 /ʌ/！', meaning: '雨伞' },
  l: { ipa: '/l/', emoji: '🦁', tip: '舌尖顶齿音：舌尖紧紧顶在门牙后方牙龈上，气流从舌头两侧流出！', meaning: '狮子' },
  f: { ipa: '/f/', emoji: '🐟', tip: '上齿咬下唇：上门牙轻轻咬住下嘴唇内侧，吹出清脆摩擦气流！', meaning: '小鱼' },
  b: { ipa: '/b/', emoji: '🐻', tip: '双唇浊爆破音：两唇紧闭后爆破，声带震动，注意肚子向右的 b！', meaning: '小熊' },
};

export const WORD_TIPS_MAP: Record<string, { emoji: string; tip: string; meaning: string }> = {
  cat: { emoji: '🐱', meaning: '小猫', tip: '由爆破音 c /k/ + 梅花大嘴 a /æ/ + 滴答音 t /t/ 组成，张大嘴发音！' },
  sun: { emoji: '☀️', meaning: '太阳', tip: '由小蛇音 s /s/ + 短音 u /ʌ/ + 鼻音 n /n/ 组成，发音短促有力！' },
  pig: { emoji: '🐷', meaning: '小猪', tip: '双唇音 p /p/ + 短音 i /ɪ/ + 浊爆破音 g /g/，中间短元音莫拖长！' },
  bed: { emoji: '🛏️', meaning: '小床', tip: '首字母 b 肚子向右，中间是微笑短音 e /e/，尾字母 d 肚子向左！' },
  hat: { emoji: '🎩', meaning: '帽子', tip: '哈气音 h /h/ + 大嘴苹果音 a /æ/ + 清脆音 t /t/，注意区分 hit 或 hot！' },
  cup: { emoji: '🥤', meaning: '水杯', tip: '爆破音 c /k/ + 短元音 u /ʌ/ + 双唇音 p /p/，拼读干净利落！' },
  pen: { emoji: '🖊️', meaning: '钢笔', tip: '双唇音 p /p/ + 微笑短元音 e /e/ + 鼻音 n /n/，注意区分 pan 和 pen！' },
  dog: { emoji: '🐶', meaning: '小狗', tip: '小鼓音 d /d/ + 圆嘴短音 o /ɒ/ + 浊爆破音 g /g/！' },
  fox: { emoji: '🦊', meaning: '狐狸', tip: '咬唇音 f /f/ + 圆嘴短音 o /ɒ/ + 双音素 x /ks/！' },
  bus: { emoji: '🚌', meaning: '巴士', tip: '双唇音 b /b/ + 短元音 u /ʌ/ + 小蛇音 s /s/，小心区分 d 与 b！' },
  bag: { emoji: '🎒', meaning: '书包', tip: '首字母 b + 大嘴苹果音 a /æ/ + 浊音 g /g/，嘴巴向下张大！' },
  fish: { emoji: '🐟', meaning: '小鱼', tip: '咬唇音 f /f/ + 短音 i /ɪ/ + 嘘嘘音 sh /ʃ/，注意轻声嘘！' },
};

class ProgressTrackerService {
  private profile: UserProgressProfile;
  private listeners: Array<() => void> = [];

  constructor() {
    this.profile = this.loadFromStorage();
  }

  private loadFromStorage(): UserProgressProfile {
    if (typeof window === 'undefined') return this.getDefaultProfile();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...this.getDefaultProfile(),
          ...parsed,
          mistakes: parsed.mistakes || this.getDefaultProfile().mistakes,
        };
      }
    } catch {
      // fallback
    }
    return this.getDefaultProfile();
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
      this.notifyListeners();
    } catch {
      // ignore
    }
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l());
  }

  public getDefaultProfile(): UserProgressProfile {
    const defaultPhonemes: Record<string, PhonemeRecord> = {
      s: { letter: 's', ipa: '/s/', practiced: 5, correct: 5, incorrect: 0, lastPracticed: Date.now() - 3600000 },
      a: { letter: 'a', ipa: '/æ/', practiced: 4, correct: 2, incorrect: 2, lastPracticed: Date.now() - 7200000 },
      t: { letter: 't', ipa: '/t/', practiced: 4, correct: 4, incorrect: 0, lastPracticed: Date.now() - 3600000 },
      p: { letter: 'p', ipa: '/p/', practiced: 3, correct: 3, incorrect: 0, lastPracticed: Date.now() - 10800000 },
      i: { letter: 'i', ipa: '/ɪ/', practiced: 3, correct: 2, incorrect: 1, lastPracticed: Date.now() - 14400000 },
      n: { letter: 'n', ipa: '/n/', practiced: 3, correct: 3, incorrect: 0, lastPracticed: Date.now() - 18000000 },
      e: { letter: 'e', ipa: '/e/', practiced: 2, correct: 1, incorrect: 1, lastPracticed: Date.now() - 21600000 },
      c: { letter: 'c', ipa: '/k/', practiced: 2, correct: 2, incorrect: 0, lastPracticed: Date.now() - 25200000 },
    };

    const defaultSpelling: Record<string, SpellingRecord> = {
      cat: { word: 'cat', emoji: '🐱', practiced: 3, correct: 2, incorrect: 1 },
      sun: { word: 'sun', emoji: '☀️', practiced: 3, correct: 3, incorrect: 0 },
      pig: { word: 'pig', emoji: '🐷', practiced: 2, correct: 2, incorrect: 0 },
      bed: { word: 'bed', emoji: '🛏️', practiced: 2, correct: 1, incorrect: 1 },
    };

    const defaultMistakes: Record<string, MistakeItem> = {
      p_a: {
        id: 'p_a',
        type: 'phoneme',
        key: 'a',
        display: 'A /æ/',
        ipa: '/æ/',
        emoji: '🍎',
        meaning: '小苹果',
        errorCount: 2,
        correctCount: 2,
        correctStreakInReview: 0,
        lastErrorTime: Date.now() - 7200000,
        source: '字母对对碰',
        tip: '大嘴咬苹果：嘴巴向下张大（约三指宽），发短促高亢的 /æ/，注意区别于微笑音 /e/！',
        status: 'needs_practice',
      },
      p_e: {
        id: 'p_e',
        type: 'phoneme',
        key: 'e',
        display: 'E /e/',
        ipa: '/e/',
        emoji: '🥚',
        meaning: '鸡蛋',
        errorCount: 2,
        correctCount: 1,
        correctStreakInReview: 0,
        lastErrorTime: Date.now() - 3600000,
        source: '听音辨图',
        tip: '微笑小嘴：嘴角向两边微展（约两指宽），舌尖抵下齿，清脆读出短音 /e/！',
        status: 'needs_practice',
      },
      w_bed: {
        id: 'w_bed',
        type: 'word',
        key: 'bed',
        display: 'BED',
        emoji: '🛏️',
        meaning: '小床',
        errorCount: 2,
        correctCount: 1,
        correctStreakInReview: 0,
        lastErrorTime: Date.now() - 5400000,
        source: '单词气球填空',
        tip: '核心元音是短元音 /e/ 微笑小嘴（避免拼成 bad 😾）；首字母 b 肚皮向右，尾字母 d 肚皮向左！',
        status: 'needs_practice',
      },
      w_cat: {
        id: 'w_cat',
        type: 'word',
        key: 'cat',
        display: 'CAT',
        emoji: '🐱',
        meaning: '小猫',
        errorCount: 1,
        correctCount: 3,
        correctStreakInReview: 2,
        lastErrorTime: Date.now() - 86400000,
        source: '单词气球填空',
        tip: '中间元音是梅花大嘴 a /æ/，首字母 c 发爆破音 /k/，尾字母 t 发清脆滴答音 /t/！',
        status: 'mastered',
      },
    };

    return {
      totalStars: 42,
      streakDays: 3,
      currentStage: 1,
      phonemes: defaultPhonemes,
      spelling: defaultSpelling,
      mistakes: defaultMistakes,
      blendingCount: 8,
      tracingCount: 6,
      activityHistory: [
        {
          id: 'log-1',
          type: 'game_match',
          title: '字母发音对对碰',
          details: '成功配对 S, A, T 字母与对应图案',
          result: 'perfect',
          score: 15,
          timestamp: Date.now() - 1800000,
        },
        {
          id: 'log-2',
          type: 'game_spelling',
          title: '单词气球填空',
          details: '完成 cat, sun, bed 拼写挑战',
          result: 'good',
          score: 20,
          timestamp: Date.now() - 7200000,
        },
      ],
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
  }

  public getProfile(): UserProgressProfile {
    return this.profile;
  }

  /**
   * Record a letter/sound practice event (e.g. from Matching Game, Tracing, or Quiz)
   */
  public recordPhonemeResult(letter: string, ipa: string, isCorrect: boolean, source: string = '游戏互动') {
    const key = letter.toLowerCase();
    const existing = this.profile.phonemes[key] || {
      letter: key,
      ipa: ipa || `/${key}/`,
      practiced: 0,
      correct: 0,
      incorrect: 0,
      lastPracticed: Date.now(),
    };

    existing.practiced += 1;
    if (isCorrect) {
      existing.correct += 1;
      this.profile.totalStars += 2;
      const mKey = 'p_' + key;
      if (this.profile.mistakes[mKey]) {
        this.profile.mistakes[mKey].correctCount += 1;
      }
    } else {
      existing.incorrect += 1;
      // Auto-collect into Mistake Vault
      const mKey = 'p_' + key;
      const tipData = PHONEME_TIPS_MAP[key];
      const existingMistake = this.profile.mistakes[mKey];
      if (existingMistake) {
        existingMistake.errorCount += 1;
        existingMistake.correctStreakInReview = 0;
        existingMistake.lastErrorTime = Date.now();
        existingMistake.source = source as any;
        existingMistake.status = 'needs_practice';
      } else {
        this.profile.mistakes[mKey] = {
          id: mKey,
          type: 'phoneme',
          key: key,
          display: `${letter.toUpperCase()} ${ipa || tipData?.ipa || `/${key}/`}`,
          ipa: ipa || tipData?.ipa || `/${key}/`,
          emoji: tipData?.emoji || '🔤',
          meaning: tipData?.meaning || `${letter.toUpperCase()} 字母音`,
          errorCount: 1,
          correctCount: 0,
          correctStreakInReview: 0,
          lastErrorTime: Date.now(),
          source: source as any,
          tip: tipData?.tip || `发音口型要领：注意字母 ${letter.toUpperCase()} 的标准口型与气流呼出配合！`,
          status: 'needs_practice',
        };
      }
    }
    existing.lastPracticed = Date.now();
    this.profile.phonemes[key] = existing;

    // Add activity log
    this.addLog({
      id: 'log-' + Date.now() + Math.random().toString(36).substr(2, 4),
      type: 'game_match',
      title: `${source} · 字母 ${letter.toUpperCase()}`,
      details: isCorrect ? `精准识别 ${letter} ${ipa} 发音与形状` : `在 ${letter} 发音形状辨析中遇到一点挑战，已收录至错题宝库`,
      result: isCorrect ? 'perfect' : 'retry',
      score: isCorrect ? 5 : 1,
      timestamp: Date.now(),
    });

    this.saveToStorage();
  }

  /**
   * Record a word spelling event (e.g. from Word Spelling Game)
   */
  public recordSpellingResult(word: string, emoji: string, isCorrect: boolean) {
    const key = word.toLowerCase();
    const existing = this.profile.spelling[key] || {
      word: key,
      emoji: emoji || '📝',
      practiced: 0,
      correct: 0,
      incorrect: 0,
    };

    existing.practiced += 1;
    if (isCorrect) {
      existing.correct += 1;
      this.profile.totalStars += 3;
      const mKey = 'w_' + key;
      if (this.profile.mistakes[mKey]) {
        this.profile.mistakes[mKey].correctCount += 1;
      }
    } else {
      existing.incorrect += 1;
      // Auto-collect into Mistake Vault
      const mKey = 'w_' + key;
      const tipData = WORD_TIPS_MAP[key];
      const existingMistake = this.profile.mistakes[mKey];
      if (existingMistake) {
        existingMistake.errorCount += 1;
        existingMistake.correctStreakInReview = 0;
        existingMistake.lastErrorTime = Date.now();
        existingMistake.source = '单词气球填空';
        existingMistake.status = 'needs_practice';
      } else {
        this.profile.mistakes[mKey] = {
          id: mKey,
          type: 'word',
          key: key,
          display: key.toUpperCase(),
          emoji: emoji || tipData?.emoji || '📝',
          meaning: tipData?.meaning || key,
          errorCount: 1,
          correctCount: 0,
          correctStreakInReview: 0,
          lastErrorTime: Date.now(),
          source: '单词气球填空',
          tip: tipData?.tip || `自然拼读发音要领：仔细拼读 ${key.toUpperCase()} 的每一个音素并快速连读！`,
          status: 'needs_practice',
        };
      }
    }
    this.profile.spelling[key] = existing;

    this.addLog({
      id: 'log-' + Date.now() + Math.random().toString(36).substr(2, 4),
      type: 'game_spelling',
      title: `单词拼写 · ${word.toUpperCase()} ${emoji}`,
      details: isCorrect ? `成功拼写出标准 CVC 单词 ${word}` : `拼写 ${word} 时尝试调整中，已收录至错题宝库`,
      result: isCorrect ? 'perfect' : 'retry',
      score: isCorrect ? 10 : 2,
      timestamp: Date.now(),
    });

    this.saveToStorage();
  }

  /**
   * Record listening challenge result (听音辨图)
   */
  public recordListeningResult(word: string, emoji: string, phonemeLetter: string, isCorrect: boolean) {
    const pKey = phonemeLetter ? phonemeLetter.toLowerCase() : '';
    const wKey = word ? word.toLowerCase() : '';

    if (pKey) {
      const tipData = PHONEME_TIPS_MAP[pKey];
      this.recordPhonemeResult(pKey, tipData?.ipa || `/${pKey}/`, isCorrect, '听音辨图');
    }

    if (wKey) {
      const tipData = WORD_TIPS_MAP[wKey];
      const existing = this.profile.spelling[wKey] || {
        word: wKey,
        emoji: emoji || tipData?.emoji || '🎧',
        practiced: 0,
        correct: 0,
        incorrect: 0,
      };
      existing.practiced += 1;
      if (isCorrect) {
        existing.correct += 1;
      } else {
        existing.incorrect += 1;
        const mKey = 'w_' + wKey;
        const existingMistake = this.profile.mistakes[mKey];
        if (existingMistake) {
          existingMistake.errorCount += 1;
          existingMistake.correctStreakInReview = 0;
          existingMistake.lastErrorTime = Date.now();
          existingMistake.source = '听音辨图';
          existingMistake.status = 'needs_practice';
        } else {
          this.profile.mistakes[mKey] = {
            id: mKey,
            type: 'word',
            key: wKey,
            display: wKey.toUpperCase(),
            emoji: emoji || tipData?.emoji || '🎧',
            meaning: tipData?.meaning || wKey,
            errorCount: 1,
            correctCount: 0,
            correctStreakInReview: 0,
            lastErrorTime: Date.now(),
            source: '听音辨图',
            tip: tipData?.tip || `多听纯正发音，注意 ${wKey} 首字母与元音音素辨析！`,
            status: 'needs_practice',
          };
        }
      }
      this.profile.spelling[wKey] = existing;
    }

    this.saveToStorage();
  }

  /**
   * Record practice inside Mistake Vault (专项复习练习)
   * If correct 2 times in a row, marks as mastered and gives bonus stars
   */
  public recordReviewResult(id: string, isCorrect: boolean): { conquered: boolean; streak: number } {
    const item = this.profile.mistakes[id];
    if (!item) return { conquered: false, streak: 0 };

    if (isCorrect) {
      item.correctCount += 1;
      item.correctStreakInReview += 1;
      this.profile.totalStars += 3;

      if (item.correctStreakInReview >= 2) {
        item.status = 'mastered';
        this.profile.totalStars += 10; // Bonus for conquering mistake
        this.addLog({
          id: 'log-vault-' + Date.now(),
          type: 'mistake_vault',
          title: `错题攻克大胜利 · ${item.display}`,
          details: `连续 2 次精准辨析，彻底攻克薄弱盲区！获得 10 颗金星奖赏 ⭐`,
          result: 'perfect',
          score: 15,
          timestamp: Date.now(),
        });
        this.saveToStorage();
        return { conquered: true, streak: item.correctStreakInReview };
      } else {
        item.status = 'reviewing';
        this.saveToStorage();
        return { conquered: false, streak: item.correctStreakInReview };
      }
    } else {
      item.errorCount += 1;
      item.correctStreakInReview = 0;
      item.status = 'needs_practice';
      item.lastErrorTime = Date.now();
      this.saveToStorage();
      return { conquered: false, streak: 0 };
    }
  }

  public getMistakes(): MistakeItem[] {
    return Object.values(this.profile.mistakes || {}).sort((a, b) => b.lastErrorTime - a.lastErrorTime);
  }

  public removeMistake(id: string) {
    if (this.profile.mistakes && this.profile.mistakes[id]) {
      delete this.profile.mistakes[id];
      this.saveToStorage();
    }
  }

  public clearMasteredMistakes() {
    if (!this.profile.mistakes) return;
    Object.keys(this.profile.mistakes).forEach((key) => {
      if (this.profile.mistakes[key].status === 'mastered') {
        delete this.profile.mistakes[key];
      }
    });
    this.saveToStorage();
  }

  /**
   * Record blending car or spinner practice
   */
  public recordBlendingPractice(word: string) {
    this.profile.blendingCount += 1;
    this.profile.totalStars += 2;
    this.addLog({
      id: 'log-' + Date.now(),
      type: 'blending',
      title: `音轨拼读 · ${word.toUpperCase()}`,
      details: `小车平滑滑过音素，完成 ${word} 连读发音`,
      result: 'perfect',
      score: 5,
      timestamp: Date.now(),
    });
    this.saveToStorage();
  }

  private addLog(item: ActivityLogItem) {
    this.profile.activityHistory.unshift(item);
    if (this.profile.activityHistory.length > 20) {
      this.profile.activityHistory = this.profile.activityHistory.slice(0, 20);
    }
  }

  /**
   * Compute Diagnostic metrics, Strengths, Weaknesses, and Recommendations
   */
  public getDiagnosis(): DiagnosisResult {
    const p = this.profile;

    // 1. Calculate Letter Sound Mastery
    let totalPhonemePractice = 0;
    let totalPhonemeCorrect = 0;
    const phonemeList = Object.values(p.phonemes);
    phonemeList.forEach((item) => {
      totalPhonemePractice += item.practiced;
      totalPhonemeCorrect += item.correct;
    });
    const letterSoundMastery =
      totalPhonemePractice > 0
        ? Math.round((totalPhonemeCorrect / totalPhonemePractice) * 100)
        : 70;

    // 2. Calculate Spelling Mastery
    let totalSpellingPractice = 0;
    let totalSpellingCorrect = 0;
    const spellingList = Object.values(p.spelling);
    spellingList.forEach((item) => {
      totalSpellingPractice += item.practiced;
      totalSpellingCorrect += item.correct;
    });
    const spellingMastery =
      totalSpellingPractice > 0
        ? Math.round((totalSpellingCorrect / totalSpellingPractice) * 100)
        : 65;

    // 3. Calculate Blending Mastery
    const blendingMastery = Math.min(100, Math.round(p.blendingCount * 10 + 40));

    // Overall Score
    const overallScore = Math.round(
      letterSoundMastery * 0.4 + blendingMastery * 0.3 + spellingMastery * 0.3
    );

    // Strengths
    const strengths: Array<{ name: string; tag: string; desc: string; icon: string }> = [];
    phonemeList
      .filter((item) => item.practiced >= 2 && item.correct / item.practiced >= 0.8)
      .slice(0, 3)
      .forEach((item) => {
        strengths.push({
          name: `字母 ${item.letter.toUpperCase()} (${item.ipa})`,
          tag: '熟练掌握',
          desc: `发音辨析准确率达 ${Math.round((item.correct / item.practiced) * 100)}%`,
          icon: '✨',
        });
      });

    if (p.blendingCount >= 5) {
      strengths.push({
        name: '音轨连读感悟',
        tag: '拼读能力',
        desc: `已完成 ${p.blendingCount} 次拼读小车滑动，音素无缝混合感知极佳`,
        icon: '🚗',
      });
    }

    if (strengths.length === 0) {
      strengths.push({
        name: '拼读求知欲',
        tag: '初探萌芽',
        desc: '积极探索发音小车与字母卡片，认知敏锐度持续提升',
        icon: '🌱',
      });
    }

    // Weaknesses Identification (accuracy < 70% or errors > 0)
    const weaknesses: DiagnosisResult['weaknesses'] = [];

    // Check specific confusion: 'a' vs 'e'
    const aItem = p.phonemes['a'];
    const eItem = p.phonemes['e'];
    if ((aItem && aItem.incorrect > 0) || (eItem && eItem.incorrect > 0)) {
      weaknesses.push({
        id: 'weak-ae',
        name: '/æ/ 与 /e/ 大嘴/微笑混淆',
        tag: '易混元音',
        desc: '在苹果音 /æ/ 与鸡蛋音 /e/ 辨析中有失误，开口度三指与两指需要口型巩固',
        accuracy: Math.round(((aItem?.correct || 1) / Math.max(1, (aItem?.practiced || 2))) * 100),
        recommendedTab: 'mouth',
        recommendedSubAction: 'ae',
      });
    }

    // Check individual low scoring phonemes
    phonemeList
      .filter((item) => item.practiced >= 2 && item.correct / item.practiced < 0.75)
      .forEach((item) => {
        if (item.letter !== 'a' && item.letter !== 'e') {
          weaknesses.push({
            id: `weak-${item.letter}`,
            name: `字母 ${item.letter.toUpperCase()} (${item.ipa}) 发音形状`,
            tag: '发音待巩固',
            desc: `练习 ${item.practiced} 次中准确率为 ${Math.round((item.correct / item.practiced) * 100)}%，建议多听多练`,
            accuracy: Math.round((item.correct / item.practiced) * 100),
            recommendedTab: 'games',
            recommendedSubAction: 'matching',
          });
        }
      });

    // Check spelling errors
    spellingList
      .filter((s) => s.incorrect > 0)
      .slice(0, 1)
      .forEach((s) => {
        weaknesses.push({
          id: `weak-spelling-${s.word}`,
          name: `单词 ${s.word.toUpperCase()} 拼写`,
          tag: '词汇拼写',
          desc: `拼写 ${s.word} ${s.emoji} 时字母顺序或元音填充有挑战`,
          accuracy: Math.round((s.correct / s.practiced) * 100),
          recommendedTab: 'games',
          recommendedSubAction: 'spelling',
        });
      });

    // Default friendly fallback if no weaknesses
    if (weaknesses.length === 0) {
      weaknesses.push({
        id: 'weak-none',
        name: '短元音 /e/ 发音微调',
        tag: '精细化进阶',
        desc: '表现极佳！建议持续保持微笑小嘴口型练习，体验更自然的母语韵律',
        accuracy: 85,
        recommendedTab: 'mouth',
      });
    }

    // Next Recommended Unit
    let nextRecommendedUnit: DiagnosisResult['nextRecommendedUnit'];
    if (letterSoundMastery >= 80 && p.blendingCount >= 6) {
      nextRecommendedUnit = {
        stage: 2,
        title: 'Level 2: C-K-E-H-R-M-D 进阶发音',
        reason: 'S-A-T-P-I-N 第一关已经熟练掌握！现在可以解锁短元音 e、爆破音与更多 CVC 单词！',
        targetTab: 'roadmap',
        badge: '推荐解锁新关',
      };
    } else {
      nextRecommendedUnit = {
        stage: 1,
        title: 'Level 1: S-A-T-P-I-N 稳固强化',
        reason: '巩固前 6 个核心音素并配合音轨小车滑读，确保每一个发音听得清、读得准！',
        targetTab: 'blending',
        badge: '核心基石夯实',
      };
    }

    // Today's 5-minute capsule
    const todayCapsule = [
      {
        id: 'cap-1',
        title: '🎮 玩 1 局字母形状对对碰',
        desc: '配对 4 组字母与图案，巩固字母发音与视觉轮廓记忆',
        targetTab: 'games',
        completed: totalPhonemePractice >= 3,
        rewardStars: 5,
      },
      {
        id: 'cap-2',
        title: '🚗 拼读小车开动 2 次',
        desc: '用小车滑过 C-A-T / S-U-N 跑道，体会音素连读合成',
        targetTab: 'blending',
        completed: p.blendingCount >= 2,
        rewardStars: 5,
      },
      {
        id: 'cap-3',
        title: '📝 挑战 1 次气球单词填空',
        desc: '完成 1 个基础 CVC 单词拼写救助',
        targetTab: 'games',
        completed: totalSpellingPractice >= 1,
        rewardStars: 10,
      },
    ];

    return {
      overallScore,
      letterSoundMastery,
      blendingMastery,
      spellingMastery,
      strengths,
      weaknesses,
      nextRecommendedUnit,
      todayCapsule,
    };
  }

  /**
   * Inject rich mock progress for demo/parent testing
   */
  public injectDemoProgress() {
    this.profile = {
      totalStars: 68,
      streakDays: 4,
      currentStage: 1,
      phonemes: {
        s: { letter: 's', ipa: '/s/', practiced: 8, correct: 8, incorrect: 0, lastPracticed: Date.now() - 3600000 },
        a: { letter: 'a', ipa: '/æ/', practiced: 7, correct: 4, incorrect: 3, lastPracticed: Date.now() - 5400000 }, // Weak: a
        t: { letter: 't', ipa: '/t/', practiced: 6, correct: 6, incorrect: 0, lastPracticed: Date.now() - 7200000 },
        p: { letter: 'p', ipa: '/p/', practiced: 5, correct: 5, incorrect: 0, lastPracticed: Date.now() - 10800000 },
        i: { letter: 'i', ipa: '/ɪ/', practiced: 6, correct: 5, incorrect: 1, lastPracticed: Date.now() - 14400000 },
        n: { letter: 'n', ipa: '/n/', practiced: 5, correct: 5, incorrect: 0, lastPracticed: Date.now() - 18000000 },
        e: { letter: 'e', ipa: '/e/', practiced: 5, correct: 2, incorrect: 3, lastPracticed: Date.now() - 21600000 }, // Weak: e
        c: { letter: 'c', ipa: '/k/', practiced: 4, correct: 4, incorrect: 0, lastPracticed: Date.now() - 25200000 },
      },
      spelling: {
        cat: { word: 'cat', emoji: '🐱', practiced: 4, correct: 4, incorrect: 0 },
        sun: { word: 'sun', emoji: '☀️', practiced: 4, correct: 4, incorrect: 0 },
        bed: { word: 'bed', emoji: '🛏️', practiced: 3, correct: 1, incorrect: 2 }, // Weak: bed
        pig: { word: 'pig', emoji: '🐷', practiced: 3, correct: 3, incorrect: 0 },
        hat: { word: 'hat', emoji: '🎩', practiced: 3, correct: 3, incorrect: 0 },
      },
      mistakes: {
        p_a: {
          id: 'p_a',
          type: 'phoneme',
          key: 'a',
          display: 'A /æ/',
          ipa: '/æ/',
          emoji: '🍎',
          meaning: '小苹果',
          errorCount: 3,
          correctCount: 4,
          correctStreakInReview: 1,
          lastErrorTime: Date.now() - 5400000,
          source: '听音辨图',
          tip: '大嘴咬苹果：嘴巴向下张大（约三指宽），发短促高亢的 /æ/，注意区别于微笑音 /e/！',
          status: 'needs_practice',
        },
        p_e: {
          id: 'p_e',
          type: 'phoneme',
          key: 'e',
          display: 'E /e/',
          ipa: '/e/',
          emoji: '🥚',
          meaning: '鸡蛋',
          errorCount: 3,
          correctCount: 2,
          correctStreakInReview: 0,
          lastErrorTime: Date.now() - 21600000,
          source: '字母对对碰',
          tip: '微笑小嘴：嘴角向两边微展（约两指宽），舌尖抵下齿，清脆读出短音 /e/！',
          status: 'needs_practice',
        },
        w_bed: {
          id: 'w_bed',
          type: 'word',
          key: 'bed',
          display: 'BED',
          emoji: '🛏️',
          meaning: '小床',
          errorCount: 2,
          correctCount: 1,
          correctStreakInReview: 0,
          lastErrorTime: Date.now() - 1200000,
          source: '单词气球填空',
          tip: '核心元音是短元音 /e/ 微笑小嘴（避免拼成 bad 😾）；首字母 b 肚皮向右，尾字母 d 肚皮向左！',
          status: 'needs_practice',
        },
        p_i: {
          id: 'p_i',
          type: 'phoneme',
          key: 'i',
          display: 'I /ɪ/',
          ipa: '/ɪ/',
          emoji: '🦎',
          meaning: '变色龙',
          errorCount: 1,
          correctCount: 5,
          correctStreakInReview: 2,
          lastErrorTime: Date.now() - 14400000,
          source: '字母对对碰',
          tip: '微笑短元音：下巴微垂，舌前部稍抬，发短促轻快的 /ɪ/！',
          status: 'mastered',
        },
      },
      blendingCount: 12,
      tracingCount: 7,
      activityHistory: [
        {
          id: 'log-demo-1',
          type: 'game_spelling',
          title: '气球单词填空 · BED 🛏️',
          details: '元音 e 填充错误，需加强 /e/ 与 /æ/ 区分',
          result: 'retry',
          score: 2,
          timestamp: Date.now() - 1200000,
        },
        {
          id: 'log-demo-2',
          type: 'game_match',
          title: '字母对对碰 · Level 1',
          details: '完美匹配 S, P, T 字母及对应物品卡片',
          result: 'perfect',
          score: 15,
          timestamp: Date.now() - 3600000,
        },
        {
          id: 'log-demo-3',
          type: 'blending',
          title: '音轨连读 · C-A-T 🐱',
          details: '小车平稳滑越 3 个音素，全词连读发音纯正',
          result: 'perfect',
          score: 10,
          timestamp: Date.now() - 7200000,
        },
      ],
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    this.saveToStorage();
  }

  /**
   * Reset user progress to fresh start
   */
  public resetProgress() {
    this.profile = {
      totalStars: 0,
      streakDays: 1,
      currentStage: 1,
      phonemes: {},
      spelling: {},
      mistakes: {},
      blendingCount: 0,
      tracingCount: 0,
      activityHistory: [],
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    this.saveToStorage();
  }
}

export const progressTracker = new ProgressTrackerService();
