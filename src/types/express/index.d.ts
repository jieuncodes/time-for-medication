// src/types/express/index.d.ts

import { Request } from 'express';
import { User } from '../../entities/User';

declare module 'express' {
    export interface Request {
        user?: Partial<User> & { id: number; userId?: number };
        activityType?: keyof typeof POINTS_CONFIG;
    }
}
