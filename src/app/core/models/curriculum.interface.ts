
export interface module {
  title: string;
  description: string;
  topics: string[];
  moduleFile: string;
}

export interface curriculum {
  createdAt?: string;
  title: string;
  description: string;
  assignedSpecialization: string;
  assignedCohort: string;
  learningObjectives: string[];
  thumbnail: string;
  modules: module[];
}
