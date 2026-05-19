export const AUTH = {
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  me: '/auth/me',
  verifyEmail: '/auth/verify-email',
  resendOtp: '/auth/resend-otp',
} as const

export const CONVERSIONS = {
  save: '/conversions/save',
  history: '/conversions/history',
  stats: '/conversions/stats',
} as const

export const COMMUNITY = {
  leaderboard: '/community/leaderboard',
  avatar: '/community/avatar',
  profile: (userId: string) => `/community/profile/${userId}`,
} as const

export const PROFILE = {
  me: '/profile',
  update: '/profile',
} as const
