import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import authRoutes from './routes/authRoutes.js'
import fileRoutes from './routes/fileRoutes.js'
import securityRoutes from './routes/securityRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { apiLimiter } from './middleware/rateLimiter.js'  // apply global rate limiting to all /api routes


const app = express()

app.use(helmet())
app.use(morgan('dev'))
app.set("trust proxy", 1); // trust first proxy (for rate limiting behind a proxy)

app.use(cors({
  origin: process.env.CLIENT_URL,  // must be exact URL, no trailing slash
  credentials: true,               // this must be true
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// app.use(express.json())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())
app.use('/api', apiLimiter)  // applies to all /api routes


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