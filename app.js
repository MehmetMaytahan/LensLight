import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

import { conn } from './db.js'
import pageRoute from './routes/pageRoute.js'
import photoRoute from './routes/photoRoute.js'
import userRoute from './routes/userRoute.js'
import { checkUser } from './middlewares/authMiddleware.js'

import fileUpload from 'express-fileupload'
import { v2 as cloudinary } from 'cloudinary'
import methodOverride from 'method-override'

dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
})

const app = express()

// connection to the DB
conn()
// Template Engine
app.set('view engine', 'ejs')
// Static File
app.use(express.static('public'))
// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // form icindeki verileri parse etmek icin kullaniyoruz.
app.use(cookieParser())
app.use(fileUpload({ useTempFiles: true }))
app.use(methodOverride('_method', {
    methods: ['POST', 'GET']
}))

// Routes
app.use('*', checkUser)
app.use('/', pageRoute)
app.use('/photos', photoRoute)
app.use('/users', userRoute)



app.listen(process.env.PORT | 3000, () => {
    console.log(`Listenin on port : http://localhost:${process.env.PORT | 3000}`);
})