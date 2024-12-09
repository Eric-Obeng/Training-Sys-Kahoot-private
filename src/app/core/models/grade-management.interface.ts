export interface AssessmentList {
    id: number;
    title: string;
    dateCreated: Date;
    type: 'lab' | 'presentation';
    traineeCount: number;
}