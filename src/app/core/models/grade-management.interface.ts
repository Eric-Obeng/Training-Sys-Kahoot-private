export interface AssessmentList {
    title: string;
    dateCreated: Date;
    type: string; 
    traineeCount?: number;
}

export interface GradeHistoryList {
    id: number;
    overallGradePoints: number;
    averageGradePoints: number;
    quiz: number;
    lab: number;
    presentation: number;
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