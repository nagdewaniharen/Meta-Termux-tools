export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code: string = 'INTERNAL_ERROR'
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'AUTH_ERROR')
  }
}

export function toApiError(error: unknown): { error: string; status: number } {
  if (error instanceof AppError) {
    return { error: error.message, status: error.statusCode }
  }
  if (error instanceof Error && error.name === 'ZodError') {
    return { error: error.message, status: 400 }
  }
  return { error: 'Internal server error', status: 500 }
}
