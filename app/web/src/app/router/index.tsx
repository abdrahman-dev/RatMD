import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { RootLayout } from '@/app/layouts/RootLayout'
import { HomePage } from '@/pages/home/HomePage'
import { ConverterPage } from '@/pages/converter/ConverterPage'
import { DocsPage } from '@/pages/docs/DocsPage'
import { FaqPage } from '@/pages/faq/FaqPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { VerifyEmailPage } from '@/pages/auth/VerifyEmailPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import { ROUTES } from '@/lib/constants'
import { useAuthStore } from '@/app/store/auth-store'

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) {
    return <Navigate to={ROUTES.converter} replace />
  }
  return children
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-mono text-text-dim text-sm">Loading...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />
  }

  return children
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.converter, element: <ConverterPage /> },
      { path: ROUTES.docs, element: <DocsPage /> },
      { path: ROUTES.faq, element: <FaqPage /> },
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
        path: ROUTES.verifyEmail,
        element: (
          <PublicOnlyRoute>
            <VerifyEmailPage />
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
