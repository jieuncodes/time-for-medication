// src/interfaces/IUser.mts
export interface IUser {
  id: number;
  email: string;
  username: string;
  password?: string;
  points: number;
  fcmToken?: string;
  subscription?: any;
  provider?: string;
  role: number;
  hashPassword(): Promise<void>;
  validatePassword(password: string): Promise<boolean>;
}
