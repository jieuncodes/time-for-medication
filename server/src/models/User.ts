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

  @Column({ nullable: true })
  password?: string;

  @Column({ default: 0 })
  points!: number;

  @Column({ nullable: true })
  fcmToken?: string;

  @Column("json", { nullable: true })
  subscription?: any;

  @Column({ nullable: true })
  provider?: string;

  @Column({ type: "date", nullable: true })
  lastLoginDate?: Date | null;

  @Column({ type: "date" })
  registerDate!: Date;

  @Column({ type: "date", nullable: true })
  lastLoginPoint?: Date | null;

  @OneToMany(() => Medication, (medication) => medication.user, {
    cascade: ["insert", "update", "remove"],
  })
  medications!: Medication[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(unencryptedPassword: string): Promise<boolean> {
    if (!this.password) {
      throw new Error("No password set for this user");
    }
    return bcrypt.compare(unencryptedPassword, this.password);
  }
}
