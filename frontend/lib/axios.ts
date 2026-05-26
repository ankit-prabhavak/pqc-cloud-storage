import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // sends cookies automatically with every request
  headers: {
    'Content-Type': 'application/json'
  }
})

// automatically retry with refresh token if access token expires
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        return api(originalRequest)
      } catch {
        // don't redirect automatically
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default api