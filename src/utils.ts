export const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    window.speechSynthesis.speak(utterance);
  }
};

export const playKeepTrying = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("继续努力！");
    utterance.lang = 'zh-CN';
    utterance.rate = 1.0;
    utterance.pitch = 1.2;

    // Try to find a female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.lang.includes('zh') && (v.name.includes('Xiaoxiao') || v.name.includes('female') || v.name.includes('女')));
    if (femaleVoice) utterance.voice = femaleVoice;

    window.speechSynthesis.speak(utterance);
  }
};

export const speakAdvice = (text: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    // Remove markdown symbols for speech
    const cleanText = text.replace(/[#*`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'zh-CN';
    utterance.rate = 1.1; // Lively
    utterance.pitch = 1.4; // Energetic

    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.lang.includes('zh') && (v.name.includes('Xiaoxiao') || v.name.includes('female') || v.name.includes('女')));
    if (femaleVoice) utterance.voice = femaleVoice;

    window.speechSynthesis.speak(utterance);
  }
};

const toneMap: Record<string, string[]> = {
  'a': ['ā', 'á', 'ǎ', 'à', 'a'],
  'o': ['ō', 'ó', 'ǒ', 'ò', 'o'],
  'e': ['ē', 'é', 'ě', 'è', 'e'],
  'i': ['ī', 'í', 'ǐ', 'ì', 'i'],
  'u': ['ū', 'ú', 'ǔ', 'ù', 'u'],
  'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
  'ā': ['á', 'ǎ', 'à'], 'á': ['ā', 'ǎ', 'à'], 'ǎ': ['ā', 'á', 'à'], 'à': ['ā', 'á', 'ǎ'],
  'ō': ['ó', 'ǒ', 'ò'], 'ó': ['ō', 'ǒ', 'ò'], 'ǒ': ['ō', 'ó', 'ò'], 'ò': ['ō', 'ó', 'ǒ'],
  'ē': ['é', 'ě', 'è'], 'é': ['ē', 'ě', 'è'], 'ě': ['ē', 'é', 'è'], 'è': ['ē', 'é', 'ě'],
  'ī': ['í', 'ǐ', 'ì'], 'í': ['ī', 'ǐ', 'ì'], 'ǐ': ['ī', 'í', 'ì'], 'ì': ['ī', 'í', 'ǐ'],
  'ū': ['ú', 'ǔ', 'ù'], 'ú': ['ū', 'ǔ', 'ù'], 'ǔ': ['ū', 'ú', 'ù'], 'ù': ['ū', 'ú', 'ǔ'],
  'ǖ': ['ǘ', 'ǚ', 'ǜ'], 'ǘ': ['ǖ', 'ǚ', 'ǜ'], 'ǚ': ['ǖ', 'ǘ', 'ǜ'], 'ǜ': ['ǖ', 'ǘ', 'ǚ'],
};

const confusablePairs = [
  // 声母 (Consonants)
  ['b', 'd'], ['p', 'q'], ['n', 'l'],
  ['zh', 'z'], ['ch', 'c'], ['sh', 's'], // Order matters
  ['r', 'l'], ['f', 'h'],

  // 前后鼻音 (Nasals)
  ['ang', 'an'], ['āng', 'ān'], ['áng', 'án'], ['ǎng', 'ǎn'], ['àng', 'àn'],
  ['eng', 'en'], ['ēng', 'ēn'], ['éng', 'én'], ['ěng', 'ěn'], ['èng', 'èn'],
  ['ing', 'in'], ['īng', 'īn'], ['íng', 'ín'], ['ǐng', 'ǐn'], ['ìng', 'ìn'],

  // 易混韵母 (Vowels)
  ['ui', 'iu'], ['uī', 'iū'], ['uí', 'iú'], ['uǐ', 'iǔ'], ['uì', 'iù'],
  ['ie', 'ei'], ['iē', 'ēi'], ['ié', 'éi'], ['iě', 'ěi'], ['iè', 'èi'],
  ['uo', 'ou'], ['uō', 'ōu'], ['uó', 'óu'], ['uǒ', 'ǒu'], ['uò', 'òu'],
  ['uo', 'o'], ['uō', 'ō'], ['uó', 'ó'], ['uǒ', 'ǒ'], ['uò', 'ò'],
  ['ou', 'o'], ['ōu', 'ō'], ['óu', 'ó'], ['ǒu', 'ǒ'], ['òu', 'ò'],
  ['ong', 'eng'], ['ōng', 'ēng'], ['óng', 'éng'], ['ǒng', 'ěng'], ['òng', 'èng'],
  ['un', 'ün'], ['ūn', 'ǖn'], ['ún', 'ǘn'], ['ǔn', 'ǚn'], ['ùn', 'ǜn'],
  ['ai', 'ia'], ['āi', 'iā'], ['ái', 'iá'], ['ǎi', 'iǎ'], ['ài', 'ià'],
  ['ao', 'oa'], ['āo', 'ōa'], ['áo', 'óa'], ['ǎo', 'ǒa'], ['ào', 'òa']
];

