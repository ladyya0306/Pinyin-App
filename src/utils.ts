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
  ['b', 'd'], ['p', 'q'], ['n', 'l'], ['z', 'zh'], ['c', 'ch'], ['s', 'sh'],
  ['in', 'ing'], ['en', 'eng'], ['an', 'ang'], ['ui', 'iu'], ['ie', 'ei']
];

export const generateDistractors = (correctPinyin: string): string[] => {
  const distractors = new Set<string>();
  const words = correctPinyin.split(' ');

  // 1. Tone mistakes
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    for (let j = 0; j < word.length; j++) {
      const char = word[j];
      if (toneMap[char]) {
        for (const altTone of toneMap[char]) {
          const newWord = word.substring(0, j) + altTone + word.substring(j + 1);
          const newPinyin = [...words];
          newPinyin[i] = newWord;
          distractors.add(newPinyin.join(' '));
        }
      }
    }
  }

  // 2. Confusable initials/finals
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    for (const [a, b] of confusablePairs) {
      if (word.includes(a)) {
        const newWord = word.replace(a, b);
        const newPinyin = [...words];
        newPinyin[i] = newWord;
        distractors.add(newPinyin.join(' '));
      }
      if (word.includes(b)) {
        const newWord = word.replace(b, a);
        const newPinyin = [...words];
        newPinyin[i] = newWord;
        distractors.add(newPinyin.join(' '));
      }
    }
  }

  const distractorArray = Array.from(distractors).filter(d => d !== correctPinyin);
  return shuffle(distractorArray).slice(0, 3);
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
