import axios, { isAxiosError } from 'axios'
import { ApiError } from './apiError'

const DEFAULT_MESSAGE = 'Something went wrong'

const toApiError = (error: unknown) => {
  if (!isAxiosError<{ message?: string }>(error)) {
    return new ApiError(0, DEFAULT_MESSAGE)
  }

  if (!error.response) {
    return new ApiError(0, 'Network error. Check your connection')
  }

  const { status, data } = error.response
  return new ApiError(status, data?.message ?? DEFAULT_MESSAGE)
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
})

http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error)),
)
