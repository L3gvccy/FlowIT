export interface UserInterface {
  id: string;
  email: string;
  password: string;
  name?: string;
  surname?: string;
  image?: string;
  isProfileCompleted: boolean;
}