export const generateDistractors = (correctPinyin: string): string[] => {
  const words = correctPinyin.split(' ');

  // variants[i] stores a set of confusable strings for the i-th syllable
  const wordVariants: Set<string>[] = words.map(w => new Set([w]));

  // 1. Phonetic & shape mutations for each syllable individually
  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // Standard pairs
    for (const [a, b] of confusablePairs) {
      const createSafeRegex = (term: string) => {
        const initials = ['b', 'd', 'p', 'q', 'n', 'l', 'zh', 'z', 'ch', 'c', 'sh', 's', 'r', 'f', 'h'];
        if (initials.includes(term)) return new RegExp(`^${term}`);
        if (term.endsWith('n')) return new RegExp(`${term}(?!g)`, 'g');
        return new RegExp(term, 'g');
      };

      if (word.includes(a)) {
        const newWord = word.replace(createSafeRegex(a), b);
        if (newWord !== word) wordVariants[i].add(newWord);
      }
      if (word.includes(b)) {
        const newWord = word.replace(createSafeRegex(b), a);
        if (newWord !== word) wordVariants[i].add(newWord);
      }
    }

    // Special spelling rule distractors
    // un -> uen
    if (word.includes('u') && word.includes('n') && !word.includes('a') && !word.includes('e') && !word.includes('i') && !word.includes('o')) {
      const uMatch = word.match(/[uūúǔù]/);
      const nMatch = word.match(/n/);
      if (uMatch && nMatch && word.indexOf(uMatch[0]) < word.indexOf(nMatch[0])) {
        const newWord = word.substring(0, word.indexOf(uMatch[0]) + 1) + 'e' + word.substring(word.indexOf(uMatch[0]) + 1);
        wordVariants[i].add(newWord);
      }
    }

    // ui -> uei
    if (word.includes('u') && word.match(/[iīíǐì]/)) {
      const uMatch = word.match(/[uūúǔù]/);
      const iMatch = word.match(/[iīíǐì]/);
      if (uMatch && iMatch && word.indexOf(uMatch[0]) < word.indexOf(iMatch[0])) {
        const newWord = word.substring(0, word.indexOf(uMatch[0]) + 1) + 'e' + word.substring(word.indexOf(uMatch[0]) + 1);
        wordVariants[i].add(newWord);
      }
    }

    // iu -> iou
    if (word.match(/[iīíǐì]/) && word.includes('u')) {
      const iMatch = word.match(/[iīíǐì]/);
      const uMatch = word.match(/[uūúǔù]/);
      if (iMatch && uMatch && word.indexOf(iMatch[0]) < word.indexOf(uMatch[0])) {
        const newWord = word.substring(0, word.indexOf(iMatch[0]) + 1) + 'o' + word.substring(word.indexOf(iMatch[0]) + 1);
        wordVariants[i].add(newWord);
      }
    }
  }

  // 2. Cartesian product of all syllable variants to form full multi-syllable distractors
  const phoneticDistractors = new Set<string>();
  const combine = (index: number, currentCombo: string[]) => {
    if (index === words.length) {
      const result = currentCombo.join(' ');
      if (result !== correctPinyin) phoneticDistractors.add(result);
      return;
    }
    for (const variant of wordVariants[index]) {
      currentCombo.push(variant);
      combine(index + 1, currentCombo);
      currentCombo.pop();
    }
  };
  combine(0, []);

  // 3. Tone mistakes (Fallback / mixin)
  const toneDistractors = new Set<string>();
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    for (let j = 0; j < word.length; j++) {
      const char = word[j];
      if (toneMap[char]) {
        for (const altTone of toneMap[char]) {
          const newWord = word.substring(0, j) + altTone + word.substring(j + 1);
          const newPinyin = [...words];
          newPinyin[i] = newWord;
          if (newPinyin.join(' ') !== correctPinyin) {
            toneDistractors.add(newPinyin.join(' '));
          }
        }
      }
    }
  }

  const validPhonetic = Array.from(phoneticDistractors);
  const validTones = Array.from(toneDistractors).filter(d => !validPhonetic.includes(d));

  // Prioritize phonetic errors (hardcore mode), fill remaining spots with tone errors
  const finalDistractors = [
    ...shuffle(validPhonetic),
    ...shuffle(validTones)
  ].slice(0, 5); // Take up to 5 so we have 6 options total including correct answer

  return shuffle(finalDistractors);
};

