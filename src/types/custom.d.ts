import type { User } from "../db/entities/User";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
