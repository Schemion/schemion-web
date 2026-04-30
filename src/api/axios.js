import axios from "axios"
import {
  clearSession,
  extractSessionTokens,
  getAccessToken,
  getRefreshToken,
  notifyAuthExpired,
  setSession
} from "./session"

const API_BASE_URL = "http://localhost:8000"

const api = axios.create({
  baseURL: API_BASE_URL
})

const refreshApi = axios.create({
  baseURL: API_BASE_URL
})

let refreshPromise = null

const isAuthEndpoint = (url = "") => (
  url.includes("/auth/login") ||
  url.includes("/auth/register") ||
  url.includes("/auth/refresh")
)

export const refreshSession = async () => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error("Refresh token is missing")
  }

  if (!refreshPromise) {
    refreshPromise = refreshApi
      .post("/auth/refresh", { refresh_token: refreshToken }, {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      })
      .then((res) => {
        const tokens = extractSessionTokens(res.data)
        if (!tokens.accessToken) {
          throw new Error("Refresh response does not include access token")
        }

        setSession({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken || refreshToken
        })

        return tokens.accessToken
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true

      try {
        const nextToken = await refreshSession()
        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${nextToken}`
        return api(originalRequest)
      } catch {
        clearSession()
        notifyAuthExpired()
        return Promise.reject(error)
      }
    }

    if (status === 401 && !isAuthEndpoint(originalRequest?.url)) {
      clearSession()
      notifyAuthExpired()
    }

    return Promise.reject(error)
  }
)

export default api
