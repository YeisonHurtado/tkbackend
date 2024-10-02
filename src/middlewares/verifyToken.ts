import { RequestHandler } from "express";
import jwt from 'jsonwebtoken'
import config from "../config";
import Users from "../models/Users";
import { ValidationError } from "../exceptions/ErrorHandler";

export const verifyToken: RequestHandler = async ({ body, headers }, res, next) => {
    const token = headers["x-access-token"]

    if (!token) {
        return res.status(403).json({ message: 'No token provided' })
    }

    try {
        if (verifyLifeTimeToken(token)) {
            const decoded: any = jwt.verify(JSON.parse(token.toString()), config.API_KEY)
            const user = await Users.findById(decoded.id)

            if (!user) return res.status(404).json({ message: 'No user found' })
            next()
        }

    } catch (error) {
        next(error)
    }
}

export const verifyLifeTimeToken = (token: string | any) => {

    try {
        if (token) {
            const decoded: any = jwt.verify(JSON.parse(token.toString()), config.API_KEY)
            return true;
        }
    } catch (error) {
        throw new ValidationError(401, 'TokenExpiredError', "El token ha expirado.")
    }
}


export const verifyTokenAdmin: RequestHandler = async ({ body, headers }, res, next) => {
    const token = headers["x-access-token"]
    try {
        const decoded: any = jwt.verify(JSON.parse(token?.toLocaleString() as string), config.API_KEY)
        if (!decoded.roles.find((e: any) => e.name === "admin")) return res.status(403).json({ message: "Not Allowed" })
        next()
    } catch (error) {
        console.error(error)
    }
}