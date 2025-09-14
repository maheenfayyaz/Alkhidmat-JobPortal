'use client'

import { ApplicationProvider } from './context/ApplicationContext'
import { usePathname } from 'next/navigation'

export default function ClientLayout({ children }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/signup' || pathname === '/login'

  return (
    <ApplicationProvider>
      {children}
    </ApplicationProvider>
  )
}
