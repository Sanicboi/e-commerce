import { NextFunction, Response, Request } from "express";
import { JWT } from "./JWT";
import { Sanitizer } from "./Sanitizer";
import { dataSource } from "../db";
import { User } from "../db/entities/User";
import { HttpError, NotFoundError } from "./Errors";

export class Authenticator {
  public static async authenticate(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const token = Sanitizer.authorizationHeader(req.headers.authorization);
      const id = JWT.verify(token);
      const user = await dataSource.getRepository(User).findOne({
        where: {
          id: id,
        },
      });
      if (!user) throw new NotFoundError();
      req.user = user;
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).end();
      } else {
        res.status(500).end();
      }
    }
  }
}
