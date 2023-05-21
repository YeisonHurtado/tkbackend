import {Router} from 'express'
import * as event from './event.controller'
const router = Router();

router.get('/events', event.getEvents);
router.get('/event/:id', event.getEvent);
router.post('/new_event', event.createEvent);
router.put('/edit_event/:id', event.updateEvent);
router.delete('/delete_event/:id', event.deleteEvent);

export default router;