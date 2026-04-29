/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Trophy, 
  Timer as TimerIcon, 
  ClipboardCheck, 
  GraduationCap
} from 'lucide-react';
import { cn } from './lib/utils';
import { TabType } from './types';
import RandomPicker from './components/RandomPicker';
import Scoreboard from './components/Scoreboard';
import Timer from './components/Timer';
import ExamSystem from './components/ExamSystem';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('picker');

  // Load last active tab from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('class_spark_tab');
    if (saved && ['picker', 'scoreboard', 'timer', 'exam'].includes(saved)) {
      setActiveTab(saved as TabType);
    }
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    localStorage.setItem('class_spark_tab', tab);
  };

  const tabs = [
    { id: 'picker', label: '隨機抽籤', icon: Users, color: 'bg-blue-500' },
    { id: 'scoreboard', label: '計分板', icon: Trophy, color: 'bg-yellow-500' },
    { id: 'timer', label: '計時器', icon: TimerIcon, color: 'bg-green-500' },
    { id: 'exam', label: '數位測驗', icon: ClipboardCheck, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans selection:bg-blue-200">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Classroom Spark</h1>
          </div>
          
          <nav className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as TabType)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                  )}
                  id={`tab-${tab.id}`}
                >
                  <Icon className={cn("w-4 h-4", isActive && "text-blue-600")} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === 'picker' && <RandomPicker />}
            {activeTab === 'scoreboard' && <Scoreboard />}
            {activeTab === 'timer' && <Timer />}
            {activeTab === 'exam' && <ExamSystem />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 text-xs">
        <p>© 2026 Classroom Spark • 智慧教學輔助平台</p>
      </footer>
    </div>
  );
}

