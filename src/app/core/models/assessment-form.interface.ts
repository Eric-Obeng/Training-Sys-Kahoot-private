export type AssessmentType = 'quiz' | 'lab' | 'presentation';

export interface AssessmentBase {
  assessmentType: string;
  coverImage: string;
  createdAt: string;
  description: string;
  focusArea: string;
  title: string;
  id?: number | undefined;
}
export interface CreateAssessment {
  type: AssessmentType;
  label: string;
  icon: string;
  route: string;
}

export interface AssignAssessment{
  deadline: string
  assessmentId: number;
  traineeEmail: string[]
}

export interface Quiz extends AssessmentBase {
  questions: any[];
  timeFrame: number;
}

export interface Attachment {
  files: any[];
}

export interface Lab extends AssessmentBase {
  attachment: Attachment[];
}

export interface Presentation extends AssessmentBase {
  attachment: Attachment[];
}

export interface AssessmentData {
  quizzes: Quiz[];
  labs: Lab[];
  presentations: Presentation[];
}
