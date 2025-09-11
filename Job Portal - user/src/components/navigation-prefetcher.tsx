"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const PREFETCH_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/jobs',
  '/profile',
  '/login',
  '/signup'
]

export function NavigationPrefetcher() {
  const router = useRouter()

  useEffect(() => {
    // Prefetch all main routes
    PREFETCH_ROUTES.forEach(route => {
      router.prefetch(route)
    })
  }, [router])

  return null
}
