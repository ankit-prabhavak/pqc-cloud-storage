import express from 'express'
import cors from 'cors'
// import authRoutes from './routes/authRoutes.js'
// import fileRoutes from './routes/fileRoutes.js'
// import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
// app.use('/api/files', fileRoutes)

app.use(errorHandler)

export default app