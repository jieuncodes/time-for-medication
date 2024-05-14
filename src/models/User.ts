// src/models/User.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from "typeorm";
import { Medication } from "./Medication";
import bcrypt from 'bcrypt';
import { IUser } from '../interfaces/IUser';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  points: number;

  @OneToMany(() => Medication, medication => medication.user, { cascade: ['insert', 'update', 'remove'] })
  medications: Medication[];

  @BeforeInsert()
  async hashPassword() {
    if (!this.password) {
      throw new Error("Password must be set before saving a user");
    }
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(unencryptedPassword: string): Promise<boolean> {
    if (!this.password) {
      throw new Error("No password set for this user");
    }
    return bcrypt.compare(unencryptedPassword, this.password);
  }
}
