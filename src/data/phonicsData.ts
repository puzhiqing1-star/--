export interface PhonemeInfo {
  id: string;
  letter: string;
  ipa: string;
  name: string;
  category: 'vowel' | 'consonant' | 'digraph';
  stage: number; // 1: SATPIN, 2: CKEHRMD, 3: GOULFB, 4: Digraphs, 5: Advanced
  stageName: string;
  anchorWord: string;
  anchorEmoji: string;
  mouthTip: string;
  mouthType: 'big-mouth' | 'smile' | 'teeth' | 'lip-bite' | 'snake' | 'round';
  audioWord: string;
  audioPhoneme: string;
  strokeGuide: string; // stroke description
  sampleWords: Array<{ word: string; emoji: string; highlight: string }>;
}

export interface WordFamily {
  id: string;
  rime: string; // e.g., 'at'
  vowel: string;
  name: string;
  emoji: string;
  words: Array<{
    onset: string;
    word: string;
    emoji: string;
    meaning: string;
  }>;
}

export interface BlendingWord {
  id: string;
  word: string;
  emoji: string;
  letters: string[];
  phonemes: string[]; // for speech
  ipas: string[];
  stage: number;
}

// Stage 1: S - A - T - P - I - N (The most famous Phonics starter group in Jolly Phonics)
// Followed by Stage 2: C - K - E - H - R - M - D
// Followed by Stage 3: G - O - U - L - F - B
// Stage 4: Digraphs: SH - CH - TH - EE - OO - AI
export const PHONIC_LEVELS = [
  { id: 1, name: 'Level 1: S-A-T-P-I-N 启蒙基础', desc: '自然拼读第一组黄金音素，学会即可拼读十几个单词！', color: 'from-amber-400 to-orange-500' },
  { id: 2, name: 'Level 2: C-K-E-H-R-M-D 进阶发音', desc: '短元音 e 与爆破音，拓展拼读词汇量', color: 'from-emerald-400 to-green-600' },
  { id: 3, name: 'Level 3: G-O-U-L-F-B 活力探索', desc: '短元音 o/u 与流音，丰富句法与生活词汇', color: 'from-sky-400 to-blue-600' },
  { id: 4, name: 'Level 4: 字母组合 Digraphs', desc: 'sh, ch, th, ee 常见双字母发音秘密', color: 'from-purple-400 to-indigo-600' },
  { id: 5, name: 'Level 5: 48 国际音标全景宝典', desc: '专业级音标与自然拼读对应查询，家长与进阶自查', color: 'from-pink-400 to-rose-600' }
];

