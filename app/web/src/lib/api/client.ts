const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

interface ApiError extends Error {
  status: number
}

type OnUnauthorized = () => void

let onUnauthorized: OnUnauthorized = () => {}

export function setOnUnauthorized(cb: OnUnauthorized): void {
  onUnauthorized = cb
}

async function request<T>(
  url: string,
  options: RequestInit = {},
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
    onUnauthorized()
    throw new Error('Unauthorized') as ApiError
  }

  const data: T = await res.json()

  if (!res.ok) {
    const body = data as Record<string, unknown>
    const message = typeof body?.message === 'string' ? body.message : 'Request failed'
    const error = new Error(message) as ApiError
    error.status = res.status
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
