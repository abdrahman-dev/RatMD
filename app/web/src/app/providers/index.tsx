import { useEffect, type ReactNode } from 'react'
import { useAuthStore } from '@/app/store/auth-store'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const fetchMe = useAuthStore((s) => s.fetchMe)

  useEffect(() => {
    void fetchMe()
  }, [fetchMe])

  return <>{children}</>
}
