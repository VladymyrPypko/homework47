import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequest extends ApiError {
  constructor(message = 'Bad request') {
    super(400, message);
  }
}

export class Unauthorized extends ApiError {
  constructor(message = 'Unauthorized access') {
    super(401, message);
  }
}

export class Forbidden extends ApiError {
  constructor(message = 'Access to this resource is forbidden') {
    super(403, message);
  }
}

export class NotFound extends ApiError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class UnprocessableEntity extends ApiError {
  constructor(message = 'Unprocessable entity') {
    super(422, message);
  }
}

export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error') {
    super(500, message);
  }
}

export const errorHandler = (error: ApiError, req: Request, res: Response) => {
  const status = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  res.status(status).send({
    message,
  });
};