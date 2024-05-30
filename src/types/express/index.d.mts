// src/types/express/index.d.ts
import { IUser } from '../../interfaces/IUser.mts';
import { POINTS_CONFIG } from '../../middlewares/pointsMiddleware.mts';

declare module 'express-serve-static-core' {
  interface Request {
    user?: Partial<IUser> & { id: number };
    activityType?: keyof typeof POINTS_CONFIG;
  }
}
