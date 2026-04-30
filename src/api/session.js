export const ACCESS_TOKEN_KEY = "token"
export const REFRESH_TOKEN_KEY = "refreshToken"
export const AUTH_EXPIRED_EVENT = "schemion:auth-expired"
export const TOKEN_REFRESH_LEEWAY_MS = 60 * 1000

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)

export const extractSessionTokens = (payload = {}) => {
  const accessToken = payload.access_token || payload.accessToken || payload.token || null
  const refreshToken = payload.refresh_token || payload.refreshToken || null

  return { accessToken, refreshToken }
}

export const setSession = ({ accessToken, refreshToken }) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

export const clearSession = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const notifyAuthExpired = () => {
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT))
}

const base64UrlDecode = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), "=")
  const decoded = window.atob(padded)

  try {
    return decodeURIComponent(
      decoded
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    )
  } catch {
    return decoded
  }
}

export const decodeJwtPayload = (token) => {
  if (!token || typeof token !== "string") return null

  const [, payload] = token.split(".")
  if (!payload) return null

  try {
    return JSON.parse(base64UrlDecode(payload))
  } catch {
    return null
  }
}

export const getTokenExpiryMs = (token) => {
  const payload = decodeJwtPayload(token)
  if (!payload?.exp) return null

  return payload.exp * 1000
}

export const isTokenExpired = (token, leewayMs = 0) => {
  const expiryMs = getTokenExpiryMs(token)
  if (!expiryMs) return false

  return Date.now() >= expiryMs - leewayMs
}
