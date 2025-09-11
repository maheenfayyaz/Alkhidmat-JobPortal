'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8000/api/adminauth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        // Store token and authentication status
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('adminUser', JSON.stringify(data.user))
        router.push('/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please check if the backend is running.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Hero image and text */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="mb-8">
            <Image
              src="https://cdn.builder.io/api/v1/image/assets%2F8edf673ed62c477ebd9bb6c681af3f32%2F07943ec965be4dcfae129ea37ee2f39c?format=webp&width=400"
              alt="Team collaboration"
              width={400}
              height={300}
              className="rounded-lg"
            />
          </div>
          <h1 className="text-4xl font-bold mb-6">
            Serving humanity with compassion and dedication.
          </h1>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Log In
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-500 hover:text-blue-600 font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