export const analyzeMistake = (correct: string, chosen: string): string => {
  if (correct.length === chosen.length) {
    for (let i = 0; i < correct.length; i++) {
      if (correct[i] !== chosen[i]) {
        if ('āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜa'.includes(correct[i]) || 'āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜa'.includes(chosen[i])) {
          return '声调 (Tones)';
        }
      }
    }
  }

  if ((chosen.includes('zh') && correct.includes('z')) || (chosen.includes('z') && correct.includes('zh'))) return '平翘舌音 (z/zh)';
  if ((chosen.includes('ch') && correct.includes('c')) || (chosen.includes('c') && correct.includes('ch'))) return '平翘舌音 (c/ch)';
  if ((chosen.includes('sh') && correct.includes('s')) || (chosen.includes('s') && correct.includes('sh'))) return '平翘舌音 (s/sh)';

  if ((chosen.includes('ing') && correct.includes('in')) || (chosen.includes('in') && correct.includes('ing'))) return '前后鼻音 (in/ing)';
  if ((chosen.includes('eng') && correct.includes('en')) || (chosen.includes('en') && correct.includes('eng'))) return '前后鼻音 (en/eng)';
  if ((chosen.includes('ang') && correct.includes('an')) || (chosen.includes('an') && correct.includes('ang'))) return '前后鼻音 (an/ang)';

  if ((chosen.includes('l') && correct.includes('n')) || (chosen.includes('n') && correct.includes('l'))) return '鼻边音 (n/l)';
  if ((chosen.includes('b') && correct.includes('d')) || (chosen.includes('d') && correct.includes('b'))) return '形近字母 (b/d)';
  if ((chosen.includes('p') && correct.includes('q')) || (chosen.includes('q') && correct.includes('p'))) return '形近字母 (p/q)';
  if ((chosen.includes('f') && correct.includes('t')) || (chosen.includes('t') && correct.includes('f'))) return '形近字母 (f/t)';
  if ((chosen.includes('ui') && correct.includes('iu')) || (chosen.includes('iu') && correct.includes('ui'))) return '易混韵母 (ui/iu)';
  if ((chosen.includes('ie') && correct.includes('ei')) || (chosen.includes('ei') && correct.includes('ie'))) return '易混韵母 (ie/ei)';
  if ((chosen.includes('un') && correct.includes('ün')) || (chosen.includes('ün') && correct.includes('un'))) return '易混韵母 (un/ün)';

  return '拼写 (Spelling)';
};

// === 连线题相近发音选词 ===

