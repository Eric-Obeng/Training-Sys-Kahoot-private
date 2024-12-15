export interface AssessmentList {
    title: string;
    dateCreated: Date;
    type: string; 
    traineeCount?: number;
}

export interface ungradedTraineeList {
    firstName: string;
    LastName: string;
    specialization: string;
    email: string;
}

export interface gradedTraineeList {
    firstName: string;
    LastName: string;
    specialization: string;
    grade: number;
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


  export interface AssessmentOverview {
    firstName: string;
    lastName: string;
    specialization: string;
    assessmentId: string;
    dateCreated: Date;
    dateSubmitted: Date;
    file: string | null;
    graded: boolean;
    id: number;
    labByWeek: string | null;
    letterGrade: string;
    title: string;
    totalMarks: number;
    traineeEmail: string;
    type: string;
    url: string[];
  }
  
  export interface AssessmentDetails {
    assessmentId: string;
    dateCreated: string;
    dateSubmitted: string; 
    file: any | null;
    graded: boolean;
    id: number;
    labByWeek: number;
    letterGrade: string | null;
    title: string;
    totalMarks: number;
    traineeEmail: string;
    type: string;
    url: string[]; 
  }
  