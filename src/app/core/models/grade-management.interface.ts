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