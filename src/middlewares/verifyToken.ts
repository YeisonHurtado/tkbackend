import { RequestHandler } from "express";
import jwt from 'jsonwebtoken'
import config from "../config";
import Users from "../models/Users";

export const verifyToken: RequestHandler = async ({ body, headers }, res, next) => {
    const token = headers["x-access-token"]

    if (!token) {
        return res.status(403).json({ message: 'No token provided' })
    }

    try {
        const decoded: any = jwt.verify(JSON.parse(token.toString()), config.API_KEY)
        const user = await Users.findById(decoded.id)

        if (!user) return res.status(404).json({ message: 'No user found' })
        next()

    } catch (error) {
        console.error(error)
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