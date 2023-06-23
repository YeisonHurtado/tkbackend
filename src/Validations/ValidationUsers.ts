import bcrypt from 'bcrypt'
import { error } from 'console'
import e from 'express'

interface userData  {
    names: string,
    surnames: string,
    birth: Date,
    email: string,
    username: string,
    password: string,
    passwordConfirmation: string
}

const ErrorMessage : any = {
    names: "Por favor, escribe tu nombre.",
    surnames: "Por favor, escribe tu apellido.",
    birth: "Fecha de nacimiento requerida",
    birthFailed: "Fecha inválida.",
    email: "El correo electrónico es requerido.",
    emailExists: "Este correo electrónico ya está en uso.",
    username: "Por favor, escribe un nombre de usuario.",
    usernameExists: "Este nombre de usuario ya existe.",
    password: "Por favor, escribe una constraseña.",
    passwordConfirmation: "Las contraseñas no coinciden.",
    passwordInvalid: "La contraseña debe contener al menos 8 caracteres."

}

// SIGNUP
export const pwdConfirmation = function (password: string, passwordConfirmation: string): boolean {
    if (password === passwordConfirmation) {
        return true
    }

    throw {
        status: 400,
        name: 'Validation',
        path: 'pwdconfirmation',
        message: "Las contraseñas no coinciden."
    }
}

export const userFields = function (data: userData): boolean {
    const {names, surnames, birth, email, username, password, passwordConfirmation} = data

    if (names && names.trim().length == 0) {
        throw {
            status: 400,
            name: 'Validation',
            path: 'names',
            message: ErrorMessage.name
        }
    } else if (surnames && surnames.trim().length == 0) {
        throw {
            status: 400,
            name: 'Validation',
            path: 'surnames',
            message: ErrorMessage.surnames
        }
    } else if (!birth) {
        throw {
            status: 400,
            name: 'Validation',
            path: 'birth',
            message: ErrorMessage.birth
        }
    } else if (!email.trim()) {
        throw {
            status: 400,
            name: 'Validation',
            path: 'email',
            message: ErrorMessage.email
        }
    } else if (!username.trim()) {
        throw {
            status: 400,
            name: 'Validation',
            path: 'username',
            message: ErrorMessage.username
        }
    } else if (!password) {
        throw {
            status: 400,
            name: 'Validation',
            path: 'password',
            message: ErrorMessage.password
        }
    } else if (!passwordConfirmation || passwordConfirmation != password) {
        throw {
            status: 400,
            name: 'Validation',
            path: 'passwordConfirmation',
            message: ErrorMessage.passwordConfirmation
        }
    }

    return true
}

export const usernameExist = function (exists: boolean, path: string) : boolean {
     
    const field : any = {
        usernameExists: 'username',
        emailExists: 'email'
    }

    const messageErr =  ErrorMessage[path]

    //const pathErr = field[]
    if (exists) {
        throw {
            status: 400,
            name: 'Validation',
            path: field[path],
            message: messageErr
        }
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

    throw {
        status: 400,
        name: 'Validation',
        path: 'invalid_c',
        message: "Usuario o contraseña incorrectos."
    }
}