export const PHONEMES_DATA: PhonemeInfo[] = [
  // Level 1: S A T P I N
  {
    id: 's',
    letter: 's',
    ipa: '/s/',
    name: '小蛇咝咝音',
    category: 'consonant',
    stage: 1,
    stageName: 'S-A-T-P-I-N',
    anchorWord: 'sun',
    anchorEmoji: '☀️',
    mouthTip: '上下牙齿咬合，舌尖放牙后，气流呼出咝咝叫！',
    mouthType: 'snake',
    audioWord: 'sun',
    audioPhoneme: 's',
    strokeGuide: '从右上向左弯，顺势向下向右再向左，像一条小蛇',
    sampleWords: [
      { word: 'sun', emoji: '☀️', highlight: 's' },
      { word: 'sit', emoji: '🪑', highlight: 's' },
      { word: 'six', emoji: '6️⃣', highlight: 's' }
    ]
  },
  {
    id: 'a',
    letter: 'a',
    ipa: '/æ/',
    name: '大嘴苹果音',
    category: 'vowel',
    stage: 1,
    stageName: 'S-A-T-P-I-N',
    anchorWord: 'apple',
    anchorEmoji: '🍎',
    mouthTip: '嘴巴张得最大！能竖着放下三根手指，嘴角向两侧拉开！',
    mouthType: 'big-mouth',
    audioWord: 'apple',
    audioPhoneme: 'a',
    strokeGuide: '先画一个饱满的圆圈，右侧画一条向下的短坚线带小勾',
    sampleWords: [
      { word: 'ant', emoji: '🐜', highlight: 'a' },
      { word: 'cat', emoji: '🐱', highlight: 'a' },
      { word: 'bag', emoji: '🎒', highlight: 'a' }
    ]
  },
  {
    id: 't',
    letter: 't',
    ipa: '/t/',
    name: '小钟滴答音',
    category: 'consonant',
    stage: 1,
    stageName: 'S-A-T-P-I-N',
    anchorWord: 'ten',
    anchorEmoji: '🔟',
    mouthTip: '舌尖轻点上牙龈，像小闹钟 tick-tock 清脆爆破！',
    mouthType: 'teeth',
    audioWord: 'ten',
    audioPhoneme: 't',
    strokeGuide: '从上往下画一条坚线微弯，中间穿过一条短横线',
    sampleWords: [
      { word: 'tap', emoji: '🚰', highlight: 't' },
      { word: 'top', emoji: '🔝', highlight: 't' },
      { word: 'tub', emoji: '🛁', highlight: 't' }
    ]
  },
  {
    id: 'p',
    letter: 'p',
    ipa: '/p/',
    name: '吹蜡烛噗噗音',
    category: 'consonant',
    stage: 1,
    stageName: 'S-A-T-P-I-N',
    anchorWord: 'pen',
    anchorEmoji: '🖊️',
    mouthTip: '双唇紧闭，用力向外噗一声吹灭小蜡烛！',
    mouthType: 'lip-bite',
    audioWord: 'pen',
    audioPhoneme: 'p',
    strokeGuide: '从上往下一条长坚，右上方画一个半圆肚子',
    sampleWords: [
      { word: 'pig', emoji: '🐷', highlight: 'p' },
      { word: 'pot', emoji: '🍯', highlight: 'p' },
      { word: 'pan', emoji: '🍳', highlight: 'p' }
    ]
  },
  {
    id: 'i',
    letter: 'i',
    ipa: '/ɪ/',
    name: '小老鼠吱吱音',
    category: 'vowel',
    stage: 1,
    stageName: 'S-A-T-P-I-N',
    anchorWord: 'ink',
    anchorEmoji: '🖋️',
    mouthTip: '嘴唇微微向两侧放松，短促有力发出 /ɪ/！',
    mouthType: 'smile',
    audioWord: 'ink',
    audioPhoneme: 'i',
    strokeGuide: '从上往下一小坚，头顶上方点一个小雨点圆点',
    sampleWords: [
      { word: 'in', emoji: '📥', highlight: 'i' },
      { word: 'pin', emoji: '🧷', highlight: 'i' },
      { word: 'tin', emoji: '🥫', highlight: 'i' }
    ]
  },
  {
    id: 'n',
    letter: 'n',
    ipa: '/n/',
    name: '小飞机嗡嗡音',
    category: 'consonant',
    stage: 1,
    stageName: 'S-A-T-P-I-N',
    anchorWord: 'net',
    anchorEmoji: '🕸️',
    mouthTip: '舌尖抵住上牙膛，鼻子里发出小飞机轰鸣嗡嗡声！',
    mouthType: 'teeth',
    audioWord: 'net',
    audioPhoneme: 'n',
    strokeGuide: '先画一小竖，紧接着向右上方拱起一个拱门向下',
    sampleWords: [
      { word: 'nut', emoji: '🥜', highlight: 'n' },
      { word: 'nest', emoji: '🪺', highlight: 'n' },
      { word: 'nod', emoji: '🙇', highlight: 'n' }
    ]
  },

  // Level 2: C K E H R M D
  {
    id: 'c',
    letter: 'c',
    ipa: '/k/',
    name: '小猫咳嗽音',
    category: 'consonant',
    stage: 2,
    stageName: 'C-K-E-H-R-M-D',
    anchorWord: 'cat',
    anchorEmoji: '🐱',
    mouthTip: '舌根向上贴住软腭，舌根放开爆破出声！',
    mouthType: 'teeth',
    audioWord: 'cat',
    audioPhoneme: 'k',
    strokeGuide: '右上起笔，向左上方画一个圆弧，落到右下方开口',
    sampleWords: [
      { word: 'cat', emoji: '🐱', highlight: 'c' },
      { word: 'cup', emoji: '🥤', highlight: 'c' },
      { word: 'can', emoji: '🥫', highlight: 'c' }
    ]
  },
  {
    id: 'e',
    letter: 'e',
    ipa: '/e/',
    name: '微笑小嘴蛋',
    category: 'vowel',
    stage: 2,
    stageName: 'C-K-E-H-R-M-D',
    anchorWord: 'egg',
    anchorEmoji: '🥚',
    mouthTip: '两根手指宽！嘴角自然微笑，比大嘴 a 要扁一点！',
    mouthType: 'smile',
    audioWord: 'egg',
    audioPhoneme: 'e',
    strokeGuide: '在中间先画一条水平横线，接着向上绕个半圆再到底部',
    sampleWords: [
      { word: 'bed', emoji: '🛏️', highlight: 'e' },
      { word: 'red', emoji: '🔴', highlight: 'e' },
      { word: 'hen', emoji: '🐔', highlight: 'e' }
    ]
  },
  {
    id: 'h',
    letter: 'h',
    ipa: '/h/',
    name: '大口哈气音',
    category: 'consonant',
    stage: 2,
    stageName: 'C-K-E-H-R-M-D',
    anchorWord: 'hat',
    anchorEmoji: '🎩',
    mouthTip: '冬天手好冷，张大嘴对着手心哈一口热气：呵～！',
    mouthType: 'big-mouth',
    audioWord: 'hat',
    audioPhoneme: 'h',
    strokeGuide: '从上往下一根高高的竖线，再拱出一个小板凳拱门',
    sampleWords: [
      { word: 'hot', emoji: '🔥', highlight: 'h' },
      { word: 'hop', emoji: '🦘', highlight: 'h' },
      { word: 'hug', emoji: '🫂', highlight: 'h' }
    ]
  },
  {
    id: 'm',
    letter: 'm',
    ipa: '/m/',
    name: '美味冰淇淋音',
    category: 'consonant',
    stage: 2,
    stageName: 'C-K-E-H-R-M-D',
    anchorWord: 'milk',
    anchorEmoji: '🥛',
    mouthTip: '吃到了好吃的冰淇淋，闭上双唇：Mmmm~',
    mouthType: 'lip-bite',
    audioWord: 'milk',
    audioPhoneme: 'm',
    strokeGuide: '画一小竖，接着连续拱出两个一样高的小山包',
    sampleWords: [
      { word: 'mat', emoji: '🧘', highlight: 'm' },
      { word: 'man', emoji: '👨', highlight: 'm' },
      { word: 'mud', emoji: '🤎', highlight: 'm' }
    ]
  },
  {
    id: 'd',
    letter: 'd',
    ipa: '/d/',
    name: '小鼓咚咚音',
    category: 'consonant',
    stage: 2,
    stageName: 'C-K-E-H-R-M-D',
    anchorWord: 'dog',
    anchorEmoji: '🐶',
    mouthTip: '舌尖敲击上牙龈，像小木锤敲大鼓咚咚响！',
    mouthType: 'teeth',
    audioWord: 'dog',
    audioPhoneme: 'd',
    strokeGuide: '先画左边圆滚滚的肚子，再画右边从上往下的一根高坚',
    sampleWords: [
      { word: 'duck', emoji: '🦆', highlight: 'd' },
      { word: 'dad', emoji: '👨', highlight: 'd' },
      { word: 'dot', emoji: '⚪', highlight: 'd' }
    ]
  },

  // Level 3: G O U L F B
  {
    id: 'o',
    letter: 'o',
    ipa: '/ɒ/',
    name: '圆圆橙子音',
    category: 'vowel',
    stage: 3,
    stageName: 'G-O-U-L-F-B',
    anchorWord: 'orange',
    anchorEmoji: '🍊',
    mouthTip: '嘴唇张开撮成一个圆圆的小圈圈，短促有节奏！',
    mouthType: 'round',
    audioWord: 'orange',
    audioPhoneme: 'o',
    strokeGuide: '逆时针画一个圆溜溜、圆滚滚的大圆圈',
    sampleWords: [
      { word: 'fox', emoji: '🦊', highlight: 'o' },
      { word: 'box', emoji: '📦', highlight: 'o' },
      { word: 'pot', emoji: '🍯', highlight: 'o' }
    ]
  },
  {
    id: 'u',
    letter: 'u',
    ipa: '/ʌ/',
    name: '小伞撑开音',
    category: 'vowel',
    stage: 3,
    stageName: 'G-O-U-L-F-B',
    anchorWord: 'umbrella',
    anchorEmoji: '☂️',
    mouthTip: '突然下雨啦，向上撑开伞：Up, up, /ʌ/！',
    mouthType: 'big-mouth',
    audioWord: 'umbrella',
    audioPhoneme: 'u',
    strokeGuide: '从上往下画一个U型碗底，再回到右侧拉一小竖',
    sampleWords: [
      { word: 'bus', emoji: '🚌', highlight: 'u' },
      { word: 'cup', emoji: '🥤', highlight: 'u' },
      { word: 'bug', emoji: '🐛', highlight: 'u' }
    ]
  },
  {
    id: 'f',
    letter: 'f',
    ipa: '/f/',
    name: '小兔咬唇音',
    category: 'consonant',
    stage: 3,
    stageName: 'G-O-U-L-F-B',
    anchorWord: 'fish',
    anchorEmoji: '🐟',
    mouthTip: '上牙轻轻咬住下嘴唇，轻轻吹气，就像小兔子！',
    mouthType: 'lip-bite',
    audioWord: 'fish',
    audioPhoneme: 'f',
    strokeGuide: '上面像一根弯弯的小拐杖，中间加一条小横杠',
    sampleWords: [
      { word: 'frog', emoji: '🐸', highlight: 'f' },
      { word: 'fan', emoji: '🪭', highlight: 'f' },
      { word: 'foot', emoji: '🦶', highlight: 'f' }
    ]
  },
  {
    id: 'b',
    letter: 'b',
    ipa: '/b/',
    name: '棒球击球音',
    category: 'consonant',
    stage: 3,
    stageName: 'G-O-U-L-F-B',
    anchorWord: 'ball',
    anchorEmoji: '⚽',
    mouthTip: '双唇紧闭，声带震动爆破：b, b, bat！',
    mouthType: 'lip-bite',
    audioWord: 'ball',
    audioPhoneme: 'b',
    strokeGuide: '先画左边高高的棒球棒坚线，右下再画一个圆圆棒球',
    sampleWords: [
      { word: 'bat', emoji: '🦇', highlight: 'b' },
      { word: 'box', emoji: '📦', highlight: 'b' },
      { word: 'bee', emoji: '🐝', highlight: 'b' }
    ]
  },

  // Level 4: Digraphs
  {
    id: 'sh',
    letter: 'sh',
    ipa: '/ʃ/',
    name: '安静嘘嘘音',
    category: 'digraph',
    stage: 4,
    stageName: '双字母组合',
    anchorWord: 'ship',
    anchorEmoji: '🚢',
    mouthTip: '小宝宝睡着了，手指放嘴边：Shhhh~',
    mouthType: 'round',
    audioWord: 'ship',
    audioPhoneme: 'sh',
    strokeGuide: '先写 s 再写 h，两个好朋友手拉手！',
    sampleWords: [
      { word: 'fish', emoji: '🐟', highlight: 'sh' },
      { word: 'shop', emoji: '🏪', highlight: 'sh' },
      { word: 'shell', emoji: '🐚', highlight: 'sh' }
    ]
  },
  {
    id: 'ch',
    letter: 'ch',
    ipa: '/tʃ/',
    name: '小火车逛吃音',
    category: 'digraph',
    stage: 4,
    stageName: '双字母组合',
    anchorWord: 'chair',
    anchorEmoji: '🪑',
    mouthTip: '双唇撅起，舌尖爆破：Choo-choo 小火车开来啦！',
    mouthType: 'round',
    audioWord: 'chair',
    audioPhoneme: 'ch',
    strokeGuide: '先写 c 再写 h，形影不离',
    sampleWords: [
      { word: 'chin', emoji: '🧔', highlight: 'ch' },
      { word: 'chick', emoji: '🐥', highlight: 'ch' },
      { word: 'lunch', emoji: '🍱', highlight: 'ch' }
    ]
  },
  {
    id: 'ee',
    letter: 'ee',
    ipa: '/i:/',
    name: '开怀大笑长音',
    category: 'digraph',
    stage: 4,
    stageName: '双字母组合',
    anchorWord: 'tree',
    anchorEmoji: '🌳',
    mouthTip: '嘴角尽情向两边咧开，露出白白牙齿笑：Eeeeee！',
    mouthType: 'smile',
    audioWord: 'tree',
    audioPhoneme: 'ee',
    strokeGuide: '写两个 e，小精灵在一起快乐跳舞',
    sampleWords: [
      { word: 'bee', emoji: '🐝', highlight: 'ee' },
      { word: 'feet', emoji: '👣', highlight: 'ee' },
      { word: 'green', emoji: '🟢', highlight: 'ee' }
    ]
  }
];

