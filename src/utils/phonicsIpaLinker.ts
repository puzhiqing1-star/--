import { ALL_OXFORD_UNITS, OxfordLessonUnit } from '../data/oxfordPhonicsIndex';
import { FULL_48_IPA, MOUTH_GUIDES } from '../data/phonicsData';

export interface PhonemeIpaPair {
  phoneme: string;
  ipa: string;
  mouthTip?: string;
  handGesture?: string;
  soundCue?: string;
}

export interface IpaDetailModalData {
  sym: string;
  type: string;
  subType: string;
  graphemes: string[];
  examples: Array<{ word: string; emoji: string }>;
  mouthTip: string;
  handGesture?: string;
  contrastGuide?: {
    title: string;
    pairWordA: string;
    pairIpaA: string;
    pairWordB: string;
    pairIpaB: string;
    tip: string;
  };
  oxfordUnits: Array<{
    unitId: string;
    level: number;
    title: string;
    levelTitle: string;
  }>;
}

// Map common English phonics graphemes to IPA
const GRAPHEME_TO_IPA_MAP: Record<string, { ipa: string; gesture?: string; tip: string }> = {
  // Short vowels
  a: { ipa: '/æ/', gesture: '✌️+☝️ 三指大张嘴', tip: '嘴巴张大能放下三指，下巴用力下压，发大嘴苹果音 /æ/' },
  e: { ipa: '/e/', gesture: '✌️ 两指微张', tip: '嘴巴半开两指宽，嘴角自然放松，发微笑鸡蛋音 /e/' },
  i: { ipa: '/ɪ/', gesture: '☝️ 一指微露齿', tip: '嘴角向两边微笑，短促轻快，发小老鼠音 /ɪ/' },
  o: { ipa: '/ɒ/', gesture: '⭕ 圆圈小嘴', tip: '嘴巴呈中等小圆形，舌身后缩，发小闹钟滴答音 /ɒ/' },
  u: { ipa: '/ʌ/', gesture: '👇 下巴微沉', tip: '嘴巴自然微张半开，短促利落，发撑起雨伞音 /ʌ/' },

  // Long vowels & Magic e
  'a_e': { ipa: '/eɪ/', gesture: '➡️ 滑动嘴角', tip: '由 /e/ 滑向 /ɪ/，像开怀打招呼说 Hey! /eɪ/' },
  ai: { ipa: '/eɪ/', gesture: '➡️ 滑动嘴角', tip: '双元音滑行，雨天下雨 rain 里的 /eɪ/' },
  ay: { ipa: '/eɪ/', gesture: '➡️ 滑动嘴角', tip: '快乐玩耍 play 里的 /eɪ/' },
  'i_e': { ipa: '/aɪ/', gesture: '⬆️ 嘴型由大变小', tip: '由大嘴巴 /a/ 快速滑向小嘴 /ɪ/，大声说 Hi! /aɪ/' },
  igh: { ipa: '/aɪ/', gesture: '💡 点亮明灯', tip: '高高飞起 high 与光明 light 里的 /aɪ/' },
  ie: { ipa: '/aɪ/', gesture: '👔 领带打结', tip: '打领带 tie 与香喷喷 pie 里的 /aɪ/' },
  'o_e': { ipa: '/əʊ/', gesture: '⭕ 大圆变小圆', tip: '嘴唇由微圆收缩为小圆孔，摸摸鼻子 nose 里的 /əʊ/' },
  oa: { ipa: '/əʊ/', gesture: '⛵ 小船摇晃', tip: '小船划行 boat 与暖和的大衣 coat 里的 /əʊ/' },
  ow: { ipa: '/əʊ/', gesture: '❄️ 漫天雪花', tip: '飘落雪花 snow 与吹风 blow 里的 /əʊ/' },
  'u_e': { ipa: '/ju:/', gesture: '🎺 吹响小号', tip: '先发 /j/ 再发长音 /u:/，神奇音符 tune 与可爱小鹿 cute 里的 /ju:/' },
  ee: { ipa: '/i:/', gesture: '😁 咧嘴大笑', tip: '嘴角尽情向两边拉开，露出上下门牙，像小蜜蜂大笑 /i:/' },
  ea: { ipa: '/i:/', gesture: '🍵 品尝绿茶', tip: '喝一杯热茶 tea，吃一口香桃 peach 里的长音 /i:/' },
  oo: { ipa: '/u:/', gesture: '🌕 圆圆满月', tip: '双唇收得极小成圆孔向前突出，夜空明月 moon 里的长音 /u:/' },
  'oo_short': { ipa: '/ʊ/', gesture: '📖 打开课本', tip: '双唇微圆但肌肉放松，读一本好书 book 里的短音 /ʊ/' },

  // R-controlled vowels
  ar: { ipa: '/ɑ:/', gesture: '⭐ 开车看星', tip: '嘴巴大张深入喉部，卷起舌头，开汽车 car 里的 /ɑ:/' },
  or: { ipa: '/ɔ:/', gesture: '🚪 推开木门', tip: '双唇收圆向前突出，拿一把小叉子 fork 里的 /ɔ:/' },
  er: { ipa: '/ɜ:/', gesture: '🐦 枝头小鸟', tip: '舌身放平舌中微抬，勤劳的护士 nurse 与小鸟 bird 里的 /ɜ:/' },
  ir: { ipa: '/ɜ:/', gesture: '👧 可爱女孩', tip: '可爱的小女孩 girl 与美丽衬衫 shirt 里的 /ɜ:/' },
  ur: { ipa: '/ɜ:/', gesture: '🏄 冲浪少年', tip: '在大海冲浪 surf 与调皮的小乌龟 turtle 里的 /ɜ:/' },

  // Diphthongs
  oi: { ipa: '/ɔɪ/', gesture: '🪙 扔进硬币', tip: '由圆嘴 /ɔ/ 快速滑向微笑 /ɪ/，叮当一枚小硬币 coin 里的 /ɔɪ/' },
  oy: { ipa: '/ɔɪ/', gesture: '🧸 快乐男孩', tip: '可爱的男孩 boy 与心爱的玩具 toy 里的 /ɔɪ/' },
  ou: { ipa: '/aʊ/', gesture: '🏠 走进房屋', tip: '从大嘴 /a/ 滑向小圆唇 /ʊ/，高大的房子 house 里的 /aʊ/' },
  ow_cow: { ipa: '/aʊ/', gesture: '🐮 奶牛哞哞', tip: '温顺的奶牛 cow 与天上的白云 cloud 里的 /aʊ/' },

  // Consonants & Digraphs
  b: { ipa: '/b/', gesture: '💥 敲打小鼓', tip: '双唇紧闭，随后爆破浊音震动声带，砰砰鼓声 /b/' },
  p: { ipa: '/p/', gesture: '🕯️ 吹灭蜡烛', tip: '双唇紧闭，用力向外噗一声吹气，声带不震动 /p/' },
  d: { ipa: '/d/', gesture: '🥁 咚咚小鼓', tip: '舌尖抵住上牙龈爆破出浊音，小狗 dog 叫 /d/' },
  t: { ipa: '/t/', gesture: '⏰ 小表滴答', tip: '舌尖轻点上牙龈干脆爆破清气，小钟滴答 /t/' },
  g: { ipa: '/g/', gesture: '🥛 咕咚喝水', tip: '舌后部隆起贴软腭，突然放开爆出浊音，咕咚大口喝水 /g/' },
  k: { ipa: '/k/', gesture: '🪁 放飞风筝', tip: '舌后部紧贴软腭爆破清气，像小猫打喷嚏 /k/' },
  c: { ipa: '/k/', gesture: '🐱 喵喵小猫', tip: '在 a, o, u 前发清脆的 /k/ 音' },
  ck: { ipa: '/k/', gesture: '🦆 鸭子嘎嘎', tip: '短元音后的强爆破清音 /k/' },
  m: { ipa: '/m/', gesture: '😋 美味冰淇淋', tip: '双唇紧紧闭合，鼻腔共鸣嗡嗡响，好像吃到绝顶美味：Mmm! /m/' },
  n: { ipa: '/n/', gesture: '👃 鼻音共鸣', tip: '舌尖顶住上牙龈，气流全从鼻孔出，小渔网 net 里的 /n/' },
  ng: { ipa: '/ŋ/', gesture: '🎤 欢快唱歌', tip: '舌根抵软腭，气流由鼻孔出，快乐歌唱 sing 里的 /ŋ/' },
  l: { ipa: '/l/', gesture: '👅 舌尖向上', tip: '舌尖高高顶住上门牙牙背，清亮滑过 /l/' },
  r: { ipa: '/r/', gesture: '🚗 轰隆发动', tip: '舌尖向上卷起不碰牙膛，像跑车轰鸣 /r/' },
  f: { ipa: '/f/', gesture: '🐰 兔子露齿', tip: '上门牙轻轻轻咬住下嘴唇，向外呼出轻风 /f/' },
  v: { ipa: '/v/', gesture: '⚡ 震动小车', tip: '上门牙咬住下嘴唇，声带大力震动发出嗡嗡蜂鸣 /v/' },
  s: { ipa: '/s/', gesture: '🐍 游走小蛇', tip: '上下牙齿闭拢，舌尖放在牙后，吹出长长嘶嘶声 /s/' },
  z: { ipa: '/z/', gesture: '🐝 蜜蜂采蜜', tip: '牙齿闭拢，声带大力震动，发出蜜蜂飞舞的嗡嗡声 /z/' },
  h: { ipa: '/h/', gesture: '💨 大口喘气', tip: '嘴巴张开，呼出一口温暖热气，跑步好累大口哈气 /h/' },
  w: { ipa: '/w/', gesture: '💧 咕噜水珠', tip: '双唇收成圆圆的小洞，舌后隆起，清泉流淌 water 里的 /w/' },
  j: { ipa: '/dʒ/', gesture: '🍓 甜甜果酱', tip: '舌端抵齿龈后部，破擦而出带声带震动，可口的果酱 jam 里的 /dʒ/' },
  y: { ipa: '/j/', gesture: '💛 灿烂金黄', tip: '舌前部抬高贴近硬腭，快速滑向元音，金黄的黄色 yellow 里的 /j/' },
  sh: { ipa: '/ʃ/', gesture: '🤫 嘘声安静', tip: '食指放在嘴唇前：嘘——小宝宝睡着了，发轻柔的 /ʃ/' },
  ch: { ipa: '/tʃ/', gesture: '🚂 火车进站', tip: '双唇撅起，舌端爆破，小火车逛吃逛吃开来啦：Choo-choo! /tʃ/' },
  th: { ipa: '/θ/', gesture: '👅 轻轻咬舌', tip: '小舌头偷偷探出上下牙门，轻轻咬住吹出清凉风 /θ/' },
  'th_voiced': { ipa: '/ð/', gesture: '⚡ 咬舌震动', tip: '舌头探出上下牙齿之间，咬住且声带大力震动 /ð/' },
  wh: { ipa: '/w/', gesture: '🐋 鲸鱼喷水', tip: '双唇圆拢，大鲸鱼 whale 与白云 white 里的 /w/' },
  ph: { ipa: '/f/', gesture: '📱 打个电话', tip: '发轻风 /f/，大象 elephant 与拨打电话 phone 里的 /f/' },
};

