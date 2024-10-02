import express, { NextFunction, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import config from './config'
import userRoutes from './routes/user.routes'
import eventRoutes from "./routes/event.routes"
import path from 'path'
import errorHandler from './exceptions/ErrorHandler'
import { createRoles } from './libs/initialSetup'

const app = express();
app.set('port', config.PORT)
//Al iniciar por primera vez crea el documento Roles en la base de datos.
createRoles()

//Se utiliza para registrar detalles sobre las solicitudes entrantes, como el método HTTP, la URL, el código de estado y el tiempo de respuesta. Esto es útil para depurar y monitorear tu aplicación.
app.use(morgan('dev'));

// es un mecanismo que permite a tu servidor manejar solicitudes de recursos desde un dominio diferente al suyo. Esto es importante para aplicaciones web que necesitan interactuar con APIs o recursos alojados en otros dominios.
app.use(cors());

//Configura un middleware que se encarga de analizar las solicitudes entrantes con datos en formato JSON. 
//Analiza los datos JSON entrantes y los convierte en un objeto JavaScript accesible a través de
app.use(express.json());

// Permite que los datos enviados en un formulario esten decodificado en un objeto plano y no anidado
app.use(express.urlencoded({ extended: false }));

// Dirección estatica para poder ver la url de las imagenes
app.use('/images', express.static(path.join(__dirname, '../public/images')))

// Middleware que son usados para usar las rutas URL de la aplicación
app.use(eventRoutes)
app.use(userRoutes)
// Middleware para el manejo de errores
app.use(errorHandler)

export default app; 