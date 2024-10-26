export class RegexTester {
  public static isEmail(str: string): boolean {
    const r =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return r.test(str);
  }

  public static isPhone(str: string): boolean {
    const r = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return r.test(str);
  }

  public static isStrongPassword(str: string): boolean {
    const r = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return r.test(str);
  }
}
