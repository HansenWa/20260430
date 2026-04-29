export interface Student {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  score: number;
}

export enum QuestionType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: any; // string, string[], or boolean
  explanation?: string;
}

export interface Exam {
  id: string;
  title: string;
  questions: Question[];
}

export type TabType = 'picker' | 'scoreboard' | 'timer' | 'exam';
