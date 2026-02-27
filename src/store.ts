import { Word } from './data';
import { CatBreed } from './components/Cat';

export type MistakeRecord = {
  id: string;
  word: Word;
  wrongAnswer: string;
  mistakeType: string;
  timestamp: number;
};

export const getMistakes = (): MistakeRecord[] => {
  try {
    const data = localStorage.getItem('pinyin_mistakes');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addMistake = (mistake: Omit<MistakeRecord, 'id' | 'timestamp'>) => {
  const mistakes = getMistakes();
  mistakes.push({
    ...mistake,
    id: Math.random().toString(36).substring(2, 9),
    timestamp: Date.now()
  });
  localStorage.setItem('pinyin_mistakes', JSON.stringify(mistakes));
};

export const clearMistakes = () => {
  localStorage.removeItem('pinyin_mistakes');
};

export const getMistakeStats = () => {
  const mistakes = getMistakes();
  const stats: Record<string, number> = {};
  mistakes.forEach(m => {
    stats[m.mistakeType] = (stats[m.mistakeType] || 0) + 1;
  });
  return stats;
};

// -- Grade Management --
export const getGrade = (): number => {
  try {
    const data = localStorage.getItem('pinyin_selected_grade');
    return data ? parseInt(data, 10) : 1;
  } catch {
    return 1;
  }
};

export const setGrade = (grade: number) => {
  localStorage.setItem('pinyin_selected_grade', grade.toString());
};


// -- Cat System & Save Slots --

export interface CatData {
  playerId: string;
  score: number;
  cat: {
    breed: CatBreed;
    name: string;
    age: number; // 1 to 12
    hunger: number; // 0 to 100
    happiness: number; // 0 to 100
    health: number; // 0 to 100
    isSick: boolean;
    correctAnswersCount: number;
  };
  inventory: {
    food: number;
    toy: number;
    medicine: number;
  };
  lastLoginTime: number;
}

export type SaveSlot = [CatData | null, CatData | null];

const CAT_SAVE_KEY = 'pinyin_cat_saves';

export const getCatSaves = (): SaveSlot => {
  try {
    const data = localStorage.getItem(CAT_SAVE_KEY);
    return data ? JSON.parse(data) : [null, null];
  } catch {
    return [null, null];
  }
};

export const saveCatSaves = (saves: SaveSlot) => {
  localStorage.setItem(CAT_SAVE_KEY, JSON.stringify(saves));
};

export const createCatSave = (slotIndex: 0 | 1, playerId: string, breed: CatBreed, name: string) => {
  const saves = getCatSaves();
  const newSave: CatData = {
    playerId,
    score: 0,
    cat: {
      breed,
      name,
      age: 1,
      hunger: 80,
      happiness: 80,
      health: 100,
      isSick: false,
      correctAnswersCount: 0,
    },
    inventory: {
      food: 0,
      toy: 0,
      medicine: 0,
    },
    lastLoginTime: Date.now(),
  };
  saves[slotIndex] = newSave;
  saveCatSaves(saves);
  return newSave;
};

export const deleteCatSave = (slotIndex: 0 | 1) => {
  const saves = getCatSaves();
  saves[slotIndex] = null;
  saveCatSaves(saves);
};

export const updateCatSave = (slotIndex: 0 | 1, updates: Partial<CatData> | ((prev: CatData) => CatData)) => {
  const saves = getCatSaves();
  if (!saves[slotIndex]) return;

  if (typeof updates === 'function') {
    saves[slotIndex] = updates(saves[slotIndex]!);
  } else {
    saves[slotIndex] = { ...saves[slotIndex]!, ...updates };
  }

  saves[slotIndex]!.lastLoginTime = Date.now();
  saveCatSaves(saves);
};

export const calculateOfflineProgress = (save: CatData): CatData => {
  const now = Date.now();
  const timeDiff = now - save.lastLoginTime;
  const hoursPassed = timeDiff / (1000 * 60 * 60);

  if (hoursPassed < 1) {
    return { ...save, lastLoginTime: now };
  }

  const HUNGER_DECAY_PER_HOUR = 3;
  const HAPPINESS_DECAY_PER_HOUR = 2;

  let newHunger = Math.max(0, save.cat.hunger - (hoursPassed * HUNGER_DECAY_PER_HOUR));
  let newHappiness = Math.max(0, save.cat.happiness - (hoursPassed * HAPPINESS_DECAY_PER_HOUR));
  let newHealth = save.cat.health;
  let isSick = save.cat.isSick;

  if (newHunger === 0 || newHappiness === 0) {
    const neglectHours = hoursPassed;
    const HEALTH_DECAY_PER_HOUR = 2;
    newHealth = Math.max(0, newHealth - (neglectHours * HEALTH_DECAY_PER_HOUR));
  }

  if (newHealth < 40 && Math.random() < 0.5) {
    isSick = true;
  }

  return {
    ...save,
    cat: {
      ...save.cat,
      hunger: newHunger,
      happiness: newHappiness,
      health: newHealth,
      isSick
    },
    lastLoginTime: now
  };
};
