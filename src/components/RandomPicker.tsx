import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shuffle, UserPlus, Trash2, History, RotateCcw, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../lib/utils';
import { DEFAULT_STUDENTS } from '../constants';

export default function RandomPicker() {
  const [names, setNames] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [isPicking, setIsPicking] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [excludeWinner, setExcludeWinner] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const savedNames = localStorage.getItem('spark_picker_names');
    if (savedNames) {
      setNames(JSON.parse(savedNames));
    } else {
      setNames(DEFAULT_STUDENTS);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('spark_picker_names', JSON.stringify(names));
  }, [names]);

  const handleImport = () => {
    const newNames = inputText.split('\n').map(n => n.trim()).filter(n => n !== '');
    if (newNames.length > 0) {
      setNames([...names, ...newNames]);
      setInputText('');
    }
  };

  const handlePick = () => {
    if (names.length === 0 || isPicking) return;

    setIsPicking(true);
    setWinner(null);
    
    let iterations = 20;
    let speed = 50;

    const run = () => {
      setCurrentIndex(prev => (prev + 1) % names.length);
      iterations--;

      if (iterations > 0) {
        speed *= 1.1; // Slow down
        timerRef.current = window.setTimeout(run, speed);
      } else {
        const winIdx = Math.floor(Math.random() * names.length);
        const winName = names[winIdx];
        setWinner(winName);
        setIsPicking(false);
        setHistory(prev => [winName, ...prev].slice(0, 5));
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        if (excludeWinner) {
          setNames(prev => prev.filter((_, i) => i !== winIdx));
        }
      }
    };

    run();
  };

  const resetNames = () => {
    setNames(DEFAULT_STUDENTS);
    setHistory([]);
    setWinner(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Configuration */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="text-blue-500 w-5 h-5" />
            <h2 className="font-bold">匯入名單</h2>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="輸入姓名，每行一個..."
            className="w-full h-32 p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
          />
          <button
            onClick={handleImport}
            className="w-full mt-3 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            添加至清單
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <RotateCcw className="text-orange-500 w-5 h-5" />
              <h2 className="font-bold">目前名單 ({names.length})</h2>
            </div>
            <button 
              onClick={resetNames}
              className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> 重置
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-1 pr-2 scrollbar-thin">
            {names.map((name, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 text-sm">
                <span>{name}</span>
                <button 
                  onClick={() => setNames(prev => prev.filter((_, idx) => idx !== i))}
                  className="text-gray-300 hover:text-red-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {names.length === 0 && <p className="text-center py-4 text-gray-400 text-sm italic">名單為空</p>}
          </div>
        </div>
      </div>

      {/* Main Picker */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
          {/* Animated Background Element */}
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-500/10" />
          
          <div className="text-center mb-8">
            <h2 className="text-gray-400 font-medium mb-2 uppercase tracking-widest text-xs">隨機抽出</h2>
            <div className="h-24 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {winner ? (
                  <motion.div
                    key="winner"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-6xl font-black text-blue-600 tracking-tight"
                  >
                    {winner}
                  </motion.div>
                ) : isPicking ? (
                  <motion.div
                    key="picking"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-4xl font-bold text-gray-400 italic"
                  >
                    {names[currentIndex]}
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <Shuffle className="w-12 h-12 text-gray-100 mb-2" />
                    <span className="text-gray-300">準備就緒</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 w-full max-w-sm">
            <button
              onClick={handlePick}
              disabled={isPicking || names.length === 0}
              className={cn(
                "w-full py-6 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg",
                isPicking || names.length === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200"
              )}
            >
              <Shuffle className={cn("w-6 h-6", isPicking && "animate-spin")} />
              {isPicking ? '抽籤中...' : '開始抽籤'}
            </button>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={excludeWinner} 
                onChange={(e) => setExcludeWinner(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                抽中後剔除名單 (避免重複)
              </span>
            </label>
            
            {names.length === 0 && !isPicking && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 text-orange-700 rounded-xl text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>請先匯入名單</span>
              </div>
            )}
          </div>
        </div>

        {/* History */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <History className="text-gray-400 w-5 h-5" />
            <h2 className="font-bold">最近中獎</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((name, i) => (
              <span key={i} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm font-medium">
                {name}
              </span>
            ))}
            {history.length === 0 && <span className="text-gray-400 text-sm">尚無紀錄</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
