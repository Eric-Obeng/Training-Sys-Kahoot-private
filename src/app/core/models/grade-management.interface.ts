export interface AssessmentList {
    title: string;
    dateCreated: Date;
    type: string; 
    traineeCount?: number;
}

export interface TraineeGradeHistory {
    firstName: string;
    lastName: string;
    averageGradePoints: number;
    gradedLabsCount: number;
    gradedPresentationsCount: number;
    gradedQuizzesCount: number;
    id: number;
    overallGradePoints: number;
    traineeEmail: string;
  }
  

export interface ungradedTraineeList {
    firstName: string;
    LastName: string;
    specialization: string;
}

export interface gradedTraineeList {
    firstName: string;
    LastName: string;
    specialization: string;
    grade: number;
}