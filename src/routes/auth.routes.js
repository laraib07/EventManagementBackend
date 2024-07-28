import { Router } from 'express'
import { login, logout, register } from '../controllers/auth.controller.js'
import { checkAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.route('/login').post(login)
router.route('/logout').post(checkAuth, logout)
router.route('/register').post(register)

export default router