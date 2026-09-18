/**
 * Oxford Reading Tree (ORT) Floppy's Phonics & Oxford Phonics World Curriculum Data
 * Aligned with Oxford Reading Tree Sounds & Letters Levels 1+, 2, and 3
 */

export interface OrtPhoneme {
  letter: string;
  ipa: string;
  anchorWord: string;
  anchorEmoji: string;
  tip: string;
}

export interface OrtWord {
  word: string;
  emoji: string;
  phonemes: string[];
  meaning: string;
}

export interface OrtStoryLine {
  text: string;
  translation: string;
  highlightWords: string[];
  emoji: string;
}

export interface OrtQuizItem {
  id: string;
  type: 'listen_letter' | 'fill_word' | 'listen_sentence';
  prompt: string;
  audioTarget: string; // text to speak
  options: Array<{ id: string; text: string; sub?: string; emoji?: string; isCorrect: boolean }>;
}

export interface OrtBookUnit {
  id: string;
  level: number; // 1, 2, 3
  levelLabel: string;
  bookNum: number;
  title: string;
  coverEmoji: string;
  themeColor: string; // tailwind color token
  characterFocus: string; // e.g., 'Floppy & Kipper'
  phonemes: OrtPhoneme[];
  decodableWords: OrtWord[];
  story: {
    title: string;
    description: string;
    lines: OrtStoryLine[];
  };
  quiz: OrtQuizItem[];
}

