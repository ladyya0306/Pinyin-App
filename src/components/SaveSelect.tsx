import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Trash2 } from 'lucide-react';
import { getCatSaves, SaveSlot, deleteCatSave } from '../store';
import { playSound } from '../audio';
import { Cat } from './Cat';

export const SaveSelect = ({ onSelectSlot, onNewSave }: { onSelectSlot: (index: 0 | 1) => void, onNewSave: (index: 0 | 1) => void }) => {
    const [saves, setSaves] = useState<SaveSlot>([null, null]);

    useEffect(() => {
        setSaves(getCatSaves());
    }, []);

    const handleDelete = (index: 0 | 1, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('确定要删除这个存档吗？所有数据将永久丢失！')) {
            deleteCatSave(index);
            setSaves(getCatSaves());
            playSound('click');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10 w-full max-w-4xl mx-auto">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-12"
            >
                <h1 className="text-5xl font-black text-white drop-shadow-lg mb-4">
                    选择存档
                </h1>
                <p className="text-xl text-sky-800 font-bold bg-white/50 inline-block px-6 py-2 rounded-full">
                    你的猫咪正在等你回家！
                </p>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
                {[0, 1].map((idx) => {
                    const slot = saves[idx as 0 | 1];
                    return (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: slot ? 1.02 : 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative bg-white rounded-[2rem] p-8 shadow-xl border-4 ${slot ? 'border-sky-300 cursor-pointer' : 'border-dashed border-slate-300 cursor-pointer hover:border-sky-400'} flex flex-col items-center gap-4 w-full md:w-1/2 min-h-[300px] justify-center transition-colors`}
                            onClick={() => {
                                playSound('click');
                                if (slot) {
                                    onSelectSlot(idx as 0 | 1);
                                } else {
                                    onNewSave(idx as 0 | 1);
                                }
                            }}
                        >
                            {slot ? (
                                <>
                                    <div className="absolute top-4 right-4 z-10">
                                        <button
                                            onClick={(e) => handleDelete(idx as 0 | 1, e)}
                                            className="p-2 bg-red-100 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                            title="删除存档"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <Cat state="idle" breed={slot.cat.breed} className="w-32 h-32 scale-90" />
                                    <h2 className="text-2xl font-bold text-slate-800 mt-2">{slot.playerId} 的存档</h2>
                                    <div className="flex gap-4 text-slate-600 font-medium text-sm">
                                        <span className="bg-sky-50 px-3 py-1 rounded-full text-sky-600 font-bold">积分: {slot.score}</span>
                                        <span className="bg-orange-50 px-3 py-1 rounded-full text-orange-600 font-bold">猫咪年龄: {slot.cat.age} 月</span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-white bg-sky-500 hover:bg-sky-600 px-6 py-2 rounded-full font-bold transition-colors">
                                        <Play className="w-5 h-5" /> 继续游戏
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="bg-slate-100 p-6 rounded-full text-slate-400 mb-4 transition-colors group-hover:bg-sky-100 group-hover:text-sky-500 flex items-center justify-center">
                                        <Plus className="w-12 h-12" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-500">空存档位</h2>
                                    <span className="text-slate-400 font-medium">点击领养专属猫咪</span>
                                </>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
