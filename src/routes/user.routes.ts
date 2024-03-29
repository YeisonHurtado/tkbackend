import { Router } from 'express'
import * as user from '../controllers/user.controller'
import { verifyToken, verifyTokenAdmin, validateNewUser } from '../middlewares'

const router = Router()

router.post('/login', user.login)
router.post('/signup', verifyToken, verifyTokenAdmin, validateNewUser, user.signup)
router.post('/guest/signup/', validateNewUser, user.signup)
router.put('/update/user/:id', user.updateUser)
router.delete('/delete/user/:id', user.deleteUser)
router.get('/user/:id', verifyToken, user.getUser)
router.get('/allusers', user.getAll)
router.get('/roles', user.getAllRoles)

router.get('/activate_account/:token', user.confirmAccount)

export default router