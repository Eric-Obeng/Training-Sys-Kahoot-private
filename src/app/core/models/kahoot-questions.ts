export interface Option {
  text: string;
  correct: boolean;
}

export interface Question {
  questionText: string;
  options: string[];
  correctAnswer: string;
  image?: string;
  timeLimit: {name: string; value: number};
  points: {name: string; value: number};
}

export interface GenerateQuestion {
  level: string;
  questionType: string;
  includeCode?: string;
  topic: string;
}