// CVC Word Families for Interactive Spinner
export const WORD_FAMILIES: WordFamily[] = [
  {
    id: 'at',
    rime: 'at',
    vowel: 'a',
    name: '-at 家族 (大嘴苹果系列)',
    emoji: '🐱',
    words: [
      { onset: 'c', word: 'cat', emoji: '🐱', meaning: '猫咪' },
      { onset: 'b', word: 'bat', emoji: '🦇', meaning: '蝙蝠/球棒' },
      { onset: 'h', word: 'hat', emoji: '🎩', meaning: '帽子' },
      { onset: 'm', word: 'mat', emoji: '🧘', meaning: '垫子' },
      { onset: 'p', word: 'pat', emoji: '🫳', meaning: '轻拍' },
      { onset: 's', word: 'sat', emoji: '🪑', meaning: '坐下' },
      { onset: 'r', word: 'rat', emoji: '🐀', meaning: '老鼠' }
    ]
  },
  {
    id: 'in',
    rime: 'in',
    vowel: 'i',
    name: '-in 家族 (小老鼠系列)',
    emoji: '🧷',
    words: [
      { onset: 'p', word: 'pin', emoji: '🧷', meaning: '大头针' },
      { onset: 't', word: 'tin', emoji: '🥫', meaning: '铁罐头' },
      { onset: 'b', word: 'bin', emoji: '🗑️', meaning: '垃圾桶' },
      { onset: 'w', word: 'win', emoji: '🏆', meaning: '赢得获胜' }
    ]
  },
  {
    id: 'og',
    rime: 'og',
    vowel: 'o',
    name: '-og 家族 (圆圆小橙系列)',
    emoji: '🐶',
    words: [
      { onset: 'd', word: 'dog', emoji: '🐶', meaning: '小狗' },
      { onset: 'f', word: 'fog', emoji: '🌫️', meaning: '大雾' },
      { onset: 'l', word: 'log', emoji: '🪵', meaning: '原木' },
      { onset: 'h', word: 'hog', emoji: '🐗', meaning: '大野猪' }
    ]
  },
  {
    id: 'ug',
    rime: 'ug',
    vowel: 'u',
    name: '-ug 家族 (撑小伞系列)',
    emoji: '🐛',
    words: [
      { onset: 'b', word: 'bug', emoji: '🐛', meaning: '小虫子' },
      { onset: 'h', word: 'hug', emoji: '🫂', meaning: '温暖拥抱' },
      { onset: 'm', word: 'mug', emoji: '☕', meaning: '马克杯' },
      { onset: 'j', word: 'jug', emoji: '🫖', meaning: '大水壶' }
    ]
  },
  {
    id: 'en',
    rime: 'en',
    vowel: 'e',
    name: '-en 家族 (微笑小蛋系列)',
    emoji: '🐔',
    words: [
      { onset: 'p', word: 'pen', emoji: '🖊️', meaning: '钢笔' },
      { onset: 'h', word: 'hen', emoji: '🐔', meaning: '母鸡' },
      { onset: 't', word: 'ten', emoji: '🔟', meaning: '数字十' },
      { onset: 'm', word: 'men', emoji: '👥', meaning: '男人们' }
    ]
  }
];

