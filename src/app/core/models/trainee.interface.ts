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
    id: number;
    title: string;
    questionsCount: number;
  }
  

export interface Quiz {
    quizCount: number;
    assignments: Assignment[];
}