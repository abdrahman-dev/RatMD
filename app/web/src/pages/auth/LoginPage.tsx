import { useState, type FormEvent, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/app/store/auth-store'
import { ROUTES } from '@/lib/constants'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate(ROUTES.converter)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
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
          <h1 className="text-2xl font-bold text-text font-sans mb-1">Welcome back</h1>
          <p className="text-sm text-text-dim font-mono mb-6">Sign in to your RatMD account</p>

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
                className="w-full bg-surface border border-border text-text font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-accent"
                style={{ borderRadius: '4px' }}
                required
                autoComplete="email"
              />
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
                className="w-full bg-surface border border-border text-text font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-accent"
                style={{ borderRadius: '4px' }}
                required
                autoComplete="current-password"
              />
            </div>

            <Link to="/forgot-password" className="text-xs text-text-dim font-mono hover:text-accent transition-colors block">
              Forgot password?
            </Link>

            {error && (
              <p className="text-xs text-danger font-mono">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-background font-mono font-medium text-sm px-5 py-2.5 hover:bg-accent-dim transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ borderRadius: '4px' }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
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
