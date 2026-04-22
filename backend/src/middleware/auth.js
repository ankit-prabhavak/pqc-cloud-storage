import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protect = async (req, res, next) => {
  try {
    // Token dono jagah se check karo — cookie ya Authorization header
    let token = req.cookies?.accessToken

    if (!token) {
      const authHeader = req.headers.authorization
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]
      }
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, please login' })
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    const user = await User.findById(decoded.id)

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or deactivated' })
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email first' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please refresh' })
    }
    return res.status(401).json({ message: 'Token invalid' })
  }
}

export default protect