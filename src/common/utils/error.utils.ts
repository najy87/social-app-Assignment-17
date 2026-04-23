export class NotFoundException extends Error {
  constructor(massege: string) {
    super(massege, { cause: 404 });
  }
}

export class UnAuthorizedException extends Error {
  constructor(massege: string) {
    super(massege, { cause: 401 });
  }
}

export class ConflictException extends Error {
  constructor(massege: string) {
    super(massege, { cause: 409 });
  }
}

export class BadRequestException extends Error {
  constructor(
    massege: string,
    public details?: Record<string, string>[],
  ) {
    super(massege, { cause: 400 });
  }
}
