// src/models/User.mts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
} from "typeorm";
import bcrypt from "bcrypt";
import { Medication } from "./Medication.ts";
import { IUser } from "../interfaces/IUser.ts";

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ default: 0 })
  points!: number;

  @Column({ nullable: true })
  fcmToken?: string;

  @Column("json", { nullable: true })
  subscription?: any;

  @OneToMany(() => Medication, (medication) => medication.user, {
    cascade: ["insert", "update", "remove"],
  })
  medications!: Medication[];

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
