export interface Trainer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  assignSpecialization?: string;
  gender: string;
  country: string;
  phoneNumber: string;
  profilePhoto?: File;
  status: 'ACTIVE' | 'INACTIVE' | 'DEACTIVATED';
  role: 'TRAINER';
}

export interface TrainerList {
  content: Trainer[];
}