export const OXFORD_PHONICS_UNITS: OrtBookUnit[] = [
  // ==================== LEVEL 1+ ====================
  {
    id: 'ort-l1-b1',
    level: 1,
    levelLabel: 'Level 1+ 基础入门',
    bookNum: 1,
    title: 'Book 1: At the Park (s, a, t, p)',
    coverEmoji: '🌳',
    themeColor: 'from-amber-400 to-orange-500',
    characterFocus: 'Floppy & Biff',
    phonemes: [
      { letter: 's', ipa: '/s/', anchorWord: 'sun', anchorEmoji: '☀️', tip: '舌尖后缩，像小蛇发出嘶嘶声' },
      { letter: 'a', ipa: '/æ/', anchorWord: 'apple', anchorEmoji: '🍎', tip: '嘴巴张大如三指，短促有力' },
      { letter: 't', ipa: '/t/', anchorWord: 'ten', anchorEmoji: '🔟', tip: '舌尖抵住上齿龈，干脆爆破' },
      { letter: 'p', ipa: '/p/', anchorWord: 'pen', anchorEmoji: '🖊️', tip: '双唇紧闭，爆破喷气，不带声带震动' },
    ],
    decodableWords: [
      { word: 'sat', emoji: '🪑', phonemes: ['s', 'a', 't'], meaning: '坐下 (sit 的过去式)' },
      { word: 'pat', emoji: '🐕', phonemes: ['p', 'a', 't'], meaning: '轻拍 (摸摸小狗)' },
      { word: 'tap', emoji: '🚰', phonemes: ['t', 'a', 'p'], meaning: '水龙头 / 轻敲' },
      { word: 'sap', emoji: '🌲', phonemes: ['s', 'a', 'p'], meaning: '树汁' },
      { word: 'at', emoji: '📍', phonemes: ['a', 't'], meaning: '在...地方' },
    ],
    story: {
      title: 'Floppy at the Park',
      description: '牛津树经典迷你故事：Floppy 和 Biff 在公园玩耍',
      lines: [
        { text: 'A cat sat on a mat.', translation: '一只小猫坐在垫子上。', highlightWords: ['cat', 'sat', 'mat'], emoji: '🐱' },
        { text: 'Biff can pat the cat.', translation: 'Biff 轻拍了拍小猫。', highlightWords: ['pat', 'cat'], emoji: '👧' },
        { text: 'Floppy sat by the tap.', translation: 'Floppy 坐在了水龙头旁边。', highlightWords: ['sat', 'tap'], emoji: '🐶' },
        { text: 'Tap, tap, tap! Water on Floppy!', translation: '滴答滴答！水滴在 Floppy 身上啦！', highlightWords: ['tap'], emoji: '💦' },
      ],
    },
    quiz: [
      {
        id: 'q1',
        type: 'listen_letter',
        prompt: '听一听：请选出听到的牛津树首字母发音',
        audioTarget: 's',
        options: [
          { id: 's', text: 's', sub: '/s/', emoji: '🐍', isCorrect: true },
          { id: 't', text: 't', sub: '/t/', emoji: '🔟', isCorrect: false },
          { id: 'p', text: 'p', sub: '/p/', emoji: '🖊️', isCorrect: false },
        ],
      },
      {
        id: 'q2',
        type: 'fill_word',
        prompt: '看图填词：Floppy ___ on the mat. (小狗坐在垫子上)',
        audioTarget: 'sat',
        options: [
          { id: 'sat', text: 'sat', sub: 's-a-t 坐下', emoji: '🪑', isCorrect: true },
          { id: 'tap', text: 'tap', sub: 't-a-p 轻敲', emoji: '🚰', isCorrect: false },
          { id: 'pat', text: 'pat', sub: 'p-a-t 轻拍', emoji: '🐕', isCorrect: false },
        ],
      },
      {
        id: 'q3',
        type: 'listen_sentence',
        prompt: '听读课文：根据读音选出对应的场景图片',
        audioTarget: 'Floppy sat by the tap.',
        options: [
          { id: 'tap_dog', text: 'Floppy sat by the tap.', emoji: '🚰', isCorrect: true },
          { id: 'cat_mat', text: 'A cat on a mat.', emoji: '🐱', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'ort-l1-b2',
    level: 1,
    levelLabel: 'Level 1+ 基础入门',
    bookNum: 2,
    title: "Book 2: Floppy's Bath (i, n, m, d)",
    coverEmoji: '🛁',
    themeColor: 'from-emerald-400 to-teal-600',
    characterFocus: 'Floppy & Dad',
    phonemes: [
      { letter: 'i', ipa: '/ɪ/', anchorWord: 'ink', anchorEmoji: '🖋️', tip: '短元音 /ɪ/，嘴角自然微开，短促放松' },
      { letter: 'n', ipa: '/n/', anchorWord: 'net', anchorEmoji: '🥅', tip: '舌尖抵上齿龈，气流从鼻腔通过' },
      { letter: 'm', ipa: '/m/', anchorWord: 'milk', anchorEmoji: '🥛', tip: '闭双唇发出鼻音，像吃到美味的食物 mmm' },
      { letter: 'd', ipa: '/d/', anchorWord: 'dog', anchorEmoji: '🐕', tip: '舌尖抵住上牙龈爆破，声带震动' },
    ],
    decodableWords: [
      { word: 'pin', emoji: '📌', phonemes: ['p', 'i', 'n'], meaning: '大头针' },
      { word: 'tin', emoji: '🥫', phonemes: ['t', 'i', 'n'], meaning: '铁罐 / 锡罐' },
      { word: 'man', emoji: '👨', phonemes: ['m', 'a', 'n'], meaning: '男人 / 爸爸' },
      { word: 'dad', emoji: '🧔', phonemes: ['d', 'a', 'd'], meaning: '爸爸 (Dad)' },
      { word: 'sad', emoji: '😢', phonemes: ['s', 'a', 'd'], meaning: '难过 / 伤心' },
    ],
    story: {
      title: "Floppy's Muddy Bath",
      description: '牛津树经典剧情：调皮的 Floppy 在泥坑里打滚',
      lines: [
        { text: 'Dad is a tall man.', translation: '爸爸是一个高大的男人。', highlightWords: ['dad', 'man'], emoji: '🧔' },
        { text: 'Floppy is in the mud! Bad dog!', translation: 'Floppy 跑进了泥巴里！坏小狗！', highlightWords: ['mud', 'dog'], emoji: '🐶' },
        { text: 'Dad had a tin in the pan.', translation: '爸爸在水盆里放了一个罐子。', highlightWords: ['dad', 'tin', 'pan'], emoji: '🥫' },
        { text: 'Floppy had a bath. Not sad!', translation: 'Floppy 洗了个澡，不再难过啦！', highlightWords: ['sad'], emoji: '🛁' },
      ],
    },
    quiz: [
      {
        id: 'q1',
        type: 'listen_letter',
        prompt: '听一听：选出听到的闭唇鼻音',
        audioTarget: 'm',
        options: [
          { id: 'm', text: 'm', sub: '/m/', emoji: '🥛', isCorrect: true },
          { id: 'n', text: 'n', sub: '/n/', emoji: '🥅', isCorrect: false },
          { id: 'd', text: 'd', sub: '/d/', emoji: '🐕', isCorrect: false },
        ],
      },
      {
        id: 'q2',
        type: 'fill_word',
        prompt: '拼读填空：p - i - n 拼成什么单词？',
        audioTarget: 'pin',
        options: [
          { id: 'pin', text: 'pin', sub: '📌 大头针', emoji: '📌', isCorrect: true },
          { id: 'tin', text: 'tin', sub: '🥫 铁罐', emoji: '🥫', isCorrect: false },
          { id: 'pan', text: 'pan', sub: '🍳 平底锅', emoji: '🍳', isCorrect: false },
        ],
      },
      {
        id: 'q3',
        type: 'listen_sentence',
        prompt: '听读课文：选出正确的牛津树插图',
        audioTarget: 'Floppy had a bath.',
        options: [
          { id: 'bath', text: 'Floppy had a bath.', emoji: '🛁', isCorrect: true },
          { id: 'mud', text: 'Floppy in the mud.', emoji: '🐾', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'ort-l1-b3',
    level: 1,
    levelLabel: 'Level 1+ 基础入门',
    bookNum: 3,
    title: 'Book 3: The Pet Dog (g, o, c, k)',
    coverEmoji: '🐕',
    themeColor: 'from-sky-400 to-blue-600',
    characterFocus: 'Kipper & Floppy',
    phonemes: [
      { letter: 'g', ipa: '/g/', anchorWord: 'gas', anchorEmoji: '⛽', tip: '舌根抵软腭，声带震动爆破 /g/' },
      { letter: 'o', ipa: '/ɒ/', anchorWord: 'orange', anchorEmoji: '🍊', tip: '圆唇短元音，下巴自然放松下垂' },
      { letter: 'c', ipa: '/k/', anchorWord: 'cat', anchorEmoji: '🐱', tip: '清辅音无声带震动，干脆利落' },
      { letter: 'k', ipa: '/k/', anchorWord: 'kite', anchorEmoji: '🪁', tip: '与 c 发音一致，舌后部爆破' },
    ],
    decodableWords: [
      { word: 'dog', emoji: '🐕', phonemes: ['d', 'o', 'g'], meaning: '狗 (Floppy 就是 dog)' },
      { word: 'cat', emoji: '🐱', phonemes: ['c', 'a', 't'], meaning: '猫' },
      { word: 'pot', emoji: '🍲', phonemes: ['p', 'o', 't'], meaning: '锅 / 罐子' },
      { word: 'cot', emoji: '🛏️', phonemes: ['c', 'o', 't'], meaning: '小床' },
      { word: 'kid', emoji: '🧒', phonemes: ['k', 'i', 'd'], meaning: '小孩 (Kipper 就是 kid)' },
    ],
    story: {
      title: 'Kipper and the Big Dog',
      description: 'Kipper 和 Floppy 的温馨日常',
      lines: [
        { text: 'Kipper is a little kid.', translation: 'Kipper 是一个小男孩。', highlightWords: ['kid'], emoji: '🧒' },
        { text: 'Floppy is a good pet dog.', translation: 'Floppy 是一只很棒的宠物狗。', highlightWords: ['dog'], emoji: '🐕' },
        { text: 'A cat sat on a red cot.', translation: '一只小猫坐在红色的床铺上。', highlightWords: ['cat', 'cot'], emoji: '🐱' },
        { text: 'Kipper got a big pot for Dad.', translation: 'Kipper 帮爸爸拿来了一个大锅。', highlightWords: ['got', 'pot'], emoji: '🍲' },
      ],
    },
    quiz: [
      {
        id: 'q1',
        type: 'listen_letter',
        prompt: '听音辨字母：选出短元音 /ɒ/ (orange)',
        audioTarget: 'o',
        options: [
          { id: 'o', text: 'o', sub: '/ɒ/', emoji: '🍊', isCorrect: true },
          { id: 'a', text: 'a', sub: '/æ/', emoji: '🍎', isCorrect: false },
          { id: 'i', text: 'i', sub: '/ɪ/', emoji: '🖋️', isCorrect: false },
        ],
      },
      {
        id: 'q2',
        type: 'fill_word',
        prompt: '拼读填空：d - o - g 拼成什么单词？',
        audioTarget: 'dog',
        options: [
          { id: 'dog', text: 'dog', sub: '🐕 小狗', emoji: '🐕', isCorrect: true },
          { id: 'cat', text: 'cat', sub: '🐱 小猫', emoji: '🐱', isCorrect: false },
          { id: 'pot', text: 'pot', sub: '🍲 锅子', emoji: '🍲', isCorrect: false },
        ],
      },
      {
        id: 'q3',
        type: 'listen_sentence',
        prompt: '看图选句：根据画面选择对应句子',
        audioTarget: 'A cat sat on a red cot.',
        options: [
          { id: 'cat_cot', text: 'A cat sat on a red cot.', emoji: '🛏️', isCorrect: true },
          { id: 'big_dog', text: 'Floppy is a pet dog.', emoji: '🐶', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'ort-l1-b4',
    level: 1,
    levelLabel: 'Level 1+ 基础入门',
    bookNum: 4,
    title: 'Book 4: A Quick Duck (ck, e, u, r)',
    coverEmoji: '🦆',
    themeColor: 'from-purple-500 to-indigo-600',
    characterFocus: 'Chip & Floppy',
    phonemes: [
      { letter: 'ck', ipa: '/k/', anchorWord: 'duck', anchorEmoji: '🦆', tip: '双字母组合发单音 /k/，常在词尾' },
      { letter: 'e', ipa: '/e/', anchorWord: 'egg', anchorEmoji: '🥚', tip: '微笑两指宽，发音爽脆干练' },
      { letter: 'u', ipa: '/ʌ/', anchorWord: 'umbrella', anchorEmoji: '☂️', tip: '短促轻哼 /ʌ/，像被轻轻拍了一下肚子' },
      { letter: 'r', ipa: '/r/', anchorWord: 'red', anchorEmoji: '🔴', tip: '舌尖向上卷起但不触碰口腔上方' },
    ],
    decodableWords: [
      { word: 'duck', emoji: '🦆', phonemes: ['d', 'u', 'ck'], meaning: '鸭子 (quack quack)' },
      { word: 'sock', emoji: '🧦', phonemes: ['s', 'o', 'ck'], meaning: '袜子' },
      { word: 'cup', emoji: '☕', phonemes: ['c', 'u', 'p'], meaning: '杯子' },
      { word: 'red', emoji: '🔴', phonemes: ['r', 'e', 'd'], meaning: '红色' },
      { word: 'run', emoji: '🏃', phonemes: ['r', 'u', 'n'], meaning: '奔跑' },
    ],
    story: {
      title: 'Run, Floppy, Run!',
      description: 'Floppy 在池塘边追小鸭子',
      lines: [
        { text: 'A red duck sat on a rock.', translation: '一只红头鸭坐在岩石上。', highlightWords: ['red', 'duck', 'rock'], emoji: '🦆' },
        { text: 'Chip had a red cup and a sock.', translation: 'Chip 拿着一个红杯子和一只袜子。', highlightWords: ['red', 'cup', 'sock'], emoji: '👦' },
        { text: 'Floppy can run to the duck!', translation: 'Floppy 朝着鸭子跑过去啦！', highlightWords: ['run', 'duck'], emoji: '🐕' },
        { text: 'Quack! The duck is in the pond.', translation: '嘎嘎！鸭子扑通跳进水塘里啦。', highlightWords: ['duck'], emoji: '💦' },
      ],
    },
    quiz: [
      {
        id: 'q1',
        type: 'listen_letter',
        prompt: '听音辨组合：选出词尾常出现的双字母组合 ck',
        audioTarget: 'ck',
        options: [
          { id: 'ck', text: 'ck', sub: '/k/ duck', emoji: '🦆', isCorrect: true },
          { id: 'r', text: 'r', sub: '/r/ red', emoji: '🔴', isCorrect: false },
          { id: 'e', text: 'e', sub: '/e/ egg', emoji: '🥚', isCorrect: false },
        ],
      },
      {
        id: 'q2',
        type: 'fill_word',
        prompt: '拼读填空：d - u - ck 拼成什么单词？',
        audioTarget: 'duck',
        options: [
          { id: 'duck', text: 'duck', sub: '🦆 鸭子', emoji: '🦆', isCorrect: true },
          { id: 'sock', text: 'sock', sub: '🧦 袜子', emoji: '🧦', isCorrect: false },
          { id: 'cup', text: 'cup', sub: '☕ 杯子', emoji: '☕', isCorrect: false },
        ],
      },
      {
        id: 'q3',
        type: 'listen_sentence',
        prompt: '听句子选图：Floppy can run!',
        audioTarget: 'Floppy can run to the duck.',
        options: [
          { id: 'run', text: 'Floppy can run to the duck.', emoji: '🏃', isCorrect: true },
          { id: 'cup', text: 'Chip had a red cup.', emoji: '☕', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'ort-l1-b5',
    level: 1,
    levelLabel: 'Level 1+ 基础入门',
    bookNum: 5,
    title: 'Book 5: The Big Bell (h, b, f, ff)',
    coverEmoji: '🔔',
    themeColor: 'from-rose-500 to-pink-600',
    characterFocus: 'Biff & Mum',
    phonemes: [
      { letter: 'h', ipa: '/h/', anchorWord: 'hat', anchorEmoji: '👒', tip: '轻轻哈出一口气，声带不震动' },
      { letter: 'b', ipa: '/b/', anchorWord: 'bat', anchorEmoji: '🦇', tip: '双唇紧闭，爆破出声，声带震动' },
      { letter: 'f', ipa: '/f/', anchorWord: 'fish', anchorEmoji: '🐟', tip: '上齿轻咬下唇，吹出摩擦气流' },
      { letter: 'ff', ipa: '/f/', anchorWord: 'puff', anchorEmoji: '💨', tip: '双字母 ff 发单音 /f/，通常在词尾' },
    ],
    decodableWords: [
      { word: 'hat', emoji: '👒', phonemes: ['h', 'a', 't'], meaning: '帽子' },
      { word: 'bat', emoji: '🦇', phonemes: ['b', 'a', 't'], meaning: '蝙蝠 / 球棒' },
      { word: 'fan', emoji: '🪭', phonemes: ['f', 'a', 'n'], meaning: '风扇' },
      { word: 'bell', emoji: '🔔', phonemes: ['b', 'e', 'll'], meaning: '铃铛' },
      { word: 'puff', emoji: '💨', phonemes: ['p', 'u', 'ff'], meaning: '吹气 / 喘气' },
    ],
    story: {
      title: 'The Big Bell Rings',
      description: 'Biff 戴着帽子听大钟咚咚响',
      lines: [
        { text: 'Biff had a big sun hat.', translation: 'Biff 戴着一顶大太阳帽。', highlightWords: ['hat'], emoji: '👒' },
        { text: 'A hot bug sat on the bat.', translation: '一只热呼呼的小虫停在球棒上。', highlightWords: ['bug', 'bat'], emoji: '🪲' },
        { text: 'Mum rings the big bell: Ding dong!', translation: '妈妈摇响了大铃铛：叮咚！', highlightWords: ['bell'], emoji: '🔔' },
        { text: 'Puff, puff! Floppy is so fast.', translation: '呼哧呼哧！Floppy 跑得飞快。', highlightWords: ['puff'], emoji: '💨' },
      ],
    },
    quiz: [
      {
        id: 'q1',
        type: 'listen_letter',
        prompt: '听音辨字母：选出咬唇摩擦音 f',
        audioTarget: 'f',
        options: [
          { id: 'f', text: 'f', sub: '/f/', emoji: '🐟', isCorrect: true },
          { id: 'h', text: 'h', sub: '/h/', emoji: '👒', isCorrect: false },
          { id: 'b', text: 'b', sub: '/b/', emoji: '🦇', isCorrect: false },
        ],
      },
      {
        id: 'q2',
        type: 'fill_word',
        prompt: '看图拼词：h - a - t 拼成什么？',
        audioTarget: 'hat',
        options: [
          { id: 'hat', text: 'hat', sub: '👒 帽子', emoji: '👒', isCorrect: true },
          { id: 'bat', text: 'bat', sub: '🦇 蝙蝠', emoji: '🦇', isCorrect: false },
          { id: 'bell', text: 'bell', sub: '🔔 铃铛', emoji: '🔔', isCorrect: false },
        ],
      },
      {
        id: 'q3',
        type: 'listen_sentence',
        prompt: '听课文句子选图：Mum rings the big bell.',
        audioTarget: 'Mum rings the big bell.',
        options: [
          { id: 'bell', text: 'Mum rings the big bell.', emoji: '🔔', isCorrect: true },
          { id: 'hat', text: 'Biff had a big hat.', emoji: '👒', isCorrect: false },
        ],
      },
    ],
  },
  // ==================== LEVEL 2 ====================
  {
    id: 'ort-l2-b7',
    level: 2,
    levelLabel: 'Level 2 进阶拓展',
    bookNum: 7,
    title: 'Book 7: The Red Van (j, v, w, x)',
    coverEmoji: '🚐',
    themeColor: 'from-teal-500 to-emerald-700',
    characterFocus: 'Dad & Floppy',
    phonemes: [
      { letter: 'j', ipa: '/dʒ/', anchorWord: 'jam', anchorEmoji: '🍓', tip: '舌尖抵齿龈，发微浊爆破音 /dʒ/' },
      { letter: 'v', ipa: '/v/', anchorWord: 'van', anchorEmoji: '🚐', tip: '上齿咬下唇发摩擦音，声带强烈震动' },
      { letter: 'w', ipa: '/w/', anchorWord: 'wet', anchorEmoji: '🌧️', tip: '双唇收圆突出，迅速向后滑动' },
      { letter: 'x', ipa: '/ks/', anchorWord: 'box', anchorEmoji: '📦', tip: '复合辅音 /k/ + /s/，像开香槟' },
    ],
    decodableWords: [
      { word: 'van', emoji: '🚐', phonemes: ['v', 'a', 'n'], meaning: '面包车 (Dad 的货车)' },
      { word: 'jam', emoji: '🍓', phonemes: ['j', 'a', 'm'], meaning: '果酱' },
      { word: 'wet', emoji: '🌧️', phonemes: ['w', 'e', 't'], meaning: '湿漉漉的' },
      { word: 'box', emoji: '📦', phonemes: ['b', 'o', 'x'], meaning: '箱子 / 盒子' },
      { word: 'six', emoji: '6️⃣', phonemes: ['s', 'i', 'x'], meaning: '数字六' },
    ],
    story: {
      title: 'Dad and the Big Red Van',
      description: '爸爸开着大面包车带大家去郊游',
      lines: [
        { text: 'Dad has a big red van.', translation: '爸爸有一辆红色的大货车。', highlightWords: ['van', 'red'], emoji: '🚐' },
        { text: 'Six jars of strawberry jam.', translation: '车里有六罐香甜的草莓酱。', highlightWords: ['six', 'jam'], emoji: '🍓' },
        { text: 'A wet dog jumps in a box!', translation: '一只湿漉漉的小狗跳进了箱子里！', highlightWords: ['wet', 'box'], emoji: '🐶' },
        { text: 'Floppy had jam on his nose!', translation: 'Floppy 的鼻子上沾满了果酱！', highlightWords: ['jam'], emoji: '👃' },
      ],
    },
    quiz: [
      {
        id: 'q1',
        type: 'listen_letter',
        prompt: '听音选辅音：v (van)',
        audioTarget: 'v',
        options: [
          { id: 'v', text: 'v', sub: '/v/', emoji: '🚐', isCorrect: true },
          { id: 'w', text: 'w', sub: '/w/', emoji: '🌧️', isCorrect: false },
          { id: 'j', text: 'j', sub: '/dʒ/', emoji: '🍓', isCorrect: false },
        ],
      },
      {
        id: 'q2',
        type: 'fill_word',
        prompt: '拼读填空：b - o - x 拼成什么单词？',
        audioTarget: 'box',
        options: [
          { id: 'box', text: 'box', sub: '📦 盒子', emoji: '📦', isCorrect: true },
          { id: 'six', text: 'six', sub: '6️⃣ 数字六', emoji: '6️⃣', isCorrect: false },
          { id: 'van', text: 'van', sub: '🚐 货车', emoji: '🚐', isCorrect: false },
        ],
      },
      {
        id: 'q3',
        type: 'listen_sentence',
        prompt: '听句子选图：Dad has a big red van.',
        audioTarget: 'Dad has a big red van.',
        options: [
          { id: 'van', text: 'Dad has a big red van.', emoji: '🚐', isCorrect: true },
          { id: 'jam', text: 'Six jars of jam.', emoji: '🍓', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'ort-l2-b9',
    level: 2,
    levelLabel: 'Level 2 进阶拓展',
    bookNum: 9,
    title: 'Book 9: Fish and Chips (ch, sh, th)',
    coverEmoji: '🍟',
    themeColor: 'from-amber-500 to-yellow-600',
    characterFocus: 'Chip & Biff',
    phonemes: [
      { letter: 'ch', ipa: '/tʃ/', anchorWord: 'chin', anchorEmoji: '👦', tip: '双字母组合 /tʃ/，像小火车开动 ch-ch-ch' },
      { letter: 'sh', ipa: '/ʃ/', anchorWord: 'ship', anchorEmoji: '🚢', tip: '双字母组合 /ʃ/，做“嘘”声手势' },
      { letter: 'th', ipa: '/θ/', anchorWord: 'thin', anchorEmoji: '👅', tip: '咬舌音，上下门牙轻咬舌尖，轻轻吐气' },
    ],
    decodableWords: [
      { word: 'chip', emoji: '🍟', phonemes: ['ch', 'i', 'p'], meaning: '炸薯条 (也是 Chip 的名字)' },
      { word: 'chin', emoji: '🧔', phonemes: ['ch', 'i', 'n'], meaning: '下巴' },
      { word: 'ship', emoji: '🚢', phonemes: ['sh', 'i', 'p'], meaning: '大轮船' },
      { word: 'fish', emoji: '🐟', phonemes: ['f', 'i', 'sh'], meaning: '鱼' },
      { word: 'moth', emoji: '🦋', phonemes: ['m', 'o', 'th'], meaning: '飞蛾' },
    ],
    story: {
      title: 'Fish and Chips by the Sea',
      description: '牛津经典：全家在海边吃炸鱼薯条，看大轮船',
      lines: [
        { text: 'Chip had hot fish and chips.', translation: 'Chip 吃着热气腾腾的炸鱼薯条。', highlightWords: ['chip', 'fish'], emoji: '🍟' },
        { text: 'Look at the big ship in the sea!', translation: '快看海上的那艘大轮船！', highlightWords: ['ship'], emoji: '🚢' },
        { text: 'Biff found a thin shell on the sand.', translation: 'Biff 在沙滩上捡到了一枚薄薄的贝壳。', highlightWords: ['thin', 'shell'], emoji: '🐚' },
        { text: 'Thank you Mum, says Chip with a smile.', translation: '“谢谢妈妈！”Chip 笑着说。', highlightWords: ['chip'], emoji: '😊' },
      ],
    },
    quiz: [
      {
        id: 'q1',
        type: 'listen_letter',
        prompt: '听音辨二合字母：选出 /ʃ/ (ship, fish)',
        audioTarget: 'sh',
        options: [
          { id: 'sh', text: 'sh', sub: '/ʃ/ ship', emoji: '🚢', isCorrect: true },
          { id: 'ch', text: 'ch', sub: '/tʃ/ chip', emoji: '🍟', isCorrect: false },
          { id: 'th', text: 'th', sub: '/θ/ thin', emoji: '👅', isCorrect: false },
        ],
      },
      {
        id: 'q2',
        type: 'fill_word',
        prompt: '看图拼词：f - i - sh 拼出什么单词？',
        audioTarget: 'fish',
        options: [
          { id: 'fish', text: 'fish', sub: '🐟 鱼', emoji: '🐟', isCorrect: true },
          { id: 'ship', text: 'ship', sub: '🚢 大船', emoji: '🚢', isCorrect: false },
          { id: 'chip', text: 'chip', sub: '🍟 薯条', emoji: '🍟', isCorrect: false },
        ],
      },
      {
        id: 'q3',
        type: 'listen_sentence',
        prompt: '听读句子：Chip had hot fish and chips.',
        audioTarget: 'Chip had hot fish and chips.',
        options: [
          { id: 'fish_chips', text: 'Chip had hot fish and chips.', emoji: '🍟', isCorrect: true },
          { id: 'ship', text: 'Look at the big ship.', emoji: '🚢', isCorrect: false },
        ],
      },
    ],
  },
  // ==================== LEVEL 3 ====================
  {
    id: 'ort-l3-b11',
    level: 3,
    levelLabel: 'Level 3 长元音与魔法钥匙',
    bookNum: 11,
    title: 'Book 11: The Magic Key (ai, ee, igh, oa)',
    coverEmoji: '🔑',
    themeColor: 'from-amber-400 via-rose-400 to-purple-600',
    characterFocus: 'Biff, Chip & Kipper',
    phonemes: [
      { letter: 'ai', ipa: '/eɪ/', anchorWord: 'rain', anchorEmoji: '🌧️', tip: '双元音 /eɪ/，由前元音滑向半元音，像说 Hey!' },
      { letter: 'ee', ipa: '/iː/', anchorWord: 'see', anchorEmoji: '👀', tip: '长元音 /iː/，嘴角大微笑，发出饱满开心音' },
      { letter: 'igh', ipa: '/aɪ/', anchorWord: 'night', anchorEmoji: '🌙', tip: '三个字母只发一个双元音 /aɪ/，眼睛张大 Say I!' },
      { letter: 'oa', ipa: '/əʊ/', anchorWord: 'boat', anchorEmoji: '⛵', tip: '双元音 /əʊ/，嘴巴先放松再收圆 Say Oh!' },
    ],
    decodableWords: [
      { word: 'rain', emoji: '🌧️', phonemes: ['r', 'ai', 'n'], meaning: '下雨' },
      { word: 'tree', emoji: '🌳', phonemes: ['t', 'r', 'ee'], meaning: '大树' },
      { word: 'see', emoji: '👀', phonemes: ['s', 'ee'], meaning: '看见' },
      { word: 'night', emoji: '🌙', phonemes: ['n', 'igh', 't'], meaning: '夜晚' },
      { word: 'boat', emoji: '⛵', phonemes: ['b', 'oa', 't'], meaning: '小船' },
    ],
    story: {
      title: 'The Magic Key Glows!',
      description: '牛津树最激动人心的篇章：神秘的魔法钥匙在夜晚发光啦！',
      lines: [
        { text: 'It was a dark and rainy night.', translation: '那是一个黑暗又下着雨的夜晚。', highlightWords: ['rainy', 'night'], emoji: '🌧️' },
        { text: 'Biff and Chip see a yellow light.', translation: 'Biff 和 Chip 看到了一道金黄色的光芒。', highlightWords: ['see', 'light'], emoji: '✨' },
        { text: 'Look at the box! The magic key glows!', translation: '快看盒子里！那把神奇钥匙在发光！', highlightWords: ['box', 'key'], emoji: '🔑' },
        { text: 'An adventure begins for Floppy!', translation: 'Floppy 的神奇大冒险要开始啦！', highlightWords: [], emoji: '🐕' },
      ],
    },
    quiz: [
      {
        id: 'q1',
        type: 'listen_letter',
        prompt: '听长元音：选出微笑长元音 ee (tree, see)',
        audioTarget: 'ee',
        options: [
          { id: 'ee', text: 'ee', sub: '/iː/ see', emoji: '👀', isCorrect: true },
          { id: 'ai', text: 'ai', sub: '/eɪ/ rain', emoji: '🌧️', isCorrect: false },
          { id: 'oa', text: 'oa', sub: '/əʊ/ boat', emoji: '⛵', isCorrect: false },
        ],
      },
      {
        id: 'q2',
        type: 'fill_word',
        prompt: '看图拼词：r - ai - n 拼出什么单词？',
        audioTarget: 'rain',
        options: [
          { id: 'rain', text: 'rain', sub: '🌧️ 下雨', emoji: '🌧️', isCorrect: true },
          { id: 'boat', text: 'boat', sub: '⛵ 小船', emoji: '⛵', isCorrect: false },
          { id: 'tree', text: 'tree', sub: '🌳 大树', emoji: '🌳', isCorrect: false },
        ],
      },
      {
        id: 'q3',
        type: 'listen_sentence',
        prompt: '牛津树经典名句听读：The magic key glows!',
        audioTarget: 'The magic key glows.',
        options: [
          { id: 'key_glow', text: 'The magic key glows!', emoji: '🔑', isCorrect: true },
          { id: 'night', text: 'A dark and rainy night.', emoji: '🌙', isCorrect: false },
        ],
      },
    ],
  },
];
