import { AppError } from './index.js';

export const errorMiddleware = (err: AppError, req: any, res: any, next: any) => {
   

    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            details: err.details
        });
    }

    // Log the error for debugging purposes
    console.error('Unhandled error:', err);

    // For other types of errors, send a generic 500 response
    return res.status(500).json({
        status: 'error',
        message: 'An internal server error occurred.'
    });
}; 
