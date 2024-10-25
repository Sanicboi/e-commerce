import "reflect-metadata";

import { DataSource } from "typeorm";
import { SecretsManager } from "../utils/SecretsManager";
import { User } from "./entities/User";

export const dataSource = new DataSource({
  host: SecretsManager.get("DB_HOST"),
  port: +SecretsManager.get("DB_PORT"),
  password: SecretsManager.get("DB_PASSWORD"),
  database: SecretsManager.get("DB_DATABASE"),
  username: SecretsManager.get("DB_USERNAME"),
  type: "postgres",
  synchronize: Boolean(SecretsManager.get("DB_SYNCHRONIZE")),
  entities: [User],
});
