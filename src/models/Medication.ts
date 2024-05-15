
// src/entities/Medication.ts
import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn
} from "typeorm";
import { User } from "./User";

@Entity()
export class Medication {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.medications, { onDelete: 'CASCADE' })
    user: User;

    @Column()
    name: string;

    @Column()
    dosage: string;

    @Column()
    frequency: string;

    @Column({ type: "timestamp" })
    nextAlarm: Date;

    @Column({ default: true })
    active: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


}
