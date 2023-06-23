import { Request } from 'express'
import multer from 'multer'
import path from 'path'

interface lineupInterface {
    name_dj: string,
    stage_name: string
}

export const ValidateFormatFile = function (poster: Express.Multer.File): boolean {
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

export const ValidateFieldRequired = function (nameEvent: String, locationEvent: String): boolean {
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

export const ValidateNoUploadedFile = function (uploaded: boolean) {
    if (!uploaded) {
        throw {
            status: 400,
            name: 'Validation',
            path: 'poster',
            message: "Debes subir el poster del evento."
        }
    }
}

export const ErrorModifyNotAllowed = function (allowed: boolean) : boolean {
    if (!allowed) {
        throw {
            status: 403,
            name: 'Validation',
            path: 'alert',
            message: "No tienes permisos para realizar esta acción."
        }
    }
    return true
}

export const ValidateFormDJ = function (lineup?: Array<lineupInterface>) {
    if (lineup) {

        lineup.map(item => {
            if (item.name_dj.length == 0) {
                throw {
                    status: 400,
                    name: 'Validation',
                    path: 'name_dj',
                    message: 'Por favor, escribe el nombre del artista.'
                }
            }
        })
        return true
    }

    throw {
        status: 400,
        name: 'Validation',
        path: 'name_dj',
        message: 'Debe haber por lo menos un artista confirmado.'
    }
}
