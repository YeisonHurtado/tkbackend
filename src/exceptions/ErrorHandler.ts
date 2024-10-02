import { ErrorRequestHandler, Response } from 'express';

export class ValidationError extends Error {
    status: number;
    path: string;

    constructor(status: number, path: string, message: string) {
        super(message);
        this.status = status;
        this.path = path;
        this.name = 'ValidationError';
    }
}

const errorsHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        res.status(err.status).json({
            status: err.status,
            name: err.name,
            path: err.path,
            message: err.message
        });
    } else if (err.status == 500) {
        res.status(err.status).json({
            status: err.status,
            name: "ErrorServer",
            path: 'Server',
            message: 'Ocurrio un error'
        })
    } else {
        res.status(err.status).json({
            status: err.status,
            name: err.name,
            path: err.path,
            message: err.message
        })
    }

}

export default errorsHandler