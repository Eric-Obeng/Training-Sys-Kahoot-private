export interface Cohort {
    id: string,
    name: string,
    specializations: string[],
    startDate: Date,
    endDate: Date,
    traineesEnrolled: number,
    description: string,
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
    specialization: string;
    date_added: string;
}


export interface Specialization {
    id: number;
    name: string;
    value: string;
}


export interface User {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: 'Male' | 'Female' | 'male' | 'female';
    country: string;
    address: string;
    universityCompleted: string;
    userProfilePhoto: string;
    specialization: string;
    cohort: string;
    enrollementDate: Date;
    trainingId: string;
    status: 'active' | 'inactive';
    phoneNumber: string;
    date_added: Date;
}

export interface Gender {
    sex: 'Male' | 'Female' | 'male' | 'female';
}

export interface Countries {
    name: string;
    code: string; 
}