import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GridBackground } from '@/components/layout/GridBackground'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ isolation: 'isolate' }}>
      <GridBackground />
      <Header />
      <main className="flex-1 pt-14" style={{ position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
