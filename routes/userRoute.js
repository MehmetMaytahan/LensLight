import express from 'express'

import * as userController from '../controllers/userController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)
router.get('/dashboard', authenticateToken, userController.getDashboardPage)
router.get('/', authenticateToken, userController.getAllUsers)
router.get('/:id', authenticateToken, userController.getAUser) // saçma bir şekilde bu route isteğini /dashboard'ın üzerine koyduğumda dashboard route'u çalışmıyor ve uygulama çöküyor

export default router