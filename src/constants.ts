import { QuestionType, Exam } from './types';

export const DEFAULT_STUDENTS = [
  "陳小明", "林美玲", "張大為", "李佳欣", "王志誠",
  "黃雅婷", "劉子豪", "周杰倫", "蔡依林", "郭曉峰"
];

export const MOCK_EXAM: Exam = {
  id: '1',
  title: '自然科學小測驗',
  questions: [
    {
      id: 'q1',
      type: QuestionType.TRUE_FALSE,
      text: '太陽是太陽系的中心。',
      correctAnswer: true,
      explanation: '太陽佔了太陽系總質量的99.8%以上，是絕對的中心。'
    },
    {
      id: 'q2',
      type: QuestionType.SINGLE_CHOICE,
      text: '下列哪顆行星被稱為「紅色星球」？',
      options: ['金星', '火星', '木星', '土星'],
      correctAnswer: '火星',
      explanation: '火星表面覆蓋著大量的氧化鐵（鐵鏽），因此呈現紅色。'
    },
    {
      id: 'q3',
      type: QuestionType.MULTIPLE_CHOICE,
      text: '下列哪些是哺乳類動物？（複選）',
      options: ['海豚', '企鵝', '蝙蝠', '鯊魚'],
      correctAnswer: ['海豚', '蝙蝠'],
      explanation: '海豚是海洋哺乳類，蝙蝠是唯一會飛的哺乳類。企鵝是鳥類，鯊魚是魚類。'
    }
  ]
};
