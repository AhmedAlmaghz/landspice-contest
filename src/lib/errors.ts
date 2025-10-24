// src/lib/errors.ts
// معالجة الأخطاء المخصصة

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code?: string) {
    super(400, message, code || 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'غير مصرح', code?: string) {
    super(401, message, code || 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'ليس لديك صلاحية', code?: string) {
    super(403, message, code || 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'غير موجود', code?: string) {
    super(404, message, code || 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'تضارب في البيانات', code?: string) {
    super(409, message, code || 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'تم تجاوز حد الطلبات', code?: string) {
    super(429, message, code || 'RATE_LIMIT');
    this.name = 'RateLimitError';
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'خطأ في الخادم', code?: string) {
    super(500, message, code || 'INTERNAL_SERVER_ERROR');
    this.name = 'InternalServerError';
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function getErrorResponse(error: unknown) {
  if (isAppError(error)) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    return {
      statusCode: 500,
      message: error.message,
      code: 'INTERNAL_SERVER_ERROR',
    };
  }

  return {
    statusCode: 500,
    message: 'حدث خطأ غير متوقع',
    code: 'UNKNOWN_ERROR',
  };
}
