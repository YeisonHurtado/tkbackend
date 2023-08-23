import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import * as validation from '../Validations/ValidationEvent'
import config from '../config'
import path from 'path'
import Users from '../models/Users'
import Events from '../models/Events'
import { error } from 'console'
import fs from 'fs-extra'
//Valida el formulario para crea o actualizar eventos
export const validateNewEvent: RequestHandler = async (req, res, next) => {
    try {

        if (req.file) {
            validation.ValidateFieldRequired(req.body.name, req.body.location, req.body.date)
            validation.ValidateFormDJ(req.body.lineup)
            validation.ValidateFormatFile(req.file)

        } else {
            validation.ValidateNoUploadedFile(false)
        }

    } catch (error) {
        const pathImg = path.join(__dirname, `../../public/images/${req.file?.filename}`) /** Toma la ruta original del archivo guardado */
        if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg)
        next(error)
    }
    next()
}

//Valida únicamente si el usuario que intenta actualizar el evento fue el que lo subio en primera instancia
export const validateModifiedEvent: RequestHandler = async ({ file, body, params, headers }, res, next) => {
    const { filename }: any = file
    try {
        const token: string | any = headers["x-access-token"]
        const decoded: any = jwt.verify(JSON.parse(token.toString()), config.API_KEY)

        const user = await Users.findOne({ _id: decoded.id, events: { $in: params.id } })
        const eventFound = await Events.findById(params.id);

        if (!eventFound || !user) {
            await fs.unlink(path.join(__dirname, '../../public/images', filename))
            validation.ErrorModifyNotAllowed(false)
        }
    } catch (error) {
        next(error)
    }
    next()
}