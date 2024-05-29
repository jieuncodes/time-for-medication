// src/models/Medication.mts
import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn
} from "typeorm";

@Entity()
export class Medication {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne('User', 'medications', { onDelete: 'CASCADE' })
    user!: any;

    @Column()
    name!: string;

    @Column()
    dosage!: string;

    @Column()
    frequency!: string;

    @Column({ type: "timestamp" })
    nextAlarm!: Date;

    @Column({ default: true })
    active: boolean = true;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
