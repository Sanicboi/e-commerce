import {
  InvalidRequestBodyError,
  InvalidRequestFieldError,
  InvalidRequestHeaderError,
} from "./Errors";
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

export interface IProfileInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phone: string;
  address: string;
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

  public static authorizationHeader(header: string | undefined): string {
    if (!header) throw new InvalidRequestHeaderError();
    if (!header.startsWith("Bearer ")) throw new InvalidRequestHeaderError();
    const split = header.split(" ");
    if (split.length != 2) throw new InvalidRequestHeaderError();
    if (!split[1]) throw new InvalidRequestHeaderError();
    return split[1];
  }

  public static profileInfo(data: any): IProfileInfo {
    if (!data) throw new InvalidRequestBodyError();
    if (
      !data.firstName ||
      !data.lastName ||
      !data.phone ||
      !data.dateOfBirth ||
      !data.address ||
      typeof data.firstName !== "string" ||
      typeof data.lastName !== "string" ||
      typeof data.phone !== "string" ||
      typeof data.address !== "string" ||
      typeof data.dateOfBirth !== "string"
    )
      throw new InvalidRequestBodyError();
    try {
      data.dateOfBirth = new Date(Date.parse(data.dateOfBirth));
    } catch (error) {
      throw new InvalidRequestFieldError();
    }

    if (
      !RegexTester.isPhone(data.phone) ||
      !RegexTester.isAlphabetical(data.firstName) ||
      !RegexTester.isAlphabetical(data.lastName)
    )
      throw new InvalidRequestFieldError();
    return data;
  }
}
