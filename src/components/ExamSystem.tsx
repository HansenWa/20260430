import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  RotateCcw, 
  Star,
  Info,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../lib/utils';
import { QuestionType } from '../types';
import { MOCK_EXAM } from '../constants';

export default function ExamSystem() {
  const [currentStep, setCurrentStep] = useState<'start' | 'quiz' | 'result'>('start');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const quiz = MOCK_EXAM;
  const currentQuestion = quiz.questions[currentQuestionIdx];

  const handleAnswerChange = (value: any) => {
    if (currentQuestion.type === QuestionType.MULTIPLE_CHOICE) {
      const current = userAnswers[currentQuestion.id] || [];
      const updated = current.includes(value)
        ? current.filter((v: any) => v !== value)
        : [...current, value];
      setUserAnswers({ ...userAnswers, [currentQuestion.id]: updated });
    } else {
      setUserAnswers({ ...userAnswers, [currentQuestion.id]: value });
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < quiz.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setCurrentStep('result');
      if (calculateScore() === 100) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    quiz.questions.forEach(q => {
      const userAns = userAnswers[q.id];
      if (q.type === QuestionType.MULTIPLE_CHOICE) {
        const sortedCorrect = [...q.correctAnswer].sort();
        const sortedUser = [...(userAns || [])].sort();
        if (JSON.stringify(sortedCorrect) === JSON.stringify(sortedUser)) {
          correctCount++;
        }
      } else {
        if (userAns === q.correctAnswer) {
          correctCount++;
        }
      }
    });
    return Math.round((correctCount / quiz.questions.length) * 100);
  };

  const resetQuiz = () => {
    setCurrentStep('start');
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setShowExplanation(false);
  };

  if (currentStep === 'start') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
        <div className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center mb-6">
            <Star className="w-10 h-10 fill-current" />
          </div>
          <h2 className="text-3xl font-black mb-2">{quiz.title}</h2>
          <p className="text-gray-500 mb-8">準備好開始測驗了嗎？共有 {quiz.questions.length} 題。</p>
          <button
            onClick={() => setCurrentStep('quiz')}
            className="px-8 py-4 bg-purple-600 text-white rounded-2xl text-xl font-bold hover:bg-purple-700 transition-all shadow-xl shadow-purple-100"
          >
            立即開始
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'result') {
    const score = calculateScore();
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100 text-center">
          <div className="relative inline-block mb-6">
            <Trophy className="w-24 h-24 text-yellow-500" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg"
            >
              完成
            </motion.div>
          </div>
          <h2 className="text-4xl font-black mb-2">測驗結果</h2>
          <div className="text-7xl font-black text-purple-600 my-4">{score} <span className="text-2xl text-gray-300">/ 100</span></div>
          <p className="text-gray-500 mb-8">
            {score === 100 ? '太棒了！完全正確！' : score >= 60 ? '表現不錯，繼續加油！' : '別灰心，再試一次吧！'}
          </p>
          <button
            onClick={resetQuiz}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
          >
            <RotateCcw className="w-5 h-5" /> 再測一次
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest px-4">詳細檢視</h3>
          {quiz.questions.map((q, i) => {
            const isCorrect = q.type === QuestionType.MULTIPLE_CHOICE 
              ? JSON.stringify([...(userAnswers[q.id] || [])].sort()) === JSON.stringify([...q.correctAnswer].sort())
              : userAnswers[q.id] === q.correctAnswer;

            return (
              <div key={q.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-start gap-4">
                <div className={cn(
                  "p-2 rounded-xl mt-1",
                  isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                )}>
                  {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-gray-800 mb-2">{i + 1}. {q.text}</p>
                  <p className="text-sm text-gray-500">
                    你的答案： <span className="text-gray-700 font-medium">{String(userAnswers[q.id] || '未作答')}</span>
                  </p>
                  <p className="text-sm text-green-600 font-medium">
                    正確答案： {String(q.correctAnswer)}
                  </p>
                  {q.explanation && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-xl text-xs text-gray-500 leading-relaxed italic">
                      解析：{q.explanation}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6 px-4">
        <div>
          <span className="text-purple-600 text-sm font-bold uppercase tracking-widest">Question {currentQuestionIdx + 1} of {quiz.questions.length}</span>
        </div>
        <div className="flex gap-1">
          {quiz.questions.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 w-6 rounded-full transition-all duration-500",
                i <= currentQuestionIdx ? "bg-purple-600" : "bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-[40px] shadow-sm border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-10 leading-tight">
          {currentQuestion.text}
        </h3>

        <div className="space-y-4">
          {currentQuestion.type === QuestionType.TRUE_FALSE ? (
            <div className="grid grid-cols-2 gap-4">
              {[true, false].map((val) => (
                <button
                  key={String(val)}
                  onClick={() => handleAnswerChange(val)}
                  className={cn(
                    "p-8 rounded-3xl text-xl font-bold transition-all border-2 text-center",
                    userAnswers[currentQuestion.id] === val
                      ? "bg-purple-50 border-purple-600 text-purple-700"
                      : "bg-gray-50 border-transparent text-gray-500 hover:border-gray-200"
                  )}
                >
                  {val ? '正確 O' : '錯誤 X'}
                </button>
              ))}
            </div>
          ) : (
            currentQuestion.options?.map((option) => {
              const isSelected = currentQuestion.type === QuestionType.MULTIPLE_CHOICE
                ? (userAnswers[currentQuestion.id] || []).includes(option)
                : userAnswers[currentQuestion.id] === option;

              return (
                <button
                  key={option}
                  onClick={() => handleAnswerChange(option)}
                  className={cn(
                    "w-full p-5 rounded-2xl text-left border-2 transition-all flex items-center justify-between group",
                    isSelected
                      ? "bg-purple-50 border-purple-600 text-purple-700 font-bold"
                      : "bg-white border-gray-100 text-gray-600 hover:border-purple-200"
                  )}
                >
                  <span>{option}</span>
                  <div className={cn(
                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                    isSelected ? "bg-purple-600 border-purple-600" : "bg-gray-100 border-gray-200 group-hover:border-purple-200"
                  )}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="mt-12 flex items-center justify-between">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-600 transition-colors"
          >
            <Info className="w-4 h-4" /> 顯示提示
          </button>
          
          <button
            onClick={nextQuestion}
            disabled={userAnswers[currentQuestion.id] === undefined}
            className={cn(
              "flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg",
              userAnswers[currentQuestion.id] === undefined
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-100"
            )}
          >
            {currentQuestionIdx === quiz.questions.length - 1 ? '提交測驗' : '下一題'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 p-6 bg-purple-50 rounded-3xl border border-purple-100 text-sm text-purple-700 leading-relaxed">
                <span className="font-bold block mb-1">小提示：</span>
                {currentQuestion.explanation || '本題無解析。'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
