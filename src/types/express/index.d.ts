// src/types/express/index.d.ts

import 'express';
import { User } from '../../entities/User';

declare module 'express' {
    export interface Request {
        user?: Partial<User> & { id: number; userId?: number };
    }
}
