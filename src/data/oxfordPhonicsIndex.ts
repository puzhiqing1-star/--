import { OxfordLessonUnit } from './oxfordPhonicsTypes';
import { OXFORD_LEVEL_1_UNITS } from './oxfordLevel1';
import { OXFORD_LEVEL_2_UNITS } from './oxfordLevel2';
import { OXFORD_LEVEL_3_UNITS } from './oxfordLevel3';
import { OXFORD_LEVEL_4_UNITS } from './oxfordLevel4';
import { OXFORD_LEVEL_5_UNITS } from './oxfordLevel5';

export * from './oxfordPhonicsTypes';
export { OXFORD_LEVEL_1_UNITS } from './oxfordLevel1';
export { OXFORD_LEVEL_2_UNITS } from './oxfordLevel2';
export { OXFORD_LEVEL_3_UNITS } from './oxfordLevel3';
export { OXFORD_LEVEL_4_UNITS } from './oxfordLevel4';
export { OXFORD_LEVEL_5_UNITS } from './oxfordLevel5';

export const ALL_OXFORD_UNITS: OxfordLessonUnit[] = [
  ...OXFORD_LEVEL_1_UNITS,
  ...OXFORD_LEVEL_2_UNITS,
  ...OXFORD_LEVEL_3_UNITS,
  ...OXFORD_LEVEL_4_UNITS,
  ...OXFORD_LEVEL_5_UNITS,
];

export interface OxfordLevelMeta {
  level: number;
  title: string;
  enTitle: string;
  subtitle: string;
  badgeEmoji: string;
  color: string;
  gradient: string;
  unitCount: number;
  wordCount: number;
  description: string;
  coreConcepts: string[];
}

export const OXFORD_LEVELS_METADATA: OxfordLevelMeta[] = [
  {
    level: 1,
    title: 'Level 1: 基础字母与字音',
    enTitle: 'The Alphabet (Letters & Sounds)',
    subtitle: '认识 26 个英文字母的名字与自然发音 (Aa - Zz)',
    badgeEmoji: '🔤',
    color: '#3B82F6',
    gradient: 'from-blue-500 to-indigo-600',
    unitCount: 8,
    wordCount: OXFORD_LEVEL_1_UNITS.reduce((acc, u) => acc + u.soundGroups.reduce((wAcc, sg) => wAcc + sg.words.length, 0), 0),
    description: '奠定自然拼读基石，学习每个字母的核心字音与代表词，掌握左向右的指读和字母意识。',
    coreConcepts: ['字母名 (Letter Name)', '字母音 (Letter Sound)', '首字母听音辨字', '自然拼读儿歌韵律'],
  },
  {
    level: 2,
    title: 'Level 2: 短元音与词族',
    enTitle: 'Short Vowels & Word Families',
    subtitle: '掌握 a, e, i, o, u 五大短元音与 CVC 拼读词族',
    badgeEmoji: '🐱',
    color: '#10B981',
    gradient: 'from-emerald-500 to-teal-600',
    unitCount: 8,
    wordCount: OXFORD_LEVEL_2_UNITS.reduce((acc, u) => acc + u.soundGroups.reduce((wAcc, sg) => wAcc + sg.words.length, 0), 0),
    description: '通过 -am, -an, -ap, -at, -et, -en, -ed, -ig, -in, -ot, -op, -ug 等韵尾词族，快速实现自主拼读常见 CVC 单音节词。',
    coreConcepts: ['短元音 /æ/, /e/, /ɪ/, /ɒ/, /ʌ/', '辅音-元音-辅音 (CVC) 组合', '同尾韵词族 (Rhyming Families)', '分级短故事理解'],
  },
  {
    level: 3,
    title: 'Level 3: 长元音与双元音',
    enTitle: 'Long Vowels & Magic E',
    subtitle: '魔法 e 规律与 ai, ay, ee, ea, igh, oa, ow, ue, ui, ew, oo',
    badgeEmoji: '🪄',
    color: '#8B5CF6',
    gradient: 'from-purple-500 to-indigo-600',
    unitCount: 8,
    wordCount: OXFORD_LEVEL_3_UNITS.reduce((acc, u) => acc + u.soundGroups.reduce((wAcc, sg) => wAcc + sg.words.length, 0), 0),
    description: '解锁开音节与 Magic e (a_e, i_e, o_e, u_e) 及经典元音字母组合，孩子拼读词汇量实现翻倍跨越。',
    coreConcepts: ['魔法 Silent e (跳音发长音)', '常见长元音字母组合', '一音多形规律探究', '流利朗读原版短篇'],
  },
  {
    level: 4,
    title: 'Level 4: 辅音混合与二合辅音',
    enTitle: 'Consonant Blends & Digraphs',
    subtitle: 'bl, cl, br, cr, fr, gr, sm, sn, st, sh, ch, th, ng, nk, soft c/g',
    badgeEmoji: '🤝',
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-600',
    unitCount: 8,
    wordCount: OXFORD_LEVEL_4_UNITS.reduce((acc, u) => acc + u.soundGroups.reduce((wAcc, sg) => wAcc + sg.words.length, 0), 0),
    description: '克服复合辅音连读挑战，攻克清浊咬舌音 th、二合辅音 sh/ch/wh/ph 及软音 c/g 变音法则。',
    coreConcepts: ['L 族与 R 族首辅音丛 (bl, cl, br, cr)', 'S 族辅音滑行 (sm, sn, sp, sw, st)', '二合辅音 (sh, ch, th, ph, wh)', '软音 Soft C & Soft G'],
  },
  {
    level: 5,
    title: 'Level 5: 复杂组合与多音节',
    enTitle: 'Letter Combinations & Advanced Phonics',
    subtitle: 'ar, ir, ur, ou, ow, oi, oy, au, aw, are, air, schwa, 常见词尾',
    badgeEmoji: '🎓',
    color: '#EF4444',
    gradient: 'from-rose-500 to-red-600',
    unitCount: 8,
    wordCount: OXFORD_LEVEL_5_UNITS.reduce((acc, u) => acc + u.soundGroups.reduce((wAcc, sg) => wAcc + sg.words.length, 0), 0),
    description: '系统掌握 R 控制元音、滑动双元音、非重读中央元音 Schwa /ə/、不发音字母及 -ture, -tion 等多音节词缀。',
    coreConcepts: ['R 控元音 (Bossy R: ar, ir, ur, er, or)', '双元音滑音 (ou, ow, oi, oy, au, aw)', '中央弱元音 Schwa /ə/', '不发音字母 (Silent Letters) 与高级后缀'],
  },
];

export function getOxfordUnitsByLevel(level: number): OxfordLessonUnit[] {
  return ALL_OXFORD_UNITS.filter((u) => u.level === level);
}

export function getOxfordUnitById(id: string): OxfordLessonUnit | undefined {
  return ALL_OXFORD_UNITS.find((u) => u.id === id);
}
