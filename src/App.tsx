/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Cloud, BookOpenCheck, Target, Lightbulb, Heart, Coffee, Stethoscope } from 'lucide-react';
import { PlayMode } from './components/PlayMode';
import { MistakesMode } from './components/MistakesMode';
import { TrainingMode } from './components/TrainingMode';
import { AdviceMode } from './components/AdviceMode';
import { playSound } from './audio';
import { Cat, CatState, CatBreed } from './components/Cat';
import { getGrade, setGrade as saveGrade, getCatSaves, calculateOfflineProgress, updateCatSave } from './store';
import { SaveSelect } from './components/SaveSelect';
import { CatAdoption } from './components/CatAdoption';
import { CatHome } from './components/CatHome';

type Mode = 'saves' | 'adopt' | 'cathome' | 'menu' | 'play' | 'mistakes' | 'training' | 'advice';

export default function App() {
  const [mode, setMode] = useState<Mode>('saves');
  const [catState, setCatState] = useState<CatState>('idle');
  const [catPos, setCatPos] = useState({ x: 0, y: 0 });
  const [catFlip, setCatFlip] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<number>(getGrade());
  const [currentSlot, setCurrentSlot] = useState<0 | 1 | null>(null);
  const [saves, setSaves] = useState(getCatSaves());

  const activeSave = currentSlot !== null ? saves[currentSlot] : null;
  const activeCat = activeSave?.cat;

  // Recalculate offline progress when returning to menu
  useEffect(() => {
    if (mode === 'menu' && currentSlot !== null) {
      const currentSaves = getCatSaves();
      const save = currentSaves[currentSlot];
      if (save) {
        const processed = calculateOfflineProgress(save);
        if (processed.cat.hunger !== save.cat.hunger || processed.cat.happiness !== save.cat.happiness) {
          updateCatSave(currentSlot, processed);
          setSaves(getCatSaves());
        } else {
          setSaves(currentSaves);
        }
      }
    }
  }, [mode, currentSlot]);

  // Random Movement Loop
  useEffect(() => {
    if (mode !== 'menu' || !activeCat) return;

    const interval = setInterval(() => {
      setCatState(currentCatState => {
        if (currentCatState === 'petting') return currentCatState;

        const isSick = activeCat.isSick;
        const isHungry = activeCat.hunger < 30;

        if (isSick) {
          const sickStates: CatState[] = ['sad', 'lying', 'sad'];
          return sickStates[Math.floor(Math.random() * sickStates.length)];
        }

        if (isHungry) {
          if (Math.random() > 0.5) {
            const walkDirX = Math.random() > 0.5 ? 1 : -1;
            const walkDirY = Math.random() > 0.5 ? 1 : -1;
            setCatFlip(walkDirX === 1);
            setCatPos(p => ({
              x: Math.max(-window.innerWidth + 200, Math.min(50, p.x + walkDirX * (Math.random() * 40 + 20))),
              y: Math.max(-20, Math.min(window.innerHeight - 300, p.y + walkDirY * (Math.random() * 30 + 10)))
            }));
            setTimeout(() => setCatState('expectant'), 1500);
            return 'walking';
          }
          return 'expectant';
        }

        const rand = Math.random();
        if (rand < 0.3) {
          const walkDirX = Math.random() > 0.5 ? 1 : -1;
          const walkDirY = Math.random() > 0.5 ? 1 : -1;
          setCatFlip(walkDirX === 1);
          setCatPos(p => ({
            x: Math.max(-window.innerWidth + 200, Math.min(50, p.x + walkDirX * (Math.random() * 100 + 40))),
            y: Math.max(-20, Math.min(window.innerHeight - 300, p.y + walkDirY * (Math.random() * 80 + 20)))
          }));
          return 'walking';
        } else if (rand < 0.5) {
          return 'lying';
        } else if (rand < 0.7) {
          return 'licking';
        } else if (rand < 0.8) {
          return 'stretching';
        } else {
          return 'idle';
        }
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [mode, activeCat]);

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

      {mode === 'saves' && (
        <SaveSelect
          onSelectSlot={(idx) => { setCurrentSlot(idx); setMode('menu'); }}
          onNewSave={(idx) => { setCurrentSlot(idx); setMode('adopt'); }}
        />
      )}

      {mode === 'adopt' && currentSlot !== null && (
        <CatAdoption
          slotIndex={currentSlot}
          onAdopted={(idx) => { setCurrentSlot(idx); setMode('menu'); }}
          onBack={() => { setMode('saves'); setCurrentSlot(null); }}
        />
      )}

      {mode === 'cathome' && currentSlot !== null && (
        <CatHome slotIndex={currentSlot} onBack={() => setMode('menu')} />
      )}

      {mode === 'menu' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10 w-full max-w-5xl mx-auto">

          {/* Active Cat Mascot in Menu */}
          {activeCat && (
            <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2">
              <div className="flex items-center gap-4 bg-white/60 p-2 rounded-2xl shadow-sm backdrop-blur-sm">
                <div className="flex flex-col gap-1 text-sm font-bold w-24">
                  <div className="flex items-center gap-1 text-orange-500">
                    <Coffee className="w-4 h-4" />
                    <div className="flex-1 bg-white rounded-full h-2 overflow-hidden"><div className="bg-orange-400 h-full" style={{ width: `${activeCat.hunger}%` }} /></div>
                  </div>
                  <div className="flex items-center gap-1 text-pink-500">
                    <Heart className="w-4 h-4" />
                    <div className="flex-1 bg-white rounded-full h-2 overflow-hidden"><div className="bg-pink-400 h-full" style={{ width: `${activeCat.happiness}%` }} /></div>
                  </div>
                  <div className="flex items-center gap-1 text-green-500">
                    <Stethoscope className="w-4 h-4" />
                    <div className="flex-1 bg-white rounded-full h-2 overflow-hidden"><div className="bg-green-400 h-full" style={{ width: `${activeCat.health}%` }} /></div>
                  </div>
                </div>
                <button
                  onClick={() => { playSound('click'); setMode('cathome'); }}
                  className="bg-white hover:bg-orange-50 text-orange-500 font-bold px-4 py-2 rounded-xl shadow-md transition-all active:scale-95"
                >
                  猫咪小屋
                </button>
              </div>

              <motion.div
                animate={{ x: catPos.x, y: catPos.y }}
                transition={{ type: "spring", stiffness: 40, damping: 25 }}
                whileHover={{ scale: 1.1, cursor: 'grab' }}
                whileTap={{ scale: 0.95, cursor: 'grabbing' }}
                drag
                dragMomentum={false}
                onDragStart={() => {
                  setCatState('expectant');
                  playSound('click');
                }}
                onDragEnd={(e, info) => {
                  setCatPos(p => ({
                    x: p.x + info.offset.x,
                    y: p.y + info.offset.y
                  }));
                  setCatState('idle');
                }}
                className="mt-8 z-50 pointer-events-auto"
              >
                <Cat
                  state={catState}
                  breed={activeCat.breed}
                  onClick={undefined} // handled by drag now
                  flipX={catFlip}
                  className="w-32 h-32 drop-shadow-md"
                />
              </motion.div>
            </div>
          )}

          {/* Change Save Button */}
          <div className="absolute top-4 left-4 z-50">
            <button
              onClick={() => { playSound('click'); setMode('saves'); setCurrentSlot(null); }}
              className="bg-white/80 hover:bg-white text-sky-600 font-bold px-4 py-2 rounded-full shadow-sm transition-all"
            >
              切换存档
            </button>
          </div>

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
            <p className="text-2xl text-sky-800 font-bold bg-white/50 inline-block px-6 py-2 rounded-full mb-8">
              快乐学拼音，轻松认汉字！
            </p>

            {/* Grade Selector */}
            <div className="bg-white/80 p-4 rounded-3xl shadow-md inline-block">
              <span className="text-slate-600 font-bold mr-4">选择年级:</span>
              <div className="flex flex-wrap gap-2 justify-center mt-2 sm:mt-0 sm:inline-flex">
                {[1, 2, 3, 4, 5, 6].map((grade) => (
                  <button
                    key={grade}
                    onClick={() => {
                      playSound('click');
                      setSelectedGrade(grade);
                      saveGrade(grade);
                    }}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${selectedGrade === grade
                      ? 'bg-sky-500 text-white shadow-lg scale-105'
                      : 'bg-white text-slate-500 hover:bg-sky-100 hover:text-sky-600'
                      }`}
                  >
                    {grade}年级
                  </button>
                ))}
              </div>
            </div>
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

      {mode === 'play' && currentSlot !== null && <PlayMode grade={selectedGrade} slotIndex={currentSlot} onBack={() => setMode('menu')} />}
      {mode === 'mistakes' && <MistakesMode onBack={() => setMode('menu')} />}
      {mode === 'training' && currentSlot !== null && <TrainingMode grade={selectedGrade} slotIndex={currentSlot} onBack={() => setMode('menu')} />}
      {mode === 'advice' && <AdviceMode grade={selectedGrade} onBack={() => setMode('menu')} />}
    </div>
  );
}

