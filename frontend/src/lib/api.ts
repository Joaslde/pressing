import axios from 'axios'

const TOKEN_STORAGE_KEY = 'xpressing_token'

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  } catch {
    // localStorage unavailable (private browsing, etc.) - auth just won't persist across reloads.
  }
}

/**
 * Bearer-token auth (Sanctum personal access tokens), not cookies - the
 * frontend and API can safely live on different domains (e.g. separate free
 * hosts) without depending on cross-site cookies, which browsers
 * increasingly block by default.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      setStoredToken(null)
    }
    return Promise.reject(error)
  }
)

export interface ApiErrorPayload {
  message: string
  errors?: Record<string, string[]>
}

export function getApiErrorMessage(error: unknown, fallback = 'Une erreur est survenue.'): string {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    return error.response?.data?.message ?? fallback
  }
  return fallback
}

export function getApiFieldErrors(error: unknown): Record<string, string[]> | undefined {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    return error.response?.data?.errors
  }
  return undefined
}
