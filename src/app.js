import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())

// Routes
import authRouter from './routes/auth.routes.js'
import eventRouter from './routes/event.routes.js'

app.use('/auth', authRouter)
app.use('/event', eventRouter)

export default app