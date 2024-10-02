import { Router } from 'express'
import * as event from '../controllers/event.controller'
import { validateNewEvent, verifyToken, validateModifiedEvent } from '../middlewares'
import multer from 'multer'
import path from 'path'


/**
 * Este código configura multer para guardar los archivos cargados en la carpeta public/images 
 * con un nombre único generado por uuidv4, manteniendo la extensión original del archivo.
 */
const storage = multer.memoryStorage()

/*const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images/'))
    },

    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname))
    }
})*/

/**
 * Especifica la configuración de almacenamiento que definiste anteriormente con multer.diskStorage. 
 * Esta configuración incluye la carpeta de destino y el nombre del archivo para los archivos cargados.
 */
const upload = multer({
    storage: storage
});

// Se crea un nuevo enrutador
const router = Router();

// Se crean y se configuran la rutas de la aplicación
router.get('/events', event.getEvents);
router.get('/event/:id', event.getEvent);
router.get('/events/past/:id?', event.getPastEvents);
router.get('/events/upcoming/:id?', event.getUpComingEvents);
router.get('/events/search/:search?', event.getEventsLike);

router.post('/create/event', verifyToken, upload.single('poster'), validateNewEvent, event.createEvent);
router.put('/update/event/:id', verifyToken, upload.single('poster'), validateNewEvent, validateModifiedEvent, event.updateEvent);

router.delete('/delete/event/:id', verifyToken, event.deleteEvent);
router.delete('/delete/allevents', event.deleteAllEvents)

export default router;