import {Router} from 'express'
import * as user from '../controllers/user.controller'
import { verifyToken } from '../middlewares'

const router = Router()

router.post('/login', user.login)
router.post('/signup', user.signup)
router.put('/update/user/:id', user.updateUser)
router.delete('/delete/user/:id', user.deleteUser)
router.get('/user/:id', verifyToken, user.getUser)
router.get('/allusers', user.getAll)

export default router