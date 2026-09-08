// Two categories of failure (coding-standards.md §9). Expected failures are
// return values the UI can render — see `Result<T>` below. Unexpected
// failures throw one of these classes and are caught by the error boundary
// and Sentry. Never a bare Error, and never a Prisma error surfaced directly
// to a user.

export class AppError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

/** A record was requested that does not exist, or does not belong to this organisation. */
export class NotFoundError extends AppError {}

/** The current session is not permitted to perform this action. */
export class ForbiddenError extends AppError {}

/** Input reached a layer that assumes it is already valid, and it was not. */
export class ValidationError extends AppError {}

/** A domain rule was violated in a way that is a defect, not an expected outcome. */
export class DomainError extends AppError {}

/**
 * For expected failures a domain function can hand back to its caller — a
 * quote that cannot be accepted because it is superseded, for example — so
 * the UI can render the reason rather than an error boundary catching an
 * exception for something that is a normal business outcome.
 */
export type Result<T, E = string> =
  | { ok: true; data: T }
  | { ok: false; error: E }
