import express from 'express'

import * as userController from '../controllers/userController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)
router.get('/dashboard', authenticateToken, userController.getDashboardPage)

export default router