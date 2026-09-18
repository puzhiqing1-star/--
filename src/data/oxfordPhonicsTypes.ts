export interface MindMapSentence {
  text: string;
}

export interface MindMapWordBranch {
  word: string;
  emoji: string;
  phonicsBreakdown: string[];
  meaning: string;
  sentences: string[]; // 3 sentences per mind map leaf
}

export interface MindMapSoundGroup {
  soundId: string;
  symbol: string;
  ipa: string;
  color: string;
  words: MindMapWordBranch[];
}

export interface OrtStoryLine {
  text: string;
  translation: string;
  highlightWords: string[];
  emoji: string;
}

export interface OrtQuizItem {
  id: string;
  type: 'listen_letter' | 'fill_word' | 'listen_sentence' | 'ipa_match';
  prompt: string;
  audioTarget: string;
  options: Array<{ id: string; text: string; sub?: string; emoji?: string; isCorrect: boolean }>;
}

export interface OxfordLessonUnit {
  id: string;
  level: number; // 1, 2, 3, 4, 5
  levelTitle: string; // e.g., "Level 1: The Alphabet"
  unitNum: number;
  unitTitle: string; // e.g., "Unit 1: Aa Bb Cc"
  subtitle: string;
  coverEmoji: string;
  themeGradient: string;
  soundGroups: MindMapSoundGroup[];
  summaryRhyme: string; // Golden arrow sentence at bottom of mind map
  story: {
    title: string;
    description: string;
    lines: OrtStoryLine[];
    sightWords: string[];
    newWords?: string[];
  };
  quiz: OrtQuizItem[];
}

export interface OxfordLevelMeta {
  level: number;
  name: string;
  enTitle: string;
  desc: string;
  color: string;
  icon: string;
  units: OxfordLessonUnit[];
}
