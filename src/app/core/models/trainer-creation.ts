export interface TrainerCreation {
  email: string;
  firstName: string;
  lastName: string;
  assignSpecialization: string;
  gender: string;
  country: string;
  phoneNumber: string;
  profilePhoto: File;
  status: 'ACTIVE' | 'INACTIVE' | 'DEACTIVATED';
}
