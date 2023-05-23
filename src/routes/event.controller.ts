import {RequestHandler} from 'express'
import Event from './Events'
import config from '../config';

export const getEvents : RequestHandler = async (req, res) => {
    const events = await Event.find(); 
    return res.json(events);
}

export const getEvent : RequestHandler = async (req, res) => {
    const event = await Event.findById(req.params.id); 
    if  (!event) return res.status(204).json()
    return res.json(event);
}

export const createEvent : RequestHandler = async (req, res) => {
    if (req.file) {
        const {filename} = req.file
        req.body.poster = `http://${config.MONGO_HOST}:${config.PORT}/images/${filename}`
    }
    const event = new Event(req.body)
    const eventSaved = await event.save()
    res.json(eventSaved)
}

export const updateEvent : RequestHandler =async (req, res) => {
    const lineups = req.body.lineup || [];
    delete req.body.lineup
    console.log(req.body.lineup)
    const eventUpdate = await Event.findByIdAndUpdate(req.params.id, {...req.body, $push:{lineup: {$each: lineups}}}, {new: true})
    if  (!eventUpdate) return res.status(204).json()
    res.json(eventUpdate)
}

export const deleteEvent : RequestHandler = async (req, res) => {
    const eventFound = await Event.findByIdAndDelete(req.params.id); 
    if  (!eventFound) return res.status(204).json()
    res.json(eventFound)
}