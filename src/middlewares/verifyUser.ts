import { RequestHandler } from "express"
import User from '../models/Users'
import * as userValidation from '../Validations/ValidationUsers'

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
