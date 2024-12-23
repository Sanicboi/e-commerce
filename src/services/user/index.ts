import path from "path";
require("dotenv").config({
  path: path.join(process.cwd(), ".env"),
});

import express from "express";
import { dataSource } from "../../db";
import { Sanitizer } from "../../utils/Sanitizer";
import {
  ConflictError,
  HttpError,
  NotFoundError,
  UnauthorizedError,
} from "../../utils/Errors";
import { User } from "../../db/entities/User";
import bcrypt from "bcrypt";
import { JWT } from "../../utils/JWT";
import pino from "pino-http";
import { Authenticator } from "../../utils/Authenticator";
import { ErrorHandler } from "../../utils/ErrorHandler";
import { JsonWebTokenError } from "jsonwebtoken";

const app = express();
app.use(
  pino({
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return "warn";
      } else if (res.statusCode >= 500 || err) {
        return "error";
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        return "silent";
      }
      return "info";
    },
  }),
);
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
      ErrorHandler.handleHttp(req, res, err);
    }
  });

  app.post("/api/signup", async (req, res) => {
    try {
      const data = Sanitizer.signupCredentials(req.body);

      const exists = await userRepo
        .createQueryBuilder("user")
        .select()
        .where("user.email = :email", {
          email: data.email,
        })
        .getExists();

      if (exists) throw new ConflictError();

      const user = new User();
      user.email = data.email;
      user.password = await bcrypt.hash(data.password, 10);
      await userRepo.save(user);

      const token = JWT.sign(user.id);

      res
        .status(201)
        .json({
          token,
        })
        .end();
    } catch (err) {
      ErrorHandler.handleHttp(req, res, err);
    }
  });

  app.post("/api/profile", Authenticator.authenticate, async (req, res) => {
    try {
      const data = Sanitizer.profileInfo(req.body);
      req.user.address = data.address;
      req.user.dateOfBirth = data.dateOfBirth;
      req.user.firstName = data.firstName;
      req.user.lastName = data.lastName;
      req.user.phone = data.phone;
      await userRepo.save(req.user);
      res.status(201).end();
    } catch (err) {
      ErrorHandler.handleHttp(req, res, err);
    }
  });

  app.listen(80);
});
