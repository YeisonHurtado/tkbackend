import { NextFunction } from "express"
import Role from "../models/Role"

export const createRoles = async () => {
    try {
        const count = await Role.estimatedDocumentCount()

        // Si existen documentos en esta colección la función no hara nada a parti de aquí.
        if (count > 0) return

        // Si no hay documentos en la colección, se crean tres documentos o tres roles
        // Se utiliza Promise.all para ejecutar las operaciones de guardado en paralelo y espera a que todas se completen.
        const values = await Promise.all([
            new Role({ name: 'user' }).save(),
            new Role({ name: 'admin' }).save(),
            new Role({ name: 'moderator' }).save(),
        ])

        console.log(values)
    } catch (error) {
        console.error(error)
    }
}

/**
 * Esta función createRoles se asegura de que los roles básicos (user, admin, moderator) existan en la colección roles 
 * de la base de datos. Si la colección ya contiene documentos, no hace nada. Si está vacía, crea y guarda los roles.
 */