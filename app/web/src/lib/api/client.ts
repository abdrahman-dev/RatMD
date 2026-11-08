import { AUTH } from './endpoints'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export interface ApiError extends Error {
  status: number
  errors?: { field: string; message: string }[]
}

type OnUnauthorized = () => void

let onUnauthorized: OnUnauthorized = () => {}

export function setOnUnauthorized(cb: OnUnauthorized): void {
  onUnauthorized = cb
}

const AUTH_ENDPOINTS = new Set<string>([
  AUTH.login,
  AUTH.register,
  AUTH.logout,
  AUTH.refresh,
])

let refreshPromise: Promise<boolean> | null = null

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE}${AUTH.refresh}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        return res.ok
      } catch {
        return false
      } finally {
        refreshPromise = null
      }
    })()
  }
  return refreshPromise
}

async function request<T>(
  url: string,
  options: RequestInit = {},
  retried = false,
): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (res.status === 401) {
    const path = url.split('?')[0]
    if (!retried && !AUTH_ENDPOINTS.has(path)) {
      const refreshed = await refreshAccessToken()
      if (refreshed) {
        return request<T>(url, options, true)
      }
    }
    onUnauthorized()
    throw new Error('Unauthorized') as ApiError
  }

  const data: T = await res.json()

  if (!res.ok) {
    const body = data as Record<string, unknown>
    const message = typeof body?.message === 'string' ? body.message : 'Request failed'
    const error = new Error(message) as ApiError
    error.status = res.status
    if (Array.isArray(body.errors)) {
      const fieldErrors = (body.errors as unknown[])
        .filter((e): e is { field: string; message: string } => typeof e === 'object' && e !== null && typeof (e as { field?: unknown }).field === 'string' && typeof (e as { message?: unknown }).message === 'string')
        .map((e) => ({ field: e.field, message: e.message }))
      if (fieldErrors.length > 0) error.errors = fieldErrors
    }
    throw error
  }

  return data
}

export const client = {
  get<T>(url: string, options?: RequestInit): Promise<T> {
    return request<T>(url, { ...options, method: 'GET' })
  },

  post<T>(url: string, body?: Record<string, unknown>, options?: RequestInit): Promise<T> {
    return request<T>(url, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  put<T>(url: string, body?: Record<string, unknown>, options?: RequestInit): Promise<T> {
    return request<T>(url, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  delete<T>(url: string, options?: RequestInit): Promise<T> {
    return request<T>(url, { ...options, method: 'DELETE' })
  },
}
