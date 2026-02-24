/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Cloud, BookOpenCheck, Target, Lightbulb } from 'lucide-react';
import { PlayMode } from './components/PlayMode';
import { MistakesMode } from './components/MistakesMode';
import { TrainingMode } from './components/TrainingMode';
import { AdviceMode } from './components/AdviceMode';
import { playSound } from './audio';
import { Cat, CatState } from './components/Cat';

type Mode = 'menu' | 'play' | 'mistakes' | 'training' | 'advice';

export default function App() {
  const [mode, setMode] = useState<Mode>('menu');
  const [catState, setCatState] = useState<CatState>('idle');

  useEffect(() => {
    if (mode !== 'menu') return;
    
    const interval = setInterval(() => {
      if (catState === 'petting') return;
      const states: CatState[] = ['idle', 'licking', 'stretching', 'idle'];
      setCatState(states[Math.floor(Math.random() * states.length)]);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [mode, catState]);

  const handlePetCat = () => {
    playSound('click');
    setCatState('petting');
    setTimeout(() => setCatState('idle'), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-sky-50 font-sans overflow-hidden relative flex flex-col items-center justify-center">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 text-white/40">
        <Cloud className="w-24 h-24" />
      </div>
      <div className="absolute top-20 right-20 text-white/40">
        <Cloud className="w-32 h-32" />
      </div>
      <div className="absolute bottom-20 left-1/4 text-white/40">
        <Cloud className="w-20 h-20" />
      </div>

      {mode === 'menu' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10 w-full max-w-5xl mx-auto">
          
          {/* Cat Animation */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-4"
          >
            <Cat state={catState} onClick={handlePetCat} className="w-64 h-64" />
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-lg mb-4 tracking-wider">
              <span className="text-yellow-400">趣</span>
              <span className="text-pink-400">味</span>
              <span className="text-green-400">拼</span>
              <span className="text-sky-400">音</span>
            </h1>
            <p className="text-2xl text-sky-800 font-bold bg-white/50 inline-block px-6 py-2 rounded-full">
              快乐学拼音，轻松认汉字！
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4 relative">
            
            {/* Cat Paw Pointer */}
            <motion.div 
              className="absolute -top-16 left-[12%] z-20 pointer-events-none hidden lg:block"
              animate={{ y: [0, 10, 0], rotate: [-10, 0, -10] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <svg width="60" height="60" viewBox="0 0 100 100" className="drop-shadow-lg">
                <path d="M 50 90 L 50 30 M 30 50 L 50 30 L 70 50" fill="none" stroke="#F59E0B" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="50" cy="20" r="15" fill="#FCA5A5" />
                <circle cx="30" cy="35" r="10" fill="#FCA5A5" />
                <circle cx="70" cy="35" r="10" fill="#FCA5A5" />
              </svg>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { playSound('click'); setMode('play'); }}
              className="group relative bg-white rounded-[2rem] p-8 shadow-xl border-4 border-white flex flex-col items-center gap-4 w-full"
            >
              <div className="bg-green-100 p-6 rounded-full group-hover:bg-green-200 transition-colors">
                <Gamepad2 className="w-16 h-16 text-green-500" />
              </div>
              <span className="text-2xl font-bold text-slate-700">开始游戏</span>
              <span className="text-slate-400 font-medium text-sm">挑战拼音大师</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { playSound('click'); setMode('mistakes'); }}
              className="group relative bg-white rounded-[2rem] p-8 shadow-xl border-4 border-white flex flex-col items-center gap-4 w-full"
            >
              <div className="bg-red-100 p-6 rounded-full group-hover:bg-red-200 transition-colors">
                <BookOpenCheck className="w-16 h-16 text-red-500" />
              </div>
              <span className="text-2xl font-bold text-slate-700">错题记录</span>
              <span className="text-slate-400 font-medium text-sm">温故而知新</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { playSound('click'); setMode('training'); }}
              className="group relative bg-white rounded-[2rem] p-8 shadow-xl border-4 border-white flex flex-col items-center gap-4 w-full"
            >
              <div className="bg-orange-100 p-6 rounded-full group-hover:bg-orange-200 transition-colors">
                <Target className="w-16 h-16 text-orange-500" />
              </div>
              <span className="text-2xl font-bold text-slate-700">针对训练</span>
              <span className="text-slate-400 font-medium text-sm">攻克薄弱环节</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { playSound('click'); setMode('advice'); }}
              className="group relative bg-white rounded-[2rem] p-8 shadow-xl border-4 border-white flex flex-col items-center gap-4 w-full"
            >
              <div className="bg-yellow-100 p-6 rounded-full group-hover:bg-yellow-200 transition-colors">
                <Lightbulb className="w-16 h-16 text-yellow-500" />
              </div>
              <span className="text-2xl font-bold text-slate-700">学习建议</span>
              <span className="text-slate-400 font-medium text-sm">AI老师点评</span>
            </motion.button>
          </div>
        </div>
      )}

      {mode === 'play' && <PlayMode onBack={() => setMode('menu')} />}
      {mode === 'mistakes' && <MistakesMode onBack={() => setMode('menu')} />}
      {mode === 'training' && <TrainingMode onBack={() => setMode('menu')} />}
      {mode === 'advice' && <AdviceMode onBack={() => setMode('menu')} />}
    </div>
  );
}