// Interactive Continuous Blending Tracks (The Sound Car)
export const BLENDING_WORDS: BlendingWord[] = [
  { id: 'cat', word: 'cat', emoji: '🐱', letters: ['c', 'a', 't'], phonemes: ['k', 'a', 't'], ipas: ['/k/', '/æ/', '/t/'], stage: 1 },
  { id: 'sun', word: 'sun', emoji: '☀️', letters: ['s', 'u', 'n'], phonemes: ['s', 'u', 'n'], ipas: ['/s/', '/ʌ/', '/n/'], stage: 1 },
  { id: 'pig', word: 'pig', emoji: '🐷', letters: ['p', 'i', 'g'], phonemes: ['p', 'i', 'g'], ipas: ['/p/', '/ɪ/', '/g/'], stage: 1 },
  { id: 'bed', word: 'bed', emoji: '🛏️', letters: ['b', 'e', 'd'], phonemes: ['b', 'e', 'd'], ipas: ['/b/', '/e/', '/d/'], stage: 2 },
  { id: 'bus', word: 'bus', emoji: '🚌', letters: ['b', 'u', 's'], phonemes: ['b', 'u', 's'], ipas: ['/b/', '/ʌ/', '/s/'], stage: 2 },
  { id: 'hat', word: 'hat', emoji: '🎩', letters: ['h', 'a', 't'], phonemes: ['h', 'a', 't'], ipas: ['/h/', '/æ/', '/t/'], stage: 2 },
  { id: 'dog', word: 'dog', emoji: '🐶', letters: ['d', 'o', 'g'], phonemes: ['d', 'o', 'g'], ipas: ['/d/', '/ɒ/', '/g/'], stage: 3 },
  { id: 'cup', word: 'cup', emoji: '🥤', letters: ['c', 'u', 'p'], phonemes: ['k', 'u', 'p'], ipas: ['/k/', '/ʌ/', '/p/'], stage: 3 },
  { id: 'fish', word: 'fish', emoji: '🐟', letters: ['f', 'i', 'sh'], phonemes: ['f', 'i', 'sh'], ipas: ['/f/', '/ɪ/', '/ʃ/'], stage: 4 },
  { id: 'tree', word: 'tree', emoji: '🌳', letters: ['t', 'r', 'ee'], phonemes: ['t', 'r', 'ee'], ipas: ['/t/', '/r/', '/i:/'], stage: 4 }
];

