'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SignupPage() {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:8000/api/adminauth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullname, email, password, confirmPassword })
      })

      const data = await response.json()

      console.log('Signup response data:', data)  // Debug log

      if (response.ok) {
        // Store token and authentication status
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('adminUser', JSON.stringify(data.user))
        console.log('Token stored, navigating to dashboard')  // Debug log
        router.push('/dashboard')
      } else {
        setError(data.error || 'Signup failed')
      }
    } catch (err) {
      setError('Network error. Please check if the backend is running.')
      console.error('Signup error:', err)
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

      {/* Right side - Signup form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your password must be at least 8 characters, contain one capital letter, and one special character.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="fullname"
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Full Name"
                className="input-field"
                required
              />
            </div>

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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="input-field"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
