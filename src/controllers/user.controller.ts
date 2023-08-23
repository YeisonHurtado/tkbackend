import { RequestHandler } from 'express'
import User from '../models/Users'
import * as userValidation from '../Validations/ValidationUsers'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import config from '../config'
import { v4 as uuidv4 } from 'uuid'
import * as toEmail from '../email.controller/send.confirmation.account'
//import * as validation from '../Validations/ValidationSignup'
import moment from 'moment'
import Role from '../models/Role'

export const login: RequestHandler = async (req, res, next) => {
    const { userOrEmail, password } = req.body
    const user: any = await User.findOne({ $or: [{ username: userOrEmail }, { email: userOrEmail }] }).populate("roles")
    try {
        if (user) {
            const userPWD = user.password
            const roles = user.roles
            if (userValidation.pwdLogin(password, userPWD, true) && userValidation.activateAccount(user.activated)) {
                const token = jwt.sign(
                    { email: user.email, id: user._id, roles, names: user.names, surnames: user.surnames, userOrEmail },
                    config.API_KEY,
                    { expiresIn: config.TOKEN_EXPIRES_IN },
                );
                return res.json({ token })
            }
        }
        userValidation.pwdLogin("", "", false)
        next()
    } catch (error) {
        next(error)
    }
}

export const getUser: RequestHandler = async ({ params }, res, next) => {
    const user = await User.findById(params.id).populate("events").populate("roles")
    if (!user) return res.status(204).json()
    return res.json(user)
}

export const getAll: RequestHandler = async ({ body }, res) => {
    const users: any = await User.find()
    if (!users) {
        return res.status(204).json()
    }
    return res.json(users);
}
export const getAllRoles: RequestHandler = async ({ body }, res) => {
    const roles: any = await Role.find()
    if (!roles) {
        return res.status(204).json()
    }
    return res.json(roles);
}

export const signup: RequestHandler = async ({ body }, res, next) => {
    const { names, surnames, birth, email, username, password, passwordConfirmation, roles } = body

    try {
        body.password = bcrypt.hashSync(password, 10)
        const code = uuidv4()
        body.code = code
        const user = new User(body)
        // Sí el rol no fue definido colocaria el rol user por defecto
        if (roles.length > 0) {

            const foundRoles = await Role.find({ name: { $in: roles } })

            user.roles = foundRoles.map(role => role._id)

        } else {
            const role: any = await Role.findOne({ name: "user" })
            user.roles = [role._id]
        }

        // Token de confirmacion

        const userSaved = await user.save()
        if (userSaved) {
            const token = toEmail.getToken({ email, code })
            const template = toEmail.getTemplateHTML(names, surnames, token)
            toEmail.sendEmail(email, template)
            return res.json(userSaved)
        } else {
            return res.status(204).json()
        }
    } catch (error) {
        next(error)
    }

}

export const updateUser: RequestHandler = async ({ body, params }, res, next) => {
    const { names, surnames, birth, email, username, password, passwordConfirmation, roles } = body
    const { id } = params
    const userFound = await User.findById(id)

    try {
        if (userFound) {
            try {
                const userExists = await User.find({ username: username, _id: { $ne: id } })
                const emailExists = await User.find({ email: email, _id: { $ne: id } })

                if (userValidation.userFields(body) && userValidation.pwdConfirmation(password, passwordConfirmation)) {
                    if (userExists.length != 0) {
                        userValidation.usernameExist(true, 'usernameExists')
                    } else if (emailExists.length != 0) {
                        userValidation.usernameExist(true, 'emailExists')
                    }
                    body.password = bcrypt.hashSync(password, 10)

                    if (roles) {
                        const foundRoles = await Role.find({ name: { $in: roles } })
                        body.roles = foundRoles.map(role => role._id)
                    } else {
                        const role: any = await Role.findOne({ name: "user" })
                        body.roles = [role._id]
                    }
                    const userUpdate: any = await User.findByIdAndUpdate(id, { ...body }, { new: true })
                    userUpdate ? res.json(userUpdate) : res.status(204).json()
                }
                next()

            } catch (error) {
                next(error)
            }
        }
        throw {
            status: 404,
            name: 'update_user',
            message: "Usuario no encontrado"
        }
    } catch (error) {
        next(error)
    }

}

export const confirmAccount: RequestHandler = async (req, res) => {
    const token = req.params.token
    const { code, email }: any = toEmail.getDataToken(token)
    const userFound = await User.findOne({ code: code })

    if (userFound) {
        if (userFound.activated) {
            return res.json({ 'mensaje': 'Esta cuenta ya ha sido activada' })
        } else {
            userFound.activated = true
            const userUpdated = await userFound.save()
            if (userUpdated) {
                return res.json({ 'mensaje': `Hola, ${userFound.names} ${userFound.surnames} tu cuenta ha sido activada.` })
            } else {
                return res.json({ 'mensaje': 'No pudo activarse la cuenta' })
            }
        }
    } else {
        return res.json({ 'mensaje': 'Usuario no encontrado' })
    }
}

export const deleteUser: RequestHandler = async (req, res) => {
    const userFound = await User.findByIdAndDelete(req.params.id)
    if (!userFound) return res.status(204).json()
    return res.json(userFound)
}