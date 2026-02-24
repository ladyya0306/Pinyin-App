import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Lightbulb, Loader2, Volume2 } from 'lucide-react';
import { getMistakes } from '../store';
import { playSound } from '../audio';
import { speakAdvice } from '../utils';
import Markdown from 'react-markdown';

export const AdviceMode = ({ onBack }: { onBack: () => void }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvice = async () => {
      const mistakes = getMistakes();
      if (mistakes.length === 0) {
        const msg = "太棒了！你目前没有任何错题记录。继续保持良好的学习习惯，多读多练，你的拼音会越来越好！";
        setAdvice(msg);
        speakAdvice(msg);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const apiKey = process.env.ALIYUN_API_KEY;
        if (!apiKey) {
          throw new Error("Missing Aliyun API Key");
        }

        // Summarize mistakes
        const mistakeSummary = mistakes.reduce((acc, curr) => {
          acc[curr.mistakeType] = (acc[curr.mistakeType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const mistakeDetails = mistakes.map(m => `${m.word.hanzi} (${m.word.pinyin}) 错选为 ${m.wrongAnswer}`).join(', ');

        const prompt = `
          以下是一个学生的拼音错题记录统计：
          ${Object.entries(mistakeSummary).map(([type, count]) => `${type}: 错了 ${count} 次`).join('\n')}
          
          具体的错题细节：
          ${mistakeDetails}

          请根据这些错题，分析学生的不足之处，并给出具体、生动、适合一年级小朋友理解的学习建议。
        `;

        const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            // 阿里云百炼支持 qwen-plus, 或者也可以用 deepseek-v3 / deepseek-r1
            model: 'qwen-plus',
            messages: [
              {
                role: 'system',
                content: '你是一个专业的小学语文老师，专门教一年级学生拼音。语气要充满元气、活泼、鼓励、亲切。使用Markdown格式，可以使用emoji。'
              },
              { role: 'user', content: prompt }
            ]
          })
        });

        if (!response.ok) {
          throw new Error(`API Request failed with status ${response.status}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || "无法生成建议，请稍后再试。";
        setAdvice(text);
        speakAdvice(text);
      } catch (err: any) {
        console.error("Error fetching advice:", err);
        setError("获取学习建议失败，请检查网络或API密钥。");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen p-4 relative z-10 w-full max-w-4xl mx-auto">
      <div className="w-full flex justify-between items-center mb-8 mt-4">
        <button
          onClick={() => { playSound('click'); onBack(); }}
          className="flex items-center gap-2 bg-white/80 hover:bg-white text-sky-600 px-4 py-2 rounded-full font-bold shadow-sm transition-all"
        >
          <Home className="w-5 h-5" /> 返回
        </button>
        <h2 className="text-3xl font-bold text-slate-800 bg-white/50 px-6 py-2 rounded-full flex items-center gap-2">
          <Lightbulb className="w-8 h-8 text-yellow-500" />
          学习建议
        </h2>
        <button
          onClick={() => { if (advice) { playSound('click'); speakAdvice(advice); } }}
          className="flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-full font-bold shadow-sm transition-all"
        >
          <Volume2 className="w-5 h-5" /> 朗读
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 w-full border-8 border-yellow-200 relative overflow-hidden"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-16 h-16 text-sky-500 animate-spin mb-4" />
            <p className="text-xl text-slate-500 font-bold animate-pulse">老师正在为你分析错题，请稍等...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-2xl text-center border-2 border-red-200">
            <p className="text-xl font-bold">{error}</p>
          </div>
        ) : advice ? (
          <div className="prose prose-lg prose-sky max-w-none">
            <div className="markdown-body text-slate-700 leading-relaxed">
              <Markdown>{advice}</Markdown>
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
};
