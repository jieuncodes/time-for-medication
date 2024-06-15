// src/types/requests.mts
import { Request } from "express";
import { IUser } from "../interfaces/IUser.ts";
import { Medication } from "../models/Medication.ts";
import { POINTS_CONFIG } from "../middlewares/pointsMiddleware.ts";

export interface PartialUser extends Partial<IUser> {
  id: number;
}

export interface AuthRequest extends Request {
  user?: PartialUser;
}

export interface PointsRequest extends Request {
  user?: PartialUser;
  activityType?: keyof typeof POINTS_CONFIG;
}

export interface MedicationRequest extends Request<{ id: string }> {
  user?: PartialUser;
  body: {
    name: string;
    dosage: string;
    frequency: string;
    nextAlarm: string;
    medication?: Medication;
    active?: boolean;
  };
}

export interface SubscriptionRequest extends Request {
  body: {
    userId: number;
    subscription: any;
  };
}
