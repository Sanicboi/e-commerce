import { Request, Response } from "express";
import { HttpError } from "./Errors";

export class ErrorHandler {
  public static async handleHttp(req: Request, res: Response, err: any) {
    if (err instanceof HttpError) {
      req.log.error(err.message);
      res.status(err.code).end();
    } else {
      req.log.fatal("UNKNOWN ERROR");
      res.status(500).end();
    }
  }
}
