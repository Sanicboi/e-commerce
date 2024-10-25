import express from "express";
import { dataSource } from "../../db";
import { Sanitizer } from "../../utils/Sanitizer";

const app = express();
app.use(express.json());

dataSource.initialize().then(() => {
  app.post("/api/login", (req, res) => {
    const data = Sanitizer.loginCredentials(req.body);
  });
});
