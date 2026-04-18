import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import authRoutes from './routes/authRoutes.js'
import fileRoutes from './routes/fileRoutes.js'
import securityRoutes from './routes/securityRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(helmet())
app.use(morgan('dev'))
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/files', fileRoutes)
app.use('/api/security', securityRoutes)

app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  pqcAlgorithm: 'ML-KEM-768 (CRYSTALS-Kyber)',
  nistStandard: 'FIPS 203 (2024)'
}))

app.use(errorHandler)

export default app