import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/app/store/auth-store'
import { client } from '@/lib/api/client'
import { AUTH } from '@/lib/api/endpoints'
import { ROUTES } from '@/lib/constants'
import type { ApiResponse } from '@/types'

function useQuery() {
  const { search } = useLocation()
  return new URLSearchParams(search)
}

export function VerifyEmailPage() {
  const navigate = useNavigate()
  const query = useQuery()
  const emailFromQuery = query.get('email') ?? ''
  const { verifyEmail, isLoading } = useAuthStore()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [email, setEmail] = useState(emailFromQuery)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = [...otp]
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i]
    }
    setOtp(next)
    const focusIndex = Math.min(pasted.length, 5)
    document.getElementById(`otp-${focusIndex}`)?.focus()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const otpValue = otp.join('')
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }
    try {
      await verifyEmail(email, otpValue)
      setSuccess('Email verified successfully!')
      setTimeout(() => navigate(ROUTES.converter), 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    }
  }

  const handleResend = async () => {
    if (cooldown > 0) return
    setError('')
    setSuccess('')
    try {
      await client.post<ApiResponse<never>>(AUTH.resendOtp, { email })
      setSuccess('New OTP sent to your email')
      setCooldown(60)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP')
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-surface border border-border p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-text font-sans mb-1">Check your inbox</h1>
          <p className="text-sm text-text-dim font-mono mb-6">
            We sent you a code. Paste it below and you're in.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {!emailFromQuery && (
              <div>
                <label htmlFor="email" className="block text-xs font-mono text-text-dim mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="w-full bg-bg border border-border text-text font-mono text-sm px-3 py-2 focus:outline-none focus:border-accent"
                  required
                  autoComplete="email"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-text-dim mb-1.5">
                Verification Code
              </label>
              <div className="flex gap-1 sm:gap-2 justify-center" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-mono bg-bg border border-border text-text focus:outline-none focus:border-accent"
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {error && (
              <p className="text-xs text-danger font-mono">{error}</p>
            )}

            {success && (
              <p className="text-xs text-success font-mono">{success}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-bg font-mono font-medium text-sm px-5 py-2 hover:bg-accent-dim transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0}
              className="text-sm text-text-dim font-mono hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[44px] flex items-center"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </button>
            <Link to={ROUTES.login} className="text-sm text-text-dim font-mono hover:text-accent transition-colors min-h-[44px] flex items-center shrink-0">
              Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
