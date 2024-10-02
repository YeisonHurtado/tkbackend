import { Request } from 'express'
import multer from 'multer'
import path from 'path'
import { ValidationError } from '../exceptions/ErrorHandler'

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

    throw new ValidationError(400, 'poster', "Debes subir un archivo con formato válido.")
}

export const ValidateFieldRequired = function (nameEvent: string, locationEvent: string, dateEvent: string): boolean {
    const fields = [
        { name: 'name', value: nameEvent.trim(), message: 'Debes escribir el nombre del evento.' },
        { name: 'location', value: locationEvent.trim(), message: 'Debes escribir el lugar del evento (o sin definir).' },
        { name: 'date', value: dateEvent, message: 'La fecha del evento es requerida.' }
    ]

    for (const field of fields) {
        if (field.value.length === 0) {
            throw new ValidationError(400, field.name, field.message)
        }
    }

    return true
}

export const ValidateNoUploadedFile = function (uploaded: boolean) {
    if (!uploaded) {
        throw new ValidationError(400, "poster", "Debes subir el poster del evento.")
    }
}

export const ErrorModifyNotAllowed = function (allowed: boolean): boolean {
    if (!allowed) {
        throw new ValidationError(403, 'alert', "No tienes permisos para realizar esta acción.")
    }
    return true
}

export const ValidateFormDJ = function (lineup?: Array<lineupInterface>) {
    if (lineup) {

        lineup.map(item => {
            if (item.name_dj.length == 0) {
                throw new ValidationError(400, 'name_dj', "Por favor, escribe el nombre del artista.")
            }
        })
        return true
    }

    throw new ValidationError(400, 'name_dj', "Debe haber por lo menos un artista confirmado.")
}
