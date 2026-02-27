import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cat, CatState } from './Cat';
import { getCatSaves, updateCatSave, CatData, calculateOfflineProgress } from '../store';
import { playSound } from '../audio';
import { Home, ShoppingBag, Heart, Coffee, Stethoscope, Star } from 'lucide-react';

export const CatHome = ({ slotIndex, onBack }: { slotIndex: 0 | 1, onBack: () => void }) => {
    const [saveData, setSaveData] = useState<CatData | null>(null);
    const [catState, setCatState] = useState<CatState>('idle');

    useEffect(() => {
        const rawSaves = getCatSaves();
        const data = rawSaves[slotIndex];
        if (data) {
            const processed = calculateOfflineProgress(data);
            if (processed.cat.hunger !== data.cat.hunger || processed.cat.happiness !== data.cat.happiness) {
                updateCatSave(slotIndex, processed);
            }
            setSaveData(processed);

            if (processed.cat.isSick) {
                setCatState('sad');
            } else if (processed.cat.hunger < 30 || processed.cat.happiness < 30) {
                setCatState('expectant');
            }
        }
    }, [slotIndex]);

    const handleUpdate = (updates: Partial<CatData> | ((prev: CatData) => CatData)) => {
        updateCatSave(slotIndex, updates);
        const newSaves = getCatSaves();
        setSaveData(newSaves[slotIndex]);
    };

    if (!saveData) return null;

    const { score, cat, inventory } = saveData;

    const handleBuy = (item: 'food' | 'toy' | 'medicine', cost: number) => {
        if (score < cost) {
            playSound('error');
            return;
        }
        playSound('click');
        handleUpdate(prev => ({
            ...prev,
            score: prev.score - cost,
            inventory: { ...prev.inventory, [item]: prev.inventory[item] + 1 }
        }));
    };

    const handleUse = (action: 'feed' | 'play' | 'heal') => {
        if (action === 'feed') {
            if (inventory.food > 0) {
                playSound('success');
                setCatState('licking');
                setTimeout(() => {
                    const currentCat = getCatSaves()[slotIndex]?.cat;
                    setCatState(currentCat?.isSick ? 'sad' : 'idle');
                }, 2000);
                handleUpdate(prev => ({
                    ...prev,
                    inventory: { ...prev.inventory, food: prev.inventory.food - 1 },
                    cat: { ...prev.cat, hunger: Math.min(100, prev.cat.hunger + 30) }
                }));
            } else {
                playSound('error');
            }
        } else if (action === 'play') {
            if (cat.isSick) {
                playSound('error');
                return;
            }
            if (inventory.toy > 0) {
                playSound('success');
                setCatState('happy');
                setTimeout(() => setCatState('idle'), 2000);
                handleUpdate(prev => ({
                    ...prev,
                    inventory: { ...prev.inventory, toy: prev.inventory.toy - 1 },
                    cat: { ...prev.cat, happiness: Math.min(100, prev.cat.happiness + 30) }
                }));
            } else {
                playSound('error');
            }
        } else if (action === 'heal') {
            if (inventory.medicine > 0 && cat.isSick) {
                playSound('success');
                setCatState('happy');
                setTimeout(() => setCatState('idle'), 2000);
                handleUpdate(prev => ({
                    ...prev,
                    inventory: { ...prev.inventory, medicine: prev.inventory.medicine - 1 },
                    cat: { ...prev.cat, isSick: false, health: 100 }
                }));
            } else {
                playSound('error');
            }
        }
    };

    const ageScale = 0.7 + (cat.age / 12) * 0.5;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10 w-full max-w-6xl mx-auto">
            <button
                onClick={() => { playSound('click'); onBack(); }}
                className="absolute top-4 left-4 flex items-center gap-2 bg-white/80 hover:bg-white text-sky-600 px-4 py-2 rounded-full font-bold shadow-sm transition-all z-50"
            >
                <Home className="w-5 h-5" /> 返回主菜单
            </button>

            <div className="absolute top-4 right-4 flex items-center gap-4 z-50">
                <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-6 py-2 rounded-full font-bold shadow-sm border-2 border-yellow-300">
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl">{score}</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row w-full gap-8 mt-16 h-full items-stretch">

                {/* Left Panel: Status */}
                <div className="bg-white/90 rounded-[3rem] p-8 shadow-2xl flex-1 flex flex-col gap-6 border-4 border-white">
                    <h2 className="text-3xl font-black text-slate-700 mb-2 border-b-2 border-slate-100 pb-4 flex items-center justify-between">
                        {cat.name}
                        <span className="text-sm text-sky-500 font-bold bg-sky-50 px-3 py-1 rounded-full">第 {cat.age} 个月</span>
                    </h2>

                    <div className="space-y-6 flex-1">
                        <StatusBar label="饥饿度" value={cat.hunger} color="bg-orange-400" icon={<Coffee className="w-5 h-5 text-white" />} />
                        <StatusBar label="心情值" value={cat.happiness} color="bg-pink-400" icon={<Heart className="w-5 h-5 text-white" />} />
                        <StatusBar label="健康值" value={cat.health} color="bg-green-400" icon={<Stethoscope className="w-5 h-5 text-white" />} />

                        {cat.isSick && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-xl font-bold flex flex-col gap-1 text-sm">
                                <span className="flex items-center gap-2 text-base"><Stethoscope className="w-5 h-5" />猫咪生病了！</span>
                                请按时喂药，治病期间无法玩耍。
                            </div>
                        )}

                        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 mt-auto">
                            <h3 className="text-xl font-bold text-slate-600 mb-4 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" /> 基础互动
                            </h3>
                            <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                <ActionButton
                                    label="喂食"
                                    count={inventory.food}
                                    onClick={() => handleUse('feed')}
                                    color="bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-200"
                                    icon={<Coffee className="w-6 h-6" />}
                                />
                                <ActionButton
                                    label="玩耍"
                                    count={inventory.toy}
                                    onClick={() => handleUse('play')}
                                    color="bg-pink-100 text-pink-600 border-pink-200 hover:bg-pink-200"
                                    icon={<Heart className="w-6 h-6" />}
                                    disabled={cat.isSick}
                                />
                                <ActionButton
                                    label="吃药"
                                    count={inventory.medicine}
                                    onClick={() => handleUse('heal')}
                                    color="bg-green-100 text-green-600 border-green-200 hover:bg-green-200"
                                    icon={<Stethoscope className="w-6 h-6" />}
                                    disabled={!cat.isSick}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center: Cat Display */}
                <div className="flex-[1.5] relative flex items-center justify-center min-h-[400px]">
                    <motion.div
                        className="relative"
                        style={{ scale: ageScale }}
                        animate={cat.isSick ? { filter: 'grayscale(0.5) sepia(0.5) hue-rotate(-10deg)' } : {}}
                        transition={{ duration: 1 }}
                    >
                        {cat.isSick && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-red-200 z-10 font-bold text-red-500 whitespace-nowrap"
                            >
                                🤒 我好难受...
                            </motion.div>
                        )}
                        {cat.hunger < 30 && !cat.isSick && (
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-orange-200 z-10 font-bold text-orange-500 whitespace-nowrap"
                            >
                                🐟 肚子饿扁了...
                            </motion.div>
                        )}
                        {cat.happiness < 30 && !cat.isSick && cat.hunger >= 30 && (
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-pink-200 z-10 font-bold text-pink-500 whitespace-nowrap"
                            >
                                🧶 好无聊哦...
                            </motion.div>
                        )}
                        <Cat state={catState} breed={cat.breed} className="w-64 h-64 drop-shadow-2xl" />
                    </motion.div>
                </div>

                {/* Right Panel: Shop */}
                <div className="bg-slate-800 rounded-[3rem] p-8 shadow-2xl flex-1 flex flex-col gap-6 border-4 border-slate-700 text-white">
                    <h2 className="text-3xl font-black mb-2 border-b-2 border-slate-600 pb-4 flex items-center gap-3 text-yellow-400">
                        <ShoppingBag className="w-8 h-8" /> 猫咪商店
                    </h2>

                    <div className="space-y-4 flex-1">
                        <ShopItem
                            name="高级猫粮"
                            desc="恢复 30 点饥饿度"
                            cost={20}
                            icon="🐟"
                            onBuy={() => handleBuy('food', 20)}
                            canAfford={score >= 20}
                        />
                        <ShopItem
                            name="逗猫棒"
                            desc="恢复 30 点心情值"
                            cost={30}
                            icon="🧶"
                            onBuy={() => handleBuy('toy', 30)}
                            canAfford={score >= 30}
                        />
                        <ShopItem
                            name="特效药"
                            desc="治愈疾病状态"
                            cost={100}
                            icon="💊"
                            onBuy={() => handleBuy('medicine', 100)}
                            canAfford={score >= 100}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

