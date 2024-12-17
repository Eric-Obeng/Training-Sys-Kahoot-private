export interface Cohort {
    id: string,
    name: string,
    specializations: string[],
    startDate: Date,
    endDate: Date,
    traineesEnrolled: number,
    description: string,
    status: string;
}

// For getting a list of cohorts
export interface CohortList {
    id: string,
    name: string,
    startDate: Date,
    endDate: Date,
    traineesEnrolled: number,
}

// For getting the cohort trainees for a single cohort
export interface CohortDetails {
    id: string,
    name: string,
    specializations: string[],
    startDate: Date,
    endDate: Date,
    traineesEnrolled: number,
    description: string,
    trainees: Trainees[];
}

export interface Trainees {
    id: string;
    cohort: string;
    enrolled: number;
    fullName: string;
    email: string;
    contact: string;
    status: string;
    specializationName: string;
    dateCreated: string;
}


export interface Specialization {
    id: number;
    name: string;
    value: string;
}


export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: Gender;
    country: string;
    address: string;
    universityCompleted: string;
    userProfilePhoto: File;
    specialization: string;
    specializationId: string;
    cohort: string;
    cohortId: string;
    enrollementDate?: Date;
    enrollmentDate?: Date;
    trainingId: string;
    status: 'ACTIVE' | 'INACTIVE';
    phoneNumber: string;
    dateAdded: Date;
}

export interface Gender {
    sex: 'male' | 'female' | 'Male' | 'Female';
}

export interface Countries {
    name: string;
    code: string; 
}