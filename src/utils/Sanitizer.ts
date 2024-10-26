import { InvalidRequestBodyError, InvalidRequestFieldError } from "./Errors";
import { RegexTester } from "./RegexTester";

export interface ILoginCredentials {
  type: "email" | "phone";
  value: string;
  password: string;
}

export interface ISignupCredentials {
  email: string;
  password: string;
}

export class Sanitizer {
  public static loginCredentials(data: any): ILoginCredentials {
    if (
      !data.type ||
      !data.value ||
      !data.password ||
      typeof data.value !== "string" ||
      typeof data.password !== "string" ||
      typeof data.type !== "string" ||
      (data.type !== "email" && data.type !== "phone")
    )
      throw new InvalidRequestBodyError();

    if (
      !(data.type === "email" && RegexTester.isEmail(data.value)) ||
      !(data.type == "phone" && RegexTester.isPhone(data.value))
    )
      throw new InvalidRequestFieldError();

    return data;
  }

  public static signupCredentials(data: any): ISignupCredentials {
    if (
      !data.email ||
      !data.password ||
      typeof data.email !== "string" ||
      typeof data.password !== "string"
    )
      throw new InvalidRequestBodyError();

    if (
      !RegexTester.isStrongPassword(data.password) ||
      !RegexTester.isEmail(data.email)
    )
      throw new InvalidRequestFieldError();

    return data;
  }
}