/**
 * Get accurate IPA breakdown for a decodable word given its phonics breakdown
 */
export function getIpaBreakdownForWord(word: string, phonicsBreakdown: string[]): string[] {
  const cleanWord = word.toLowerCase();

  // Custom overrides for specific high-frequency Oxford words
  const overrides: Record<string, string[]> = {
    the: ['/ð/', '/ə/'],
    this: ['/ð/', '/ɪ/', '/s/'],
    that: ['/ð/', '/æ/', '/t/'],
    these: ['/ð/', '/i:/', '/z/'],
    those: ['/ð/', '/əʊ/', '/z/'],
    book: ['/b/', '/ʊ/', '/k/'],
    cook: ['/k/', '/ʊ/', '/k/'],
    look: ['/l/', '/ʊ/', '/k/'],
    foot: ['/f/', '/ʊ/', '/t/'],
    good: ['/g/', '/ʊ/', '/d/'],
    wood: ['/w/', '/ʊ/', '/d/'],
    cow: ['/k/', '/aʊ/'],
    how: ['/h/', '/aʊ/'],
    now: ['/n/', '/aʊ/'],
    down: ['/d/', '/aʊ/', '/n/'],
    town: ['/t/', '/aʊ/', '/n/'],
    brown: ['/b/', '/r/', '/aʊ/', '/n/'],
  };

  if (overrides[cleanWord]) {
    return overrides[cleanWord];
  }

  return phonicsBreakdown.map((part) => {
    const p = part.toLowerCase();
    if (GRAPHEME_TO_IPA_MAP[p]) {
      return GRAPHEME_TO_IPA_MAP[p].ipa;
    }
    // Fallback search in FULL_48_IPA
    const matched = FULL_48_IPA.find((item) =>
      item.graphemes.some((g) => g.toLowerCase() === p || g.replace('-', '_').toLowerCase() === p)
    );
    if (matched) return matched.sym;
    return `/${p}/`;
  });
}

