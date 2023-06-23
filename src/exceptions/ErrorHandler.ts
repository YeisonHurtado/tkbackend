import { ErrorRequestHandler, Response } from 'express';


const errorsHandler : ErrorRequestHandler = (err, req, res, next)=>{
    if (err.status == 500) {
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