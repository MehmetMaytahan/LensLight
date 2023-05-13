import express from 'express'
import dotenv from 'dotenv'

import { conn } from './db.js'
import  pageRouter from './routes/pageRouter.js'

dotenv.config()

const app = express()

// connection to the DB
conn()

// Template Engine
app.set('view engine', 'ejs')
// Static File
app.use(express.static('public'))

// Routes
app.use('/', pageRouter)

app.listen(process.env.PORT | 3000, () => {
    console.log(`Listenin on port : ${process.env.PORT | 3000}`);
})