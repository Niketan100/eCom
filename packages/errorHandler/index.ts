export class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    details: any;

    constructor(message: string, statusCode: number, details : any) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found', details : any = {}) {
        super(message, 404, details);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string = 'Bad request', details : any = {}) {
        super(message, 400, details);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized', details : any = {}) {
        super(message, 401, details);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden', details : any = {}) {
        super(message, 403, details);
    }
}   

export class DbError extends AppError {
    constructor(message: string = 'Database error', details : any = {}) {
        super(message, 500, details);
    }
}

export class ValidationError extends AppError {
    constructor(message: string = 'Validation error', details : any = {}){
        super(message, 400, details);
    }
}

export class RateLimitError extends AppError{
    constructor(message : string =  'Error in rate limit', details : any = {}){ 
        super(message, 429, details);
    }
}


