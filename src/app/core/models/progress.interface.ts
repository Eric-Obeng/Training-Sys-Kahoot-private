export type phaseOption = 'foundation' | 'advance' | 'capstone';

// Interface for the trainee progress as expected by the component
export interface progress {
  id: number;
  traineeName: string;
  profileImage?: string;
  currentPhase: phaseOption;
  progress: number;
  completionDate: string;
}

// Interfaces for the API response
export interface Specialization {
  id: number;
  name: string;
  description: string;
}

export interface Trainee {
  id: number;
  fullName: string;
  email: string;
  contact: string;
  status: 'ACTIVE' | 'DEACTIVATED';
  specializationName: string;
  dateCreated: string;
}

export interface CohortProgress {
  id: number;
  name: string;
  status: 'ACTIVE' | 'DEACTIVATED';
  specializations: Specialization[];
  trainees: Trainee[];
  startDate: string;
  endDate: string;
  description: string;
}


export interface TraineeState {
  id: number;
  fullName: string;
  email: string;
  contact: string;
  status: 'ACTIVE' | 'DEACTIVATED';
  specializationName: string;
  dateCreated: string;
  currentPhase: 'foundation' | 'advance' | 'capstone';
  progress: number;
  cohortEndDate: string;
}
