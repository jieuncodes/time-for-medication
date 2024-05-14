// src/types/express/index.d.ts
import { Request } from 'express';
import { IUser } from '../../interfaces/IUser';
import { POINTS_CONFIG } from '../../middlewares/pointsMiddleware';

declare module 'express-serve-static-core' {
  interface Request {
    user?: Partial<IUser> & { id: number };
    activityType?: keyof typeof POINTS_CONFIG;
  }
}
