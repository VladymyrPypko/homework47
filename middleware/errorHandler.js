export class ApiError extends Error {
  constructor(statusCode, message) {
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

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Internal server error' });
};