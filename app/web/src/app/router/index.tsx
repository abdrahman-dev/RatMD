import { createBrowserRouter, Link, RouterProvider, Navigate } from 'react-router-dom'
import { RootLayout } from '@/app/layouts/RootLayout'
import { HomePage } from '@/pages/home/HomePage'
import { ConverterPage } from '@/pages/converter/ConverterPage'
import { DocsPage } from '@/pages/docs/DocsPage'
import { FaqPage } from '@/pages/faq/FaqPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import { ROUTES } from '@/lib/constants'
import { useAuthStore } from '@/app/store/auth-store'

function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="flex items-center gap-2 font-mono text-text-dim text-sm">
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        Loading...
      </span>
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-10">
      <div className="bg-surface border border-border p-6 sm:p-8 w-full max-w-md text-center">
        <p className="text-xs font-mono text-text-dim mb-2">404</p>
        <h1 className="text-2xl font-bold text-text font-sans mb-2">Page not found</h1>
        <p className="text-sm text-text-dim font-mono mb-8">That page doesn&apos;t exist. Head back and keep converting.</p>
        <Link
          to={ROUTES.home}
          className="inline-flex items-center justify-center gap-2 font-mono font-medium rounded-sm transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 bg-accent text-bg hover:bg-accent-dim px-5 py-2 text-sm"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isInitializing = useAuthStore((s) => s.isInitializing)

  if (isInitializing) {
    return <AuthLoading />
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.converter} replace />
  }
  return children
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isInitializing = useAuthStore((s) => s.isInitializing)

  if (isInitializing) {
    return <AuthLoading />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />
  }

  return children
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.converter, element: <ConverterPage /> },
      { path: ROUTES.docs, element: <DocsPage /> },
      { path: ROUTES.faq, element: <FaqPage /> },
      { path: '*', element: <NotFound /> },
      {
        path: ROUTES.login,
        element: (
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        ),
      },
      {
        path: ROUTES.register,
        element: (
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        ),
      },
      {
        path: ROUTES.dashboard,
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.profile,
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
