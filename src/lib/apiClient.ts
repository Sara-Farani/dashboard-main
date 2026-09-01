import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { getPersistedToken } from './authSession'

export interface ApiErrorResponse {
  message?: string
  errors?: Record<string, unknown>
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getPersistedToken()

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`)
    } else {
      /*
        اگر Axios config قبلی را reuse کرده باشد،
        مطمئن می‌شویم Authorization قبلی باقی نمی‌ماند.
      */
      config.headers.delete('Authorization')
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

export function getApiErrorMessage(
  error: unknown,
  fallback = 'خطایی در ارتباط با سرور رخ داد.',
): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallback
  }

  return error.response?.data?.message ?? fallback
}