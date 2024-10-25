export class SecretsManager {
  public static get(key: string): string {
    return process.env[key] ?? "";
  }
}
