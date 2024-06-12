// src/types/express/index.d.ts
import { IUser } from "../../interfaces/IUser.ts";
import { POINTS_CONFIG } from "../../middlewares/pointsMiddleware.ts";

declare module "express-serve-static-core" {
  interface Request {
    user?: Partial<IUser> & { id: number };
    activityType?: keyof typeof POINTS_CONFIG;
  }
}
