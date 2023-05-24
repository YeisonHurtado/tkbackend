import express, { NextFunction, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import config from './config'
import eventRoutes from "./routes/event.routes"
import path from 'path'
import errorHandler from './exceptions/ErrorHandler'
import { AppError } from './exceptions/AppError'

const app = express();
app.set('port', config.PORT)

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Dirección estatica para poder ver la url de las imagenes
app.use('/images',express.static(path.join(__dirname,'../public/images')))


app.use(eventRoutes)
app.use(errorHandler)

export default app; 