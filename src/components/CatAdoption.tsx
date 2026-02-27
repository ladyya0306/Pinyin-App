import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cat, CatBreed } from './Cat';
import { createCatSave } from '../store';
import { playSound } from '../audio';
import { Check, ArrowLeft, Cat as CatIcon } from 'lucide-react';

const CAT_BREEDS: CatBreed[] = ['orange', 'cow', 'calico', 'shorthair', 'ragdoll', 'devon'];
const BREED_NAMES: Record<CatBreed, string> = {
    orange: '大橘猫',
    cow: '奶牛猫',
    calico: '三花猫',
    shorthair: '银渐层',
    ragdoll: '布偶猫',
    devon: '德文卷毛猫'
};

export const CatAdoption = ({ slotIndex, onAdopted, onBack }: { slotIndex: 0 | 1, onAdopted: (index: 0 | 1) => void, onBack: () => void }) => {
    const [playerName, setPlayerName] = useState('');
    const [catName, setCatName] = useState('');
    const [selectedBreed, setSelectedBreed] = useState<CatBreed | null>(null);

    const handleAdopt = () => {
        if (!playerName.trim() || !catName.trim() || !selectedBreed) return;
        playSound('success');
        playSound('meow');
        createCatSave(slotIndex, playerName.trim(), selectedBreed, catName.trim());
        onAdopted(slotIndex);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10 w-full max-w-5xl mx-auto">
            <button
                onClick={() => { playSound('click'); onBack(); }}
                className="absolute top-4 left-4 flex items-center gap-2 bg-white/80 hover:bg-white text-sky-600 px-4 py-2 rounded-full font-bold shadow-sm transition-all"
            >
                <ArrowLeft className="w-5 h-5" /> 返回
            </button>

            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-6 bg-white/90 p-8 rounded-3xl shadow-xl border-4 border-white w-full max-w-2xl"
            >
                <h1 className="text-4xl font-black text-slate-800 mb-6 flex items-center justify-center gap-4">
                    <CatIcon className="w-10 h-10 text-orange-500" /> 领养专属猫咪
                </h1>

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <label className="block text-slate-600 font-bold mb-2 text-lg">主人，怎么称呼你？</label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="你的昵称"
                            maxLength={10}
                            className="w-full text-center text-xl p-3 rounded-2xl border-2 border-slate-200 focus:border-sky-400 outline-none bg-slate-50 font-bold text-sky-600"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-slate-600 font-bold mb-2 text-lg">给猫咪起个名字吧！</label>
                        <input
                            type="text"
                            value={catName}
                            onChange={(e) => setCatName(e.target.value)}
                            placeholder="猫咪昵称 (例如: 咪咪)"
                            maxLength={10}
                            className="w-full text-center text-xl p-3 rounded-2xl border-2 border-slate-200 focus:border-orange-400 outline-none bg-slate-50 font-bold text-orange-600"
                        />
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl mb-8">
                {CAT_BREEDS.map((breed) => (
                    <motion.div
                        key={breed}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { playSound('click'); setSelectedBreed(breed); }}
                        className={`cursor-pointer bg-white rounded-3xl p-4 shadow-md border-4 flex flex-col items-center gap-2 transition-colors relative ${selectedBreed === breed ? 'border-sky-400 bg-sky-50' : 'border-transparent hover:border-sky-200'}`}
                    >
                        <Cat state={selectedBreed === breed ? 'stretching' : 'idle'} breed={breed} className="w-24 h-24" />
                        <span className={`font-bold text-lg ${selectedBreed === breed ? 'text-sky-600' : 'text-slate-600'}`}>
                            {BREED_NAMES[breed]}
                        </span>
                        {selectedBreed === breed && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2 bg-sky-400 text-white rounded-full p-1 shadow-sm"
                            >
                                <Check className="w-5 h-5" />
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>

            <motion.button
                animate={playerName.trim() && catName.trim() && selectedBreed ? { scale: [1, 1.05, 1] } : {}}
                transition={playerName.trim() && catName.trim() && selectedBreed ? { repeat: Infinity, duration: 2 } : {}}
                disabled={!playerName.trim() || !catName.trim() || !selectedBreed}
                onClick={handleAdopt}
                className={`px-12 py-4 rounded-full text-2xl font-bold shadow-xl flex items-center gap-3 transition-colors ${playerName.trim() && catName.trim() && selectedBreed
                        ? 'bg-sky-500 hover:bg-sky-600 text-white cursor-pointer active:scale-95'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-70'
                    }`}
            >
                完成领养 <Check className="w-6 h-6" />
            </motion.button>
        </div>
    );
};
