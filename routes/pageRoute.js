import express from 'express'

import * as pageController from '../controllers/pageController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'

const router = express.Router()


router.get('/', authenticateToken, pageController.getHomePage)
router.get('/about', pageController.getAboutPage)
router.get('/register', pageController.getRegisterPage)
router.get('/login', pageController.getLoginPage)

export default router