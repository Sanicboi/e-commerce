import express from "express";
import { dataSource } from "../../db";
import { Sanitizer } from "../../utils/Sanitizer";
import {
  HttpError,
  InvalidRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../utils/Errors";
import { User } from "../../db/entities/User";
import bcrypt from "bcrypt";
import { SecretsManager } from "../../utils/SecretsManager";
import { JWT } from "./JWT";

const app = express();
app.use(express.json());

dataSource.initialize().then(() => {
  const userRepo = dataSource.getRepository(User);

  app.post("/api/login", async (req, res) => {
    try {
      const data = Sanitizer.loginCredentials(req.body);
      const user = await userRepo
        .createQueryBuilder("user")
        .select()
        .where("user.email = :email", {
          email: data.value,
        })
        .orWhere("user.phone = :phone", {
          phone: data.value,
        })
        .getOne();
      if (!user) throw new NotFoundError();

      const result = await bcrypt.compare(data.password, user.password);
      if (!result) throw new UnauthorizedError();

      const token = JWT.sign(user.id);

      res
        .status(200)
        .json({
          token,
        })
        .end();
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.code).end();
      } else {
        res.status(500).end();
      }
    }
  });
});
