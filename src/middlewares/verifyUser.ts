import { RequestHandler } from "express"
import User from '../models/Users'
import * as userValidation from '../Validations/ValidationUsers'
import * as validation from '../Validations/ValidationEvent'
import config from "../config"
import jwt from 'jsonwebtoken'
import path from "path"
import fs from "fs-extra"
import { v4 as uuidv4 } from 'uuid'

export const validateNewUser: RequestHandler = async ({ body }, res, next) => {
    const { names, surnames, birth, email, username, password, passwordConfirmation, roles } = body
    try {
        userValidation.userFields(body)
        userValidation.pwdConfirmation(password, passwordConfirmation)
        const userExists = await User.find({ username: username })
        const emailExists = await User.find({ email: email })
        if (userExists.length != 0) {
            userValidation.usernameExist(true, 'usernameExists')
        } else if (emailExists.length != 0) {
            userValidation.usernameExist(true, 'emailExists')
        }
    } catch (error) {
        next(error)
    }
    next()
}

export const validateProfilePhoto: RequestHandler = async ({ body, params, file }, res, next) => {
    const id = params.id
    const user = await User.findById(id)
    try {
        if (file) {
            validation.ValidateFormatFile(file)
            const filename = uuidv4() + path.extname(file.originalname)
            const filePath = path.join(__dirname, `../../public/images/profiles/${filename}`)
            fs.writeFileSync(filePath, file.buffer)
            file.filename = filename
            console.log(user?.names)
            if (!user) {
                await fs.unlink(path.join(__dirname, '../../public/images/profiles', filename))
                userValidation.ErrorModifyNotAllowed(false)
            }
        }

    } catch (error) {
        next(error)
    }

    next()
}
