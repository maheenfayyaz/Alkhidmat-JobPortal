'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ApplicationContext = createContext()

export function ApplicationProvider({ children }) {
  const [candidates, setCandidates] = useState([])
  const [dashboardStats, setDashboardStats] = useState(null)
  const [totalApplications, setTotalApplications] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [adminToken, setAdminToken] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Load token from localStorage on mount
    const token = localStorage.getItem('adminToken')
    console.log('ApplicationContext token:', token)  // Debug log
    if (token) {
      setAdminToken(token)
    } else {
      // Delay redirect to allow token to be set if in signup flow
      setTimeout(() => {
        router.push('/login')
      }, 500)
    }
  }, [router])

  // Helper to handle logout
  const logout = () => {
    localStorage.removeItem('adminToken')
    setAdminToken(null)
    router.push('/login')
  }

  // Fetch candidates from backend API
  const fetchCandidates = async () => {
    if (!adminToken) {
      setError('Not authenticated')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:8000/api/admin/candidates', {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      })
      if (res.status === 401) {
        logout()
        return
      }
      if (!res.ok) {
        throw new Error('Failed to fetch candidates')
      }
      const data = await res.json()
      // Map backend candidate data to frontend expected format
      const mappedCandidates = (data.candidates || []).map(c => ({
        ...c,
        status: c.status !== undefined && c.status !== null ? c.status : 'N/A',
        fullName: c.fullName || c.fullname || c.name || 'Unknown',
        submissionDate: c.submissionDate || c.date || null,
      }))
      setCandidates(mappedCandidates)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch dashboard stats from backend API
  const fetchDashboardStats = async () => {
    if (!adminToken) {
      setError('Not authenticated')
      return
    }
    try {
      const res = await fetch('http://localhost:8000/api/admin/dashboard/stats', {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      })
      if (res.status === 401) {
        logout()
        return
      }
      if (!res.ok) {
        throw new Error('Failed to fetch dashboard stats')
      }
      const data = await res.json()
      setDashboardStats(data)
    } catch (err) {
      setError(err.message)
    }
  }

  // Fetch total applications count from backend API
  const fetchTotalApplications = async () => {
    if (!adminToken) {
      setError('Not authenticated')
      return
    }
    try {
      const res = await fetch('http://localhost:8000/api/admin/applications/count', {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      })
      if (res.status === 401) {
        logout()
        return
      }
      if (!res.ok) {
        throw new Error('Failed to fetch total applications count')
      }
      const data = await res.json()
      if (data && data.totalApplications !== undefined) {
        setTotalApplications(data.totalApplications)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  // Fetch candidate details by ID from backend API and update local state
  const fetchCandidateDetails = async (candidateId) => {
    if (!adminToken) {
      setError('Not authenticated')
      return
    }
    try {
      const res = await fetch(`http://localhost:8000/api/admin/candidates/${candidateId}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      })
      if (res.status === 401) {
        logout()
        return
      }
      if (!res.ok) {
        throw new Error('Failed to fetch candidate details')
      }
      const data = await res.json()
      if (data && data.candidate) {
        // Update candidates state with the fetched candidate details
        setCandidates(prevCandidates => {
          const otherCandidates = prevCandidates.filter(c => c._id !== candidateId)
          return [...otherCandidates, data.candidate]
        })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  // Get candidate details from local state by ID
  const getCandidateDetails = (candidateId) => {
    return candidates.find(c => c._id === candidateId) || null
  }

  // Get candidate note from local state or backend (placeholder implementation)
  const getCandidateNote = (candidateId) => {
    // For now, return empty string or implement fetching notes if stored separately
    return ''
  }

  // Search candidates by name locally
  const searchCandidates = (searchTerm) => {
    if (!searchTerm.trim()) return []
    return candidates
      .filter(candidate =>
        (candidate.fullName || candidate.fullname || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(candidate => ({
        ...candidate,
        id: candidate._id
      }))
  }

  // Login function to save token and redirect
  const login = (token) => {
    localStorage.setItem('adminToken', token)
    setAdminToken(token)
    router.push('/dashboard')
  }

  const value = {
    candidates,
    dashboardStats,
    totalApplications,
    loading,
    error,
    fetchCandidates,
    fetchDashboardStats,
    fetchTotalApplications,
    fetchCandidateDetails,
    getCandidateDetails,
    getCandidateNote,
    searchCandidates,
    login,
    logout,
    adminToken,
  }

  // Fetch data on token change
  useEffect(() => {
    if (adminToken) {
      fetchCandidates()
      fetchDashboardStats()
      fetchTotalApplications()
    }
  }, [adminToken])

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  )
}

export function useApplicationContext() {
  const context = useContext(ApplicationContext)
  if (!context) {
    throw new Error('useApplicationContext must be used within an ApplicationProvider')
  }
  return context
}