// Mouth Shape Guides for Tricky Contrasts
export const MOUTH_GUIDES = [
  {
    id: 'ae_vs_e',
    title: '大嘴苹果 /æ/  vs  微笑小蛋 /e/',
    desc: '孩子最容易混淆的两个短元音：看手指测嘴型！',
    pairA: {
      ipa: '/æ/',
      letter: 'a',
      word: 'cat / bat / hat',
      visualTip: '三指宽！大张嘴，下巴用力下压，夸张大笑！',
      emoji: '🍎',
      soundCue: 'apple'
    },
    pairB: {
      ipa: '/e/',
      letter: 'e',
      word: 'bed / red / pen',
      visualTip: '两指宽！嘴角自然往两边拉开，温和自然。',
      emoji: '🥚',
      soundCue: 'egg'
    }
  },
  {
    id: 's_vs_th',
    title: '小蛇咝咝 /s/  vs  吐舌咬唇 /θ/',
    desc: '舌头收进去还是伸出来？',
    pairA: {
      ipa: '/s/',
      letter: 's',
      word: 'sink / see / sat',
      visualTip: '牙齿闭合，舌头乖乖缩在牙齿后面，轻快吹气。',
      emoji: '🐍',
      soundCue: 'sun'
    },
    pairB: {
      ipa: '/θ/',
      letter: 'th',
      word: 'think / three / bath',
      visualTip: '调皮的小舌头偷偷探出上下牙之间，咬住吹气！',
      emoji: '👅',
      soundCue: 'three'
    }
  },
  {
    id: 'i_vs_ee',
    title: '短元音 /ɪ/  vs  长笑音 /i:/',
    desc: '短促老鼠吱吱叫，还是咧嘴长长大笑？',
    pairA: {
      ipa: '/ɪ/',
      letter: 'i',
      word: 'ship / sit / bit',
      visualTip: '嘴巴微松，声音非常干脆利落，像小水滴落地。',
      emoji: '🚢',
      soundCue: 'ship'
    },
    pairB: {
      ipa: '/i:/',
      letter: 'ee, ea',
      word: 'sheep / see / tea',
      visualTip: '嘴角尽情拉长，露出牙齿，声音拖长：Eeeee! 像绵羊叫。',
      emoji: '🐑',
      soundCue: 'sheep'
    }
  }
];