const StatusBar = ({ label, value, color, icon }: { label: string, value: number, color: string, icon: React.ReactNode }) => (
    <div>
        <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-slate-600 flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${color}`}>{icon}</div>
                {label}
            </span>
            <span className="font-bold text-slate-500">{Math.round(value)}/100</span>
        </div>
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div
                className={`h-full ${color}`}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ type: 'spring', bounce: 0 }}
            />
        </div>
    </div>
);

const ActionButton = ({ label, count, onClick, color, icon, disabled }: { label: string, count: number, onClick: () => void, color: string, icon: React.ReactNode, disabled?: boolean }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`relative flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 rounded-2xl border-2 transition-all active:scale-95 ${color} ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
    >
        {icon}
        <span className="font-bold text-sm sm:text-base">{label}</span>
        <div className="absolute -top-2 -right-2 bg-slate-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
            {count}
        </div>
    </button>
);

const ShopItem = ({ name, desc, cost, icon, onBuy, canAfford }: { name: string, desc: string, cost: number, icon: string, onBuy: () => void, canAfford: boolean }) => (
    <div className="bg-slate-700/50 p-4 rounded-2xl border border-slate-600 flex items-center gap-2 sm:gap-4">
        <div className="text-3xl sm:text-4xl">{icon}</div>
        <div className="flex-1">
            <h4 className="font-bold text-base sm:text-lg">{name}</h4>
            <p className="text-slate-400 text-xs sm:text-sm">{desc}</p>
        </div>
        <button
            onClick={onBuy}
            disabled={!canAfford}
            className={`px-2 sm:px-4 py-2 rounded-xl font-bold flex flex-col items-center transition-all min-w-[60px] ${canAfford ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300 active:scale-95 shadow-lg shadow-yellow-900/20' : 'bg-slate-600 text-slate-400 cursor-not-allowed'}`}
        >
            <span className="text-[10px] sm:text-xs">购买</span>
            <span className="flex items-center gap-1 text-sm">
                <Star className={`w-3 h-3 ${canAfford ? 'fill-yellow-900' : 'fill-slate-400'}`} /> {cost}
            </span>
        </button>
    </div>
);
