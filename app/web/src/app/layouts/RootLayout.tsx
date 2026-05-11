import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ isolation: 'isolate' }}>
      <Header />
      <main className="flex-1 pt-14">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
