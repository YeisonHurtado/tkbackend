import bcrypt from 'bcrypt'
import { ValidationError } from '../exceptions/ErrorHandler'

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

    throw new ValidationError(400, 'passwordConfirmation', ErrorMessage.passwordConfirmation)
}

export const userFields = function (data: userData): boolean {
    const { names, surnames, birth, email, username, password, passwordConfirmation } = data
    const fields = [
        { name: 'names', value: names.trim(), message: ErrorMessage.names },
        { name: 'surnames', value: surnames.trim(), message: ErrorMessage.surnames },
        { name: 'birth', value: birth, message: ErrorMessage.birth },
        { name: 'email', value: email.trim(), message: ErrorMessage.email },
        { name: 'username', value: username.trim(), message: ErrorMessage.username },
        { name: 'password', value: password, message: ErrorMessage.password },
        { name: 'passwordConfirmation', value: passwordConfirmation, message: ErrorMessage.passwordConfirmation },
    ]

    for (const field of fields) {
        if (field.value.toString().length === 0) {
            throw new ValidationError(400, field.name, field.message)
        }

        if (field.name.toString() === 'password' && field.value.toString().length < 8) {
            throw new ValidationError(400, field.name, ErrorMessage.passwordInvalid)
        }
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
    throw new ValidationError(400, 'invalid_c', "Usuario o contraseña incorrectos.")
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

export const ValidateNoUploadedPhoto = function (uploaded: boolean) {
    if (!uploaded) {
        throw new ValidationError(400, "profile", "Sube una foto.")
    }
}

export const ErrorModifyNotAllowed = function (allowed: boolean): boolean {
    if (!allowed) {
        throw new ValidationError(403, 'alert', "No tienes permisos para realizar esta acción.")
    }
    return true
}