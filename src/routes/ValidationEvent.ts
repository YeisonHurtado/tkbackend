import { Request } from 'express'
import multer from 'multer'
import path from 'path'

export const ValidateFormatFile = function (poster: Express.Multer.File):boolean{
    const filetype = /jpeg|jpg|png|gif/

    const mimetype = filetype.test(poster.mimetype)
    const extname = filetype.test(path.extname(poster.originalname))
        
    if (mimetype && extname) {
        return true
    }
    
    throw {
        status: 400,
        name: 'Validation',
        path: 'poster',
        message: "Debes subir un archivo con formato válido."
    }
}

export const ValidateFieldRequired = function (nameEvent: String, locationEvent: String): boolean{
    nameEvent = nameEvent.trim()
    locationEvent = locationEvent.trim()
    const nameLength = nameEvent.length
    const locationLength = locationEvent.length

    if (nameLength == 0) {
        throw {
            status: 400,
            name: 'Validation',
            path: 'name',
            message: "Debes escribir el nombre del evento."
        }
    } else if (locationLength == 0) {
        throw {
            status: 400,
            name: 'Validation',
            path: 'location',
            message: "Debes escribir el lugar del evento (o sin definir)."
        }
    }

    return true
}

export const ValidateNoUploadedFile = function (uploaded : boolean) {
    if (!uploaded){
        throw {
            status: 400,
            name: 'Validation',
            path: 'poster',
            message: "Debes subir el poster del evento."
        }
    }
}