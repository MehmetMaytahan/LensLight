import express from 'express';
import * as photoController from '../controllers/photoController.js';
const router = express.Router();

router
    .post('/', photoController.createPhoto)
    .get('/', photoController.getAllPhotos)

export default router;