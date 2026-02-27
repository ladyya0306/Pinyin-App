import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Home, Star, Trophy, AlertCircle, RefreshCw, PlayCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Word, getWordsByGrade } from '../data';
import { shuffle, generateDistractors, analyzeMistake, speak, playKeepTrying } from '../utils';
import { playSound } from '../audio';
import { addMistake, updateCatSave } from '../store';
import { Cat, CatState, CatBreed } from './Cat';

const ROUNDS_PER_GAME = 10;
const CAT_BREEDS: CatBreed[] = ['orange', 'cow', 'calico', 'shorthair', 'ragdoll', 'devon'];

type QuestionType = 'choose_pinyin' | 'complete_pinyin' | 'match_pairs';

export const PlayMode = ({ grade, slotIndex, onBack, trainingWords }: { grade: number, slotIndex: 0 | 1, onBack: () => void, trainingWords?: Word[] }) => {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [wrongOption, setWrongOption] = useState<string | null>(null);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [mistakes, setMistakes] = useState<Record<string, number>>({});
  const [questionType, setQuestionType] = useState<QuestionType>('choose_pinyin');
  const [catState, setCatState] = useState<CatState>('expectant');
  const [catBreed, setCatBreed] = useState<CatBreed>('orange');

  useEffect(() => {
    // Randomize cat breed on mount
    setCatBreed(CAT_BREEDS[Math.floor(Math.random() * CAT_BREEDS.length)]);
  }, []);

  // For complete_pinyin
  const [displayPinyin, setDisplayPinyin] = useState('');
  const [correctChar, setCorrectChar] = useState('');

  // For match_pairs
  const [leftItems, setLeftItems] = useState<{ id: string, text: string, matched: boolean }[]>([]);
  const [rightItems, setRightItems] = useState<{ id: string, text: string, matched: boolean }[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  const currentWords = useMemo(() => getWordsByGrade(grade), [grade]);
  const pool = trainingWords && trainingWords.length > 0 ? trainingWords : currentWords;

  const generateQuestion = () => {
    setCatState('expectant');
    const types: QuestionType[] = ['choose_pinyin', 'complete_pinyin', 'match_pairs'];
    const qType = types[Math.floor(Math.random() * types.length)];
    setQuestionType(qType);

    const pickUnseenWords = (count: number): Word[] => {
      if (trainingWords && trainingWords.length > 0) {
        return shuffle(pool).slice(0, count);
      }
      const storageKey = `pinyin_seen_words_${grade}`;
      let seenIds: string[] = [];
      try {
        const data = localStorage.getItem(storageKey);
        if (data) seenIds = JSON.parse(data);
      } catch (e) { }

      let unseenPool = pool.filter(w => !seenIds.includes(w.id));
      if (unseenPool.length < count) {
        seenIds = [];
        unseenPool = pool;
      }

      const picked = shuffle(unseenPool).slice(0, count);
      picked.forEach(w => seenIds.push(w.id));
      try {
        localStorage.setItem(storageKey, JSON.stringify(seenIds));
      } catch (e) { }

      return picked;
    };

    if (qType === 'choose_pinyin') {
      const randomWord = pickUnseenWords(1)[0];
      setCurrentWord(randomWord);
      let distractors = generateDistractors(randomWord.pinyin);
      if (distractors.length < 3) {
        const otherWords = currentWords.filter(w => w.id !== randomWord.id && !distractors.includes(w.pinyin));
        const shuffledOthers = shuffle(otherWords).slice(0, 3 - distractors.length);
        distractors = [...distractors, ...shuffledOthers.map(w => w.pinyin)];
      }
      setOptions(shuffle([randomWord.pinyin, ...distractors.slice(0, 3)]));
      setTimeout(() => speak(randomWord.hanzi), 500);
    }
    else if (qType === 'complete_pinyin') {
      const randomWord = pickUnseenWords(1)[0];
      setCurrentWord(randomWord);

      const words = randomWord.pinyin.split(' ');
      // Pick a random word from the phrase (if multi-syllable)
      const wordIndex = Math.floor(Math.random() * words.length);
      const targetPinyinWord = words[wordIndex];

      // Identify parts
      let initial = '';
      let final = targetPinyinWord;

      // Simple regex to extract initial and final (handles most cases)
      const initialRegex = /^(zh|ch|sh|b|p|m|f|d|t|n|l|g|k|h|j|q|x|z|c|s|y|w)/;
      const match = targetPinyinWord.match(initialRegex);
      if (match) {
        initial = match[1];
        final = targetPinyinWord.substring(initial.length);
      }

      const dropStrategy = Math.floor(Math.random() * 3); // 0: single vowel, 1: initial, 2: final
      let targetChar = '';
      let displayTemplate = targetPinyinWord; // e.g. "zh_ _"

      if (dropStrategy === 1 && initial.length > 0) {
        // Drop initial
        targetChar = initial;
        displayTemplate = displayTemplate.replace(initial, '_'.repeat(initial.length));
      } else if (dropStrategy === 2 && final.length > 0) {
        // Drop final
        targetChar = final;
        displayTemplate = displayTemplate.replace(final, '_'.repeat(final.length));
      } else {
        // Drop single vowel (fallback)
        const vowels = 'āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜaeiouü';
        let targetIndex = -1;
        for (let i = 0; i < targetPinyinWord.length; i++) {
          if (vowels.includes(targetPinyinWord[i])) {
            targetChar = targetPinyinWord[i];
            targetIndex = i;
            if (Math.random() > 0.5) break;
          }
        }
        if (targetIndex === -1) {
          targetIndex = 0;
          targetChar = targetPinyinWord[0];
        }
        displayTemplate = targetPinyinWord.substring(0, targetIndex) + '_' + targetPinyinWord.substring(targetIndex + 1);
      }

      // Reconstruct the full display pinyin (if multi-word)
      const newWords = [...words];
      newWords[wordIndex] = displayTemplate;
      setDisplayPinyin(newWords.join(' '));
      setCorrectChar(targetChar);

      // Generate distractors
      const opts = new Set<string>();
      opts.add(targetChar);

      if (dropStrategy === 1 && initial.length > 0) { // Distractors for initials
        const initDistractors = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'z', 'c', 's', 'zh', 'ch', 'sh'];
        if (targetChar === 'z') opts.add('zh'); else if (targetChar === 'zh') opts.add('z');
        if (targetChar === 'c') opts.add('ch'); else if (targetChar === 'ch') opts.add('c');
        if (targetChar === 's') opts.add('sh'); else if (targetChar === 'sh') opts.add('s');
        if (targetChar === 'n') opts.add('l'); else if (targetChar === 'l') opts.add('n');

        while (opts.size < 4) {
          opts.add(initDistractors[Math.floor(Math.random() * initDistractors.length)]);
        }
      } else if (dropStrategy === 2 && final.length > 0) { // Distractors for finals
        let baseTarget = targetChar.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (baseTarget.includes('in') && !baseTarget.includes('ing')) opts.add(targetChar.replace('n', 'ng'));
        if (baseTarget.includes('ing')) opts.add(targetChar.replace('ng', 'n'));
        if (baseTarget.includes('en') && !baseTarget.includes('eng')) opts.add(targetChar.replace('n', 'ng'));
        if (baseTarget.includes('eng')) opts.add(targetChar.replace('ng', 'n'));
        if (baseTarget.includes('an') && !baseTarget.includes('ang')) opts.add(targetChar.replace('n', 'ng'));
        if (baseTarget.includes('ang')) opts.add(targetChar.replace('ng', 'n'));
        if (baseTarget.includes('ui')) opts.add(targetChar.replace('ui', 'iu'));
        if (baseTarget.includes('iu')) opts.add(targetChar.replace('iu', 'ui'));
        if (baseTarget.includes('ie')) opts.add(targetChar.replace('ie', 'ei'));
        if (baseTarget.includes('ei')) opts.add(targetChar.replace('ei', 'ie'));

        const commonFinals = ['a', 'o', 'e', 'i', 'u', 'ai', 'ei', 'ui', 'ao', 'ou', 'iu', 'ie', 'ue', 'er', 'an', 'en', 'in', 'un', 'ang', 'eng', 'ing', 'ong'];
        while (opts.size < 4) {
          opts.add(commonFinals[Math.floor(Math.random() * commonFinals.length)]);
        }
      } else { // Distractors for single vowels
        const distractorVowels = 'āáǎàōóǒòēéěèīíǐìūúǔù';
        while (opts.size < 4) {
          opts.add(distractorVowels[Math.floor(Math.random() * distractorVowels.length)]);
        }
      }

      setOptions(shuffle(Array.from(opts)).slice(0, 4));
      setTimeout(() => speak(randomWord.hanzi), 500);
    }
    else if (qType === 'match_pairs') {
      const pairWords = pickUnseenWords(3);
      setLeftItems(shuffle(pairWords.map(w => ({ id: w.id, text: w.hanzi, matched: false }))));
      setRightItems(shuffle(pairWords.map(w => ({ id: w.id, text: w.pinyin, matched: false }))));
      setSelectedLeft(null);
      setSelectedRight(null);
    }

    setWrongOption(null);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  // Handle match pairs logic
  useEffect(() => {
    if (questionType === 'match_pairs' && selectedLeft && selectedRight) {
      if (selectedLeft === selectedRight) {
        playSound('success');
        setCatState('happy');
        setLeftItems(prev => prev.map(item => item.id === selectedLeft ? { ...item, matched: true } : item));
        setRightItems(prev => prev.map(item => item.id === selectedRight ? { ...item, matched: true } : item));
        setSelectedLeft(null);
        setSelectedRight(null);

        // Check if all matched
        if (leftItems.filter(item => item.id !== selectedLeft && !item.matched).length === 0) {
          handleCorrectAnswer();
        } else {
          setTimeout(() => setCatState('expectant'), 1000);
        }
      } else {
        playSound('error');
        setCatState('sad');
        playKeepTrying();
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setCatState('expectant');
        }, 1000);
      }
    }
  }, [selectedLeft, selectedRight, questionType]);

  const handleCorrectAnswer = () => {
    playSound('success');
    playSound('meow');
    setCatState('happy');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF6347', '#4682B4', '#32CD32']
    });
    speak('太棒了！');
    setScore(s => s + 1);

    updateCatSave(slotIndex, (prev) => {
      const newScore = prev.score + 1;
      const newCorrectCount = prev.cat.correctAnswersCount + 1;
      let newAge = prev.cat.age;

      if (newCorrectCount % 50 === 0 && newAge < 12) {
        newAge += 1;
      }
      return {
        ...prev,
        score: newScore,
        cat: {
          ...prev.cat,
          correctAnswersCount: newCorrectCount,
          age: newAge
        }
      };
    });

    if (round >= ROUNDS_PER_GAME) {
      setTimeout(() => {
        setGameOver(true);
        playSound('win');
        confetti({
          particleCount: 300,
          spread: 100,
          origin: { y: 0.3 },
          colors: ['#FFD700', '#FF6347', '#4682B4', '#32CD32', '#FF1493']
        });
      }, 1500);
    } else {
      setTimeout(() => {
        setRound(r => r + 1);
        generateQuestion();
      }, 2000);
    }
  };

  const handleWrongAnswer = (option: string, mistakeType: string) => {
    playSound('error');
    setCatState('sad');
    setWrongOption(option);
    playKeepTrying();

    setMistakes(prev => ({
      ...prev,
      [mistakeType]: (prev[mistakeType] || 0) + 1
    }));

    if (currentWord) {
      addMistake({
        word: currentWord,
        wrongAnswer: option,
        mistakeType
      });
    }

    setTimeout(() => {
      setWrongOption(null);
      setCatState('expectant');
    }, 1500);
  };

  const handleOptionClick = (option: string) => {
    if (gameOver || catState === 'happy' || wrongOption !== null) return;

    if (questionType === 'choose_pinyin') {
      if (option === currentWord?.pinyin) {
        handleCorrectAnswer();
      } else {
        handleWrongAnswer(option, analyzeMistake(currentWord!.pinyin, option));
      }
    } else if (questionType === 'complete_pinyin') {
      if (option === correctChar) {
        handleCorrectAnswer();
      } else {
        handleWrongAnswer(option, '拼写补全 (Spelling Completion)');
      }
    }
  };

  const restartGame = () => {
    playSound('click');
    setScore(0);
    setRound(1);
    setMistakes({});
    setGameOver(false);
    generateQuestion();
  };

  if (gameOver) {
    const sortedMistakes = Object.entries(mistakes).sort((a, b) => Number(b[1]) - Number(a[1]));

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10 w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[3rem] shadow-2xl p-8 w-full max-w-md flex flex-col items-center gap-6 border-8 border-yellow-300"
        >
          <Trophy className="w-24 h-24 text-yellow-400 mb-2" />
          <h2 className="text-4xl font-bold text-slate-800">挑战完成！</h2>

          <div className="flex items-center gap-2 text-2xl font-bold text-yellow-600 bg-yellow-100 px-6 py-3 rounded-full">
            <Star className="w-8 h-8 fill-yellow-500" />
            得分: {score} / {ROUNDS_PER_GAME}
          </div>

          {sortedMistakes.length > 0 ? (
            <div className="w-full bg-slate-50 p-6 rounded-3xl mt-4">
              <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-orange-500" />
                本局错题分析：
              </h3>
              <ul className="space-y-3">
                {sortedMistakes.slice(0, 3).map(([type, count]) => (
                  <li key={type} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                    <span className="font-bold text-slate-600">{type}</span>
                    <span className="text-orange-500 font-bold bg-orange-100 px-3 py-1 rounded-full">错 {count} 次</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="w-full bg-green-50 p-6 rounded-3xl mt-4 text-center flex flex-col items-center">
              <Cat state="clapping" breed={catBreed} className="w-32 h-32 mb-4 drop-shadow-lg" />
              <h3 className="text-2xl font-bold text-green-600 mb-2">太完美了！</h3>
              <p className="text-green-700">你没有犯任何错误，继续保持！</p>
            </div>
          )}

          <div className="flex gap-4 mt-6 w-full">
            <button
              onClick={() => { playSound('click'); onBack(); }}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 p-4 rounded-2xl font-bold transition-all active:scale-95"
            >
              <Home className="w-6 h-6" /> 返回主页
            </button>
            <button
              onClick={restartGame}
              className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white p-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-sky-200"
            >
              <RefreshCw className="w-6 h-6" /> 再玩一次
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10 w-full">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => { playSound('click'); onBack(); }}
          className="flex items-center gap-2 bg-white/80 hover:bg-white text-sky-600 px-4 py-2 rounded-full font-bold shadow-sm transition-all"
        >
          <Home className="w-5 h-5" /> 返回
        </button>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-4">
        <div className="bg-white/80 text-slate-600 px-4 py-2 rounded-full font-bold shadow-sm">
          第 {round}/{ROUNDS_PER_GAME} 题
        </div>
        <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold shadow-sm border-2 border-yellow-300">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="text-xl">{score}</span>
        </div>
      </div>

      <div className="absolute top-20 right-10">
        <Cat state={catState} breed={catBreed} className="w-32 h-32" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={round}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="bg-white rounded-[3rem] shadow-2xl p-8 w-full max-w-md flex flex-col items-center gap-8 border-8 border-white/50 mt-16"
        >

          {questionType === 'choose_pinyin' && currentWord && (
            <>
              <div className="text-9xl">{currentWord.emoji}</div>
              <div className="text-5xl font-bold text-slate-800">{currentWord.hanzi}</div>
              <button
                onClick={() => { playSound('click'); speak(currentWord.hanzi); }}
                className="bg-sky-100 hover:bg-sky-200 text-sky-600 p-4 rounded-full shadow-sm transition-all active:scale-95"
              >
                <Volume2 className="w-8 h-8" />
              </button>
              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                {options.map((option, index) => (
                  <motion.button
                    key={index}
                    animate={wrongOption === option ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    onClick={() => handleOptionClick(option)}
                    className={`text-3xl py-6 px-4 rounded-2xl font-bold shadow-md transition-all active:scale-95 font-mono tracking-widest ${wrongOption === option
                      ? 'bg-red-100 text-red-600 border-2 border-red-300'
                      : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-2 border-sky-200'
                      }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </>
          )}

          {questionType === 'complete_pinyin' && currentWord && (
            <>
              <div className="text-9xl">{currentWord.emoji}</div>
              <div className="text-5xl font-bold text-slate-800">{currentWord.hanzi}</div>
              <div className="text-5xl font-mono text-sky-500 font-bold tracking-widest">{displayPinyin}</div>
              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                {options.map((option, index) => (
                  <motion.button
                    key={index}
                    animate={wrongOption === option ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    onClick={() => handleOptionClick(option)}
                    className={`text-4xl py-6 px-4 rounded-2xl font-bold shadow-md transition-all active:scale-95 font-mono ${wrongOption === option
                      ? 'bg-red-100 text-red-600 border-2 border-red-300'
                      : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-2 border-orange-200'
                      }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </>
          )}

          {questionType === 'match_pairs' && (
            <div className="w-full flex flex-col items-center gap-6">
              <h3 className="text-2xl font-bold text-slate-700 mb-2">连线匹配</h3>
              <div className="flex justify-between w-full gap-4">
                {/* Left Column (Hanzi) */}
                <div className="flex flex-col gap-4 w-1/2">
                  {leftItems.map(item => (
                    <motion.button
                      key={item.id}
                      onClick={() => !item.matched && handleMatchClick('left', item.id)}
                      className={`text-3xl py-4 rounded-2xl font-bold transition-all ${item.matched
                        ? 'bg-green-100 text-green-600 border-2 border-green-300 opacity-50'
                        : selectedLeft === item.id
                          ? 'bg-sky-500 text-white shadow-lg scale-105'
                          : 'bg-sky-50 text-sky-700 border-2 border-sky-200 hover:bg-sky-100'
                        }`}
                      disabled={item.matched}
                    >
                      {item.text}
                    </motion.button>
                  ))}
                </div>

                {/* Right Column (Pinyin) */}
                <div className="flex flex-col gap-4 w-1/2">
                  {rightItems.map(item => (
                    <motion.button
                      key={item.id}
                      onClick={() => !item.matched && handleMatchClick('right', item.id)}
                      className={`text-2xl py-4 rounded-2xl font-bold font-mono transition-all ${item.matched
                        ? 'bg-green-100 text-green-600 border-2 border-green-300 opacity-50'
                        : selectedRight === item.id
                          ? 'bg-orange-500 text-white shadow-lg scale-105'
                          : 'bg-orange-50 text-orange-700 border-2 border-orange-200 hover:bg-orange-100'
                        }`}
                      disabled={item.matched}
                    >
                      {item.text}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );

  function handleMatchClick(side: 'left' | 'right', id: string) {
    if (gameOver || catState === 'happy' || catState === 'sad') return;
    playSound('click');
    if (side === 'left') setSelectedLeft(id);
    else setSelectedRight(id);
  }
};
