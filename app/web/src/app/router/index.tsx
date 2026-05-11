import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootLayout } from '@/app/layouts/RootLayout'
import { HomePage } from '@/pages/home/HomePage'
import { ConverterPage } from '@/pages/converter/ConverterPage'
import { DocsPage } from '@/pages/docs/DocsPage'
import { FaqPage } from '@/pages/faq/FaqPage'
import { ROUTES } from '@/lib/constants'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.converter, element: <ConverterPage /> },
      { path: ROUTES.docs, element: <DocsPage /> },
      { path: ROUTES.faq, element: <FaqPage /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
