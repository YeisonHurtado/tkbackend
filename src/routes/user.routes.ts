import { Router } from 'express'
import * as user from '../controllers/user.controller'
import { verifyToken, verifyTokenAdmin, validateNewUser, validateProfilePhoto } from '../middlewares'
import multer from 'multer'

const storage = multer.memoryStorage()

const upload = multer({
    storage: storage
})

const router = Router()

router.post('/login', user.login)
router.post('/signup', verifyToken, verifyTokenAdmin, validateNewUser, user.signup)
router.post('/guest/signup/', validateNewUser, user.signup)
router.put('/update/user/profile/:id', verifyToken, upload.single('profile'), validateProfilePhoto, user.setProfilePhoto)
//router.put('/update/user/:id', upload.single('profile'), user.updateUser)
router.delete('/delete/user/:id', user.deleteUser)
router.get('/user/:id', verifyToken, user.getUser)
router.get('/allusers', user.getAll)
router.get('/roles', user.getAllRoles)

router.get('/activate_account/:token', user.confirmAccount)

export default router