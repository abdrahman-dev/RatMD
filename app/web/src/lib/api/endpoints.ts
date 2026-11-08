export const AUTH = {
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  me: '/auth/me',
} as const

export const CONVERSIONS = {
  save: '/conversions/save',
  history: '/conversions/history',
  stats: '/conversions/stats',
  enhance: '/conversions/enhance',
} as const

export const PROFILE = {
  me: '/profile',
  update: '/profile',
  llmKey: '/profile/llm-key',
} as const