// Complete 48 IPA Reference for Stage 5 (Full Cross Reference)
export interface FullIPARecord {
  sym: string;
  type: 'vowel' | 'consonant';
  subType: string;
  graphemes: string[];
  examples: Array<{ word: string; emoji: string }>;
  oxfordStage: number;
}

export const FULL_48_IPA: FullIPARecord[] = [
  // 20 Vowels
  { sym: '/i:/', type: 'vowel', subType: '长元音', graphemes: ['ee', 'ea', 'e', 'ey'], examples: [{ word: 'tree', emoji: '🌳' }, { word: 'bee', emoji: '🐝' }, { word: 'tea', emoji: '🍵' }], oxfordStage: 4 },
  { sym: '/ɪ/', type: 'vowel', subType: '短元音', graphemes: ['i', 'y'], examples: [{ word: 'pig', emoji: '🐷' }, { word: 'fish', emoji: '🐟' }, { word: 'six', emoji: '6️⃣' }], oxfordStage: 1 },
  { sym: '/e/', type: 'vowel', subType: '短元音', graphemes: ['e', 'ea'], examples: [{ word: 'egg', emoji: '🥚' }, { word: 'bed', emoji: '🛏️' }, { word: 'pen', emoji: '🖊️' }], oxfordStage: 2 },
  { sym: '/æ/', type: 'vowel', subType: '短元音', graphemes: ['a'], examples: [{ word: 'apple', emoji: '🍎' }, { word: 'cat', emoji: '🐱' }, { word: 'ant', emoji: '🐜' }], oxfordStage: 1 },
  { sym: '/ɜ:/', type: 'vowel', subType: '长元音', graphemes: ['er', 'ir', 'ur', 'or'], examples: [{ word: 'bird', emoji: '🐦' }, { word: 'girl', emoji: '👧' }, { word: 'nurse', emoji: '🧑‍⚕️' }], oxfordStage: 4 },
  { sym: '/ə/', type: 'vowel', subType: '短元音(弱读)', graphemes: ['er', 'a', 'o'], examples: [{ word: 'teacher', emoji: '👩‍🏫' }, { word: 'banana', emoji: '🍌' }], oxfordStage: 5 },
  { sym: '/ɔ:/', type: 'vowel', subType: '长元音', graphemes: ['al', 'or', 'aw', 'ore'], examples: [{ word: 'ball', emoji: '⚽' }, { word: 'fork', emoji: '🍴' }, { word: 'door', emoji: '🚪' }], oxfordStage: 4 },
  { sym: '/ɒ/', type: 'vowel', subType: '短元音', graphemes: ['o'], examples: [{ word: 'dog', emoji: '🐶' }, { word: 'hot', emoji: '🔥' }, { word: 'fox', emoji: '🦊' }], oxfordStage: 2 },
  { sym: '/u:/', type: 'vowel', subType: '长元音', graphemes: ['oo', 'ou', 'u'], examples: [{ word: 'moon', emoji: '🌕' }, { word: 'soup', emoji: '🍲' }, { word: 'blue', emoji: '💙' }], oxfordStage: 4 },
  { sym: '/ʊ/', type: 'vowel', subType: '短元音', graphemes: ['oo', 'u'], examples: [{ word: 'book', emoji: '📖' }, { word: 'cook', emoji: '🍳' }, { word: 'foot', emoji: '🦶' }], oxfordStage: 4 },
  { sym: '/ʌ/', type: 'vowel', subType: '短元音', graphemes: ['u', 'o'], examples: [{ word: 'cup', emoji: '🥤' }, { word: 'sun', emoji: '☀️' }, { word: 'bus', emoji: '🚌' }], oxfordStage: 2 },
  { sym: '/ɑ:/', type: 'vowel', subType: '长元音', graphemes: ['ar', 'a'], examples: [{ word: 'car', emoji: '🚗' }, { word: 'star', emoji: '⭐' }, { word: 'arm', emoji: '💪' }], oxfordStage: 4 },
  { sym: '/eɪ/', type: 'vowel', subType: '双元音', graphemes: ['a-e', 'ai', 'ay', 'ea'], examples: [{ word: 'cake', emoji: '🍰' }, { word: 'rain', emoji: '🌧️' }, { word: 'play', emoji: '🎮' }], oxfordStage: 5 },
  { sym: '/aɪ/', type: 'vowel', subType: '双元音', graphemes: ['i-e', 'ie', 'igh', 'y'], examples: [{ word: 'bike', emoji: '🚲' }, { word: 'tie', emoji: '👔' }, { word: 'light', emoji: '💡' }], oxfordStage: 5 },
  { sym: '/ɔɪ/', type: 'vowel', subType: '双元音', graphemes: ['oi', 'oy'], examples: [{ word: 'coin', emoji: '🪙' }, { word: 'boy', emoji: '👦' }, { word: 'toy', emoji: '🧸' }], oxfordStage: 5 },
  { sym: '/aʊ/', type: 'vowel', subType: '双元音', graphemes: ['ou', 'ow'], examples: [{ word: 'house', emoji: '🏠' }, { word: 'cow', emoji: '🐮' }, { word: 'cloud', emoji: '☁️' }], oxfordStage: 5 },
  { sym: '/əʊ/', type: 'vowel', subType: '双元音', graphemes: ['o-e', 'oa', 'ow', 'oe'], examples: [{ word: 'nose', emoji: '👃' }, { word: 'boat', emoji: '⛵' }, { word: 'snow', emoji: '❄️' }], oxfordStage: 5 },
  { sym: '/ɪə/', type: 'vowel', subType: '双元音', graphemes: ['ear', 'eer'], examples: [{ word: 'ear', emoji: '👂' }, { word: 'deer', emoji: '🦌' }], oxfordStage: 4 },
  { sym: '/eə/', type: 'vowel', subType: '双元音', graphemes: ['air', 'are', 'ear'], examples: [{ word: 'chair', emoji: '🪑' }, { word: 'bear', emoji: '🐻' }], oxfordStage: 4 },
  { sym: '/ʊə/', type: 'vowel', subType: '双元音', graphemes: ['ure', 'our'], examples: [{ word: 'tour', emoji: '🧳' }, { word: 'sure', emoji: '✅' }], oxfordStage: 6 },

  // 28 Consonants
  { sym: '/p/', type: 'consonant', subType: '清爆破音', graphemes: ['p'], examples: [{ word: 'pen', emoji: '🖊️' }, { word: 'pig', emoji: '🐷' }], oxfordStage: 1 },
  { sym: '/b/', type: 'consonant', subType: '浊爆破音', graphemes: ['b'], examples: [{ word: 'bag', emoji: '🎒' }, { word: 'bus', emoji: '🚌' }], oxfordStage: 2 },
  { sym: '/t/', type: 'consonant', subType: '清爆破音', graphemes: ['t'], examples: [{ word: 'ten', emoji: '🔟' }, { word: 'cat', emoji: '🐱' }], oxfordStage: 1 },
  { sym: '/d/', type: 'consonant', subType: '浊爆破音', graphemes: ['d'], examples: [{ word: 'dog', emoji: '🐶' }, { word: 'bed', emoji: '🛏️' }], oxfordStage: 1 },
  { sym: '/k/', type: 'consonant', subType: '清爆破音', graphemes: ['c', 'k', 'ck'], examples: [{ word: 'cat', emoji: '🐱' }, { word: 'kite', emoji: '🪁' }], oxfordStage: 2 },
  { sym: '/g/', type: 'consonant', subType: '浊爆破音', graphemes: ['g'], examples: [{ word: 'goat', emoji: '🐐' }, { word: 'egg', emoji: '🥚' }], oxfordStage: 2 },
  { sym: '/f/', type: 'consonant', subType: '清摩擦音', graphemes: ['f', 'ff', 'ph'], examples: [{ word: 'fish', emoji: '🐟' }, { word: 'fox', emoji: '🦊' }], oxfordStage: 2 },
  { sym: '/v/', type: 'consonant', subType: '浊摩擦音', graphemes: ['v'], examples: [{ word: 'van', emoji: '🚐' }, { word: 'vest', emoji: '🦺' }], oxfordStage: 3 },
  { sym: '/θ/', type: 'consonant', subType: '清齿擦音', graphemes: ['th'], examples: [{ word: 'think', emoji: '🤔' }, { word: 'three', emoji: '3️⃣' }], oxfordStage: 3 },
  { sym: '/ð/', type: 'consonant', subType: '浊齿擦音', graphemes: ['th'], examples: [{ word: 'this', emoji: '👉' }, { word: 'mother', emoji: '👩' }], oxfordStage: 3 },
  { sym: '/s/', type: 'consonant', subType: '清齿龈擦音', graphemes: ['s', 'ss'], examples: [{ word: 'sun', emoji: '☀️' }, { word: 'bus', emoji: '🚌' }], oxfordStage: 1 },
  { sym: '/z/', type: 'consonant', subType: '浊齿龈擦音', graphemes: ['z', 'zz', 's'], examples: [{ word: 'zip', emoji: '🤐' }, { word: 'buzz', emoji: '🐝' }], oxfordStage: 3 },
  { sym: '/ʃ/', type: 'consonant', subType: '清后齿龈擦音', graphemes: ['sh'], examples: [{ word: 'ship', emoji: '🚢' }, { word: 'fish', emoji: '🐟' }], oxfordStage: 3 },
  { sym: '/ʒ/', type: 'consonant', subType: '浊后齿龈擦音', graphemes: ['s', 'ge'], examples: [{ word: 'vision', emoji: '👁️' }, { word: 'treasure', emoji: '💎' }], oxfordStage: 6 },
  { sym: '/h/', type: 'consonant', subType: '声门擦音', graphemes: ['h'], examples: [{ word: 'hat', emoji: '🎩' }, { word: 'hen', emoji: '🐔' }], oxfordStage: 2 },
  { sym: '/m/', type: 'consonant', subType: '双唇鼻音', graphemes: ['m'], examples: [{ word: 'man', emoji: '👨' }, { word: 'milk', emoji: '🥛' }], oxfordStage: 1 },
  { sym: '/n/', type: 'consonant', subType: '齿龈鼻音', graphemes: ['n'], examples: [{ word: 'net', emoji: '🕸️' }, { word: 'nut', emoji: '🥜' }], oxfordStage: 1 },
  { sym: '/ŋ/', type: 'consonant', subType: '软腭鼻音', graphemes: ['ng'], examples: [{ word: 'sing', emoji: '🎤' }, { word: 'ring', emoji: '💍' }], oxfordStage: 3 },
  { sym: '/l/', type: 'consonant', subType: '边音', graphemes: ['l', 'll'], examples: [{ word: 'leg', emoji: '🦵' }, { word: 'ball', emoji: '⚽' }], oxfordStage: 2 },
  { sym: '/r/', type: 'consonant', subType: '卷舌音', graphemes: ['r'], examples: [{ word: 'red', emoji: '🔴' }, { word: 'frog', emoji: '🐸' }], oxfordStage: 2 },
  { sym: '/w/', type: 'consonant', subType: '半元音', graphemes: ['w', 'wh'], examples: [{ word: 'water', emoji: '💧' }, { word: 'window', emoji: '🪟' }], oxfordStage: 3 },
  { sym: '/j/', type: 'consonant', subType: '半元音', graphemes: ['y'], examples: [{ word: 'yes', emoji: '✅' }, { word: 'yellow', emoji: '🟡' }], oxfordStage: 3 },
  { sym: '/tʃ/', type: 'consonant', subType: '清破擦音', graphemes: ['ch', 'tch'], examples: [{ word: 'chair', emoji: '🪑' }, { word: 'watch', emoji: '⌚' }], oxfordStage: 3 },
  { sym: '/dʒ/', type: 'consonant', subType: '浊破擦音', graphemes: ['j', 'ge', 'dge'], examples: [{ word: 'jam', emoji: '🍓' }, { word: 'bridge', emoji: '🌉' }], oxfordStage: 3 },
  { sym: '/tr/', type: 'consonant', subType: '辅音连缀', graphemes: ['tr'], examples: [{ word: 'tree', emoji: '🌳' }, { word: 'train', emoji: '🚂' }], oxfordStage: 3 },
  { sym: '/dr/', type: 'consonant', subType: '辅音连缀', graphemes: ['dr'], examples: [{ word: 'drum', emoji: '🥁' }, { word: 'drink', emoji: '🥤' }], oxfordStage: 3 },
  { sym: '/ts/', type: 'consonant', subType: '破擦音', graphemes: ['ts'], examples: [{ word: 'cats', emoji: '🐱' }, { word: 'hats', emoji: '🎩' }], oxfordStage: 6 },
  { sym: '/dz/', type: 'consonant', subType: '破擦音', graphemes: ['dz', 'ds'], examples: [{ word: 'beds', emoji: '🛏️' }, { word: 'cards', emoji: '🃏' }], oxfordStage: 6 }
];
