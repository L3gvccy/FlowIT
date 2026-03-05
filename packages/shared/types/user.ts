export interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  surname?: string;
  image?: string;
  isProfileCompleted: boolean;
}
