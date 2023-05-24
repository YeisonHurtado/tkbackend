import {RequestHandler} from 'express'
import Event from './Events'
import config from '../config';
import * as validation from './ValidationEvent'
import fs from 'fs'
import path from 'path';

export const getEvents : RequestHandler = async (req, res) => {
    const events = await Event.find(); 
    return res.json(events);
}

export const getEvent : RequestHandler = async (req, res) => {
    const event = await Event.findById(req.params.id); 
    if  (!event) return res.status(204).json()
    return res.json(event);
}

export const createEvent : RequestHandler = async (req, res, next) => {
    try {
        if (req.file) {
            try {
                
                if (validation.ValidateFieldRequired(req.body.name, req.body.location) && validation.ValidateFormatFile(req.file)){
                    const {filename} = req.file
                    const nombre = req
                    req.body.poster = `http://${config.MONGO_HOST}:${config.PORT}/images/${filename}`
                    const event = new Event(req.body)
                    const eventSaved = await event.save()
                    eventSaved ? res.json(eventSaved) : res.status(204).json()
                }
            } catch (error) {
                const pathImg = path.join(__dirname, `../../public/images/${req.file.filename}`)
                if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg)
                next(error)
            }
        } else {
            validation.ValidateNoUploadedFile(false)
        }

    } catch (error) {
        next(error)
    }
}

export const updateEvent : RequestHandler =async (req, res) => {
    const lineups = req.body.lineup || [];
    delete req.body.lineup
    console.log(req.body.lineup)
    const eventUpdate = await Event.findByIdAndUpdate(req.params.id, {...req.body, $psush:{lineup: {$each: lineups}}}, {new: true})
    if  (!eventUpdate) return res.status(204).json()
    res.json(eventUpdate)
}

export const deleteEvent : RequestHandler = async (req, res) => {
    const eventFound = await Event.findByIdAndDelete(req.params.id); 
    if  (!eventFound) return res.status(204).json()
    res.json(eventFound)
}

// Elimina todos los registros
export const deleteAllEvents : RequestHandler = async(req, res) => {
    const eventsDeleted = await Event.deleteMany()
    res.json(eventsDeleted)
}