import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Users, Trash2, Trophy, ArrowUpDown, Swords } from 'lucide-react';
import { cn } from '../lib/utils';
import { Team } from '../types';

export default function Scoreboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [isSorted, setIsSorted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('spark_scoreboard');
    if (saved) {
      setTeams(JSON.parse(saved));
    } else {
      setTeams([
        { id: '1', name: '紅隊', score: 0 },
        { id: '2', name: '藍隊', score: 0 },
        { id: '3', name: '黃隊', score: 0 },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('spark_scoreboard', JSON.stringify(teams));
  }, [teams]);

  const addTeam = () => {
    if (!newTeamName.trim()) return;
    const team: Team = {
      id: Date.now().toString(),
      name: newTeamName,
      score: 0
    };
    setTeams([...teams, team]);
    setNewTeamName('');
  };

  const updateScore = (id: string, amount: number) => {
    setTeams(prev => prev.map(t => 
      t.id === id ? { ...t, score: Math.max(0, t.score + amount) } : t
    ));
  };

  const removeTeam = (id: string) => {
    setTeams(prev => prev.filter(t => t.id !== id));
  };

  const resetScores = () => {
    if (confirm('確定要重置所有隊伍的分數嗎？')) {
      setTeams(prev => prev.map(t => ({ ...t, score: 0 })));
    }
  };

  const displayTeams = isSorted 
    ? [...teams].sort((a, b) => b.score - a.score)
    : teams;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Swords className="text-blue-500 w-5 h-5 shrink-0" />
          <div className="flex gap-2 w-full">
            <input 
              type="text" 
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="新增組別名稱..."
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && addTeam()}
            />
            <button 
              onClick={addTeam}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              新增組別
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSorted(!isSorted)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              isSorted ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
            )}
          >
            <ArrowUpDown className="w-4 h-4" />
            自動排序
          </button>
          <button 
            onClick={resetScores}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-all border border-red-100"
          >
             重置分數
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {displayTeams.map((team, index) => (
            <motion.div
              layout
              key={team.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                "group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden transition-all hover:shadow-md",
                index === 0 && isSorted && "ring-2 ring-yellow-400"
              )}
            >
              {/* Leader Indicator */}
              {index === 0 && isSorted && team.score > 0 && (
                <div className="absolute top-0 right-0 p-2">
                  <Trophy className="w-6 h-6 text-yellow-500 drop-shadow-sm" />
                </div>
              )}

              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-lg font-bold text-gray-700 truncate">{team.name}</h3>
                  <button 
                    onClick={() => removeTeam(team.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-6xl font-black text-gray-900 my-4 tabular-nums">
                  <motion.span
                    key={team.score}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    {team.score}
                  </motion.span>
                </div>

                <div className="grid grid-cols-3 gap-2 w-full">
                  {[1, 5, -1].map((val) => (
                    <button
                      key={val}
                      onClick={() => updateScore(team.id, val)}
                      className={cn(
                        "py-3 rounded-2xl font-bold text-lg flex items-center justify-center gap-1 transition-all active:scale-95",
                        val > 0 
                          ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200/50" 
                          : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200/50"
                      )}
                    >
                      {val > 0 ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                      {Math.abs(val)}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {teams.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center text-gray-300">
            <Users className="w-12 h-12 mb-2" />
            <p>尚未建立組別</p>
          </div>
        )}
      </div>
    </div>
  );
}
