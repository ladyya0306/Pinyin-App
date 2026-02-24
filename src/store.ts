import { Word } from './data';

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
