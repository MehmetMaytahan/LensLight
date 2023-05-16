import express from 'express'

import * as pageController from '../controllers/pageController.js'

const router = express.Router()


router.get('/', pageController.getHomePage)
router.get('/about', pageController.getAboutPage)

export default router