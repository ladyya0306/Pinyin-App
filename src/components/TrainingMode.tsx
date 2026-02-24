import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, PlayCircle, AlertTriangle } from 'lucide-react';
import { getMistakes } from '../store';
import { playSound } from '../audio';
import { PlayMode } from './PlayMode';
import { Word } from '../data';

export const TrainingMode = ({ onBack }: { onBack: () => void }) => {
  const [isTraining, setIsTraining] = useState(false);
  const mistakes = getMistakes();

  // Get unique words from mistakes
  const trainingWords: Word[] = Array.from(new Map(mistakes.map(m => [m.word.id, m.word])).values());

  if (isTraining) {
    return <PlayMode onBack={() => setIsTraining(false)} trainingWords={trainingWords} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10 w-full max-w-2xl mx-auto">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => { playSound('click'); onBack(); }}
          className="flex items-center gap-2 bg-white/80 hover:bg-white text-sky-600 px-4 py-2 rounded-full font-bold shadow-sm transition-all"
        >
          <Home className="w-5 h-5" /> 返回
        </button>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[3rem] shadow-2xl p-12 w-full flex flex-col items-center gap-8 border-8 border-orange-200"
      >
        <div className="bg-orange-100 p-6 rounded-full">
          <AlertTriangle className="w-20 h-20 text-orange-500" />
        </div>
        
        <h2 className="text-4xl font-bold text-slate-800">针对训练</h2>
        
        <p className="text-xl text-slate-600 text-center max-w-md">
          系统将根据你的错题记录，为你量身定制专属的练习题目，帮助你攻克难关！
        </p>

        <div className="bg-slate-50 p-6 rounded-2xl w-full text-center border-2 border-slate-100">
          <div className="text-4xl font-black text-sky-500 mb-2">{trainingWords.length}</div>
          <div className="text-slate-500 font-bold">待复习词汇</div>
        </div>

        {trainingWords.length > 0 ? (
          <button
            onClick={() => { playSound('click'); setIsTraining(true); }}
            className="w-full flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white p-6 rounded-2xl font-bold text-2xl transition-all active:scale-95 shadow-lg shadow-orange-200"
          >
            <PlayCircle className="w-8 h-8" /> 开始特训
          </button>
        ) : (
          <div className="w-full bg-green-50 p-6 rounded-2xl text-center border-2 border-green-100">
            <div className="text-2xl font-bold text-green-600 mb-2">太棒了！</div>
            <p className="text-green-700">你目前没有错题，不需要特训哦！</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
