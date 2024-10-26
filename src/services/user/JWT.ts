import jwt from "jsonwebtoken";
import { SecretsManager } from "../../utils/SecretsManager";
import { UnauthorizedError } from "../../utils/Errors";

export class JWT {
  public static sign(id: string): string {
    return jwt.sign(
      {
        id,
      },
      SecretsManager.get("JWT_KEY"),
      {
        expiresIn: "7d",
      },
    );
  }

  public static verify(token: string): string {
    try {
      const result = jwt.verify(token, SecretsManager.get("JWT_KEY"));
      if (
        typeof result == "string" ||
        !result.id ||
        typeof result.id !== "string"
      )
        throw new UnauthorizedError();
      return result.id;
    } catch (error) {
      throw new UnauthorizedError();
    }
  }
}
