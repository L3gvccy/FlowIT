export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  surname?: string;
  image?: string;
  isProfileCompleted: boolean;

  skills: Array<any>;
}
