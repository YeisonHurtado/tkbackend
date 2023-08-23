import { RequestHandler } from 'express'
import Event from '../models/Events'
import config from '../config'
import fs from 'fs-extra'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import Users from '../models/Users'
import path from 'path'

export const getEvents: RequestHandler = async (req, res) => {
    const events = await Event.find()
    return res.json(events)
}

export const getEvent: RequestHandler = async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(204).json()
    return res.json(event);
}

export const getPastEvents: RequestHandler = async (req, res) => {
    const dateNow = Date.now()
    if (req.params.id) {
        const pastEventsUser = await Users.findById(req.params.id).populate({ path: 'events', match: { date: { $lt: new Date(dateNow) } } })
        return res.json(pastEventsUser)
    }
    const pastEvents = await Event.find({ date: { $lt: new Date(dateNow) } })
    return res.json(pastEvents)
}
export const getUpComingEvents: RequestHandler = async (req, res) => {
    const dateNow = Date.now()
    if (req.params.id) {
        const upcomingEventsUser = await Users.findById(req.params.id).populate({ path: 'events', match: { date: { $gte: new Date(dateNow) } } })
        return res.json(upcomingEventsUser)
    }
    const events = await Event.find({ date: { $gte: new Date(dateNow) } })
    return res.json(events)
}

export const getEventsLike: RequestHandler = async (req, res) => {
    if (req.params.search && req.params.search.length > 0) {
        const events = await Event.find({ $or: [{ name: { $regex: req.params.search, $options: "i" } }, { 'lineup.name_dj': { $regex: req.params.search, $options: "i" } }] })
        return res.json(events)
    }
    return res.status(204).json([])
}

export const createEvent: RequestHandler = async ({ file, body, headers }, res, next) => {
    const token: string | any = headers["x-access-token"]
    const decoded: any = jwt.verify(JSON.parse(token.toString()), config.API_KEY)

    try {
        const { filename }: string | any = file
        body.poster = `http://${config.MONGO_HOST}:${config.PORT}/images/${filename}`
        body.date = new Date(moment(body.date, 'YYYY-MM-DDTHH:mm', true).format())
        const event = new Event(body)
        const eventSaved = await event.save()
        const user = await Users.findByIdAndUpdate(decoded.id, { $push: { events: eventSaved.id } })
        eventSaved ? res.json(eventSaved) : res.status(204).json()
    } catch (error) {
        next(error)
    }
}

export const updateEvent: RequestHandler = async ({ file, body, params, headers }, res, next) => {
    try {
        const eventFound = await Event.findById(params.id);
        const nameFile = eventFound?.poster.replace(`http://${config.MONGO_HOST}:${config.PORT}/images/`, "") || ""

        if (eventFound) {
            await fs.unlink(path.join(__dirname, '../../public/images', nameFile))
        }

        const { filename }: string | any = file
        body.poster = `http://${config.MONGO_HOST}:${config.PORT}/images/${filename}`
        body.date = new Date(moment(body.date, 'YYYY-MM-DDTHH:mm', true).format()) // Fecha y hora del evento
        const lineups = body.lineup // Copia el line up recibido
        delete body.lineup // borra el line up recibido
        // Elimina todos los artistas del line up para que no se repitan al actualizar el documento del evento
        const eventLineup = await Event.findByIdAndUpdate(params.id, { ...body, $unset: { lineup: [] } }, { new: true })
        // Se actualiza el evento y agrega de nuevo el line up con sus modificaciones
        const eventUpdate = await Event.findByIdAndUpdate(params.id, { ...body, $addToSet: { lineup: { $each: lineups } } }, { new: true })
        eventUpdate ? res.json(eventUpdate) : res.status(204).json()
    } catch (error) {
        next(error)
    }
}

export const deleteArtistLineup: RequestHandler = async (req, res) => {
    const eventDeleteArtist = await Event.findByIdAndUpdate(req.params.id, { $pull: { lineup: req.body.lineup } }, { new: true })
    return true
}
export const deleteEvent: RequestHandler = async (req, res) => {
    const eventFound = await Event.findByIdAndDelete(req.params.id);
    if (!eventFound) return res.status(204).json()
    const nameFile = eventFound?.poster.replace(`http://${config.MONGO_HOST}:${config.PORT}/images/`, "") || ""
    if (eventFound) {
        await fs.unlink(path.join(__dirname, '../../public/images', nameFile))
    }
    res.json(eventFound)
}


// Elimina todos los registros
export const deleteAllEvents: RequestHandler = async (req, res) => {
    const eventsDeleted = await Event.deleteMany()
    res.json(eventsDeleted)
}