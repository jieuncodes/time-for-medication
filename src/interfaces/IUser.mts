// src/interfaces/IUser.mts
export interface IUser {
  id: number;
  username: string;
  password: string;
  points: number;
  fcmToken?: string;
  subscription?: any;
  hashPassword(): Promise<void>;
  validatePassword(password: string): Promise<boolean>;
}