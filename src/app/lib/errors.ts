export class BaseError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ValidationError extends BaseError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR');
    }
}

export class DatabaseError extends BaseError {
    constructor(message: string) {
        super(message, 'DATABASE_ERROR');
    }
}

export class AuthenticationError extends BaseError {
    constructor(message: string) {
        super(message, 'AUTH_ERROR');
    }
} 