/**
 * Find which Oxford Reading Tree units cover a specific IPA symbol
 */
export function findOxfordUnitsForIpa(ipaSymbol: string) {
  const normIpa = ipaSymbol.trim().replace(/[\[\]]/g, '');
  const matchedUnits: Array<{
    unitId: string;
    level: number;
    title: string;
    levelTitle: string;
  }> = [];

  ALL_OXFORD_UNITS.forEach((unit) => {
    const hasIpa = unit.soundGroups.some((sg) => {
      const sgIpa = sg.ipa.trim().replace(/[\[\]]/g, '');
      return sgIpa === normIpa || sgIpa.includes(normIpa);
    });

    if (hasIpa) {
      matchedUnits.push({
        unitId: unit.id,
        level: unit.level,
        title: unit.unitTitle,
        levelTitle: unit.levelTitle,
      });
    }
  });

  return matchedUnits;
}

/**
 * Get comprehensive IPA modal data for children's quick-view drawer
 */
export function getIpaDetailData(ipaSymbol: string): IpaDetailModalData | null {
  const normIpa = ipaSymbol.trim().replace(/[\[\]]/g, '');
  const ipaRecord = FULL_48_IPA.find(
    (item) => item.sym === normIpa || item.sym.replace(/[\[\]]/g, '') === normIpa
  );

  // Find grapheme tip
  let tip = '听从标准外教发音，跟随口型模仿练习！';
  let gesture = '👂 倾听模仿';

  for (const key in GRAPHEME_TO_IPA_MAP) {
    if (GRAPHEME_TO_IPA_MAP[key].ipa === normIpa) {
      tip = GRAPHEME_TO_IPA_MAP[key].tip;
      gesture = GRAPHEME_TO_IPA_MAP[key].gesture || gesture;
      break;
    }
  }

  // Find mouth guide contrast if available
  let contrastGuide: IpaDetailModalData['contrastGuide'];
  const matchedGuide = MOUTH_GUIDES.find(
    (mg) => mg.pairA.ipa === normIpa || mg.pairB.ipa === normIpa
  );
  if (matchedGuide) {
    contrastGuide = {
      title: matchedGuide.title,
      pairWordA: matchedGuide.pairA.word,
      pairIpaA: matchedGuide.pairA.ipa,
      pairWordB: matchedGuide.pairB.word,
      pairIpaB: matchedGuide.pairB.ipa,
      tip: matchedGuide.desc,
    };
  }

  const oxfordUnits = findOxfordUnitsForIpa(normIpa);

  if (!ipaRecord) {
    return {
      sym: normIpa,
      type: 'phoneme',
      subType: '核心音素',
      graphemes: [],
      examples: [],
      mouthTip: tip,
      handGesture: gesture,
      contrastGuide,
      oxfordUnits,
    };
  }

  return {
    sym: ipaRecord.sym,
    type: ipaRecord.type === 'vowel' ? '元音 Vowel' : '辅音 Consonant',
    subType: ipaRecord.subType,
    graphemes: ipaRecord.graphemes,
    examples: ipaRecord.examples,
    mouthTip: tip,
    handGesture: gesture,
    contrastGuide,
    oxfordUnits,
  };
}

/**
 * Determine if an IPA sound is a "Tricky Sound" that needs mouth-shape mirror guidance
 */
export function getTrickyMouthGuide(ipaSymbol: string) {
  const norm = ipaSymbol.trim().replace(/[\[\]]/g, '');
  return MOUTH_GUIDES.find(
    (mg) => mg.pairA.ipa === norm || mg.pairB.ipa === norm
  );
}
