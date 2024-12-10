export interface AssessmentList {
    id: number;
    title: string;
    dateCreated: Date;
    type: 'lab' | 'presentation';
    traineeCount: number;
}

export interface GradeHistoryList {
    id: number;
    overallGradePoints: number;
    averageGradePoints: number;
    quiz: number;
    lab: number;
    presentation: number;
}