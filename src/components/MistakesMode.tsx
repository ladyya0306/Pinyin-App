import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Trash2, Volume2 } from 'lucide-react';
import { getMistakes, clearMistakes } from '../store';
import { playSound } from '../audio';
import { speak } from '../utils';

export const MistakesMode = ({ onBack }: { onBack: () => void }) => {
  const [mistakes, setMistakes] = useState(getMistakes());

  const handleClear = () => {
    playSound('click');
    if (window.confirm('确定要清空所有错题记录吗？')) {
      clearMistakes();
      setMistakes([]);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 relative z-10 w-full max-w-4xl mx-auto">
      <div className="w-full flex justify-between items-center mb-8 mt-4">
        <button
          onClick={() => { playSound('click'); onBack(); }}
          className="flex items-center gap-2 bg-white/80 hover:bg-white text-sky-600 px-4 py-2 rounded-full font-bold shadow-sm transition-all"
        >
          <Home className="w-5 h-5" /> 返回
        </button>
        <h2 className="text-3xl font-bold text-slate-800 bg-white/50 px-6 py-2 rounded-full">错题记录</h2>
        <button
          onClick={handleClear}
          className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-full font-bold shadow-sm transition-all"
        >
          <Trash2 className="w-5 h-5" /> 清空
        </button>
      </div>

      {mistakes.length === 0 ? (
        <div className="bg-white/80 p-12 rounded-3xl text-center shadow-lg">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-slate-700">太棒了！目前没有错题记录。</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {mistakes.slice().reverse().map((mistake) => (
            <motion.div
              key={mistake.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-3xl shadow-md flex flex-col items-center gap-4 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-orange-400"></div>
              <div className="text-6xl">{mistake.word.emoji}</div>
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-800">{mistake.word.hanzi}</div>
                <div className="text-xl font-mono text-green-600 font-bold mt-2">正确: {mistake.word.pinyin}</div>
                <div className="text-lg font-mono text-red-500 line-through">错误: {mistake.wrongAnswer}</div>
              </div>
              <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                {mistake.mistakeType}
              </div>
              <button
                onClick={() => { playSound('click'); speak(mistake.word.hanzi); }}
                className="bg-sky-100 hover:bg-sky-200 text-sky-600 p-3 rounded-full transition-all active:scale-95"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
