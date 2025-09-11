'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  Search,
  FileText,
  Download,
  Upload,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react'
// import Image from 'next/image'
import { ApplicationProvider } from '../context/ApplicationContext'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Search Candidate', href: '/dashboard/search', icon: Search },
  { name: 'All Applications', href: '/dashboard/cvs', icon: FileText },
  { name: 'Download CVs', href: '/dashboard/cvs', icon: Download },
  { name: 'Create Jobs', href: '/dashboard/create-jobs', icon: Upload },
  { name: 'Manage Jobs', href: '/dashboard/admin-jobs', icon: FileText },
  { name: 'Profile/Settings', href: '/dashboard/profile', icon: User },
]

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated')
    if (!auth) {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    router.push('/login')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent navigation={navigation} pathname={pathname} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent navigation={navigation} pathname={pathname} onLogout={handleLogout} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ navigation, pathname, onLogout }) {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
<img 
  src='/logo.png' 
  alt="Logo" 
  width={50} 
 
/>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">AL khidmat</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 bg-white space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                    ? 'bg-gray-100 text-gray-900 border-r-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <button
          onClick={onLogout}
          className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 w-full"
        >
          <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
          Logout
        </button>
      </div>
    </div>
  )
}
