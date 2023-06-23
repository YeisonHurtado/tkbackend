import {Router} from 'express'
import * as event from '../controllers/event.controller'
import {validateNewEvent, verifyToken, validateModifiedEvent} from '../middlewares'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4} from 'uuid'


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../../public/images/'))
    },

    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        cb (null, uuidv4() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
});

const router = Router();

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