import express, { urlencoded } from 'express'
import dotenv from 'dotenv'

import { conn } from './db.js'
import pageRoute from './routes/pageRoute.js'
import photoRoute from './routes/photoRoute.js'

dotenv.config()

const app = express()

// connection to the DB
conn()
// Template Engine
app.set('view engine', 'ejs')
// Static File
app.use(express.static('public'))
// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/', pageRoute)
app.use('/photos', photoRoute)



app.listen(process.env.PORT | 3000, () => {
    console.log(`Listenin on port : ${process.env.PORT | 3000}`);
})