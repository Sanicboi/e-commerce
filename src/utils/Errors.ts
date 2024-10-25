export class InvalidRequestError extends Error {
  public readonly code: number = 400;
  constructor(message: string) {
    super(message);
  }
}

export class InvalidRequestBodyError extends InvalidRequestError {
  constructor() {
    super("Invalid request body");
  }
}

export class InvalidRequestFieldError extends InvalidRequestError {
  constructor() {
    super("Invalid request field");
  }
}
