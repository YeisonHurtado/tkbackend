// exceptions/ErrorHandler.ts

import { ErrorRequestHandler, Response } from 'express';
import { AppError, HttpCode } from './AppError';
import { error } from 'console';
import path from 'path';


const errorsHandler : ErrorRequestHandler = (err, req, res, next)=>{
    res.status(err.status).json({
        status: err.status, 
        name: err.name,
        path: err.path,
        message: err.message
    })
}

export default errorsHandler

// class ErrorHandler {
//     private handleTrustedError(error: AppError, response: Response): void {
//         response.status(error.httpCode).json({ message: error.message });
//     }

//     private handleCriticalError(error: Error | AppError, response?: Response): void {
//     if (response) {
//       response
//         .status(HttpCode.INTERNAL_SERVER_ERROR)
//         .json({ message: 'Internal server error' });
//     }

//     console.log('Application encountered a critical error. Exiting');
//     process.exit(1);
//   }

//   private isTrustedError(error: Error): boolean {
//     if (error instanceof AppError) {
//       return error.isOperational;
//     }

//     return false;
//   }

//   public handleError(error: Error | AppError, response?: Response): void {
//     if (this.isTrustedError(error) && response) {
//       this.handleTrustedError(error as AppError, response);
//     } else {
//       this.handleCriticalError(error, response);
//     }
//   }

// }

// export const errorHandler = new ErrorHandler();