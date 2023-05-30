import { ErrorRequestHandler, Response } from 'express';


const errorsHandler : ErrorRequestHandler = (err, req, res, next)=>{
    res.status(err.status).json({
        status: err.status, 
        name: err.name,
        path: err.path,
        message: err.message
    })
}

export default errorsHandler