import bcrypt from 'bcrypt'
import { error } from 'console'
import e from 'express'

interface userData {
    names: string,
    surnames: string,
    birth: Date,
    email: string,
    username: string,
    password: string,
    passwordConfirmation: string,
    activated: boolean
}

const ErrorMessage: any = {
    names: "Por favor, escribe el nombre.",
    surnames: "Por favor, escribe el apellido.",
    birth: "Fecha de nacimiento requerida",
    birthFailed: "Fecha inválida.",
    email: "El correo electrónico es requerido.",
    emailExists: "Este correo electrónico ya está en uso.",
    username: "Por favor, escribe un nombre de usuario.",
    usernameExists: "Este nombre de usuario ya existe.",
    password: "Por favor, escribe una constraseña.",
    passwordConfirmation: "Las contraseñas no coinciden.",
    passwordInvalid: "La contraseña debe contener al menos 8 caracteres.",
    accountConfirmation: "Debes activar la cuenta, revisa tu correo."
}

// SIGNUP
export const pwdConfirmation = function (password: string, passwordConfirmation: string): boolean {
    if (password === passwordConfirmation) {
        return true
    }

    return errorTemplate(400, 'Validation', 'pwdconfirmation', "Las contraseñas no coinciden.")
}

export const userFields = function (data: userData): boolean {
    const { names, surnames, birth, email, username, password, passwordConfirmation } = data

    if (!names || names.trim().length == 0) {
        return errorTemplate(400, 'Validation', 'names', ErrorMessage.names)
    } else if (!surnames || surnames.trim().length == 0) {
        return errorTemplate(400, 'Validation', 'surnames', ErrorMessage.surnames)
    } else if (!birth) {
        return errorTemplate(400, 'Validation', 'birth', ErrorMessage.birth)
    } else if (!email.trim()) {
        return errorTemplate(400, 'Validation', 'email', ErrorMessage.email)
    } else if (!username.trim()) {
        return errorTemplate(400, 'Validation', 'username', ErrorMessage.username)
    } else if (!password) {
        return errorTemplate(400, 'Validation', 'password', ErrorMessage.password)
    } else if (!passwordConfirmation || passwordConfirmation != password) {
        return errorTemplate(400, 'Validation', 'passwordConfirmation', ErrorMessage.passwordConfirmation)
    }

    return true
}

export const usernameExist = function (exists: boolean, path: string): boolean {

    const field: any = {
        usernameExists: 'username',
        emailExists: 'email'
    }

    const messageErr = ErrorMessage[path]

    //const pathErr = field[]
    if (exists) {
        return errorTemplate(400, 'Validation', field[path], messageErr)
    }

    return false
}


// LOGIN
export const pwdLogin = function (password: string, userPWD: string, userFound: boolean): boolean {

    if (userFound) {
        if (bcrypt.compareSync(password, userPWD)) {
            return true
        }
    }

    return errorTemplate(400, 'Validation', 'invalid_c', "Usuario o contraseña incorrectos.")
}

export const activateAccount = function (activate: boolean): boolean {
    if (activate) {
        return true
    }

    return errorTemplate(403, 'Inactive', 'activate', ErrorMessage.accountConfirmation)
}

// Plantilla para errores que sera invocada en cada validación de los campos. Devolvera el error según los datos que le sean asignados
const errorTemplate = (status: number, name: string, path: string, message: string): boolean => {
    throw {
        status: status,
        name: name,
        path: path,
        message: message
    }
}