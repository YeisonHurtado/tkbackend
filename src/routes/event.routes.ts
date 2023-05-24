import {Router} from 'express'
import * as event from './event.controller'
import multer from 'multer'
import path from 'path'
import { AppError, HttpCode } from '../exceptions/AppError'
import errorsHandler from '../exceptions/ErrorHandler'


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../../public/images/'))
    },

    filename: function (req, file, cb) {
        cb (null, file.originalname.replace(/\s+/g, '') + Date.now()+path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
});

const router = Router();

router.get('/events', event.getEvents);
router.get('/event/:id', event.getEvent);
router.post('/new_event', upload.single('poster'), event.createEvent);
router.put('/edit_event/:id', event.updateEvent);
router.delete('/delete_event/:id', event.deleteEvent);
router.delete('/delete_all_events', event.deleteAllEvents)

export default router;