type WordLike = { id: string; pinyin: string;[key: string]: any };

const toneToBase: Record<string, string> = {
  'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
  'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
  'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
  'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
  'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
  'ǖ': 'ü', 'ǘ': 'ü', 'ǚ': 'ü', 'ǜ': 'ü',
};

const stripTones = (pinyin: string): string =>
  pinyin.split('').map(c => toneToBase[c] || c).join('');

const extractInitial = (syllable: string): string => {
  const base = stripTones(syllable);
  const match = base.match(/^(zh|ch|sh|b|p|m|f|d|t|n|l|g|k|h|j|q|x|z|c|s|r|y|w)/);
  return match ? match[1] : '';
};

const extractFinal = (syllable: string): string => {
  const base = stripTones(syllable);
  const match = base.match(/^(zh|ch|sh|b|p|m|f|d|t|n|l|g|k|h|j|q|x|z|c|s|r|y|w)/);
  return match ? base.substring(match[1].length) : base;
};

const confusableInitials: [string, string][] = [
  ['z', 'zh'], ['c', 'ch'], ['s', 'sh'],
  ['n', 'l'], ['r', 'l'], ['f', 'h'], ['b', 'p'], ['d', 't'], ['g', 'k'],
];

const confusableFinals: [string, string][] = [
  ['in', 'ing'], ['en', 'eng'], ['an', 'ang'],
  ['ui', 'iu'], ['ie', 'ei'], ['uo', 'ou'], ['un', 'ün'], ['ong', 'eng'],
];

const pinyinConfusabilityScore = (p1: string, p2: string): number => {
  if (p1 === p2) return 0;
  const base1 = stripTones(p1);
  const base2 = stripTones(p2);
  if (base1 === base2) return 5; // Only tones differ

  const syls1 = base1.split(' ');
  const syls2 = base2.split(' ');
  let score = 0;

  // Bonus for same syllable count
  if (syls1.length === syls2.length) score += 1;

  for (const s1 of syls1) {
    for (const s2 of syls2) {
      if (s1 === s2) { score += 1; continue; }
      const init1 = extractInitial(s1);
      const init2 = extractInitial(s2);
      const fin1 = extractFinal(s1);
      const fin2 = extractFinal(s2);

      // Same final, confusable initials (e.g. zuo vs zhuo)
      if (fin1 === fin2 && init1 !== init2) {
        for (const [a, b] of confusableInitials) {
          if ((init1 === a && init2 === b) || (init1 === b && init2 === a)) {
            score += 3;
            break;
          }
        }
      }
      // Same initial, confusable finals (e.g. jin vs jing)
      if (init1 === init2 && init1 !== '' && fin1 !== fin2) {
        for (const [a, b] of confusableFinals) {
          if ((fin1 === a && fin2 === b) || (fin1 === b && fin2 === a)) {
            score += 3;
            break;
          }
        }
      }
    }
  }
  return score;
};

export const pickConfusableMatchWords = <T extends WordLike>(pool: T[], count: number): T[] => {
  if (pool.length <= count) return shuffle(pool);

  // Try multiple seeds to find the best confusable group
  let bestGroup: T[] = [];
  let bestScore = -1;

  const attempts = Math.min(10, pool.length);
  const shuffledPool = shuffle(pool);

  for (let i = 0; i < attempts; i++) {
    const seed = shuffledPool[i];
    const scored = pool
      .filter(w => w.id !== seed.id)
      .map(w => ({ word: w, score: pinyinConfusabilityScore(seed.pinyin, w.pinyin) }))
      .sort((a, b) => b.score - a.score);

    const groupScore = scored.slice(0, count - 1).reduce((sum, s) => sum + s.score, 0);
    if (groupScore > bestScore) {
      bestScore = groupScore;
      bestGroup = [seed, ...scored.slice(0, count - 1).map(s => s.word)];
    }
  }

  // If no confusable words found, fallback to random
  if (bestScore === 0) {
    return shuffle(pool).slice(0, count);
  }

  return bestGroup;
};
