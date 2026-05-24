import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AnimatedBackground } from '@/components/background/AnimatedBackground'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-bg flex flex-col" style={{ isolation: 'isolate' }}>
      <AnimatedBackground />
      <Header />
      <main className="flex-1 pt-12" style={{ position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
