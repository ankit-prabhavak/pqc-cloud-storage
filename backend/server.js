// import dotenv from 'dotenv'
// dotenv.config()

// import app from './src/app.js'
// import connectDB from './src/config/db.js'

// const PORT = process.env.PORT || 5000

// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Backend running on port ${PORT}`)
//   })
// })


import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const { default: app } = await import('./src/app.js')
const { default: connectDB } = await import('./src/config/db.js')

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV}`)
    // console.log(`Crypto service: ${process.env.CRYPTO_SERVICE_URL}`)
  })
})