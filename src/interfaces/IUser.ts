// src/interfaces/IUser.ts
export interface IUser {
    id: number;
    username: string;
    password: string;
    points: number;
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
  }
  