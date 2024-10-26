export class HttpError extends Error {
  constructor(
    message: string,
    public readonly code: number,
  ) {
    super(message);
  }
}

export class InvalidRequestError extends HttpError {
  constructor(message: string) {
    super(message, 400);
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

export class NotFoundError extends HttpError {
  constructor() {
    super("Not found", 404);
  }
}

export class UnauthorizedError extends HttpError {
  constructor() {
    super("Unauthorized", 401);
  }
}

export class ConflictError extends HttpError {
  constructor() {
    super("Conflict", 409);
  }
}
