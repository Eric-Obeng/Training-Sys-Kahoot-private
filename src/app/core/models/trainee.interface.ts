import { User } from "./cohort.interface";

export interface TraineeList {
    content: User[];
}

export interface Assignment {
    assessmentType: string;
    coverImage: string;
    createdAt: string | null;
    description: string;
    focusArea: string;
    id: string;
    title: string;
    questionsCount: number;
  }
  

export interface Quiz {
    quizCount: number;
    assignments: Assignment[];
}

export interface QuizSubmission {
    traineeEmail: string;
    submittedAnswers: { questionId: number; selectedAnswerId: number }[];
  }
  