import { useState, type FormEvent, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/app/store/auth-store'
import type { ApiError } from '@/lib/api/client'
import { ROUTES } from '@/lib/constants'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    try {
      await login(email, password)
      navigate(ROUTES.converter)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
      const apiErr = err as ApiError
      if (apiErr.errors) {
        const next: Record<string, string> = {}
        for (const item of apiErr.errors) {
          next[item.field] = next[item.field] ? `${next[item.field]} ${item.message}` : item.message
        }
        setFieldErrors(next)
      }
    }
  }

  return (
    <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-surface border border-border p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-text font-sans mb-1">Welcome back</h1>
          <p className="text-sm text-text-dim font-mono mb-6">Good to see you again</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-mono text-text-dim mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="w-full bg-surface-elevated border border-border text-text font-mono text-sm px-3 py-2 focus:outline-none focus:border-accent"
                required
                autoComplete="email"
              />
              {fieldErrors.email && (
                <p className="text-xs text-danger font-mono mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-mono text-text-dim mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full bg-surface-elevated border border-border text-text font-mono text-sm px-3 py-2 focus:outline-none focus:border-accent"
                required
                autoComplete="current-password"
              />
              {fieldErrors.password && (
                <p className="text-xs text-danger font-mono mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {error && (
              <p role="alert" className="text-xs text-danger font-mono">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-bg font-mono font-medium text-sm px-5 py-2 hover:bg-accent-dim transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Loading...' : "Let's go"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-text-dim font-mono">
            Don&apos;t have an account?{' '}
            <Link to={ROUTES.register} className="text-accent hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
