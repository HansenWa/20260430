import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Bell, BellOff, Hourglass, Settings2 } from 'lucide-react';
import { Howl } from 'howler';
import { cn } from '../lib/utils';

const alertSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'],
  volume: 0.5
});

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(300); // Default 5 mins
  const [initialTime, setInitialTime] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (!isMuted) alertSound.play();
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, isMuted]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  const setPreset = (mins: number) => {
    const seconds = mins * 60;
    setInitialTime(seconds);
    setTimeLeft(seconds);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / initialTime) * 100;
  const isWarning = timeLeft <= 10 && timeLeft > 0;

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated Background Pulse */}
        <AnimatePresence>
          {isWarning && isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-red-500"
            />
          )}
        </AnimatePresence>

        {/* Circular Progress (CSS based) */}
        <div className="relative w-72 h-72 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform">
            <circle
              cx="144"
              cy="144"
              r="130"
              className="stroke-gray-100 fill-none"
              strokeWidth="12"
            />
            <motion.circle
              cx="144"
              cy="144"
              r="130"
              className={cn(
                "fill-none transition-colors duration-500",
                isWarning ? "stroke-red-500" : "stroke-green-500"
              )}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 130}
              animate={{ strokeDashoffset: (2 * Math.PI * 130) * (1 - progress / 100) }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn(
              "text-7xl font-black tabular-nums transition-colors tracking-tighter",
              isWarning ? "text-red-600 animate-pulse" : "text-gray-900"
            )}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest">
              {isActive ? '倒數計時中' : '已暫停'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-12 w-full max-w-sm">
          <button
            onClick={resetTimer}
            className="flex-1 p-5 bg-gray-100 text-gray-700 rounded-[24px] hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2 font-bold"
          >
            <RotateCcw className="w-6 h-6" />
            重置
          </button>
          <button
            onClick={toggleTimer}
            className={cn(
              "p-8 rounded-[32px] text-white shadow-xl transform active:scale-95 transition-all flex items-center justify-center translate-y-[-10px]",
              isActive 
                ? "bg-gray-800 hover:bg-gray-700" 
                : "bg-green-600 hover:bg-green-500 shadow-green-200"
            )}
          >
            {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="flex-1 p-5 bg-gray-100 text-gray-700 rounded-[24px] hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2 font-bold"
          >
            {isMuted ? <BellOff className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
            {isMuted ? '靜音' : '音效'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[3, 5, 8, 10, 15, 20].map((mins) => (
          <button
            key={mins}
            onClick={() => setPreset(mins)}
            className={cn(
              "py-4 rounded-2xl text-sm font-bold transition-all border",
              initialTime === mins * 60
                ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                : "bg-white text-gray-600 border-gray-100 hover:border-blue-200"
            )}
          >
            {mins} 分鐘
          </button>
        ))}
      </div>

      <div className="text-center text-gray-400 text-sm">
        <p>報告時間管理工具 • 視覺化倒數提醒</p>
      </div>
    </div>
  );
}
